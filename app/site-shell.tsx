"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { contact, discordHref } from "./content";
import { LaunchPad } from "./launch-pad";

const navItems = [
  ["Pioneer", "/"],
  ["Team", "/team"],
  ["Jobs", "/jobs"],
  ["Gallery", "/gallery"],
  ["Sponsor", "/sponsorship"],
] as const;

export function SiteShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // The member area is a work tool: no marketing nav or launchpad footer.
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return <div className="ax">{children}</div>;
  }

  return (
    <div className="ax">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="ax-header">
        <nav className="ax-nav" id="site-nav" aria-label="Main navigation">
          <Link className="ax-nav__logo" href="/" aria-label="Astra Labs home">
            <img src="/images/astra/astra-labs-logo.png" alt="Astra Labs" />
          </Link>
          <div className="ax-nav__links">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} aria-current={pathname === href ? "page" : undefined}>
                {label}
              </Link>
            ))}
            <Link className="ax-btn ax-btn--red" href="/jobs">
              Join us
            </Link>
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
            <Link href="/accounts/login">Member login</Link>
          </p>
        </div>
        <p className="ax-footer__word" aria-hidden="true">
          Astra Labs
        </p>
      </footer>
    </div>
  );
}
