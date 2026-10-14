"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStaff } from "../../lib/auth";
import { APPLICATION_STATUSES, ROLE_STATUSES } from "../../lib/jobs";
import { prisma } from "../../lib/prisma";
import { SITE_TEXT, isTextKey } from "../../lib/site-text";

async function guardStaff() {
  const staff = await requireStaff();
  if (!staff) redirect("/accounts/login");
  return staff;
}

async function guardAdmin() {
  const staff = await guardStaff();
  if (!staff.isSuperuser) redirect("/dashboard?error=admin_only");
  return staff;
}

function str(formData: FormData, key: string, max = 5000) {
  return String(formData.get(key) || "").trim().slice(0, max);
}

const roleStatuses = new Set<string>(ROLE_STATUSES.map(([v]) => v));
const appStatuses = new Set<string>(APPLICATION_STATUSES.map(([v]) => v));

function refreshJobs() {
  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/jobs");
  revalidatePath("/dashboard/applications");
}

/* ── Job roles ── */

function roleData(formData: FormData) {
  const status = str(formData, "status");
  return {
    title: str(formData, "title", 140),
    subteam: str(formData, "subteam", 80),
    summary: str(formData, "summary", 600),
    duties: str(formData, "duties", 3000),
    requirements: str(formData, "requirements", 3000),
    commitment: str(formData, "commitment", 140),
    status: roleStatuses.has(status) ? status : "draft",
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };
}

export async function saveRole(formData: FormData) {
  await guardStaff();
  const id = Number(formData.get("id")) || 0;
  const data = roleData(formData);
  if (!data.title) redirect(id ? `/dashboard/jobs/${id}?error=title` : "/dashboard/jobs/new?error=title");
  if (id) await prisma.jobRole.update({ where: { id }, data });
  else await prisma.jobRole.create({ data });
  refreshJobs();
  redirect("/dashboard/jobs?saved=1");
}

export async function setRoleStatus(formData: FormData) {
  await guardStaff();
  const id = Number(formData.get("id"));
  const status = str(formData, "status");
  if (!id || !roleStatuses.has(status)) return;
  await prisma.jobRole.update({ where: { id }, data: { status } });
  refreshJobs();
}

export async function deleteRole(formData: FormData) {
  await guardAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  // Applications (and their résumés) are deleted with the role.
  await prisma.jobRole.delete({ where: { id } });
  refreshJobs();
  redirect("/dashboard/jobs?deleted=1");
}

/* ── Applications ── */

export async function updateApplication(formData: FormData) {
  await guardStaff();
  const id = Number(formData.get("id"));
  const status = str(formData, "status");
  if (!id) return;
  await prisma.jobApplication.update({
    where: { id },
    data: {
      ...(appStatuses.has(status) ? { status } : {}),
      notes: str(formData, "notes", 5000),
    },
  });
  refreshJobs();
  revalidatePath(`/dashboard/applications/${id}`);
}

export async function deleteApplication(formData: FormData) {
  await guardAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  await prisma.jobApplication.delete({ where: { id } });
  refreshJobs();
  redirect("/dashboard/applications?deleted=1");
}

/* ── Members ── */

function refreshMembers() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/members");
}

export async function approveUser(formData: FormData) {
  await guardStaff();
  const id = Number(formData.get("userId"));
  if (!id) return;
  await prisma.user.update({ where: { id }, data: { isActive: true } });
  refreshMembers();
}

// Turns down a pending sign-up by removing the account. Only works on accounts
// that were never approved, so it can't wipe out a real member.
export async function declineUser(formData: FormData) {
  await guardStaff();
  const id = Number(formData.get("userId"));
  const user = id ? await prisma.user.findUnique({ where: { id } }) : null;
  if (!user || user.isActive || user.isStaff || user.isSuperuser) return;
  try {
    await prisma.$transaction([
      prisma.memberProfile.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);
  } catch {
    // They've authored posts/events, so they're a real former member: leave the account deactivated.
  }
  refreshMembers();
}

export async function setUserActive(formData: FormData) {
  const me = await guardStaff();
  const id = Number(formData.get("userId"));
  const active = formData.get("active") === "1";
  if (!id || id === me.id) return;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || (user.isSuperuser && !me.isSuperuser)) return;
  await prisma.user.update({ where: { id }, data: { isActive: active } });
  refreshMembers();
}

export async function setUserRole(formData: FormData) {
  const me = await guardAdmin();
  const id = Number(formData.get("userId"));
  const role = str(formData, "role");
  if (!id || id === me.id || !["member", "staff", "admin"].includes(role)) return;
  await prisma.user.update({
    where: { id },
    data: {
      isStaff: role !== "member",
      isSuperuser: role === "admin",
      ...(role !== "member" ? { isActive: true } : {}),
    },
  });
  refreshMembers();
}

/* ── Site text ── */

export async function saveSiteText(formData: FormData) {
  const me = await guardStaff();
  const page = str(formData, "page");
  const group = SITE_TEXT.find((g) => g.page === page);
  if (!group) return;

  for (const field of group.fields) {
    if (!isTextKey(field.key)) continue;
    const value = String(formData.get(field.key) ?? "").trim().slice(0, 2000);
    if (!value || value === field.default) {
      // Empty or unchanged: drop the override so the default shows.
      await prisma.siteText.deleteMany({ where: { key: field.key } });
    } else {
      await prisma.siteText.upsert({
        where: { key: field.key },
        create: { key: field.key, value, updatedBy: me.username },
        update: { value, updatedBy: me.username },
      });
    }
  }
  revalidatePath(group.path);
  revalidatePath("/dashboard/site-text");
  redirect(`/dashboard/site-text?page=${group.page}&saved=1`);
}
