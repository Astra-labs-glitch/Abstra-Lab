import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireStaff } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { deleteRole } from "../../admin-actions";
import { RoleForm } from "../role-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit role", robots: { index: false, follow: false } };

export default async function EditRolePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const me = await requireStaff();
  if (!me) redirect("/dashboard");
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const role = await prisma.jobRole.findUnique({
    where: { id: Number(id) || 0 },
    include: { _count: { select: { applications: true } } },
  });
  if (!role) notFound();

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/dashboard/jobs" className="adm-back">
            ← Job roles
          </Link>
          <h1>{role.title}</h1>
          <p className="adm-sub">
            <Link href={`/dashboard/applications?role=${role.id}`}>
              {role._count.applications} application{role._count.applications === 1 ? "" : "s"}
            </Link>
          </p>
        </div>
      </header>
      <RoleForm role={role} error={error} />

      {me.isSuperuser ? (
        <details className="adm-danger">
          <summary>Delete this role</summary>
          <p className="adm-dim">
            This also deletes its {role._count.applications} application(s) and their résumés, for good. To just hide the
            role, set it to Closed instead.
          </p>
          <form action={deleteRole}>
            <input type="hidden" name="id" value={role.id} />
            <button type="submit" className="adm-btn adm-btn--danger">
              Delete role and applications
            </button>
          </form>
        </details>
      ) : null}
    </>
  );
}
