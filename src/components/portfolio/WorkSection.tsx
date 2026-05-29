import { useMemo, useState } from "react";
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
};

export function WorkSection({
  logo, title, subtitle, description, categories, instagram, youtube, stats, youtubeSubs,
}: Props) {
  const [platform, setPlatform] = useState<"instagram" | "youtube">("instagram");
  const [category, setCategory] = useState<string>("All");
  const [expanded, setExpanded] = useState(false);

  const source = platform === "instagram" ? instagram : youtube;
  const filtered = useMemo(
    () =>
      category === "All"
        ? source.filter((e) => e.featured)
        : source.filter((e) => e.category === category),
    [source, category]
  );
  const initialCount = category === "All" ? 6 : 3;
  const visible = expanded ? filtered : filtered.slice(0, initialCount);

  return (
    <div className="py-16 sm:py-24">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt={`${title} logo`}
          className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/10"
        />
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
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
              onClick={() => { setPlatform(p); setCategory("All"); setExpanded(false); }}
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
            onClick={() => { setCategory(c); setExpanded(false); }}
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

      <div
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-out overflow-hidden"
      >
        {visible.map((e) => (
          <ReelCard key={e.id} embed={e} />
        ))}
      </div>

      {filtered.length > initialCount && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            {expanded ? "Show Less" : "Show More"}
            <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>↓</span>
          </button>
        </div>
      )}
    </div>
  );
}