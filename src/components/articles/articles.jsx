import React from "react"
import {useQuery} from "@apollo/client/react";
import {GET_ARTICLES} from "../../graphql/queries.js";
import {useNavigate} from "react-router-dom";

const Articles = ({handleLogout}) => {
    const {loading, error, data} = useQuery(GET_ARTICLES);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6 text-white font-sans">
                <div className="text-center">
                    <p>Loading data from the API...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6 text-red-400 font-sans">
                <p>Error: {error.message}</p>
            </div>
        );
    }

    const articles = data?.articles?.data ?? [];

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-8">
            <div className="container mx-auto flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-indigo-400">Posts</h1>
                <button
                    onClick={() => navigate("/admin")}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                    Admin
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Logout
                </button>
            </div>

            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-gray-800 rounded-xl p-6 shadow-lg transform transition-transform duration-300 hover:scale-105"
                        >
                            <h2 className="text-xl font-bold mb-2 text-indigo-300 capitalize">
                                {article.title}
                            </h2>
                            <p className="text-sm text-gray-400">{article.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Articles;