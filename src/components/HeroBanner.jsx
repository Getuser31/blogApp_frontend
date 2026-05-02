import { useTranslation } from "react-i18next";

export function HeroBanner({
  title,
  subtitle,
  tags = [],
  activeTopic = "All",
  onTagClick,
}) {
  const { t, i18n } = useTranslation();

  const resolvedTitle = title ?? t('heroBanner.title');
  const resolvedSubtitle = subtitle ?? t('heroBanner.subtitle');
  const currentDate = new Date().toLocaleDateString(i18n.language, { month: "long", year: "numeric" });

  return (
    <div className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        {/* Left — tagline */}
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-500 mb-2">
            {resolvedSubtitle} · {currentDate}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-snug max-w-lg">
            {resolvedTitle}
          </h1>
        </div>

        {/* Right — topic filter chips */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors ${
                activeTopic === tag
                  ? "bg-white text-neutral-900 border-white"
                  : "border-neutral-600 text-neutral-400 hover:border-neutral-400 hover:text-neutral-200"
              }`}
            >
              {tag === "All" ? t('articles.allCategories') : tag}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
