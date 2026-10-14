import { randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { GOOGLE_STATE_COOKIE, googleAuthUrl, googleConfigured, googleRedirectUri } from "../../../../lib/google-auth";
import { hasDatabase } from "../../../../lib/prisma";

export async function GET(request: NextRequest) {
  if (!googleConfigured() || !hasDatabase()) {
    return NextResponse.redirect(new URL("/accounts/login?error=google_off", request.url));
  }
  const state = randomBytes(24).toString("base64url");
  const response = NextResponse.redirect(googleAuthUrl(googleRedirectUri(request.nextUrl.origin), state));
  response.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return response;
}
