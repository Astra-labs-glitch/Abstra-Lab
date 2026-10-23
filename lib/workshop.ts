import { hasDatabase, prisma } from "./prisma";

export const WORKSHOP_LEVELS = [
  ["k12", "High school (K-12)"],
  ["college", "College"],
  ["university", "University"],
  ["other", "Other"],
] as const;

export type WorkshopLevel = (typeof WORKSHOP_LEVELS)[number][0];

export function levelLabel(level: string) {
  return WORKSHOP_LEVELS.find(([v]) => v === level)?.[1] ?? "Other";
}

/** Sign-ups are kept for 12 months at most, as the privacy policy says. */
export async function purgeOldSignups() {
  if (!hasDatabase()) return 0;
  const cutoff = new Date(Date.now() - 365 * 86_400_000);
  try {
    const { count } = await prisma.workshopSignup.deleteMany({ where: { createdAt: { lt: cutoff } } });
    return count;
  } catch (error) {
    // Table doesn't exist until this ships to production (schema pushes run on production builds only).
    console.error("workshop purge skipped", error);
    return 0;
  }
}
