import { hasDatabase, prisma } from "../../lib/prisma";
import { getSiteText, isPageLive } from "../../lib/site-text";
import { Editable } from "../editable";
import { pageMetadata } from "../seo";
import { UnderConstruction } from "../under-construction";

// Rebuilt when an admin posts or edits an event; hourly as a backstop.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Events",
  description: "Launches, workshops, outreach and conferences: what Astra Labs, Seneca's student rocketry team, has been up to.",
  path: "/events",
  image: "/images/astra/team-flag.jpg",
});

async function publishedEvents() {
  if (!hasDatabase()) return [];
  try {
    return await prisma.clubEvent.findMany({
      where: { published: true },
      orderBy: [{ startsAt: "desc" }, { createdAt: "desc" }],
      include: { photos: { orderBy: { sortOrder: "asc" }, select: { id: true, createdAt: true } } },
      take: 60,
    });
  } catch (error) {
    console.error("events unavailable", error);
    return [];
  }
}

function fmt(d: Date | null, label: string) {
  if (label) return label;
  if (!d) return "";
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Toronto" }).format(d);
}

export default async function EventsPage() {
  const t = await getSiteText();
  if (!(await isPageLive("events"))) return <UnderConstruction t={t} page="events" name="Events" />;
  const events = await publishedEvents();

  return (
    <section className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <Editable t={t} k="events.label" d="Events & outreach" as="p" className="ax-label" />
      <Editable t={t} k="events.title" d="Where we've been." as="h1" className="ax-display ax-display--xl" style={{ marginBottom: 20 }} />
      <Editable
        t={t}
        k="events.lede"
        d="Launches, workshops, school visits and conferences. Here's what we did and who we met."
        as="p"
        className="ax-lede"
        style={{ marginTop: 0, marginBottom: 56 }}
      />
      {events.length ? (
        <div className="ax-ev-list">
          {events.map((event) => (
            <article key={event.id.toString()} className="ax-ev">
              <div style={{ minWidth: 0 }}>
                <div className="ax-ev__meta">
                  <span className="ax-ev__type">{event.eventType}</span>
                  <span>{fmt(event.startsAt, event.dateLabel)}</span>
                  {event.location ? <span>{event.location}</span> : null}
                </div>
                <h2>{event.title}</h2>
                <p className="ax-ev__body">{event.description || event.summary}</p>
              </div>
              {event.photos.length ? (
                <div className="ax-ev__photos">
                  {event.photos.slice(0, 5).map((p) => (
                    <img
                      key={p.id}
                      src={`/api/photos/event/${p.id}?v=${p.createdAt.getTime()}`}
                      alt={`Photo from ${event.title}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : event.image && !/\.(mp4|webm|mov)$/i.test(event.image) ? (
                <div className="ax-ev__photos">
                  <img src={event.image.startsWith("/") || event.image.startsWith("http") ? event.image : `/media/${event.image}`} alt={`Photo from ${event.title}`} loading="lazy" />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="ax-tuned">
          <div style={{ flex: "1 1 460px", minWidth: 0 }}>
            <Editable t={t} k="events.empty.title" d="First post soon." as="p" className="ax-tuned__title" />
            <Editable
              t={t}
              k="events.empty.body"
              d="We're writing up our week in Timmins. Photos and stories from launches and outreach land here."
              as="p"
              style={{ margin: 0, fontSize: 19, color: "#d9d9d9", maxWidth: 560 }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
