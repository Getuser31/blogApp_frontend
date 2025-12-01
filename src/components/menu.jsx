import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext.jsx";

const Menu = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const handleLogout = async () => {
        logout();
        navigate("/login");
    };

    const isAdmin = user && user.role?.toUpperCase() === 'ADMIN';

    return (
        <>
            <header className="bg-white shadow-sm">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="56" fill="none"
                                 viewBox="0 0 60 56">
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round"
                                      d="M10 51.333h40c1.326 0 2.598-.491 3.535-1.366S55 47.904 55 46.667V9.333c0-1.237-.527-2.424-1.465-3.3-.937-.875-2.209-1.366-3.535-1.366H20c-1.326 0-2.598.491-3.535 1.366S15 8.096 15 9.333v37.334c0 1.237-.527 2.424-1.464 3.3-.938.875-2.21 1.366-3.536 1.366m0 0c-1.326 0-2.598-.491-3.536-1.366C5.527 49.09 5 47.904 5 46.667v-21C5 23.1 7.25 21 10 21h5M45 32.667H25M37.5 42H25"/>
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round"
                                      d="M25 14h20v9.333H25z"/>
                            </svg>
                            <Link to="/" className="text-2xl font-bold text-gray-900 ml-4">
                                BLOG APP
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="bg-white border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                                />
                            </div>
                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            to="/admin"
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                    <hr className="w-full border-t border-gray-400 my-2 pb-4"/>
                </nav>
            </header>
        </>
    )
}

export default Menu