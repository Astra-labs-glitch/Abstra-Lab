import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../../lib/auth";
import { EVENT_TYPES } from "../../../../lib/site-text";
import { EventForm } from "../../uploads";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New event", robots: { index: false, follow: false } };

export default async function NewEventPage() {
  if (!(await requireStaff())) redirect("/dashboard");
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/dashboard/events" className="adm-back">
            ← Events
          </Link>
          <h1>New event</h1>
          <p className="adm-sub">Short and specific works best: where you were, what you did, who you met.</p>
        </div>
      </header>
      <EventForm types={EVENT_TYPES} />
    </>
  );
}
