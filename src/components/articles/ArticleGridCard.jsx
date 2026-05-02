import { Link } from "react-router-dom";

export function ArticleGridCard({ article }) {
  if (!article) return null;

  const imageUrl = article.imageUrl ?? article.images?.[0]?.path ?? null;

  return (
    <Link to={`/article/${article.id}`} className="group flex flex-col gap-3">
      <div className="overflow-hidden rounded-sm bg-neutral-100 aspect-[16/9]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200">
            <span className="text-neutral-400 text-sm font-mono">image</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {article.category && (
          <span className="text-xs font-bold tracking-wider uppercase bg-neutral-900 text-white px-2 py-0.5 rounded-sm">
            {article.category}
          </span>
        )}
        <span className="text-xs text-neutral-400">{article.date}</span>
        {article.readTime && (
          <span className="text-xs text-neutral-400">· {article.readTime}</span>
        )}
      </div>

      <h3 className="text-base font-bold text-neutral-900 leading-snug tracking-tight line-clamp-2 group-hover:text-neutral-600 transition-colors">
        {article.title}
      </h3>

      {article.excerpt && (
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
      )}
    </Link>
  );
}