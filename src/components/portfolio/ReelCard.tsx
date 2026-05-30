import { useEffect } from "react";
import type { Embed } from "./data";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function loadInstagramScript() {
  if (typeof window === "undefined") return;
  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return;
  }
  const existing = document.querySelector<HTMLScriptElement>("script[data-ig-embed]");
  if (existing) return;
  const s = document.createElement("script");
  s.src = "https://www.instagram.com/embed.js";
  s.async = true;
  s.dataset.igEmbed = "true";
  document.body.appendChild(s);
}

export function ReelCard({ embed }: { embed: Embed }) {
  useEffect(() => {
    if (embed.type === "instagram") {
      loadInstagramScript();
      const t = setTimeout(() => window.instgrm?.Embeds.process(), 300);
      return () => clearTimeout(t);
    }
  }, [embed.type]);

  return (
    <div
      className="group rounded-2xl border overflow-hidden flex flex-col"
      style={{ backgroundColor: "#0a0a0a", borderColor: "#222222" }}
    >
      <div className="relative w-full bg-black aspect-[9/16] overflow-hidden">
        {embed.type === "youtube" ? (
          <iframe
            src={`https://www.youtube.com/embed/${embed.url}`}
            title="YouTube short"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <blockquote
            className="instagram-media absolute inset-0 !m-0 !min-w-0 !w-full !max-w-none"
            data-instgrm-permalink={embed.url}
            data-instgrm-version="14"
            style={{ background: "#000" }}
          />
        )}
      </div>
      <div className="p-4 flex items-start justify-between gap-3">
        <p className="text-sm leading-snug line-clamp-2 flex-1" style={{ color: "#ffffff" }}>
          {embed.title}
        </p>
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-accent-blue border border-accent-blue/40 rounded-full px-2 py-1">
          {embed.category}
        </span>
      </div>
    </div>
  );
}