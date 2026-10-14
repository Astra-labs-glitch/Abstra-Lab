import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { TEAM_GROUPS, isPageLive } from "../../../lib/site-text";
import { moveTeamMember, updateTeamSpot } from "../admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Team", robots: { index: false, follow: false } };

export default async function TeamAdminPage() {
  const me = await requireStaff();
  if (!me) redirect("/dashboard");

  const [users, live] = await Promise.all([
    prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        astra: { select: { teamGroup: true, teamTitle: true, showOnTeam: true, sortOrder: true, photoAt: true } },
      },
    }),
    isPageLive("team"),
  ]);
  const sorted = users.sort((a, b) => (a.astra?.sortOrder ?? 0) - (b.astra?.sortOrder ?? 0) || a.id - b.id);
  const unplaced = sorted.filter((u) => !u.astra?.teamGroup);
  const name = (u: (typeof users)[number]) =>
    [u.firstName, u.lastName !== "-" ? u.lastName : ""].filter(Boolean).join(" ") || u.username;

  const Row = ({ u }: { u: (typeof users)[number] }) => (
    <div className="adm-item adm-item--team">
      <div className="adm-avatar">
        {u.astra?.photoAt ? <img src={`/api/photos/member/${u.id}?v=${u.astra.photoAt.getTime()}`} alt="" /> : name(u)[0]?.toUpperCase()}
      </div>
      <div className="adm-item__main">
        <p className="adm-item__title adm-item__title--sm">
          {name(u)}
          {u.id === me.id ? <span className="adm-dim"> · you</span> : null}
        </p>
        {u.astra?.teamGroup ? (
          <div className="adm-ord">
            <form action={moveTeamMember}>
              <input type="hidden" name="userId" value={u.id} />
              <input type="hidden" name="dir" value="-1" />
              <button type="submit" aria-label={`Move ${name(u)} up`}>
                ↑
              </button>
            </form>
            <form action={moveTeamMember}>
              <input type="hidden" name="userId" value={u.id} />
              <input type="hidden" name="dir" value="1" />
              <button type="submit" aria-label={`Move ${name(u)} down`}>
                ↓
              </button>
            </form>
          </div>
        ) : null}
      </div>
      <form action={updateTeamSpot} className="adm-spot">
        <input type="hidden" name="userId" value={u.id} />
        <select name="group" defaultValue={u.astra?.teamGroup ?? ""} aria-label={`Group for ${name(u)}`}>
          <option value="">Not on Team page</option>
          {TEAM_GROUPS.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <input name="title" defaultValue={u.astra?.teamTitle ?? ""} placeholder="Title, e.g. Avionics lead" aria-label={`Title for ${name(u)}`} maxLength={80} />
        <label className="adm-check">
          <input type="checkbox" name="show" defaultChecked={u.astra?.showOnTeam ?? true} /> Show
        </label>
        <button className="adm-btn adm-btn--sm" type="submit">
          Save
        </button>
      </form>
    </div>
  );

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Team page</p>
          <h1>Team</h1>
          <p className="adm-sub">
            Who shows on the public Team page, under which group and in what order. Members add their own photo and bio in My
            account.
          </p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/team" target="_blank" rel="noopener noreferrer">
            View on site ↗
          </a>
        </div>
      </header>

      {!live ? (
        <p className="adm-flash adm-flash--err">
          The Team page is under construction right now, so visitors don&apos;t see this yet. Turn it on in{" "}
          <Link href="/dashboard/pages">Pages</Link>.
        </p>
      ) : null}

      {TEAM_GROUPS.map((g) => {
        const people = sorted.filter((u) => u.astra?.teamGroup === g);
        return (
          <section key={g}>
            <h2 className="adm-h2">{g}</h2>
            {people.length ? (
              <div className="adm-list">
                {people.map((u) => (
                  <Row key={u.id} u={u} />
                ))}
              </div>
            ) : (
              <p className="adm-dim">Nobody in this group yet.</p>
            )}
          </section>
        );
      })}

      {unplaced.length ? (
        <section>
          <h2 className="adm-h2">Not on the Team page</h2>
          <div className="adm-list">
            {unplaced.map((u) => (
              <Row key={u.id} u={u} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
