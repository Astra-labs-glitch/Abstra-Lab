import { redirect } from "next/navigation";

import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { DashNav, type NavGroup } from "./dash-nav";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  if (!user) redirect("/accounts/login");

  const isStaff = user.isStaff || user.isSuperuser;

  let newApps = 0;
  let pending = 0;
  if (isStaff) {
    [newApps, pending] = await Promise.all([
      prisma.jobApplication.count({ where: { status: "new" } }).catch(() => 0),
      prisma.user.count({ where: { isActive: false } }),
    ]);
  }

  const groups: NavGroup[] = isStaff
    ? [
        {
          title: "You",
          items: [
            { href: "/dashboard", label: "Overview" },
            { href: "/dashboard/account", label: "My account" },
          ],
        },
        {
          title: "Site",
          items: [
            { href: "/dashboard/events", label: "Events" },
            { href: "/dashboard/jobs", label: "Jobs" },
            { href: "/dashboard/applications", label: "Applications", badge: newApps },
            { href: "/dashboard/workshop", label: "Workshop" },
          ],
        },
        {
          title: "Team",
          items: [
            { href: "/dashboard/team", label: "Team" },
            { href: "/dashboard/members", label: "Members", badge: pending },
            { href: "/dashboard/pages", label: "Pages" },
          ],
        },
      ]
    : [{ title: "You", items: [{ href: "/dashboard/account", label: "My account" }] }];

  return (
    <div className="adm ax-wrap">
      <DashNav groups={groups} />
      <div className="adm-main">{children}</div>
    </div>
  );
}
