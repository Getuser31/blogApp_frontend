import React from "react";
import {FaFacebook, FaTwitter, FaInstagram, FaLinkedin} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_CATEGORIES} from "../graphql/queries.js";

const Footer = () => {
    const {loading, error, data} = useQuery(GET_CATEGORIES);
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                        <p className="text-gray-600">
                            A blog dedicated to sharing insights, stories, and ideas about technology, design, and
                            creativity.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
                            <li><a href="/categories" className="text-gray-600 hover:text-gray-900">Categories</a></li>
                            <li><a href="/about" className="text-gray-600 hover:text-gray-900">About Us</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {loading && <li>Loading categories...</li>}
                            {error && <li>Error loading categories</li>}
                            {data?.getCategories?.map((category) => (
                                <li key={category.id}>
                                    <Link to={`/category/${category.name}`}
                                          className="text-gray-600 hover:text-gray-900">{category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletter</h3>
                        <p className="text-gray-600 mb-4">
                            Subscribe to get the latest articles delivered to your inbox.
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gray-900 text-white rounded-r-lg hover:bg-gray-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="42" fill="none"
                                     viewBox="0 0 48 42">
                                    <path fill="#101828"
                                          d="M0 8a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"/>
                                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="1.333"
                                          d="m30.667 17.667-5.994 3.818a1.33 1.33 0 0 1-1.34 0l-6-3.818"/>
                                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="1.333"
                                          d="M29.333 15.667H18.667c-.737 0-1.334.597-1.334 1.333v8c0 .736.597 1.333 1.334 1.333h10.666c.737 0 1.334-.597 1.334-1.333v-8c0-.736-.597-1.333-1.334-1.333"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div
                    className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} My Blog. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;