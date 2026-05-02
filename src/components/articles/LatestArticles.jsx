import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ARTICLES, GET_CATEGORIES } from "../../graphql/queries.js";
import { ArticleGridCard } from "./ArticleGridCard.jsx";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

function getPageNumbers(current, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    const pages = new Set([1, last, current, current - 1, current + 1]);
    return [...pages]
        .filter(p => p >= 1 && p <= last)
        .sort((a, b) => a - b)
        .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
            acc.push(p);
            return acc;
        }, []);
}

const LatestArticles = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryId = searchParams.get('category_id');
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);

    const { loading, error, data } = useQuery(GET_ARTICLES, {
        variables: { page: currentPage, category_id: categoryId ?? undefined },
    });

    const { data: dataCategory } = useQuery(GET_CATEGORIES);

    const articles = data?.publishedArticles?.data || [];
    const paginatorInfo = data?.publishedArticles?.paginatorInfo;
    const categories = dataCategory?.getCategories || [];

    const handleCategoryChange = (e) => {
        setCurrentPage(1);
        const value = e.target.value;
        if (value) {
            setSearchParams({ category_id: value });
        } else {
            setSearchParams({});
        }
    };

    const handlePreviousPage = () => {
        if (paginatorInfo?.currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (paginatorInfo?.hasMorePages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 font-sans">
                <p className="text-gray-600">{t('articles.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500 font-sans">
                <p>{t('articles.errorLoading')}: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <span className="w-1 h-6 bg-neutral-900 rounded-full" />
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                        {t('latestArticles.title')}
                    </h1>
                </div>

                {categories.length > 0 && (
                    <select
                        value={categoryId ?? ''}
                        onChange={handleCategoryChange}
                        className="text-sm border border-neutral-200 rounded px-3 py-1.5 text-neutral-700 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    >
                        <option value="">{t('articles.allCategories')}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-10 text-neutral-400">
                    <p>{t('latestArticles.noArticles')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <ArticleGridCard key={article.id} article={article} />
                    ))}
                </div>
            )}

            {paginatorInfo && paginatorInfo.lastPage > 1 && (
                <div className="flex items-center justify-center gap-1 mt-10 pt-6 border-t border-neutral-200">
                    <button
                        onClick={handlePreviousPage}
                        disabled={paginatorInfo.currentPage === 1}
                        className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        ← {t('pagination.previous')}
                    </button>

                    <div className="flex items-center gap-1 mx-2">
                        {getPageNumbers(paginatorInfo.currentPage, paginatorInfo.lastPage).map((page, i) =>
                            page === '...' ? (
                                <span key={`ellipsis-${i}`} className="px-2 text-sm text-neutral-400">…</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 text-sm rounded transition-colors ${
                                        page === paginatorInfo.currentPage
                                            ? 'bg-neutral-900 text-white font-semibold'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        onClick={handleNextPage}
                        disabled={!paginatorInfo.hasMorePages}
                        className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        {t('pagination.next')} →
                    </button>
                </div>
            )}
        </div>
    );
};

export default LatestArticles;