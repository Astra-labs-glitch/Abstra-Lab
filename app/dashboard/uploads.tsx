"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { addEventPhoto, saveEvent, uploadAccountPhoto } from "./admin-actions";

/** Shrinks a photo in the browser so uploads stay well under the server limit. */
async function resizeImage(file: File, maxSide: number): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.82));
  return blob ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
}

async function uploadPhotos(eventId: string, files: File[], onProgress: (done: number) => void) {
  let done = 0;
  const errors: string[] = [];
  for (const file of files) {
    const fd = new FormData();
    fd.set("eventId", eventId);
    fd.set("photo", await resizeImage(file, 1800));
    const res = await addEventPhoto(fd);
    if (!res.ok && res.error) errors.push(`${file.name}: ${res.error}`);
    onProgress(++done);
  }
  return errors;
}

function usePreviews(files: File[]) {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  return urls;
}

export type EventFormValues = {
  id?: string;
  title: string;
  date: string;
  location: string;
  eventType: string;
  description: string;
  published: boolean;
};

export function EventForm({ event, types }: { event?: EventFormValues; types: string[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const previews = usePreviews(files);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy("Saving…");
    const res = await saveEvent(new FormData(e.currentTarget));
    if (!res.ok || !res.id) {
      setBusy("");
      setError(res.error || "Couldn't save. Try again.");
      return;
    }
    if (files.length) {
      const errors = await uploadPhotos(res.id, files, (n) => setBusy(`Uploading photos ${n}/${files.length}…`));
      if (errors.length) {
        setBusy("");
        setError(`Saved, but some photos failed: ${errors.join("; ")}`);
        router.push(`/dashboard/events/${res.id}`);
        return;
      }
    }
    router.push(event?.id ? `/dashboard/events/${res.id}?saved=1` : "/dashboard/events?saved=1");
    router.refresh();
  }

  return (
    <form className="adm-form" onSubmit={onSubmit}>
      {event?.id ? <input type="hidden" name="id" value={event.id} /> : null}
      {error ? (
        <p className="adm-flash adm-flash--err" role="alert">
          {error}
        </p>
      ) : null}
      <div className="adm-form__grid">
        <label className="adm-field">
          <span>Title</span>
          <input name="title" required maxLength={140} defaultValue={event?.title} placeholder="e.g. Rocketry workshop at Newnham" />
        </label>
        <label className="adm-field">
          <span>Date</span>
          <input name="date" type="date" defaultValue={event?.date} />
        </label>
        <label className="adm-field">
          <span>Location</span>
          <input name="location" maxLength={140} defaultValue={event?.location} placeholder="e.g. Seneca Newnham, Toronto" />
        </label>
      </div>
      <fieldset className="adm-seg">
        <legend>Type</legend>
        {types.map((t) => (
          <label key={t}>
            <input type="radio" name="eventType" value={t} defaultChecked={(event?.eventType ?? "Outreach") === t} />
            <span>{t}</span>
          </label>
        ))}
      </fieldset>
      <label className="adm-field">
        <span>What we did</span>
        <small>A few sentences. This is what people read on the Events page.</small>
        <textarea name="description" rows={6} maxLength={5000} defaultValue={event?.description} />
      </label>
      <div className="adm-field">
        <span>{event?.id ? "Add more photos" : "Photos"}</span>
        <small>JPG or PNG, any size: we shrink them before uploading. The first photo is the big one.</small>
        <div className="adm-upl">
          {previews.map((src, i) => (
            <img key={src} src={src} alt={`New photo ${i + 1}`} />
          ))}
          <label className="adm-upl__drop">
            + Add photos
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => {
                const picked = Array.from(e.target.files ?? []);
                setFiles((f) => [...f, ...picked].slice(0, 20));
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
      <fieldset className="adm-seg">
        <legend>Status</legend>
        <label>
          <input type="radio" name="status" value="live" defaultChecked={event?.published ?? true} />
          <span>Published</span>
        </label>
        <label>
          <input type="radio" name="status" value="draft" defaultChecked={event ? !event.published : false} />
          <span>Draft</span>
        </label>
        <small>Published events show on the public Events page right away.</small>
      </fieldset>
      <div className="adm-form__bar">
        <button type="submit" className="adm-btn adm-btn--red" disabled={!!busy}>
          {busy || (event?.id ? "Save event" : "Post event")}
        </button>
        <a className="adm-btn" href="/dashboard/events">
          Cancel
        </a>
      </div>
    </form>
  );
}

export function AccountPhoto({ initial, src }: { initial: string; src: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    const small = await resizeImage(file, 900);
    setPreview(URL.createObjectURL(small));
    const fd = new FormData();
    fd.set("photo", small);
    const res = await uploadAccountPhoto(fd);
    setBusy(false);
    if (!res.ok) setError(res.error || "Upload failed.");
    else router.refresh();
  }

  const shown = preview ?? src;
  return (
    <div className="adm-acct__photo">
      <div className="adm-acct__ph">{shown ? <img src={shown} alt="Your photo" /> : initial}</div>
      <label className="adm-btn adm-btn--sm adm-file-btn">
        {busy ? "Uploading…" : shown ? "Change photo" : "Upload photo"}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} disabled={busy} />
      </label>
      <small className="adm-dim">A clear face photo works best. It shows on your Team page card.</small>
      {error ? <small className="ax-pink">{error}</small> : null}
    </div>
  );
}
