import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArticleCard } from "../Design/ArticleCard.jsx";

/* ── READING PROGRESS BAR ───────────────────────────── */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-0.5 bg-neutral-900 z-50 transition-all duration-100"
      style={{ width: `${progress}%` }}
    />
  );
}

/* ── SHARE BAR ───────────────────────────────────────── */
export function ShareBar({ title = "" }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const url = window.location.href;

  const share = (platform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const targets = {
      twitter:  `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };
    window.open(targets[platform], "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 py-6 border-t border-b border-neutral-200 my-8">
      <span className="text-xs font-bold tracking-widest uppercase text-neutral-400 mr-2">
        {t('article.share')}
      </span>

      {[
        { label: "X / Twitter", icon: "𝕏", platform: "twitter" },
        { label: "LinkedIn",    icon: "in", platform: "linkedin" },
      ].map(({ label, icon, platform }) => (
        <button
          key={label}
          title={label}
          onClick={() => share(platform)}
          className="w-8 h-8 rounded border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors flex items-center justify-center"
        >
          {icon}
        </button>
      ))}

      <button
        onClick={copy}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 h-8 rounded border transition-colors ${
          copied
            ? "bg-neutral-900 text-white border-neutral-900"
            : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
        }`}
      >
        {copied ? t('article.copied') : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {t('article.copyLink')}
          </>
        )}
      </button>
    </div>
  );
}

/* ── AUTHOR BIO ──────────────────────────────────────── */
export function AuthorBio({ author }) {
  return (
    <div className="flex gap-4 p-6 bg-neutral-100 rounded-lg">
      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg select-none">
        {author.initials}
      </div>
      <div>
        {author.role && (
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-1">{author.role}</p>
        )}
        <p className="font-bold text-neutral-900 text-base mb-1">{author.name}</p>
        {author.bio && (
          <p className="text-sm text-neutral-500 leading-relaxed">{author.bio}</p>
        )}
      </div>
    </div>
  );
}

/* ── RELATED ARTICLES ────────────────────────────────── */
export function RelatedArticles({ articles, onRead }) {
  const { t } = useTranslation();

  if (!articles?.length) return null;

  return (
    <section className="mt-12">
      <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-5">
        {t('article.relatedArticles')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {articles.map((a) => (
          <article
            key={a.id}
            className="group cursor-pointer"
            onClick={() => onRead?.(a)}
          >
            <div className="rounded overflow-hidden bg-neutral-200 mb-3" style={{ aspectRatio: "16/9" }}>
              {a.imageUrl ? (
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                  <span className="text-neutral-300 text-xs font-mono">image</span>
                </div>
              )}
            </div>
            {a.category && (
              <span className="text-xs font-bold tracking-wider uppercase text-neutral-500">
                {a.category}
              </span>
            )}
            <h4 className="text-sm font-semibold text-neutral-900 leading-snug mt-1 line-clamp-2 group-hover:text-neutral-600 transition-colors">
              {a.title}
            </h4>
            <p className="text-xs text-neutral-400 mt-1">{a.date}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── STICKY SIDEBAR ──────────────────────────────────── */
export function ArticleSidebar({ article, related, onRead }) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setProgress(el.scrollHeight > el.clientHeight
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
        : 0
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-20 flex flex-col gap-6">

        {/* Reading progress */}
        <div>
          <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
            <span className="font-medium uppercase tracking-wider">{t('article.reading')}</span>
            <span className="font-semibold text-neutral-700">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Meta card */}
        <div className="p-4 bg-white rounded-lg border border-neutral-200">
          {article.category && (
            <span className="text-xs font-bold tracking-wider uppercase bg-neutral-900 text-white px-2 py-0.5 rounded-sm">
              {article.category}
            </span>
          )}
          <p className="text-xs text-neutral-500 mt-3 mb-1">{article.date}</p>
          <p className="text-sm font-semibold text-neutral-800 leading-snug">{article.author?.name}</p>
          {article.author?.role && (
            <p className="text-xs text-neutral-400">{article.author.role}</p>
          )}
        </div>

        {/* Related mini-list */}
        {related?.length > 0 && (
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
              {t('articles.latest')}
            </p>
            {related.map((a, i) => (
              <ArticleCard
                key={a.id}
                article={a}
                onRead={onRead}
                isLast={i === related.length - 1}
              />
            ))}
          </div>
        )}

      </div>
    </aside>
  );
}
