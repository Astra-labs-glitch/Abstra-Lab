"use client";

import { useState } from "react";

type Cat = "rocket" | "timmins" | "behind";
type Photo = { cat: Cat; file: string; alt: string; caption: string; date: string };

const photos: Photo[] = [
  { cat: "rocket", file: "hero-pioneer-range.jpg", alt: "A member reaching up beside Pioneer on the range", caption: "Pioneer on the range", date: "Aug 21" },
  { cat: "timmins", file: "team-flag.jpg", alt: "Five members in team shirts in front of a Canadian flag", caption: "The crew at the Launch Canada hall", date: "Aug 16" },
  { cat: "rocket", file: "payload-nodes.jpg", alt: "Payload node boards on a round carrier board", caption: "Payload node boards, names on the silkscreen", date: "" },
  { cat: "behind", file: "pool-noodles.jpg", alt: "A member walking down a store aisle holding pool noodles", caption: "Supply run. Yes, those are pool noodles.", date: "Aug 18" },
  { cat: "timmins", file: "epoxy-tent.jpg", alt: "Two members in gloves working with a bottle of solvent under a tent", caption: "Dissolving epoxy at our tent", date: "Aug 20" },
  { cat: "rocket", file: "pioneer-tent.jpg", alt: "A member pointing to the PIONEER lettering on the airframe", caption: "Pioneer at our tent", date: "Aug 20" },
  { cat: "timmins", file: "mentor-review.jpg", alt: "Members around a table while mentors look over a rocket", caption: "Walking mentors through the build", date: "Aug 18" },
  { cat: "behind", file: "night-check.jpg", alt: "A member checking a rocket nose cone under work lights at night", caption: "Night checks", date: "Aug 19" },
  { cat: "rocket", file: "avionics-sled.jpg", alt: "An avionics sled held next to Pioneer's red airframe on the sand", caption: "Fitting the avionics sled at the launch site", date: "" },
  { cat: "timmins", file: "flight-line.jpg", alt: "Two members photographing a launch from the flight line", caption: "Watching launches from the flight line", date: "Aug 21" },
  { cat: "behind", file: "parking-carry.jpg", alt: "A member carrying an airframe tube on his shoulders in a parking lot", caption: "Airframe on the move", date: "Aug 18" },
  { cat: "rocket", file: "fit-check.jpg", alt: "Three members holding two airframe sections together", caption: "Test-fitting airframe sections", date: "Aug 16" },
  { cat: "timmins", file: "mentor-standup.jpg", alt: "Members steadying a rocket upright while mentors look on", caption: "Five people, one upright rocket", date: "Aug 18" },
  { cat: "behind", file: "packing-car.jpg", alt: "A member loading airframe parts into the back of a car", caption: "Loading the car", date: "Aug 16" },
  { cat: "timmins", file: "conference.jpg", alt: "A member in a team shirt talking with people at the conference hall", caption: "Conference day", date: "Aug 16" },
  { cat: "rocket", file: "rocket-floor.jpg", alt: "A white rocket laid out on a carpeted floor", caption: "Laid out for inspection", date: "Aug 18" },
  { cat: "behind", file: "hotel-laptop.jpg", alt: "A member typing on a laptop in a hotel room while another checks a phone", caption: "Hotel-room paperwork", date: "Aug 16" },
  { cat: "timmins", file: "mentor-close.jpg", alt: "Members watching a mentor examine a rocket nose cone", caption: "Mentor review, up close", date: "Aug 18" },
  { cat: "behind", file: "night-nose.jpg", alt: "A member at night photographing a rocket held upright", caption: "One more photo before bed", date: "Aug 19" },
  { cat: "timmins", file: "mentor-table.jpg", alt: "Members pointing at a rocket on a table during a mentor review", caption: "Mentor review", date: "Aug 18" },
  { cat: "behind", file: "store-run.jpg", alt: "Three members walking through a store with a shopping cart", caption: "Another supply run", date: "Aug 18" },
  { cat: "timmins", file: "conf-table.jpg", alt: "Members at a table at the conference hall", caption: "At the conference tables", date: "Aug 16" },
];

const filters: ReadonlyArray<readonly ["all" | Cat, string]> = [
  ["all", "All"],
  ["rocket", "The rocket"],
  ["timmins", "Timmins"],
  ["behind", "Behind the scenes"],
];

export function GalleryGrid() {
  const [cat, setCat] = useState<"all" | Cat>("all");
  const shown = cat === "all" ? photos : photos.filter((p) => p.cat === cat);

  return (
    <>
      <div className="ax-filters" role="group" aria-label="Filter photos">
        {filters.map(([id, label]) => (
          <button key={id} type="button" className="ax-filter" aria-pressed={cat === id} onClick={() => setCat(id)}>
            {label} <span>{id === "all" ? photos.length : photos.filter((p) => p.cat === id).length}</span>
          </button>
        ))}
      </div>
      <div className="ax-masonry" style={{ marginTop: 28 }}>
        {shown.map((p) => (
          <figure key={p.file}>
            <img src={`/images/astra/${p.file}`} alt={p.alt} loading="lazy" />
            <figcaption>
              <span>{p.caption}</span>
              <span>{p.date}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
