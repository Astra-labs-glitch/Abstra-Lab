import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireStaff } from "../../../../lib/auth";
import { RoleForm } from "../role-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New role", robots: { index: false, follow: false } };

export default async function NewRolePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!(await requireStaff())) redirect("/dashboard");
  const { error } = await searchParams;
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/dashboard/jobs" className="adm-back">
            ← Job roles
          </Link>
          <h1>New role</h1>
          <p className="adm-sub">Write it the way you&apos;d explain it at a Friday meeting.</p>
        </div>
      </header>
      <RoleForm error={error} />
    </>
  );
}
