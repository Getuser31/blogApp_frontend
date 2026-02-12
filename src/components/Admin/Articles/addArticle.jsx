import React, { useState } from "react";
import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate } from "react-router-dom";
import { ADD_ARTICLE } from "../../../graphql/mutations";
import { GET_ARTICLES, GET_CATEGORIES } from "../../../graphql/queries";
import Loading from "../../../utils/loading";
import Error from "../../../utils/error";
import ImageUpload from "./ImageUpload";
import CategoryDropdown from "./CategoryDropdown";
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

const AddArticle = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryIds, setCategoryIds] = useState([]);
    const [images, setImages] = useState([]);
    const [isPublished, setIsPublished] = useState(false);
    const navigate = useNavigate();

    const [addArticle, { loading, error }] = useMutation(ADD_ARTICLE, {
        refetchQueries: [{ query: GET_ARTICLES }],
        onCompleted: () => {
            navigate("/");
        },
        onError: (error) => {
            console.error("Error adding article:", error);
        },
    });

    const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            return; // Add proper validation feedback
        }

        try {
            await addArticle({
                variables: {
                    title,
                    content,
                    categoryIds, // e.g., ['1', '2']
                    images,      // This is your array of File objects
                    publish: isPublished
                },
            });

            console.log('Article created successfully!');
            // Handle success (e.g., clear form, redirect)

        } catch (err) {
            console.error('Error creating article:', err);
            // Handle error (e.g., show error message)
        }
    };

    if (categoriesLoading) {
        return <Loading />;
    }

    if (categoriesError) {
        return <Error message={`Error loading categories: ${categoriesError.message}`} />;
    }

    return (
        <div className="min-h-screen bg-[#A17141] text-white flex flex-col items-center p-8">
            <h1 className="text-4xl font-extrabold text-white mb-8">Write...</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-6xl bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="mb-6">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-300">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2.5"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="content" className="block mb-2 text-sm font-medium ">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        className="bg-white text-black rounded-lg overflow-hidden [&_.ql-editor]:min-h-[500px]"
                    />
                </div>

                <div className="mb-6">
                    <CategoryDropdown
                        categories={categoriesData?.getCategories || []}
                        selectedCategories={categoryIds}
                        onCategoryChange={setCategoryIds}
                    />
                </div>

                <div className="mb-6">
                    <ImageUpload onUpload={setImages} required={true} />
                </div>

                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        id="publish"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                    />
                    <label htmlFor="publish" className="ml-3 text-sm font-medium text-gray-300">
                        Would you publish it directly?
                    </label>
                </div>

                {error && (
                    <div className="rounded-md bg-red-900/40 border border-red-700 px-4 py-3 text-sm text-red-300 mb-6">
                        {error.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-white font-semibold transition-colors"
                >
                    {loading ? "Submitting..." : "Add Article"}
                </button>
            </form>
        </div>
    );
};

export default AddArticle;