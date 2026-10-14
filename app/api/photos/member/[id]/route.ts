import { NextRequest, NextResponse } from "next/server";

import { currentUser } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export const dynamic = "force-dynamic";

// Member photos: public when the person shows on the Team page, otherwise only
// to themself and staff.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id) || 0;
  const profile = await prisma.astraProfile
    .findUnique({
      where: { userId },
      select: { photo: true, photoType: true, showOnTeam: true, teamGroup: true, user: { select: { isActive: true } } },
    })
    .catch(() => null);
  if (!profile?.photo) return new NextResponse("Not found", { status: 404 });

  const isPublic = profile.showOnTeam && !!profile.teamGroup && profile.user.isActive;
  if (!isPublic) {
    const viewer = await currentUser().catch(() => null);
    if (!viewer || (viewer.id !== userId && !viewer.isStaff && !viewer.isSuperuser)) {
      return new NextResponse("Not found", { status: 404 });
    }
  }
  return new NextResponse(Buffer.from(profile.photo), {
    headers: {
      "Content-Type": profile.photoType || "image/jpeg",
      "Cache-Control": isPublic ? "public, max-age=31536000, immutable" : "private, no-store",
    },
  });
}
