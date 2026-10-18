import { LegalPage } from "../legal-page";
import { pageMetadata } from "../seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Privacy policy",
  description: "What Astra Labs collects on alsp.ca, why, who sees it, how long we keep it, and how to get it deleted.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      prefix="privacy"
      label="Privacy"
      title="Privacy policy."
      updated="Last updated October 2026"
      intro="Astra Labs is a student rocketry team at Seneca Polytechnic. We collect as little as we can, use it only to run the team, and never sell it. Here's exactly what that means."
      sections={[
        {
          id: "collect",
          heading: "What we collect",
          bullets: [
            "When you apply for a role: your name, email, program, year, your message, any links you add, and your résumé.",
            "When you make an account: your name, email, program, the subteam you're interested in, and a password (stored only as a one-way hash we can't read). If you use Continue with Google, we get your name and email from Google, nothing else.",
            "What you add to My account: a photo, bio, LinkedIn or portfolio link, and a résumé.",
            "A single login cookie (astra_session) that keeps you signed in. It's needed for the site to work, so there's no cookie banner.",
            "Our hosting provider keeps short-term server logs (like IP addresses) to keep the site running and block abuse.",
          ],
        },
        {
          id: "dont",
          heading: "What we don't do",
          bullets: [
            "No ads, no analytics trackers, no tracking pixels, no third-party cookies.",
            "We don't sell, rent or trade your information to anyone, ever.",
            "We don't email or text you anything you didn't ask for.",
          ],
        },
        {
          id: "use",
          heading: "Why we use it",
          paras: [
            "To review applications and contact applicants, to approve and manage team members, and to show approved members on the public Team page. Your name, title, subteam, photo and bio appear there only after an exec approves you, and you can hide your profile any time in My account.",
          ],
        },
        {
          id: "who",
          heading: "Who can see it",
          paras: [
            "Applications and résumés are visible only to the Astra Labs exec team, through a signed-in admin page. They are never public. Our website is hosted by Vercel and our database by Neon; both store data on servers in the United States and only process it to run the site for us.",
          ],
        },
        {
          id: "keep",
          heading: "How long we keep it",
          bullets: [
            "Job applications and their résumés are deleted automatically 12 months after you apply.",
            "Account and profile information is kept while you're on the team. Ask us and we'll delete it.",
            "Photos on the Gallery and Events pages stay up unless someone pictured asks us to take one down.",
          ],
        },
        {
          id: "rights",
          heading: "Your choices",
          paras: [
            "You can see and change your profile in My account at any time. To get a copy of what we hold about you, correct it, withdraw an application, delete your account, or have a photo taken down, email astralabsengineering@gmail.com. We'll do it within 30 days, usually much sooner.",
            "We follow Canada's privacy law (PIPEDA). If you're unhappy with how we handled your information, you can also contact the Office of the Privacy Commissioner of Canada.",
          ],
        },
        {
          id: "changes",
          heading: "Changes",
          paras: ["If we change this policy, we'll update the date at the top of this page."],
        },
      ]}
    />
  );
}
