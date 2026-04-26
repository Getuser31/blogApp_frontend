import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Admin = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-screen font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{t('admin.title')}</h1>
                    <p className="mt-3 text-gray-500 font-medium">{t('admin.subtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        onClick={() => navigate("/admin/addArticle")}
                    >
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{t('admin.createArticle')}</h2>
                        <p className="text-gray-500 text-sm font-medium">{t('admin.createArticleDesc')}</p>
                    </div>
                    
                    <div 
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        onClick={() => navigate("/articles")}
                    >
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{t('admin.editArticles')}</h2>
                        <p className="text-gray-500 text-sm font-medium">{t('admin.editArticlesDesc')}</p>
                    </div>

                    <div 
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        onClick={() => navigate("/admin/categories")}
                    >
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{t('admin.manageCategories')}</h2>
                        <p className="text-gray-500 text-sm font-medium">{t('admin.manageCategoriesDesc')}</p>
                    </div>

                    <div 
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        onClick={() => navigate("/admin/listOfUsers")}
                    >
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{t('admin.manageUsers')}</h2>
                        <p className="text-gray-500 text-sm font-medium">{t('admin.manageUsersDesc')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin;
