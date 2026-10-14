import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

// A member's own résumé (or any member's, for staff via ?user=).
export async function GET(request: NextRequest) {
  const me = await requireUser();
  if (!me) return NextResponse.redirect(new URL("/accounts/login", request.url));
  const asked = Number(request.nextUrl.searchParams.get("user")) || me.id;
  if (asked !== me.id && !me.isStaff && !me.isSuperuser) return new NextResponse("Not found", { status: 404 });

  const p = await prisma.astraProfile.findUnique({
    where: { userId: asked },
    select: { resume: true, resumeName: true, resumeType: true },
  });
  if (!p?.resume) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(Buffer.from(p.resume), {
    headers: {
      "Content-Type": p.resumeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${p.resumeName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
