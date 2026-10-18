"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { contact, discordHref } from "./content";
import { LaunchPad } from "./launch-pad";

const navItems = [
  ["Pioneer", "/"],
  ["Team", "/team"],
  ["Events", "/events"],
  ["Jobs", "/jobs"],
  ["Gallery", "/gallery"],
  ["Sponsor", "/sponsorship"],
] as const;

type Me = { role: "admin" | "staff" | "member" | null; name?: string };

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me>({ role: null });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const snapshot = useRef(new Map<HTMLElement, string>());
  const isStaff = me.role === "admin" || me.role === "staff";
  const inDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { role: null }))
      .then((d: Me) => alive && setMe(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [pathname]);

  const say = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3000);
  }, []);

  const startEdit = useCallback(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-edit-key]"));
    snapshot.current = new Map(els.map((el) => [el, el.innerText]));
    for (const el of els) {
      el.setAttribute("contenteditable", "plaintext-only");
      if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
      el.spellcheck = true;
    }
    document.body.classList.add("ax-editing");
    setEditing(true);
  }, []);

  const stopEdit = useCallback((restore: boolean) => {
    for (const [el, text] of snapshot.current) {
      if (restore) el.innerText = text;
      el.removeAttribute("contenteditable");
    }
    document.body.classList.remove("ax-editing");
    setEditing(false);
  }, []);

  // "Edit website" from the member area lands on the home page with ?edit=1.
  useEffect(() => {
    if (!isStaff || inDashboard || editing) return;
    if (new URLSearchParams(window.location.search).get("edit") === "1") {
      window.history.replaceState(null, "", pathname);
      window.setTimeout(startEdit, 50);
    }
  }, [isStaff, inDashboard, editing, pathname, startEdit]);

  // Leaving the page ends edit mode without saving.
  useEffect(() => {
    if (editing) stopEdit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // While editing: links don't navigate, Enter doesn't add new lines, paste is plain text.
  useEffect(() => {
    if (!editing) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (a && !a.closest(".ax-editbar") && !a.closest(".ax-nav__admin")) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest?.("[data-edit-key]") && e.key === "Enter") {
        e.preventDefault();
        el.blur();
      }
      if (e.key === "Escape") stopEdit(true);
    };
    const onPaste = (e: ClipboardEvent) => {
      const el = (e.target as HTMLElement).closest?.("[data-edit-key]");
      if (!el) return;
      e.preventDefault();
      document.execCommand("insertText", false, e.clipboardData?.getData("text/plain") ?? "");
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("paste", onPaste);
    };
  }, [editing, stopEdit]);

  async function save() {
    const changes: Record<string, string> = {};
    for (const [el, before] of snapshot.current) {
      const now = el.innerText.replace(/\s+/g, " ").trim();
      if (now !== before.replace(/\s+/g, " ").trim()) changes[el.dataset.editKey!] = now;
    }
    if (!Object.keys(changes).length) {
      stopEdit(false);
      say("No changes to save.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/site-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes }),
      });
      const data = (await res.json().catch(() => ({}))) as { saved?: number; error?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't save. Try again.");
      stopEdit(false);
      say(`Saved ${data.saved} change${data.saved === 1 ? "" : "s"}. Live for visitors in a few seconds.`);
      router.refresh();
    } catch (error) {
      say(error instanceof Error ? error.message : "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function onEditClick() {
    if (editing) return stopEdit(true);
    if (inDashboard) {
      router.push("/?edit=1");
      return;
    }
    startEdit();
  }

  return (
    <div className="ax">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="ax-header">
        <nav className="ax-nav" id="site-nav" aria-label="Main navigation">
          <div className="ax-nav__left">
            <Link className="ax-nav__logo" href="/" aria-label="Astra Labs home">
              <img src="/images/astra/astra-labs-logo.png" alt="Astra Labs" />
            </Link>
            {me.role ? (
              <div className="ax-nav__admin">
                {isStaff ? (
                  <>
                    <Link className="ax-chip ax-chip--red" href="/dashboard" aria-current={inDashboard ? "page" : undefined}>
                      <span className="ax-chip__dot" aria-hidden="true" />
                      Admin
                    </Link>
                    <button type="button" className={`ax-chip${editing ? " ax-chip--on" : ""}`} onClick={onEditClick}>
                      {editing ? "✎ Editing…" : "✎ Edit website"}
                    </button>
                  </>
                ) : (
                  <Link className="ax-chip" href="/dashboard/account">
                    My account
                  </Link>
                )}
                {/* Plain link, not <Link>: logging out must hit the server, never a prefetch. */}
                <a className="ax-chip ax-chip--quiet" href="/accounts/logout">
                  Log out
                </a>
              </div>
            ) : null}
          </div>
          <div className="ax-nav__links">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} aria-current={pathname === href ? "page" : undefined}>
                {label}
              </Link>
            ))}
            {me.role ? null : (
              <Link className="ax-btn ax-btn--red" href="/jobs">
                Join us
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main id="main">{children}</main>

      <footer className="ax-footer">
        <LaunchPad />
        <div className="ax-wrap ax-footer__meta">
          <p style={{ margin: 0 }}>Team 06 · Seneca Polytechnic, Toronto</p>
          <p style={{ margin: 0 }}>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            {" · "}
            <a href={discordHref} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            {" · "}
            {me.role ? <Link href="/dashboard">Member area</Link> : <Link href="/accounts/login">Member login</Link>}
            {" · "}
            <Link href="/privacy">Privacy</Link>
            {" · "}
            <Link href="/terms">Terms</Link>
          </p>
        </div>
        <p className="ax-footer__word" aria-hidden="true">
          Astra
        </p>
      </footer>

      {editing ? (
        <div className="ax-editbar" role="region" aria-label="Edit website">
          <span>
            <strong>Editing text.</strong> Click any outlined text to change it. Layout and photos stay put. Clear a box
            to go back to the original.
          </span>
          <button type="button" className="adm-btn adm-btn--sm" onClick={() => stopEdit(true)} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="adm-btn adm-btn--sm adm-btn--red" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      ) : null}
      {toast ? (
        <p className="ax-toast" role="status">
          {toast}
        </p>
      ) : null}
    </div>
  );
}
