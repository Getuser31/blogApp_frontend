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
        <form onSubmit={handleSubmit} className="mt-8 bg-neutral-100 p-6 rounded-lg">
            <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4">{t('commentForm.title')}</h3>
            <div>
                <label htmlFor="comment" className="sr-only">{t('commentForm.comment')}</label>
                <textarea
                    id="comment"
                    rows="4"
                    className="w-full px-4 py-3 border border-neutral-200 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors bg-white text-neutral-900 resize-y text-sm"
                    placeholder={t('commentForm.placeholder')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded hover:bg-neutral-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors">
                    {loading ? t('commentForm.submitting') : t('commentForm.postComment')}
                </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-600 font-medium bg-red-50 p-3 rounded border border-red-100">{t('commentForm.error')}</p>}
        </form>
    )
}

export default CommentForm;
