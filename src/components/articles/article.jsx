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
                <div className="max-w-3xl mx-auto bg-stone-200 p-6 sm:p-10 shadow-xl rounded-lg">
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
                            <img className="max-w-full h-auto rounded-md shadow-sm" src={article.images[0].path} alt={article.title}/>
                        </div>
                    )}

                    <div 
                        className="text-justify text-black text-lg font-normal font-serif leading-8 break-words whitespace-normal [&_p]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:border-stone-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-6 [&_img]:max-w-full [&_img]:h-auto [&_pre]:whitespace-pre-wrap [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {article.images && article.images.length > 1 && (
                        <div className="mt-12">
                            <h2 className="text-black text-3xl font-['Ubuntu_Condensed'] mb-4">Gallery</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {article.images.slice(1).map((image) => (
                                    <div key={image.id} className="flex justify-center items-center overflow-hidden rounded-md shadow-sm">
                                        <img
                                            src={image.path}
                                            alt={image.path}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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