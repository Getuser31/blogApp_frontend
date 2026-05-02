import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import {GET_CATEGORIES, GET_LAST_ARTICLES} from "../../graphql/queries.js";
import {Link, useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeroBanner } from "../HeroBanner.jsx";
import { MagazineGrid } from "./MagazineGrid.jsx";

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

const HomePage = ({ categoryId }) => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
    const [activeTopic, setActiveTopic] = useState("All");
    const { loading, error, data } = useQuery(GET_LAST_ARTICLES, {
        variables: { category_id: selectedCategory || undefined },
    });
    const { data: categoriesData } = useQuery(GET_CATEGORIES);
    const navigate = useNavigate();

    const categories = categoriesData?.getCategories || [];
    const tags = ["All", ...categories.map((c) => c.name)];

    useEffect(() => {
        if (categoryId) setSelectedCategory(categoryId);
    }, [categoryId]);

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
        } else {
            const cat = categories.find((c) => c.name === tag);
            if (cat) setSelectedCategory(cat.id);
        }
    };

    const handleReadMore = (article) => {
        navigate(`/article/${article.id}`);
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

    const articles = data?.publishedLastArticles?.articles ?? [];
    const hasMore = data?.publishedLastArticles?.hasMore ?? false;
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

            {hasMore && (
                <div className="flex justify-end pb-16 pr-6">
                    <Link
                        to={`/latestArticles${selectedCategory ? `?category_id=${selectedCategory}` : ''}`}
                        className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-300"
                    >
                        <span>Read More</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;
