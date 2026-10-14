import { getSiteText, isPageLive } from "../../lib/site-text";
import { UnderConstruction } from "../under-construction";
import { contact } from "../content";
import { pageMetadata } from "../seo";
import { GalleryGrid } from "./gallery-grid";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Gallery",
  description: "Photos from Astra Labs' week at Launch Canada 2026 in Timmins: the rocket, the range and everything in between.",
  path: "/gallery",
  image: "/images/astra/team-flag.jpg",
});

export default async function GalleryPage() {
  const t = await getSiteText();
  if (!(await isPageLive("gallery"))) return <UnderConstruction t={t} page="gallery" name="Gallery" />;
  return (
    <section className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <p className="ax-label" data-edit-key="gallery.gallery">{t("gallery.gallery", "Gallery")}</p>
      <h1 className="ax-display ax-display--xl" style={{ marginBottom: 20 }} data-edit-key="gallery.the-crew-unfiltered">{t("gallery.the-crew-unfiltered", "The crew, unfiltered.")}</h1>
      <p className="ax-lede" style={{ marginTop: 0, marginBottom: 40 }} data-edit-key="gallery.everything-from-our-week">{t("gallery.everything-from-our-week", "Everything from our week at Launch Canada 2026, including the pool noodles. Photos by Wendy Liu.")}</p>
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
