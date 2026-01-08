import React from "react";
import {useQuery} from "@apollo/client/react";
import {USER_DATA} from "../../graphql/queries.js";
import {useAuth} from "../../AuthContext.jsx";

const Card = ({ title, children }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg min-h-[474px] flex flex-col">
        <h2 className="text-2xl mb-6 font-normal">{title}</h2>
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

    if (loading || authLoading || !userData) {
        return <div className="min-h-screen bg-[#A17141] p-8 font-mono text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#A17141] p-8 font-mono">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Profile Card */}
                <Card title="Profile">
                    <div className="text-lg mb-8 flex-grow">
                        <p className="mb-4">Username: {userData.name}</p>
                        <p>Email: {userData.email}</p>
                    </div>
                    <div className="mt-auto">
                        <button className="bg-[#A17141] text-white px-6 py-3 text-lg hover:bg-[#8a6036] transition-colors w-full md:w-auto">
                            Update Password
                        </button>
                    </div>
                </Card>

                {/* Previously in... Card */}
                <Card title="Previously in...">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <p className="mb-2">last articles read:</p>
                            <ul className="list-none space-y-1">
                                {userData.lastArticlesRead?.map((article) => (
                                    <li key={article.id}>{article.title}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <p className="mb-2">Last comments:</p>
                            <ul className="list-none space-y-1">
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
                            <p className="mb-2">last articles Wrote:</p>
                            <ul className="list-none space-y-1">
                                {userData.articles?.map((article) => (
                                    <li key={article.id}>{article.title}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <p className="mb-2">Actual Draft articles:</p>
                            <ul className="list-none space-y-1">
                                {userData.draftArticles?.map((draft) => (
                                    <li key={draft.id}>{draft.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button className="bg-[#A17141] text-white px-4 py-3 text-lg hover:bg-[#8a6036] transition-colors flex-1 text-center">
                            Show All Articles
                        </button>
                        <button className="bg-[#A17141] text-white px-4 py-3 text-lg hover:bg-[#8a6036] transition-colors flex-1 text-center">
                            Show All Drafts
                        </button>
                    </div>
                </Card>

                <Card title="Your Favorite articles">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <p className="mb-2">last articles added to favorites:</p>
                            <ul className="list-none space-y-1">
                                {userData.articles?.map((article) => (
                                    <li key={article.id}>{article.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </Card>

            </div>
        </div>
    )
}

export default UserProfile;