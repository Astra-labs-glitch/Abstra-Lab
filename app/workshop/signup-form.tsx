"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { WORKSHOP_LEVELS } from "../../lib/workshop";
import { joinWorkshop, type SignupState } from "./actions";

const initial: SignupState = { ok: false, message: "" };

export function SignupForm({ consentText }: { consentText: string }) {
  const [state, action, pending] = useActionState(joinWorkshop, initial);
  const [level, setLevel] = useState("");
  const [source, setSource] = useState("web");
  const done = useRef<HTMLDivElement>(null);

  // The QR code opens /workshop?from=qr, so admins can see who signed up at an event.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("from") === "qr") setSource("qr");
  }, []);

  useEffect(() => {
    if (state.ok) done.current?.focus();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="ax-ok" ref={done} tabIndex={-1} role="status">
        <strong>You&apos;re on the waitlist.</strong> We&apos;ll email you when the dates are set.
      </div>
    );
  }

  return (
    <form action={action} className="ax-signup" id="signup-form">
      <input type="hidden" name="source" value={source} />
      <div className="ax-hp" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="ax-signup__grid">
        <label>
          Full name
          <input id="ws-name" name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" />
        </label>
      </div>
      <fieldset className="ax-levels">
        <legend>I&apos;m in</legend>
        <div>
          {WORKSHOP_LEVELS.map(([value, label]) => (
            <label key={value}>
              <input type="radio" name="level" value={value} required onChange={() => setLevel(value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        What are you studying?
        <input name="program" maxLength={120} placeholder="e.g. Electronics Engineering Technology, or Grade 11" />
      </label>
      <label>
        Why would this workshop be a good fit for you?
        <textarea name="why" rows={3} maxLength={1500} />
      </label>
      <label>
        What are you hoping to get out of it?
        <textarea name="expect" rows={3} maxLength={1500} />
      </label>
      {level === "k12" ? (
        <label className="ax-consent">
          <input type="checkbox" name="guardian" required />
          <span>I&apos;m under 18, and a parent or guardian knows I&apos;m signing up.</span>
        </label>
      ) : null}
      <label className="ax-consent">
        <input type="checkbox" name="consent" required />
        <span>
          <span data-edit-key="workshop.consent">{consentText}</span> <Link href="/privacy">Privacy policy</Link>
        </span>
      </label>
      {state.message ? (
        <p className="ax-apply__err" role="alert">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="ax-btn ax-btn--red ax-signup__submit" disabled={pending}>
        {pending ? "Sending…" : "Join the waitlist"}
      </button>
    </form>
  );
}

/** Phone-only "Join the waitlist" bar: shows once the top button scrolls away, hides when the form is on screen. */
export function StickyJoin() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const top = document.getElementById("workshop-top-cta");
    const form = document.getElementById("signup");
    if (!top || !form || !("IntersectionObserver" in window)) return;
    let topVisible = true;
    let formVisible = false;
    const sync = () => setShow(!topVisible && !formVisible && !!document.getElementById("signup-form"));
    const a = new IntersectionObserver(([e]) => { topVisible = e.isIntersecting; sync(); });
    const b = new IntersectionObserver(([e]) => { formVisible = e.isIntersecting; sync(); }, { threshold: 0.15 });
    a.observe(top);
    b.observe(form);
    return () => { a.disconnect(); b.disconnect(); };
  }, []);
  return (
    <div className={`ax-sticky-join${show ? " is-on" : ""}`} aria-hidden={!show}>
      <JoinButton tabIndex={show ? 0 : -1} />
    </div>
  );
}

export function JoinButton({ tabIndex, id }: { tabIndex?: number; id?: string }) {
  return (
    <a
      id={id}
      className="ax-interest"
      href="#signup"
      tabIndex={tabIndex}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("signup")?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => document.getElementById("ws-name")?.focus({ preventScroll: true }), 450);
      }}
    >
      Join the waitlist <span aria-hidden="true">↓</span>
    </a>
  );
}
