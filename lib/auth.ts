import { cookies } from "next/headers";
import { createHmac, pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { hasDatabase, prisma } from "./prisma";

const pbkdf2Async = promisify(pbkdf2);
const cookieName = "astra_session";

type SessionPayload = {
  userId: number;
  isStaff: boolean;
  exp: number;
};

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, iterationsRaw, salt, digest] = encoded.split("$");
  if (algorithm !== "pbkdf2_sha256" || !iterationsRaw || !salt || !digest) return false;
  const derived = await pbkdf2Async(password, salt, Number(iterationsRaw), 32, "sha256");
  const expected = Buffer.from(digest, "base64");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export async function hashPassword(password: string) {
  const iterations = 720000;
  const salt = randomBytes(12).toString("base64url");
  const derived = await pbkdf2Async(password, salt, iterations, 32, "sha256");
  return `pbkdf2_sha256$${iterations}$${salt}$${derived.toString("base64")}`;
}

export async function currentUser() {
  if (!hasDatabase()) return null;
  const session = await readSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) return null;
  if (!user.isActive || user.profile?.isBanned) return null;
  return user;
}

export async function requireStaff() {
  const user = await requireUser();
  if (!user?.isStaff && !user?.isSuperuser) return null;
  return user;
}

export async function setSession(user: { id: number; isStaff: boolean; isSuperuser: boolean }) {
  const payload: SessionPayload = {
    userId: user.id,
    isStaff: user.isStaff || user.isSuperuser,
    exp: Math.floor(Date.now() / 1000) + sessionSeconds(user.isStaff || user.isSuperuser),
  };
  const value = sign(payload);
  (await cookies()).set(cookieName, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookie(),
    path: "/",
    maxAge: sessionSeconds(user.isStaff || user.isSuperuser),
  });
}

export async function clearSession() {
  (await cookies()).delete(cookieName);
}

async function readSession() {
  const value = (await cookies()).get(cookieName)?.value;
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature || !sameSignature(signature, hmac(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.userId !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// Admins and execs get a 7-day login; members keep 14 days.
function sessionSeconds(isStaff: boolean) {
  return 60 * 60 * 24 * (isStaff ? 7 : 14);
}

// Constant-time comparison, so response timing can't leak how much of a forged signature was right.
function sameSignature(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function sign(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmac(body)}`;
}

function hmac(body: string) {
  return createHmac("sha256", sessionSecret()).update(body).digest("base64url");
}

const INSECURE_FALLBACK_SECRET = "local-next-session-secret";

function sessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret !== INSECURE_FALLBACK_SECRET) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET is missing or set to the insecure default. Set a long, random AUTH_SECRET before deploying.",
    );
  }
  console.warn(
    "[auth] AUTH_SECRET is not set — using an insecure development fallback. Never use this in production.",
  );
  return INSECURE_FALLBACK_SECRET;
}

function secureCookie() {
  const override = process.env.AUTH_SECURE_COOKIE;
  if (override) return override === "1";
  return process.env.NODE_ENV === "production";
}
