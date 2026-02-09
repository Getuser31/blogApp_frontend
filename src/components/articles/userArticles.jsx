import React from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {USER_ARTICLES} from "../../graphql/queries.js";
import {TOOGLE_PUBLISH_STATUS} from "../../graphql/mutations.js";
import {Link} from "react-router-dom";

const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(Number(timestamp) || timestamp);
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(',', '');
};

const userArticles = () => {
    const {loading, error, data} = useQuery(USER_ARTICLES)

    const [mutateAsync, {loading: mutateLoading, error: mutateError}] = useMutation(TOOGLE_PUBLISH_STATUS)

    if (loading) return <p className="text-center mt-4 bg-[#A17141] text-gray-600">Loading...</p>
    if (error) return <p className="text-center mt-4 bg-[#A17141] text-red-500">Error: {error.message}</p>

    const handlePublish = async (articleId, publish) => {
        try {
            await mutateAsync({variables: {articleId, publish}});
        } catch (e) {
            console.error('Failed to publish article:', e);
        }
    }


    return (
        <div className="bg-[#A17141] font-mono">
            <div className="container mx-auto bg-[#A17141] px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-white">Published Articles</h1>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full leading-normal">
                        <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date Published
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.userArticles.articles.map(article => (
                            <tr key={article.id} className="hover:bg-gray-50">
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link to={`/article/${article.id}`}><p className="text-gray-900 whitespace-no-wrap font-medium">{article.title}</p></Link>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-600 whitespace-no-wrap">{formatDate(article.created_at)}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${article.published ? 'bg-green-500' : 'bg-red-500'}`}
                                        onClick={() => {handlePublish(article.id, !article.published)}}
                                    >
                                        <span
                                            className={`${article.published ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default userArticles;