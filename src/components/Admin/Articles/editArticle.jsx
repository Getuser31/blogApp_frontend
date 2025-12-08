import React from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_ARTICLE} from "../../../graphql/queries.js";
import Loading from "../../../utils/loading.jsx";
import Error from "../../../utils/error.jsx";
import {Link, useParams, useNavigate} from "react-router-dom";
import {EDIT_ARTICLE} from "../../../graphql/mutations.js";

const EditArticle = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {loading, error, data} = useQuery(GET_ARTICLE, {variables: {id}});

    const [editArticle] = useMutation(EDIT_ARTICLE, {
        onCompleted: () => {
            navigate(`/article/${id}`);
        },
        onError: (error) => {
            console.error("Error editing article", error);
        }
    });

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return <Error error={error}/>
    }

    const article = data?.article ?? {};

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const content = formData.get('content');
        if (!title || !content) {
            return;
        }
        editArticle({variables: {id, title, content}});
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-8">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8">
                    <Link to="/articles" className="text-indigo-400 hover:text-indigo-300">
                        &larr; Back to Articles
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            name="title"
                            defaultValue={article.title}
                            className="text-4xl md:text-5xl font-extrabold text-indigo-400 capitalize bg-transparent w-full focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mb-8">
                        <p>By {article.author.name}</p>
                        <span className="mx-2">&bull;</span>
                        <p>{new Date(article.created_at).toLocaleDateString()}</p>
                    </div>
                    <textarea
                        name="content"
                        defaultValue={article.content}
                        className="w-full bg-transparent text-lg text-gray-300 focus:outline-none"
                        rows="15"
                    />
                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {article.images.map((image) => {
                        return <img key={image.id} src={image.path} alt={image.path}
                                    className="w-full h-auto rounded-lg shadow-lg"/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default EditArticle;