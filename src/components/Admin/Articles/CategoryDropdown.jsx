import React, { useState, useRef, useEffect } from 'react';
import {useTranslation} from "react-i18next";

const CategoryDropdown = ({ categories, selectedCategories, onCategoryChange }) => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCheckboxChange = (categoryId) => {
        const newSelectedCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((id) => id !== categoryId)
            : [...selectedCategories, categoryId];
        onCategoryChange(newSelectedCategories);
    };

    const selectedCategoryNames = categories
        .filter((cat) => selectedCategories.includes(cat.id))
        .map((cat) => cat.name)
        .join(', ');

    return (
        <div className="relative" ref={dropdownRef}>
            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">{t('categoryDropdown.category')}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2.5 text-left"
            >
                {selectedCategoryNames || t('categoryDropdown.selectCategories')}
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 rounded-lg bg-white border border-gray-200 shadow-lg">
                    <ul className="max-h-60 overflow-auto p-2">
                        {categories.map((category) => (
                            <li key={category.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    id={`cat-${category.id}`}
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleCheckboxChange(category.id)}
                                    className="h-4 w-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor={`cat-${category.id}`} className="ml-3 text-sm text-gray-700 w-full cursor-pointer">
                                    {category.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
