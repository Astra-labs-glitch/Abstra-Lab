import Link from "next/link";

import { getSiteText, isPageLive } from "../../../lib/site-text";
import { pageMetadata } from "../../seo";
import { UnderConstruction } from "../../under-construction";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Pioneer",
  description: "Pioneer, Astra Labs' first high-power rocket: the airframe, recovery, what happened at Launch Canada 2026, and where the refit stands.",
  path: "/rockets/pioneer",
  image: "/images/astra/pioneer-tent.jpg",
});

const IMG = "/images/astra";

// Text keys stay "home.*" because this section used to live on the home page;
// keeping them means any wording admins already changed carries over.
const towerLabels = [
  [402, "553 m"],
  [302, "1.1 km"],
  [202, "1.7 km"],
  [102, "2.2 km"],
  [2, "2.8 km"],
] as const;

export default async function PioneerPage() {
  const t = await getSiteText();
  if (!(await isPageLive("pioneer"))) return <UnderConstruction t={t} page="pioneer" name="Pioneer" />;
  return (
    <>
      <section id="pioneer" className="ax-wrap ax-split" style={{ paddingTop: 96 }}>
        <p className="ax-label" data-edit-key="home.the-vehicle">{t("home.the-vehicle", "The vehicle")}</p>
        <div className="ax-split__main">
          <h1 className="ax-display ax-display--lg" style={{ marginBottom: 32 }} data-edit-key="home.meet-pioneer">{t("home.meet-pioneer", "Meet Pioneer")}</h1>
          <div className="ax-cols">
            <div>
              <p style={{ marginTop: 0, fontSize: 20, color: "var(--a-text)" }} data-edit-key="home.our-first-highpower-rocket">{t("home.our-first-highpower-rocket", "Our first high-power rocket. 2.5 m tall, 12.6 kg loaded, and built to reach about 2.8 km on a Cesaroni L1355-P.")}</p>
              <p className="ax-soft" style={{ marginBottom: 0 }} data-edit-key="home.well-be-upfront-about">{t("home.well-be-upfront-about", "We'll be upfront about what's ours. The airframe is a Wildman Extreme fibreglass kit, and recovery runs on off-the-shelf EasyMini altimeters with Featherweight GPS. We assembled, wired and integrated all of it.")}</p>
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
              <dt data-edit-key="pioneer.payload.k">{t("pioneer.payload.k", "Payload")}</dt>
              <dd><Link className="ax-pink" href="/payloads/picosat"><span data-edit-key="pioneer.payload.v">{t("pioneer.payload.v", "Picosat concept test (24 nodes)")}</span> →</Link></dd>
              <dt data-edit-key="home.flights-so-far">{t("home.flights-so-far", "Flights so far")}</dt>
              <dd className="ax-pink" data-edit-key="home.zero-working-on-it">{t("home.zero-working-on-it", "Zero. It didn't pass pre-launch inspection at Launch Canada 2026. Working on it.")}</dd>
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


      <section className="ax-wrap" style={{ paddingTop: 72, paddingBottom: 96 }}>
        <p className="ax-label" data-edit-key="pioneer.status.label">{t("pioneer.status.label", "Where it stands")}</p>
        <p className="ax-lede" style={{ marginTop: 0 }} data-edit-key="home.status.1.body">{t("home.status.1.body", "New G10 bulkhead going in. Flight-ready target: Nov 30.")}</p>
        <div className="ax-actions" style={{ marginTop: 28 }}>
          <Link className="ax-btn ax-btn--red" href="/jobs">
            <span data-edit-key="pioneer.cta">{t("pioneer.cta", "Help us finish it")}</span>
          </Link>
          <Link className="ax-btn ax-btn--ghost" href="/#timmins">
            How Timmins went
          </Link>
        </div>
      </section>
    </>
  );
}
