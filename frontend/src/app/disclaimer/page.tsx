import type { Metadata } from "next";
import { LegalShell } from "@/components/layout/legal-shell";
import { legalPages, legalPlaceholders as P } from "@/lib/legal";

const page = legalPages.find((p) => p.slug === "disclaimer")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
};

export default function DisclaimerPage() {
  return (
    <LegalShell title={page.title} summary={page.summary} current={page.slug}>
      <p>
        VIMAN explains how someone in India gets from school to an airline flight deck. It is
        published by <span className="placeholder">{P.entity}</span> as reference material. Read
        this page before you rely on anything here.
      </p>

      <h2>What VIMAN is not</h2>
      <p>VIMAN is not, and does not act on behalf of:</p>
      <ul>
        <li>the Directorate General of Civil Aviation or any other civil aviation authority;</li>
        <li>a Flying Training Organisation or Approved Training Organisation;</li>
        <li>a DGCA-empanelled medical examiner or medical assessor;</li>
        <li>an airline, a cadet programme or a recruiter;</li>
        <li>a bank, lender or education finance provider.</li>
      </ul>
      <p>
        Where an airline, academy or portal is named on this site, it is named because it is part of
        the pathway a candidate has to navigate. Naming it is description, not affiliation,
        endorsement or partnership, and no relationship with VIMAN is implied.
      </p>

      <h2>Not professional advice</h2>
      <p>
        Nothing here is medical, legal, financial or career advice. Class 1 and Class 2 medical
        fitness can only be determined by an authorised examiner. Licensing outcomes can only be
        determined by the regulator. Loan eligibility can only be determined by a lender. Speak to
        the appropriate professional before committing money or time.
      </p>

      <h2>Requirements change</h2>
      <p>
        Syllabi, pass marks, medical standards, flying-hour requirements, examination schedules,
        portal procedures and cadet intakes are set by others and revised periodically. Content on
        this site reflects our understanding at the date shown above and may be out of date by the
        time you read it.
      </p>
      <p>
        Always confirm a requirement against the official source — the DGCA portals, the WPC, the
        training organisation, or the airline — before acting on it.
      </p>

      <h2>Costs and timelines</h2>
      <p>
        The durations and cost ranges published on this site are broad orientation figures. Actual
        cost depends on the organisation you train with, where you train, currency movement, weather
        and how many attempts each check takes. Treat the figures as a sense of scale, not a
        quotation or a budget.
      </p>

      <h2>No guarantee of outcome</h2>
      <p>
        Following the pathway described here does not guarantee a medical clearance, an examination
        pass, a licence, a type rating, an interview or a job. Airline recruitment depends on
        conditions no one on this site controls.
      </p>

      <h2>Limitation</h2>
      <p>
        To the extent the law allows, <span className="placeholder">{P.entity}</span> accepts no
        liability for loss or expense arising from reliance on this site. Your use of the site is
        also subject to our <a href="/terms-and-conditions">Terms &amp; Conditions</a>.
      </p>

      <h2>Corrections</h2>
      <p>
        If something on this site is wrong or out of date, tell us and we will correct it:{" "}
        <span className="placeholder">{P.contactEmail}</span>
      </p>
    </LegalShell>
  );
}
