import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ARTICLES, GET_CATEGORIES } from "../../graphql/queries.js";
import { useNavigate } from "react-router-dom";

const stripHtml = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};

const Articles = ({ categoryId }) => {
    const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
    const { loading, error, data, fetchMore, refetch } = useQuery(GET_ARTICLES, {
        variables: { page: 1, category_id: selectedCategory || undefined },
    });
    const { data: categoriesData } = useQuery(GET_CATEGORIES);

    const navigate = useNavigate();

    useEffect(() => {
        if (categoryId) {
            setSelectedCategory(categoryId);
            refetch({ page: 1, category_id: categoryId });
        }
    }, [categoryId, refetch]);

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center py-20 font-sans">
                <div className="text-center">
                    <p className="text-white">Loading articles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500 font-sans">
                <p>Error loading articles: {error.message}</p>
            </div>
        );
    }

    const articles = data?.publishedArticles?.data ?? [];

    const sortedArticles = [...articles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const handleArticleClick = (id) => {
        navigate(`/article/${id}`);
    };

    const handleLoadMore = () => {
        if (data?.publishedArticles?.paginatorInfo?.hasMorePages) {
            fetchMore({
                variables: {
                    page: data.publishedArticles.paginatorInfo.currentPage + 1,
                    category_id: selectedCategory || undefined
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
    }

    const handleCategoryFilter = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        refetch({ page: 1, category_id: categoryId || undefined });
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Filter By Categories</h3>
                <select
                    onChange={handleCategoryFilter}
                    value={selectedCategory}
                    className="p-2 border rounded bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Categories</option>
                    {categoriesData?.getCategories?.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedArticles.map((article) => (
                    <div
                        key={article.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                        onClick={() => handleArticleClick(article.id)}
                    >
                        <img
                            className="w-full h-48 object-cover"
                            src={article.images[0]?.path || "https://placehold.co/400x300"}
                            alt={article.title}
                        />
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                            <p className="text-gray-700 text-sm">
                                {stripHtml(article.content).substring(0, 150)}...
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {data?.publishedArticles?.paginatorInfo?.hasMorePages && (
                <button
                    className="block mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={handleLoadMore}
                >
                    Load More
                </button>
            )}
        </div>
    );
};

export default Articles;