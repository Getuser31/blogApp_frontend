import React from "react";
import {FaFacebook, FaTwitter, FaInstagram, FaLinkedin} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_CATEGORIES} from "../graphql/queries.js";
import {useTranslation} from "react-i18next";

const Footer = () => {
    const {t} = useTranslation();
    const {loading, error, data} = useQuery(GET_CATEGORIES);
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">{t('footer.about')}</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            {t('footer.aboutText')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">{t('footer.home')}</Link></li>
                            <li><a href="/categories" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">{t('footer.categories')}</a></li>
                            <li><a href="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">{t('footer.aboutUs')}</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">{t('footer.categories')}</h3>
                        <ul className="space-y-3">
                            {loading && <li className="text-gray-500 font-medium animate-pulse">{t('footer.loadingCategories')}</li>}
                            {error && <li className="text-red-500 font-medium">{t('footer.errorLoadingCategories')}</li>}
                            {data?.getCategories?.map((category) => (
                                <li key={category.id}>
                                    <Link to={`/category/${category.name}`}
                                          className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">{category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">{t('footer.newsletter')}</h3>
                        <p className="text-gray-600 mb-4 font-medium leading-relaxed">
                            {t('footer.newsletterText')}
                        </p>
                        <form className="flex shadow-sm rounded-lg overflow-hidden border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                            <input
                                type="email"
                                placeholder={t('footer.yourEmail')}
                                className="flex-1 px-4 py-2.5 bg-white text-gray-900 focus:outline-none font-medium"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 48 42" className="transform scale-75">
                                    <path fill="currentColor"
                                          d="M0 8a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
                                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2.5"
                                          d="m30.667 17.667-5.994 3.818a1.33 1.33 0 0 1-1.34 0l-6-3.818"/>
                                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2.5"
                                          d="M29.333 15.667H18.667c-.737 0-1.334.597-1.334 1.333v8c0 .736.597 1.333 1.334 1.333h10.666c.737 0 1.334-.597 1.334-1.333v-8c0-.736-.597-1.333-1.334-1.333"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div
                    className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm font-medium">
                        © {new Date().getFullYear()} {t('footer.allRightsReserved')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
