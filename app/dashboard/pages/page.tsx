import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../lib/auth";
import { SITE_PAGES, pageStatus } from "../../../lib/site-text";
import { setPageLive } from "../admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pages", robots: { index: false, follow: false } };

export default async function PagesAdminPage() {
  if (!(await requireStaff())) redirect("/dashboard");
  const status = await pageStatus();

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Website</p>
          <h1>Pages</h1>
          <p className="adm-sub">
            Switch a page off and visitors see &ldquo;Under construction&rdquo; instead. The menu link stays, so people know
            it&apos;s coming.
          </p>
        </div>
      </header>
      <div className="adm-list">
        {SITE_PAGES.map((p) => {
          const live = status[p.key];
          return (
            <div key={p.key} className="adm-item adm-item--page">
              <div className="adm-item__main">
                <div className="adm-item__top">
                  <span className={`adm-pill adm-pill--${live ? "open" : "draft"}`}>{live ? "live" : "under construction"}</span>
                  <a className="adm-dim" href={p.path} target="_blank" rel="noopener noreferrer">
                    alsp.ca{p.path} ↗
                  </a>
                </div>
                <p className="adm-item__title">{p.name}</p>
              </div>
              <form action={setPageLive}>
                <input type="hidden" name="key" value={p.key} />
                <input type="hidden" name="live" value={live ? "0" : "1"} />
                <button type="submit" className={`adm-btn adm-btn--sm${live ? "" : " adm-btn--ok"}`}>
                  {live ? "Show Under construction" : "Make it live"}
                </button>
              </form>
            </div>
          );
        })}
      </div>
      <p className="adm-note">The home page is always live. To change the words on any page, use Edit website next to the logo.</p>
    </>
  );
}
