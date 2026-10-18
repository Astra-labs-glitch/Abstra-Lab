"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { requireUser } from "../../lib/auth";
import { MAX_RESUME_BYTES, RESUME_TYPES } from "../../lib/jobs";
import { hasDatabase, prisma } from "../../lib/prisma";
import { clientIp, rateLimit } from "../../lib/rate-limit";

export type ApplyState = { ok: boolean; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) || "").trim().slice(0, max);
}

// Checks the first bytes so a renamed file can't pass as a résumé.
function looksLikeDocument(ext: string, bytes: Buffer) {
  if (ext === "pdf") return bytes.subarray(0, 5).toString("latin1") === "%PDF-";
  if (ext === "docx") return bytes[0] === 0x50 && bytes[1] === 0x4b; // zip
  if (ext === "doc") return bytes[0] === 0xd0 && bytes[1] === 0xcf; // OLE
  return false;
}

export async function applyForRole(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  // Honeypot: real people never see or fill this field.
  if (text(formData, "website", 200)) return { ok: true, message: "Thanks! We'll be in touch." };
  if (!hasDatabase()) return { ok: false, message: "Applications are offline right now. Please email us instead." };

  const ip = clientIp((await headers()).get("x-forwarded-for"));
  if (!(await rateLimit(`apply:${ip}`, 5, 60 * 60_000)).ok) {
    return { ok: false, message: "Too many applications from this connection. Try again in an hour." };
  }

  const roleId = Number(formData.get("roleId"));
  const name = text(formData, "name", 120);
  const email = text(formData, "email", 200).toLowerCase();
  const program = text(formData, "program", 120);
  const year = text(formData, "year", 40);
  const message = text(formData, "message", 3000);
  const links = text(formData, "links", 500);
  const file = formData.get("resume");

  if (!name || !EMAIL.test(email)) return { ok: false, message: "Add your name and a valid email." };
  if (formData.get("consent") !== "on") return { ok: false, message: "Tick the box to agree to how we use your application." };
  let resume: { bytes: Uint8Array<ArrayBuffer>; name: string; type: string; size: number } | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_RESUME_BYTES) return { ok: false, message: "Résumé is too big. Keep it under 4 MB." };
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!RESUME_TYPES[ext]) return { ok: false, message: "Résumé must be a PDF or Word file." };
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!looksLikeDocument(ext, bytes)) return { ok: false, message: "That file doesn't look like a PDF or Word document." };
    resume = { bytes: new Uint8Array(bytes), name: file.name, type: RESUME_TYPES[ext], size: file.size };
  } else {
    // Signed-in members can apply with the résumé saved in My account.
    const me = await requireUser().catch(() => null);
    const saved = me
      ? await prisma.astraProfile.findUnique({ where: { userId: me.id }, select: { resume: true, resumeName: true, resumeType: true, resumeSize: true } })
      : null;
    if (!saved?.resume) return { ok: false, message: "Attach your résumé." };
    resume = { bytes: new Uint8Array(saved.resume), name: saved.resumeName, type: saved.resumeType, size: saved.resumeSize };
  }

  const role = await prisma.jobRole.findUnique({ where: { id: roleId } });
  if (!role || role.status !== "open") return { ok: false, message: "This role isn't open anymore." };

  await prisma.jobApplication.create({
    data: {
      roleId,
      name,
      email,
      program,
      year,
      message,
      links,
      resumeName: resume.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120),
      resumeType: resume.type,
      resumeSize: resume.size,
      resume: resume.bytes,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/applications");
  return { ok: true, message: "Application sent. We reply within 5 days." };
}
