import React, { useState, useEffect, useRef } from 'react';
import {useTranslation} from "react-i18next";

const ImageUpload = ({ onUpload, name = "images", required = false, onInsertImage }) => {
    const {t} = useTranslation();
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const previewUrlsRef = useRef([]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        const urls = previewUrlsRef.current;
        return () => {
            urls.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        // Accumulate new files with existing ones
        const allImages = [...images, ...newFiles];
        setImages(allImages);

        // Create previews for all accumulated files
        const newPreviews = allImages.map((file) => URL.createObjectURL(file));

        // Clean up old preview URLs
        previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url));

        setPreviews(newPreviews);
        previewUrlsRef.current = newPreviews;

        // Notify parent of ALL accumulated images
        if (onUpload) {
            onUpload(allImages);
        }

        // Reset the input so the same file can be selected again
        e.target.value = '';
    };

    const handleInsertClick = (previewUrl, index) => {
        if (onInsertImage) {
            onInsertImage(previewUrl, images[index]);
        }
    };

    return (
        <div>
            <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-700">
                {t('imageUpload.images')}
            </label>
            <input
                id="images"
                name={name}
                type="file"
                multiple
                required={required}
                onChange={handleFileChange}
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-sm file:font-semibold hover:file:bg-indigo-100 transition-colors"
            />
            <div className="mt-4 flex flex-wrap gap-4">
                {previews.map((preview, index) => (
                    <div key={`${preview}-${index}`} className="relative group">
                        <img
                            src={preview}
                            alt={`Preview ${index}`}
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => handleInsertClick(preview, index)}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer backdrop-blur-sm"
                            title={t('imageUpload.insertInText')}
                        >
                            <span className="text-white text-xs font-semibold bg-indigo-600 px-3 py-1.5 rounded-full shadow-sm">
                                {t('imageUpload.insertInText')}
                            </span>
                        </button>
                    </div>
                ))}
            </div>
            {previews.length > 0 && (
                <p className="text-xs text-gray-500 mt-3 font-medium">
                    {t('imageUpload.insertHint')}
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
