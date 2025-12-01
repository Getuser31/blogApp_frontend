import React from "react";
import {FaFacebook, FaTwitter, FaInstagram, FaLinkedin} from "react-icons/fa";

const Footer = () => {
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
                            <li><a href="/" className="text-gray-600 hover:text-gray-900">Home</a></li>
                            <li><a href="/articles" className="text-gray-600 hover:text-gray-900">Articles</a></li>
                            <li><a href="/categories" className="text-gray-600 hover:text-gray-900">Categories</a></li>
                            <li><a href="/about" className="text-gray-600 hover:text-gray-900">About Us</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li><a href="/category/technology"
                                   className="text-gray-600 hover:text-gray-900">Technology</a></li>
                            <li><a href="/category/design" className="text-gray-600 hover:text-gray-900">Design</a></li>
                            <li><a href="/category/lifestyle"
                                   className="text-gray-600 hover:text-gray-900">Lifestyle</a></li>
                            <li><a href="/category/travel" className="text-gray-600 hover:text-gray-900">Travel</a></li>
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
                                    <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="1.333"
                                          d="m30.667 17.667-5.994 3.818a1.33 1.33 0 0 1-1.34 0l-6-3.818"/>
                                    <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="1.333"
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
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-gray-600 hover:text-gray-900"><FaFacebook size={20}/></a>
                        <a href="#" className="text-gray-600 hover:text-gray-900"><FaTwitter size={20}/></a>
                        <a href="#" className="text-gray-600 hover:text-gray-900"><FaInstagram size={20}/></a>
                        <a href="#" className="text-gray-600 hover:text-gray-900"><FaLinkedin size={20}/></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;