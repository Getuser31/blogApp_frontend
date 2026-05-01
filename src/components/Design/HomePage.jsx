import { useState, useMemo } from "react";
import { Navbar } from "./Navbar.jsx";
import { HeroBanner } from "./HeroBanner.jsx";
import { MagazineGrid } from "./MagazineGrid.jsx";
import { Footer } from "./Footer.jsx";

const TOPICS = ["All", "Technology", "AI", "Science", "Geopolitics", "Society"];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CATEGORY_LINKS = [
  { label: "Technology", href: "/category/technology" },
  { label: "AI", href: "/category/ai" },
  { label: "Science", href: "/category/science" },
  { label: "Geopolitics", href: "/category/geopolitics" },
  { label: "Society", href: "/category/society" },
];

export function HomePage({
  articles = [],
  user = null,
  onReadMore,
  onSearch,
  onSubscribe,
}) {
  const [activeTopic, setActiveTopic] = useState("All");

  // Filter articles by active topic
  const filtered = useMemo(() => {
    if (activeTopic === "All") return articles;
    return articles.filter(
      (a) => a.category?.toLowerCase() === activeTopic.toLowerCase()
    );
  }, [articles, activeTopic]);

  const featured = filtered[0] ?? null;
  const latest = filtered.slice(1, 6); // up to 5 sidebar cards

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">

      <Navbar
        topics={TOPICS}
        activeTopic={activeTopic}
        onTopicChange={setActiveTopic}
        onSearch={onSearch}
        user={user}
      />

      <HeroBanner
        title="another look on the actuality and the world"
        subtitle="Tech & Ideas"
        tags={TOPICS}
        activeTopic={activeTopic}
        onTagClick={setActiveTopic}
      />

      <main className="flex-1">
        {filtered.length === 0 ? (
          <div className="max-w-7xl mx-auto px-6 py-20 text-center text-neutral-400">
            <p className="text-lg font-medium">No articles in this category yet.</p>
          </div>
        ) : (
          <MagazineGrid
            featured={featured}
            latest={latest}
            onReadMore={onReadMore}
          />
        )}
      </main>

      <Footer
        quickLinks={QUICK_LINKS}
        categories={CATEGORY_LINKS}
        onSubscribe={onSubscribe}
      />

    </div>
  );
}
