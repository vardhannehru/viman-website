import { company, companyAddress, contact } from "./site";

/* --------------------------------------------------------------------------
 *  LEGAL
 *
 *  Legal name, address and contact emails are VimanOne's real details. The
 *  jurisdiction is still a bracketed placeholder and must be replaced before
 *  the site goes to production. Nothing in the copy claims compliance with a
 *  named regime (GDPR, DPDP, ISO, SOC 2) because none of that has been
 *  verified.
 * -------------------------------------------------------------------------- */

export const legalPlaceholders = {
  entity: company.legalName,
  address: companyAddress,
  privacyEmail: contact.email,
  contactEmail: contact.email,
  jurisdiction: "India",
} as const;

/** Single source for the "Last updated" stamp shown on every legal page. */
export const legalUpdated = "14 September 2026";

export type LegalPage = {
  slug: string;
  href: string;
  title: string;
  /** Sentence shown under the title and in the page description. */
  summary: string;
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    href: "/privacy-policy",
    title: "Privacy Policy",
    summary:
      "What VimanOne collects when you use this site, why it is collected, and how to have it removed.",
  },
  {
    slug: "terms-and-conditions",
    href: "/terms-and-conditions",
    title: "Terms & Conditions",
    summary: "The terms you accept by using this site and the guidance published on it.",
  },
  {
    slug: "cookie-policy",
    href: "/cookie-policy",
    title: "Cookie Policy",
    summary: "The cookies and local storage this site uses, and how to control them.",
  },
  {
    slug: "disclaimer",
    href: "/disclaimer",
    title: "Disclaimer",
    summary:
      "VimanOne publishes guidance on the DGCA pilot pathway. It is not a regulator, an examiner or a flying school.",
  },
];
