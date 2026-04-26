import React, {useState} from "react";
import {useAuth} from "../../AuthContext.jsx";
import CommentForm from "./commentForm.jsx";
import {useTranslation} from "react-i18next";

const CommentsOnArticle = ({ comments, articleId }) => {
    const {t} = useTranslation();
    const {user} = useAuth();
    const [formComment, setFormComment] = useState(false)
    const [formComments, setComments] = useState([]);
    const commentsArray = Array.isArray(comments) ? comments : (comments ? [comments] : []);

    const handleCommentForm = () => setFormComment(!formComment);

    const addNewComment = (newComment) => {
        setComments([...commentsArray, newComment]);
    }

    return (
        <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-3xl font-bold font-sans text-gray-900 mb-8">{t('commentsOnArticle.title', {count: commentsArray.length})}</h2>
            {commentsArray.length > 0 ? (
                commentsArray.map(comment => (
                    <div key={comment.id} className="space-y-8 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                    <span className="text-xl font-bold text-indigo-700">{comment.user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                    <p className="text-base font-bold text-gray-900 font-sans">{comment.user.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">{new Date(comment.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="mt-3 text-gray-700 font-serif text-base leading-relaxed break-words whitespace-normal"
                                     dangerouslySetInnerHTML={{__html: comment.content.replace(/<br\/>/g, '<br>')}}></div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 mb-8">
                    <p className="text-gray-600 font-medium">{t('commentsOnArticle.noComments')}</p>
                </div>
            )}
            {user && !formComment && (
                <button
                    className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-full sm:w-auto"
                    onClick={handleCommentForm}
                >
                    {t('commentsOnArticle.leaveComment')}
                </button>
            )}
            {!user && (
                 <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-center">
                    <p className="text-indigo-800 font-medium">{t('commentsOnArticle.loginToComment')} <a href="/login" className="underline hover:text-indigo-900">{t('commentsOnArticle.login')}</a> {t('commentsOnArticle.toLeaveComment')}</p>
                 </div>
            )}
            {formComment && <CommentForm articleId={articleId} addNewComment ={addNewComment}/>}
        </div>
    );
};

export default CommentsOnArticle;
