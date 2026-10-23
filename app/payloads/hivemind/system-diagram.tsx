// Simplified Hivemind system diagram in the site's colours. The full block diagram is in the proposal.
export function SystemDiagram() {
  const node = (x: number, y: number, stroke: string) => (
    <rect key={`${x}-${y}`} x={x} y={y} width="34" height="26" rx="5" fill="#141414" stroke={stroke} strokeWidth="1.5" />
  );
  const rows = [112, 146, 180, 214, 248];
  const cols = [30, 70, 110, 150, 190, 230];
  return (
    <svg
      viewBox="0 0 1000 430"
      role="img"
      aria-label="System diagram: 30 sensor nodes on two CAN buses connect to a Raspberry Pi 5, which logs to an SSD and sends a summary by LoRa radio at 915 MHz to a ground station. One central battery pack powers everything through two arming keys."
      fontFamily="inherit"
    >
      <rect x="0" y="0" width="1000" height="430" fill="#0e0e0e" />
      <rect x="12" y="20" width="760" height="396" rx="14" fill="none" stroke="#3a3a3a" strokeDasharray="6 6" />
      <text x="28" y="44" fill="#8c8c8c" fontSize="13" fontWeight="700" letterSpacing="1.5">PAYLOAD · FOAM ENCLOSURE · 600 × 300 MM · ~3.4 KG</text>
      <text x="30" y="80" fill="#fff" fontSize="15" fontWeight="800">30 SENSOR NODES</text>
      <text x="30" y="98" fill="#bdbdbd" fontSize="12">5 levels × 6 · ESP32-S3 + pressure, motion, heading, current</text>
      {rows.map((y, r) => cols.map((x) => node(x, y, r < 3 ? "#d62e2e" : "#f08a8a")))}
      <text x="274" y="160" fill="#d62e2e" fontSize="12" fontWeight="700">Bus A · 15</text>
      <text x="274" y="240" fill="#f08a8a" fontSize="12" fontWeight="700">Bus B · 15</text>
      <path d="M268 145 H 360 V 168 H 440" fill="none" stroke="#d62e2e" strokeWidth="3" />
      <path d="M268 230 H 360 V 206 H 440" fill="none" stroke="#f08a8a" strokeWidth="3" />
      <text x="372" y="160" fill="#bdbdbd" fontSize="11">CAN · 500 kbit/s</text>
      <rect x="440" y="130" width="300" height="120" rx="12" fill="#1a0b0b" stroke="#ee3534" strokeWidth="2" />
      <text x="460" y="160" fill="#fff" fontSize="16" fontWeight="800">RASPBERRY PI 5</text>
      <text x="460" y="182" fill="#bdbdbd" fontSize="12.5">Runs a training round every 2 minutes</text>
      <text x="460" y="200" fill="#bdbdbd" fontSize="12.5">Merges what the nodes learned (FedAvg)</text>
      <text x="460" y="218" fill="#bdbdbd" fontSize="12.5">Trains its own copy on all raw data</text>
      <text x="460" y="236" fill="#bdbdbd" fontSize="12.5">Scores every learning mode</text>
      <rect x="440" y="276" width="140" height="54" rx="10" fill="#141414" stroke="#3a3a3a" />
      <text x="456" y="299" fill="#fff" fontSize="13" fontWeight="700">SSD</text>
      <text x="456" y="317" fill="#8c8c8c" fontSize="11.5">Logs everything</text>
      <rect x="600" y="276" width="140" height="54" rx="10" fill="#141414" stroke="#3a3a3a" />
      <text x="616" y="299" fill="#fff" fontSize="13" fontWeight="700">GPS</text>
      <text x="616" y="317" fill="#8c8c8c" fontSize="11.5">Altitude + time sync</text>
      <path d="M510 250 V 276 M670 250 V 276" stroke="#3a3a3a" strokeWidth="2" />
      <rect x="30" y="300" width="230" height="96" rx="12" fill="#141414" stroke="#6a4a1a" />
      <text x="46" y="326" fill="#ffd38a" fontSize="14" fontWeight="800">CENTRAL BATTERY</text>
      <text x="46" y="346" fill="#bdbdbd" fontSize="12">One Li-ion pack with protection</text>
      <text x="46" y="364" fill="#bdbdbd" fontSize="12">Two arming keys: Pi first, then nodes</text>
      <text x="46" y="382" fill="#bdbdbd" fontSize="12">Switch per floor to cut a bad node</text>
      <path d="M260 348 H 330 V 264" stroke="#ffd38a" strokeWidth="2" strokeDasharray="5 5" fill="none" />
      <path d="M260 372 H 420 V 240 H 440" stroke="#ffd38a" strokeWidth="2" strokeDasharray="5 5" fill="none" />
      <text x="338" y="300" fill="#ffd38a" fontSize="11">power spine</text>
      <path d="M740 190 H 800" stroke="#fff" strokeWidth="2" />
      <rect x="800" y="160" width="180" height="60" rx="10" fill="#141414" stroke="#3a3a3a" />
      <text x="816" y="185" fill="#fff" fontSize="13" fontWeight="700">LORA RADIO</text>
      <text x="816" y="204" fill="#8c8c8c" fontSize="11.5">915 MHz · ~70 bytes/min</text>
      <path d="M890 160 V 96" stroke="#fff" strokeWidth="2" strokeDasharray="2 6" />
      <rect x="800" y="40" width="180" height="56" rx="10" fill="#141414" stroke="#fff" />
      <text x="816" y="64" fill="#fff" fontSize="13" fontWeight="700">GROUND STATION</text>
      <text x="816" y="82" fill="#8c8c8c" fontSize="11.5">Receiver + laptop</text>
    </svg>
  );
}
