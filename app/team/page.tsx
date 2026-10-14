import { hasDatabase, prisma } from "../../lib/prisma";
import { TEAM_GROUPS, getSiteText, isPageLive } from "../../lib/site-text";
import { Editable } from "../editable";
import { pageMetadata } from "../seo";
import { UnderConstruction } from "../under-construction";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Team",
  description: "The students behind Astra Labs, Seneca's student rocketry team: who does what on airframe, avionics, payload, software and operations.",
  path: "/team",
});

async function teamMembers() {
  if (!hasDatabase()) return [];
  try {
    return await prisma.astraProfile.findMany({
      where: { showOnTeam: true, teamGroup: { not: "" }, user: { isActive: true } },
      orderBy: [{ sortOrder: "asc" }, { userId: "asc" }],
      select: {
        userId: true,
        teamGroup: true,
        teamTitle: true,
        bio: true,
        linkedin: true,
        portfolio: true,
        photoAt: true,
        user: { select: { firstName: true, lastName: true, username: true } },
      },
    });
  } catch (error) {
    console.error("team unavailable", error);
    return [];
  }
}

const link = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

export default async function TeamPage() {
  const t = await getSiteText();
  if (!(await isPageLive("team"))) return <UnderConstruction t={t} page="team" name="Team" />;
  const people = await teamMembers();
  const extra = new Set<string>(people.map((p) => String(p.teamGroup)).filter((g) => !TEAM_GROUPS.includes(g)));
  const groups: string[] = [...TEAM_GROUPS, ...extra];

  return (
    <section className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <Editable t={t} k="team.label" d="The team · 2026–27" as="p" className="ax-label" />
      <Editable t={t} k="team.title" d="The crew." as="h1" className="ax-display ax-display--xl" style={{ marginBottom: 20 }} />
      <Editable
        t={t}
        k="team.lede"
        d="Students from seven programs. Here's who does what."
        as="p"
        className="ax-lede"
        style={{ marginTop: 0, marginBottom: 40 }}
      />
      {groups.map((group) => {
        const members = people.filter((p) => p.teamGroup === group);
        if (!members.length) return null;
        return (
          <div key={group} className="ax-tm-sec">
            <p className="ax-label" style={{ margin: 0 }}>
              {group}
            </p>
            <div className="ax-tm-grid">
              {members.map((m) => {
                const name = [m.user.firstName, m.user.lastName !== "-" ? m.user.lastName : ""].filter(Boolean).join(" ") || m.user.username;
                return (
                  <div key={m.userId} className="ax-tm-card">
                    <div className="ax-tm-card__ph">
                      {m.photoAt ? (
                        <img src={`/api/photos/member/${m.userId}?v=${m.photoAt.getTime()}`} alt={name} loading="lazy" />
                      ) : (
                        name[0]?.toUpperCase()
                      )}
                    </div>
                    <p className="ax-tm-card__name">{name}</p>
                    {m.teamTitle ? <p className="ax-tm-card__role">{m.teamTitle}</p> : null}
                    {m.bio ? <p className="ax-tm-card__bio">{m.bio}</p> : null}
                    {m.linkedin || m.portfolio ? (
                      <p className="ax-tm-card__links">
                        {m.linkedin ? (
                          <a href={link(m.linkedin)} target="_blank" rel="noopener noreferrer nofollow">
                            LinkedIn
                          </a>
                        ) : null}
                        {m.portfolio ? (
                          <a href={link(m.portfolio)} target="_blank" rel="noopener noreferrer nofollow">
                            Portfolio
                          </a>
                        ) : null}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {people.length ? null : <p className="ax-dim">Profiles are on their way.</p>}
    </section>
  );
}
