import React from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_AUTHOR_PROFILE} from "../../graphql/queries";
import formatDate from "../../utils/formatDate.js";

const AuthorProfile = () => {
    const authorName = useParams();

    const {loading, error, data, fetchMore} = useQuery(GET_AUTHOR_PROFILE, {variables: {author: authorName.author, page: 1}})
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const authorProfile = data.userByName;
    console.log(authorProfile)


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
            <div className="min-h-screen bg-[#A17141] pt-10 pb-10">
                <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                            {authorProfile.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{authorProfile.name}</h1>
                            <p className="text-gray-500">Member since: {formatDate(authorProfile.created_at)}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Title</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-600">Date Published</th>
                            </tr>
                            </thead>
                            <tbody>
                            {authorProfile.paginatedArticles.data.map((article, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                                    <td className="py-3 px-4 text-gray-800 font-medium">{article.title}</td>
                                    <td className="py-3 px-4 text-gray-600">{formatDate(article.created_at)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {authorProfile?.paginatedArticles?.paginatorInfo?.hasMorePages && (
                            <button
                                className="block mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                                onClick={handleLoadMore}
                            >
                                Load More
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthorProfile;