import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client/react";
import {GET_ARTICLE} from "../../graphql/queries.js";
import {useParams, Link, useNavigate} from "react-router-dom";
import CommentsOnArticle from "../comments/commentsOnArticle.jsx";
import {useAuth} from "../../AuthContext.jsx";

const Article = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {user} = useAuth();
    const [isAuthor, setIsAuthor] = useState(false);

    const {loading, error, data} = useQuery(GET_ARTICLE, {variables: {id}});

    const redirectToEdit = () => {
        navigate(`/edit/${id}`);
    }

    useEffect(() => {
        if (data && data.article && user) {
            if (data.article.author.id === user.id) {
                setIsAuthor(true);
            }
        }
    }, [data, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#A17141] flex items-center justify-center">
                <p className="text-white text-2xl font-serif">Loading article...</p>
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

    const article = data?.article;

    if (!article) {
        return (
            <div className="min-h-screen bg-[#A17141] flex items-center justify-center">
                <div className="text-center text-white font-serif">
                    <p className="text-2xl">Article not found.</p>
                    <Link to="/" className="hover:underline mt-4 inline-block">&larr; Back to Home</Link>
                </div>
            </div>
        )
    }

    const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-[#A17141]">
            <div className="py-8 px-4 sm:px-2 lg:px-2">
                <div className="max-w-6xl mx-auto bg-stone-200 p-6 sm:p-10">
                    <div className="text-left text-stone-400 text-xl font-normal font-['Inter'] mb-6 flex items-center flex-wrap">
                        {article.categories.map((category, index) => (
                            <React.Fragment key={category.id}>
                                <span>{category.name}</span>
                                {index < article.categories.length - 1 && <span className="mx-2 font-bold">&bull;</span>}
                            </React.Fragment>
                        ))}
                    </div>

                    <div
                        className="text-black text-4xl md:text-5xl font-normal font-['Ubuntu_Condensed'] capitalize mb-6">
                        {article.title}
                    </div>

                    <div className="text-stone-400 text-lg font-normal font-serif capitalize mb-8">
                        By {article.author.name}<br/>
                        Published on {formattedDate}
                    </div>

                    {article.images && article.images.length > 0 && (
                        <div className="mb-8 flex justify-center">
                            <img className="max-w-full h-auto" src={article.images[0].path} alt={article.title}/>
                        </div>
                    )}

                    <div className="text-justify text-black text-lg font-normal font-serif leading-relaxed">
                        {article.content}
                    </div>

                    {article.images && article.images.length > 1 && (
                        <div className="mt-12">
                            <h2 className="text-black text-3xl font-['Ubuntu_Condensed'] mb-4">Gallery</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {article.images.slice(1).map((image) => (
                                    <div key={image.id} className="flex justify-center items-center" style={{maxHeight: '400px', maxWidth: '650px'}}>
                                        <img
                                            src={image.path}
                                            alt={image.path}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {isAuthor && (
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={redirectToEdit}
                                className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                                Edit
                            </button>
                        </div>
                    )}
                    <CommentsOnArticle comments={article.comments} articleId={article.id}/>
                </div>
            </div>
        </div>
    )
}

export default Article;