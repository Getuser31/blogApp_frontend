import React from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_ARTICLE} from "../../graphql/queries.js";
import Loading from "../../utils/loading.jsx";
import Error from "../../utils/error.jsx";
import {Link, useParams, useNavigate} from "react-router-dom";
import {DELETE_IMAGE, EDIT_ARTICLE} from "../../graphql/mutations.js";
import ImageUpload from "../Admin/Articles/ImageUpload.jsx";

const EditArticle = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = React.useState('');
    const {loading, error, data} = useQuery(GET_ARTICLE, {variables: {id}});

    const [editArticle] = useMutation(EDIT_ARTICLE, {
        onCompleted: () => {
            navigate(`/article/${id}`);
        },
        onError: (error) => {
            console.error("Error editing article", error);
        }
    });

    const [removeImage] = useMutation(DELETE_IMAGE, {
        update(cache, {data: {deleteImage}}) {
            cache.modify({
                id: cache.identify({__typename: 'Article', id: id}),
                fields: {
                    images(existingImages = [], {readField}) {
                        return existingImages.filter(
                            imageRef => readField('id', imageRef) !== deleteImage.id
                        );
                    }
                }
            });
        },
        onCompleted: () => {
            setMessage('Image deleted successfully')
        },
        onError: (error) => {
            console.error("Error deleting image", error);
            setMessage("Error deleting image")
        }
    })

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
        const images = formData.getAll('images');
        
        // Filter out empty files if any (sometimes empty file inputs produce one empty file)
        const validImages = images.filter(file => file.size > 0);

        if (!title || !content) {
            return;
        }
        
        const variables = {id, title, content};
        if (validImages.length > 0) {
            variables.images = validImages;
        }

        editArticle({variables});
    }

    const deleteImage = (imageId) => {
        removeImage({variables: {imageId: imageId}})
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
                    <ImageUpload required={false}/>
                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
                {message && (
                    <div
                        className={`mt-6 p-4 rounded-lg text-center font-semibold shadow-md ${message.toLowerCase().includes('error') ? 'bg-red-500' : 'bg-green-500'}`}>
                        {message}
                    </div>
                )}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {article.images.map((image) => {
                        return (
                            <div key={image.id} className="relative">
                                <img src={image.path} alt={image.path} className="w-full h-auto rounded-lg shadow-lg"/>
                                <span
                                    onClick={() => deleteImage(image.id)}
                                    className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center cursor-pointer hover:bg-red-700 shadow-md transition-colors duration-200"
                                >
                                    X
                                </span>
                            </div>
                        )
                    })}
                </div>


            </div>
        </div>
    )
}

export default EditArticle;