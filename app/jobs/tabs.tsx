"use client";

import { useEffect, useState, type ReactNode } from "react";

// Two views on one page: open roles and the team handbook. The URL hash (#handbook)
// selects the handbook so it can be linked to directly.
export function JobsTabs({ roles, handbook }: { roles: ReactNode; handbook: ReactNode }) {
  const [tab, setTab] = useState<"roles" | "handbook">("roles");

  useEffect(() => {
    const read = () => setTab(window.location.hash === "#handbook" ? "handbook" : "roles");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  function pick(next: "roles" | "handbook") {
    setTab(next);
    history.replaceState(null, "", next === "handbook" ? "#handbook" : window.location.pathname);
  }

  return (
    <>
      <div className="ax-tabs" role="tablist" aria-label="Volunteer page sections">
        <button type="button" role="tab" id="tab-roles" className="ax-tab" aria-selected={tab === "roles"} aria-controls="panel-roles" onClick={() => pick("roles")}>
          Open volunteer roles
        </button>
        <button type="button" role="tab" id="tab-handbook" className="ax-tab" aria-selected={tab === "handbook"} aria-controls="panel-handbook" onClick={() => pick("handbook")}>
          Team handbook
        </button>
      </div>
      <div id="panel-roles" role="tabpanel" aria-labelledby="tab-roles" hidden={tab !== "roles"}>
        {roles}
      </div>
      <div id="panel-handbook" role="tabpanel" aria-labelledby="tab-handbook" hidden={tab !== "handbook"}>
        {handbook}
      </div>
    </>
  );
}
