import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_ARTICLE} from "../../graphql/queries.js";
import {useParams, Link, useNavigate} from "react-router-dom";
import CommentsOnArticle from "../comments/commentsOnArticle.jsx";
import {useAuth} from "../../AuthContext.jsx";
import {ADD_LAST_READ_ARTICLE, TOGGLE_ARTICLE_FAVORITE} from "../../graphql/mutations.js";
import {useTranslation} from "react-i18next";

const Article = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {id} = useParams();
    const {user} = useAuth();
    const [isAuthor, setIsAuthor] = useState(false);

    const {loading, error, data} = useQuery(GET_ARTICLE, {variables: {id}});

    const [ToogleFavorite, {loading: favoriteLoading, error: favoriteError}] = useMutation(TOGGLE_ARTICLE_FAVORITE, {
        onCompleted: (data) => {
            if (data && data.toggleArticleFavorite) {
                data.article.isFavorite = data.toggleArticleFavorite.isFavorite;
            }
        }
    })

    const [saveLastReadArticle, {loading: saveLoading, error: saveError}] = useMutation(ADD_LAST_READ_ARTICLE)

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

    useEffect(() => {
        if (data && data.article) {
            if(user) {
                saveLastReadArticle({variables: {articleId: data.article.id}})
            }
        }
    }, [data?.article?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-900 text-2xl font-serif">{t('article.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-red-600 text-2xl font-serif">Error: {error.message}</p>
            </div>
        );
    }

    const article = data?.article;

    if (!article) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center text-gray-900 font-serif">
                    <p className="text-2xl">{t('article.notFound')}</p>
                    <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">{t('article.backToHome')}</Link>
                </div>
            </div>
        )
    }

    const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleFavorite = async () => {
        try {
            await ToogleFavorite({variables: {articleId: article.id}})
        } catch (error) {
            console.error('Error toggling favorite:', error)
        }
    }

    return (
        <div className="py-8 px-4 sm:px-2 lg:px-2">
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 shadow-md border border-gray-200 rounded-lg">
                <div
                    className="text-left text-gray-500 text-sm font-medium font-sans uppercase tracking-wider mb-4 flex items-center flex-wrap">
                    {article.categories.map((category, index) => (
                        <React.Fragment key={category.id}>
                            <span>{category.name}</span>
                            {index < article.categories.length - 1 &&
                                <span className="mx-2 text-gray-300 font-bold">&bull;</span>}
                        </React.Fragment>
                    ))}
                </div>

                <div
                    className="text-gray-900 text-4xl md:text-5xl font-bold font-sans capitalize mb-6">
                    {article.title}
                </div>

                <div className="text-gray-600 text-base font-medium font-sans capitalize mb-8 border-b border-gray-100 pb-6">
                    <div className="mb-2"><Link className="text-indigo-600 hover:text-indigo-800 transition-colors" to={`/author/${article.author.name}`}>{t('article.by')} {article.author.name}</Link></div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{t('article.publishedOn')} {formattedDate}</span>
                        {user && (
                            <span onClick={handleFavorite}
                                  className={`text-3xl cursor-pointer transition-colors ${article.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-gray-400"}`}>
                            {article.isFavorite ? "★" : "☆"}
                        </span>
                        )}
                    </div>
                </div>

                <div
                    className="text-justify text-gray-800 text-lg font-normal font-serif leading-relaxed break-words whitespace-normal [&_p]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-gray-900 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:mb-6 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_.ql-resize-style-left]:float-left [&_.ql-resize-style-left]:mr-6 [&_.ql-resize-style-left]:mb-4 [&_.ql-resize-style-right]:float-right [&_.ql-resize-style-right]:ml-6 [&_.ql-resize-style-right]:mb-4 [&_.ql-resize-style-center]:block [&_.ql-resize-style-center]:mx-auto [&_.ql-resize-style-center]:text-center [&_.ql-resize-style-full]:w-full [&_pre]:whitespace-pre-wrap [&_pre]:bg-gray-50 [&_pre]:border [&_pre]:border-gray-200 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:text-sm [&_pre]:font-mono [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify [&_.ql-align-left]:text-left"
                    dangerouslySetInnerHTML={{__html: article.content.replace(/&nbsp;/g, ' ')}}
                />

                {isAuthor && (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={redirectToEdit}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {t('article.editArticle')}
                        </button>
                    </div>
                )}
                <CommentsOnArticle comments={article.comments} articleId={article.id}/>
            </div>
        </div>
    )
}

export default Article;
