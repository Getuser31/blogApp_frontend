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
                const placeholderRegex = /\[img-(\d+)\]/g;
                let match;
                while ((match = placeholderRegex.exec(updatedContent)) !== null) {
                    const fullMatch = match[0];
                    const placeholderId = parseInt(match[1], 10);
                    if (placeholderId < uploadedImages.length) {
                        const serverPath = uploadedImages[placeholderId]?.path;
                        if (serverPath) {
                            const imgTag = `<img src="${serverPath}" alt="inline image" style="max-width:100%;height:auto;" />`;
                            updatedContent = updatedContent.replace(fullMatch, imgTag);
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
            const imgRegex = new RegExp(`<img[^>]*src="${escapedUrl}"[^>]*>`, 'g');
            prepared = prepared.replace(imgRegex, `[img-${fileIndex}]`);
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
                            id="edit-title"
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
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            className="bg-white text-black rounded-lg overflow-hidden [&_.ql-editor]:min-h-[200px]"
                        />
                    </div>

                    <div className="mb-4">
                        <p className="text-gray-400 text-xs mb-2">
                            Upload images, then hover a thumbnail and click <strong>"Insert in text"</strong>. The image appears directly in the editor — you can resize it by dragging corners, or align it with the toolbar.
                        </p>
                        <ImageUpload
                            required={false}
                            onUpload={setImages}
                            onInsertImage={handleInsertImage}
                        />
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            disabled={editLoading}
                            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-60"
                        >
                            {editLoading ? 'Saving...' : 'Save Changes'}
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
