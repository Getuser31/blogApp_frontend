import React from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_AUTHOR_PROFILE} from "../../graphql/queries";
import formatDate from "../../utils/formatDate.js";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const AuthorProfile = () => {
    const {t} = useTranslation();
    const authorName = useParams();

    const {loading, error, data, fetchMore} = useQuery(GET_AUTHOR_PROFILE, {variables: {author: authorName.author, page: 1}})
    if (loading) return <p className="text-gray-600 text-center py-20 font-medium">{t('authorProfile.loading')}</p>;
    if (error) return <p className="text-red-500 text-center py-20 font-medium">Error: {error.message}</p>;
    const authorProfile = data.userByName;

    const handleLoadMore = () => {
        if (authorProfile?.paginatedArticles?.paginatorInfo?.hasMorePages) {
            fetchMore({
                variables: {
                    page: authorProfile.paginatedArticles.paginatorInfo.currentPage + 1
                },
                updateQuery: (prev, {fetchMoreResult}) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        userByName: {
                            ...prev.userByName,
                            paginatedArticles: {
                                ...fetchMoreResult.userByName.paginatedArticles,
                                data: [
                                    ...prev.userByName.paginatedArticles.data,
                                    ...fetchMoreResult.userByName.paginatedArticles.data
                                ]
                            }
                        }
                    }
                }
            })
        }
    }
    return(
        <>
            <div className="py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-4xl mx-auto p-8 bg-white shadow-md border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-6 mb-10 pb-8 border-b border-gray-100">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200 shadow-sm text-3xl font-bold text-indigo-700">
                            {authorProfile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{authorProfile.name}</h1>
                            <p className="text-gray-500 font-medium mt-1">{t('authorProfile.memberSince')} {formatDate(authorProfile.created_at)}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('authorProfile.publishedArticles')}</h2>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">{t('authorProfile.title')}</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">{t('authorProfile.datePublished')}</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {authorProfile.paginatedArticles.data.map((article, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition duration-150 group">
                                    <td className="py-4 px-6">
                                        <Link to={`/article/${article.id}`} className="text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors">
                                            {article.title}
                                        </Link>
                                    </td>
                                    <td className="py-4 px-6 text-gray-500 text-sm font-medium">{formatDate(article.created_at)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {authorProfile?.paginatedArticles?.paginatorInfo?.hasMorePages && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-8 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleLoadMore}
                                >
                                    {t('authorProfile.loadMore')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthorProfile;
