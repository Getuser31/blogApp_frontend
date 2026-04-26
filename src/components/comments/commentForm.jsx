import React from "react";
import {ADD_COMMENT} from "../../graphql/mutations.js";
import {useMutation} from "@apollo/client/react";
import {GET_ARTICLE} from "../../graphql/queries.js";
import {useTranslation} from "react-i18next";

const CommentForm = ({articleId}) => {
    const {t} = useTranslation();
    const [comment, setComment] = React.useState('');

    const [addComment, {loading, error}] = useMutation(ADD_COMMENT, {
        onCompleted: (data) => {
            setComment(''); // Reset form on successful submission
        },
        onError: (error) => {
            console.error("Error adding comment:", error);
        }
        ,
        // Refetch the article query to get the updated comments list
        refetchQueries: [{ query: GET_ARTICLE, variables: { id: articleId } }]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = comment.trim();

        if (!content || !articleId) {
            return;
        }

        try {
            await addComment({
                variables: {
                    articleId: articleId,
                    content: content,
                }
            })
        } catch (err) {
            // Errors will be handled by the `onError` callback in useMutation
            console.error("Submission error:", err);
        }
    }
    return (
        <form onSubmit={handleSubmit} className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h2 className="text-xl font-bold font-sans text-gray-900 mb-4">{t('commentForm.title')}</h2>
            <div>
                <label htmlFor="comment" className="sr-only">{t('commentForm.comment')}</label>
                <textarea
                    id="comment"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-gray-900 resize-y"
                    placeholder={t('commentForm.placeholder')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
                    {loading ? t('commentForm.submitting') : t('commentForm.postComment')}
                </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md border border-red-100">{t('commentForm.error')}</p>}
        </form>
    )
}

export default CommentForm;
