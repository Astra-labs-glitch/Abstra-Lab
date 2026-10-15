// The footer launch: 3-2-1 countdown, a sky that fills with clouds, birds and
// planes, then the rocket climbs on a slant, parting clouds and scattering birds.
// Plain DOM in a fixed overlay so the animation stays smooth and never re-renders React.

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
const nextFrame = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

function cloudSVG(w: number) {
  const puffs: [number, number, number][] = [
    [22, 31, 11],
    [42, 21, 14],
    [64, 25, 12],
    [82, 33, 8.5],
    [50, 36, 15],
  ];
  return `<svg width="${w}" height="${Math.round(w / 2)}" viewBox="0 0 100 50"><g fill="#f4f4f4">${puffs
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`)
    .join("")}<rect x="12" y="32" width="76" height="16" rx="8"/></g><rect x="16" y="40" width="68" height="8" rx="4" fill="#d9d9d9" opacity=".55"/></svg>`;
}

const birdSVG = (w: number) =>
  `<svg width="${w}" height="${w * 0.45}" viewBox="0 0 20 9"><path d="M1 7 Q5.5 0 10 6 Q14.5 0 19 7" fill="none" stroke="#cfcfcf" stroke-width="1.8" stroke-linecap="round"/></svg>`;

const planeSVG = (w: number, flip: boolean) =>
  `<svg width="${w}" height="${w * 0.4}" viewBox="0 0 50 20" style="transform:scaleX(${flip ? -1 : 1})"><g fill="#d9d9d9"><path d="M2 10 L40 8 Q48 8.5 48 10 Q48 11.5 40 12 L2 10 Z"/><path d="M20 9 L28 1 L32 1 L27 9 Z"/><path d="M20 11 L28 19 L32 19 L27 11 Z"/><path d="M4 10 L2 3 L6 3 L10 9 Z"/></g><circle class="ax-blink" cx="30" cy="1.5" r="1.4" fill="#ee3534"/><circle class="ax-blink" cx="30" cy="18.5" r="1.4" fill="#5fd38a" style="animation-delay:.45s"/></svg>`;

type Cloud = { el: HTMLDivElement; y: number; w: number; cx: number; parted: boolean };
type Bird = { el: HTMLDivElement; y: number; scattered: boolean };

export async function runLaunch(opts: { from: DOMRect; rocketSrc: string; onLiftoff: () => void; onDone: () => void }) {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    window.scrollTo({ top: 0 });
    opts.onDone();
    return;
  }

  const sky = document.createElement("div");
  sky.className = "ax-sky";
  sky.setAttribute("aria-hidden", "true");
  document.body.appendChild(sky);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const x0 = opts.from.left + opts.from.width / 2 - 16;
  const startY = opts.from.bottom - 62;
  const endY = -200;
  const drift = Math.max(-vw * 0.35, Math.min(vw * 0.35, (vw / 2 - x0) * 0.7)) || -120;
  const pathX = (y: number) => x0 + drift * Math.pow(Math.max(0, (startY - y) / (startY - endY)), 1.3);
  const total = vw < 640 ? 14 : 22; // fewer on phones
  const clouds: Cloud[] = [];
  const birds: Bird[] = [];

  function addCloud() {
    const w = rand(vw < 640 ? 70 : 90, vw < 640 ? 170 : 260);
    const y = rand(vh * 0.02, vh * 0.72);
    const cx = Math.random() < 0.6 ? pathX(y) + 16 + rand(-160, 160) : rand(0, vw);
    const left = Math.max(-w * 0.4, Math.min(vw - w * 0.6, cx - w / 2));
    const el = document.createElement("div");
    el.className = "ax-cloud";
    el.innerHTML = cloudSVG(w);
    el.style.left = `${left}px`;
    el.style.top = `${y}px`;
    sky.appendChild(el);
    clouds.push({ el, y, w, cx: left + w / 2, parted: false });
    nextFrame(() => {
      el.style.opacity = String(rand(0.82, 0.98));
      el.style.transform = "scale(1)";
    });
  }

  function addFlock() {
    const fromLeft = Math.random() < 0.5;
    const y = rand(vh * 0.05, vh * 0.55);
    const size = rand(14, 24);
    const count = 3 + Math.floor(Math.random() * 4);
    const speed = rand(28, 45);
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "ax-bird";
      el.innerHTML = birdSVG(size * rand(0.8, 1.1));
      const by = y + (i % 2 ? 1 : -1) * i * 7;
      el.style.left = `${fromLeft ? -40 - i * 18 : vw + 40 + i * 18}px`;
      el.style.top = `${by}px`;
      (el.firstChild as SVGElement).style.animationDelay = `${rand(0, 0.28)}s`;
      el.style.transition = `transform ${speed}s linear`;
      sky.appendChild(el);
      nextFrame(() => (el.style.transform = `translateX(${fromLeft ? vw + 160 : -vw - 160}px)`));
      birds.push({ el, y: by, scattered: false });
    }
  }

  function addPlane() {
    const fromLeft = Math.random() < 0.5;
    const el = document.createElement("div");
    el.className = "ax-plane";
    el.innerHTML = planeSVG(rand(38, 60), !fromLeft);
    el.style.left = `${fromLeft ? -80 : vw + 20}px`;
    el.style.top = `${rand(vh * 0.04, vh * 0.3)}px`;
    el.style.transition = `transform ${rand(9, 14)}s linear`;
    sky.appendChild(el);
    nextFrame(() => (el.style.transform = `translateX(${fromLeft ? vw + 120 : -vw - 120}px)`));
  }

  // 3-2-1 while the sky fills
  const perBeat = Math.ceil(total / 3);
  for (const num of ["3", "2", "1"]) {
    const c = document.createElement("p");
    c.className = "ax-count";
    c.textContent = num;
    sky.appendChild(c);
    for (let i = 0; i < perBeat; i++) window.setTimeout(addCloud, i * (650 / perBeat));
    if (num === "3") {
      addFlock();
      addPlane();
    }
    if (num === "2") addFlock();
    if (num === "1") {
      addFlock();
      if (vw >= 640) addPlane();
    }
    await wait(700);
    c.remove();
  }

  const lift = document.createElement("p");
  lift.className = "ax-liftoff";
  lift.textContent = "Liftoff!";
  sky.appendChild(lift);
  opts.onLiftoff();

  const rocket = document.createElement("div");
  rocket.className = "ax-rocketfly";
  rocket.innerHTML = `<img src="${opts.rocketSrc}" alt=""><div class="ax-flame"></div>`;
  sky.appendChild(rocket);

  const dur = 2300;
  const tilt = (Math.atan2(drift, startY - endY) * 180) / Math.PI;
  let t0: number | null = null;
  let lastPuff = 0;
  let scrolled = false;

  await new Promise<void>((resolve) => {
    function frame(now: number) {
      if (t0 === null) t0 = now;
      const p = Math.min(1, (now - t0) / dur);
      const ease = p * p * (3 - 2 * p) * 0.35 + p * p * 0.65;
      const y = startY + (endY - startY) * ease;
      const x = pathX(y);
      const lean = Math.min(1, p * 3) * tilt * 1.3;
      rocket.style.transform = `translate(${x}px, ${y}px) rotate(${lean}deg)`;

      if (now - lastPuff > 40 && p < 1) {
        lastPuff = now;
        const s = document.createElement("div");
        const size = rand(10, 20);
        s.className = "ax-smoke";
        s.style.cssText = `left:${x + 16 - size / 2 - Math.sin((lean * Math.PI) / 180) * 40}px;top:${y + 50}px;width:${size}px;height:${size}px`;
        sky.appendChild(s);
        requestAnimationFrame(() => {
          s.style.transform = `scale(${rand(2.2, 3.4)}) translateY(12px)`;
          s.style.opacity = "0";
        });
        window.setTimeout(() => s.remove(), 1700);
      }

      for (const c of clouds) {
        if (!c.parted && y < c.y + 40) {
          c.parted = true;
          const dir = c.cx < x + 16 ? -1 : 1;
          c.el.style.transition = "transform 1.2s cubic-bezier(.2,.7,.2,1), opacity 1.5s ease";
          c.el.style.transform = `translateX(${dir * (140 + c.w * 0.7)}px) scale(1.2)`;
          c.el.style.opacity = "0";
        }
      }
      for (const b of birds) {
        if (!b.scattered && Math.abs(y - b.y) < 120) {
          b.scattered = true;
          const m = new DOMMatrix(getComputedStyle(b.el).transform);
          b.el.style.transition = "transform 1.4s ease-out, opacity 1.4s ease";
          b.el.style.transform = `translate(${m.m41 + rand(-260, 260)}px, ${rand(-220, -90)}px)`;
          b.el.style.opacity = "0";
        }
      }
      if (!scrolled && p > 0.45) {
        scrolled = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (p < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });

  await wait(1200);
  sky.remove();
  opts.onDone();
}
