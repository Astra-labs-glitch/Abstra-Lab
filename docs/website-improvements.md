# Website improvements change list

Working backlog from the club [Website Improvements](https://docs.google.com/document/d/1Vag1CQUgSnkyJggJT8RQ-HhafNZe2hVNBTiyJgKF8H0/edit) doc, plus clarifications from implementation planning.

**Production domain:** [alsp.ca](https://alsp.ca)  
**Reference UIs:** [tfssrocketry.com](https://tfssrocketry.com/), [usst.ca](https://www.usst.ca/)  
**Design guideline (Canva):** red/white palette `#c72c2b` `#f48b8b` `#ffffff` `#000000` `#ee3534`

## Done

- [x] Home hero → `/images/pick/lc-team-portrait.jpg`; remove that photo from the home about split
- [x] OG/default social image → same team portrait
- [x] Logo text → **Astra Labs Seneca Polytechnic** (header + footer)
- [x] Inline primary nav in the header (desktop ≥1100px); burger drawer kept for smaller screens
- [x] Prioritize **About** and **Join** in nav order
- [x] ALSP full form on the home hero (`Astra Labs Seneca Polytechnic · ALSP`)
- [x] Archive Login / signup / dashboard from public UI (nav + footer); redirects to `/`
- [x] `/discord` redirects to `/join#discord`
- [x] Discord section on **Join**; Discord removed from **Contact** channels/CTAs
- [x] Sponsorship gallery: remove Flight data, Electronics table, Range tent
- [x] Remove RobotShop supporter logo
- [x] Feature Seneca MyNews article on `/posts` (link-out card; iframe not used)
- [x] Update e2e smoke + sitemap for archived auth/discord routes
- [x] Red/white brand palette + link polish (CSS variables `--brand`, `--brand-bright`, `--brand-soft`; filled CTAs; content links)
- [x] Favicon (`app/icon.svg` — red “A” mark on black)
- [x] Sponsor logos on page are already PNG (SSF, Seneca Alumni, STAR); RobotShop JPG removed from UI
- [x] Remove sponsorship package breakdown (contents list + tiers table); PDF download remains
- [x] About → **Team & History** framing (`#history`, `#team`)
- [x] Nav label **News** → `/posts`; `/news` redirects to `/posts`
- [x] Broader UI refresh: Barlow via `next/font`, scroll-reveal motion, home “Start here” mission strip + closing join CTA, stats brand marks, header/footer accents, split media hover, active nav state
- [x] Staging docs for `dev.alsp.ca` — see [staging.md](./staging.md)
- [x] Staging repo kit — `.env.staging.example`, `npm run deploy:preview`, `npm run e2e:staging`

## Still open

- [ ] **Operator action:** `npx vercel login` → link project → add DNS `dev` CNAME → `npx vercel domains add dev.alsp.ca` → set Preview env vars (runbook: [staging.md](./staging.md))
- [ ] Restore member login/CMS later (code remains under `app/dashboard`, `app/accounts`, `lib/auth`; only public entry points archived)

## Clarifications captured

1. **Archive Login** — hide from nav and remove public signup/dashboard for now (redirects; code kept).
2. **Home picture** — team portrait for hero; do not also show it in the about split.
3. **Sponsorship pics removed** — Flight data, Electronics table, Range tent.
4. **Discord** — lives on Join; not in Contact.
5. **News** — CMS posts when available + featured Seneca article link on `/posts`.
6. **`dev.alsp.ca`** — yes; add DNS + Vercel domain on a non-prod deployment.
