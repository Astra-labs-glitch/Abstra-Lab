import { LegalPage } from "../legal-page";
import { pageMetadata } from "../seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Terms of use",
  description: "The ground rules for using alsp.ca and Astra Labs member accounts.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      prefix="terms"
      label="Terms"
      title="Terms of use."
      updated="Last updated October 2026"
      intro="alsp.ca is run by Astra Labs, a student rocketry team at Seneca Polytechnic in Toronto. By using the site or making an account, you agree to these terms."
      sections={[
        {
          id: "accounts",
          heading: "Accounts",
          bullets: [
            "Accounts are for Astra Labs members and people applying to join. An exec approves each new account.",
            "Keep your login to yourself and use your real name.",
            "We can pause or remove an account that breaks these terms or is no longer on the team.",
          ],
        },
        {
          id: "content",
          heading: "What you post",
          paras: [
            "You own what you upload (your photo, bio, résumé). By adding it to your profile, you let us show it on the site as described in our privacy policy. Only upload things you have the right to share, and nothing offensive, misleading or illegal.",
          ],
        },
        {
          id: "ours",
          heading: "Our content",
          paras: [
            "Text, photos and the Astra Labs name and logo belong to Astra Labs or the people who made them. Sponsor logos belong to their companies and are shown with permission. Ask us before reusing anything.",
          ],
        },
        {
          id: "accuracy",
          heading: "Accuracy",
          paras: [
            "We're students and we try to keep everything accurate and up to date, but the site is provided as is. Nothing here is engineering, safety or financial advice.",
          ],
        },
        {
          id: "law",
          heading: "The rules that apply",
          paras: [
            "These terms are governed by the laws of Ontario and Canada. If we change them, we'll update the date at the top of this page.",
          ],
        },
      ]}
    />
  );
}
