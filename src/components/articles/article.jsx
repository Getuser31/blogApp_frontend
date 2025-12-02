import React from "react";
import {useQuery} from "@apollo/client/react";
import {GET_ARTICLE} from "../../graphql/queries.js";
import {useParams, Link} from "react-router-dom";
import {useAuth} from "../../AuthContext.jsx";

const Article = () => {
    const {id} = useParams();
    const {loading, error, data} = useQuery(GET_ARTICLE, {variables: {id}});
    const {user} = useAuth()

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6 text-white font-sans">
                <div className="text-center">
                    <p>Loading article...</p>
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

    const article = data?.article;

    if (!article) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6 text-white font-sans">
                <div className="text-center">
                    <p>Article not found.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-8">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8">
                    <Link to="/articles" className="text-indigo-400 hover:text-indigo-300">
                        &larr; Back to Articles
                    </Link>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400 capitalize">{article.title}</h1>
                        {user && user.role?.toUpperCase() === 'ADMIN' && (
                            <Link to={`/admin/edit/${article.id}`}
                                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md font-semibold">
                                Edit
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mb-8">
                        {article.categories.map((category, index) => (
                            <React.Fragment key={category.id}>
                                <span className="ml-2 bg-gray-700 px-2 py-1 rounded-md">{category.name}</span>
                                {index < article.categories.length - 1 && <span className="mx-2">&bull;</span>}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mb-8">
                        <p>By {article.author.name}</p>
                        <span className="mx-2">&bull;</span>
                        <p>{new Date(article.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="prose prose-invert max-w-none text-lg">
                        <p>{article.content}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Article;