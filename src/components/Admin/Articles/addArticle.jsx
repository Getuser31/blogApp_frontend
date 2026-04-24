import React, { useState, useRef } from "react";
import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate, Link } from "react-router-dom";
import { ADD_ARTICLE, EDIT_ARTICLE } from "../../../graphql/mutations";
import { GET_ARTICLES, GET_CATEGORIES } from "../../../graphql/queries";
import Loading from "../../../utils/loading";
import Error from "../../../utils/error";
import ImageUpload from "./ImageUpload";
import CategoryDropdown from "./CategoryDropdown";
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
        ['clean'],
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

const AddArticle = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryIds, setCategoryIds] = useState([]);
    const [images, setImages] = useState([]);
    const [isPublished, setIsPublished] = useState(false);
    const [validationError, setValidationError] = useState("");
    const quillRef = useRef(null);
    const navigate = useNavigate();

    // Maps blob URL -> file index for inline images in the editor
    const blobToFileIndexRef = useRef({});

    // Store the placeholder-version of content so onCompleted can replace them with server paths
    const placeholderContentRef = useRef('');

    const [addArticle, { loading, error }] = useMutation(ADD_ARTICLE, {
        refetchQueries: [{ query: GET_ARTICLES }],
        onCompleted: async (data) => {
            const articleId = data?.createArticle?.id;
            const uploadedImages = data?.createArticle?.images || [];

            // Work with the placeholder-version of content that was actually saved
            let updatedContent = placeholderContentRef.current;
            let hasPlaceholders = false;

            if (uploadedImages.length > 0) {
                // Scan for [img-X] placeholders
                const placeholderRegex = /\[img-(\d+)\]/g;
                let match;
                while ((match = placeholderRegex.exec(updatedContent)) !== null) {
                    const fullMatch = match[0];
                    const placeholderId = parseInt(match[1], 10);
                    // The placeholder ID was the file index in the images array
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
                try {
                    await editArticle({
                        variables: {
                            id: articleId,
                            title,
                            content: updatedContent,
                            categoryIds,
                        },
                    });
                } catch (err) {
                    console.error("Error updating article with image paths:", err);
                }
            }

            navigate(`/article/${articleId}`);
        },
        onError: (error) => {
            console.error("Error adding article:", error);
        },
    });

    // Separate hook for the content update after creation
    const [editArticle] = useMutation(EDIT_ARTICLE);

    const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES);

    // Called when user clicks "Insert in text" on a sidebar image preview
    const handleInsertImage = (previewUrl, file) => {
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const range = editor.getSelection(true);
        const index = range ? range.index : editor.getLength();

        // Find which file index this is in the images array
        const fileIndex = images.indexOf(file);
        if (fileIndex === -1) return;

        // Create an object URL for the image so it's actually visible in the editor
        const objectUrl = URL.createObjectURL(file);
        blobToFileIndexRef.current[objectUrl] = fileIndex;

        // Insert the actual image into the editor — user can see, resize, and align it
        editor.insertEmbed(index, 'image', objectUrl);
        editor.setSelection(index + 1);
    };

    // Convert blob URLs to placeholders before saving
    const prepareContentForSave = (htmlContent) => {
        let prepared = htmlContent;
        Object.keys(blobToFileIndexRef.current).forEach((blobUrl) => {
            const fileIndex = blobToFileIndexRef.current[blobUrl];
            // Escape special regex characters in the URL
            const escapedUrl = blobUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const imgRegex = new RegExp(`<img[^>]*src="${escapedUrl}"[^>]*>`, 'g');
            prepared = prepared.replace(imgRegex, `[img-${fileIndex}]`);
        });
        return prepared;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError("");

        if (!title || !content) {
            setValidationError("Title and content are required.");
            return;
        }

        // Replace blob URLs with placeholders before saving to the server
        const contentForSave = prepareContentForSave(content);

        // Store the placeholder version so onCompleted can replace [img-X] with server URLs
        placeholderContentRef.current = contentForSave;

        try {
            await addArticle({
                variables: {
                    title,
                    content: contentForSave,
                    categoryIds,
                    images,
                    publish: isPublished
                },
            });
        } catch (err) {
            console.error('Error creating article:', err);
        }
    };

    if (categoriesLoading) {
        return <Loading />;
    }

    if (categoriesError) {
        return <Error message={`Error loading categories: ${categoriesError.message}`} />;
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            to="/admin"
                            className="text-indigo-300 hover:text-indigo-200 text-sm flex items-center gap-1 mb-2 transition-colors"
                        >
                            &larr; Back to Admin
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Create New Article</h1>
                        <p className="text-gray-400 text-sm mt-1">Write your next story and share it with the world</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Editor — Left Column (spans 2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Title Card */}
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Article Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter your article title..."
                                    className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-4 py-3 text-lg"
                                    required
                                />
                            </div>

                            {/* Content Editor Card */}
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Content <span className="text-red-400">*</span>
                                </label>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Write your article here..."
                                    className="bg-white text-black rounded-lg overflow-hidden [&_.ql-editor]:min-h-[500px] [&_.ql-toolbar]:border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Sidebar — Right Column (spans 1/3) */}
                        <div className="space-y-6">
                            {/* Publish Settings Card */}
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                    Publish Settings
                                </h2>
                                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">Publish directly</p>
                                        <p className="text-xs text-gray-400">Make this article visible to everyone</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="publish"
                                            checked={isPublished}
                                            onChange={(e) => setIsPublished(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Categories Card */}
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Categories
                                </h2>
                                <CategoryDropdown
                                    categories={categoriesData?.getCategories || []}
                                    selectedCategories={categoryIds}
                                    onCategoryChange={setCategoryIds}
                                />
                            </div>

                            {/* Images Card — Upload and insert into editor */}
                            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Images
                                </h2>
                                <p className="text-xs text-gray-400 mb-3">
                                    1. Upload images below<br />
                                    2. Hover a thumbnail and click <strong>"Insert in text"</strong><br />
                                    3. The image appears directly in the editor — you can resize it by dragging corners, or align it with the toolbar.
                                </p>
                                <ImageUpload
                                    onUpload={setImages}
                                    onInsertImage={handleInsertImage}
                                    required={false}
                                />
                            </div>

                            {/* Validation Error */}
                            {validationError && (
                                <div className="rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-sm text-red-300">
                                    {validationError}
                                </div>
                            )}

                            {/* API Error */}
                            {error && (
                                <div className="rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-sm text-red-300">
                                    {error.message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3 text-white font-semibold transition-colors shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    'Publish Article'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddArticle;
