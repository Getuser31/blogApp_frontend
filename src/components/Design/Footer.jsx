import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { GET_CATEGORIES } from "../../graphql/queries.js";

export function Footer() {
    const { t } = useTranslation();
    const { loading, error, data } = useQuery(GET_CATEGORIES);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubscribe = () => {
        if (!email || !email.includes("@")) return;
        setSubmitted(true);
        setEmail("");
    };

    return (
        <footer className="bg-neutral-900 text-neutral-400 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 flex items-center justify-center rounded bg-white flex-shrink-0">
                                <span className="text-neutral-900 font-bold text-base leading-none select-none">B</span>
                            </div>
                            <span className="font-semibold uppercase text-white text-base tracking-widest">BlogApp</span>
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            {t('footer.aboutText')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{t('footer.quickLinks')}</p>
                        <ul className="flex flex-col gap-2">
                            <li><Link to="/" className="text-sm text-neutral-400 hover:text-white transition-colors">{t('footer.home')}</Link></li>
                            <li><Link to="/articles" className="text-sm text-neutral-400 hover:text-white transition-colors">{t('menu.articles')}</Link></li>
                            <li><a href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">{t('footer.aboutUs')}</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{t('footer.categories')}</p>
                        <ul className="flex flex-col gap-2">
                            {loading && <li className="text-neutral-600 text-sm animate-pulse">{t('footer.loadingCategories')}</li>}
                            {error && <li className="text-red-500 text-sm">{t('footer.errorLoadingCategories')}</li>}
                            {data?.getCategories?.map((category) => (
                                <li key={category.id}>
                                    <Link to={`/category/${category.name}`} className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">{t('footer.newsletter')}</p>
                        <p className="text-sm text-neutral-500 mb-3 leading-relaxed">
                            {t('footer.newsletterText')}
                        </p>
                        {submitted ? (
                            <p className="text-sm text-green-400 font-medium">{t('footer.subscribed')}</p>
                        ) : (
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder={t('footer.yourEmail')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                                    className="flex-1 h-9 bg-neutral-800 border border-neutral-700 border-r-0 rounded-l text-sm text-white placeholder-neutral-600 px-3 focus:outline-none focus:border-neutral-500"
                                />
                                <button
                                    onClick={handleSubscribe}
                                    className="w-10 h-9 bg-white text-neutral-900 rounded-r font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center flex-shrink-0"
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-neutral-800 text-xs text-neutral-600">
                    <p>© {new Date().getFullYear()} {t('footer.allRightsReserved')}</p>
                </div>
            </div>
        </footer>
    );
}
