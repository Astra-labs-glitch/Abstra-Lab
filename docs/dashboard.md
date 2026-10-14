# Member area and admin (`/dashboard`)

Rebuilt in Oct 2026. Signed-in members land on **My account**; exec (staff) and
admins get the full admin. In the site header, staff see an **Admin** chip and an
**Edit website** chip next to the logo; members see **My account**.

| Page | Who | What it does |
| --- | --- | --- |
| `/dashboard` | staff | Overview: new applications, pending sign-ups, events, pages switched off |
| `/dashboard/account` | everyone | Own photo, name, program, bio, links, private résumé, show-on-Team switch |
| `/dashboard/events` | staff | Post events with photos for the public `/events` page (publish / draft) |
| `/dashboard/jobs` | staff | Job roles; open roles show on `/jobs` with an Apply pop-up |
| `/dashboard/applications` | staff | Applications, status, notes, private résumé download |
| `/dashboard/team` | staff | Group, title, order and visibility of people on `/team` |
| `/dashboard/members` | staff | Approve sign-ups with a team group + title, set Member / Exec / Admin |
| `/dashboard/pages` | staff | Switch Team, Events, Jobs, Gallery, Sponsor between Live and Under construction |

## Edit website

Staff click **Edit website** in the header. Every `[data-edit-key]` element on the
page becomes editable (text only). **Save changes** posts to `/api/site-text`,
which stores overrides in `astra_site_text` and revalidates the site. Clearing a
box removes the override and the original text comes back.

To make more text editable, render it with `t("page.some-key", "Default text")`
from `getSiteText()` and put `data-edit-key="page.some-key"` on the element (or
use `<Editable t={t} k="…" d="…" as="p" />`).

## Storage

Photos and résumés are stored in Postgres (`astra_profile`, `astra_event_photo`,
`astra_job_application`). Photos are resized in the browser before upload.
Résumés are only served to the owner and staff.
