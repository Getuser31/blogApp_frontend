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
                    <p className="text-gray-600">Loading articles...</p>
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

    const handleCategoryFilter = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        refetch({ page: 1, category_id: categoryId || undefined });
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

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Filter By Categories</h3>

                {/* Dropdown on mobile */}
                <div className="md:hidden relative">
                    <select
                        onChange={handleCategoryFilter}
                        value={selectedCategory}
                        className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-3 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm leading-tight cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categoriesData?.getCategories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Pills on desktop */}
                <div className="hidden md:block">
                    {categoriesData?.getCategories?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setSelectedCategory("");
                                    refetch({ page: 1, category_id: undefined });
                                }}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    selectedCategory === ""
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All Categories
                            </button>
                            {categoriesData?.getCategories?.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setSelectedCategory(category.id);
                                        refetch({ page: 1, category_id: category.id });
                                    }}
                                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                        selectedCategory === category.id
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedArticles.map((article) => (
                    <div
                        key={article.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
                        onClick={() => handleArticleClick(article.id)}
                    >
                        <img
                            className="w-full h-48 object-cover"
                            src={article.images[0]?.path || "https://placehold.co/400x300"}
                            alt={article.title}
                        />
                        <div className="p-6 flex flex-col flex-1">
                            <h2 className="text-xl font-bold mb-2 text-gray-900">{article.title}</h2>
                            <p className="text-gray-600 text-sm leading-relaxed flex-1">
                                {stripHtml(article.content).substring(0, 150)}...
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                                <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                <span className="text-indigo-600 font-medium">Read more &rarr;</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {data?.publishedArticles?.paginatorInfo?.hasMorePages && (
                <div className="mt-10 flex justify-center">
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleLoadMore}
                    >
                        Load More Articles
                    </button>
                </div>
            )}
        </div>
    );
};

export default Articles;
