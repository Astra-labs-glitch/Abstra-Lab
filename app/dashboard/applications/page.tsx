import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../lib/auth";
import { APPLICATION_STATUSES } from "../../../lib/jobs";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Applications", robots: { index: false, follow: false } };

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string; deleted?: string }>;
}) {
  if (!(await requireStaff())) redirect("/dashboard");
  const { role, status, deleted } = await searchParams;
  const roleId = Number(role) || undefined;
  const statusOk = APPLICATION_STATUSES.some(([v]) => v === status) ? status : undefined;

  const [apps, roles, counts] = await Promise.all([
    prisma.jobApplication.findMany({
      where: { roleId, status: statusOk },
      orderBy: { createdAt: "desc" },
      take: 300,
      select: {
        id: true,
        name: true,
        email: true,
        program: true,
        status: true,
        createdAt: true,
        role: { select: { id: true, title: true } },
      },
    }),
    prisma.jobRole.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], select: { id: true, title: true } }),
    prisma.jobApplication.groupBy({ by: ["status"], where: { roleId }, _count: { _all: true } }),
  ]);
  const byStatus = new Map(counts.map((c) => [c.status, c._count._all]));
  const total = counts.reduce((n, c) => n + c._count._all, 0);

  const href = (next: { role?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (next.role) q.set("role", String(next.role));
    if (next.status) q.set("status", next.status);
    const s = q.toString();
    return `/dashboard/applications${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Recruiting</p>
          <h1>Applications</h1>
          <p className="adm-sub">Résumés are private. Only signed-in staff can open them.</p>
        </div>
      </header>

      {deleted ? <p className="adm-flash">Application deleted.</p> : null}

      <div className="adm-filters">
        <div className="adm-tabs" role="tablist" aria-label="Status">
          <Link className={!statusOk ? "is-active" : undefined} href={href({ role: roleId })}>
            All <span>{total}</span>
          </Link>
          {APPLICATION_STATUSES.map(([value, label]) => (
            <Link
              key={value}
              className={statusOk === value ? "is-active" : undefined}
              href={href({ role: roleId, status: value })}
            >
              {label} <span>{byStatus.get(value) ?? 0}</span>
            </Link>
          ))}
        </div>
        {roles.length > 1 ? (
          <div className="adm-chips">
            <Link className={!roleId ? "is-active" : undefined} href={href({ status: statusOk })}>
              All roles
            </Link>
            {roles.map((r) => (
              <Link key={r.id} className={roleId === r.id ? "is-active" : undefined} href={href({ role: r.id, status: statusOk })}>
                {r.title}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {apps.length ? (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/dashboard/applications/${a.id}`} className="adm-table__link">
                      <strong>{a.name}</strong>
                      <span>{a.program || a.email}</span>
                    </Link>
                  </td>
                  <td>{a.role.title}</td>
                  <td className="adm-dim">{fmt(a.createdAt)}</td>
                  <td>
                    <span className={`adm-pill adm-pill--${a.status}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="adm-blank">
          <p className="adm-blank__title">{total ? "Nothing in this filter." : "No applications yet."}</p>
          <p className="adm-dim">
            {total ? "Try another status or role." : "When someone applies on the Jobs page, they show up here."}
          </p>
        </div>
      )}
    </>
  );
}

function fmt(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "America/Toronto" }).format(d);
}
