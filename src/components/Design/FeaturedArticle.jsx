import { useTranslation } from "react-i18next";

export function FeaturedArticle({ article, onReadMore }) {
  const { t } = useTranslation();
  if (!article) return null;

  return (
    <article className="flex flex-col gap-4">
      {/* Image */}
      <div className="relative overflow-hidden rounded-sm bg-neutral-100 aspect-[16/9]">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200">
            <span className="text-neutral-400 text-sm font-mono">image</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold tracking-wider uppercase bg-neutral-900 text-white px-2 py-0.5 rounded-sm">
          {article.category}
        </span>
        <span className="text-xs text-neutral-400">
          {article.date}
        </span>
        {article.readTime && (
          <span className="text-xs text-neutral-400">· {article.readTime}</span>
        )}
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight tracking-tight">
        {article.title}
      </h2>

      {/* Excerpt */}
      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
        {article.excerpt}
      </p>

      {/* CTA */}
      <button
        onClick={() => onReadMore?.(article)}
        className="self-start mt-1 bg-neutral-900 text-white text-sm font-semibold px-5 py-2 rounded hover:bg-neutral-700 transition-colors"
      >
        {t('articles.readArticle')}
      </button>
    </article>
  );
}
