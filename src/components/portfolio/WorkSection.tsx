import { useMemo, useRef, useState } from "react";
import { ReelCard } from "./ReelCard";
import type { Embed } from "./data";

type Props = {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  categories: readonly string[];
  instagram: Embed[];
  youtube: Embed[];
  stats?: { label: string; value: string }[];
  youtubeSubs: string;
  sectionId: string;
};

export function WorkSection({
  logo, title, subtitle, description, categories, instagram, youtube, stats, youtubeSubs, sectionId,
}: Props) {
  const [platform, setPlatform] = useState<"instagram" | "youtube">("instagram");
  const [category, setCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(3);
  const gridRef = useRef<HTMLDivElement>(null);

  const source = platform === "instagram" ? instagram : youtube;

  const filtered = useMemo(() => {
    if (category !== "All") return source.filter((e) => e.category === category);
    const byCategory: Record<string, Embed[]> = {};
    source.forEach((e) => {
      if (!byCategory[e.category]) byCategory[e.category] = [];
      byCategory[e.category].push(e);
    });
    const perCategory = source.length <= 20 ? 3 : 1;
    return Object.values(byCategory)
      .flatMap((items) => items.slice(0, perCategory))
      .sort(() => Math.random() - 0.5);
  }, [source, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const isExpanded = visibleCount > 3;

  function handleShowMore() {
    setVisibleCount((v) => Math.min(v + 3, filtered.length));
  }

  function handleShowLess() {
    setVisibleCount(3);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleCategoryChange(c: string) {
    setCategory(c);
    setVisibleCount(3);
  }

  function handlePlatformChange(p: "instagram" | "youtube") {
    setPlatform(p);
    setCategory("All");
    setVisibleCount(3);
  }

  return (
    <div id={sectionId} className="py-16 sm:py-24">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt={`${title} logo`}
          className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10"
        />
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-accent-blue">{subtitle}</p>
        </div>
      </div>
      <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{description}</p>

      {stats && (
        <div className="mt-8 flex flex-wrap gap-2 text-xs">
          {stats.map((s) => (
            <span key={s.label} className="rounded-full border border-hairline px-3 py-1.5 text-muted-foreground">
              <span className="text-foreground font-medium">{s.value}</span> {s.label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-hairline p-1 bg-white/[0.02]">
          {(["instagram", "youtube"] as const).map((p) => (
            <button
              key={p}
              onClick={() => handlePlatformChange(p)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                platform === p ? "bg-accent-blue text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "instagram" ? "Instagram" : "YouTube"}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {platform === "youtube" ? `${youtubeSubs} YouTube subscribers` : ""}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => handleCategoryChange(c)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              category === c
                ? "border-accent-blue text-accent-blue bg-accent-blue/10"
                : "border-hairline text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((e) => (
          <ReelCard key={e.id} embed={e} />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        {hasMore && (
          <button
            onClick={handleShowMore}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-accent-blue/40 text-sm text-accent-blue hover:bg-accent-blue hover:text-white transition-all duration-300"
          >
            Show More
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </button>
        )}
        {isExpanded && (
          <button
            onClick={handleShowLess}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-hairline text-sm text-muted-foreground hover:border-white/30 hover:text-foreground transition-all duration-300"
          >
            Show Less
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </button>
        )}
      </div>
    </div>
  );
}