import React from "react";
import {useQuery} from "@apollo/client/react";
import {GET_ARTICLE} from "../../graphql/queries.js";
import {useParams} from "react-router-dom";

const Article = () =>  {
    const {id} = useParams();
    const {loading, error, data} = useQuery(GET_ARTICLE, {variables: {id}});

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
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold text-indigo-400 mb-4 capitalize">{article.title}</h1>
                <div className="prose prose-invert max-w-none">
                    <p>{article.content}</p>
                </div>
            </div>
        </div>
    )
}

export default Article;