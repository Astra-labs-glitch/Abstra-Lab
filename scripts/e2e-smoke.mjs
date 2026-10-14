// Dependency-free end-to-end smoke test for the public site.
// Usage: BASE_URL=http://localhost:3005 node scripts/e2e-smoke.mjs
// Read-only: it never signs up, logs in with real credentials, or writes to the database.

const BASE = (process.env.BASE_URL ?? "http://localhost:3005").replace(/\/$/, "");
const failures = [];
let checks = 0;

function ok(cond, msg) {
  checks += 1;
  if (!cond) failures.push(msg);
  console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`);
}

async function get(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual", ...init });
  const text = await res.text().catch(() => "");
  return { status: res.status, headers: res.headers, text };
}

const PUBLIC_ROUTES = [
  "/", "/team", "/jobs", "/gallery", "/sponsorship", "/events", "/posts", "/discord",
  "/accounts/login", "/accounts/signup", "/accounts/pending",
  "/sitemap.xml", "/robots.txt",
];

const REQUIRED_NAV = [
  ["Pioneer", "/"], ["Team", "/team"], ["Jobs", "/jobs"], ["Gallery", "/gallery"], ["Sponsor", "/sponsorship"], ["Join us", "/jobs"],
];

const pages = new Map();

// 1. Every public route renders.
for (const route of PUBLIC_ROUTES) {
  const r = await get(route);
  ok(r.status === 200, `GET ${route} -> ${r.status}`);
  pages.set(route, r.text);
}

// 2. Redirects (old pages folded into the Oct 2026 redesign).
for (const [from, to] of [
  ["/sponsor", "/sponsorship"], ["/projects", "/#pioneer"], ["/work", "/#pioneer"],
  ["/pioneer", "/#pioneer"], ["/launch-canada", "/#timmins"], ["/about", "/team"],
  ["/members", "/team"], ["/join", "/jobs"], ["/contact", "/#thanks"],
]) {
  const r = await get(from);
  const loc = r.headers.get("location") ?? "";
  ok([301, 308].includes(r.status) && loc.endsWith(to), `redirect ${from} -> ${r.status} ${loc || "(none)"}`);
}

// 3. Content requirements.
const html = (p) => pages.get(p) ?? "";
ok(!/hero-launch\.jpg/.test(html("/")), "home no longer uses the SpaceX hero photo (hero-launch.jpg)");
ok(html("/").includes("/images/astra/hero-pioneer-range.jpg"), "home hero is our own Pioneer photo");
ok(/Launch canceled|Launch cancelled|called off for weather/i.test(html("/")), "home is honest that the 2026 launch was cancelled for weather");
ok(!/Picosatellite slots|>50</.test(html("/")), "home no longer claims 50 picosatellite slots");
ok(/Under construction/i.test(html("/team")), "team page shows the under-construction notice");
ok(/Stay tuned/i.test(html("/jobs")) && /SSF clubs room/.test(html("/jobs")) && /Friday, 5–7 pm/.test(html("/jobs")), "jobs page has Stay tuned and the Friday meeting details");
ok(/sponsorship-package-astra-labs\.pdf/.test(html("/sponsorship")), "sponsorship page links the package PDF");
ok((html("/sponsorship").match(/class="ax-logo-tile"/g) ?? []).length >= 6, "sponsorship page shows the supporter logo wall");
ok(/mailto:astralabsengineering@gmail\.com/.test(html("/")), "footer has the club email");
ok(/href="https:\/\/discord\.gg\/[A-Za-z0-9]+"[^>]*target="_blank"/.test(html("/")), "footer Discord link opens the invite in a new tab");
ok(/href="https:\/\/discord\.gg\//.test(html("/discord")), "discord page links to the invite");
ok(/Launch the rocket back to the top/.test(html("/gallery")), "launch-to-top rocket is in the footer on every page");

// 4. Main menu items.
const nav = html("/").match(/<nav[^>]*id="site-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
for (const [label, href] of REQUIRED_NAV) {
  const re = new RegExp(`href="${href.replace(/[#/]/g, (c) => "\\" + c)}"[^>]*>\\s*${label}`);
  ok(re.test(nav), `menu has "${label}" -> ${href}`);
}
ok(!/href="\/sponsor"/.test(html("/")) && !/href="\/sponsor"/.test(nav), "no stale /sponsor links on home or menu");

// 5. Sitemap.
const sitemap = html("/sitemap.xml");
for (const path of ["/team", "/jobs", "/gallery", "/sponsorship"]) ok(sitemap.includes(`${path}<`), `sitemap includes ${path}`);
for (const path of ["/sponsor", "/pioneer", "/contact"]) ok(!sitemap.includes(`${path}<`), `sitemap excludes old ${path}`);

// 6. Every internal link and image on the public pages resolves.
const seen = new Set();
const assetChecks = [];
for (const [route, text] of pages) {
  if (!/<html/i.test(text)) continue;
  const links = [...text.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  const imgs = [...text.matchAll(/(?:src="|url\(&#x27;|url\('|url\(")(\/[^"'&)]+)/g)].map((m) => m[1]);
  for (const target of [...links, ...imgs]) {
    if (seen.has(target) || target.startsWith("/_next") || target.startsWith("/dashboard") || target.startsWith("/api")) continue;
    seen.add(target);
    assetChecks.push(get(target, { method: "HEAD" }).then((r) => ok([200, 301, 308].includes(r.status), `asset/link ${target} (from ${route}) -> ${r.status}`)));
  }
}
await Promise.all(assetChecks);

// 7. Auth surface stays closed (no writes).
const bad = await get("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ login: "nobody@example.invalid", password: "wrong-password" }) });
ok([400, 401, 403, 404, 422, 503].includes(bad.status), `POST /api/auth/login with bad credentials rejected -> ${bad.status}`);
const dash = await get("/dashboard");
ok([302, 303, 307, 308].includes(dash.status) || dash.status === 401, `GET /dashboard unauthenticated -> ${dash.status} (redirect/denied)`);

console.log(`\n${checks - failures.length}/${checks} checks passed`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures) console.log(` - ${f}`);
  process.exit(1);
}
