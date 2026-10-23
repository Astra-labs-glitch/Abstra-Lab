import Link from "next/link";

import { getSiteText, isPageLive } from "../../../lib/site-text";
import { Editable as E } from "../../editable";
import { pageMetadata } from "../../seo";
import { UnderConstruction } from "../../under-construction";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Picosat concept test",
  description: "Astra Labs' first sensor swarm: a 24-node concept test built to ride inside Pioneer. It never flew. Here's what it was and what changed for Hivemind.",
  path: "/payloads/picosat",
  image: "/images/astra/payload-nodes.jpg",
});

// New "picosat.*" keys on purpose: the old home-page payload text had the wrong
// radio band and builders, so saved edits of it shouldn't carry over.
const specs = [
  ["nodes", "Nodes", "24"],
  ["node", "Each node", "ESP32-C6 with an MPU-6050 motion sensor"],
  ["network", "Network", "CAN bus to a central hub"],
  ["radio", "Radio", "915 MHz to the ground"],
] as const;

const changes = [
  ["testing", "Testing", "Every node goes through bench, cold and vacuum tests before flight."],
  ["power", "Power", "One central battery pack instead of a cell on every node."],
  ["network", "Network", "Two separate CAN buses, so one fault can't silence the whole swarm."],
  ["failsafe", "Fail-safe", "Nodes keep logging on their own if the central computer goes quiet."],
] as const;

export default async function PicosatPage() {
  const t = await getSiteText();
  if (!(await isPageLive("picosat"))) return <UnderConstruction t={t} page="picosat" name="Picosat concept test" />;
  return (
    <>
      <section className="ax-wrap ax-page-top">
        <E t={t} as="p" className="ax-label" k="picosat.label" d="Payload · 2026 · Concept test" />
        <E t={t} as="h1" className="ax-display ax-display--xl" k="picosat.title" d="Picosat concept test." />
        <E t={t} as="p" className="ax-lede" k="picosat.lede" d="Our first try at a sensor swarm, built to ride inside Pioneer. It never flew." />
      </section>

      <section className="ax-wrap ax-block ax-twocol">
        <div>
          <E t={t} as="p" className="ax-label" k="picosat.what.label" d="What it was" />
          <E t={t} as="p" k="picosat.what.p1" d="A small group on the team built it to see whether the swarm idea could work at all. It wasn't a finished flight payload, and it wasn't the student workshop build." />
          <E t={t} as="p" className="ax-soft" k="picosat.what.p2" d="The question it asked: if you fly 24 identical motion sensors on the same rocket, how much do they disagree?" />
          <dl className="ax-specs" style={{ marginTop: 24 }}>
            {specs.map(([k, label, value]) => (
              <div key={k} style={{ display: "contents" }}>
                <E t={t} as="dt" k={`picosat.spec.${k}.k`} d={label} />
                <E t={t} as="dd" k={`picosat.spec.${k}.v`} d={value} />
              </div>
            ))}
            <E t={t} as="dt" k="picosat.spec.flights.k" d="Flights" />
            <E t={t} as="dd" className="ax-pink" k="picosat.spec.flights.v" d="None" />
          </dl>
        </div>
        <figure style={{ margin: 0 }}>
          <img src="/images/astra/payload-nodes.jpg" alt="Six green node boards standing on a round carrier board" style={{ width: "100%", borderRadius: 10 }} />
          <E t={t} as="figcaption" className="ax-caption" k="picosat.photo.cap" d="Concept-test node boards on their round carrier board." />
        </figure>
      </section>

      <section className="ax-wrap ax-block ax-split">
        <E t={t} as="p" className="ax-label" k="picosat.happened.label" d="What happened" />
        <div className="ax-split__main">
          <E t={t} as="p" k="picosat.happened.p1" d="We took Pioneer and the payload to Launch Canada 2026 in Timmins in August. The rocket didn't pass pre-launch inspection: there were faults in the payload and in the rocket's assembly. So neither flew." />
          <E t={t} as="p" className="ax-soft" k="picosat.happened.p2" d="It wasn't the ending we wanted, but it showed us exactly what to fix before trying again." />
        </div>
      </section>

      <section className="ax-wrap ax-block ax-split">
        <E t={t} as="p" className="ax-label" k="picosat.diff.label" d="What's different in Hivemind" />
        <div className="ax-split__main">
          <ul className="ax-tags">
            {changes.map(([k, tag, body]) => (
              <li key={k}>
                <E t={t} className="ax-tag" k={`picosat.diff.${k}.t`} d={tag} />
                <E t={t} k={`picosat.diff.${k}.b`} d={body} />
              </li>
            ))}
          </ul>
          <div className="ax-actions" style={{ marginTop: 24 }}>
            <Link className="ax-btn ax-btn--red" href="/payloads/hivemind">See Hivemind</Link>
            <Link className="ax-btn ax-btn--ghost" href="/rockets/pioneer">See Pioneer</Link>
          </div>
        </div>
      </section>
    </>
  );
}
