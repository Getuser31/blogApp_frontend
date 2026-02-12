import React, { useEffect, useState } from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_ARTICLE, GET_CATEGORIES} from "../../graphql/queries.js";
import Loading from "../../utils/loading.jsx";
import Error from "../../utils/error.jsx";
import {Link, useParams, useNavigate} from "react-router-dom";
import {DELETE_IMAGE, EDIT_ARTICLE} from "../../graphql/mutations.js";
import ImageUpload from "../Admin/Articles/ImageUpload.jsx";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'script',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link',
];

const EditArticle = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = React.useState('');
    const [content, setContent] = React.useState('');
    const {loading, error, data} = useQuery(GET_ARTICLE, {variables: {id}});
    const {data: categoriesData} = useQuery(GET_CATEGORIES)
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        if (data?.article?.content) {
            setContent(data.article.content);
        }
        if (data?.article?.categories) {
            setSelectedCategories(data.article.categories.map(c => c.id));
        }
    }, [data]);

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
        const images = formData.getAll('images');
        const validImages = images.filter(file => file.size > 0);

        if (!title || !content) {
            return;
        }
        
        const variables = {id, title, content, categoryIds: selectedCategories};
        if (validImages.length > 0) {
            variables.images = validImages;
        }

        editArticle({variables});
    }

    const deleteImage = (imageId) => {
        removeImage({variables: {imageId: imageId}})
    }

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
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

                    <div className="mb-8">
                        <label className="block text-gray-400 text-sm font-bold mb-2">
                            Categories
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-700 p-4 rounded-lg border border-gray-600">
                            {categoriesData?.getCategories?.map((category) => (
                                <label key={category.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-600 p-2 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        value={category.id}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 bg-gray-800 border-gray-500"
                                    />
                                    <span className="text-gray-200 select-none">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <ReactQuill 
                            theme="snow"
                            value={content} 
                            onChange={setContent} 
                            modules={modules}
                            formats={formats}
                            className="bg-white text-black rounded-lg overflow-hidden [&_.ql-editor]:min-h-[200px]"
                        />
                    </div>

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