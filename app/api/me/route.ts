import { NextResponse } from "next/server";

import { requireUser } from "../../../lib/auth";

export const dynamic = "force-dynamic";

// Tells the site header who is signed in, so it can show Admin / Edit website / My account.
export async function GET() {
  const user = await requireUser().catch(() => null);
  const body = user
    ? {
        role: user.isSuperuser ? "admin" : user.isStaff ? "staff" : "member",
        name: user.firstName && user.firstName !== "-" ? user.firstName : user.username,
      }
    : { role: null };
  return NextResponse.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
