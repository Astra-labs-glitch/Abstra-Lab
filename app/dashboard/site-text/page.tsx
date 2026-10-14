import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { SITE_TEXT } from "../../../lib/site-text";
import { saveSiteText } from "../admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Site text", robots: { index: false, follow: false } };

export default async function SiteTextPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; saved?: string }>;
}) {
  if (!(await requireStaff())) redirect("/dashboard");
  const { page, saved } = await searchParams;
  const group = SITE_TEXT.find((g) => g.page === page) ?? SITE_TEXT[0];

  const rows = await prisma.siteText.findMany({ where: { key: { in: group.fields.map((f) => f.key) } } });
  const saved_ = new Map(rows.map((r) => [r.key, r]));
  const lastEdit = rows.sort((a, b) => +b.updatedAt - +a.updatedAt)[0];

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Admin</p>
          <h1>Site text</h1>
          <p className="adm-sub">Change the words on the public site. Saving updates the live page within a few seconds.</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href={group.path} target="_blank" rel="noopener noreferrer">
            View {group.title} page ↗
          </a>
        </div>
      </header>

      <div className="adm-tabs" role="tablist" aria-label="Page">
        {SITE_TEXT.map((g) => (
          <Link key={g.page} className={g.page === group.page ? "is-active" : undefined} href={`/dashboard/site-text?page=${g.page}`}>
            {g.title}
          </Link>
        ))}
      </div>

      {saved ? <p className="adm-flash">Saved. The {group.title} page now shows your changes.</p> : null}

      <form action={saveSiteText} className="adm-form adm-card">
        <input type="hidden" name="page" value={group.page} />
        {group.fields.map((field) => {
          const row = saved_.get(field.key);
          const value = row?.value ?? field.default;
          return (
            <label key={field.key} className="adm-field">
              <span>
                {field.label}
                {row ? <em className="adm-edited">edited</em> : null}
              </span>
              {field.long ? (
                <textarea name={field.key} rows={4} defaultValue={value} maxLength={2000} />
              ) : (
                <input name={field.key} defaultValue={value} maxLength={2000} />
              )}
              {row ? <small>Clear the box and save to go back to the original.</small> : null}
            </label>
          );
        })}
        <div className="adm-form__bar">
          <button type="submit" className="adm-btn adm-btn--red">
            Save {group.title} text
          </button>
          {lastEdit ? (
            <span className="adm-dim">
              Last edited by {lastEdit.updatedBy || "someone"} on{" "}
              {new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeZone: "America/Toronto" }).format(lastEdit.updatedAt)}
            </span>
          ) : null}
        </div>
      </form>
    </>
  );
}
