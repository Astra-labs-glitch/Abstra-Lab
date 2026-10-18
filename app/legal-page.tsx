import { getSiteText } from "../lib/site-text";
import { contact } from "./content";

// A plain-language policy page. Every heading, paragraph and bullet is editable
// with "Edit website" (keys like privacy.collect.p1), so the exec team can update
// the wording without a code change.

export type LegalSection = { id: string; heading: string; paras?: string[]; bullets?: string[] };

export async function LegalPage({
  prefix,
  label,
  title,
  updated,
  intro,
  sections,
}: {
  prefix: string;
  label: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  const t = await getSiteText();
  const k = (s: string) => `${prefix}.${s}`;
  return (
    <article className="ax-wrap ax-legal">
      <p className="ax-label" data-edit-key={k("label")}>{t(k("label"), label)}</p>
      <h1 className="ax-display ax-display--lg" style={{ marginBottom: 16 }} data-edit-key={k("title")}>
        {t(k("title"), title)}
      </h1>
      <p className="ax-legal__date" data-edit-key={k("updated")}>{t(k("updated"), updated)}</p>
      <p className="ax-lede" data-edit-key={k("intro")}>{t(k("intro"), intro)}</p>
      {sections.map((s) => (
        <section key={s.id} aria-labelledby={`${prefix}-${s.id}`}>
          <h2 id={`${prefix}-${s.id}`} data-edit-key={k(`${s.id}.h`)}>
            {t(k(`${s.id}.h`), s.heading)}
          </h2>
          {s.paras?.map((p, i) => (
            <p key={i} data-edit-key={k(`${s.id}.p${i + 1}`)}>
              {t(k(`${s.id}.p${i + 1}`), p)}
            </p>
          ))}
          {s.bullets ? (
            <ul>
              {s.bullets.map((b, i) => (
                <li key={i} data-edit-key={k(`${s.id}.b${i + 1}`)}>
                  {t(k(`${s.id}.b${i + 1}`), b)}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      <p style={{ marginTop: 48 }}>
        Questions? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </article>
  );
}
