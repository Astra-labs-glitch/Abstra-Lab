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
  ["Fri, Aug 21", "flight-line.jpg", "Two team members photographing another team's launch from the flight line", "Watching other teams fly. Ours didn't pass pre-launch inspection. Not the ending we wanted, so we're going again."],
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
            <p data-edit-key="home.hero.body">{t("home.hero.body", "20-odd students, seven programs, one red rocket. Pioneer made it to Launch Canada in Timmins in August 2026. It didn't pass pre-launch inspection, so we're refitting it and starting a second rocket for 2027.")}</p>
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

      <section id="rockets" className="ax-wrap ax-split" style={{ paddingTop: 96, paddingBottom: 40 }}>
        <p className="ax-label" data-edit-key="home.our-rockets">{t("home.our-rockets", "Our rockets")}</p>
        <div className="ax-split__main">
          <p className="ax-soft" style={{ marginTop: 0, marginBottom: 28 }} data-edit-key="home.short-list-so-far">{t("home.short-list-so-far", "Short list so far. Give us time.")}</p>
          <Link className="ax-rocket-row ax-rocket-row--link" href="/rockets/pioneer">
            <p className="ax-rocket-row__year" data-edit-key="home.2026">{t("home.2026", "2026")}</p>
            <p className="ax-rocket-row__name" data-edit-key="home.pioneer">{t("home.pioneer", "Pioneer")}</p>
            <p className="ax-rocket-row__note" data-edit-key="home.went-to-launch-canada">{t("home.went-to-launch-canada", "Went to Launch Canada 2026. Didn't pass pre-launch inspection. Refit underway.")}</p>
            <span className="ax-rocket-row__go" aria-hidden="true">→</span>
          </Link>
          <Link className="ax-rocket-row ax-rocket-row--link" href="/rockets/2027">
            <p className="ax-rocket-row__year" data-edit-key="home.2027">{t("home.2027", "2027")}</p>
            <p className="ax-rocket-row__name ax-dim" data-edit-key="home.name-coming-soon">{t("home.name-coming-soon", "Name coming soon")}</p>
            <p className="ax-rocket-row__note" data-edit-key="home.4inch-airframe-on-75">{t("home.4inch-airframe-on-75", "4-inch airframe on 75 mm Cesaroni hardware with the next payload. In design.")}</p>
            <span className="ax-rocket-row__go" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="ax-hm" aria-labelledby="home-hivemind">
        <div className="ax-hm__text">
          <p className="ax-label" data-edit-key="home.hm.label">{t("home.hm.label", "Selected for CAN-SBX 2026–27, flying summer 2027")}</p>
          <h2 id="home-hivemind" className="ax-display ax-display--lg" style={{ marginBottom: 18 }} data-edit-key="home.hm.title">{t("home.hm.title", "Hivemind.")}</h2>
          <p className="ax-lede" style={{ marginTop: 0 }} data-edit-key="home.hm.body">{t("home.hm.body", "Thirty small computers on a stratospheric balloon, learning together at 30 km. SEDS-Canada and the Canadian Space Agency picked our payload for this year's challenge, and students will build the nodes.")}</p>
          <div className="ax-actions" style={{ marginTop: 24 }}>
            <Link className="ax-btn ax-btn--red" href="/payloads/hivemind">
              See Hivemind
            </Link>
            <Link className="ax-btn ax-btn--ghost" href="/workshop">
              Join the workshop waitlist
            </Link>
          </div>
        </div>
        <figure className="ax-hm__img">
          <img src={`${IMG}/hivemind-rack-cad.jpg`} alt="CAD render of the Hivemind rack: five stacked levels of round green node boards" loading="lazy" />
        </figure>
      </section>

      <section id="timmins" className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 56 }}>
        <p className="ax-label" data-edit-key="home.launch-canada-aug-1522">{t("home.launch-canada-aug-1522", "Launch Canada · Aug 15–22, 2026")}</p>
        <h2 className="ax-display ax-display--lg" style={{ marginBottom: 56 }} data-edit-key="home.a-week-in-timmins">{t("home.a-week-in-timmins", "A week in Timmins")}</h2>
        <div className="ax-diary">
          {diary.map(([date, file, alt, text], i) => (
            <article key={date}>
              <p data-edit-key={`home.diary.${i}.date`}>{t(`home.diary.${i}.date`, date)}</p>
              <img src={`${IMG}/${file}`} alt={alt} loading="lazy" />
              <p data-edit-key={`home.diary.${i}.text`}>{t(`home.diary.${i}.text`, text)}</p>
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
          <p className="ax-label" data-edit-key="home.the-crew">{t("home.the-crew", "A Seneca Student Federation club")}</p>
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
