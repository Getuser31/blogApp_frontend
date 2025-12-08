import React from "react";
import {ADD_COMMENT} from "../../graphql/mutations.js";
import {useMutation} from "@apollo/client/react";
import {GET_ARTICLE} from "../../graphql/queries.js";

const CommentForm = ({articleId}) => {
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
        <form onSubmit={handleSubmit} className="mt-6">
            <h2 className="text-xl font-semibold font-serif mb-4">Leave a Comment</h2>
            <div>
                <label htmlFor="comment" className="sr-only">Comment</label>
                <textarea
                    id="comment"
                    rows="4"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    placeholder="Write your comment here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading} className="mt-4 px-6 py-2 bg-stone-800 text-white font-semibold rounded-lg shadow-md hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-opacity-75 disabled:bg-stone-400 disabled:cursor-not-allowed">
                {loading ? 'Submitting...' : 'Submit Comment'}
            </button>
            {error && <p className="mt-2 text-red-600">Error: Could not submit your comment. Please try again.</p>}
        </form>
    )
}

export default CommentForm;