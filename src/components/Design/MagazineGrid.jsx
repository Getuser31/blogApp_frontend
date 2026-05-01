// MagazineGrid.jsx
// Featured article left column + latest articles sidebar right
// Props:
//   featured: article object (see FeaturedArticle.jsx)
//   latest: article[] — list for sidebar (4–6 recommended)
//   onReadMore: (article) => void

import { useTranslation } from "react-i18next";
import { FeaturedArticle } from "./FeaturedArticle.jsx";
import { ArticleCard } from "./ArticleCard.jsx";

export function MagazineGrid({ featured, latest = [], onReadMore }) {
  const { t } = useTranslation();
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0 lg:gap-8 xl:gap-12">

        {/* Featured — left */}
        <div className="lg:border-r lg:border-neutral-200 lg:pr-8 xl:pr-12">
          <FeaturedArticle article={featured} onReadMore={onReadMore} />
        </div>

        {/* Latest — right sidebar */}
        <div className="mt-10 lg:mt-0">
          <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-1">
            {t('articles.latest')}
          </p>
          <div>
            {latest.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                onRead={onReadMore}
                isLast={i === latest.length - 1}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
