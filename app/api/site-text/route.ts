import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { audit } from "../../../lib/audit";
import { requireStaff } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { TEXT_KEY } from "../../../lib/site-text";

export const dynamic = "force-dynamic";

// Saves text changed in "Edit website" mode. Staff only, same-origin only.
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Sign in as an admin to edit the site." }, { status: 401 });

  let changes: Record<string, unknown>;
  try {
    changes = ((await request.json()) as { changes?: Record<string, unknown> }).changes ?? {};
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const entries = Object.entries(changes).filter(([k, v]) => TEXT_KEY.test(k) && typeof v === "string").slice(0, 200);
  for (const [key, raw] of entries) {
    const value = (raw as string).replace(/\s+/g, " ").trim().slice(0, 2000);
    if (!value) {
      await prisma.siteText.deleteMany({ where: { key } });
    } else {
      await prisma.siteText.upsert({
        where: { key },
        create: { key, value, updatedBy: staff.username },
        update: { value, updatedBy: staff.username },
      });
    }
  }
  if (entries.length) await audit(staff.username, "Edited site text", entries.map(([k]) => k).join(", ").slice(0, 300));
  revalidatePath("/", "layout");
  return NextResponse.json({ saved: entries.length });
}
