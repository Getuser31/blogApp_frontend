import React, { useEffect, useState, useRef } from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_ARTICLE, GET_CATEGORIES} from "../../graphql/queries.js";
import Loading from "../../utils/loading.jsx";
import Error from "../../utils/error.jsx";
import {Link, useParams, useNavigate} from "react-router-dom";
import {EDIT_ARTICLE, DELETE_IMAGE} from "../../graphql/mutations.js";
import ImageUpload from "../Admin/Articles/ImageUpload.jsx";
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import QuillResize from 'quill-resize-module';
import 'quill-resize-module/dist/resize.css';

// Register the image resize module globally for all instances
Quill.register('modules/resize', QuillResize);

// Override the Image blot's sanitize to allow blob: URLs for local preview of uploaded images
const ImageBlot = Quill.import('formats/image');
const OriginalSanitize = ImageBlot.sanitize;
ImageBlot.sanitize = function (url) {
  if (/^blob:/.test(url)) {
    return url;
  }
  return OriginalSanitize.call(this, url);
};

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ],
    resize: {
        modules: ['DisplaySize', 'Toolbar', 'Resize'],
    },
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
    'script',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image',
    'resize-inline',
];

const EditArticle = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [message, setMessage] = React.useState('');
    const [content, setContent] = React.useState('');
    const [images, setImages] = useState([]);
    const isReplacingRef = useRef(false);
    // Maps blob URL -> file index for inline images in the editor
    const blobToFileIndexRef = useRef({});
    // Store submitted values in refs so they're available in onCompleted callbacks
    const submittedTitleRef = useRef('');
    const submittedCategoriesRef = useRef([]);
    // Store the placeholder-version of content so onCompleted can replace them with server paths
    const placeholderContentRef = useRef('');
    const {loading, error, data} = useQuery(GET_ARTICLE, {variables: {id}});
    const {data: categoriesData} = useQuery(GET_CATEGORIES)
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editArticle, {loading: editLoading}] = useMutation(EDIT_ARTICLE, {
        onCompleted: async (result) => {
            // If the replacement call completed, navigate.
            if (isReplacingRef.current) {
                navigate(`/article/${id}`);
                return;
            }

            const uploadedImages = result?.editArticle?.images || [];

            // Work with the placeholder-version of content that was actually saved
            let updatedContent = placeholderContentRef.current;
            let hasPlaceholders = false;

            if (uploadedImages.length > 0) {
                // Scan for src="[img-X]" placeholders
                const placeholderRegex = /src="\[img-(\d+)\]"/g;
                let match;
                while ((match = placeholderRegex.exec(updatedContent)) !== null) {
                    const fullMatch = match[0];
                    const placeholderId = parseInt(match[1], 10);
                    if (placeholderId < uploadedImages.length) {
                        const serverPath = uploadedImages[placeholderId]?.path;
                        if (serverPath) {
                            updatedContent = updatedContent.replace(fullMatch, `src="${serverPath}"`);
                            hasPlaceholders = true;
                        }
                    }
                }
            }

            if (hasPlaceholders) {
                isReplacingRef.current = true;
                try {
                    await editArticle({
                        variables: {
                            id,
                            title: submittedTitleRef.current,
                            content: updatedContent,
                            categoryIds: submittedCategoriesRef.current,
                        },
                    });
                } finally {
                    isReplacingRef.current = false;
                }
                return;
            }

            navigate(`/article/${id}`);
        },
        onError: (error) => {
            console.error("Error editing article", error);
        }
    });

    useEffect(() => {
        if (data?.article?.content) {
            setContent(data.article.content);
        }
        if (data?.article?.categories) {
            setSelectedCategories(data.article.categories.map(c => c.id));
        }
    }, [data]);

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

    // Insert a server-side image (already has a permanent URL) directly into the editor
    const handleInsertServerImage = (serverPath) => {
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const range = editor.getSelection(true);
        const index = range ? range.index : editor.getLength();

        editor.insertEmbed(index, 'image', serverPath);
        editor.setSelection(index + 1);
    };

    // Insert an actual image into the editor using an object URL
    const handleInsertImage = (previewUrl, file) => {
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const range = editor.getSelection(true);
        const index = range ? range.index : editor.getLength();

        // Find the file index in the images array
        const fileIndex = images.indexOf(file);
        if (fileIndex === -1) return;

        // Create an object URL so the image is visible in the editor
        const objectUrl = URL.createObjectURL(file);
        blobToFileIndexRef.current[objectUrl] = fileIndex;

        // Insert the actual image — user can resize and align it
        editor.insertEmbed(index, 'image', objectUrl);
        editor.setSelection(index + 1);
    };

    // Convert blob URLs to placeholders before saving
    const prepareContentForSave = (htmlContent) => {
        let prepared = htmlContent;
        Object.keys(blobToFileIndexRef.current).forEach((blobUrl) => {
            const fileIndex = blobToFileIndexRef.current[blobUrl];
            const escapedUrl = blobUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Only replace the src attribute value, preserving all other img attributes (class, style, width, etc.)
            const srcRegex = new RegExp(`src="${escapedUrl}"`, 'g');
            prepared = prepared.replace(srcRegex, `src="[img-${fileIndex}]"`);
        });
        return prepared;
    };

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

        if (!title || !content) {
            return;
        }

        // Store current values for use in onCompleted callback
        submittedTitleRef.current = title;
        submittedCategoriesRef.current = selectedCategories;

        // Replace blob URLs with placeholders before sending to the server
        const contentForSave = prepareContentForSave(content);

        // Store the placeholder version so onCompleted can replace [img-X] with server URLs
        placeholderContentRef.current = contentForSave;

        const variables = {id, title, content: contentForSave, categoryIds: selectedCategories};
        if (images.length > 0) {
            variables.images = images;
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
        <div className="bg-gray-50 min-h-screen font-sans py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8">
                    <Link to="/articles" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        &larr; Back to Articles
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <input
                            id="edit-title"
                            type="text"
                            name="title"
                            defaultValue={article.title}
                            className="text-4xl md:text-5xl font-extrabold text-gray-900 capitalize bg-transparent w-full focus:outline-none border-b-2 border-transparent focus:border-indigo-500 transition-colors py-2"
                        />
                    </div>
                    <div className="flex items-center text-gray-500 font-medium text-sm mb-8">
                        <p>By {article.author.name}</p>
                        <span className="mx-2">&bull;</span>
                        <p>{new Date(article.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="mb-8">
                        <label className="block text-gray-900 text-sm font-bold mb-3">
                            Categories
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {categoriesData?.getCategories?.map((category) => (
                                <label key={category.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        value={category.id}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                    />
                                    <span className="text-gray-700 font-medium select-none">{category.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            className="bg-white text-gray-900 [&_.ql-editor]:min-h-[300px] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:border-0"
                        />
                    </div>

                    <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <p className="text-gray-600 font-medium text-sm mb-4">
                            Upload images, then hover a thumbnail and click <strong className="text-gray-900">"Insert in text"</strong>. The image appears directly in the editor — you can resize it by dragging corners, or align it with the toolbar.
                        </p>
                        <ImageUpload
                            required={false}
                            onUpload={setImages}
                            onInsertImage={handleInsertImage}
                        />
                    </div>
                    <div className="flex justify-end mt-8 border-t border-gray-100 pt-6">
                        <button
                            type="submit"
                            disabled={editLoading}
                            className="bg-indigo-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-60 transition-colors"
                        >
                            {editLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
                {message && (
                    <div
                        className={`mt-6 p-4 rounded-lg text-center font-medium shadow-sm border ${message.toLowerCase().includes('error') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {message}
                    </div>
                )}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {article.images.map((image) => {
                        return (
                            <div key={image.id} className="relative group">
                                <img src={image.path} alt={image.path} className="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-200"/>
                                <button
                                    type="button"
                                    onClick={() => handleInsertServerImage(image.path)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer"
                                    title="Insert this image into the editor"
                                >
                                    <span className="text-white text-xs font-semibold bg-indigo-600 px-3 py-1.5 rounded-full shadow-sm">
                                        Insert in text
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteImage(image.id)}
                                    className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-red-700 shadow-md transition-all duration-200 focus:outline-none z-10"
                                    title="Delete image"
                                >
                                    ✕
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default EditArticle;
