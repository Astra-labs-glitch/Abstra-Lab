import { openRoles } from "../../lib/jobs";
import { getSiteText, isPageLive } from "../../lib/site-text";
import { UnderConstruction } from "../under-construction";
import { discordHref } from "../content";
import { pageMetadata } from "../seo";
import { Handbook } from "./handbook";
import { RoleList } from "./role-list";
import { JobsTabs } from "./tabs";

// Rebuilt whenever an admin changes a role or this page's text; hourly as a backstop.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Volunteer with us",
  description:
    "Volunteer with Astra Labs, Seneca's student rocketry team. Unpaid student roles in electronics, mechanical, admin, marketing and business, 2–6 hours a week. Any program can apply.",
  path: "/jobs",
});

const subteams = [
  ["Airframe", ["Rebuilding Pioneer's bulkhead with a G10 fibreglass plate", "Fibreglass layup and epoxy work for the 2027 airframe", "Fins, fit checks and OpenRocket simulations"]],
  ["Avionics & recovery", ["Wiring and testing the EasyMini altimeter stacks and GPS trackers", "Designing power and flight boards in KiCad", "Ground ejection tests and packing parachutes"]],
  ["Payload", ["Building and testing ESP32-C6 sensor nodes with MPU-6050 IMUs", "Writing the CAN bus firmware that ties the nodes together", "Getting data down to the ground over LoRa"]],
  ["Ground software & data", ["Our ground station in Python, FastAPI and PostgreSQL", "Working out how much 24 identical sensors disagree in one flight"]],
  ["Operations", ["Sponsorship outreach and funding requests", "Events, workshops and outreach", "Photos, socials and this website"]],
] as const;

const steps = [
  ["01", "Come to a Friday meeting", "5–7 pm in the SSF clubs room. Just show up and say hi."],
  ["02", "Pick a role", "Filter by area and read what you'd do. You can switch later."],
  ["03", "Apply when roles open", "Roles are posted above and the handbook explains the rest. We reply to your Seneca email within 5 days."],
  ["04", "First task, first week", "You'll be paired with a subteam lead right away."],
] as const;

export default async function JobsPage() {
  const [t, roles] = await Promise.all([getSiteText(), openRoles()]);
  if (!(await isPageLive("jobs"))) return <UnderConstruction t={t} page="jobs" name="Volunteer with us" />;
  return (
    <>
      <section className="ax-wrap" style={{ paddingTop: 72, paddingBottom: 56 }}>
        <div className="ax-cols" style={{ alignItems: "center", gap: 48 }}>
          <div style={{ flex: "1 1 480px" }}>
            <p className="ax-label ax-pink" data-edit-key="jobs.hero.label">{t("jobs.hero.label", "Volunteer with us · Fall 2026")}</p>
            <h1 className="ax-display ax-display--xl" style={{ marginBottom: 20, fontSize: "clamp(38px, 5vw, 64px)" }} data-edit-key="jobs.hero.title">{t("jobs.hero.title", "Volunteer on a rocket team.")}</h1>
            <p className="ax-lede" style={{ fontSize: 20, marginTop: 0 }} data-edit-key="jobs.hero.body">{t("jobs.hero.body", "Every role here is unpaid and voluntary, run by students for students. Pick a role, read what you'd actually do, and apply with your résumé. You don't need to have built a rocket. Here's the deal:")}</p>
            <dl className="ax-deal">
              <dt data-edit-key="jobs.who">{t("jobs.who", "Who")}</dt>
              <dd data-edit-key="jobs.deal.who">{t("jobs.deal.who", "Any Seneca student, any program. Each role lists preferred programs.")}</dd>
              <dt data-edit-key="jobs.time">{t("jobs.time", "Time")}</dt>
              <dd data-edit-key="jobs.deal.time">{t("jobs.deal.time", "2–6 hours a week")}</dd>
              <dt data-edit-key="jobs.commitment">{t("jobs.commitment", "Commitment")}</dt>
              <dd data-edit-key="jobs.deal.commitment">{t("jobs.deal.commitment", "At least six months, so you see a build through")}</dd>
              <dt data-edit-key="jobs.where">{t("jobs.where", "Where")}</dt>
              <dd data-edit-key="jobs.deal.where">{t("jobs.deal.where", "SSF clubs room")}</dd>
              <dt data-edit-key="jobs.when">{t("jobs.when", "When")}</dt>
              <dd data-edit-key="jobs.deal.when">{t("jobs.deal.when", "Every Friday, 5–7 pm (our weekly meeting)")}</dd>
            </dl>
          </div>
          <figure style={{ flex: "1 1 380px", margin: 0 }}>
            <img
              src="/images/astra/night-check.jpg"
              alt="A team member under work lights at night checking the nose of a rocket held upright"
              style={{ width: "100%", height: 520, objectFit: "cover", borderRadius: 4 }}
            />
            <figcaption className="ax-caption" data-edit-key="jobs.night-checks-in-timmins">{t("jobs.night-checks-in-timmins", "Night checks in Timmins, Aug 19.")}</figcaption>
          </figure>
        </div>
      </section>

      <section id="roles" className="ax-wrap" style={{ paddingTop: 24, paddingBottom: 96 }}>
        <JobsTabs
          roles={
            <>
              <h2 className="ax-display ax-display--lg" style={{ margin: "32px 0", fontSize: "clamp(32px, 4vw, 56px)" }} data-edit-key="jobs.open-roles">{t("jobs.open-roles", "Open volunteer roles")}</h2>
              {roles.length ? (
                <RoleList roles={roles} />
              ) : (
                <div className="ax-tuned">
                  <div style={{ flex: "1 1 460px", minWidth: 0 }}>
                    <p className="ax-tuned__title" data-edit-key="jobs.tuned.title">{t("jobs.tuned.title", "Stay tuned.")}</p>
                    <p style={{ margin: 0, fontSize: 19, color: "#d9d9d9", maxWidth: 560 }} data-edit-key="jobs.tuned.body">{t("jobs.tuned.body", "New roles are on the way. The exec team posts them here, each with what you'd do, the projects and how to apply. Until then, come to a Friday meeting and say hi.")}</p>
                  </div>
                  <a className="ax-btn ax-btn--red" href={discordHref} target="_blank" rel="noopener noreferrer">
                    Get notified on Discord
                  </a>
                </div>
              )}
            </>
          }
          handbook={<Handbook t={t} />}
        />
      </section>

      <section className="ax-wrap" style={{ paddingBottom: 96 }}>
        <div className="ax-steps">
          {steps.map(([n, title, text], i) => (
            <div key={n}>
              <p className="ax-steps__num">{n}</p>
              <p className="ax-steps__title" data-edit-key={`jobs.step.${i}.title`}>{t(`jobs.step.${i}.title`, title)}</p>
              <p className="ax-steps__text" data-edit-key={`jobs.step.${i}.text`}>{t(`jobs.step.${i}.text`, text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="subteams" className="ax-band" style={{ background: "var(--a-panel)" }}>
        <div className="ax-wrap" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <h2 className="ax-display ax-display--md" style={{ marginBottom: 10 }} data-edit-key="jobs.what-the-subteams-do">{t("jobs.what-the-subteams-do", "What the subteams do")}</h2>
          <p className="ax-soft" style={{ marginTop: 0, marginBottom: 40, maxWidth: 700 }} data-edit-key="jobs.heres-what-youd-actually">{t("jobs.heres-what-youd-actually", "Here's what you'd actually be doing this year. You can switch later, and plenty of people help on two.")}</p>
          <div>
            {subteams.map(([name, tasks], i) => (
              <div key={name} className="ax-subteam">
                <h3 data-edit-key={`jobs.subteam.${i}.name`}>{t(`jobs.subteam.${i}.name`, name)}</h3>
                <ul>
                  {tasks.map((task, j) => (
                    <li key={task} data-edit-key={`jobs.subteam.${i}.task.${j}`}>
                      {t(`jobs.subteam.${i}.task.${j}`, task)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
