import { NextRequest, NextResponse } from "next/server";

import { setSession } from "../../../../../lib/auth";
import {
  GOOGLE_STATE_COOKIE,
  fetchGoogleProfile,
  googleConfigured,
  googleRedirectUri,
  signInWithGoogleProfile,
} from "../../../../../lib/google-auth";
import { clientIp, rateLimit } from "../../../../../lib/rate-limit";

function back(request: NextRequest, path: string) {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.cookies.delete(GOOGLE_STATE_COOKIE);
  return response;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!googleConfigured()) return back(request, "/accounts/login?error=google_off");

  const ip = clientIp(request.headers.get("x-forwarded-for"));
  if (!rateLimit(`google:${ip}`, 10, 5 * 60_000).ok) return back(request, "/accounts/login?error=throttled");

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expected = request.cookies.get(GOOGLE_STATE_COOKIE)?.value;
  if (!code || !state || !expected || state !== expected) return back(request, "/accounts/login?error=google");

  const profile = await fetchGoogleProfile(code, googleRedirectUri(request.nextUrl.origin));
  if (!profile) return back(request, "/accounts/login?error=google");

  try {
    const result = await signInWithGoogleProfile(profile);
    if (result.status === "banned") return back(request, "/accounts/login?error=invalid");
    if (result.status === "pending") return back(request, "/accounts/pending");
    await setSession(result.user);
    return back(request, "/dashboard");
  } catch (error) {
    console.error("Google sign-in failed", error);
    return back(request, "/accounts/login?error=google");
  }
}
