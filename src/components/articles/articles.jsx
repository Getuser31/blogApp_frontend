import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ARTICLES, GET_CATEGORIES } from "../../graphql/queries.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroBanner } from "../Design/HeroBanner.jsx";
import { MagazineGrid } from "../Design/MagazineGrid.jsx";

const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};

const toDesignArticle = (article) => ({
    id: article.id,
    title: article.title,
    excerpt: stripHtml(article.content).substring(0, 150),
    category: article.categories?.[0]?.name || "",
    date: new Date(article.created_at).toLocaleDateString(),
    imageUrl: article.images?.[0]?.path || "",
    slug: article.id,
});

const Articles = ({ categoryId }) => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
    const [activeTopic, setActiveTopic] = useState("All");
    const { loading, error, data, fetchMore, refetch } = useQuery(GET_ARTICLES, {
        variables: { page: 1, category_id: selectedCategory || undefined },
    });
    const { data: categoriesData } = useQuery(GET_CATEGORIES);
    const navigate = useNavigate();

    const categories = categoriesData?.getCategories || [];
    const tags = ["All", ...categories.map((c) => c.name)];

    useEffect(() => {
        if (categoryId) {
            setSelectedCategory(categoryId);
            refetch({ page: 1, category_id: categoryId });
        }
    }, [categoryId, refetch]);

    // Sync the active banner chip when categories load and a categoryId prop is set
    useEffect(() => {
        if (!categoryId || categories.length === 0) return;
        const cat = categories.find((c) => c.id === categoryId);
        if (cat) setActiveTopic(cat.name);
    }, [categoryId, categories]);

    const handleTagClick = (tag) => {
        setActiveTopic(tag);
        if (tag === "All") {
            setSelectedCategory("");
            refetch({ page: 1, category_id: undefined });
        } else {
            const cat = categories.find((c) => c.name === tag);
            if (cat) {
                setSelectedCategory(cat.id);
                refetch({ page: 1, category_id: cat.id });
            }
        }
    };

    const handleReadMore = (article) => {
        navigate(`/article/${article.id}`);
    };

    const handleLoadMore = () => {
        if (data?.publishedArticles?.paginatorInfo?.hasMorePages) {
            fetchMore({
                variables: {
                    page: data.publishedArticles.paginatorInfo.currentPage + 1,
                    category_id: selectedCategory || undefined,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        publishedArticles: {
                            ...fetchMoreResult.publishedArticles,
                            data: [
                                ...prev.publishedArticles.data,
                                ...fetchMoreResult.publishedArticles.data,
                            ],
                        },
                    };
                },
            });
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center py-20 font-sans">
                <p className="text-gray-600">{t('articles.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500 font-sans">
                <p>{t('articles.errorLoading')}: {error.message}</p>
            </div>
        );
    }

    const articles = data?.publishedArticles?.data ?? [];
    const sortedArticles = [...articles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const designArticles = sortedArticles.map(toDesignArticle);

    const featured = designArticles[0] ?? null;
    const latest = designArticles.slice(1);

    return (
        <div>
            <HeroBanner
                tags={tags}
                activeTopic={activeTopic}
                onTagClick={handleTagClick}
            />

            {designArticles.length === 0 ? (
                <div className="max-w-7xl mx-auto px-6 py-20 text-center text-neutral-400">
                    <p className="text-lg font-medium">{t('menu.searchNoResults')}</p>
                </div>
            ) : (
                <MagazineGrid
                    featured={featured}
                    latest={latest}
                    onReadMore={handleReadMore}
                />
            )}

            {data?.publishedArticles?.paginatorInfo?.hasMorePages && (
                <div className="mb-10 flex justify-center">
                    <button
                        className="bg-neutral-900 hover:bg-neutral-700 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                        onClick={handleLoadMore}
                    >
                        {t('articles.loadMore')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Articles;
