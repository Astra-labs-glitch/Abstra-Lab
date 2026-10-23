"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { hasDatabase, prisma } from "../../lib/prisma";
import { clientIp, rateLimit } from "../../lib/rate-limit";
import { WORKSHOP_LEVELS } from "../../lib/workshop";

export type SignupState = { ok: boolean; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEVELS = new Set<string>(WORKSHOP_LEVELS.map(([v]) => v));

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) || "").trim().slice(0, max);
}

export async function joinWorkshop(_prev: SignupState, formData: FormData): Promise<SignupState> {
  // Honeypot: people never see this field.
  if (text(formData, "website", 200)) return { ok: true, message: "You're on the waitlist." };
  if (!hasDatabase()) return { ok: false, message: "Sign-ups are offline right now. Please email us instead." };

  const ip = clientIp((await headers()).get("x-forwarded-for"));
  if (!(await rateLimit(`workshop:${ip}`, 8, 60 * 60_000)).ok) {
    return { ok: false, message: "Too many sign-ups from this connection. Try again in an hour." };
  }

  const name = text(formData, "name", 120);
  const email = text(formData, "email", 200).toLowerCase();
  const level = text(formData, "level", 20);
  const program = text(formData, "program", 120);
  const why = text(formData, "why", 1500);
  const expect = text(formData, "expect", 1500);
  const guardianOk = formData.get("guardian") === "on";
  const source = text(formData, "source", 10) === "qr" ? "qr" : "web";

  if (!name || !EMAIL.test(email)) return { ok: false, message: "Add your name and a valid email." };
  if (!LEVELS.has(level)) return { ok: false, message: "Pick where you're studying." };
  if (level === "k12" && !guardianOk) {
    return { ok: false, message: "If you're under 18, a parent or guardian needs to know you're signing up." };
  }
  if (formData.get("consent") !== "on") return { ok: false, message: "Tick the box so we can email you about the workshop." };

  const data = { name, level, program, why, expect, guardianOk, source };
  try {
    // Signing up twice with the same email just updates the answers.
    await prisma.workshopSignup.upsert({ where: { email }, create: { email, ...data }, update: data });
  } catch (error) {
    console.error("workshop signup failed", error);
    return { ok: false, message: "Something went wrong. Please try again, or email us." };
  }
  revalidatePath("/dashboard/workshop");
  return { ok: true, message: "You're on the waitlist. We'll email you when the dates are set." };
}
