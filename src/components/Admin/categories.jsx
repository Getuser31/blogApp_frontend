import React, {useState} from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_CATEGORIES} from "../../graphql/queries.js";
import {ADD_CATEGORY, DELETE_CATEGORY} from "../../graphql/mutations.js";

const Categories = () => {
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
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-indigo-400 text-xl font-semibold animate-pulse">Loading categories...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-red-900/20 border border-red-500 text-red-400 px-6 py-4 rounded-lg">
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
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 border-b border-gray-800 pb-6">
                    <h1 className="text-3xl font-bold text-indigo-400">Manage Categories</h1>
                    <p className="text-gray-400 mt-2">View existing categories and add new ones to your blog.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* List Section */}
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            Existing Categories
                        </h2>
                        
                        {categories.length === 0 ? (
                            <p className="text-gray-500 italic">No categories found.</p>
                        ) : (
                            <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map((category) => (
                                    <li key={category.id} 
                                        className="bg-gray-700/50 hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-between group">
                                        <span className="text-gray-200">{category.name}</span>
                                         <button
                                             onClick={() => {handleDeleteCategory(category.id)}}
                                             className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 h-fit">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Add New Category
                        </h2>
                        
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-400 mb-1">
                                    Category Name
                                </label>
                                <input 
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)} 
                                    type="text" 
                                    name="categoryName" 
                                    id="categoryName" 
                                    placeholder="e.g. Technology" 
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            
                            {apiError && (
                                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800">
                                    {apiError.message}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={addLoading || !categoryName.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {addLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </>
                                ) : (
                                    'Add Category'
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