const L = "/images/astra/logos";

export function SupporterLogos() {
  return (
    <div className="ax-logos">
      <div className="ax-logo-tile">
        <img src={`${L}/ssf.png`} alt="Seneca Student Federation" style={{ maxHeight: 54 }} />
      </div>
      <div className="ax-logo-tile">
        <img src={`${L}/seneca-helix.png`} alt="Seneca HELIX" style={{ maxHeight: 44 }} />
      </div>
      <div className="ax-logo-tile">
        <img src={`${L}/seneca-alumni.png`} alt="Seneca Alumni" style={{ maxHeight: 44 }} />
      </div>
      <div className="ax-logo-tile">
        <img src={`${L}/star.png`} alt="STAR, Space Technology and Aeronautical Rocketry" style={{ maxHeight: 82 }} />
      </div>
      {/* Stand-in lockup until Seneca Sandbox sends an official logo. */}
      <div className="ax-logo-tile" role="img" aria-label="Seneca Sandbox">
        <img src={`${L}/seneca-wordmark.png`} alt="" style={{ maxHeight: 34, flex: "0 0 auto" }} />
        <span className="ax-logo-tile__word">SANDBOX</span>
      </div>
      <div className="ax-logo-tile">
        <img src={`${L}/mda-space.svg`} alt="MDA Space" style={{ maxHeight: 40 }} />
      </div>
    </div>
  );
}
