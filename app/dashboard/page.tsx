import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardHomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  if (!user) return null;
  const { error } = await searchParams;

  const isStaff = user.isStaff || user.isSuperuser;
  const first = user.firstName && user.firstName !== "-" ? user.firstName : user.username;

  const [eventCount, resourceCount, postCount, nextEvent, latestPost] = await Promise.all([
    prisma.clubEvent.count({ where: isStaff ? undefined : { published: true } }),
    prisma.buildMaterial.count({ where: isStaff ? undefined : { published: true } }),
    prisma.blogPost.count({ where: isStaff ? undefined : { published: true } }),
    prisma.clubEvent.findFirst({
      where: isStaff ? undefined : { published: true },
      orderBy: [{ startsAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.blogPost.findFirst({
      where: isStaff ? undefined : { published: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const staffData = isStaff
    ? await Promise.all([
        prisma.jobApplication.count({ where: { status: "new" } }),
        prisma.jobRole.count({ where: { status: "open" } }),
        prisma.user.findMany({
          where: { isActive: false },
          orderBy: { dateJoined: "desc" },
          take: 5,
          select: { id: true, firstName: true, lastName: true, email: true },
        }),
        prisma.jobApplication.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, name: true, status: true, createdAt: true, role: { select: { title: true } } },
        }),
        prisma.user.count({ where: { isActive: false } }),
      ]).catch(() => null)
    : null;

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Overview</p>
          <h1>Hey {first}.</h1>
          <p className="adm-sub">
            {isStaff ? "Here's what needs you today." : "Everything the team is working on, in one place."}
          </p>
        </div>
      </header>

      {error === "admin_only" ? <p className="adm-flash adm-flash--err">Only admins can do that.</p> : null}

      {staffData ? (
        <>
          <div className="adm-stats">
            <Link className={`adm-stat${staffData[0] ? " is-hot" : ""}`} href="/dashboard/applications?status=new">
              <span>New applications</span>
              <strong>{staffData[0]}</strong>
            </Link>
            <Link className={`adm-stat${staffData[4] ? " is-hot" : ""}`} href="/dashboard/members?filter=pending">
              <span>Waiting for approval</span>
              <strong>{staffData[4]}</strong>
            </Link>
            <Link className="adm-stat" href="/dashboard/jobs">
              <span>Open roles</span>
              <strong>{staffData[1]}</strong>
            </Link>
            <Link className="adm-stat" href="/dashboard/site-text">
              <span>Site text</span>
              <strong className="adm-stat__go">Edit →</strong>
            </Link>
          </div>

          <div className="adm-two">
            <section className="adm-card">
              <div className="adm-card__head">
                <h2>Latest applications</h2>
                <Link href="/dashboard/applications">See all</Link>
              </div>
              {staffData[3].length ? (
                <ul className="adm-rows">
                  {staffData[3].map((a) => (
                    <li key={a.id}>
                      <Link href={`/dashboard/applications/${a.id}`}>
                        <strong>{a.name}</strong>
                        <span>{a.role.title}</span>
                      </Link>
                      <span className={`adm-pill adm-pill--${a.status}`}>{a.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="adm-empty">
                  No applications yet. <Link href="/dashboard/jobs/new">Post a role</Link> and they&apos;ll show up here.
                </p>
              )}
            </section>

            <section className="adm-card">
              <div className="adm-card__head">
                <h2>New sign-ups</h2>
                <Link href="/dashboard/members">Members</Link>
              </div>
              {staffData[2].length ? (
                <ul className="adm-rows">
                  {staffData[2].map((m) => (
                    <li key={m.id}>
                      <Link href="/dashboard/members?filter=pending">
                        <strong>
                          {m.firstName} {m.lastName !== "-" ? m.lastName : ""}
                        </strong>
                        <span>{m.email}</span>
                      </Link>
                      <span className="adm-pill adm-pill--new">pending</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="adm-empty">Nobody waiting. You&apos;re all caught up.</p>
              )}
            </section>
          </div>
        </>
      ) : null}

      <h2 className="adm-h2">Team space</h2>
      <div className="adm-stats">
        <Link className="adm-stat" href="/dashboard/events">
          <span>Events</span>
          <strong>{eventCount}</strong>
          <em>{nextEvent ? nextEvent.title : "No events yet"}</em>
        </Link>
        <Link className="adm-stat" href="/dashboard/resources">
          <span>Resources</span>
          <strong>{resourceCount}</strong>
          <em>Tools, docs and links</em>
        </Link>
        <Link className="adm-stat" href="/dashboard/posts">
          <span>Posts</span>
          <strong>{postCount}</strong>
          <em>{latestPost ? latestPost.title : "No posts yet"}</em>
        </Link>
      </div>
    </>
  );
}
