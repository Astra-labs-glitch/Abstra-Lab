import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireStaff } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { EVENT_TYPES } from "../../../../lib/site-text";
import { deleteEvent, deleteEventPhoto, makeCoverPhoto } from "../../admin-actions";
import { EventForm } from "../../uploads";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit event", robots: { index: false, follow: false } };

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const me = await requireStaff();
  if (!me) redirect("/dashboard");
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  if (!/^\d+$/.test(id)) notFound();
  const event = await prisma.clubEvent.findUnique({
    where: { id: BigInt(id) },
    include: { photos: { orderBy: { sortOrder: "asc" }, select: { id: true, createdAt: true } } },
  });
  if (!event) notFound();

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/dashboard/events" className="adm-back">
            ← Events
          </Link>
          <h1>{event.title}</h1>
        </div>
        <div className="adm-head__actions">
          <a className="adm-btn" href="/events" target="_blank" rel="noopener noreferrer">
            View on site ↗
          </a>
        </div>
      </header>

      {saved ? <p className="adm-flash">Saved. The Events page is updated.</p> : null}

      {event.photos.length ? (
        <section className="adm-card" style={{ marginBottom: 32 }}>
          <h2 className="adm-card__h">Photos</h2>
          <div className="adm-upl">
            {event.photos.map((p, i) => (
              <figure key={p.id} className="adm-upl__item">
                <img src={`/api/photos/event/${p.id}?v=${p.createdAt.getTime()}`} alt={`Photo ${i + 1}`} />
                <figcaption>
                  {i === 0 ? (
                    <span className="adm-pill adm-pill--open">cover</span>
                  ) : (
                    <form action={makeCoverPhoto}>
                      <input type="hidden" name="photoId" value={p.id} />
                      <button className="adm-linkbtn" type="submit">
                        Make cover
                      </button>
                    </form>
                  )}
                  <form action={deleteEventPhoto}>
                    <input type="hidden" name="photoId" value={p.id} />
                    <button className="adm-linkbtn adm-linkbtn--danger" type="submit">
                      Remove
                    </button>
                  </form>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <EventForm
        types={EVENT_TYPES}
        event={{
          id: event.id.toString(),
          title: event.title,
          date: event.startsAt ? event.startsAt.toISOString().slice(0, 10) : "",
          location: event.location,
          eventType: event.eventType,
          description: event.description,
          published: event.published,
        }}
      />

      {me.isSuperuser ? (
        <details className="adm-danger">
          <summary>Delete this event</summary>
          <p className="adm-dim">Removes the post and all its photos for good. To just hide it, set it to Draft.</p>
          <form action={deleteEvent}>
            <input type="hidden" name="id" value={event.id.toString()} />
            <button type="submit" className="adm-btn adm-btn--danger">
              Delete event
            </button>
          </form>
        </details>
      ) : null}
    </>
  );
}
