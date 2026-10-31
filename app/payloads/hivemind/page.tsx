import Link from "next/link";

import { getSiteText, isPageLive } from "../../../lib/site-text";
import { Editable as E } from "../../editable";
import { pageMetadata } from "../../seo";
import { UnderConstruction } from "../../under-construction";
import { DocViewer, OpenDocButton, type ViewerDoc } from "./doc-viewer";
import { SystemDiagram } from "./system-diagram";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Hivemind",
  description: "Hivemind: 30 student-built computers learning together on a stratospheric balloon. Astra Labs' payload for the 2026–2027 CAN-SBX challenge with SEDS-Canada and the CSA.",
  path: "/payloads/hivemind",
  image: "/images/astra/hivemind-rack-cad.jpg",
});

const pages = (dir: string, n: number) => Array.from({ length: n }, (_, i) => `/docs/hivemind/${dir}/p${String(i + 1).padStart(2, "0")}.webp`);

const docs: ViewerDoc[] = [
  {
    key: "proposal",
    label: "Proposal (37 pages)",
    title: "Hivemind proposal, public copy",
    note: "Budget, funding, contact details, names and partner details are blacked out.",
    pdf: "/docs/hivemind/hivemind-proposal-public.pdf",
    pages: pages("pages", 37),
  },
  {
    key: "letter",
    label: "Selection letter",
    title: "Selection letter from SEDS-Canada",
    note: "The date on the letter reads 2017. That's a typo on the letter; it was issued in 2026.",
    pdf: "/docs/hivemind/seds-canada-selection-letter.pdf",
    pages: pages("letter", 1),
  },
];

const steps = [
  ["sense", "Sense", "Every node reads its sensors every 5 seconds and logs them to its own flash."],
  ["learn", "Learn", "Each node trains a small model to predict its own readings 1, 3 and 5 minutes ahead."],
  ["share", "Share", "Nodes send only the change in their model, about 2.9 KB each, over CAN."],
  ["merge", "Merge", "The Pi averages the updates into one better model and sends it back to every node."],
] as const;

const modes = [
  ["frozen", "Frozen", "Trained on the ground, never updated in flight."],
  ["local", "Local", "Each node learns alone."],
  ["federated", "Federated", "Nodes learn, then the Pi merges them every round."],
  ["central", "Centralized", "The Pi learns from all 30 nodes' raw data."],
] as const;

const nums = [
  ["nodes", "30", "sensor nodes"],
  ["alt", "30 km", "target altitude"],
  ["cold", "−56 °C", "coldest air on the way up"],
  ["time", "~3 h", "flight, launch to landing"],
  ["rounds", "~50", "training rounds on the way up"],
  ["bench", "1.3 s", "per round on our bench test, out of a 120 s budget"],
] as const;

const phases = [
  ["collect", "Dec 2026 – Apr 2027", "Collect data", "Bench, cold and vacuum runs, drone flights, public weather-balloon records and a simulator."],
  ["train", "Apr – May 2027", "Train on the ground", "Train the starting model and check it gives the same answers on the nodes and the Pi."],
  ["fly", "Summer 2027", "Learn in flight", "All four learning modes start from the same model and learn live for about three hours."],
  ["publish", "After recovery", "Analyse and publish", "Score every mode and release the dataset, firmware and node design openly."],
] as const;

const prove = [
  ["hw", "Hardware", "Real sensors and a real CAN bus with all 30 nodes talking at once."],
  ["cold", "Cold", "Whether the nodes, the battery and training speed hold up from −20 to −56 °C."],
  ["power", "Power", "Actual power draw at flight settings, and whether the battery lasts the full five hours."],
  ["time", "Time", "Stability over hours of continuous running."],
  ["results", "Results", "Whether the models beat a simple \"nothing changes\" forecast on real data. If they don't, that's still a result we'll publish."],
  ["battery", "Battery", "Whether the CSA accepts our own battery pack at the launch. If not, we switch to their onboard power without changing the nodes."],
] as const;

export default async function HivemindPage() {
  const t = await getSiteText();
  if (!(await isPageLive("hivemind"))) return <UnderConstruction t={t} page="hivemind" name="Hivemind" />;
  return (
    <>
      <section className="ax-wrap ax-page-top">
        <E t={t} as="p" className="ax-label" k="hivemind.label" d="Payload · CAN-SBX 2026–27" />
        <E t={t} as="h1" className="ax-display ax-display--xl" k="hivemind.title" d="Hivemind." />
        <E t={t} as="p" className="ax-lede" k="hivemind.lede" d="Thirty small computers ride a balloon to 30 km. Each one learns from its own sensors during the flight, then shares what it learned instead of its raw data. We want to find out whether learning together beats learning alone at the edge of space." />
        <div className="ax-actions" style={{ marginTop: 28 }}>
          <Link className="ax-interest" href="/workshop">
            I&apos;m interested in building a node <span aria-hidden="true">→</span>
          </Link>
          <OpenDocButton doc="proposal" className="ax-btn ax-btn--ghost">Read the proposal</OpenDocButton>
        </div>
        <div className="ax-selected">
          <p>
            <E t={t} as="strong" k="hivemind.selected.t" d="Selected for CAN-SBX." />{" "}
            <E t={t} k="hivemind.selected.b" d="SEDS-Canada picked Astra Labs for the 2026–2027 Canadian Stratospheric Balloon Experiment Design Challenge, run with the Canadian Space Agency. We're planning to fly in summer 2027." />
          </p>
          <OpenDocButton doc="letter" className="ax-btn ax-btn--ghost ax-btn--sm">Read the letter</OpenDocButton>
        </div>
      </section>

      <section className="ax-wrap ax-block ax-split">
        <E t={t} as="p" className="ax-label" k="hivemind.why.label" d="Why fly it" />
        <div className="ax-split__main">
          <E t={t} as="h2" className="ax-display ax-display--md" style={{ marginBottom: 20 }} k="hivemind.why.title" d="Satellites will have to learn on their own." />
          <E t={t} as="p" k="hivemind.why.p1" d="Satellite swarms already collect far more data than they can send to the ground, so future spacecraft will need to learn on board. Federated learning lets many devices train one shared model while each keeps its raw data to itself. Studies say it works for satellites, but those studies are simulations." />
          <E t={t} as="p" className="ax-soft" k="hivemind.why.p2" d="Nobody has measured what cold, thin air and failing hardware do to it on cheap microcontrollers. At 30 km the air is about 1% of sea level and the temperature drops to around −56 °C, so electronics lose almost all their cooling. A balloon is the cheapest place to find out, and we plan to publish the data openly." />
        </div>
      </section>

      <section className="ax-wrap ax-block">
        <E t={t} as="p" className="ax-label" k="hivemind.system.label" d="How it fits together" />
        <E t={t} as="h2" className="ax-display ax-display--md" style={{ marginBottom: 12 }} k="hivemind.system.title" d="One rack, two buses, one brain." />
        <E t={t} as="p" className="ax-soft" k="hivemind.system.body" d="Thirty identical nodes sit on a five-level ring rack inside a foam enclosure. They talk to a Raspberry Pi 5 over two CAN buses. The Pi runs the training rounds and radios a short summary to the ground every minute. Everything runs off one central battery." />
        <div className="ax-diagram">
          <SystemDiagram />
        </div>
        <p className="ax-caption">
          <span className="ax-only-phone">Swipe sideways to see the whole diagram. </span>
          Simplified. The full block diagram is in the proposal (Section 2.4).
        </p>
      </section>

      <section className="ax-wrap ax-block">
        <E t={t} as="p" className="ax-label" k="hivemind.round.label" d="One training round, every 2 minutes" />
        <ol className="ax-round">
          {steps.map(([k, title, body]) => (
            <li key={k}>
              <E t={t} as="strong" k={`hivemind.round.${k}.t`} d={title} />
              <E t={t} k={`hivemind.round.${k}.b`} d={body} />
            </li>
          ))}
        </ol>
        <E t={t} as="p" className="ax-soft" style={{ marginTop: 18 }} k="hivemind.round.safe" d="If the Pi goes quiet for two minutes, the nodes keep learning and logging on their own, so the data survives." />
      </section>

      <section className="ax-wrap ax-block ax-split">
        <E t={t} as="p" className="ax-label" k="hivemind.modes.label" d="What we compare" />
        <div className="ax-split__main">
          <E t={t} as="p" k="hivemind.modes.body" d="Every node runs several copies of the same model side by side on the same data, so the only difference is where the learning happens." />
          <div className="ax-modes">
            {modes.map(([k, title, body]) => (
              <div key={k} className={k === "federated" ? "is-hero" : undefined}>
                <E t={t} as="strong" k={`hivemind.modes.${k}.t`} d={title} />
                <E t={t} as="p" k={`hivemind.modes.${k}.b`} d={body} />
              </div>
            ))}
          </div>
          <E t={t} as="p" className="ax-soft" style={{ marginTop: 16 }} k="hivemind.modes.bet" d="Our bet: federated beats frozen and local, and lands within 10% of centralized while moving far less data." />
        </div>
      </section>

      <section className="ax-wrap ax-block">
        <E t={t} as="p" className="ax-label" k="hivemind.nums.label" d="Key numbers" />
        <div className="ax-nums">
          {nums.map(([k, n, label]) => (
            <div key={k}>
              <E t={t} as="strong" k={`hivemind.nums.${k}.n`} d={n} />
              <E t={t} k={`hivemind.nums.${k}.l`} d={label} />
            </div>
          ))}
        </div>
      </section>

      <section className="ax-wrap ax-block ax-twocol">
        <div>
          <E t={t} as="p" className="ax-label" k="hivemind.rack.label" d="The structure" />
          <E t={t} as="p" k="hivemind.rack.p1" d="Each level holds six round node boards around a central bay for the computer and the battery. Five levels fit inside the 600 × 300 mm cylinder the challenge allows, at about 3.4 kg of the 5 kg limit." />
          <E t={t} as="p" className="ax-soft" k="hivemind.rack.p2" d="It works at any orientation, because the payload spins freely under the balloon. Orientation is logged as data." />
        </div>
        <figure style={{ margin: 0 }}>
          <img src="/images/astra/hivemind-rack-cad.jpg" alt="CAD render of the Hivemind rack: five round levels stacked on legs, each holding six green circular node boards around a central ring" style={{ width: "100%", borderRadius: 10 }} />
          <E t={t} as="figcaption" className="ax-caption" k="hivemind.rack.cap" d="Rack CAD. Hand-calculated fit, to be confirmed in CAD." />
        </figure>
      </section>

      <section className="ax-wrap ax-block">
        <E t={t} as="p" className="ax-label" k="hivemind.phases.label" d="Next phases" />
        <E t={t} as="h2" className="ax-display ax-display--md" style={{ marginBottom: 28 }} k="hivemind.phases.title" d="From the bench to 30 km." />
        <ol className="ax-phases">
          {phases.map(([k, when, title, body], i) => (
            <li key={k} className={i === 0 ? "is-now" : undefined}>
              <E t={t} as="small" k={`hivemind.phases.${k}.when`} d={when} />
              <E t={t} as="strong" k={`hivemind.phases.${k}.t`} d={title} />
              <E t={t} as="p" k={`hivemind.phases.${k}.b`} d={body} />
            </li>
          ))}
        </ol>
      </section>

      <section className="ax-wrap ax-block ax-split">
        <E t={t} as="p" className="ax-label" k="hivemind.prove.label" d="Still to prove" />
        <div className="ax-split__main">
          <E t={t} as="p" k="hivemind.prove.body" d="We've only tested the training code on one bench board with simulated data. Here's what hasn't been tested yet." />
          <ul className="ax-tags">
            {prove.map(([k, tag, body]) => (
              <li key={k}>
                <E t={t} className="ax-tag" k={`hivemind.prove.${k}.t`} d={tag} />
                <E t={t} k={`hivemind.prove.${k}.b`} d={body} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ax-wrap ax-block ax-split">
        <E t={t} as="p" className="ax-label" k="hivemind.origin.label" d="Where it came from" />
        <div className="ax-split__main">
          <p>
            <E t={t} k="hivemind.origin.p" d="Pioneer, our first rocket, was meant to carry an early sensor swarm, the Picosat concept test. It didn't pass pre-launch inspection at Launch Canada 2026: there were faults in both the payload and the rocket's assembly. That's why Hivemind puts every node through bench, cold and vacuum tests before it gets anywhere near a launch." />{" "}
            <Link className="ax-pink" href="/payloads/picosat">About the concept test →</Link>
          </p>
        </div>
      </section>

      <section className="ax-wrap ax-block" id="documents">
        <E t={t} as="p" className="ax-label" k="hivemind.docs.label" d="Read the documents" />
        <E t={t} as="h2" className="ax-display ax-display--md" style={{ marginBottom: 10 }} k="hivemind.docs.title" d="See it for yourself." />
        <E t={t} as="p" className="ax-soft" style={{ marginBottom: 22 }} k="hivemind.docs.body" d="The proposal we sent SEDS-Canada and our selection letter, right here on the page. No download needed." />
        <DocViewer docs={docs} />
      </section>

      <section className="ax-wrap ax-block ax-split">
        <E t={t} as="p" className="ax-label" k="hivemind.help.label" d="Get involved" />
        <div className="ax-split__main">
          <E t={t} as="h2" className="ax-display ax-display--md" style={{ marginBottom: 20 }} k="hivemind.help.title" d="Help us get it off the ground." />
          <E t={t} as="p" className="ax-soft" k="hivemind.help.body" d="Students will build the flight nodes in a hands-on workshop. Companies can help pay for parts, testing and getting the team to the launch." />
          <div className="ax-actions" style={{ marginTop: 22 }}>
            <Link className="ax-interest" href="/workshop">I&apos;m interested <span aria-hidden="true">→</span></Link>
            <Link className="ax-btn ax-btn--ghost" href="/sponsorship">Sponsor Hivemind</Link>
            <Link className="ax-btn ax-btn--ghost" href="/volunteer">Join the team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
