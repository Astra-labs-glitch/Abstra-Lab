"use client";

import { useState } from "react";

import { runLaunch } from "./launch-sky";

const ROCKET = "/images/astra/astra-rocket.png";

// Brand colours only: reds, pink, white and grey.
const PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["#D62E2E", "#F08A8A"],
  ["#E6E6E6", "#BDBDBD"],
  ["#F08A8A", "#D62E2E"],
  ["#8C8C8C", "#E6E6E6"],
  ["#D62E2E", "#D62E2E"],
];

// Back rows are smaller and lighter, so the crowd reads as layered.
const LAYERS = [
  { count: 78, w: 11, h: 21, bottom: 16, light: 0.55, gap: -2 },
  { count: 68, w: 13, h: 25, bottom: 8, light: 0.28, gap: -3 },
  { count: 58, w: 16, h: 31, bottom: 0, light: 0, gap: -4 },
] as const;

function tint(hex: string, t: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.round(v + (255 - v) * t);
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

const ROWS = LAYERS.map((layer, r) => ({
  ...layer,
  people: Array.from({ length: layer.count }, (_, i) => {
    const pair = PAIRS[(i * 3 + r * 2 + (i % 4)) % PAIRS.length];
    return {
      head: tint(pair[0], layer.light),
      body: tint(pair[1], layer.light),
      delay: ((i * 37 + r * 13) % 11) * 0.05,
    };
  }),
}));

export function LaunchPad() {
  const [busy, setBusy] = useState(false);
  const [onPad, setOnPad] = useState(true);
  const [cheering, setCheering] = useState(false);

  function launch(event: React.MouseEvent<HTMLButtonElement>) {
    if (busy) return;
    setBusy(true);
    setCheering(true);
    runLaunch({
      from: event.currentTarget.getBoundingClientRect(),
      rocketSrc: ROCKET,
      onLiftoff: () => setOnPad(false),
      onDone: () => {
        setOnPad(true);
        setCheering(false);
        setBusy(false);
      },
    });
  }

  const arms = cheering ? "M8 26 L3 4 M22 26 L27 4" : "M8 26 L8 26";

  return (
    <div className="ax-wrap ax-launch">
      <div className="ax-launch__ground">
        <div className={`ax-crowd${cheering ? " is-cheering" : ""}`} aria-hidden="true">
          {ROWS.map((row, r) => (
            <div key={r} className="ax-crowd__row" style={{ bottom: row.bottom, paddingRight: r * 6 }}>
              {row.people.map((p, i) => (
                <svg
                  key={i}
                  className="ax-crowd__person"
                  width={row.w}
                  height={row.h}
                  viewBox="0 0 30 58"
                  style={{ marginLeft: row.gap, animationDelay: `${p.delay}s` }}
                >
                  <path d={arms} stroke={p.body} strokeWidth="5" strokeLinecap="round" fill="none" />
                  <rect x="4" y="20" width="22" height="38" rx="10" fill={p.body} />
                  <circle cx="15" cy="11" r="10" fill={p.head} />
                </svg>
              ))}
            </div>
          ))}
        </div>
        <button type="button" className="ax-pad-btn" onClick={launch} aria-label="Launch the rocket back to the top of the page">
          <span className="ax-pad-btn__label">Launch to top</span>
          <span className="ax-pad-btn__stage">
            <svg width="84" height="106" viewBox="0 0 84 106" aria-hidden="true">
              <rect x="60" y="4" width="3" height="96" fill="#3A3A3A" />
              <rect x="56" y="22" width="11" height="2" fill="#3A3A3A" />
              <rect x="56" y="58" width="11" height="2" fill="#3A3A3A" />
              <rect x="4" y="100" width="76" height="6" rx="1" fill="#3A3A3A" />
              <rect x="30" y="94" width="24" height="6" fill="#262626" />
            </svg>
            {onPad && <img className="ax-pad-btn__rocket" src={ROCKET} alt="" />}
          </span>
        </button>
      </div>
    </div>
  );
}
