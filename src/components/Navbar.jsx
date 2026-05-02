import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { FaBars, FaTimes, FaEdit, FaUser } from "react-icons/fa";
import { Logo } from "./Logo.jsx";
import { useAuth } from "../AuthContext.jsx";
import { SEARCH_ARTICLES } from "../graphql/queries.js";

const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
];

export function Navbar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [search, setSearch] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(i18n.language?.split('-')[0] || 'en');

    const [searchArticles, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(SEARCH_ARTICLES);

    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    const isAuthor = user?.role?.toUpperCase() === 'AUTHOR';

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.length > 3) {
            searchArticles({ variables: { query: value } });
            setSearchOpen(true);
        } else {
            setSearchOpen(false);
        }
    };

    const handleSearchBlur = (e) => {
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
        setSearchOpen(false);
    };

    const handleLangChange = (code) => {
        localStorage.setItem('i18nextLng', code);
        i18n.changeLanguage(code);
        setCurrentLang(code);
        setLangOpen(false);
    };

    const handleLangBlur = (e) => {
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
        setLangOpen(false);
    };

    const handleProfileBlur = (e) => {
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
        setProfileOpen(false);
    };

    const currentFlag = languages.find(l => l.code === currentLang)?.flag ?? '🌐';

    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                    <Logo size="md" />
                </Link>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-neutral-600 hover:text-neutral-900 focus:outline-none"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>

                {/* Desktop: search + lang + auth */}
                <div className="hidden md:flex items-center gap-3 flex-shrink-0">

                    {/* Search */}
                    <div className="relative" onBlur={handleSearchBlur}>
                        <input
                            type="search"
                            value={search}
                            onChange={handleSearch}
                            placeholder={t('menu.search')}
                            className="w-36 h-8 pl-8 pr-3 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:w-52 transition-all"
                        />
                        <svg className="absolute left-2.5 top-2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        {searchOpen && (
                            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                {searchLoading && (
                                    <div className="px-4 py-3 animate-pulse flex items-center gap-3">
                                        <div className="w-10 h-10 bg-neutral-200 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-neutral-200 rounded w-3/4" />
                                            <div className="h-2 bg-neutral-100 rounded w-1/2" />
                                        </div>
                                    </div>
                                )}
                                {searchError && (
                                    <div className="px-4 py-3 text-red-600 text-sm">Error: {searchError.message}</div>
                                )}
                                {searchData?.searchArticles?.data?.length > 0 ? (
                                    <div>
                                        <div className="px-4 py-2 border-b border-neutral-100">
                                            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{t('menu.articles')}</span>
                                        </div>
                                        {searchData.searchArticles.data.map((article, i) => (
                                            <Link
                                                key={article.id}
                                                to={`/article/${article.id}`}
                                                onClick={() => setSearchOpen(false)}
                                                className={`flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors ${i !== searchData.searchArticles.data.length - 1 ? 'border-b border-neutral-50' : ''}`}
                                            >
                                                <div className="shrink-0 w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-neutral-900 truncate">{article.title}</p>
                                                    {article.created_at && (
                                                        <p className="text-xs text-neutral-400 mt-0.5">{new Date(article.created_at).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : searchData?.searchArticles?.data?.length === 0 && (
                                    <div className="px-4 py-6 flex flex-col items-center text-center">
                                        <svg className="w-8 h-8 text-neutral-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <p className="text-sm text-neutral-500">{t('menu.searchNoResults')}</p>
                                        <p className="text-xs text-neutral-400 mt-1">{t('menu.searchNoResultsHint')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Language switcher */}
                    <div className="relative" onBlur={handleLangBlur}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-1 text-xs text-neutral-500 border border-neutral-200 rounded px-2 h-8 hover:bg-neutral-50 transition-colors focus:outline-none"
                        >
                            <span>{currentFlag}</span>
                            <span className="font-medium uppercase">{currentLang}</span>
                        </button>
                        {langOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-2xl py-1 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLangChange(lang.code)}
                                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors ${currentLang === lang.code ? 'bg-neutral-100 font-medium' : ''}`}
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Auth */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                                >
                                    {t('menu.admin')}
                                </Link>
                            )}
                            <div className="relative" onBlur={handleProfileBlur}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 border border-neutral-200 rounded px-3 h-8 hover:bg-neutral-50 transition-colors focus:outline-none"
                                >
                                    <FaUser size={12} />
                                    <span>{user.name}</span>
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                        <Link
                                            to="/userProfile"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                        >
                                            <FaUser className="text-neutral-400" />
                                            <span className="font-medium">{t('menu.profile')}</span>
                                        </Link>
                                        <Link
                                            to="/userArticles"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                        >
                                            <span className="font-medium">{t('menu.yourArticles')}</span>
                                        </Link>
                                        {(isAuthor || isAdmin) && (
                                            <>
                                                <div className="my-1 border-t border-neutral-100" />
                                                <Link
                                                    to="/addArticle"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                >
                                                    <FaEdit className="text-neutral-400" />
                                                    <span className="font-medium">{t('menu.writeNow')}</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm bg-neutral-900 text-white px-3 h-8 rounded font-medium hover:bg-neutral-700 transition-colors"
                            >
                                {t('menu.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="flex items-center text-sm bg-neutral-900 text-white px-4 h-8 rounded font-semibold hover:bg-neutral-700 transition-colors"
                            >
                                {t('menu.login')}
                            </Link>
                            <Link
                                to="/registration"
                                className="flex items-center text-sm border border-neutral-200 text-neutral-600 px-4 h-8 rounded font-medium hover:bg-neutral-50 transition-colors"
                            >
                                {t('menu.register')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-neutral-100 px-6 py-4 flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative" onBlur={handleSearchBlur}>
                        <input
                            type="search"
                            value={search}
                            onChange={handleSearch}
                            placeholder={t('menu.search')}
                            className="w-full h-9 pl-8 pr-3 text-sm bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        />
                        <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        {searchOpen && searchData?.searchArticles?.data?.length > 0 && (
                            <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-2xl py-2 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                                {searchData.searchArticles.data.map((article) => (
                                    <Link
                                        key={article.id}
                                        to={`/article/${article.id}`}
                                        onClick={() => { setSearchOpen(false); setMobileOpen(false); }}
                                        className="flex items-center px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0"
                                    >
                                        <p className="text-sm font-medium text-neutral-900 truncate">{article.title}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Language */}
                    <div className="flex gap-2">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => handleLangChange(lang.code)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm border transition-colors ${currentLang === lang.code ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Nav links */}
                    <div className="flex flex-col gap-1">
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                                        {t('menu.admin')}
                                    </Link>
                                )}
                                <Link to="/userProfile" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                                    {t('menu.profile')}
                                </Link>
                                <Link to="/userArticles" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                                    {t('menu.yourArticles')}
                                </Link>
                                {(isAuthor || isAdmin) && (
                                    <Link to="/addArticle" onClick={() => setMobileOpen(false)} className="py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
                                        {t('menu.writeNow')}
                                    </Link>
                                )}
                                <button
                                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    className="mt-2 w-full text-sm bg-neutral-900 text-white px-4 py-2 rounded font-medium hover:bg-neutral-700 transition-colors text-left"
                                >
                                    {t('menu.logout')}
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2 mt-1">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex-1 text-center text-sm bg-neutral-900 text-white px-4 py-2 rounded font-semibold hover:bg-neutral-700 transition-colors"
                                >
                                    {t('menu.login')}
                                </Link>
                                <Link
                                    to="/registration"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex-1 text-center text-sm border border-neutral-200 text-neutral-600 px-4 py-2 rounded font-medium hover:bg-neutral-50 transition-colors"
                                >
                                    {t('menu.register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
