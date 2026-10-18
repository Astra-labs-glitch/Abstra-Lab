import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { registerUser } from "../../../lib/accounts";
import { uniqueUsername } from "../../../lib/google-auth";
import { hasDatabase, prisma } from "../../../lib/prisma";
import { clientIp, rateLimit } from "../../../lib/rate-limit";
import { SUBTEAM_CHOICES } from "../../../lib/site-text";
import { GoogleButton } from "../google-button";

export const metadata: Metadata = {
  title: "Join the team",
  robots: { index: false, follow: false },
};

async function signupAction(formData: FormData) {
  "use server";
  if (!hasDatabase()) redirect("/accounts/signup?error=db");

  const ip = clientIp((await headers()).get("x-forwarded-for"));
  if (!(await rateLimit(`signup:${ip}`, 5, 15 * 60_000)).ok) redirect("/accounts/signup?error=throttled");

  if (formData.get("consent") !== "on") redirect("/accounts/signup?error=consent");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const want = String(formData.get("subteam") || "");
  const result = await registerUser({
    username: email.includes("@") ? await uniqueUsername(email) : "",
    email,
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
    password: String(formData.get("password") || ""),
  });
  if (!result.ok) {
    const code = result.error === "invalid" ? "invalid" : result.error === "signup_failed" ? "failed" : "taken";
    redirect(`/accounts/signup?error=${code}`);
  }

  await prisma.astraProfile
    .create({
      data: {
        userId: result.userId,
        wantSubteam: SUBTEAM_CHOICES.includes(want) ? want : "",
        program: String(formData.get("program") || "").trim().slice(0, 120),
      },
    })
    .catch((error) => console.error("profile create failed", error));

  if (result.active) redirect("/accounts/login?registered=1");
  redirect("/accounts/pending");
}

const ERRORS: Record<string, string> = {
  consent: "Tick the box to agree to the terms and privacy policy.",
  throttled: "Too many attempts. Please wait a few minutes and try again.",
  db: "Sign-up is unavailable right now because the site can't reach its database. Please try again later.",
  invalid: "Fill in every field and use a password of at least 8 characters.",
  taken: "That email already has an account. Log in instead, or use Continue with Google.",
  failed: "Something went wrong creating your account. Please try again.",
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <section className="ax-wrap" style={{ paddingTop: 96, paddingBottom: 96, maxWidth: 820 }}>
      <p className="ax-label">Members</p>
      <h1 className="ax-display ax-display--lg" style={{ marginBottom: 16 }}>
        Join the team.
      </h1>
      <p className="ax-lede" style={{ marginTop: 0, marginBottom: 32 }}>
        Make an account and tell us where you&apos;d like to help. An exec confirms your spot, then you get your own
        profile on the Team page.
      </p>
      {error ? (
        <p className="adm-flash adm-flash--err" role="alert">
          {ERRORS[error] ?? ERRORS.failed}
        </p>
      ) : null}
      <GoogleButton />
      <form className="adm-form" action={signupAction} style={{ marginTop: 8 }}>
        <div className="adm-form__grid">
          <label className="adm-field">
            <span>First name</span>
            <input name="firstName" required maxLength={60} autoComplete="given-name" />
          </label>
          <label className="adm-field">
            <span>Last name</span>
            <input name="lastName" required maxLength={60} autoComplete="family-name" />
          </label>
        </div>
        <label className="adm-field">
          <span>Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@myseneca.ca" />
        </label>
        <div className="adm-form__grid">
          <label className="adm-field">
            <span>Subteam you want</span>
            <select name="subteam" defaultValue="Not sure yet">
              {SUBTEAM_CHOICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="adm-field">
            <span>Program</span>
            <input name="program" maxLength={120} placeholder="e.g. Computer Engineering Technology" />
          </label>
        </div>
        <label className="adm-field">
          <span>Password</span>
          <input name="password" type="password" required minLength={8} autoComplete="new-password" />
          <small>At least 8 characters.</small>
        </label>
        <label className="ax-consent">
          <input type="checkbox" name="consent" required />
          <span>
            I agree to the <Link href="/terms">terms</Link> and the <Link href="/privacy">privacy policy</Link>. Your name,
            program and photo can appear on the public Team page once an exec approves you; you can hide your profile
            any time in My account.
          </span>
        </label>
        <div className="adm-form__bar">
          <button className="adm-btn adm-btn--red" type="submit">
            Create account
          </button>
          <span className="adm-dim">
            Already on the team? <Link href="/accounts/login">Log in</Link>
          </span>
        </div>
      </form>
    </section>
  );
}
