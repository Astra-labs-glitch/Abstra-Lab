# Content editing

> **Oct 2026.** Most words on the public site are changed with **✎ Edit website** (staff only, next to the logo): click outlined text, edit, save. Defaults live in the page files; saved changes live in the `astra_site_text` table. Each page can be switched to *Under construction* in **Admin → Pages**.
>
> Pages: home (`app/page.tsx`: hero, status, rocket list, Timmins diary, crew, supporters), **Projects** dropdown → Rockets (`app/rockets/pioneer`, `app/rockets/2027`) and Payloads (`app/payloads/picosat`, `app/payloads/hivemind`), the Hivemind workshop sign-up `app/workshop` (QR codes point to `/workshop?from=qr`), `app/team`, `app/events`, `app/gallery` (`gallery-grid.tsx`), `app/sponsorship`, `app/jobs` (open volunteer roles as a filterable card grid plus a public handbook tab, `handbook.tsx`; starter roles live in `lib/starter-roles.ts` and are added from Admin → Job roles; reached from the red **Join us** button and the footer, not the menu), `app/privacy`, `app/terms`. The menu is in `app/site-shell.tsx` (`rockets` and `navItems`). Styles: `app/astra.css`. Photos: `public/images/astra/`.
>
> The Pioneer page still uses `home.*` text keys because it used to sit on the home page; that keeps any saved wording.

Almost everything a non-developer would change lives in **`app/content.ts`**. Shared layout pieces are in `app/page-sections.tsx`; navigation is in `app/site-shell.tsx`.

## Primary content file (`app/content.ts`)

Exports include (non-exhaustive):

| Export                                                                      | Used for                          |
| --------------------------------------------------------------------------- | --------------------------------- |
| `fieldGallery`, `launchCanadaGallery`, `technicalGallery`, `sponsorGallery` | Photo mosaics                     |
| `leadership`, `values`, `faculty`, `partners`                               | About / home                      |
| `pioneerProjects`, `judgingPhases`, `launchCanada`                          | Pioneer & Launch Canada pages     |
| `collaborations`, `workshop`, `eventFaqs`                                   | Join / events narrative           |
| `sponsorPackage`, `sponsorTiers`, `sponsorGoals`, …                         | Sponsorship page                  |
| `contact`, `discordInviteUrl`, `clubSignupUrl`                              | Contact, Discord, SSF club signup |

Judging phases and Launch Canada scoring copy are sourced from the 2026 Rules & Requirements Guide (full PDFs live in git-ignored `references/` — ask a lead).

## Galleries

Each gallery is an array of tuples:

```ts
[image, title, caption, modifier];
```

- **`image`** — path under `public/images/` (e.g. `"pick/lc-team-portrait.jpg"`).
- **`modifier`** — `""` | `"wide"` (2 columns) | `"tall"` (2 rows) | `"feature"` (2×2; use once per gallery, typically first).

## Navigation

Edit `navItems` in `app/site-shell.tsx`:

```ts
const navItems = [
	["Pioneer", "/pioneer"],
	["Launch Canada", "/launch-canada"],
	// …
] as const;
```

Discord in the menu/footer uses `discordHref` from `content.ts`. Env var `NEXT_PUBLIC_DISCORD_INVITE_URL` overrides the hardcoded invite without a code change.

## Contact and Discord

| Field                             | Source                                                 |
| --------------------------------- | ------------------------------------------------------ |
| Email / LinkedIn / campus address | `contact` in `content.ts`                              |
| Discord invite                    | `discordInviteUrl` or `NEXT_PUBLIC_DISCORD_INVITE_URL` |
| SSF club signup link              | `clubSignupUrl`                                        |

## Adding photos

Never commit phone originals (large files + GPS EXIF). Resize and strip metadata with ImageMagick:

```sh
magick "IMG_1234.jpg" -auto-orient -resize 1920x1920 -strip -quality 82 public/images/pick/my-photo.jpg
```

Then reference `"pick/my-photo.jpg"` in a gallery array.

## Adding video clips

Encode under `public/media/events/…` and register in `app/launch-canada/videos.tsx`.

```sh
ffmpeg -y -i clip.mp4 -map_metadata -1 -vf "scale=-2:720" -c:v libx264 -preset slow -crf 23 \
  -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart public/media/events/2026/08/clip.mp4
ffmpeg -y -ss 1 -i public/media/events/2026/08/clip.mp4 -frames:v 1 -q:v 4 public/media/events/2026/08/clip.jpg
```

Portrait clips: use `scale=720:-2` instead.

## CMS-managed content (not in `content.ts`)

Published via Dashboard → Staff (requires DB + staff account):

- **Posts** → `/posts`, `/posts/[slug]`, `/api/public/posts`
- **Events** → `/events`, `/api/public/events`
- **Resources / build materials** → member dashboard resources

Image fields on CMS forms take a URL path. Upload via `POST /api/upload` or place files under `public/` and reference them directly. Details: [Dashboard](./dashboard.md) and [API](./api.md).

## SEO

- Default metadata: `app/layout.tsx`
- Helpers: `app/seo.ts`
- Sitemap / robots: `app/sitemap.ts`, `app/robots.ts`
- Canonical base URL: `NEXT_PUBLIC_SITE_URL` (production: `https://alsp.ca`)

## After content changes

If you add a **new public route**, also add it to `PUBLIC_ROUTES` in `scripts/e2e-smoke.mjs` (see [Testing](./testing.md)).

## Hivemind documents

The Hivemind page shows the proposal and the SEDS-Canada letter in an on-page viewer (`app/payloads/hivemind/doc-viewer.tsx`). The viewer uses page images in `public/docs/hivemind/pages/` and `public/docs/hivemind/letter/`, rendered from the **redacted** PDF (budget, funding, contact details, names and partner names removed for real, not just covered). If the proposal changes, redact the new PDF again, re-render the pages (120 dpi WebP), and check the text layer has nothing sensitive before uploading.
