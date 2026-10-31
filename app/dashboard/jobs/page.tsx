import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { seedStarterRoles, setRoleStatus } from "../admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Job roles", robots: { index: false, follow: false } };

export default async function JobsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  if (!(await requireStaff())) redirect("/dashboard");
  const { saved, deleted } = await searchParams;

  const roles = await prisma.jobRole.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { applications: true } } },
  });
  const newCounts = await prisma.jobApplication.groupBy({
    by: ["roleId"],
    where: { status: "new" },
    _count: { _all: true },
  });
  const fresh = new Map(newCounts.map((r) => [r.roleId, r._count._all]));

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Recruiting</p>
          <h1>Job roles</h1>
          <p className="adm-sub">Open roles show on the public Jobs page with an Apply button.</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/jobs#roles" target="_blank" rel="noopener noreferrer">
            View on site ↗
          </a>
          <form action={seedStarterRoles}>
            <button className="adm-btn" type="submit">
              Add starter volunteer roles
            </button>
          </form>
          <Link className="adm-btn adm-btn--red" href="/dashboard/jobs/new">
            + New role
          </Link>
        </div>
      </header>

      {saved ? <p className="adm-flash">Saved. The Jobs page is updated.</p> : null}
      {deleted ? <p className="adm-flash">Role deleted, along with its applications.</p> : null}

      {roles.length ? (
        <div className="adm-list">
          {roles.map((role) => {
            const newOnes = fresh.get(role.id) ?? 0;
            return (
              <div key={role.id} className="adm-item">
                <div className="adm-item__main">
                  <div className="adm-item__top">
                    <span className={`adm-pill adm-pill--${role.status}`}>{role.status}</span>
                    {role.subteam ? <span className="adm-dim">{role.subteam}</span> : null}
                  </div>
                  <Link href={`/dashboard/jobs/${role.id}`} className="adm-item__title">
                    {role.title}
                  </Link>
                  {role.summary ? <p className="adm-dim">{role.summary}</p> : null}
                </div>
                <Link href={`/dashboard/applications?role=${role.id}`} className="adm-item__count">
                  <strong>{role._count.applications}</strong>
                  <span>{newOnes ? `${newOnes} new` : "applicants"}</span>
                </Link>
                <div className="adm-item__actions">
                  <Link className="adm-btn adm-btn--sm" href={`/dashboard/jobs/${role.id}`}>
                    Edit
                  </Link>
                  <form action={setRoleStatus}>
                    <input type="hidden" name="id" value={role.id} />
                    <input type="hidden" name="status" value={role.status === "open" ? "closed" : "open"} />
                    <button className="adm-btn adm-btn--sm" type="submit">
                      {role.status === "open" ? "Close" : "Open"}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="adm-blank">
          <p className="adm-blank__title">No roles yet.</p>
          <p className="adm-dim">
            Until you open one, the Jobs page says &ldquo;Stay tuned.&rdquo; Post your first role and it goes live straight
            away.
          </p>
          <Link className="adm-btn adm-btn--red" href="/dashboard/jobs/new">
            + New role
          </Link>
        </div>
      )}
    </>
  );
}
