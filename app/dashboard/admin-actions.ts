"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStaff, requireUser } from "../../lib/auth";
import { audit } from "../../lib/audit";
import { APPLICATION_STATUSES, ROLE_STATUSES } from "../../lib/jobs";
import { prisma } from "../../lib/prisma";
import { STARTER_ROLES } from "../../lib/starter-roles";
import { EVENT_TYPES, SITE_PAGES, TEAM_GROUPS } from "../../lib/site-text";

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
  revalidatePath("/volunteer");
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
    area: str(formData, "area", 40),
    programs: str(formData, "programs", 200),
    spots: str(formData, "spots", 60),
    status: roleStatuses.has(status) ? status : "draft",
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };
}

export async function saveRole(formData: FormData) {
  const me = await guardStaff();
  const id = Number(formData.get("id")) || 0;
  const data = roleData(formData);
  if (!data.title) redirect(id ? `/dashboard/jobs/${id}?error=title` : "/dashboard/jobs/new?error=title");
  if (id) await prisma.jobRole.update({ where: { id }, data });
  else await prisma.jobRole.create({ data });
  await audit(me.username, id ? "Edited job role" : "Posted job role", data.title);
  refreshJobs();
  redirect("/dashboard/jobs?saved=1");
}

/** Adds the starter volunteer roles as drafts. Skips any title that already exists. */
export async function seedStarterRoles() {
  const me = await guardStaff();
  const have = new Set((await prisma.jobRole.findMany({ select: { title: true } })).map((r) => r.title));
  const fresh = STARTER_ROLES.filter((r) => !have.has(r.title));
  for (const [i, r] of fresh.entries()) await prisma.jobRole.create({ data: { ...r, status: "draft", sortOrder: i + 1 } });
  await audit(me.username, "Added starter volunteer roles (drafts)", `${fresh.length} roles`);
  refreshJobs();
  redirect("/dashboard/jobs?saved=1");
}

export async function setRoleStatus(formData: FormData) {
  const me = await guardStaff();
  const id = Number(formData.get("id"));
  const status = str(formData, "status");
  if (!id || !roleStatuses.has(status)) return;
  const role = await prisma.jobRole.update({ where: { id }, data: { status } });
  await audit(me.username, `Set job role to ${status}`, role.title);
  refreshJobs();
}

export async function deleteRole(formData: FormData) {
  const me = await guardAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  // Applications (and their résumés) are deleted with the role.
  const role = await prisma.jobRole.delete({ where: { id } });
  await audit(me.username, "Deleted job role and its applications", role.title);
  refreshJobs();
  redirect("/dashboard/jobs?deleted=1");
}

/* ── Applications ── */

export async function updateApplication(formData: FormData) {
  const me = await guardStaff();
  const id = Number(formData.get("id"));
  const status = str(formData, "status");
  if (!id) return;
  const app = await prisma.jobApplication.update({
    where: { id },
    data: {
      ...(appStatuses.has(status) ? { status } : {}),
      notes: str(formData, "notes", 5000),
    },
  });
  await audit(me.username, `Updated application (${app.status})`, app.name);
  refreshJobs();
  revalidatePath(`/dashboard/applications/${id}`);
}

export async function deleteApplication(formData: FormData) {
  const me = await guardAdmin();
  const id = Number(formData.get("id"));
  if (!id) return;
  const app = await prisma.jobApplication.delete({ where: { id }, select: { name: true } });
  await audit(me.username, "Deleted application", app.name);
  refreshJobs();
  redirect("/dashboard/applications?deleted=1");
}

/* ── Members ── */

function refreshMembers() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/members");
}

function refreshTeam() {
  revalidatePath("/team");
  revalidatePath("/dashboard/team");
}

export async function approveUser(formData: FormData) {
  const me = await guardStaff();
  const id = Number(formData.get("userId"));
  if (!id) return;
  const group = str(formData, "group", 60);
  const title = str(formData, "title", 80) || "Member";
  const user = await prisma.user.update({ where: { id }, data: { isActive: true } });
  await audit(me.username, "Approved member", `${user.email}${group ? ` → ${group}` : ""}`);
  if (group) {
    const last = await prisma.astraProfile.aggregate({ where: { teamGroup: group }, _max: { sortOrder: true } });
    const spot = { teamGroup: group, teamTitle: title, sortOrder: (last._max.sortOrder ?? 0) + 1 };
    await prisma.astraProfile.upsert({ where: { userId: id }, create: { userId: id, ...spot }, update: spot });
  }
  refreshMembers();
  refreshTeam();
}

// Turns down a pending sign-up by removing the account. Only works on accounts
// that were never approved, so it can't wipe out a real member.
export async function declineUser(formData: FormData) {
  const me = await guardStaff();
  const id = Number(formData.get("userId"));
  const user = id ? await prisma.user.findUnique({ where: { id } }) : null;
  if (!user || user.isActive || user.isStaff || user.isSuperuser) return;
  await audit(me.username, "Declined sign-up", user.email);
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
  await audit(me.username, active ? "Reactivated account" : "Deactivated account", user.email);
  refreshMembers();
}

export async function setUserRole(formData: FormData) {
  const me = await guardAdmin();
  const id = Number(formData.get("userId"));
  const role = str(formData, "role");
  if (!id || id === me.id || !["member", "staff", "admin"].includes(role)) return;
  const user = await prisma.user.update({
    where: { id },
    data: {
      isStaff: role !== "member",
      isSuperuser: role === "admin",
      ...(role !== "member" ? { isActive: true } : {}),
    },
  });
  await audit(me.username, `Changed role to ${role}`, user.email);
  refreshMembers();
}

/* ── Events (public Events page) ── */

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

function refreshEvents(id?: bigint) {
  revalidatePath("/events");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
  if (id) revalidatePath(`/dashboard/events/${id}`);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "event";
}

function eventData(formData: FormData) {
  const type = str(formData, "eventType", 40);
  const date = str(formData, "date", 10);
  const startsAt = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00Z`) : null;
  const description = str(formData, "description", 5000);
  return {
    title: str(formData, "title", 140),
    location: str(formData, "location", 140),
    eventType: EVENT_TYPES.includes(type) ? type : "Outreach",
    startsAt,
    dateLabel: "",
    description,
    summary: description.slice(0, 280),
    published: formData.get("status") !== "draft",
  };
}

/** Creates or updates an event and returns its id (the form then uploads photos one by one). */
export async function saveEvent(formData: FormData): Promise<{ ok: boolean; id?: string; error?: string }> {
  const me = await guardStaff();
  const data = eventData(formData);
  if (!data.title) return { ok: false, error: "Give the event a title." };
  const rawId = str(formData, "id", 30);
  if (rawId) {
    const id = BigInt(rawId);
    await prisma.clubEvent.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    await audit(me.username, "Edited event", data.title);
    refreshEvents(id);
    return { ok: true, id: id.toString() };
  }
  let slug = slugify(data.title);
  if (await prisma.clubEvent.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;
  const created = await prisma.clubEvent.create({
    data: { ...data, slug, authorId: me.id, createdAt: new Date(), updatedAt: new Date() },
  });
  await audit(me.username, "Posted event", data.title);
  refreshEvents(created.id);
  return { ok: true, id: created.id.toString() };
}

export async function addEventPhoto(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  await guardStaff();
  const eventId = BigInt(str(formData, "eventId", 30) || "0");
  const file = formData.get("photo");
  if (!eventId || !(file instanceof File) || !file.size) return { ok: false, error: "No photo." };
  if (!IMAGE_TYPES.has(file.type)) return { ok: false, error: "Photos must be JPG, PNG or WebP." };
  if (file.size > MAX_PHOTO_BYTES) return { ok: false, error: "Photo is too big after resizing." };
  const last = await prisma.eventPhoto.aggregate({ where: { eventId }, _max: { sortOrder: true } });
  await prisma.eventPhoto.create({
    data: { eventId, type: file.type, data: new Uint8Array(await file.arrayBuffer()), sortOrder: (last._max.sortOrder ?? 0) + 1 },
  });
  refreshEvents(eventId);
  return { ok: true };
}

export async function deleteEventPhoto(formData: FormData) {
  await guardStaff();
  const id = Number(formData.get("photoId"));
  if (!id) return;
  const photo = await prisma.eventPhoto.delete({ where: { id } });
  refreshEvents(photo.eventId);
}

export async function makeCoverPhoto(formData: FormData) {
  await guardStaff();
  const id = Number(formData.get("photoId"));
  const photo = id ? await prisma.eventPhoto.findUnique({ where: { id } }) : null;
  if (!photo) return;
  const first = await prisma.eventPhoto.aggregate({ where: { eventId: photo.eventId }, _min: { sortOrder: true } });
  await prisma.eventPhoto.update({ where: { id }, data: { sortOrder: (first._min.sortOrder ?? 0) - 1 } });
  refreshEvents(photo.eventId);
}

export async function setEventPublished(formData: FormData) {
  const me = await guardStaff();
  const id = BigInt(str(formData, "id", 30) || "0");
  if (!id) return;
  const ev = await prisma.clubEvent.update({ where: { id }, data: { published: formData.get("published") === "1", updatedAt: new Date() } });
  await audit(me.username, ev.published ? "Published event" : "Unpublished event", ev.title);
  refreshEvents(id);
}

export async function deleteEvent(formData: FormData) {
  const me = await guardAdmin();
  const id = BigInt(str(formData, "id", 30) || "0");
  if (!id) return;
  const ev = await prisma.clubEvent.delete({ where: { id } });
  await audit(me.username, "Deleted event", ev.title);
  refreshEvents();
  redirect("/dashboard/events?deleted=1");
}

/* ── Team page order ── */

export async function moveTeamMember(formData: FormData) {
  await guardStaff();
  const userId = Number(formData.get("userId"));
  const dir = Number(formData.get("dir")) < 0 ? -1 : 1;
  const me = await prisma.astraProfile.findUnique({ where: { userId } });
  if (!me?.teamGroup) return;
  const group = await prisma.astraProfile.findMany({
    where: { teamGroup: me.teamGroup },
    orderBy: [{ sortOrder: "asc" }, { userId: "asc" }],
    select: { userId: true },
  });
  const ids = group.map((g) => g.userId);
  const i = ids.indexOf(userId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await prisma.$transaction(ids.map((id, n) => prisma.astraProfile.update({ where: { userId: id }, data: { sortOrder: n } })));
  refreshTeam();
}

export async function updateTeamSpot(formData: FormData) {
  const me = await guardStaff();
  const userId = Number(formData.get("userId"));
  if (!userId) return;
  const group = str(formData, "group", 60);
  const title = str(formData, "title", 80);
  const show = formData.get("show") === "on";
  const current = await prisma.astraProfile.findUnique({ where: { userId } });
  let sortOrder = current?.sortOrder ?? 0;
  if (!current || current.teamGroup !== group) {
    const last = await prisma.astraProfile.aggregate({ where: { teamGroup: group }, _max: { sortOrder: true } });
    sortOrder = (last._max.sortOrder ?? 0) + 1;
  }
  const data = { teamGroup: TEAM_GROUPS.includes(group) || group === "" ? group : current?.teamGroup ?? "", teamTitle: title, showOnTeam: show, sortOrder };
  await prisma.astraProfile.upsert({ where: { userId }, create: { userId, ...data }, update: data });
  await audit(me.username, "Changed Team page spot", `user #${userId}: ${data.teamGroup || "hidden"} ${title}`.trim());
  refreshTeam();
}

/* ── Page switches ── */

export async function setPageLive(formData: FormData) {
  const me = await guardStaff();
  const key = str(formData, "key", 20);
  const page = SITE_PAGES.find((p) => p.key === key);
  if (!page) return;
  const live = formData.get("live") === "1";
  await prisma.sitePage.upsert({ where: { key }, create: { key, live }, update: { live } });
  await audit(me.username, live ? "Made page live" : "Put page under construction", page.path);
  revalidatePath(page.path);
  revalidatePath("/dashboard/pages");
  revalidatePath("/dashboard");
}

/* ── My account (any signed-in member, own profile only) ── */

async function guardUser() {
  const user = await requireUser();
  if (!user) redirect("/accounts/login");
  return user;
}

const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function saveAccount(formData: FormData) {
  const me = await guardUser();
  const firstName = str(formData, "firstName", 60);
  const lastName = str(formData, "lastName", 60);
  if (firstName) await prisma.user.update({ where: { id: me.id }, data: { firstName, lastName: lastName || "-" } });
  const data = {
    program: str(formData, "program", 120),
    bio: str(formData, "bio", 400),
    linkedin: str(formData, "linkedin", 200),
    portfolio: str(formData, "portfolio", 200),
    showOnTeam: formData.get("showOnTeam") === "on",
  };
  await prisma.astraProfile.upsert({ where: { userId: me.id }, create: { userId: me.id, ...data }, update: data });
  refreshTeam();
  revalidatePath("/dashboard/account");
  redirect("/dashboard/account?saved=1");
}

export async function uploadAccountPhoto(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const me = await guardUser();
  const file = formData.get("photo");
  if (!(file instanceof File) || !file.size) return { ok: false, error: "No photo." };
  if (!IMAGE_TYPES.has(file.type)) return { ok: false, error: "Photo must be JPG, PNG or WebP." };
  if (file.size > MAX_PHOTO_BYTES) return { ok: false, error: "Photo is too big." };
  const data = { photo: new Uint8Array(await file.arrayBuffer()), photoType: file.type, photoAt: new Date() };
  await prisma.astraProfile.upsert({ where: { userId: me.id }, create: { userId: me.id, ...data }, update: data });
  refreshTeam();
  revalidatePath("/dashboard/account");
  return { ok: true };
}

export async function uploadResume(formData: FormData) {
  const me = await guardUser();
  const file = formData.get("resume");
  if (!(file instanceof File) || !file.size) redirect("/dashboard/account?error=resume");
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!RESUME_TYPES[ext] || file.size > 4 * 1024 * 1024) redirect("/dashboard/account?error=resume");
  const data = {
    resume: new Uint8Array(await file.arrayBuffer()),
    resumeName: file.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120),
    resumeType: RESUME_TYPES[ext],
    resumeSize: file.size,
  };
  await prisma.astraProfile.upsert({ where: { userId: me.id }, create: { userId: me.id, ...data }, update: data });
  revalidatePath("/dashboard/account");
  redirect("/dashboard/account?saved=resume");
}

export async function removeResume() {
  const me = await guardUser();
  await prisma.astraProfile.updateMany({
    where: { userId: me.id },
    data: { resume: null, resumeName: "", resumeType: "", resumeSize: 0 },
  });
  revalidatePath("/dashboard/account");
  redirect("/dashboard/account");
}

/** Exec and admins can set their own group and title (nobody approves them). */
export async function setMyTeamSpot(formData: FormData) {
  const me = await guardStaff();
  const group = str(formData, "group", 60);
  const title = str(formData, "title", 80);
  const current = await prisma.astraProfile.findUnique({ where: { userId: me.id } });
  let sortOrder = current?.sortOrder ?? 0;
  if (!current || current.teamGroup !== group) {
    const last = await prisma.astraProfile.aggregate({ where: { teamGroup: group }, _max: { sortOrder: true } });
    sortOrder = (last._max.sortOrder ?? 0) + 1;
  }
  const data = { teamGroup: TEAM_GROUPS.includes(group) ? group : "", teamTitle: title, sortOrder };
  await prisma.astraProfile.upsert({ where: { userId: me.id }, create: { userId: me.id, ...data }, update: data });
  refreshTeam();
  revalidatePath("/dashboard/account");
  redirect("/dashboard/account?saved=1");
}

/* ── Hivemind workshop waitlist ── */

export async function deleteWorkshopSignup(formData: FormData) {
  const me = await guardStaff();
  const id = Number(formData.get("id"));
  if (!id) return;
  const row = await prisma.workshopSignup.delete({ where: { id }, select: { email: true } }).catch(() => null);
  if (row) await audit(me.username, "Deleted workshop sign-up", row.email);
  revalidatePath("/dashboard/workshop");
  redirect("/dashboard/workshop?deleted=1");
}
