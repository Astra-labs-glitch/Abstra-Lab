"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { discordInviteUrl } from "./content";

const navItems = [
	["Pioneer", "/pioneer"],
	["Launch Canada", "/launch-canada"],
	["About", "/about"],
	["Join", "/join"],
	["Events", "/events"],
	["News", "/posts"],
	["Sponsorship", "/sponsorship"],
	["Contact us", "/contact"],
] as const;

function ExternalOrLink({
	href,
	children,
	onClick,
}: Readonly<{
	href: string;
	children: React.ReactNode;
	onClick?: () => void;
}>) {
	if (/^https?:\/\//.test(href)) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				onClick={onClick}
			>
				{children}
			</a>
		);
	}
	return (
		<Link href={href} onClick={onClick}>
			{children}
		</Link>
	);
}

export function SiteShell({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();
	const [navOpen, setNavOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		document.documentElement.classList.add("js");
		document.body.classList.toggle("nav-open", navOpen);
		return () => document.body.classList.remove("nav-open");
	}, [navOpen]);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		setNavOpen(false);
	}, [pathname]);

	useEffect(() => {
		const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
		if (!nodes.length) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			for (const node of nodes) node.classList.add("visible");
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add("visible");
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
		);

		for (const node of nodes) {
			if (node.classList.contains("visible")) continue;
			observer.observe(node);
		}

		return () => observer.disconnect();
	}, [pathname]);

	const closeNav = () => setNavOpen(false);

	return (
		<>
			<a className="skip-link" href="#main">
				Skip to content
			</a>

			<header
				className={`sx-header${scrolled ? " is-scrolled" : ""}`}
				data-site-header
			>
				<Link className="sx-logo" href="/">
					Astra Labs Seneca Polytechnic
				</Link>

				<nav className="sx-header__nav" aria-label="Primary">
					<ul className="sx-header__nav-list">
						{navItems.map(([label, href]) => (
							<li key={href}>
								<Link
									href={href}
									aria-current={pathname === href ? "page" : undefined}
								>
									{label}
								</Link>
							</li>
						))}
						<li>
							<ExternalOrLink href={discordInviteUrl}>Discord</ExternalOrLink>
						</li>
					</ul>
				</nav>

				<button
					className="sx-menu-btn"
					type="button"
					data-nav-toggle
					aria-expanded={navOpen}
					aria-controls="site-nav"
					aria-label={navOpen ? "Close navigation" : "Open navigation"}
					onClick={() => setNavOpen((open) => !open)}
				>
					<span className="sx-menu-btn__bar" aria-hidden="true" />
					<span className="sx-menu-btn__bar" aria-hidden="true" />
					<span className="sx-menu-btn__bar" aria-hidden="true" />
				</button>
			</header>

			<nav
				className="nav-drawer"
				id="site-nav"
				data-site-nav
				hidden={!navOpen}
				aria-label="Main navigation"
			>
				<div className="nav-drawer__inner">
					<ul className="nav-drawer__list">
						{navItems.map(([label, href]) => (
							<li key={href}>
								<Link
									href={href}
									onClick={closeNav}
									aria-current={pathname === href ? "page" : undefined}
								>
									{label}
								</Link>
							</li>
						))}
						<li>
							<ExternalOrLink href={discordInviteUrl} onClick={closeNav}>
								Discord
							</ExternalOrLink>
						</li>
					</ul>
					<p className="nav-drawer__meta">
						Seneca Polytechnic · Launch Canada 2026
					</p>
				</div>
			</nav>

			<main id="main">{children}</main>

			<footer className="sx-footer">
				<div className="sx-footer__grid">
					<div className="sx-footer__brand">
						<Link className="sx-logo" href="/">
							Astra Labs Seneca Polytechnic
						</Link>
						<p>
							Student rocketry at Seneca Polytechnic. Building Pioneer for
							Launch Canada 2026.
						</p>
					</div>
					<div className="sx-footer__col">
						<h4>Build</h4>
						<Link href="/pioneer">Pioneer</Link>
						<Link href="/launch-canada">Launch Canada</Link>
						<Link href="/events">Events</Link>
						<Link href="/posts">News</Link>
					</div>
					<div className="sx-footer__col">
						<h4>Club</h4>
						<Link href="/about">About</Link>
						<Link href="/members">Members</Link>
						<Link href="/join">Join</Link>
						<Link href="/sponsorship">Sponsorship</Link>
						<Link href="/contact">Contact us</Link>
					</div>
					<div className="sx-footer__col">
						<h4>Connect</h4>
						<ExternalOrLink href={discordInviteUrl}>Discord</ExternalOrLink>
						<Link href="/join">Join the crew</Link>
						<Link href="/contact">Contact us</Link>
					</div>
				</div>
				<div className="sx-footer__base">
					<span>Astra Labs · Seneca Polytechnic (ALSP)</span>
					<span>Pioneer / Launch Canada 2026</span>
				</div>
			</footer>
		</>
	);
}
