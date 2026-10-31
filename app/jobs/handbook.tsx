type Lookup = (key: string, fallback: string) => string;

// Public handbook: a trimmed copy of the internal one. No budget, mentor names or
// personal contact details belong here.
export function Handbook({ t }: { t: Lookup }) {
  const E = ({ k, d, as: Tag = "p" }: { k: string; d: string; as?: "p" | "li" | "h2" | "td" }) => <Tag data-edit-key={k}>{t(k, d)}</Tag>;
  return (
    <div className="ax-hb">
      <nav className="ax-hb__toc" aria-label="Handbook sections">
        <a href="#h-what">What we are</a>
        <a href="#h-dates">Key dates</a>
        <a href="#h-teams">Teams</a>
        <a href="#h-expect">What we expect</a>
        <a href="#h-get">What you get</a>
        <a href="#h-safety">Safety</a>
        <a href="#h-join">How joining works</a>
      </nav>
      <article className="ax-hb__doc">
        <section id="h-what">
          <p className="ax-label ax-pink" data-edit-key="hb.label">{t("hb.label", "Handbook")}</p>
          <E as="h2" k="hb.what.title" d="What Astra Labs is" />
          <E k="hb.what.1" d="Team 06, Seneca Polytechnic. We build and fly high-power rockets and the payloads inside them. Our current flight, Pioneer, carries a rideshare-style payload: about 30 small ESP32-C6 sensor nodes that each log data from onboard sensors and send it to a central STM32 hub. The hub forwards data to the ground station and stores it on two SD cards and two flash chips." />
          <E k="hb.what.2" d="We compete at Launch Canada 2026 in August, with the rocket targeting 2.8 km." />
        </section>
        <section id="h-dates">
          <E as="h2" k="hb.dates.title" d="Key dates" />
          <table>
            <thead><tr><th>When</th><th>What</th></tr></thead>
            <tbody>
              <tr><E as="td" k="hb.dates.0.when" d="This semester" /><E as="td" k="hb.dates.0.what" d="Interviews and onboarding" /></tr>
              <tr><E as="td" k="hb.dates.1.when" d="Winter break" /><E as="td" k="hb.dates.1.what" d="Onboarding tasks, training, CAD and schematic reviews" /></tr>
              <tr><E as="td" k="hb.dates.2.when" d="January–February" /><E as="td" k="hb.dates.2.what" d="Test flight of the rebuilt rocket" /></tr>
              <tr><E as="td" k="hb.dates.3.when" d="August 2026" /><E as="td" k="hb.dates.3.what" d="Launch Canada" /></tr>
            </tbody>
          </table>
        </section>
        <section id="h-teams">
          <E as="h2" k="hb.teams.title" d="Teams" />
          <E k="hb.teams.intro" d="Volunteers join one of five areas, and can help a second one once they are settled." />
          <ul>
            <E as="li" k="hb.teams.0" d="Electronics: PCBs, firmware, the CAN bus protocol, avionics wiring, ground station software." />
            <E as="li" k="hb.teams.1" d="Mechanical: CAD, 3D printing, airframe layup, assembly and fit checks." />
            <E as="li" k="hb.teams.2" d="Admin: project schedule, design review documents, safety records." />
            <E as="li" k="hb.teams.3" d="Marketing: social media, photo and video, website content." />
            <E as="li" k="hb.teams.4" d="Business: sponsorship, fundraising, purchasing." />
          </ul>
        </section>
        <section id="h-expect">
          <E as="h2" k="hb.expect.title" d="What we expect" />
          <ul>
            <E as="li" k="hb.expect.0" d="Show up to your team's weekly check-in, or tell your lead before you miss it." />
            <E as="li" k="hb.expect.1" d="Finish what you take on, or hand it back early so someone else can pick it up." />
            <E as="li" k="hb.expect.2" d="If we do not hear from you for two weeks, a lead will message you. After that your spot may be given to someone on the waitlist." />
            <E as="li" k="hb.expect.3" d="Document your work so the next person can continue it." />
          </ul>
        </section>
        <section id="h-get">
          <E as="h2" k="hb.get.title" d="What you get" />
          <ul>
            <E as="li" k="hb.get.0" d="A named role on a real flight project, with a title we can confirm to employers." />
            <E as="li" k="hb.get.1" d="A recommendation letter from your lead after a full term of steady work." />
            <E as="li" k="hb.get.2" d="Skills endorsements on LinkedIn." />
            <E as="li" k="hb.get.3" d="If you opt in, your résumé can be shared with our sponsors. This is never done without your permission." />
          </ul>
          <E k="hb.get.note" d="Volunteering here does not promise a job or co-op placement." />
        </section>
        <section id="h-safety">
          <E as="h2" k="hb.safety.title" d="Safety" />
          <E k="hb.safety.body" d="Black powder and ejection charges are handled only by a licensed mentor. Students do the calculations and design reviews, and never prepare or fire charges on their own. All ground tests happen under a mentor's supervision." />
        </section>
        <section id="h-join">
          <E as="h2" k="hb.join.title" d="How joining works" />
          <ul>
            <E as="li" k="hb.join.0" d="Pick a role from the Open volunteer roles tab and send an application with your résumé." />
            <E as="li" k="hb.join.1" d="A short interview with the team lead." />
            <E as="li" k="hb.join.2" d="An onboarding task in your first week, paired with a current member." />
          </ul>
        </section>
      </article>
    </div>
  );
}
