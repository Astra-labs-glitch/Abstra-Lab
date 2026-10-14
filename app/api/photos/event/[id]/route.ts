import { NextRequest, NextResponse } from "next/server";

import { prisma } from "../../../../../lib/prisma";

export const dynamic = "force-dynamic";

// Public event photos. URLs carry ?v= so they can be cached hard.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await prisma.eventPhoto
    .findUnique({ where: { id: Number(id) || 0 }, include: { event: { select: { published: true } } } })
    .catch(() => null);
  if (!photo || !photo.event.published) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(Buffer.from(photo.data), {
    headers: { "Content-Type": photo.type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
