import React, {useState} from "react";
import {useAuth} from "../../AuthContext.jsx";
import CommentForm from "./commentForm.jsx";

const CommentsOnArticle = ({ comments, articleId }) => {
    const {user} = useAuth();
    const [formComment, setFormComment] = useState(false)
    const commentsArray = Array.isArray(comments) ? comments : (comments ? [comments] : []);

    const handleCommentForm = () => setFormComment(!formComment);

    const addNewComment = (newComment) => {
        setComments([...commentsArray, newComment]);
    }

    return (
        <div className="mt-12 border-t border-stone-300 pt-8">
            <h2 className="text-3xl font-['Ubuntu_Condensed'] mb-8">{commentsArray.length === 1 ? 'Comment' : 'Comments'}</h2>
            {commentsArray.length > 0 ? (
                commentsArray.map(comment => (
                    <div key={comment.id} className="space-y-8 mb-8">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-stone-300 flex items-center justify-center">
                                    <span className="text-xl font-bold text-stone-600">{comment.user.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline">
                                    <p className="text-base font-semibold text-black font-serif">{comment.user.name}</p>
                                    <p className="text-xs text-stone-500 ml-3">{comment.created_at}</p>
                                </div>
                                <div className="mt-2 text-black font-serif text-base leading-relaxed"
                                     dangerouslySetInnerHTML={{__html: comment.content.replace(/<br\/>/g, '<br>')}}></div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-black font-serif">No comments yet.</p>
            )}
            {user && !formComment && (
                <button
                    className="mt-4 px-4 py-2 bg-stone-800 text-white font-semibold rounded-lg shadow-md hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-opacity-75"
                    onClick={handleCommentForm}
                >
                    Leave a comment
                </button>
            )}
            {formComment && <CommentForm articleId={articleId} addNewComment ={addNewComment}/>}
        </div>
    );
};

export default CommentsOnArticle;