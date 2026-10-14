import Link from "next/link";

import { Editable } from "./editable";

type Lookup = (key: string, fallback: string) => string;

// What visitors see when an admin switches a page off in Admin → Pages.
export function UnderConstruction({ t, page, name }: { t: Lookup; page: string; name: string }) {
  return (
    <section className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="ax-uc">
        <p className="ax-label ax-pink" style={{ margin: 0 }}>
          {name}
        </p>
        <Editable t={t} k={`uc.${page}.title`} d="Under construction." as="p" className="ax-uc__t" />
        <Editable
          t={t}
          k={`uc.${page}.body`}
          d="We're putting this page together. Check back soon, or come say hi at a Friday meeting, 5–7 pm in the SSF clubs room."
          as="p"
          className="ax-soft"
          style={{ margin: 0, maxWidth: 560, fontSize: 19 }}
        />
        <div className="ax-actions" style={{ marginTop: 12 }}>
          <Link className="ax-btn ax-btn--red" href="/">
            Back to home
          </Link>
          <Link className="ax-btn ax-btn--ghost" href="/gallery">
            Browse the gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
