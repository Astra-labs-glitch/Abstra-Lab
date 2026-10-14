import { NextRequest, NextResponse } from "next/server";

import { requireStaff } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export const dynamic = "force-dynamic";

// Résumés live in the database and are only ever served here, to signed-in staff.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff();
  if (!staff) return NextResponse.redirect(new URL("/accounts/login", request.url));

  const { id } = await params;
  const application = await prisma.jobApplication.findUnique({
    where: { id: Number(id) || 0 },
    select: { resume: true, resumeName: true, resumeType: true },
  });
  if (!application) return new NextResponse("Not found", { status: 404 });

  const inline = request.nextUrl.searchParams.get("view") === "1" && application.resumeType === "application/pdf";
  const filename = application.resumeName.replace(/"/g, "");
  return new NextResponse(Buffer.from(application.resume), {
    headers: {
      "Content-Type": application.resumeType,
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
      "Content-Security-Policy": "sandbox",
    },
  });
}
