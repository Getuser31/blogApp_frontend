import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext.jsx";
import {FaUser, FaEdit, FaBars, FaTimes} from "react-icons/fa";
import {useLazyQuery} from "@apollo/client/react";
import {SEARCH_ARTICLES} from "../graphql/queries.js";

const Menu = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const [isHidden, setIsHidden] = useState(true);
    const [search, setSearch] = useState('')
    const [searchArticles, {loading, error, data}] = useLazyQuery(SEARCH_ARTICLES);
    const [searchResultIsHidden, setSearchResultIsHidden] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        logout();
        navigate("/login");
    };

    const handleDropdownUser = () => {
        setIsHidden(!isHidden);
    }

    const handleBlur = (e) => {
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
            return;
        }
        setIsHidden(true);
    }

    const handleSearchBlur = (e) => {
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
            return;
        }
        setSearchResultIsHidden(true);
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const isAdmin = user && user.role?.toUpperCase() === 'ADMIN';
    
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.length > 3) {
            searchArticles({ variables: { query: value } });
            setSearchResultIsHidden(false);
        } else {
            setSearchResultIsHidden(true);
        }
    }

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

                        <div className="md:hidden z-50">
                            <button onClick={toggleMobileMenu} className="text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900">
                                {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                            </button>
                        </div>

                        <div className={`${isMobileMenuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-white shadow-md p-4 z-40 space-y-4' : 'hidden'} md:flex md:flex-row md:static md:w-auto md:shadow-none md:p-0 md:space-y-0 md:space-x-4 items-center`}>
                            <div className="relative w-full md:w-auto" onBlur={handleSearchBlur}>
                                <input
                                    value={search}
                                    onChange={handleSearch}
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full md:w-auto bg-white border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-900"
                                />
                                {!searchResultIsHidden && (
                                    <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                        {loading && <div className="px-4 py-2 text-gray-900">Loading...</div>}
                                        {error && <div className="px-4 py-2 text-red-600">Error: {error.message}</div>}
                                        {data && data.searchArticles?.data?.length > 0 ? (
                                            data.searchArticles.data.map(article => (
                                                <div key={article.id} className="px-4 py-2 hover:bg-gray-100">
                                                    <Link to={`/article/${article.id}`} className="block text-sm text-gray-700">{article.title}</Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2">
                                                <p className="text-sm text-gray-500">No results found.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
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
                                    <div className="relative" onBlur={handleBlur}>
                                        <button
                                            onClick={handleDropdownUser}
                                            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        >
                                            Profile
                                        </button>
                                        {!isHidden && (
                                            <div
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                                <ul className="flex flex-col">
                                                    <li>
                                                        <Link to="/userProfile" className="group flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150">
                                                            <FaUser className="text-lg text-gray-400 group-hover:text-indigo-600" />
                                                            <span className="font-medium">{user.name}</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <div className="group flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 cursor-pointer transition-colors duration-150">
                                                            <Link to="/userArticles"><span className="font-medium">Your articles</span></Link>
                                                        </div>
                                                    </li>
                                                    <div className="my-1 border-t border-gray-100"></div>
                                                    <li>
                                                        <div className="group flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 cursor-pointer transition-colors duration-150">
                                                            <FaEdit className="text-lg text-gray-400 group-hover:text-indigo-600" />
                                                            <Link to={'/addArticle'}> <span className="font-medium">Write Now </span> </Link>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/registration"
                                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Menu;