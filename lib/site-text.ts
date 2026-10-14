import { hasDatabase, prisma } from "./prisma";

// Text on the public site that admins can change from /dashboard/site-text.
// The default is what shows until someone saves a new value. To make another
// piece of text editable, add it here and read it with getSiteText() on the page.

export type TextField = {
  key: string;
  label: string;
  default: string;
  long?: boolean;
};

export type TextGroup = {
  page: string;
  path: string;
  title: string;
  fields: TextField[];
};

export const SITE_TEXT: TextGroup[] = [
  {
    page: "home",
    path: "/",
    title: "Home",
    fields: [
      { key: "home.hero.label", label: "Hero: small label", default: "Team 06 · Seneca Polytechnic" },
      { key: "home.hero.title", label: "Hero: headline", default: "We build rockets at Seneca." },
      {
        key: "home.hero.body",
        label: "Hero: paragraph",
        long: true,
        default:
          "20-odd students, seven programs, one red rocket. Pioneer made it to Launch Canada in Timmins this August. The weather cancelled our launch, so we're refitting it and starting a second rocket for 2027.",
      },
      { key: "home.status.1.title", label: "Status strip 1: title", default: "Pioneer" },
      { key: "home.status.1.body", label: "Status strip 1: text", default: "New G10 bulkhead going in. Flight-ready target: Nov 30." },
      { key: "home.status.2.title", label: "Status strip 2: title", default: "2027 rocket" },
      { key: "home.status.2.body", label: "Status strip 2: text", default: "First design review Nov 30. Preliminary review Jan 31." },
      { key: "home.status.3.title", label: "Status strip 3: title", default: "Recruiting" },
      { key: "home.status.3.body", label: "Status strip 3: text", default: "Any program. No rocketry experience needed." },
    ],
  },
  {
    page: "jobs",
    path: "/jobs",
    title: "Jobs",
    fields: [
      { key: "jobs.hero.label", label: "Hero: small label", default: "Job board · Fall 2026" },
      { key: "jobs.hero.title", label: "Hero: headline", default: "We're recruiting." },
      {
        key: "jobs.hero.body",
        label: "Hero: paragraph",
        long: true,
        default:
          "Pick a role, read what you'd actually do, and apply with your resume. You don't need to have built a rocket. Here's the deal:",
      },
      { key: "jobs.deal.who", label: "Deal: Who", default: "Any Seneca student, any program" },
      { key: "jobs.deal.time", label: "Deal: Time", default: "About five hours a week" },
      { key: "jobs.deal.commitment", label: "Deal: Commitment", default: "At least six months, so you see a build through" },
      { key: "jobs.deal.where", label: "Deal: Where", default: "SSF clubs room" },
      { key: "jobs.deal.when", label: "Deal: When", default: "Every Friday, 5–7 pm (our weekly meeting)" },
      { key: "jobs.roles.label", label: "Roles: small label", default: "Open roles · Fall 2026" },
      { key: "jobs.tuned.title", label: "No open roles: headline", default: "Stay tuned." },
      {
        key: "jobs.tuned.body",
        label: "No open roles: paragraph",
        long: true,
        default:
          "New roles are on the way. The exec team posts them here, each with what you'd do, the projects and how to apply. Until then, come to a Friday meeting and say hi.",
      },
    ],
  },
  {
    page: "sponsor",
    path: "/sponsorship",
    title: "Sponsor",
    fields: [
      { key: "sponsor.hero.label", label: "Hero: small label", default: "Sponsorship · 2026–27 season" },
      { key: "sponsor.hero.title", label: "Hero: headline", default: "Put your name on the next rocket." },
      {
        key: "sponsor.hero.body",
        label: "Hero: paragraph",
        long: true,
        default:
          "We're a student club building two rockets this year: Pioneer's refit and a new rocket for Launch Canada 2027. Here's where support goes and what you get back.",
      },
    ],
  },
];

const FIELDS = new Map(SITE_TEXT.flatMap((g) => g.fields.map((f) => [f.key, f] as const)));

export function isTextKey(key: string) {
  return FIELDS.has(key);
}

export function groupForKey(key: string) {
  return SITE_TEXT.find((g) => g.fields.some((f) => f.key === key));
}

/** Returns a lookup for one page's text: saved value if there is one, otherwise the default. */
export async function getSiteText(page: string) {
  const group = SITE_TEXT.find((g) => g.page === page);
  const values = new Map<string, string>();
  if (group && hasDatabase()) {
    try {
      const rows = await prisma.siteText.findMany({
        where: { key: { in: group.fields.map((f) => f.key) } },
      });
      for (const row of rows) if (row.value.trim()) values.set(row.key, row.value);
    } catch (error) {
      // Table missing or database unreachable: fall back to the defaults.
      console.error("site text unavailable", error);
    }
  }
  return (key: string) => values.get(key) ?? FIELDS.get(key)?.default ?? "";
}
