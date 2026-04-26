import React from "react";
import {useQuery} from "@apollo/client/react";
import {Link} from "react-router-dom";
import {GET_FAVORITE_ARTICLES} from "../../graphql/queries.js";
import {useTranslation} from "react-i18next";

const FavoriteArticles = () => {
    const {t} = useTranslation();
    const {loading, error, data} = useQuery(GET_FAVORITE_ARTICLES)

    const favoriteArticles = data?.getFavoriteArticles?.favoriteArticles;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 font-sans">
                <p className="text-gray-600 text-lg font-medium">{t('favoriteArticles.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20 font-sans">
                <p className="text-red-500 text-lg font-medium">Error: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">{t('favoriteArticles.title')}</h1>

                {favoriteArticles && favoriteArticles.length > 0 ? (
                    <div className="grid gap-6">
                        {favoriteArticles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/article/${article.id}`}
                                className="block bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{article.title}</h2>
                                <p className="text-indigo-600 font-medium text-sm flex items-center">
                                    {t('favoriteArticles.readArticle')}
                                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <p className="text-gray-600 text-lg font-medium mb-2">{t('favoriteArticles.noFavorites')}</p>
                        <p className="text-gray-500 mb-6">{t('favoriteArticles.noFavoritesSubtext')}</p>
                        <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                            {t('favoriteArticles.browseArticles')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FavoriteArticles;
