"use client";

import { useEffect, useRef, useState } from "react";

export type ViewerDoc = { key: string; label: string; title: string; note: string; pdf: string; pages: string[]; startPage?: number };

// Read a document page by page on the site, no download needed. Pages are images
// rendered from the redacted PDF, so hidden parts stay hidden.
export function DocViewer({ docs }: { docs: ViewerDoc[] }) {
  const [docKey, setDocKey] = useState(docs[0].key);
  const [page, setPage] = useState(docs[0].startPage ?? 0);
  const thumbs = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const doc = docs.find((d) => d.key === docKey) ?? docs[0];
  const last = doc.pages.length - 1;
  const go = (n: number) => setPage(Math.max(0, Math.min(last, n)));

  // Buttons elsewhere on the page ("Read the letter") open a document here.
  useEffect(() => {
    const open = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      if (docs.some((d) => d.key === key)) {
        setDocKey(key);
        setPage(docs.find((d) => d.key === key)?.startPage ?? 0);
      }
    };
    window.addEventListener("astra:open-doc", open);
    return () => window.removeEventListener("astra:open-doc", open);
  }, [docs]);

  useEffect(() => {
    (thumbs.current?.children[page] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest" });
  }, [page, docKey]);

  return (
    <div
      className="ax-viewer"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { go(page + 1); e.preventDefault(); }
        if (e.key === "ArrowLeft") { go(page - 1); e.preventDefault(); }
      }}
    >
      <div className="ax-viewer__bar">
        <div className="ax-viewer__docs" role="group" aria-label="Choose a document">
          {docs.map((d) => (
            <button key={d.key} type="button" aria-pressed={d.key === doc.key} onClick={() => { setDocKey(d.key); setPage(d.startPage ?? 0); }}>
              {d.label}
            </button>
          ))}
        </div>
        <div className="ax-viewer__nav">
          <button type="button" onClick={() => go(page - 1)} disabled={page === 0} aria-label="Previous page">←</button>
          <select value={page} onChange={(e) => go(Number(e.target.value))} aria-label="Go to page">
            {doc.pages.map((_, i) => (
              <option key={i} value={i}>{i + 1}</option>
            ))}
          </select>
          <span>of {doc.pages.length}</span>
          <button type="button" onClick={() => go(page + 1)} disabled={page === last} aria-label="Next page">→</button>
        </div>
      </div>
      <div className="ax-viewer__stage">
        {doc.pages.length > 1 ? (
          <div className="ax-viewer__thumbs" ref={thumbs} aria-label="Pages">
            {doc.pages.map((src, i) => (
              <button key={src} type="button" aria-label={`Page ${i + 1}`} aria-current={i === page} onClick={() => go(i)}>
                <img src={src} alt="" loading="lazy" />
                <span>{i + 1}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div
          className="ax-viewer__page"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(page + (dx < 0 ? 1 : -1));
          }}
        >
          <img src={doc.pages[page]} alt={`${doc.title}, page ${page + 1} of ${doc.pages.length}`} />
        </div>
      </div>
      <div className="ax-viewer__about">
        <span>{doc.note}</span>
        <a href={doc.pdf} target="_blank" rel="noopener">Download PDF</a>
      </div>
    </div>
  );
}

export function OpenDocButton({ doc, children, className }: { doc: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href="#documents"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("astra:open-doc", { detail: doc }));
        document.getElementById("documents")?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );
}
