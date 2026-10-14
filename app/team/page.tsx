import Link from "next/link";

import { pageMetadata } from "../seo";

export const metadata = pageMetadata({
  title: "Team",
  description: "Astra Labs team profiles are coming soon. Members will sign in and show off the systems they've built.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <section className="ax-wrap" aria-labelledby="uc-title" style={{ paddingTop: 96, paddingBottom: 72 }}>
      <div className="ax-stripe" aria-hidden="true" />
      <p className="ax-label">Team · coming soon</p>
      <h1 id="uc-title" className="ax-display ax-display--xl" style={{ marginBottom: 24 }}>
        Under construction.
      </h1>
      <p className="ax-lede" style={{ fontSize: 21, marginTop: 0 }}>
        Team profiles are on the bench. Soon every member will sign in and show off what they&apos;ve built: their
        boards, code, layups and test data, in their own words.
      </p>
      <p className="ax-soft" style={{ maxWidth: 700, marginBottom: 40 }}>
        Until then, you can see our work on the home page and in the gallery, or join the crew and be one of the first
        profiles up.
      </p>
      <div className="ax-actions">
        <Link className="ax-btn ax-btn--red" href="/jobs">
          See open roles
        </Link>
        <Link className="ax-btn ax-btn--ghost" href="/gallery">
          Browse the gallery
        </Link>
      </div>
      <div className="ax-steps" style={{ marginTop: 72 }}>
        <div>
          <p className="ax-steps__title ax-pink">Sign in</p>
          <p className="ax-steps__text">Members log in with their Astra Labs account.</p>
        </div>
        <div>
          <p className="ax-steps__title ax-pink">Build your profile</p>
          <p className="ax-steps__text">Photo, role, subteam and a line on what you do.</p>
        </div>
        <div>
          <p className="ax-steps__title ax-pink">Show your system</p>
          <p className="ax-steps__text">Post photos, files and notes on the part you built.</p>
        </div>
      </div>
    </section>
  );
}
