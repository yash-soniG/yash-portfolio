import { useEffect, useRef, useState } from "react";
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (embed.type !== "instagram") return;

    setLoaded(false);
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.style.opacity = "0";
    wrap.style.transition = "none";

    loadInstagramScript();

    const t = setTimeout(() => {
      window.instgrm?.Embeds.process();
      setTimeout(() => {
        wrap.style.transition = "opacity 0.5s ease";
        wrap.style.opacity = "1";
        setLoaded(true);
      }, 400);
    }, 50);

    return () => clearTimeout(t);
  }, [embed.url]);

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
          <div className="absolute inset-0">
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="h-full w-full absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent animate-pulse" />
                <div className="relative z-10 flex flex-col items-center gap-3 opacity-30">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                  <span className="text-white text-[10px] uppercase tracking-widest">Loading</span>
                </div>
              </div>
            )}
            <div ref={wrapRef} className="absolute inset-0" style={{ opacity: 0 }}>
              <blockquote
                className="instagram-media absolute inset-0 !m-0 !min-w-0 !w-full !max-w-none"
                data-instgrm-permalink={embed.url}
                data-instgrm-version="14"
                style={{ background: "transparent" }}
              />
            </div>
          </div>
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