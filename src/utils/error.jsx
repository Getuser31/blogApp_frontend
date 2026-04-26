import React from "react";
import {useTranslation} from "react-i18next";

const Error = ({message}) => {
    const {t} = useTranslation();
    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6 text-red-600 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md w-full text-center">
                <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('error.title')}</h3>
                <p className="text-gray-600 font-medium">{t('error.message')}: {message}</p>
            </div>
        </div>
    );
}

export default Error
