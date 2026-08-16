/* --------------------------------------------------------------------------
 *  LEGAL
 *
 *  VIMAN's real corporate details are not known to this codebase. Every fact
 *  that would normally be filled from a company register — legal name, address,
 *  contact addresses, jurisdiction — is a bracketed placeholder here and must
 *  be replaced before the site goes to production. Nothing in the copy claims
 *  compliance with a named regime (GDPR, DPDP, ISO, SOC 2) because none of that
 *  has been verified.
 * -------------------------------------------------------------------------- */

export const legalPlaceholders = {
  entity: "[Company Legal Name]",
  address: "[Business Address]",
  privacyEmail: "[Privacy Email]",
  contactEmail: "[Contact Email]",
  jurisdiction: "[Jurisdiction]",
} as const;

/** Single source for the "Last updated" stamp shown on every legal page. */
export const legalUpdated = "16 August 2026";

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
      "What VIMAN collects when you use this site, why it is collected, and how to have it removed.",
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
      "VIMAN publishes guidance on the DGCA pilot pathway. It is not a regulator, an examiner or a flying school.",
  },
];
