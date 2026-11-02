import { clubSignupUrl, discordInviteUrl } from "../content";
import { PageHero, Rows } from "../page-sections";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata({
	title: "Join the Crew",
	description:
		"Join Astra Labs: show up to a work session, pick a workstream, and learn on real club hardware. Open intake for Seneca students, no experience required. Day-to-day coordination on Discord.",
	path: "/join",
	image: "/images/pick/outreach-model-rocket.jpg",
});

export default function JoinPage() {
	return (
		<>
			<PageHero
				eyebrow="Join"
				title="Join the Crew"
				lede="Show up to a work session, pick a stream, and learn on real club hardware."
				meta={["Open intake", "No experience required", "Seneca students"]}
			/>

			<section className="sx-page-body">
				<div className="wrap">
					<div className="sx-page-intro range-ticks range-ticks--section">
						<p className="section-eyebrow">How it works</p>
						<h2>The fastest path in is a small, real task.</h2>
					</div>
					<Rows
						items={[
							[
								"01",
								"Find the next session",
								"Use the club signup link or ask a member where the next build or planning session is.",
							],
							[
								"02",
								"Choose a workstream",
								"Mechanical, electronics, operations, documentation, sponsorship, or outreach.",
							],
							[
								"03",
								"Document the handoff",
								"Leave notes, photos, or test results the next member can use.",
							],
						]}
					/>
				</div>
			</section>

			<section className="sx-page-body" id="discord">
				<div className="wrap">
					<div className="sx-page-intro">
						<p className="section-eyebrow">Discord</p>
						<h2>Coordinate with the crew day to day.</h2>
						<p
							className="sx-page-hero__lede"
							style={{ marginTop: 16, maxWidth: "48ch" }}
						>
							Work-session updates, quick questions, and subsystem channels live
							on Discord. The website stays the durable public record.
						</p>
					</div>
					<div className="sx-hero__actions" style={{ marginTop: 32 }}>
						{discordInviteUrl ? (
							<a
								className="sx-btn sx-btn--fill"
								href={discordInviteUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Open Discord
							</a>
						) : null}
						<a
							className="sx-btn"
							href={clubSignupUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							Open Seneca club signup
						</a>
					</div>
				</div>
			</section>

			<section className="sx-page-body sx-page-body--tight">
				<div className="wrap">
					<div className="sx-page-intro">
						<p className="section-eyebrow">Good first tasks</p>
						<h2>You do not need to start with the hardest subsystem.</h2>
					</div>
					<Rows
						items={[
							[
								"Shop",
								"Inventory & prep",
								"Label parts, organize fasteners, photograph assemblies, update the build record.",
							],
							[
								"Design",
								"CAD & review",
								"Model fixtures, trace dimensions, or prepare review notes in OpenRocket.",
							],
							[
								"Ops",
								"Sponsorship & events",
								"Club booths, partner outreach, sponsor packages, and post-event notes.",
							],
						]}
					/>
				</div>
			</section>
		</>
	);
}
