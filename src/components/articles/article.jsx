import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ARTICLE, GET_ARTICLES } from "../../graphql/queries.js";
import { useParams, Link, useNavigate } from "react-router-dom";
import CommentsOnArticle from "../comments/commentsOnArticle.jsx";
import { useAuth } from "../../AuthContext.jsx";
import { ADD_LAST_READ_ARTICLE, TOGGLE_ARTICLE_FAVORITE } from "../../graphql/mutations.js";
import { useTranslation } from "react-i18next";
import { ReadingProgress, ShareBar, AuthorBio, ArticleSidebar, RelatedArticles } from "./ArticlePage.jsx";

const toDesignArticle = (article, fallbackCategory = "") => ({
    id: article.id,
    title: article.title,
    category: fallbackCategory,
    date: new Date(article.created_at).toLocaleDateString(),
    imageUrl: article.images?.[0]?.path || "",
    slug: article.id,
});

const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const Article = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [isAuthor, setIsAuthor] = useState(false);

    const { loading, error, data } = useQuery(GET_ARTICLE, { variables: { id } });

    const firstCategoryId = data?.article?.categories?.[0]?.id;
    const firstCategoryName = data?.article?.categories?.[0]?.name ?? "";

    const { data: relatedData } = useQuery(GET_ARTICLES, {
        variables: { page: 1, category_id: firstCategoryId },
        skip: !firstCategoryId,
    });

    const [ToogleFavorite] = useMutation(TOGGLE_ARTICLE_FAVORITE, {
        onCompleted: (data) => {
            if (data?.toggleArticleFavorite) {
                data.article.isFavorite = data.toggleArticleFavorite.isFavorite;
            }
        },
    });

    const [saveLastReadArticle] = useMutation(ADD_LAST_READ_ARTICLE);

    useEffect(() => {
        if (data?.article && user) {
            if (data.article.author.id === user.id) setIsAuthor(true);
        }
    }, [data, user]);

    useEffect(() => {
        if (data?.article && user) {
            saveLastReadArticle({ variables: { articleId: data.article.id } });
        }
    }, [data?.article?.id]);

    const handleFavorite = async () => {
        try {
            await ToogleFavorite({ variables: { articleId: article.id } });
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-neutral-500">{t('article.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-red-600">Error: {error.message}</p>
            </div>
        );
    }

    const article = data?.article;

    if (!article) {
        return (
            <div className="flex items-center justify-center py-20 text-center">
                <div>
                    <p className="text-neutral-900 text-xl font-semibold">{t('article.notFound')}</p>
                    <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900 underline mt-3 inline-block transition-colors">
                        {t('article.backToHome')}
                    </Link>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(article.created_at).toLocaleDateString(i18n.language, {
        year: "numeric", month: "long", day: "numeric",
    });

    const related = (relatedData?.publishedArticles?.data ?? [])
        .filter((a) => a.id !== article.id)
        .slice(0, 3)
        .map((a) => toDesignArticle(a, firstCategoryName));

    const sidebarArticle = {
        category: firstCategoryName,
        date: formattedDate,
        author: { name: article.author.name },
    };

    const authorForBio = {
        name: article.author.name,
        initials: getInitials(article.author.name),
    };

    return (
        <div className="bg-neutral-50 min-h-screen">
            <ReadingProgress />

            {/* Hero image */}
            {article.images?.[0]?.path && (
                <div className="w-full overflow-hidden bg-neutral-200" style={{ aspectRatio: "21/9" }}>
                    <img
                        src={article.images[0].path}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-6 pt-5 w-full">
                <nav className="flex items-center gap-2 text-xs text-neutral-400">
                    <Link to="/articles" className="hover:text-neutral-700 transition-colors">
                        {t('article.backToHome').replace("← ", "")}
                    </Link>
                    {firstCategoryName && (
                        <>
                            <span>›</span>
                            <Link to={`/category/${firstCategoryName}`} className="hover:text-neutral-700 transition-colors">
                                {firstCategoryName}
                            </Link>
                        </>
                    )}
                    <span>›</span>
                    <span className="text-neutral-600 truncate max-w-xs">{article.title.slice(0, 50)}{article.title.length > 50 ? "…" : ""}</span>
                </nav>
            </div>

            {/* Content + sidebar */}
            <div className="max-w-7xl mx-auto px-6 mt-8 w-full flex gap-12 pb-16">

                <main className="flex-1 min-w-0">

                    {/* Article header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {article.categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="text-xs font-bold tracking-wider uppercase bg-neutral-900 text-white px-2 py-0.5 rounded-sm"
                                >
                                    {cat.name}
                                </span>
                            ))}
                            <span className="text-xs text-neutral-400">{formattedDate}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight tracking-tight mb-5">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-between py-4 border-t border-b border-neutral-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm select-none flex-shrink-0">
                                    {getInitials(article.author.name)}
                                </div>
                                <div>
                                    <Link
                                        to={`/author/${article.author.name}`}
                                        className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
                                    >
                                        {article.author.name}
                                    </Link>
                                    <p className="text-xs text-neutral-400">{t('article.publishedOn')} {formattedDate}</p>
                                </div>
                            </div>
                            {user && (
                                <button
                                    onClick={handleFavorite}
                                    className={`text-2xl leading-none transition-colors ${article.isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-neutral-300 hover:text-neutral-400"}`}
                                    aria-label="Toggle favorite"
                                >
                                    {article.isFavorite ? "★" : "☆"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Article body */}
                    <div
                        className="text-neutral-800 leading-relaxed [&_p]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-neutral-900 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-neutral-900 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:text-neutral-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-500 [&_blockquote]:mb-6 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-sm [&_.ql-resize-style-left]:float-left [&_.ql-resize-style-left]:mr-6 [&_.ql-resize-style-left]:mb-4 [&_.ql-resize-style-right]:float-right [&_.ql-resize-style-right]:ml-6 [&_.ql-resize-style-right]:mb-4 [&_.ql-resize-style-center]:block [&_.ql-resize-style-center]:mx-auto [&_.ql-resize-style-full]:w-full [&_pre]:whitespace-pre-wrap [&_pre]:bg-neutral-50 [&_pre]:border [&_pre]:border-neutral-200 [&_pre]:p-4 [&_pre]:rounded [&_pre]:text-sm [&_pre]:font-mono [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify"
                        dangerouslySetInnerHTML={{ __html: article.content.replace(/&nbsp;/g, " ") }}
                    />

                    <ShareBar title={article.title} />

                    <AuthorBio author={authorForBio} />

                    <RelatedArticles
                        articles={related}
                        onRead={(a) => navigate(`/article/${a.id}`)}
                    />

                    {/* Edit button */}
                    {isAuthor && (
                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={() => navigate(`/edit/${id}`)}
                                className="text-sm bg-neutral-900 text-white px-5 py-2 rounded font-semibold hover:bg-neutral-700 transition-colors"
                            >
                                {t('article.editArticle')}
                            </button>
                        </div>
                    )}

                    {/* Comments */}
                    <CommentsOnArticle comments={article.comments} articleId={article.id} />
                </main>

                <ArticleSidebar
                    article={sidebarArticle}
                    related={related}
                    onRead={(a) => navigate(`/article/${a.id}`)}
                />
            </div>
        </div>
    );
};

export default Article;
