import { hasDatabase, prisma } from "./prisma";

export const ROLE_STATUSES = [
  ["open", "Open"],
  ["draft", "Draft"],
  ["closed", "Closed"],
] as const;

export const APPLICATION_STATUSES = [
  ["new", "New"],
  ["reviewing", "Reviewing"],
  ["interview", "Interview"],
  ["accepted", "Accepted"],
  ["declined", "Declined"],
] as const;

// Vercel caps a request body at 4.5 MB, so keep the résumé under that.
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

export const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function lines(value: string) {
  return value
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export type PublicRole = {
  id: number;
  title: string;
  subteam: string;
  summary: string;
  duties: string[];
  requirements: string[];
  commitment: string;
};

/** Open roles for the public /jobs page. Never throws: no database means no roles. */
export async function openRoles(): Promise<PublicRole[]> {
  if (!hasDatabase()) return [];
  try {
    const roles = await prisma.jobRole.findMany({
      where: { status: "open" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return roles.map((r) => ({
      id: r.id,
      title: r.title,
      subteam: r.subteam,
      summary: r.summary,
      duties: lines(r.duties),
      requirements: lines(r.requirements),
      commitment: r.commitment,
    }));
  } catch (error) {
    console.error("job roles unavailable", error);
    return [];
  }
}
