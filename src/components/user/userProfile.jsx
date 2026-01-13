import React from "react";
import {useQuery} from "@apollo/client/react";
import {USER_DATA} from "../../graphql/queries.js";
import {useAuth} from "../../AuthContext.jsx";
import {Link} from "react-router-dom";

const Card = ({ title, children }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg min-h-[474px] flex flex-col">
        <h2 className="text-2xl mb-6 font-bold text-[#A17141]">{title}</h2>
        {children}
    </div>
);

const UserProfile = () => {
    const { user, loading: authLoading } = useAuth();

    const {loading, error, data} = useQuery(USER_DATA, {
        variables: {userId: user?.id},
        skip: authLoading || !user,
    });

    const userData = data?.getUserData;
    const favoriteArticles = userData?.favoriteArticles;
    const lastReadArticles = userData?.lastReadArticles;

    if (loading || authLoading || !userData) {
        return <div className="min-h-screen bg-[#A17141] p-8 font-mono text-white">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-[#A17141] p-8 font-mono text-white">Error: {error.message}</div>;
    }

    return (
        <div className="min-h-screen bg-[#A17141] p-8 font-mono">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Profile Card */}
                <Card title="Profile">
                    <div className="text-lg mb-8 flex-grow">
                        <p className="mb-4"><span className="font-semibold">Username:</span> {userData.name}</p>
                        <p><span className="font-semibold">Email:</span> {userData.email}</p>
                    </div>
                    <div className="mt-auto">
                        <button className="bg-[#A17141] text-white px-6 py-3 text-lg hover:bg-[#8a6036] transition-colors w-full md:w-auto rounded">
                            Update Password
                        </button>
                    </div>
                </Card>

                {/* Previously in... Card */}
                <Card title="Previously in...">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Last articles read:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {lastReadArticles.map((article) => (
                                  <Link key={article.id} to={`/article/${article.id}`}> <li key={article.id}>{article.title}</li></Link>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Last comments:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {userData.commentedArticles?.map((comment) => (
                                    <li key={comment.id}>{comment.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Your Writing Card 1 */}
                <Card title="Your writing">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Last articles wrote:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {userData.articles?.filter((article) => article.published).slice(0, 5).map((article) => (
                                    <li key={article.id}>{article.title}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Actual Draft articles:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {userData.articles?.filter((article) => !article.published).slice(0, 5).map((draft) => (
                                    <li key={draft.id}>{draft.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Link className="bg-[#A17141] text-white px-4 py-3 text-lg hover:bg-[#8a6036] transition-colors flex-1 text-center rounded"
                        to="/userArticles">
                            Show All Articles
                        </Link>
                    </div>
                </Card>

                <Card title="Your Favorite articles">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Last articles added to favorites:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {favoriteArticles?.slice(0, 5).map((article) => (
                                    <li><Link key={article.id} to={`/article/${article.id}`}>{article.title}</Link></li>
                                ))}
                            </ul>
                            {favoriteArticles?.length > 5 && (
                                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                    <Link className="bg-[#A17141] text-white px-4 py-3 text-lg hover:bg-[#8a6036] transition-colors flex-1 text-center rounded"
                                          to="/favoriteArticle">
                                        Show All Favorite Articles
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                </Card>

            </div>
        </div>
    )
}

export default UserProfile;