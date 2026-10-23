import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { WORKSHOP_LEVELS, levelLabel, purgeOldSignups } from "../../../lib/workshop";
import { deleteWorkshopSignup } from "../admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Workshop waitlist", robots: { index: false, follow: false } };

function fmt(d: Date) {
  return d.toLocaleDateString("en-CA", { timeZone: "America/Toronto", month: "short", day: "numeric" });
}

export default async function WorkshopAdminPage({ searchParams }: { searchParams: Promise<{ level?: string; deleted?: string }> }) {
  if (!(await requireStaff())) redirect("/dashboard");
  const { level, deleted } = await searchParams;
  const levelOk = WORKSHOP_LEVELS.some(([v]) => v === level) ? level : undefined;
  await purgeOldSignups();

  type Row = { id: number; name: string; email: string; level: string; program: string; why: string; expect: string; guardianOk: boolean; source: string; createdAt: Date };
  let rows: Row[] = [];
  let counts: { level: string; _count: { _all: number } }[] = [];
  let qr = 0;
  let week = 0;
  let ready = true;
  try {
    [rows, counts, qr, week] = await Promise.all([
      prisma.workshopSignup.findMany({ where: { level: levelOk }, orderBy: { createdAt: "desc" }, take: 1000 }),
      prisma.workshopSignup.groupBy({ by: ["level"], _count: { _all: true } }),
      prisma.workshopSignup.count({ where: { source: "qr" } }),
      prisma.workshopSignup.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 86_400_000) } } }),
    ]);
  } catch {
    // The table is created when this ships to production.
    ready = false;
  }
  const byLevel = new Map(counts.map((c) => [c.level, c._count._all]));
  const total = counts.reduce((n, c) => n + c._count._all, 0);

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Hivemind workshop</p>
          <h1>Waitlist</h1>
          <p className="adm-sub">
            Everyone who signed up on <Link href="/workshop">alsp.ca/workshop</Link>, including from the QR code. Only staff can see this.
            Sign-ups are deleted automatically after 12 months.
          </p>
        </div>
        {total ? (
          <a className="adm-btn" href="/dashboard/workshop/csv">
            Download CSV
          </a>
        ) : null}
      </header>

      {deleted ? <p className="adm-flash">Sign-up deleted.</p> : null}
      {!ready ? <p className="adm-flash adm-flash--err">The waitlist goes live once this update is merged and deployed.</p> : null}

      <div className="adm-stats">
        <div className={`adm-stat${total ? " is-hot" : ""}`}>
          <span>Signed up</span>
          <strong>{total}</strong>
        </div>
        <div className="adm-stat">
          <span>This week</span>
          <strong>{week}</strong>
        </div>
        <div className="adm-stat">
          <span>From QR codes</span>
          <strong>{qr}</strong>
        </div>
      </div>

      <div className="adm-filters">
        <div className="adm-tabs" role="tablist" aria-label="Level">
          <Link className={!levelOk ? "is-active" : undefined} href="/dashboard/workshop">
            All <span>{total}</span>
          </Link>
          {WORKSHOP_LEVELS.map(([value, label]) => (
            <Link key={value} className={levelOk === value ? "is-active" : undefined} href={`/dashboard/workshop?level=${value}`}>
              {label} <span>{byLevel.get(value) ?? 0}</span>
            </Link>
          ))}
        </div>
      </div>

      {rows.length ? (
        <ul className="adm-signups">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="adm-signups__who">
                <strong>{r.name}</strong>
                <span className="adm-dim">{r.email}</span>
                <span className="adm-signups__meta">
                  <span className="adm-pill">{levelLabel(r.level)}</span>
                  {r.program ? <span>{r.program}</span> : null}
                  <span className="adm-dim">{fmt(r.createdAt)}</span>
                  <span className={r.source === "qr" ? "adm-signups__qr" : "adm-dim"}>{r.source === "qr" ? "QR at an event" : "Website"}</span>
                  {r.level === "k12" ? <span className="adm-dim">Under 18: guardian box ticked</span> : null}
                </span>
              </div>
              {r.why || r.expect ? (
                <details className="adm-signups__answers">
                  <summary>Their answers</summary>
                  {r.why ? <p><b>Why it fits:</b> {r.why}</p> : null}
                  {r.expect ? <p><b>Hoping to get:</b> {r.expect}</p> : null}
                </details>
              ) : null}
              <form action={deleteWorkshopSignup}>
                <input type="hidden" name="id" value={r.id} />
                <button className="adm-btn adm-btn--sm adm-btn--danger" type="submit">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <div className="adm-blank">
          <p className="adm-blank__title">{total ? "Nobody at this level yet." : "No sign-ups yet."}</p>
          <p className="adm-dim">
            Share <Link href="/workshop">alsp.ca/workshop</Link> or print the QR code (it opens alsp.ca/workshop?from=qr).
          </p>
        </div>
      )}
    </>
  );
}
