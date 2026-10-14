import { contact, sponsorFunding, sponsorPackage, sponsorTiers } from "../content";
import { pageMetadata } from "../seo";
import { SupporterLogos } from "../supporters";

export const metadata = pageMetadata({
  title: "Sponsorship",
  description:
    "Sponsor Astra Labs, Seneca's student rocketry team. See where support goes, the sponsor tiers, and how to get your name on the 2027 rocket.",
  path: "/sponsorship",
  image: "/images/astra/avionics-sled.jpg",
});

const mailto = `mailto:${contact.email}?subject=${encodeURIComponent("Sponsoring Astra Labs")}`;

export default function SponsorshipPage() {
  return (
    <>
      <section className="ax-hero" style={{ minHeight: "clamp(560px, 80vh, 820px)" }}>
        <img src="/images/astra/avionics-sled.jpg" alt="An avionics sled with wiring held next to Pioneer's red airframe on the sand" style={{ filter: "brightness(0.45)" }} />
        <div className="ax-wrap ax-hero__body">
          <p className="ax-label">Sponsorship · 2026–27 season</p>
          <h1 className="ax-display ax-display--xl">Put your name on the next rocket.</h1>
          <div className="ax-hero__row">
            <p>
              We&apos;re a student club building two rockets this year: Pioneer&apos;s refit and a new rocket for
              Launch Canada 2027. Here&apos;s where support goes and what you get back.
            </p>
            <div className="ax-actions">
              <a className="ax-btn ax-btn--red" href={mailto}>
                Talk to us
              </a>
              <a className="ax-btn ax-btn--ghost" href={sponsorPackage.filename} target="_blank" rel="noopener noreferrer">
                Get the package (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ax-wrap ax-split">
        <p className="ax-label">Where it goes</p>
        <div className="ax-split__main">
          <h2 className="ax-display ax-display--lg" style={{ marginBottom: 18 }}>
            Into hardware
          </h2>
          <p className="ax-soft" style={{ marginTop: 0, marginBottom: 32, maxWidth: 620 }}>
            Most of our school funding already goes to the rockets themselves. Sponsors close the gap.
          </p>
          <div style={{ borderTop: "1px solid var(--a-line)" }}>
            {sponsorFunding.map(([title, text]) => (
              <div key={title} className="ax-money-row">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ax-band">
        <div className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
          <p className="ax-label">What you get</p>
          <h2 className="ax-display ax-display--lg" style={{ marginBottom: 40 }}>
            Sponsor tiers
          </h2>
          <div className="ax-tiers">
            {sponsorTiers.map(([name, amount, perks]) => (
              <div key={name}>
                <h3>{name}</h3>
                <p className="ax-pink" style={{ margin: "0 0 20px", fontWeight: 700 }}>
                  {amount}
                </p>
                <ul>
                  {perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="ax-dim" style={{ marginTop: 28, marginBottom: 0, fontSize: 16, maxWidth: 720 }}>
            Not cash? We also welcome parts, machining time, software licences and mentorship. Tell us what you can
            offer and we&apos;ll find the right fit.
          </p>
        </div>
      </section>

      <section className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="ax-cols" style={{ alignItems: "center", gap: 48 }}>
          <figure style={{ margin: 0 }}>
            <img
              src="/images/astra/payload-nodes.jpg"
              alt="Six green payload node boards on a round carrier board, with supporter and builder names on the silkscreen"
              loading="lazy"
              style={{ width: "100%", height: 480, objectFit: "cover" }}
            />
            <figcaption className="ax-caption">Our payload boards carry our supporters&apos; names on the silkscreen.</figcaption>
          </figure>
          <div>
            <p className="ax-label">Why us</p>
            <h2 className="ax-display ax-display--md" style={{ marginBottom: 24 }}>
              Early, and honest about it
            </h2>
            <p style={{ marginTop: 0, color: "var(--a-text)" }}>
              We&apos;re a young team. That means your support shows up directly in hardware you can see, and
              you&apos;re with us from our first flight on.
            </p>
            <p className="ax-soft" style={{ marginBottom: 0 }}>
              You&apos;ll also meet 20+ students from seven Seneca programs who are
              learning to ship real hardware.
            </p>
          </div>
        </div>
      </section>

      <section style={{ borderTop: "1px solid var(--a-line)" }}>
        <div className="ax-wrap" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <p className="ax-label" style={{ marginBottom: 14 }}>
            Already on board
          </p>
          <p style={{ margin: "0 0 32px", fontSize: 20, color: "var(--a-text)" }}>
            Thank you to the people who made Pioneer possible.
          </p>
          <SupporterLogos />
        </div>
      </section>

      <section id="package" className="ax-cta">
        <div className="ax-wrap ax-cta__inner">
          <h2 className="ax-display ax-display--lg">Let&apos;s talk.</h2>
          <div>
            <p>Email us and we&apos;ll send the full package with our budget and timeline.</p>
            <div className="ax-actions">
              <a className="ax-btn ax-btn--black" href={mailto}>
                Email us
              </a>
              <a className="ax-btn ax-btn--outline" href={sponsorPackage.filename} target="_blank" rel="noopener noreferrer">
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
