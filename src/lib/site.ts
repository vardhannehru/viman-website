import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  IdCard,
  Plane,
  PlaneTakeoff,
  RadioTower,
  Stethoscope,
  Timer,
} from "lucide-react";

/* ==========================================================================
 * SOURCE OF TRUTH
 *
 * Every string in this file comes from the uploaded VIMAN pathway document.
 * Nothing here is invented. If a section of the product is not in that
 * document, it is not in this file and it is not on the site.
 * ========================================================================== */

export const site = {
  name: "VIMAN",
  /* Page 2 of the source, verbatim. */
  tagline: "one app",
  headline: "Zero to Cockpit",
  description:
    "VIMAN — one app, Zero to Cockpit. The DGCA pilot pathway: prerequisites, roadmap, step-by-step licence route, timeline and investment, cadet versus traditional pathways, and official application portals.",
  url: "https://viman.aero",
  locale: "en_IN",
} as const;

/* -------------------------------------------------------------------------- */
/*  NAVIGATION                                                                */
/*  The source is a mobile app flow with no navigation bar. These labels are  */
/*  taken from its own section headings so the web version can be moved       */
/*  around without introducing new vocabulary.                                */
/* -------------------------------------------------------------------------- */

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Roadmap", href: "/#roadmap" },
  { label: "Step-by-Step", href: "/#pathway" },
  { label: "Investment", href: "/#investment" },
  { label: "Cadet vs Traditional", href: "/#compare" },
  { label: "Portals", href: "/#portals" },
];

/* -------------------------------------------------------------------------- */
/*  STAGES — "Which stage are you in?"                                        */
/*                                                                            */
/*  Static. The source names four stages and attaches a status phrase to      */
/*  three of them. It provides no per-stage content, so these are display     */
/*  only — not selectable, not linked.                                        */
/* -------------------------------------------------------------------------- */

export type Stage = {
  id: string;
  label: string;
  /** Present in the source for three of the four stages only. */
  status?: string;
  icon: LucideIcon;
};

export const stages: Stage[] = [
  { id: "thinking", label: "Thinking to become a pilot", icon: BrainCircuit },
  { id: "ground", label: "Ground school", status: "Ready to taxi", icon: BookOpen },
  { id: "flight", label: "Flight school", status: "on the runway", icon: PlaneTakeoff },
  { id: "cpl", label: "Cpl", status: "Ready to take off", icon: Award },
];

/* -------------------------------------------------------------------------- */
/*  ROADMAP — "Steps to Become an Airline Pilot"                              */
/*  The nine-step roadmap shown for the "Thinking to become a pilot" stage.   */
/* -------------------------------------------------------------------------- */

export type RoadmapStep = {
  index: string;
  title: string;
  detail?: string;
  icon: LucideIcon;
  accent: "cyan" | "sky" | "gold";
};

export const roadmap: RoadmapStep[] = [
  {
    index: "01",
    title: "Complete 12th Board Exams",
    detail: "Physics & Mathematics required",
    icon: GraduationCap,
    accent: "cyan",
  },
  { index: "02", title: "Class 2 Medical Certification", icon: Stethoscope, accent: "cyan" },
  { index: "03", title: "Prepare for DGCA & RTR(A) Subjects", icon: BookOpen, accent: "cyan" },
  { index: "04", title: "Class 1 Medical Certification", icon: HeartPulse, accent: "sky" },
  { index: "05", title: "DGCA & RTR(A) Examinations", icon: ClipboardList, accent: "sky" },
  { index: "06", title: "Apply for DGCA Computer Number", icon: IdCard, accent: "sky" },
  { index: "07", title: "CPL Flight Training", icon: PlaneTakeoff, accent: "gold" },
  {
    index: "08",
    title: "CPL Licence Application & Conversion",
    icon: BadgeCheck,
    accent: "gold",
  },
  {
    index: "09",
    title: "Type Rating",
    detail: "Airline Aircraft Training",
    icon: Plane,
    accent: "gold",
  },
];

/* -------------------------------------------------------------------------- */
/*  PREREQUISITES & QUALIFICATIONS                                            */
/* -------------------------------------------------------------------------- */

export const prerequisites = {
  eyebrow: "Prerequisites & Qualifications",
  items: [
    {
      icon: Timer,
      label: "Age",
      body: "Minimum 17 years old to start flight training; minimum 18 years old to receive a Commercial Pilot License (CPL).",
    },
    {
      icon: GraduationCap,
      label: "Education",
      body: "10+2 / Higher Secondary pass with Physics and Mathematics (minimum 50% aggregate recommended).",
    },
  ],
  note: {
    title: "Note for Non-Science Students",
    body: "If you completed 10+2 in Arts or Commerce, you can clear Physics and Mathematics separately as on-demand subjects through the National Institute of Open Schooling (NIOS).",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  STEP-BY-STEP PILOT PATHWAY                                                */
/* -------------------------------------------------------------------------- */

export type PathwayStep = {
  id: string;
  index: string;
  title: string;
  /** The italic caption carried under each step heading in the source. */
  caption: string;
  intro?: string;
  detail: string[];
  note?: string;
  icon: LucideIcon;
  accent: "cyan" | "sky" | "gold";
};

export const pathwaySteps: PathwayStep[] = [
  {
    id: "egca",
    index: "1",
    title: "eGCA Profile & DGCA Computer Number",
    caption: "Administrative setup on official portals",
    detail: [
      "Register an account on the eGCA Portal (dgca.gov.in).",
      "Apply for a DGCA Computer Number via pariksha.dgca.gov.in. This unique ID is mandatory to register for and sit all DGCA theory examinations.",
    ],
    icon: IdCard,
    accent: "cyan",
  },
  {
    id: "medical",
    index: "2",
    title: "Medical Clearances (Class 2 & Class 1)",
    caption: "Health and physical fitness verification",
    detail: [
      "Class 2 Medical: Book an appointment with a DGCA-empanelled Medical Examiner (Class 2 doctor). Once cleared, the file goes to the DGCA Medical Cell for approval.",
    ],
    icon: HeartPulse,
    accent: "cyan",
  },
  {
    id: "ground-school",
    index: "3",
    title: "DGCA Ground School & Theory Exams",
    caption: "Clearing mandatory theoretical papers",
    intro:
      "Enroll in ground classes or self-study to clear the 5 core DGCA theoretical papers (70% pass mark required for each):",
    detail: [
      "Air Regulations (aviation laws, rules, procedures)",
      "Aviation Meteorology (weather patterns, charts, forecasts)",
      "Air Navigation (flight planning, calculations, radio aids)",
      "Technical General (aircraft engines, systems, aerodynamics)",
      "Technical Specific (systems of the specific aircraft you will train on)",
    ],
    note: "70% pass mark required for each",
    icon: BookOpen,
    accent: "sky",
  },
  {
    id: "rtr",
    index: "4",
    title: "WPC Radio Telephony Restricted (RTR-A) License",
    caption: "Aeronautical radio communication certification",
    detail: [
      "Appear for the RTR(A) examination conducted by the Wireless Planning & Coordination (WPC) wing of the Ministry of Communications.",
      "Covers Radio Telephony procedures, aviation terminology, and practical communication.",
    ],
    icon: RadioTower,
    accent: "sky",
  },
  {
    id: "flight-training",
    index: "5",
    title: "Flight Training (200 Flying Hours)",
    caption: "Practical flying at a DGCA-Approved FTO",
    intro:
      "Enroll in a DGCA-approved Flying Training Organization (FTO) in India or abroad to log the required 200 hours of flight time:",
    detail: [
      "100 Hours Pilot-in-Command (PIC)",
      "50 Hours Cross-Country flying",
      "20 Hours Instrument flying (up to 10 hours on a simulator)",
      "5 Hours Night flying (including takeoffs and landings)",
    ],
    note: "200 hours of flight time",
    icon: PlaneTakeoff,
    accent: "sky",
  },
  {
    id: "cpl",
    index: "6",
    title: "CPL Skill Tests & License Issuance",
    caption: "Flight checks and eGCA application",
    detail: [
      "Complete skill tests with a Designated Examiner (General Flying Test, Day/Night Cross Country, Instrument Rating check).",
      "Submit flight logs, exam results, and medical certificates on eGCA for official Commercial Pilot License (CPL) issuance.",
    ],
    icon: FileCheck2,
    accent: "gold",
  },
  {
    id: "type-rating",
    index: "7",
    title: "Type Rating & Airline Induction",
    caption: "Transitioning to commercial jetliners",
    detail: [
      "Complete a Type Rating course (e.g., Airbus A320 or Boeing 737 family) at an ATO (Approved Training Organization) involving ground school and full-flight simulator (FFS) sessions.",
      "Pass airline selection rounds (written exams, simulator assessment, HR interview) to join as a Junior First Officer.",
    ],
    icon: Plane,
    accent: "gold",
  },
];

/* -------------------------------------------------------------------------- */
/*  TYPICAL TIMELINE & INVESTMENT                                             */
/* -------------------------------------------------------------------------- */

export const investment = {
  eyebrow: "Typical Timeline & Investment",
  duration: {
    label: "Duration",
    value: "18 – 30 months",
    detail: "Depending on weather, flying school availability, and exam frequency",
  },
  rows: [
    { label: "Ground School & Exams", value: "₹1.5 Lakh – ₹3 Lakh", weight: 0.04 },
    { label: "Flying Training (200 Hrs)", value: "₹40 Lakh – ₹55 Lakh", weight: 0.65 },
    { label: "Type Rating (A320 / B737)", value: "₹15 Lakh – ₹25 Lakh", weight: 0.31 },
  ],
  total: { label: "Total Estimated Cost", value: "₹60 Lakh – ₹85 Lakh" },
} as const;

/* -------------------------------------------------------------------------- */
/*  CADET PILOT PROGRAM vs TRADITIONAL PATHWAY                                */
/* -------------------------------------------------------------------------- */

export type Pathway = {
  id: "cadet" | "traditional";
  index: string;
  name: string;
  how: string;
  steps?: string[];
  pros: { title: string; body: string }[];
  cons: { title: string; body: string }[];
  fit: string[];
  outcome: string;
  accent: "gold" | "cyan";
};

export const pathways: Pathway[] = [
  {
    id: "cadet",
    index: "1",
    name: "Cadet Pilot Program",
    accent: "gold",
    how: "You apply directly to an airline's cadet intake. You undergo an intensive multi-stage selection process (COMPASS/ADAPT tests, group tasks, HR interview, Class 1 medicals). If selected, the airline signs a Letter of Intent (LOI) and assigns you to a partnered Flying Training Organization (FTO) in India or abroad.",
    pros: [
      {
        title: "Job Assurance",
        body: "Provided you pass all checks and maintain performance standards, your seat in the cockpit as a Junior First Officer is essentially reserved.",
      },
      {
        title: "Streamlined Pathway",
        body: "Everything from DGCA ground school, 200 hours of flight training, eGCA processing, and Type Rating (A320/B737) is integrated into one package.",
      },
      {
        title: "Airline Standardized Training",
        body: "You learn the specific airline's Standard Operating Procedures (SOPs) and Multi-Crew Cooperation (MCC) from day one.",
      },
      {
        title: "Bank Financing Ease",
        body: "Banks offer education loans relatively easily because of the airline's brand and LOI attached to the program.",
      },
    ],
    cons: [
      {
        title: "Extremely High Cost",
        body: "Usually costs 40% to 70% more than the traditional path due to administrative overheads, simulator blocks, and integrated type ratings.",
      },
      {
        title: "High-Stakes Entry",
        body: "The screening process is fierce with low acceptance rates.",
      },
      {
        title: "Contractual Lock-In",
        body: "You are bound to fly for that specific airline for a mandatory bond period (typically 3 to 5 years).",
      },
      {
        title: "Mid-Way Washout Risk",
        body: "If you fail simulator checks or get medically un-cleared mid-way, you risk losing substantial non-refundable training fees.",
      },
    ],
    fit: [
      "I have ₹1 Cr+ budget / loan",
      "Want direct airline seat",
      "Pass tough airline tests",
    ],
    outcome: "Choose Cadet Program",
  },
  {
    id: "traditional",
    index: "2",
    name: "Traditional (Conventional) Pathway",
    accent: "cyan",
    how: "You independently manage your own career journey step by step:",
    steps: [
      "Apply for an eGCA ID & DGCA Computer Number independently.",
      "Complete Class 2 & Class 1 Medicals.",
      "Enroll in an independent Ground School to pass DGCA exams.",
      "Choose any DGCA-approved Flying Training Organization (FTO) in India or overseas (USA, South Africa, New Zealand, etc.) to log 200 hours.",
      "Receive your CPL, then apply for airline cadet/First Officer vacancies or fund your own Type Rating.",
    ],
    pros: [
      {
        title: "Cost Effective",
        body: "Significantly cheaper overall. You have granular control over where you spend money.",
      },
      {
        title: "Financial Flexibility",
        body: "You pay in stages (Medicals → Ground School → Flying Pay-per-hour → Type Rating) rather than committing a huge sum upfront.",
      },
      {
        title: "Freedom & Mobility",
        body: "You can apply to any airline (or corporate aviation, charter, flight instruction, cargo) that opens recruitment.",
      },
      {
        title: "Pacing Control",
        body: "If you face financial constraints or personal delays, you can pause and resume without breaching an airline contract.",
      },
    ],
    cons: [
      {
        title: "No Job Guarantee",
        body: "Once you get your CPL, you join an open pool of thousands of fresh CPL holders competing for airline vacancies.",
      },
    ],
    fit: ["Budget under ₹70–80 Lakhs", "Prefer flexible payments", "Open to all aviation roles"],
    outcome: "Choose Traditional Route",
  },
];

/* -------------------------------------------------------------------------- */
/*  KEY APPLICATION LINKS & PORTALS                                           */
/*                                                                            */
/*  The source names portals but does not print their URLs, so none are       */
/*  fabricated here — the portal is named and the applicant is directed to    */
/*  the airline's own site.                                                   */
/* -------------------------------------------------------------------------- */

export type Portal = {
  airline: string;
  program: string;
  overview: string;
  application: string;
  initiative?: string;
};

export const portals: Portal[] = [
  {
    airline: "IndiGo",
    program: "Cadet Pilot Program",
    overview:
      "Partnered with top Global/Domestic FTOs (CAE, Flight Training Adelaide, Insight Aviation, Skyborne, Chimes Aviation, etc.).",
    application:
      "IndiGo Flight Operations Careers Page, or apply directly via partner FTO portals (e.g., CAE Cadet Portal, Skyborne Cadet Portal).",
    initiative: "IndiGo Reach — Giving Wings to Fly (applications managed via ScholarsBox).",
  },
  {
    airline: "Air India",
    program: "Cadet Pilot Program",
    overview:
      "Partnered with academies such as AeroGuard (USA), AFTA (Amravati/AIFA), etc., taking candidates from zero experience to A320 or B737/B787 Type Rating.",
    application: "Air India Careers Portal (select Cadet Pilot Program / Trainee Pilot Program).",
  },
  {
    airline: "Akasa Air",
    program: "Cadet Pilot Program",
    overview: "Conducted in partnership with FTOs like FTA and BAA Training.",
    application: "Akasa Air Careers, or through designated FTO partner portals.",
  },
];
