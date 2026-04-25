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

    if (loading) return <p className="text-center mt-4 text-gray-600 font-medium">Loading...</p>
    if (error) return <p className="text-center mt-4 text-red-500 font-medium">Error: {error.message}</p>

    const handlePublish = async (articleId, publish) => {
        try {
            await mutateAsync({variables: {articleId, publish}});
        } catch (e) {
            console.error('Failed to publish article:', e);
        }
    }


    return (
        <div className="font-sans py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-5xl">
                <h1 className="text-3xl font-extrabold mb-8 text-gray-900 tracking-tight">Your Articles</h1>
                <div className="overflow-x-auto bg-white shadow-md border border-gray-200 rounded-xl">
                    <table className="min-w-full leading-normal">
                        <thead>
                        <tr>
                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                Date Published
                            </th>
                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {data.userArticles.articles.map(article => (
                            <tr key={article.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-5 bg-transparent text-sm">
                                    <Link to={`/article/${article.id}`} className="block">
                                        <p className="text-indigo-600 group-hover:text-indigo-800 transition-colors whitespace-no-wrap font-semibold text-base">{article.title}</p>
                                    </Link>
                                </td>
                                <td className="px-6 py-5 bg-transparent text-sm">
                                    <p className="text-gray-500 font-medium whitespace-no-wrap">{formatDate(article.created_at)}</p>
                                </td>
                                <td className="px-6 py-5 bg-transparent text-sm">
                                    <div className="flex items-center gap-3">
                                        <button
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${article.published ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                                            onClick={() => {handlePublish(article.id, !article.published)}}
                                        >
                                            <span
                                                className={`${article.published ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                                            />
                                        </button>
                                        <span className={`text-sm font-medium ${article.published ? 'text-green-600' : 'text-gray-500'}`}>
                                            {article.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {data.userArticles.articles.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 font-medium text-lg">You haven't written any articles yet.</p>
                            <Link to="/addArticle" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium">Write your first article &rarr;</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default userArticles;
