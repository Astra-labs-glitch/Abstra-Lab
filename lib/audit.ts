import { hasDatabase, prisma } from "./prisma";

/** Records who changed what in the admin. Never throws: a failed log line must not block the change. */
export async function audit(actor: string, action: string, target = "") {
  if (!hasDatabase()) return;
  await prisma.auditLog
    .create({ data: { actor: actor.slice(0, 150), action: action.slice(0, 120), target: target.slice(0, 300) } })
    .catch((error) => console.error("audit log failed", error));
}

export async function recentAudit(take = 15) {
  if (!hasDatabase()) return [];
  return prisma.auditLog.findMany({ orderBy: { at: "desc" }, take }).catch(() => []);
}

/** Résumés and applications are kept for 12 months, as the privacy policy says. */
export const RETENTION_DAYS = 365;

export async function purgeOldApplications() {
  if (!hasDatabase()) return 0;
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000);
  try {
    const { count } = await prisma.jobApplication.deleteMany({ where: { createdAt: { lt: cutoff } } });
    if (count) await audit("system", "Deleted applications older than 12 months", `${count} removed`);
    return count;
  } catch (error) {
    console.error("application purge failed", error);
    return 0;
  }
}
