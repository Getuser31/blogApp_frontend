import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ARTICLES } from "../../graphql/queries.js";
import { useNavigate } from "react-router-dom";

const Articles = () => {
    const { loading, error, data } = useQuery(GET_ARTICLES);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 font-sans">
                <div className="text-center">
                    <p>Loading articles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 text-red-500 font-sans">
                <p>Error loading articles: {error.message}</p>
            </div>
        );
    }

    const articles = data?.articles?.data ?? [];

    const handleArticleClick = (id) => {
        navigate(`/article/${id}`);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                        onClick={() => handleArticleClick(article.id)}
                    >
                        <img
                            className="w-full h-48 object-cover"
                            src="https://placehold.co/400x300"
                            alt={article.title}
                        />
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                            <p className="text-gray-700 text-sm">
                                {article.content.substring(0, 150)}...
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Articles;