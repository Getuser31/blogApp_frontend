// ArticleCard.jsx
// Compact sidebar card: thumbnail left + meta/title right
// Props:
//   article: {
//     id: string | number
//     title: string
//     category: string
//     date: string
//     readTime?: string
//     imageUrl?: string
//     slug: string
//   }
//   onRead: (article) => void

export function ArticleCard({ article, onRead, isLast = false }) {
  if (!article) return null;

  return (
    <article
      className={`flex gap-3 py-4 cursor-pointer group ${!isLast ? "border-b border-neutral-100" : ""}`}
      onClick={() => onRead?.(article)}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-16 h-14 rounded-sm overflow-hidden bg-neutral-200">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100">
            <span className="text-neutral-300 text-xs font-mono">img</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center gap-1 min-w-0">
        <span className="text-xs font-bold tracking-wider uppercase text-neutral-500">
          {article.category}
        </span>
        <h3 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-neutral-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-neutral-400">
          {article.date}{article.readTime ? ` · ${article.readTime}` : ""}
        </p>
      </div>
    </article>
  );
}
