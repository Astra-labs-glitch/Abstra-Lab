import { featuredNews } from "../content";
import { PageHero } from "../page-sections";
import { getPublicPosts } from "../../lib/public-content";
import { pageMetadata } from "../seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
	title: "News",
	description:
		"News and build log from Astra Labs — Seneca coverage, ship notes, bench work, and handoffs for the Pioneer rocket program.",
	path: "/posts",
});

function postDate(value: string) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(value));
}

export default async function PostsPage() {
	const posts = await getPublicPosts();

	return (
		<>
			<PageHero
				eyebrow="News & build log"
				title="News"
				lede="Club coverage and frequent updates from the crew — ship notes, bench work, tests, and handoffs for Pioneer."
				meta={["Updated often", "Ship logs", "Launch Canada 2026"]}
			/>

			<section className="sx-page-body">
				<div className="wrap">
					<div className="post-feed">
						{featuredNews.map((item) => (
							<article
								className="post-card post-card--external"
								key={item.href}
							>
								<div className="post-card__body">
									<p className="post-card__meta">
										{item.dateLabel} · {item.source}
									</p>
									<h2>
										<a
											href={item.href}
											target="_blank"
											rel="noopener noreferrer"
										>
											{item.title}
										</a>
									</h2>
									<p className="post-card__excerpt">{item.excerpt}</p>
									<a
										className="post-card__link"
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
									>
										Read on Seneca MyNews
									</a>
								</div>
							</article>
						))}

						{posts.length ? (
							posts.map((post) => (
								<article className="post-card" key={post.slug}>
									{post.featured_image_url && (
										<a
											className="post-card__media"
											href={`/posts/${post.slug}`}
										>
											<img src={post.featured_image_url} alt={post.title} />
										</a>
									)}
									<div className="post-card__body">
										<p className="post-card__meta">
											{postDate(post.created_at)} · {post.author}
										</p>
										<h2>
											<a href={`/posts/${post.slug}`}>{post.title}</a>
										</h2>
										<p className="post-card__excerpt">
											{post.excerpt ||
												post.content.split(/\s+/).slice(0, 36).join(" ")}
										</p>
										<a className="post-card__link" href={`/posts/${post.slug}`}>
											Read post
										</a>
									</div>
								</article>
							))
						) : (
							<div className="post-feed__empty">
								<p className="section-eyebrow">Crew posts</p>
								<h2>More build-log posts will show up here.</h2>
								<p className="sx-page-hero__lede">
									Member publishing is archived for now. Featured coverage above
									stays available without the dashboard.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>
		</>
	);
}
