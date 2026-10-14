import Link from "next/link";
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
  const role = user.isSuperuser ? "Admin" : isStaff ? "Exec" : "Member";
  const name = [user.firstName, user.lastName].filter((n) => n && n !== "-").join(" ") || user.username;

  let newApps = 0;
  let pending = 0;
  if (isStaff) {
    [newApps, pending] = await Promise.all([
      prisma.jobApplication.count({ where: { status: "new" } }).catch(() => 0),
      prisma.user.count({ where: { isActive: false } }),
    ]);
  }

  const groups: NavGroup[] = [
    {
      title: "Team",
      items: [
        { href: "/dashboard", label: "Overview" },
        { href: "/dashboard/events", label: "Events" },
        { href: "/dashboard/resources", label: "Resources" },
        { href: "/dashboard/posts", label: "Posts" },
      ],
    },
    ...(isStaff
      ? [
          {
            title: "Recruiting",
            items: [
              { href: "/dashboard/jobs", label: "Job roles" },
              { href: "/dashboard/applications", label: "Applications", badge: newApps },
            ],
          },
          {
            title: "Admin",
            items: [
              { href: "/dashboard/members", label: "Members", badge: pending },
              { href: "/dashboard/site-text", label: "Site text" },
              { href: "/dashboard/staff", label: "Posts & events" },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="adm ax-wrap">
      <div className="adm-top">
        <p className="ax-label" style={{ margin: 0 }}>
          Member area · {role}
        </p>
        <p className="adm-top__me">
          <span>{name}</span>
          <Link href="/accounts/logout">Log out</Link>
        </p>
      </div>
      <DashNav groups={groups} />
      <div className="adm-main">{children}</div>
    </div>
  );
}
