import React, { useState } from 'react';

const ImageUpload = ({ onUpload }) => {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews(newPreviews);
        onUpload(files);
    };

    return (
        <div>
            <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-300">
                Images
            </label>
            <input
                id="images"
                type="file"
                multiple
                required
                onChange={handleFileChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2.5"
            />
            <div className="mt-4 flex flex-wrap gap-4">
                {previews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Preview ${index}`} className="w-32 h-32 object-cover rounded-lg" />
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;