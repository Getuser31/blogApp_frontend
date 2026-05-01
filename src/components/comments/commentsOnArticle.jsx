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
        <div className="mt-12 border-t border-neutral-200 pt-8">
            <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-8">
                {t('commentsOnArticle.title', {count: commentsArray.length})}
            </h3>
            {commentsArray.length > 0 ? (
                commentsArray.map(comment => (
                    <div key={comment.id} className="mb-8 p-6 bg-neutral-100 rounded-lg">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold select-none">
                                    <span className="text-xl">{comment.user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                    <p className="text-base font-bold text-neutral-900">{comment.user.name}</p>
                                    <p className="text-xs text-neutral-400 font-medium">{new Date(comment.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="mt-3 text-neutral-700 text-sm leading-relaxed break-words whitespace-normal"
                                     dangerouslySetInnerHTML={{__html: comment.content.replace(/<br\/>/g, '<br>')}}></div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-100 mb-8">
                    <p className="text-neutral-500 text-sm">{t('commentsOnArticle.noComments')}</p>
                </div>
            )}
            {user && !formComment && (
                <button
                    className="mt-4 px-6 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded hover:bg-neutral-700 transition-colors w-full sm:w-auto"
                    onClick={handleCommentForm}
                >
                    {t('commentsOnArticle.leaveComment')}
                </button>
            )}
            {!user && (
                <div className="mt-8 p-4 bg-neutral-100 rounded-lg text-center">
                    <p className="text-neutral-600 text-sm font-medium">{t('commentsOnArticle.loginToComment')} <a href="/login" className="underline hover:text-neutral-900">{t('commentsOnArticle.login')}</a> {t('commentsOnArticle.toLeaveComment')}</p>
                </div>
            )}
            {formComment && <CommentForm articleId={articleId} addNewComment ={addNewComment}/>}
        </div>
    );
};

export default CommentsOnArticle;
