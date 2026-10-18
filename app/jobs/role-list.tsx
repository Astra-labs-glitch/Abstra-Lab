"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import type { PublicRole } from "../../lib/jobs";
import { applyForRole, type ApplyState } from "./actions";

const initial: ApplyState = { ok: false, message: "" };

export function RoleList({ roles }: { roles: PublicRole[] }) {
  const [active, setActive] = useState<PublicRole | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (active) dialog.current?.showModal();
  }, [active]);

  return (
    <>
      <div className="ax-roles">
        {roles.map((role) => (
          <article key={role.id} className="ax-role">
            <div className="ax-role__head">
              {role.subteam ? <p className="ax-label ax-pink">{role.subteam}</p> : null}
              <h3>{role.title}</h3>
              {role.summary ? <p className="ax-role__summary">{role.summary}</p> : null}
            </div>
            <div className="ax-role__body">
              {role.duties.length ? (
                <div>
                  <p className="ax-role__k">What you&apos;d do</p>
                  <ul>
                    {role.duties.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {role.requirements.length ? (
                <div>
                  <p className="ax-role__k">Good to have</p>
                  <ul>
                    {role.requirements.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <div className="ax-role__foot">
              {role.commitment ? <span className="ax-dim">{role.commitment}</span> : <span />}
              <button type="button" className="ax-btn ax-btn--red" onClick={() => setActive(role)}>
                Apply
              </button>
            </div>
          </article>
        ))}
      </div>

      <dialog ref={dialog} className="ax-dialog" onClose={() => setActive(null)} aria-labelledby="apply-title">
        {active ? <ApplyForm key={active.id} role={active} onClose={() => dialog.current?.close()} /> : null}
      </dialog>
    </>
  );
}

function ApplyForm({ role, onClose }: { role: PublicRole; onClose: () => void }) {
  const [state, action, pending] = useActionState(applyForRole, initial);

  if (state.ok) {
    return (
      <div className="ax-dialog__done">
        <p className="ax-label ax-pink">{role.title}</p>
        <h2 id="apply-title" className="ax-display ax-display--sm">
          Got it. Thanks!
        </h2>
        <p className="ax-soft">{state.message} Meanwhile, come say hi on a Friday, 5–7 pm in the SSF clubs room.</p>
        <button type="button" className="ax-btn ax-btn--outline" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="ax-apply">
      <div className="ax-apply__head">
        <div>
          <p className="ax-label ax-pink">Apply</p>
          <h2 id="apply-title" className="ax-display ax-display--sm">
            {role.title}
          </h2>
        </div>
        <button type="button" className="ax-dialog__x" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <input type="hidden" name="roleId" value={role.id} />
      <div className="ax-hp" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="ax-apply__grid">
        <label>
          Full name
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@myseneca.ca" />
        </label>
        <label>
          Program
          <input name="program" maxLength={120} placeholder="e.g. Electronics Engineering Technology" />
        </label>
        <label>
          Year / semester
          <input name="year" maxLength={40} placeholder="e.g. Semester 3" />
        </label>
      </div>
      <label>
        Why this role? (a few lines is plenty)
        <textarea name="message" rows={4} maxLength={3000} />
      </label>
      <label>
        Links (portfolio, GitHub, LinkedIn)
        <input name="links" maxLength={500} />
      </label>
      <label>
        Résumé (PDF or Word, under 4 MB)
        <input name="resume" type="file" accept=".pdf,.doc,.docx" />
      </label>
      <p className="ax-dim ax-apply__note">Only the Astra Labs exec team can see your résumé. Already a member? Leave it empty and we use the one in My account.</p>
      <label className="ax-consent">
        <input type="checkbox" name="consent" required />
        <span>
          I agree that Astra Labs can use this application to consider me for the role. It&apos;s seen only by the exec
          team and deleted after 12 months. <a href="/privacy" target="_blank" rel="noopener">Privacy policy</a>
        </span>
      </label>
      {state.message ? (
        <p className="ax-apply__err" role="alert">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="ax-btn ax-btn--red" disabled={pending}>
        {pending ? "Sending…" : "Send application"}
      </button>
    </form>
  );
}
