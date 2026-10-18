import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { purgeOldApplications, recentAudit } from "../../lib/audit";
import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { pageStatus } from "../../lib/site-text";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function DashboardHomePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser();
  if (!user) redirect("/accounts/login");
  if (!user.isStaff && !user.isSuperuser) redirect("/dashboard/account");
  const { error } = await searchParams;
  const first = user.firstName && user.firstName !== "-" ? user.firstName : user.username;

  await purgeOldApplications();
  const [newApps, pendingCount, eventsLive, status, latestApps, pendingUsers, log] = await Promise.all([
    prisma.jobApplication.count({ where: { status: "new" } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.clubEvent.count({ where: { published: true } }),
    pageStatus(),
    prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, status: true, role: { select: { title: true } } },
    }),
    prisma.user.findMany({
      where: { isActive: false },
      orderBy: { dateJoined: "desc" },
      take: 5,
      select: { id: true, firstName: true, lastName: true, email: true, astra: { select: { wantSubteam: true } } },
    }),
    recentAudit(12),
  ]);
  const offPages = Object.values(status).filter((live) => !live).length;

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Admin</p>
          <h1>Hey {first}.</h1>
          <p className="adm-sub">
            Here&apos;s what needs you today. To change words on the site, hit <b>Edit website</b> next to the logo.
          </p>
        </div>
      </header>

      {error === "admin_only" ? <p className="adm-flash adm-flash--err">Only admins can do that.</p> : null}

      <div className="adm-stats">
        <Link className={`adm-stat${newApps ? " is-hot" : ""}`} href="/dashboard/applications?status=new">
          <span>New applications</span>
          <strong>{newApps}</strong>
        </Link>
        <Link className={`adm-stat${pendingCount ? " is-hot" : ""}`} href="/dashboard/members">
          <span>Waiting for approval</span>
          <strong>{pendingCount}</strong>
        </Link>
        <Link className="adm-stat" href="/dashboard/events">
          <span>Events posted</span>
          <strong>{eventsLive}</strong>
        </Link>
        <Link className="adm-stat" href="/dashboard/pages">
          <span>Pages under construction</span>
          <strong>{offPages}</strong>
        </Link>
      </div>

      <div className="adm-two">
        <section className="adm-card">
          <div className="adm-card__head">
            <h2>Latest applications</h2>
            <Link href="/dashboard/applications">See all</Link>
          </div>
          {latestApps.length ? (
            <ul className="adm-rows">
              {latestApps.map((a) => (
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
          {pendingUsers.length ? (
            <ul className="adm-rows">
              {pendingUsers.map((m) => (
                <li key={m.id}>
                  <Link href="/dashboard/members">
                    <strong>
                      {m.firstName} {m.lastName !== "-" ? m.lastName : ""}
                    </strong>
                    <span>{m.astra?.wantSubteam ? `wants ${m.astra.wantSubteam}` : m.email}</span>
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

      <section className="adm-card" style={{ marginTop: 24 }}>
        <div className="adm-card__head">
          <h2>Recent admin activity</h2>
        </div>
        {log.length ? (
          <ul className="adm-rows">
            {log.map((l) => (
              <li key={l.id}>
                <span>
                  <strong>{l.action}</strong>
                  <span>
                    {l.target ? `${l.target} · ` : ""}
                    {l.actor}
                  </span>
                </span>
                <time className="adm-dim" dateTime={l.at.toISOString()}>
                  {l.at.toLocaleString("en-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" })}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="adm-empty">Changes made in the admin show up here: who did what, and when.</p>
        )}
      </section>
    </>
  );
}
