import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { requireUser } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { removeResume, saveAccount, uploadResume } from "../admin-actions";
import { AccountPhoto } from "../uploads";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const me = await requireUser();
  if (!me) redirect("/accounts/login");
  const { saved, error } = await searchParams;
  const p = await prisma.astraProfile.findUnique({
    where: { userId: me.id },
    select: {
      program: true,
      bio: true,
      linkedin: true,
      portfolio: true,
      teamGroup: true,
      teamTitle: true,
      wantSubteam: true,
      showOnTeam: true,
      photoAt: true,
      resumeName: true,
      resumeSize: true,
    },
  });
  const last = me.lastName === "-" ? "" : me.lastName;
  const fullName = [me.firstName, last].filter(Boolean).join(" ") || me.username;
  const spot = p?.teamGroup ? [p.teamTitle || "Member", p.teamGroup].join(" · ") : "";

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">My account</p>
          <h1>{fullName}</h1>
          <p className="adm-sub">
            {spot
              ? `${spot}. This is what shows on your Team page card.`
              : `No team spot yet${p?.wantSubteam ? ` (you asked for ${p.wantSubteam})` : ""}. An admin sets it on the Members page.`}
          </p>
        </div>
        {spot ? (
          <div className="adm-head__actions">
            <a className="adm-btn" href="/team" target="_blank" rel="noopener noreferrer">
              See the Team page ↗
            </a>
          </div>
        ) : null}
      </header>

      {saved === "1" ? <p className="adm-flash">Profile saved.</p> : null}
      {saved === "resume" ? <p className="adm-flash">Résumé uploaded. Only admins can see it.</p> : null}
      {error === "resume" ? <p className="adm-flash adm-flash--err">Résumé must be a PDF or Word file under 4 MB.</p> : null}

      <div className="adm-acct">
        <AccountPhoto
          initial={fullName[0]?.toUpperCase() ?? "?"}
          src={p?.photoAt ? `/api/photos/member/${me.id}?v=${p.photoAt.getTime()}` : null}
        />

        <div style={{ display: "grid", gap: 28, minWidth: 0 }}>
          <form action={saveAccount} className="adm-form">
            <div className="adm-form__grid">
              <label className="adm-field">
                <span>First name</span>
                <input name="firstName" required maxLength={60} defaultValue={me.firstName} />
              </label>
              <label className="adm-field">
                <span>Last name</span>
                <input name="lastName" maxLength={60} defaultValue={last} />
              </label>
            </div>
            <div className="adm-form__grid">
              <label className="adm-field">
                <span>Program</span>
                <input name="program" maxLength={120} defaultValue={p?.program} placeholder="e.g. Electronics Engineering Technology" />
              </label>
              <label className="adm-field">
                <span>Team role</span>
                <input value={spot || "Not set yet"} disabled readOnly />
                <small>Set by an admin.</small>
              </label>
            </div>
            <label className="adm-field">
              <span>Short bio</span>
              <small>One or two lines for your Team card.</small>
              <textarea name="bio" rows={3} maxLength={400} defaultValue={p?.bio} />
            </label>
            <div className="adm-form__grid">
              <label className="adm-field">
                <span>LinkedIn</span>
                <input name="linkedin" maxLength={200} defaultValue={p?.linkedin} placeholder="linkedin.com/in/…" />
              </label>
              <label className="adm-field">
                <span>Portfolio / GitHub</span>
                <input name="portfolio" maxLength={200} defaultValue={p?.portfolio} placeholder="github.com/…" />
              </label>
            </div>
            <label className="adm-check">
              <input type="checkbox" name="showOnTeam" defaultChecked={p?.showOnTeam ?? true} /> Show me on the public Team page
            </label>
            <div className="adm-form__bar">
              <button className="adm-btn adm-btn--red" type="submit">
                Save profile
              </button>
            </div>
          </form>

          <section className="adm-card">
            <h2 className="adm-card__h">Résumé</h2>
            <p className="adm-dim" style={{ marginBottom: 16 }}>
              Private: only admins see it. Keep it current so the exec team can find you for new roles.
            </p>
            {p?.resumeName ? (
              <div className="adm-file" style={{ marginBottom: 16 }}>
                <div>
                  <p className="adm-file__name">{p.resumeName}</p>
                  <p className="adm-dim">{Math.max(1, Math.round(p.resumeSize / 1024))} KB · private</p>
                </div>
                <div className="adm-head__actions">
                  <a className="adm-btn adm-btn--sm" href="/dashboard/account/resume">
                    Download
                  </a>
                  <form action={removeResume}>
                    <button className="adm-btn adm-btn--sm adm-btn--quiet" type="submit">
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
            <form action={uploadResume} className="adm-file">
              <input name="resume" type="file" accept=".pdf,.doc,.docx" required aria-label="Résumé file" />
              <button className="adm-btn adm-btn--sm adm-btn--red" type="submit">
                {p?.resumeName ? "Replace résumé" : "Upload résumé"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
