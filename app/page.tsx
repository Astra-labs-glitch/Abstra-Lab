import type { Metadata } from "next";
import Link from "next/link";

import { getSiteText } from "../lib/site-text";
import { SupporterLogos } from "./supporters";

export const revalidate = 3600;

export const metadata: Metadata = {
  description:
    "Astra Labs is Seneca Polytechnic's student rocketry team. Pioneer went to Launch Canada 2026; now we're refitting it and building our 2027 rocket.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/" },
};

const IMG = "/images/astra";

const diary = [
  ["Sun, Aug 16", "fit-check.jpg", "Three team members holding two airframe sections together for a fit check", "Test-fitting airframe sections. Many hands, one drill."],
  ["Tue, Aug 18", "mentor-review.jpg", "Team members in Astra Labs shirts gathered around a table while two mentors look over a rocket", "Sitting down with mentors to walk them through our build."],
  ["Thu, Aug 20", "pioneer-tent.jpg", "A team member sitting beside Pioneer, pointing to the PIONEER lettering on the airframe", "Pioneer out at our tent on the range."],
  ["Fri, Aug 21", "flight-line.jpg", "Two team members photographing another team's launch from the flight line", "Watching other teams fly. Ours got called off for weather. Not the ending we wanted, so we're going again."],
] as const;

const towerLabels = [
  [402, "553 m"],
  [302, "1.1 km"],
  [202, "1.7 km"],
  [102, "2.2 km"],
  [2, "2.8 km"],
] as const;

export default async function Home() {
  const t = await getSiteText();
  return (
    <>
      <section className="ax-hero">
        <img src={`${IMG}/hero-pioneer-range.jpg`} alt="An Astra Labs member reaching up beside Pioneer, a red-and-white rocket, on the Launch Canada range" />
        <div className="ax-wrap ax-hero__body">
          <p className="ax-label" data-edit-key="home.hero.label">{t("home.hero.label", "Team 06 · Seneca Polytechnic")}</p>
          <h1 className="ax-display ax-display--xl" data-edit-key="home.hero.title">{t("home.hero.title", "We build rockets at Seneca.")}</h1>
          <div className="ax-hero__row">
            <p data-edit-key="home.hero.body">{t("home.hero.body", "20-odd students, seven programs, one red rocket. Pioneer made it to Launch Canada in Timmins this August. The weather cancelled our launch, so we're refitting it and starting a second rocket for 2027.")}</p>
            <div className="ax-actions">
              <Link className="ax-btn ax-btn--red" href="/jobs">
                Come build with us
              </Link>
              <a className="ax-btn ax-btn--ghost" href="#timmins">
                How Timmins went
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ax-status" aria-label="Where things stand">
        <div className="ax-wrap ax-status__grid" style={{ padding: 0 }}>
          <div>
            <h3 data-edit-key="home.status.1.title">{t("home.status.1.title", "Pioneer")}</h3>
            <p data-edit-key="home.status.1.body">{t("home.status.1.body", "New G10 bulkhead going in. Flight-ready target: Nov 30.")}</p>
          </div>
          <div>
            <h3 data-edit-key="home.status.2.title">{t("home.status.2.title", "2027 rocket")}</h3>
            <p data-edit-key="home.status.2.body">{t("home.status.2.body", "First design review Nov 30. Preliminary review Jan 31.")}</p>
          </div>
          <div>
            <h3 data-edit-key="home.status.3.title">{t("home.status.3.title", "Recruiting")}</h3>
            <p data-edit-key="home.status.3.body">{t("home.status.3.body", "Any program. No rocketry experience needed.")}</p>
          </div>
        </div>
      </section>

      <section id="pioneer" className="ax-wrap ax-split">
        <p className="ax-label" data-edit-key="home.the-vehicle">{t("home.the-vehicle", "The vehicle")}</p>
        <div className="ax-split__main">
          <h2 className="ax-display ax-display--lg" style={{ marginBottom: 32 }} data-edit-key="home.meet-pioneer">{t("home.meet-pioneer", "Meet Pioneer")}</h2>
          <div className="ax-cols">
            <div>
              <p style={{ marginTop: 0, fontSize: 20, color: "var(--a-text)" }} data-edit-key="home.our-first-highpower-rocket">{t("home.our-first-highpower-rocket", "Our first high-power rocket. 2.5 m tall, 12.6 kg loaded, and built to reach about 2.8 km on a Cesaroni L1355-P.")}</p>
              <p className="ax-soft" style={{ marginBottom: 0 }} data-edit-key="home.well-be-upfront-about">{t("home.well-be-upfront-about", "We'll be upfront about what's ours. The airframe is a Wildman Extreme fibreglass kit, and recovery runs on off-the-shelf EasyMini altimeters with Featherweight GPS. We assembled, wired and integrated all of it. The payload is the part we designed from scratch.")}</p>
            </div>
            <dl className="ax-specs">
              <dt data-edit-key="home.airframe">{t("home.airframe", "Airframe")}</dt>
              <dd data-edit-key="home.4-g12-fibreglass-g10">{t("home.4-g12-fibreglass-g10", "4\" G12 fibreglass, G10 fins")}</dd>
              <dt data-edit-key="home.motor">{t("home.motor", "Motor")}</dt>
              <dd data-edit-key="home.cesaroni-l1355p">{t("home.cesaroni-l1355p", "Cesaroni L1355-P")}</dd>
              <dt data-edit-key="home.recovery">{t("home.recovery", "Recovery")}</dt>
              <dd data-edit-key="home.dual-deploy-two-easymini">{t("home.dual-deploy-two-easymini", "Dual deploy, two EasyMini stacks")}</dd>
              <dt data-edit-key="home.tracking">{t("home.tracking", "Tracking")}</dt>
              <dd data-edit-key="home.two-featherweight-gps-units">{t("home.two-featherweight-gps-units", "Two Featherweight GPS units")}</dd>
              <dt data-edit-key="home.flights-so-far">{t("home.flights-so-far", "Flights so far")}</dt>
              <dd className="ax-pink" data-edit-key="home.zero-working-on-it">{t("home.zero-working-on-it", "Zero. Working on it.")}</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="ax-wrap" aria-label="Target altitude" style={{ paddingTop: 24, paddingBottom: 96 }}>
        <div className="ax-altitude">
          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <p className="ax-altitude__num" data-edit-key="home.28-km">{t("home.28-km", "2.8 km")}</p>
            <p className="ax-soft" style={{ margin: 0, maxWidth: 360 }} data-edit-key="home.how-high-pioneer-is">{t("home.how-high-pioneer-is", "How high Pioneer is built to go. That's roughly five CN Towers stacked on top of each other.")}</p>
          </div>
          <div className="ax-towers">
            <svg
              width="190"
              height="560"
              viewBox="-60 -50 190 560"
              role="img"
              aria-label="Five CN Towers stacked, with a smoke trail and a rocket reaching the top at 2.8 km"
            >
              <path d="M-18 500 C -8 420, -28 360, -16 290 C -6 220, -26 160, -15 90 C -10 60, -20 36, -18 18" fill="none" stroke="#BDBDBD" strokeOpacity="0.18" strokeWidth="22" strokeLinecap="round" />
              <path d="M-18 500 C -8 420, -28 360, -16 290 C -6 220, -26 160, -15 90 C -10 60, -20 36, -18 18" fill="none" stroke="#E6E6E6" strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" />
              <line x1="-50" y1="500" x2="70" y2="500" stroke="#3A3A3A" strokeWidth="2" />
              {towerLabels.map(([y, label]) => (
                <g key={label}>
                  <line x1="44" y1={y} x2="52" y2={y} stroke="#3A3A3A" strokeWidth="1" />
                  <text x="56" y={y + 4} fill="#8C8C8C" fontSize="11">
                    {label}
                  </text>
                </g>
              ))}
            </svg>
            {[0, 1, 2, 3, 4].map((i) => (
              <img key={i} className="ax-tower" src={`${IMG}/cn-tower.png`} alt="" style={{ top: 50 + i * 100 }} />
            ))}
            <img className="ax-tower-rocket" src={`${IMG}/astra-rocket.png`} alt="" />
          </div>
        </div>
      </section>

      <section className="ax-band" aria-labelledby="payload-h">
        <div className="ax-payload" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="ax-payload__text">
            <p className="ax-label" data-edit-key="home.the-payload">{t("home.the-payload", "The payload")}</p>
            <h2 id="payload-h" className="ax-display ax-display--md" style={{ marginBottom: 24 }} data-edit-key="home.24-sensors-one-question">{t("home.24-sensors-one-question", "24 sensors, one question")}</h2>
            <p style={{ marginTop: 0, color: "var(--a-text)" }} data-edit-key="home.if-you-fly-24">{t("home.if-you-fly-24", "If you fly 24 identical motion sensors on the same rocket, how much do they disagree? That's what our payload is built to find out.")}</p>
            <p className="ax-soft" data-edit-key="home.each-node-is-an">{t("home.each-node-is-an", "Each node is an ESP32-C6 with an MPU-6050 IMU. They talk over a CAN bus to a hub that radios data down on 433 MHz. Think of it as a tiny rideshare mission: lots of small passengers sharing one ride up.")}</p>
            <p className="ax-soft" style={{ marginBottom: 0 }} data-edit-key="home.we-designed-the-boards">{t("home.we-designed-the-boards", "We designed the boards in KiCad and had them fabbed with help from Seneca HELIX, the SSF and Seneca Alumni.")}</p>
          </div>
          <figure className="ax-payload__img">
            <img src={`${IMG}/payload-nodes.jpg`} alt="Six green payload node boards standing on a round carrier board, with builders' names printed on the silkscreen" />
            <figcaption data-edit-key="home.look-closely-the-people">{t("home.look-closely-the-people", "Look closely: the people who built these boards put their names on the silkscreen.")}</figcaption>
          </figure>
        </div>
      </section>

      <section id="rockets" className="ax-wrap ax-split" style={{ paddingBottom: 40 }}>
        <p className="ax-label" data-edit-key="home.our-rockets">{t("home.our-rockets", "Our rockets")}</p>
        <div className="ax-split__main">
          <p className="ax-soft" style={{ marginTop: 0, marginBottom: 28 }} data-edit-key="home.short-list-so-far">{t("home.short-list-so-far", "Short list so far. Give us time.")}</p>
          <div className="ax-rocket-row">
            <p className="ax-rocket-row__year" data-edit-key="home.2026">{t("home.2026", "2026")}</p>
            <p className="ax-rocket-row__name" data-edit-key="home.pioneer">{t("home.pioneer", "Pioneer")}</p>
            <p className="ax-rocket-row__note" data-edit-key="home.went-to-launch-canada">{t("home.went-to-launch-canada", "Went to Launch Canada 2026. Launch cancelled for weather. Refit underway.")}</p>
          </div>
          <div className="ax-rocket-row">
            <p className="ax-rocket-row__year" data-edit-key="home.2027">{t("home.2027", "2027")}</p>
            <p className="ax-rocket-row__name ax-dim" data-edit-key="home.name-coming-soon">{t("home.name-coming-soon", "Name coming soon")}</p>
            <p className="ax-rocket-row__note" data-edit-key="home.4inch-airframe-on-75">{t("home.4inch-airframe-on-75", "4-inch airframe on 75 mm Cesaroni hardware with the next payload. In design.")}</p>
          </div>
        </div>
      </section>

      <section id="timmins" className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 56 }}>
        <p className="ax-label" data-edit-key="home.launch-canada-aug-1522">{t("home.launch-canada-aug-1522", "Launch Canada · Aug 15–22, 2026")}</p>
        <h2 className="ax-display ax-display--lg" style={{ marginBottom: 56 }} data-edit-key="home.a-week-in-timmins">{t("home.a-week-in-timmins", "A week in Timmins")}</h2>
        <div className="ax-diary">
          {diary.map(([date, file, alt, text]) => (
            <article key={date}>
              <p>{date}</p>
              <img src={`${IMG}/${file}`} alt={alt} loading="lazy" />
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="crew" style={{ padding: "64px 0 96px" }}>
        <img
          src={`${IMG}/team-flag.jpg`}
          alt="Five Astra Labs members in team shirts standing in front of a large Canadian flag at the Launch Canada hall"
          loading="lazy"
          style={{ width: "100%", height: "clamp(320px, 50vw, 680px)", objectFit: "cover", objectPosition: "center 38%" }}
        />
        <div className="ax-wrap ax-split" style={{ paddingTop: 48, paddingBottom: 0 }}>
          <p className="ax-label" data-edit-key="home.the-crew">{t("home.the-crew", "The crew")}</p>
          <div className="ax-split__main">
            <h2 className="ax-display ax-display--md" style={{ marginBottom: 24 }} data-edit-key="home.small-team-real-rockets">{t("home.small-team-real-rockets", "Small team. Real rockets.")}</h2>
            <p style={{ marginTop: 0, color: "var(--a-text)" }} data-edit-key="home.were-a-seneca-student">{t("home.were-a-seneca-student", "We're a Seneca Student Federation club. Members come from seven programs, including Electronics Engineering Technology and Computer Programming and Analysis.")}</p>
            <p className="ax-soft" data-edit-key="home.subteams-own-the-airframe">{t("home.subteams-own-the-airframe", "Subteams own the airframe, avionics and recovery, payload, ground software and operations. We lean on mentors from the rocketry community when we get stuck.")}</p>
            <p>
              <Link href="/jobs" className="ax-pink" style={{ fontWeight: 700 }}>
                See how to join →
              </Link>
            </p>
            <p className="ax-dim" style={{ fontSize: 14, marginBottom: 0 }} data-edit-key="home.the-crew-at-the">{t("home.the-crew-at-the", "The crew at the Launch Canada hall, August 2026. Faculty advisor: Prof. Houman Hakima. Photos by Wendy Liu.")}</p>
          </div>
        </div>
      </section>

      <section id="thanks" style={{ borderTop: "1px solid var(--a-line)" }}>
        <div className="ax-wrap" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 32 }}>
            <div>
              <p className="ax-label" style={{ marginBottom: 14 }} data-edit-key="home.thank-you">{t("home.thank-you", "Thank you")}</p>
              <p style={{ margin: 0, fontSize: 20, color: "var(--a-text)" }} data-edit-key="home.pioneer-wouldnt-exist-without">{t("home.pioneer-wouldnt-exist-without", "Pioneer wouldn't exist without the people who helped pay for it.")}</p>
            </div>
            <Link href="/sponsorship" className="ax-pink" style={{ fontWeight: 700 }}>
              Sponsor the 2027 rocket →
            </Link>
          </div>
          <SupporterLogos />
        </div>
      </section>

      <section className="ax-cta">
        <div className="ax-wrap ax-cta__inner">
          <h2 className="ax-display ax-display--lg" data-edit-key="home.help-us-build-the">{t("home.help-us-build-the", "Help us build the 2027 rocket.")}</h2>
          <div>
            <p data-edit-key="home.any-seneca-program-about">{t("home.any-seneca-program-about", "Any Seneca program. About five hours a week for at least six months. We'll teach you the rest.")}</p>
            <div className="ax-actions">
              <Link className="ax-btn ax-btn--black" href="/jobs">
                How to join
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
