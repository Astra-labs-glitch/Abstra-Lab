import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireStaff } from "../../../../lib/auth";
import { APPLICATION_STATUSES } from "../../../../lib/jobs";
import { prisma } from "../../../../lib/prisma";
import { deleteApplication, updateApplication } from "../../admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Application", robots: { index: false, follow: false } };

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireStaff();
  if (!me) redirect("/dashboard");
  const { id } = await params;
  const app = await prisma.jobApplication.findUnique({
    where: { id: Number(id) || 0 },
    select: {
      id: true,
      name: true,
      email: true,
      program: true,
      year: true,
      message: true,
      links: true,
      resumeName: true,
      resumeType: true,
      resumeSize: true,
      status: true,
      notes: true,
      createdAt: true,
      role: { select: { id: true, title: true } },
    },
  });
  if (!app) notFound();

  const isPdf = app.resumeType === "application/pdf";
  const links = app.links
    .split(/[\s,]+/)
    .filter((l) => /^https?:\/\//i.test(l));

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/dashboard/applications" className="adm-back">
            ← Applications
          </Link>
          <h1>{app.name}</h1>
          <p className="adm-sub">
            Applied for <Link href={`/dashboard/jobs/${app.role.id}`}>{app.role.title}</Link> on{" "}
            {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeZone: "America/Toronto" }).format(app.createdAt)}
          </p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href={`mailto:${app.email}?subject=${encodeURIComponent(`Astra Labs: ${app.role.title}`)}`}>
            Email {app.name.split(" ")[0]}
          </a>
        </div>
      </header>

      <div className="adm-two adm-two--wide">
        <div>
          <section className="adm-card">
            <dl className="adm-dl">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${app.email}`}>{app.email}</a>
              </dd>
              <dt>Program</dt>
              <dd>{app.program || "—"}</dd>
              <dt>Year</dt>
              <dd>{app.year || "—"}</dd>
              {links.length ? (
                <>
                  <dt>Links</dt>
                  <dd>
                    {links.map((l) => (
                      <a key={l} href={l} target="_blank" rel="noopener noreferrer nofollow" className="adm-link-line">
                        {l.replace(/^https?:\/\//, "")}
                      </a>
                    ))}
                  </dd>
                </>
              ) : app.links ? (
                <>
                  <dt>Links</dt>
                  <dd>{app.links}</dd>
                </>
              ) : null}
            </dl>
          </section>

          <section className="adm-card">
            <h2 className="adm-card__h">Why this role</h2>
            <p className="adm-prose">{app.message || <span className="adm-dim">They didn&apos;t write anything.</span>}</p>
          </section>

          <section className="adm-card adm-file">
            <div>
              <p className="adm-file__name">{app.resumeName}</p>
              <p className="adm-dim">{Math.max(1, Math.round(app.resumeSize / 1024))} KB · private</p>
            </div>
            <div className="adm-head__actions">
              {isPdf ? (
                <a className="adm-btn" href={`/dashboard/applications/${app.id}/resume?view=1`} target="_blank" rel="noopener noreferrer">
                  Open
                </a>
              ) : null}
              <a className="adm-btn adm-btn--red" href={`/dashboard/applications/${app.id}/resume`}>
                Download résumé
              </a>
            </div>
          </section>
        </div>

        <aside>
          <form action={updateApplication} className="adm-card adm-form">
            <input type="hidden" name="id" value={app.id} />
            <fieldset className="adm-seg adm-seg--stack">
              <legend>Status</legend>
              {APPLICATION_STATUSES.map(([value, label]) => (
                <label key={value}>
                  <input type="radio" name="status" value={value} defaultChecked={app.status === value} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            <label className="adm-field">
              <span>Notes for the exec team</span>
              <small>Only staff see these.</small>
              <textarea name="notes" rows={6} defaultValue={app.notes} />
            </label>
            <button className="adm-btn adm-btn--red" type="submit">
              Save
            </button>
          </form>

          {me.isSuperuser ? (
            <details className="adm-danger">
              <summary>Delete application</summary>
              <p className="adm-dim">Removes their details and résumé for good.</p>
              <form action={deleteApplication}>
                <input type="hidden" name="id" value={app.id} />
                <button type="submit" className="adm-btn adm-btn--danger">
                  Delete
                </button>
              </form>
            </details>
          ) : null}
        </aside>
      </div>
    </>
  );
}
