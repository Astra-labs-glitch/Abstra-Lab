import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { setEventPublished } from "../admin-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Events", robots: { index: false, follow: false } };

export default async function EventsAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  if (!(await requireStaff())) redirect("/dashboard");
  const { saved, deleted } = await searchParams;
  const events = await prisma.clubEvent.findMany({
    orderBy: [{ startsAt: "desc" }, { createdAt: "desc" }],
    take: 200,
    include: { photos: { orderBy: { sortOrder: "asc" }, take: 1, select: { id: true, createdAt: true } }, _count: { select: { photos: true } } },
  });

  return (
    <>
      <header className="adm-head">
        <div>
          <p className="adm-kicker">Outreach</p>
          <h1>Events</h1>
          <p className="adm-sub">Post what the team did, with photos. Published events show on the public Events page.</p>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/events" target="_blank" rel="noopener noreferrer">
            View on site ↗
          </a>
          <Link className="adm-btn adm-btn--red" href="/dashboard/events/new">
            + New event
          </Link>
        </div>
      </header>

      {saved ? <p className="adm-flash">Event saved. The Events page is updated.</p> : null}
      {deleted ? <p className="adm-flash">Event deleted.</p> : null}

      {events.length ? (
        <div className="adm-list">
          {events.map((e) => (
            <div key={e.id.toString()} className="adm-item">
              <div className="adm-item__main">
                <div className="adm-item__top">
                  <span className={`adm-pill adm-pill--${e.published ? "open" : "draft"}`}>{e.published ? "live" : "draft"}</span>
                  <span className="adm-dim">
                    {[e.eventType, e.startsAt ? new Intl.DateTimeFormat("en-CA", { dateStyle: "medium", timeZone: "UTC" }).format(e.startsAt) : e.dateLabel, e.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <Link className="adm-item__title" href={`/dashboard/events/${e.id}`}>
                  {e.title}
                </Link>
                <p className="adm-dim">
                  {e._count.photos} photo{e._count.photos === 1 ? "" : "s"}
                </p>
              </div>
              <div className="adm-thumb">
                {e.photos[0] ? <img src={`/api/photos/event/${e.photos[0].id}?v=${e.photos[0].createdAt.getTime()}`} alt="" /> : null}
              </div>
              <div className="adm-item__actions">
                <Link className="adm-btn adm-btn--sm" href={`/dashboard/events/${e.id}`}>
                  Edit
                </Link>
                <form action={setEventPublished}>
                  <input type="hidden" name="id" value={e.id.toString()} />
                  <input type="hidden" name="published" value={e.published ? "0" : "1"} />
                  <button className="adm-btn adm-btn--sm" type="submit">
                    {e.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="adm-blank">
          <p className="adm-blank__title">No events yet.</p>
          <p className="adm-dim">Start with Launch Canada 2026: a few lines on the week and your best photos.</p>
          <Link className="adm-btn adm-btn--red" href="/dashboard/events/new">
            + New event
          </Link>
        </div>
      )}
    </>
  );
}
