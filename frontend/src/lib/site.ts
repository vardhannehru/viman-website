import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  IdCard,
  Plane,
  PlaneTakeoff,
  RadioTower,
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
    "VIMAN — one app, Zero to Cockpit. The DGCA pilot pathway: prerequisites, roadmap, step-by-step licence route, timeline and investment, and cadet versus traditional pathways.",
  url: "https://viman.aero",
  locale: "en_IN",
} as const;

/* How students reach VIMAN. Used by the footer, every boarding pass, the
   legal pages and the search-engine profile. */
export const contact = {
  email: "onevimana@gmail.com",
  phone: "+91 81216 71606",
  phoneHref: "tel:+918121671606",
  instagram: "https://www.instagram.com/viman.one/",
  instagramHandle: "@viman.one",
} as const;

/* The business behind VIMAN, as it appears on the legal pages and in the
   search-engine profile. */
export const company = {
  legalName: "VimanOne",
  address: {
    street: "Avenue 1, Guttala Begumpet, Kavuri Hills, Jubilee Hills",
    city: "Hyderabad",
    region: "Telangana",
    postalCode: "500081",
    country: "IN",
  },
} as const;

export const companyAddress = `${company.address.street}, ${company.address.city}, ${company.address.region} ${company.address.postalCode}`;

/* -------------------------------------------------------------------------- */
/*  NAVIGATION                                                                */
/*  The source is a mobile app flow with no navigation bar. These labels are  */
/*  taken from its own section headings so the web version can be moved       */
/*  around without introducing new vocabulary.                                */
/* -------------------------------------------------------------------------- */

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Checklist", href: "/#roadmap" },
  { label: "Timeline", href: "/#investment" },
  { label: "Cadet vs Traditional", href: "/#compare" },
];

/* -------------------------------------------------------------------------- */
/*  PREREQUISITES & QUALIFICATIONS                                           */
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
/*  STEP GUIDE ROUTES & OFFICIAL LINKS                                        */
/*  Every URL below was opened live before it was added (2026-09-13). DGCA    */
/*  PDF links were tried and returned DGCA's error page, so none are used.    */
/* -------------------------------------------------------------------------- */

const stepSlugs: Record<string, string> = {
  prerequisites: "prerequisites",
  egca: "egca-computer-number",
  medical: "medical-clearances",
  "ground-school": "ground-school-theory-exams",
  rtr: "rtr-a-licence",
  "flight-training": "flight-training",
  cpl: "cpl-skill-tests-licence",
  "type-rating": "type-rating-airline-induction",
};

export const guideHref = (stepId: string) => `/steps/${stepSlugs[stepId]}`;

export type GuideLink = {
  label: string;
  url: string;
  host: string;
  use: string;
  /** A page on this site rather than an official portal. */
  internal?: boolean;
};

const official = {
  egca: {
    label: "eGCA Portal",
    url: "https://www.dgca.gov.in/digigov-portal/jsp/dgca/common/login.jsp",
    host: "dgca.gov.in",
  },
  pariksha: {
    label: "DGCA Pariksha Portal",
    url: "https://pariksha.dgca.gov.in",
    host: "pariksha.dgca.gov.in",
  },
  dgca: {
    label: "DGCA Official Website",
    url: "https://www.dgca.gov.in/digigov-portal/",
    host: "dgca.gov.in",
  },
  rtr: {
    label: "DoT e-Services — RTR",
    url: "https://eservices.dot.gov.in/rtr",
    host: "eservices.dot.gov.in",
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
/*  ROADMAP — "Steps to Become an Airline Pilot"                              */
/*  Prerequisites first, then the seven pathway steps — the timeline the      */
/*  aircraft flies.                                                           */
/* -------------------------------------------------------------------------- */

export type RoadmapStep = {
  id: string;
  index: string;
  title: string;
  detail?: string;
  intro?: string;
  points: string[];
  note?: string;
  guide?: string;
  icon: LucideIcon;
  accent: "cyan" | "sky" | "gold";
};

export const roadmap: RoadmapStep[] = [
  {
    id: "prerequisites",
    index: "01",
    title: prerequisites.eyebrow,
    points: prerequisites.items.map((item) => `${item.label}: ${item.body}`),
    note: `${prerequisites.note.title}: ${prerequisites.note.body}`,
    icon: GraduationCap,
    accent: "cyan",
    guide: guideHref("prerequisites"),
  },
  ...pathwaySteps.map((step, i) => ({
    id: step.id,
    index: String(i + 2).padStart(2, "0"),
    title: step.title,
    detail: step.caption,
    intro: step.intro,
    points: step.detail,
    guide: guideHref(step.id),
    icon: step.icon,
    accent: step.accent,
  })),
];

/* -------------------------------------------------------------------------- */
/*  TYPICAL TIMELINE & INVESTMENT                                            */
/* -------------------------------------------------------------------------- */

export const investment = {
  eyebrow: "Timeline & Approx. Investment",
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
/*  STEP GUIDES — one detailed page per roadmap step, at /steps/<slug>.       */
/*  Copy is the source document plus what the linked official portal itself  */
/*  states. Edit or extend a step here; the page is generated from it.        */
/* -------------------------------------------------------------------------- */

export type GuideSection = {
  heading: string;
  body?: string[];
  points?: string[];
  /** A small illustration shown under the heading. */
  visual?: "turbulence";
};

export type StepGuide = {
  stepId: string;
  /** Header subtitle, for steps whose roadmap entry has no caption. */
  caption?: string;
  /** Meta description. */
  summary: string;
  intro: string;
  facts?: { label: string; value: string }[];
  sections: GuideSection[];
  tips: string[];
  links: GuideLink[];
  /** Line under "Did you complete this step?". */
  completePrompt: string;
  /** Disclaimer box shown at the end of the guide. */
  warning?: { title: string; body: string };
  /** VIMAN advertisement shown after the disclaimer. */
  promo?: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    action: string;
    /** "Service" line on the ticket stub. */
    service?: string;
    /** The boarding pass rides through light turbulence. */
    turbulence?: boolean;
  };
  /** Highlighted fun fact, shown after the guide's sections. */
  funFact?: { question: string; answer: string };
};

export const stepGuides: StepGuide[] = [
  {
    stepId: "prerequisites",
    caption: "Eligibility before you begin",
    summary:
      "The age and education requirements to start the DGCA pilot pathway — step 01 of the VIMAN roadmap.",
    intro:
      "Before any portal, medical or flight, check that you are eligible. The pathway sets two requirements — your age and your education — and offers a route for students who did not study science in 10+2.",
    facts: [
      { label: "Start flight training", value: "17 years or older" },
      { label: "Receive a CPL", value: "18 years or older" },
      { label: "Education", value: "10+2 with Physics & Maths" },
      { label: "Aggregate", value: "50% recommended" },
    ],
    sections: [
      {
        heading: "Age",
        body: [
          "You must be at least 17 years old to start flight training.",
          "You must be at least 18 years old to receive a Commercial Pilot License (CPL) — the licence you apply for in step 07.",
        ],
      },
      {
        heading: "Education",
        body: [
          "You need a 10+2 / Higher Secondary pass with Physics and Mathematics. A minimum 50% aggregate is recommended.",
        ],
      },
      {
        heading: "If you studied Arts or Commerce",
        body: [
          "If you completed 10+2 in Arts or Commerce, you can clear Physics and Mathematics separately as on-demand subjects through the National Institute of Open Schooling (NIOS).",
          "NIOS runs this through its On Demand Examination.",
        ],
      },
    ],
    tips: [
      "Check both requirements before you pay for anything else on this roadmap.",
      "If you need the NIOS route, plan it early — Physics and Mathematics are part of the education requirement.",
    ],
    links: [],
    completePrompt: "Tick this once you meet the age and education requirements.",
  },
  {
    stepId: "egca",
    summary:
      "How to set up your eGCA profile and get your DGCA Computer Number — step 02 of the VIMAN roadmap, with links to the official DGCA portals.",
    intro:
      "Before you can sit a single DGCA theory paper, two things have to be set up on the regulator's official portals: an eGCA profile and a DGCA Computer Number. It is paperwork rather than flying, but the theory examinations in step 04 cannot be booked without it — so it comes early.",
    facts: [
      { label: "Portals", value: "eGCA + Pariksha" },
      { label: "You receive", value: "DGCA Computer Number" },
      { label: "Needed for", value: "Every DGCA theory exam" },
    ],
    sections: [
      {
        heading: "1. Create your eGCA profile",
        body: [
          "eGCA is the DGCA's online portal, reached from dgca.gov.in. Register an account on the eGCA Portal.",
          "You will come back to it: in step 07 your flight logs, exam results and medical certificates are submitted on eGCA for CPL issuance.",
        ],
      },
      {
        heading: "2. Apply for your DGCA Computer Number",
        body: [
          "Apply for a DGCA Computer Number via pariksha.dgca.gov.in. This unique ID is mandatory to register for and sit all DGCA theory examinations.",
        ],
      },
      {
        heading: "3. Register on Pariksha for your exams",
        body: [
          "Pariksha is the DGCA's online registration and examination portal. It states that every Flight Crew candidate who has a Computer Number must register on it before appearing for any DGCA examination.",
          "Once your number is issued, this is where you book the papers in step 04.",
        ],
      },
    ],
    tips: [
      "Only use the official gov.in addresses listed on this page.",
      "Keep your login details and your Computer Number safe — you will need them for every DGCA exam you register for.",
    ],
    links: [
      { ...official.egca, use: "Register your eGCA account, or log in to an existing one." },
      {
        ...official.pariksha,
        use: "Apply for your DGCA Computer Number, then register for DGCA examinations.",
      },
      {
        ...official.dgca,
        use: "The regulator's own site — the eGCA login is linked from its home page.",
      },
    ],
    completePrompt:
      "Tick this once your eGCA profile is created and you have your DGCA Computer Number.",
    warning: {
      title: "Disclaimer",
      body: "Most of the time, DGCA Computer Number applications get rejected. Check every detail carefully before you submit.",
    },
    promo: {
      eyebrow: "Professional guidance from VIMAN",
      title: "Don't let your Computer Number application get rejected.",
      body: "VIMAN offers professional guidance and help with this step — from setting up your eGCA profile to applying for your DGCA Computer Number.",
      points: [
        "Professional guidance, one step at a time",
        "Help setting up your eGCA profile",
        "Help with your DGCA Computer Number application",
      ],
      action: "Contact VIMAN to get started.",
    },
  },
  {
    stepId: "medical",
    summary:
      "How aviation medicals work, and what Class 2 and Class 1 mean — step 03 of the VIMAN roadmap.",
    intro:
      "Before you can fly as a pilot, a doctor has to confirm that you are fit to. In India, aviation medicals follow DGCA standards and are carried out only by examiners the DGCA has approved. There are two you need to know: Class 2, which you get first, and Class 1, which a commercial pilot must hold.",
    facts: [
      { label: "Book first", value: "Class 2 Medical" },
      { label: "Needed for a CPL", value: "Class 1 Medical" },
      { label: "Examined by", value: "DGCA-approved examiners" },
      { label: "Approved by", value: "DGCA Medical Cell" },
    ],
    sections: [
      {
        heading: "How aviation medicals work",
        body: [
          "An aviation medical is a structured check of the things flying depends on — your eyesight, hearing, heart, lungs and general health.",
          "It is carried out by a doctor the DGCA has approved for that class of medical. The examiner records the results and your file goes to the DGCA for a decision. If you are assessed fit, you are issued a medical assessment for that class.",
          "It is not a one-time test. A medical is valid for a limited period, so pilots renew it at regular intervals for as long as they fly.",
        ],
      },
      {
        heading: "Class 2 Medical",
        body: [
          "Class 2 is the first medical on the pathway, and the one you book first.",
          "Book an appointment with a DGCA-empanelled Medical Examiner — a Class 2 doctor. Once you are cleared, your file goes to the DGCA Medical Cell for approval.",
          "Doing it early tells you whether the medical side is clear before you spend on training.",
        ],
      },
      {
        heading: "Class 1 Medical",
        body: [
          "Class 1 is the higher medical standard, and you must hold it to be issued a Commercial Pilot License (CPL).",
          "It is a more detailed examination than Class 2 and is carried out by examiners the DGCA has approved for Class 1.",
          "Your medical certificates are submitted, together with your flight logs and exam results, on eGCA for CPL issuance in step 07.",
        ],
      },
    ],
    funFact: {
      question: "Can you fly with spectacles?",
      answer:
        "Yes. Plenty of airline pilots wear glasses or contact lenses. What the medical checks is whether your eyesight meets the required standard — with or without correction. Pilots who fly with correction are expected to carry a spare pair.",
    },
    tips: [
      "Only a DGCA-approved examiner can carry out an aviation medical — confirm the doctor is approved before you book.",
      "Answer your medical declaration fully and honestly; past conditions matter.",
      "Keep copies of every medical certificate — you will need them for your CPL.",
    ],
    links: [
      { ...official.dgca, use: "The regulator's official website." },
      { ...official.egca, use: "Where your medical certificates are submitted for CPL issuance." },
    ],
    completePrompt: "Tick this once your Class 2 medical has been cleared and approved.",
    warning: {
      title: "Please note",
      body: "VIMAN does not carry out medical examinations or decide medical fitness. Only DGCA-approved examiners and the DGCA can do that.",
    },
    promo: {
      eyebrow: "Professional guidance from VIMAN",
      title: "Know what to expect before your medical.",
      body: "VIMAN guides you through the medical process — which medical to book first, how Class 2 and Class 1 fit into your journey, and what to have ready for each.",
      points: [
        "Which medical to book, and when",
        "What to prepare before your appointment",
        "Help understanding each stage of the process",
      ],
      action: "Contact VIMAN to get started.",
      service: "Medical process guidance",
    },
  },
  {
    stepId: "ground-school",
    summary:
      "What DGCA ground school covers, the five theory papers, and how to book them — step 04 of the VIMAN roadmap.",
    intro:
      "Ground school is the classroom side of becoming a pilot. You enrol in ground classes or study on your own, then clear the five core DGCA theoretical papers. Every paper needs 70% to pass.",
    facts: [
      { label: "Papers", value: "5" },
      { label: "Pass mark", value: "70% in each" },
      { label: "Typical cost", value: investment.rows[0].value },
    ],
    sections: [
      {
        heading: "What ground school is",
        body: [
          "Before and alongside the flying, a pilot needs knowledge: the rules you fly under, the weather you fly through, how to navigate, and how the aircraft works.",
          "Ground school teaches that knowledge, and the DGCA tests it through its theory examinations.",
        ],
      },
      {
        heading: "The five papers",
        points: [
          "Air Regulations — aviation laws, rules, procedures",
          "Aviation Meteorology — weather patterns, charts, forecasts",
          "Air Navigation — flight planning, calculations, radio aids",
          "Technical General — aircraft engines, systems, aerodynamics",
          "Technical Specific — systems of the specific aircraft you will train on",
        ],
      },
      {
        heading: "How to prepare",
        body: [
          "Enrol in ground classes, or self-study — the pathway allows either route.",
          "Whichever you choose, give every paper its own preparation time: each one has to reach the 70% pass mark on its own.",
        ],
      },
      {
        heading: "Booking your exams",
        body: [
          "You need your DGCA Computer Number from step 02 to register for and sit these papers.",
          "Exams are registered on Pariksha, the DGCA's online registration and examination portal.",
        ],
      },
    ],
    tips: [
      "Get your Computer Number (step 02) before you plan exam dates — you cannot register without it.",
      "The 70% pass mark applies to each paper on its own.",
    ],
    links: [
      { ...official.pariksha, use: "Register for and book your DGCA theory examinations." },
    ],
    completePrompt: "Tick this once you have passed all five DGCA papers.",
    warning: {
      title: "Please note",
      body: "No coaching or guidance can guarantee a pass. DGCA examinations are passed on your own preparation and your performance on the day.",
    },
    promo: {
      eyebrow: "Professional guidance from VIMAN",
      title: "Prepare for your DGCA exams with a plan.",
      body: "VIMAN helps you prepare for your DGCA ground examinations — planning your study across the five papers, and registering and scheduling your exams.",
      points: [
        "A study plan across all five papers",
        "Guidance on registering and scheduling your exams",
        "Support through your preparation",
      ],
      action: "Contact VIMAN to get started.",
      service: "DGCA exam preparation guidance",
    },
  },
  {
    stepId: "rtr",
    summary:
      "The RTR(A) radio telephony licence from the WPC wing — step 05 of the VIMAN roadmap.",
    intro:
      "Operating aeronautical radio equipment needs a licence of its own: the Radio Telephone Operator's Restricted (Aeronautical) licence, or RTR(A).",
    facts: [
      { label: "Licence", value: "RTR(A)" },
      { label: "Issued by", value: "WPC Wing, Department of Telecommunications" },
    ],
    sections: [
      {
        heading: "Who conducts it",
        body: [
          "The RTR(A) examination is conducted by the Wireless Planning & Coordination (WPC) wing of the Ministry of Communications.",
          "The Department of Telecommunications describes the licence as required for anyone operating radio communication equipment in aeronautical services — including pilots, air traffic controllers and aeronautical radio operators.",
        ],
      },
      {
        heading: "What the exam covers",
        points: [
          "Radio Telephony procedures",
          "Aviation terminology",
          "Practical communication",
        ],
      },
      {
        heading: "Applying",
        body: [
          "The DoT's RTR page links to its Saral Sanchar licensing portal, where applications are made and their status can be checked.",
        ],
      },
    ],
    tips: [
      "Follow the application steps on the DoT page itself — its user manual and FAQ are linked there.",
    ],
    links: [
      {
        ...official.rtr,
        use: "Official RTR(A) information, the application process, user manual and FAQ.",
      },
    ],
    completePrompt: "Tick this once you hold your RTR(A) licence.",
  },
  {
    stepId: "flight-training",
    summary:
      "The 200 flying hours required for a CPL and how they break down — step 06 of the VIMAN roadmap.",
    intro:
      "Flight training is the most crucial part of the journey. It is where you actually learn to fly, and it takes the largest share of your time and money. You enrol in a DGCA-approved Flying Training Organisation (FTO), in India or abroad, and log the 200 hours of flight time the licence requires.",
    facts: [
      { label: "Total flight time", value: "200 hours" },
      { label: "Pilot-in-Command", value: "100 hours" },
      { label: "Cross-country", value: "50 hours" },
      { label: "Instrument", value: "20 hours" },
      { label: "Night", value: "5 hours" },
      { label: "Typical cost", value: investment.rows[1].value },
    ],
    sections: [
      {
        heading: "Where you train",
        body: ["Enrol in a DGCA-approved Flying Training Organization (FTO), in India or abroad."],
      },
      {
        heading: "How the 200 hours break down",
        points: [
          "100 hours Pilot-in-Command (PIC)",
          "50 hours Cross-Country flying",
          "20 hours Instrument flying — up to 10 of them on a simulator",
          "5 hours Night flying, including takeoffs and landings",
        ],
      },
      {
        heading: "Expect some turbulence",
        visual: "turbulence",
        body: [
          "Flight training rarely runs exactly to plan. Weather cancels sorties, aircraft go in for maintenance, a check may need a second attempt, and schedules slip.",
          `The pathway's own timeline allows for this: the whole journey typically takes ${investment.duration.value}, depending on weather, flying school availability, and exam frequency.`,
          "Like turbulence in the air, these bumps are normal. What matters is being ready for them — with time, money and patience to spare.",
        ],
      },
      {
        heading: "Choosing a flying school",
        body: [
          "The FTO you choose shapes your whole training. First confirm it is DGCA-approved. Then compare what matters day to day — its aircraft, its instructors, its weather, and how long its students actually take to finish.",
        ],
      },
      {
        heading: "Cost",
        body: [
          `Flying training is the largest cost on the pathway: typically ${investment.rows[1].value} for the 200 hours.`,
        ],
      },
    ],
    tips: [
      "Confirm the FTO is DGCA-approved before you enrol.",
      "Up to 10 of your 20 instrument hours can be flown on a simulator.",
    ],
    links: [{ ...official.dgca, use: "The regulator's official website." }],
    completePrompt: "Tick this once you have logged all 200 hours.",
    promo: {
      eyebrow: "Professional guidance from VIMAN",
      title: "Choose the right flying school.",
      body: "Your flying school is the biggest decision — and the biggest cost — on the pathway. VIMAN guides you in choosing a suitable DGCA-approved flight school for your goals and budget.",
      points: [
        "Shortlisting DGCA-approved flight schools",
        "Comparing training in India and abroad",
        "Planning for time, cost and delays",
      ],
      action: "Contact VIMAN to get started.",
      service: "Flight school guidance",
      turbulence: true,
    },
  },
  {
    stepId: "cpl",
    summary: "CPL skill tests and licence issuance on eGCA — step 07 of the VIMAN roadmap.",
    intro:
      "With your hours flown, you prove your flying to an examiner and then apply for the licence itself.",
    facts: [
      { label: "Tested by", value: "Designated Examiner" },
      { label: "Apply on", value: "eGCA" },
      { label: "Minimum age", value: "18 years" },
    ],
    sections: [
      {
        heading: "Skill tests",
        body: ["Complete your skill tests with a Designated Examiner:"],
        points: ["General Flying Test", "Day/Night Cross Country", "Instrument Rating check"],
      },
      {
        heading: "Applying for your CPL",
        body: [
          "Submit your flight logs, exam results and medical certificates on eGCA for official Commercial Pilot License (CPL) issuance.",
        ],
      },
      {
        heading: "Age",
        body: ["You must be at least 18 years old to receive a CPL."],
      },
    ],
    tips: [
      "Gather your flight logs, DGCA exam results and medical certificates before you start the eGCA application — it needs all three.",
    ],
    links: [{ ...official.egca, use: "Submit your documents and apply for CPL issuance." }],
    completePrompt: "Tick this once your CPL has been issued.",
  },
  {
    stepId: "type-rating",
    summary:
      "Type rating on the A320 or B737 family and airline selection — step 08 of the VIMAN roadmap.",
    intro:
      "The CPL makes you a commercial pilot. This last step trains you on a specific airliner and takes you through an airline's selection to a Junior First Officer seat.",
    facts: [
      { label: "Aircraft", value: "A320 or B737 family" },
      { label: "Typical cost", value: investment.rows[2].value },
      { label: "Whole pathway", value: investment.total.value },
    ],
    sections: [
      {
        heading: "Type rating",
        body: [
          "Complete a Type Rating course — for example on the Airbus A320 or Boeing 737 family — at an ATO (Approved Training Organization).",
          "The course involves ground school and full-flight simulator (FFS) sessions.",
        ],
      },
      {
        heading: "Airline induction",
        body: ["Pass the airline's selection rounds to join as a Junior First Officer:"],
        points: ["Written exams", "Simulator assessment", "HR interview"],
      },
      {
        heading: "Cadet or traditional",
        body: [
          "On a cadet programme, everything from DGCA ground school, 200 hours of flight training, eGCA processing, and the Type Rating is integrated into one package.",
          "On the traditional pathway you receive your CPL, then apply for airline cadet/First Officer vacancies or fund your own Type Rating.",
        ],
      },
    ],
    tips: [
      "Compare the cadet and traditional routes before you commit — they differ in how the type rating is reached and paid for.",
    ],
    links: [
      {
        label: "Cadet vs Traditional",
        url: "/#compare",
        host: "On this site",
        use: "Compare the two routes to the flight deck.",
        internal: true,
      },
    ],
    completePrompt: "Tick this once you have joined an airline as a Junior First Officer.",
  },
];

export const guideSlugs = () => stepGuides.map((guide) => stepSlugs[guide.stepId]);

export const guideBySlug = (slug: string) =>
  stepGuides.find((guide) => stepSlugs[guide.stepId] === slug);
