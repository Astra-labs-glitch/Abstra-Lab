import Link from "next/link";

import { getSiteText, isPageLive } from "../../../lib/site-text";
import { pageMetadata } from "../../seo";
import { UnderConstruction } from "../../under-construction";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Our 2027 rocket",
  description: "Astra Labs' second rocket, in design now for Launch Canada 2027.",
  path: "/rockets/2027",
});

// Kept short on purpose: it's still on the drawing board. Every line is editable
// with Edit website, so the team can fill it in as the design firms up.
export default async function Rocket2027Page() {
  const t = await getSiteText();
  if (!(await isPageLive("rocket2027"))) return <UnderConstruction t={t} page="rocket2027" name="2027 rocket" />;
  return (
    <section className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <p className="ax-label" data-edit-key="home.2027">{t("home.2027", "2027")}</p>
      <h1 className="ax-display ax-display--xl" style={{ marginBottom: 24 }} data-edit-key="rocket2027.title">
        {t("rocket2027.title", "Our next rocket.")}
      </h1>
      <p className="ax-lede" style={{ marginTop: 0 }} data-edit-key="rocket2027.lede">
        {t("rocket2027.lede", "No name yet. It's our second rocket, built for Launch Canada 2027, and it's on the drawing board right now.")}
      </p>
      <dl className="ax-specs" style={{ maxWidth: 640, marginTop: 40 }}>
        <dt data-edit-key="rocket2027.airframe.k">{t("rocket2027.airframe.k", "Airframe")}</dt>
        <dd data-edit-key="rocket2027.airframe.v">{t("rocket2027.airframe.v", "4-inch")}</dd>
        <dt data-edit-key="rocket2027.motor.k">{t("rocket2027.motor.k", "Motor")}</dt>
        <dd data-edit-key="rocket2027.motor.v">{t("rocket2027.motor.v", "75 mm Cesaroni hardware")}</dd>
        <dt data-edit-key="rocket2027.payload.k">{t("rocket2027.payload.k", "Payload")}</dt>
        <dd data-edit-key="rocket2027.payload.v">{t("rocket2027.payload.v", "The next version of our sensor payload")}</dd>
        <dt data-edit-key="rocket2027.next.k">{t("rocket2027.next.k", "Next up")}</dt>
        <dd className="ax-pink" data-edit-key="home.status.2.body">{t("home.status.2.body", "First design review Nov 30. Preliminary review Jan 31.")}</dd>
      </dl>
      <div className="ax-actions" style={{ marginTop: 40 }}>
        <Link className="ax-btn ax-btn--red" href="/volunteer">
          <span data-edit-key="rocket2027.cta">{t("rocket2027.cta", "Help design it")}</span>
        </Link>
        <Link className="ax-btn ax-btn--ghost" href="/rockets/pioneer">
          See Pioneer
        </Link>
      </div>
    </section>
  );
}
