import React from "react";
import {useQuery} from "@apollo/client/react";
import {Link} from "react-router-dom";
import {GET_FAVORITE_ARTICLES} from "../../graphql/queries.js";

const FavoriteArticles = () => {
    const {loading, error, data} = useQuery(GET_FAVORITE_ARTICLES)

    const favoriteArticles = data?.getFavoriteArticles?.favoriteArticles;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#A17141] flex items-center justify-center">
                <p className="text-white text-2xl font-serif">Loading favorite articles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#A17141] flex items-center justify-center">
                <p className="text-red-200 text-2xl font-serif">Error: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#A17141] p-8 font-mono">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center font-serif">Your Favorite Articles</h1>
                
                {favoriteArticles && favoriteArticles.length > 0 ? (
                    <div className="grid gap-6">
                        {favoriteArticles.map((article) => (
                            <Link 
                                key={article.id} 
                                to={`/article/${article.id}`}
                                className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                            >
                                <h2 className="text-2xl font-bold text-[#A17141] mb-2">{article.title}</h2>
                                <p className="text-gray-600">Read more &rarr;</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-white text-xl">
                        <p>You haven't added any articles to your favorites yet.</p>
                        <Link to="/" className="inline-block mt-4 underline hover:text-gray-200">Browse Articles</Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FavoriteArticles;