import { contact } from "../content";
import { pageMetadata } from "../seo";
import { GalleryGrid } from "./gallery-grid";

export const metadata = pageMetadata({
  title: "Gallery",
  description: "Photos from Astra Labs' week at Launch Canada 2026 in Timmins: the rocket, the range and everything in between.",
  path: "/gallery",
  image: "/images/astra/team-flag.jpg",
});

export default function GalleryPage() {
  return (
    <section className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <p className="ax-label">Gallery</p>
      <h1 className="ax-display ax-display--xl" style={{ marginBottom: 20 }}>
        The crew, unfiltered.
      </h1>
      <p className="ax-lede" style={{ marginTop: 0, marginBottom: 40 }}>
        Everything from our week at Launch Canada 2026, including the pool noodles. Photos by Wendy Liu.
      </p>
      <GalleryGrid />
      <p className="ax-dim" style={{ marginTop: 40, fontSize: 15 }}>
        Want a full-size copy of a photo you&apos;re in?{" "}
        <a className="ax-pink" href={`mailto:${contact.email}`}>
          Email us
        </a>
        . Want one taken down? Same address, no questions asked.
      </p>
    </section>
  );
}
