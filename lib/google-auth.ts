import { randomBytes } from "node:crypto";

import { hashPassword } from "./auth";
import { isAdminEmail } from "./accounts";
import { prisma } from "./prisma";

// "Sign in with Google" using Google's OAuth 2.0 / OpenID Connect web flow.
// Needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (see docs/authentication.md).

export const GOOGLE_STATE_COOKIE = "astra_google_state";

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function googleRedirectUri(origin: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || origin).replace(/\/$/, "");
  return `${base}/api/auth/google/callback`;
}

export function googleAuthUrl(redirectUri: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export type GoogleProfile = { email: string; givenName: string; familyName: string };

// Exchanges the one-time code for tokens, then has Google validate the ID token.
export async function fetchGoogleProfile(code: string, redirectUri: string): Promise<GoogleProfile | null> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return null;
  const { id_token: idToken } = (await tokenRes.json()) as { id_token?: string };
  if (!idToken) return null;

  const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!infoRes.ok) return null;
  const info = (await infoRes.json()) as {
    aud?: string;
    iss?: string;
    email?: string;
    email_verified?: string | boolean;
    given_name?: string;
    family_name?: string;
    name?: string;
  };
  const issuerOk = info.iss === "accounts.google.com" || info.iss === "https://accounts.google.com";
  const verified = info.email_verified === true || info.email_verified === "true";
  if (info.aud !== process.env.GOOGLE_CLIENT_ID || !issuerOk || !verified || !info.email) return null;

  const [first, ...rest] = (info.name ?? "").split(" ");
  return {
    email: info.email.toLowerCase(),
    givenName: info.given_name || first || "Member",
    familyName: info.family_name || rest.join(" ") || "-",
  };
}

export async function uniqueUsername(email: string) {
  const base = email.split("@")[0].replace(/[^a-zA-Z0-9_.-]/g, "").slice(0, 24) || "member";
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? base : `${base}${i + 1}`;
    const taken = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } });
    if (!taken) return candidate;
  }
  return `${base}-${randomBytes(3).toString("hex")}`;
}

export type GoogleSignInResult =
  | { status: "ok"; user: { id: number; isStaff: boolean; isSuperuser: boolean } }
  | { status: "pending" }
  | { status: "banned" };

// Signs in the existing account with this email, or requests access for a new one.
// New accounts wait for admin approval, except emails on the master-admin list.
export async function signInWithGoogleProfile(profile: GoogleProfile): Promise<GoogleSignInResult> {
  const admin = isAdminEmail(profile.email);
  let user = await prisma.user.findFirst({
    where: { email: { equals: profile.email, mode: "insensitive" } },
    include: { profile: true },
  });

  if (!user) {
    const created = await prisma.user.create({
      data: {
        username: await uniqueUsername(profile.email),
        email: profile.email,
        firstName: profile.givenName,
        lastName: profile.familyName,
        // Google accounts never use this password; a random one keeps the column valid.
        password: await hashPassword(randomBytes(32).toString("base64url")),
        isActive: admin,
        isStaff: admin,
        isSuperuser: admin,
        dateJoined: new Date(),
      },
    });
    await prisma.memberProfile.create({ data: { userId: created.id, isBanned: false } });
    user = await prisma.user.findUniqueOrThrow({ where: { id: created.id }, include: { profile: true } });
  }

  if (user.profile?.isBanned) return { status: "banned" };
  if (admin && (!user.isActive || !user.isStaff || !user.isSuperuser)) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true, isStaff: true, isSuperuser: true },
      include: { profile: true },
    });
  }
  if (!user.isActive) return { status: "pending" };
  return { status: "ok", user };
}
