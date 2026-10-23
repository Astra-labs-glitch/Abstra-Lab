import { getSiteText, isPageLive } from "../../lib/site-text";
import { pageMetadata } from "../seo";
import { UnderConstruction } from "../under-construction";
import { JoinButton, SignupForm, StickyJoin } from "./signup-form";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Hivemind workshop",
  description: "Build and test a sensor node for Hivemind, Astra Labs' stratospheric balloon payload. Join the waitlist for the hands-on workshop.",
  path: "/workshop",
  image: "/images/astra/payload-nodes.jpg",
});

const learn = [
  ["electronics", "Electronics", "How the sensors, power and CAN bus on a node fit together, and how to solder and assemble one."],
  ["programming", "Programming", "ESP32 firmware: reading sensors, logging data and talking over the bus."],
  ["pcb", "PCB design", "How the node board is laid out in KiCad, and why it's laid out that way."],
  ["testing", "Testing", "The bench, cold and vacuum checks a node has to pass before it can fly."],
] as const;

export default async function WorkshopPage() {
  const t = await getSiteText();
  if (!(await isPageLive("workshop"))) return <UnderConstruction t={t} page="workshop" name="Hivemind workshop" />;
  return (
    <>
      <section className="ax-wrap ax-page-top">
        <p className="ax-label ax-pink" data-edit-key="workshop.label">{t("workshop.label", "Hivemind workshop · planned for early 2027")}</p>
        <h1 className="ax-display ax-display--xl" data-edit-key="workshop.title">{t("workshop.title", "Build a node for Hivemind.")}</h1>
        <p className="ax-lede" data-edit-key="workshop.lede">{t("workshop.lede", "A hands-on workshop where students build and test the sensor nodes for Hivemind, our stratospheric balloon payload. You'll put a node board together, program it, and run it through the same checks a flight node has to pass.")}</p>
        <div className="ax-actions" style={{ marginTop: 24 }}>
          <JoinButton id="workshop-top-cta" />
        </div>
        <p className="ax-dim" style={{ marginTop: 12, fontSize: 14 }} data-edit-key="workshop.quick">{t("workshop.quick", "Takes about a minute. Free.")}</p>
      </section>

      <section className="ax-wrap ax-block">
        <p className="ax-label" data-edit-key="workshop.learn.label">{t("workshop.learn.label", "What you'll learn")}</p>
        <div className="ax-learn">
          {learn.map(([k, title, body]) => (
            <div key={k}>
              <h2 data-edit-key={`workshop.learn.${k}.t`}>{t(`workshop.learn.${k}.t`, title)}</h2>
              <p data-edit-key={`workshop.learn.${k}.b`}>{t(`workshop.learn.${k}.b`, body)}</p>
            </div>
          ))}
        </div>
        <p className="ax-soft" style={{ marginTop: 18 }} data-edit-key="workshop.who">{t("workshop.who", "For high school, college and university students. No experience needed.")}</p>
      </section>

      <section className="ax-wrap ax-block">
        <div className="ax-warn" role="note">
          <p style={{ margin: 0 }}>
            <strong data-edit-key="workshop.warn.t">{t("workshop.warn.t", "Please read before signing up.")}</strong>{" "}
            <span data-edit-key="workshop.warn.b">{t("workshop.warn.b", "Joining the workshop doesn't mean the node you build will fly. Flight nodes are picked after testing, and the flight itself depends on SEDS-Canada and the Canadian Space Agency. Dates and format aren't final yet. We'll email you when they are.")}</span>
          </p>
        </div>
      </section>

      <section className="ax-wrap ax-block ax-split" id="signup">
        <p className="ax-label" data-edit-key="workshop.form.label">{t("workshop.form.label", "Join the waitlist")}</p>
        <div className="ax-split__main">
          <SignupForm consentText={t("workshop.consent", "Astra Labs can email me about this workshop. I understand joining doesn't guarantee my node will fly. Sign-ups are deleted within 12 months.")} />
        </div>
      </section>
      <StickyJoin />
    </>
  );
}
