import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { approveUser, declineUser, setUserActive, setUserRole } from "../admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Members", robots: { index: false, follow: false } };

const FILTERS = [
  ["all", "Everyone"],
  ["pending", "Pending"],
  ["active", "Active"],
  ["staff", "Exec & admins"],
] as const;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const me = await requireStaff();
  if (!me) redirect("/dashboard");
  const { filter: rawFilter, q: rawQ } = await searchParams;
  const q = (rawQ || "").trim().slice(0, 80);

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { profile: true },
    orderBy: { dateJoined: "desc" },
    take: 500,
  });

  // Pending = not active yet (new sign-ups waiting for approval, or someone deactivated).
  const pending = users.filter((u) => !u.isActive);
  const counts: Record<string, number> = {
    all: users.length,
    pending: pending.length,
    active: users.filter((u) => u.isActive).length,
    staff: users.filter((u) => u.isStaff || u.isSuperuser).length,
  };
  const filter = FILTERS.some(([v]) => v === rawFilter) ? rawFilter! : pending.length ? "pending" : "all";
  const shown = users.filter((u) =>
    filter === "pending"
      ? !u.isActive
      : filter === "active"
        ? u.isActive
        : filter === "staff"
          ? u.isStaff || u.isSuperuser
          : true,
  );

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Admin</p>
          <h1>Members</h1>
          <p className="adm-sub">
            Approve new sign-ups and decide who&apos;s on the exec team.
            {me.isSuperuser ? "" : " Only admins can change roles."}
          </p>
        </div>
        <form className="adm-search" role="search">
          <input type="hidden" name="filter" value={filter} />
          <input name="q" defaultValue={q} placeholder="Search name or email" aria-label="Search members" />
        </form>
      </header>

      <div className="adm-tabs" role="tablist" aria-label="Filter">
        {FILTERS.map(([value, label]) => (
          <Link
            key={value}
            className={filter === value ? "is-active" : undefined}
            href={`/dashboard/members?filter=${value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          >
            {label} <span>{counts[value]}</span>
          </Link>
        ))}
      </div>

      {shown.length ? (
        <div className="adm-list">
          {shown.map((u) => {
            const role = u.isSuperuser ? "admin" : u.isStaff ? "staff" : "member";
            const self = u.id === me.id;
            const fullName = [u.firstName, u.lastName !== "-" ? u.lastName : ""].filter(Boolean).join(" ") || u.username;
            return (
              <div key={u.id} className="adm-item adm-item--member">
                <div className="adm-avatar" aria-hidden="true">
                  {(fullName[0] || "?").toUpperCase()}
                </div>
                <div className="adm-item__main">
                  <div className="adm-item__top">
                    {!u.isActive ? <span className="adm-pill adm-pill--new">pending</span> : null}
                    {u.profile?.isBanned ? <span className="adm-pill adm-pill--declined">banned</span> : null}
                    {role !== "member" ? <span className={`adm-pill adm-pill--${role}`}>{role === "admin" ? "admin" : "exec"}</span> : null}
                    {self ? <span className="adm-dim">you</span> : null}
                  </div>
                  <p className="adm-item__title">{fullName}</p>
                  <p className="adm-dim">
                    {u.email} · joined{" "}
                    {new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(u.dateJoined)}
                  </p>
                </div>
                <div className="adm-item__actions">
                  {!u.isActive ? (
                    <>
                      <form action={approveUser}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button className="adm-btn adm-btn--sm adm-btn--ok" type="submit">
                          Approve
                        </button>
                      </form>
                      <form action={declineUser}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button className="adm-btn adm-btn--sm" type="submit" title="Removes this sign-up">
                          Decline
                        </button>
                      </form>
                    </>
                  ) : null}

                  {me.isSuperuser && !self ? (
                    <form action={setUserRole} className="adm-role">
                      <input type="hidden" name="userId" value={u.id} />
                      <select name="role" defaultValue={role} aria-label={`Role for ${fullName}`}>
                        <option value="member">Member</option>
                        <option value="staff">Exec (staff)</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button className="adm-btn adm-btn--sm" type="submit">
                        Set
                      </button>
                    </form>
                  ) : null}

                  {u.isActive && !self && (me.isSuperuser || !u.isSuperuser) ? (
                    <form action={setUserActive}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="active" value="0" />
                      <button className="adm-btn adm-btn--sm adm-btn--quiet" type="submit">
                        Deactivate
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="adm-blank">
          <p className="adm-blank__title">{filter === "pending" ? "Nobody waiting." : "No one here."}</p>
          <p className="adm-dim">
            {filter === "pending" ? "New sign-ups land here for approval." : q ? "Try a different search." : ""}
          </p>
        </div>
      )}
    </>
  );
}
