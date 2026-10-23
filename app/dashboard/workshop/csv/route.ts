import { NextResponse } from "next/server";

import { requireStaff } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { levelLabel } from "../../../../lib/workshop";

export const dynamic = "force-dynamic";

// Spreadsheet-safe cell: quote it, and stop formulas (=, +, -, @) from running in Excel.
function cell(value: string) {
  const v = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${v.replace(/"/g, '""')}"`;
}

export async function GET() {
  const staff = await requireStaff();
  if (!staff) return NextResponse.json({ error: "Staff only" }, { status: 401 });
  const rows = await prisma.workshopSignup.findMany({ orderBy: { createdAt: "asc" } });
  const header = ["Signed up", "Name", "Email", "Level", "Studying", "Why it fits", "Hoping to get", "Came from"];
  const lines = rows.map((r) =>
    [r.createdAt.toISOString().slice(0, 10), r.name, r.email, levelLabel(r.level), r.program, r.why, r.expect, r.source === "qr" ? "QR at an event" : "Website"]
      .map(cell)
      .join(","),
  );
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hivemind-workshop-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
