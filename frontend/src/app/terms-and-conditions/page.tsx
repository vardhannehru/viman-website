import type { Metadata } from "next";
import { LegalShell } from "@/components/layout/legal-shell";
import { legalPages, legalPlaceholders as P } from "@/lib/legal";

const page = legalPages.find((p) => p.slug === "terms-and-conditions")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
};

export default function TermsPage() {
  return (
    <LegalShell title={page.title} summary={page.summary} current={page.slug}>
      <p>
        These terms govern your use of this website, operated by{" "}
        {P.entity} (&ldquo;VIMAN&rdquo;, &ldquo;we&rdquo;). By
        using the site you accept them. If you do not, please stop using the site.
      </p>

      <h2>What this site is</h2>
      <p>
        VIMAN publishes an explanation of the route to an Indian commercial pilot licence: the
        prerequisites, the examinations, the medicals, the flying hours and the airline entry
        points. It is reference material.
      </p>
      <p>
        VIMAN is not a regulator, an examiner, a medical assessor, a flying training organisation or
        a recruitment agency. Nothing here is an offer of training, employment, admission or
        finance. See the <a href="/disclaimer">Disclaimer</a>.
      </p>

      <h2>Accuracy</h2>
      <p>
        Aviation requirements change. Fees, syllabi, medical standards, examination schedules and
        airline intakes are set by the Directorate General of Civil Aviation, by other authorities
        and by individual operators — not by us — and any of them can change without notice.
      </p>
      <p>
        We take care to describe the pathway correctly, but we do not warrant that everything on
        this site is current, complete or applicable to your situation. Before you act, verify the
        requirement against the official source. The cost figures on this site are ranges given for
        orientation; they are not quotations.
      </p>

      <h2>Your use of the site</h2>
      <ul>
        <li>Use the site for your own information, lawfully.</li>
        <li>
          Do not attempt to disrupt the site, gain unauthorised access to it, or extract its content
          by automated means at a scale that degrades it for others.
        </li>
        <li>
          Do not present VIMAN&rsquo;s material as your own, or as endorsed by a regulator or an
          airline.
        </li>
      </ul>

      <h2>Links to other sites</h2>
      <p>
        We link to government portals, training organisations and airline career pages so you can
        reach the authoritative source. We do not control those sites, we are not responsible for
        their content or their handling of your data, and a link is not an endorsement or a
        partnership.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The VIMAN name, mark, design, written material and code on this site belong to{" "}
        {P.entity} or are used with permission. Regulatory
        terminology, examination names and organisation names belong to their respective owners and
        are used descriptively.
      </p>
      <p>
        You may read, quote briefly with attribution, and share links to this site. You may not
        reproduce it wholesale or use the VIMAN mark without written permission.
      </p>

      <h2>Liability</h2>
      <p>
        The site is provided as it is. To the extent the law allows, we exclude liability for loss
        arising from decisions taken on the basis of this site — including money spent on training,
        examinations or applications.
      </p>
      <p>
        Nothing in these terms limits liability that cannot lawfully be limited, including for
        fraud, or for death or personal injury caused by negligence.
      </p>

      <h2>Availability</h2>
      <p>
        We may change, suspend or withdraw the site or any part of it at any time. We do not
        guarantee uninterrupted availability.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may revise these terms. The date at the top of this page shows when they last changed.
        Continuing to use the site after a change means you accept the revised terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of{" "}
        <span className="placeholder">{P.jurisdiction}</span>, and the courts of{" "}
        <span className="placeholder">{P.jurisdiction}</span> have jurisdiction over any dispute
        arising from them.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${P.contactEmail}`}>{P.contactEmail}</a>
        <br />
        {P.address}
      </p>
    </LegalShell>
  );
}
