import Link from "next/link";

import { ROLE_AREAS, ROLE_STATUSES } from "../../../lib/jobs";
import { saveRole } from "../admin-actions";

type Role = {
  id: number;
  title: string;
  subteam: string;
  summary: string;
  duties: string;
  requirements: string;
  commitment: string;
  area: string;
  programs: string;
  spots: string;
  status: string;
  sortOrder: number;
};

const SUBTEAMS = ["Airframe", "Avionics & recovery", "Payload", "Ground software & data", "Operations"];

export function RoleForm({ role, error }: { role?: Role; error?: string }) {
  return (
    <form action={saveRole} className="adm-form">
      {role ? <input type="hidden" name="id" value={role.id} /> : null}
      {error === "title" ? <p className="adm-flash adm-flash--err">Give the role a title.</p> : null}

      <div className="adm-form__grid">
        <label className="adm-field adm-field--wide">
          <span>Role title</span>
          <input name="title" required maxLength={140} defaultValue={role?.title} placeholder="e.g. Avionics member" />
        </label>
        <label className="adm-field">
          <span>Subteam</span>
          <input name="subteam" list="subteams" maxLength={80} defaultValue={role?.subteam} />
          <datalist id="subteams">
            {SUBTEAMS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </label>
        <label className="adm-field">
          <span>Time commitment</span>
          <input name="commitment" maxLength={140} defaultValue={role?.commitment} placeholder="e.g. ~5 hrs/week, Fall–Winter" />
        </label>
      </div>

      <div className="adm-form__grid">
        <label className="adm-field">
          <span>Area (public filter)</span>
          <select name="area" defaultValue={role?.area ?? ""}>
            <option value="">None</option>
            {ROLE_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="adm-field">
          <span>Preferred Seneca programs</span>
          <small>Program codes, comma separated, e.g. EET, EMA, MIT. Any program can still apply.</small>
          <input name="programs" maxLength={200} defaultValue={role?.programs} placeholder="EET, EMA, MIT" />
        </label>
        <label className="adm-field">
          <span>Volunteers needed</span>
          <input name="spots" maxLength={60} defaultValue={role?.spots} placeholder="e.g. 2–3 volunteers" />
        </label>
      </div>

      <label className="adm-field">
        <span>One-line summary</span>
        <input name="summary" maxLength={600} defaultValue={role?.summary} placeholder="Shown under the title on /jobs" />
      </label>

      <div className="adm-form__grid">
        <label className="adm-field">
          <span>What you&apos;d do</span>
          <small>One per line</small>
          <textarea name="duties" rows={6} defaultValue={role?.duties} />
        </label>
        <label className="adm-field">
          <span>Good to have</span>
          <small>One per line. Keep it short; people talk themselves out of applying.</small>
          <textarea name="requirements" rows={6} defaultValue={role?.requirements} />
        </label>
      </div>

      <fieldset className="adm-seg">
        <legend>Status</legend>
        {ROLE_STATUSES.map(([value, label]) => (
          <label key={value}>
            <input type="radio" name="status" value={value} defaultChecked={(role?.status ?? "open") === value} />
            <span>{label}</span>
          </label>
        ))}
        <small>Open roles show on /jobs with an Apply button. Drafts and closed roles are hidden.</small>
      </fieldset>

      <label className="adm-field adm-field--narrow">
        <span>Order</span>
        <small>Lower numbers show first</small>
        <input name="sortOrder" type="number" defaultValue={role?.sortOrder ?? 0} />
      </label>

      <div className="adm-form__bar">
        <button type="submit" className="adm-btn adm-btn--red">
          {role ? "Save changes" : "Create role"}
        </button>
        <Link href="/dashboard/jobs" className="adm-btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}
