import type { Metadata } from "next";
import { LegalShell } from "@/components/layout/legal-shell";
import { legalPages, legalPlaceholders as P } from "@/lib/legal";

const page = legalPages.find((p) => p.slug === "privacy-policy")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalShell title={page.title} summary={page.summary} current={page.slug}>
      <p>
        This policy explains what {P.entity} (&ldquo;we&rdquo;) does with information collected
        through this website. It covers the
        website only. It does not cover the DGCA portals, airline career pages or flying school
        sites that VimanOne links to — those are operated by other organisations under their own
        policies.
      </p>

      <h2>What we collect</h2>
      <p>
        VimanOne is a published guide. There is no account, no login and no form on this site, so we
        do not ask you for your name, your contact details or any document.
      </p>
      <p>Two categories of information are handled:</p>
      <ul>
        <li>
          <strong>Technical request data.</strong> Like any web server, ours records the request:
          IP address, browser and operating system, the page requested, and the time. This is used
          to serve the site and to diagnose faults.
        </li>
        <li>
          <strong>Local browser storage.</strong> Preferences such as reduced-motion handling are
          kept in your own browser. They are not transmitted to us. See the{" "}
          <a href="/cookie-policy">Cookie Policy</a>.
        </li>
      </ul>
      <p>
        If you contact us directly, we hold whatever you choose to put in that message for as long
        as it takes to answer you.
      </p>

      <h2>Why we hold it</h2>
      <p>
        Request data is held to keep the site running, to understand which sections are read, and
        to investigate abuse or errors. We do not build advertising profiles and we do not sell
        information about visitors.
      </p>

      <h2>Who else sees it</h2>
      <p>
        Our hosting and content delivery providers process request data on our behalf in order to
        serve the site. We share information with anyone else only where the law requires it.
      </p>
      <p>
        Where the site embeds or links to a third party — a government portal, an airline careers
        page — that organisation sees your visit under its own terms once you follow the link.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Server logs are retained for a limited operational period and then discarded. Correspondence
        is kept for as long as the matter is open. Where a specific retention period applies, it is
        set out at <a href={`mailto:${P.privacyEmail}`}>{P.privacyEmail}</a> on request.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>You can clear the site&rsquo;s local storage at any time from your browser settings.</li>
        <li>
          You can ask what we hold about you, ask for it to be corrected, or ask for it to be
          deleted, by writing to <a href={`mailto:${P.privacyEmail}`}>{P.privacyEmail}</a>.
        </li>
        <li>
          You can ask us to stop processing your information where we have no overriding reason to
          continue.
        </li>
      </ul>
      <p>
        The rights actually available to you depend on where you live and which data protection law
        applies. We will tell you which of these applies to your request when you make it.
      </p>

      <h2>Children</h2>
      <p>
        The pathway described on this site begins at seventeen. The site is not directed at children
        and we do not knowingly collect information from them. If you believe a child has sent us
        personal information, write to <a href={`mailto:${P.privacyEmail}`}>{P.privacyEmail}</a> and we
        will remove it.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable technical measures to protect the information we hold. No website can
        promise perfect security, and we do not.
      </p>

      <h2>Changes</h2>
      <p>
        When this policy changes, the date at the top of this page changes with it. Material changes
        will be noted on the site.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions: <a href={`mailto:${P.privacyEmail}`}>{P.privacyEmail}</a>
        <br />
        Postal address: {P.address}
      </p>
    </LegalShell>
  );
}
