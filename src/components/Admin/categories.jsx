import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_CATEGORIES} from "../../graphql/queries.js";
import {ADD_CATEGORY, DELETE_CATEGORY} from "../../graphql/mutations.js";
import {useTranslation} from "react-i18next";

const Categories = () => {
    const {t} = useTranslation();
    const {loading, error, data, refetch} = useQuery(GET_CATEGORIES)
    const [categoryName, setCategoryName] = useState('')
    const [add_category, {loading: addLoading, error: apiError}] = useMutation(ADD_CATEGORY, {
        onCompleted: () => {
            setCategoryName('');
            refetch();
        }
    })
    const [delete_category, {loading: deleteLoading, error: deleteError}] = useMutation(DELETE_CATEGORY, {
        onCompleted: () => {
            refetch();
        }
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                <div className="text-indigo-600 text-xl font-medium animate-pulse">{t('categories.loading')}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg font-medium">
                    Error: {error.message}
                </div>
            </div>
        );
    }

    const categories = data.getCategories;

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        const newCategory = categoryName;
        if (newCategory) {
            try {
               await add_category({variables: {name: newCategory}})
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleDeleteCategory = async (id) => {
        try {
            await delete_category({variables: {categoryId: id}})
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('categories.title')}</h1>
                    <p className="mt-3 text-gray-500 font-medium">{t('categories.subtitle')}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List Section */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            {t('categories.existingCategories')}
                        </h2>
                        
                        {categories.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-gray-500 font-medium">{t('categories.noCategories')}</p>
                            </div>
                        ) : (
                            <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map((category) => (
                                    <li key={category.id} 
                                        className="bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-sm px-5 py-4 rounded-lg transition-all flex items-center justify-between group">
                                        <span className="text-gray-800 font-bold">{category.name}</span>
                                         <button
                                             onClick={() => {handleDeleteCategory(category.id)}}
                                             className="text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1">
                                             {t('categories.delete')}
                                         </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 h-fit">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {t('categories.addNew')}
                        </h2>
                        
                        <form onSubmit={handleCategorySubmit} className="space-y-5">
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-bold text-gray-700 mb-2">
                                    {t('categories.categoryName')}
                                </label>
                                <input 
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)} 
                                    type="text" 
                                    name="categoryName" 
                                    id="categoryName" 
                                    placeholder={t('categories.categoryPlaceholder')}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                    required
                                />
                            </div>
                            
                            {apiError && (
                                <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200">
                                    {apiError.message}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={addLoading || !categoryName.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {addLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('categories.adding')}
                                    </>
                                ) : (
                                    t('categories.addCategory')
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categories;
