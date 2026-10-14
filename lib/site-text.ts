import { hasDatabase, prisma } from "./prisma";

// Words on the public site that admins change with "Edit website".
// Pages call t("some.key", "default text"); the default shows until someone saves
// a new value. Keys are free-form (lowercase, dots), so adding editable text to a
// page is just wrapping it in <Editable k="..."> with its default.

export const TEXT_KEY = /^[a-z0-9][a-z0-9.\-]{0,79}$/;

export async function getSiteText() {
  const values = new Map<string, string>();
  if (hasDatabase()) {
    try {
      const rows = await prisma.siteText.findMany();
      for (const row of rows) if (row.value.trim()) values.set(row.key, row.value);
    } catch (error) {
      console.error("site text unavailable", error);
    }
  }
  return (key: string, fallback: string) => values.get(key) ?? fallback;
}

/* ── Page switches: Live or Under construction ── */

export const SITE_PAGES = [
  { key: "team", path: "/team", name: "Team" },
  { key: "events", path: "/events", name: "Events" },
  { key: "jobs", path: "/jobs", name: "Jobs" },
  { key: "gallery", path: "/gallery", name: "Gallery" },
  { key: "sponsor", path: "/sponsorship", name: "Sponsor" },
] as const;

export type PageKey = (typeof SITE_PAGES)[number]["key"];

/** Every page is live unless an admin switched it off. Team starts off until profiles are in. */
const DEFAULT_LIVE: Record<PageKey, boolean> = { team: false, events: true, jobs: true, gallery: true, sponsor: true };

export async function pageStatus(): Promise<Record<PageKey, boolean>> {
  const status = { ...DEFAULT_LIVE };
  if (!hasDatabase()) return status;
  try {
    const rows = await prisma.sitePage.findMany();
    for (const row of rows) if (row.key in status) status[row.key as PageKey] = row.live;
  } catch (error) {
    console.error("page status unavailable", error);
  }
  return status;
}

export async function isPageLive(key: PageKey) {
  return (await pageStatus())[key];
}

/* ── Team structure ── */

export const TEAM_GROUPS = ["Leadership", "Airframe", "Avionics & recovery", "Payload", "Ground software & data", "Operations"];
export const SUBTEAM_CHOICES = [...TEAM_GROUPS.slice(1), "Not sure yet"];
export const EVENT_TYPES = ["Outreach", "Launch", "Workshop", "Conference", "Meeting"];
