export type ResourceType = "PDF" | "Guide" | "Template" | "Video";
export type CategoryId =
  | "hub-guide"
  | "learn-sp"
  | "setup"
  | "outreach"
  | "referrals"
  | "clients"
  | "funding"
  | "reporting"
  | "events";

export interface Resource {
  id: number;
  title: string;
  description: string;
  category: CategoryId;
  type: ResourceType;
  date: string;
  subcategory: string;
  popular?: boolean;
  downloadUrl?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
}

export const CATEGORIES: Category[] = [
  { id: "hub-guide", label: "Using the Knowledge Hub" },
  { id: "learn-sp", label: "About Social Prescribing" },
  { id: "setup", label: "Set Up Your L2W Program" },
  { id: "outreach", label: "Outreach & Promotion" },
  { id: "referrals", label: "Receiving Referrals" },
  { id: "clients", label: "Supporting Clients" },
  { id: "funding", label: "Funding & Microgrants" },
  { id: "reporting", label: "Reporting & Evaluation" },
  { id: "events", label: "Upcoming Events" },
];

// Sidebar tree configuration for 3-level nesting
export interface SidebarSubcatNode {
  name: string;
  isContainer?: boolean; // true = no resources, just groups children
  children?: string[];   // child names shown at level 3 in sidebar
}

// Categories that show subcategory tree in sidebar (outreach + events are leaf nodes)
export const SIDEBAR_TREE_CATS = new Set<CategoryId>(["hub-guide", "learn-sp", "setup", "referrals", "clients", "funding", "reporting"]);

// Ordered subcategory tree for each category (used for sidebar + category page ordering)
export const CATEGORY_SUBCATS: Record<CategoryId, SidebarSubcatNode[]> = {
  "hub-guide": [
    { name: "Playbook & Video Guide" },
    { name: "AI" },
  ],
  "learn-sp": [
    { name: "Understanding SP" },
    { name: "L2W Overview & Impact" },
    { name: "Public Research" },
  ],
  "setup": [
    { name: "Links2Wellbeing SP Pathway" },
    { name: "Guide to Getting Started" },
    { name: "Tools & Resources Package" },
    { name: "Volunteers" },
  ],
  "outreach": [
    { name: "Healthcare Providers" },
    { name: "Community Organizations" },
  ],
  "referrals": [
    { name: "Referral forms" },
    { name: "Social prescription pad" },
  ],
  "clients": [
    { name: "Intake & Participation Plan" },
    { name: "Client Management" },
    { name: "Feedback Survey" },
    { name: "Client Trackers" },
  ],
  "funding": [
    { name: "Financial Report" },
    { name: "Microgrant Spending" },
    { name: "Subsidies Guidance" },
    { name: "Funding Sustainability" },
    { name: "Microgrants Updates" },
  ],
  "reporting": [
    { name: "Financial Report" },
    { name: "Client Reporting" },
  ],
  "events": [
    { name: "Workshops & Cafes" },
    { name: "Check-in meetings" },
  ],
};

export const RESOURCES: Resource[] = [
  // ── HUB GUIDE ───────────────────────────────────────────────────────────────

  // Playbook — Written guidance & video
  { id: 1, title: "Platform walkthrough guide", description: "Introduction and guided walkthrough for new users", category: "hub-guide", type: "Guide", date: "2026-03-15", subcategory: "Playbook & Video Guide", popular: true },
  { id: 100, title: "Getting started video tutorial", description: "Video walkthrough of the L2W Knowledge Hub features", category: "hub-guide", type: "Video", date: "2026-03-10", subcategory: "Playbook & Video Guide" },

  // AI
  { id: 101, title: "Practice with AI Scenarios", description: "Rehearse real-world social prescribing situations", category: "hub-guide", type: "Guide", date: "2026-03-20", subcategory: "AI" },
  { id: 102, title: "AI-assisted search guide", description: "How to use AI tools within the Knowledge Hub", category: "hub-guide", type: "Guide", date: "2026-03-18", subcategory: "AI" },

  // ── LEARN ABOUT SOCIAL PRESCRIBING ──────────────────────────────────────────

  // Understanding social prescription
  { id: 103, title: "What is social prescribing?", description: "Overview of the social prescribing model and its benefits", category: "learn-sp", type: "Guide", date: "2026-02-01", subcategory: "Understanding SP", popular: true },
  { id: 4, title: "Social Prescribing Pathway Flowchart", description: "Visual process flow of the L2W social prescribing pathway", category: "learn-sp", type: "PDF", date: "2026-02-20", subcategory: "Understanding SP" },
  { id: 104, title: "General Social Prescribing Pathways in Canada", description: "CISP infographic on social prescribing across Canada", category: "learn-sp", type: "PDF", date: "2025-08-01", subcategory: "Understanding SP" },

  // Links2Wellbeing Overview & Impact Reports
  { id: 63, title: "L2W Impact Report Year 1", description: "Project report on L2W impacts from the first year", category: "learn-sp", type: "PDF", date: "2025-04-01", subcategory: "L2W Overview & Impact" },
  { id: 65, title: "L2W Data on Impact Infographic", description: "Visual summary of Phase 2 program outcomes", category: "learn-sp", type: "PDF", date: "2025-10-01", subcategory: "L2W Overview & Impact" },
  { id: 64, title: "L2W Video — Social Prescribing: A Pathway to Health and Wellness", description: "L2W video on the impact of social prescribing", category: "learn-sp", type: "Video", date: "2025-03-15", subcategory: "L2W Overview & Impact" },

  // Public Research and Resources
  { id: 67, title: "Evidence for social prescribing", description: "Research and evidence supporting the social prescribing model", category: "learn-sp", type: "PDF", date: "2025-06-01", subcategory: "Public Research" },
  { id: 105, title: "Fact sheets on social prescribing", description: "Summary fact sheets for quick reference", category: "learn-sp", type: "PDF", date: "2025-09-01", subcategory: "Public Research" },
  { id: 68, title: "Report — Social Prescribing in Canada 2025 (CISP)", description: "2025 national report on social prescribing", category: "learn-sp", type: "PDF", date: "2025-05-01", subcategory: "Public Research" },

  // ── SET UP YOUR L2W PROGRAM ─────────────────────────────────────────────────

  // Links2Wellbeing SP Pathway
  { id: 106, title: "Process Flow Chart — L2W Social Prescribing Pathway", description: "Step-by-step visual of the L2W referral and participation pathway", category: "setup", type: "PDF", date: "2026-02-20", subcategory: "Links2Wellbeing SP Pathway" },
  { id: 5, title: "Full Links2Wellbeing Phase 2 Tools and Resources Package 2025", description: "Full digital toolkit with all forms, templates, and guidance for 2025", category: "setup", type: "PDF", date: "2025-11-01", subcategory: "Links2Wellbeing SP Pathway", popular: true },

  // Guide to Getting Started
  { id: 3, title: "Guide to Getting Started", description: "Steps to setting up Links2Wellbeing at your centre", category: "setup", type: "Guide", date: "2025-12-01", subcategory: "Guide to Getting Started", popular: true },

  // Tools & Resources Package
  { id: 107, title: "Full L2W Phase 2 Tools and Resources Package 2025 (Digital)", description: "Complete digital package with all L2W forms and resources", category: "setup", type: "PDF", date: "2025-11-01", subcategory: "Tools & Resources Package" },
  { id: 108, title: "Accessing the L2W Google Drive", description: "How to access and navigate the shared L2W Google Drive", category: "setup", type: "Guide", date: "2026-01-15", subcategory: "Tools & Resources Package" },

  // Volunteers
  { id: 8, title: "Links2Wellbeing Roles and Responsibilities", description: "Overview of all L2W roles at SALCs — DCC, VLA, Peer Mentor", category: "setup", type: "PDF", date: "2025-11-01", subcategory: "Volunteers" },
  { id: 9, title: "Volunteer Role Postings — VLA & Peer Mentor", description: "Sample postings for recruiting volunteers", category: "setup", type: "PDF", date: "2025-11-01", subcategory: "Volunteers" },
  { id: 10, title: "Volunteer Confidentiality Agreement", description: "Pledge and agreement form for volunteers", category: "setup", type: "PDF", date: "2025-11-01", subcategory: "Volunteers" },
  { id: 109, title: "Recruiting volunteers guide", description: "Strategies for finding and recruiting volunteers for L2W", category: "setup", type: "Guide", date: "2026-01-20", subcategory: "Volunteers" },
  { id: 110, title: "Onboarding volunteers guide", description: "Step-by-step guide for onboarding new L2W volunteers", category: "setup", type: "Guide", date: "2026-02-01", subcategory: "Volunteers" },

  // ── OUTREACH ────────────────────────────────────────────────────────────────

  // Healthcare provider outreach
  { id: 15, title: "Outreach Cover Letter Template", description: "Customizable letter for healthcare providers", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Healthcare Providers", popular: true },
  { id: 16, title: "Outreach Postcards for HCPs", description: "Postcards for community partners", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Healthcare Providers" },
  { id: 18, title: "Promotional Poster for PCPs", description: "Poster introducing social prescribing", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Healthcare Providers" },
  { id: 19, title: "General Flyer for PCPs", description: "Informational flyer about L2W", category: "outreach", type: "PDF", date: "2025-11-01", subcategory: "Healthcare Providers" },
  { id: 21, title: "Identifying Patients With Unmet Social Needs", description: "Tools for HCPs to identify suitable referrals", category: "outreach", type: "PDF", date: "2025-06-15", subcategory: "Healthcare Providers" },
  { id: 22, title: "Strategic Healthcare Outreach Advice", description: "Advice for new L2W partners on building referral networks", category: "outreach", type: "Guide", date: "2025-05-20", subcategory: "Healthcare Providers" },
  { id: 20, title: "Connecting With Your Community Pharmacist", description: "Tips for building referral relationships with pharmacists", category: "outreach", type: "Guide", date: "2025-08-10", subcategory: "Healthcare Providers" },
  { id: 12, title: "Canva 101 for Outreach Materials", description: "Check-in meeting recording on designing outreach materials", category: "outreach", type: "Video", date: "2025-09-15", subcategory: "Healthcare Providers" },

  // Community organization outreach
  { id: 17, title: "Outreach Postcards for Older Adults", description: "Postcards designed for older adults", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Community Organizations" },
  { id: 23, title: "Customizable Canva Templates", description: "Editable design templates for community outreach", category: "outreach", type: "Template", date: "2026-01-10", subcategory: "Community Organizations" },
  { id: 24, title: "Expanding Networks: Partnership Cafe", description: "Conversation Cafe on developing and nurturing partnerships", category: "outreach", type: "Video", date: "2025-11-20", subcategory: "Community Organizations" },
  { id: 86, title: "Social Tea Gathering Guide", description: "Ideas for hosting community engagement events", category: "outreach", type: "Guide", date: "2026-02-05", subcategory: "Community Organizations" },

  // ── REFERRALS ───────────────────────────────────────────────────────────────

  // Referral forms
  { id: 25, title: "Client Referral Form", description: "Standard form used by HCPs to refer older adults", category: "referrals", type: "PDF", date: "2025-11-01", subcategory: "Referral forms", popular: true },
  { id: 27, title: "What to Do When a Referral Arrives", description: "Step-by-step workflow for processing new referrals", category: "referrals", type: "Guide", date: "2026-03-01", subcategory: "Referral forms", popular: true },
  { id: 30, title: "How to Assign Client Codes", description: "Creating unique client codes for privacy and tracking", category: "referrals", type: "Guide", date: "2026-01-15", subcategory: "Referral forms" },
  { id: 29, title: "Personal Contact Information Form", description: "Form collected at first contact", category: "referrals", type: "PDF", date: "2025-11-01", subcategory: "Referral forms" },
  { id: 28, title: "Sample Excel Tracking Sheet", description: "Pre-built spreadsheet for tracking referrals", category: "referrals", type: "Template", date: "2025-11-01", subcategory: "Referral forms" },

  // Social prescription pad
  { id: 26, title: "Social Prescription Pads — both versions", description: "Customizable prescription pads for HCPs", category: "referrals", type: "Template", date: "2025-11-01", subcategory: "Social prescription pad" },

  // ── CLIENTS ─────────────────────────────────────────────────────────────────

  // Client intake and co-creation of participation plan
  { id: 31, title: "Intake Checklist", description: "Complete checklist for the participant intake process", category: "clients", type: "PDF", date: "2026-02-28", subcategory: "Intake & Participation Plan", popular: true },
  { id: 36, title: "Outreach Call Guidance", description: "Step-by-step script and tips for the first outreach call", category: "clients", type: "Guide", date: "2026-03-05", subcategory: "Intake & Participation Plan", popular: true },
  { id: 37, title: "Common Barriers & How to Address Them", description: "Overcoming barriers like transportation, cost, hesitancy", category: "clients", type: "Guide", date: "2026-01-20", subcategory: "Intake & Participation Plan" },
  { id: 38, title: "Co-Creating a Participation Plan", description: "Collaboratively building an activity plan with the older adult", category: "clients", type: "Guide", date: "2026-02-10", subcategory: "Intake & Participation Plan" },
  { id: 35, title: "Leisure Interests: Guiding Questions", description: "Prompts for exploring participant interests", category: "clients", type: "PDF", date: "2025-11-01", subcategory: "Intake & Participation Plan" },
  { id: 32, title: "Client Consent Form", description: "Required consent form for intake and follow-ups", category: "clients", type: "PDF", date: "2025-11-01", subcategory: "Intake & Participation Plan" },
  { id: 33, title: "Suggested Consent Script", description: "Word-for-word script for explaining consent", category: "clients", type: "Guide", date: "2025-11-01", subcategory: "Intake & Participation Plan" },
  { id: 34, title: "Client Information Form — Intake Section", description: "Master tracking form from intake through 12 months", category: "clients", type: "PDF", date: "2025-11-01", subcategory: "Intake & Participation Plan", popular: true },

  // Client management and follow up
  { id: 39, title: "First Visit Preparation Guide", description: "How to prepare for and conduct successful first visits", category: "clients", type: "Guide", date: "2026-03-01", subcategory: "Client Management", popular: true },
  { id: 40, title: "First Visit Checklist", description: "What to have ready — schedules, forms, tour plan", category: "clients", type: "PDF", date: "2026-02-15", subcategory: "Client Management" },
  { id: 41, title: "How to Conduct a First Visit", description: "Workflow guide covering welcome, tour, registration, and next steps", category: "clients", type: "Guide", date: "2026-03-01", subcategory: "Client Management" },
  { id: 42, title: "Creative First Visit Strategies", description: "Shared practices — welcome cards, peer mentors, walking into first class", category: "clients", type: "Guide", date: "2026-02-20", subcategory: "Client Management" },
  { id: 43, title: "Role of Volunteer Peer Mentors", description: "How peer mentors support new participants during first visits", category: "clients", type: "Guide", date: "2025-11-01", subcategory: "Client Management" },
  { id: 47, title: "3-Month Informal Check-In Guide", description: "How to conduct the recommended 3-month check-in", category: "clients", type: "Guide", date: "2026-02-01", subcategory: "Client Management" },
  { id: 48, title: "6 and 12-Month Formal Follow-Up Guide", description: "Workflow for required follow-up conversations", category: "clients", type: "Guide", date: "2026-02-01", subcategory: "Client Management", popular: true },
  { id: 49, title: "When and How to Discontinue a Participant", description: "Guidance on completing the discontinued section", category: "clients", type: "Guide", date: "2026-01-15", subcategory: "Client Management" },
  { id: 50, title: "Client Stories Report Template", description: "Capturing impact stories from long-term participants", category: "clients", type: "Template", date: "2025-11-01", subcategory: "Client Management" },
  { id: 80, title: "Transitioning Participants to General Membership", description: "Moving participants off L2W subsidy after 12 months", category: "clients", type: "Guide", date: "2026-03-01", subcategory: "Client Management" },

  // Feedback survey
  { id: 76, title: "Client Information Form — Follow-Up Sections", description: "Sections of the Client Information Form for follow-ups", category: "clients", type: "PDF", date: "2025-11-01", subcategory: "Feedback Survey" },
  { id: 77, title: "Consent Review Script for Follow-Ups", description: "Reviewing consent before each follow-up", category: "clients", type: "Guide", date: "2026-01-15", subcategory: "Feedback Survey" },

  // Client information trackers
  { id: 69, title: "How to Track Attendance Using Sign-In Lists", description: "Working with attendance lists at your centre", category: "clients", type: "Guide", date: "2026-03-10", subcategory: "Client Trackers" },
  { id: 70, title: "Working with ActiveNet or My Senior Centre", description: "Using attendance platforms for tracking", category: "clients", type: "Guide", date: "2026-02-20", subcategory: "Client Trackers" },
  { id: 45, title: "Participation Notes Guide", description: "How to record and organize participation notes effectively", category: "clients", type: "Guide", date: "2026-02-05", subcategory: "Client Trackers" },
  { id: 71, title: "Noticing When Someone Has Disengaged", description: "Signs to watch for and what to do", category: "clients", type: "Guide", date: "2026-03-05", subcategory: "Client Trackers" },
  { id: 73, title: "Re-engagement Strategies from Other SALCs", description: "Shared practices on bringing participants back", category: "clients", type: "Guide", date: "2026-03-15", subcategory: "Client Trackers" },

  // ── FUNDING ─────────────────────────────────────────────────────────────────

  // Financial Report
  { id: 55, title: "Year-End Financial Report Template", description: "Template for reporting subsidy and admin funding", category: "funding", type: "Template", date: "2025-11-01", subcategory: "Financial Report", downloadUrl: "/docs/financial-report-2026.pdf" },
  { id: 56, title: "How to Complete the Financial Report", description: "Step-by-step guide for the year-end financial report", category: "funding", type: "Guide", date: "2026-02-20", subcategory: "Financial Report" },

  // L2W Microgrant Spending Guidelines
  { id: 59, title: "Micro-Grant Funding Guidelines", description: "L2W use of funding guidelines — what the subsidy can cover", category: "funding", type: "PDF", date: "2025-11-01", subcategory: "Microgrant Spending", popular: true },
  { id: 111, title: "What the subsidy can cover", description: "Detailed breakdown of eligible subsidy expenses", category: "funding", type: "Guide", date: "2026-01-10", subcategory: "Microgrant Spending" },

  // Subsidies Guidance
  { id: 14, title: "Subsidies Guidance (training recording)", description: "Check-in meeting recording on managing subsidies", category: "funding", type: "Video", date: "2025-10-05", subcategory: "Subsidies Guidance" },
  { id: 60, title: "Budget Templates", description: "Templates for tracking subsidy spending throughout the year", category: "funding", type: "Template", date: "2025-12-01", subcategory: "Subsidies Guidance" },

  // Funding sustainability
  { id: 62, title: "Using L2W Data for Grant Applications", description: "Leveraging tracking data to strengthen funding applications", category: "funding", type: "Guide", date: "2026-02-15", subcategory: "Funding Sustainability" },
  { id: 61, title: "Partnership Agreement Templates", description: "Sample agreements for community org partnerships", category: "funding", type: "Template", date: "2026-01-10", subcategory: "Funding Sustainability" },

  // Microgrants updates
  { id: 83, title: "Microgrant and Funding Guidance (latest updates)", description: "How to use and manage L2W micro-grant funding", category: "funding", type: "Guide", date: "2025-11-15", subcategory: "Microgrants Updates" },

  // ── REPORTING ───────────────────────────────────────────────────────────────

  // Financial Report
  { id: 112, title: "Year-End Financial Report Template", description: "Template for reporting subsidy and admin funding", category: "reporting", type: "Template", date: "2025-11-01", subcategory: "Financial Report", downloadUrl: "/docs/financial-report-2026.pdf" },
  { id: 113, title: "How to Complete the Financial Report", description: "Step-by-step guide for the year-end financial report", category: "reporting", type: "Guide", date: "2026-02-20", subcategory: "Financial Report" },

  // Client information form — reporting
  { id: 52, title: "Reporting Requirements Overview", description: "What reports are due, when, and what data is needed", category: "reporting", type: "Guide", date: "2026-02-01", subcategory: "Client Reporting", popular: true },
  { id: 58, title: "What Has Changed This Year", description: "Annual update on reporting field changes for 2025-2026", category: "reporting", type: "Guide", date: "2026-02-01", subcategory: "Client Reporting" },
  { id: 53, title: "Common Tracking Tool", description: "Annual tracking tool for referral data and outcomes", category: "reporting", type: "Template", date: "2025-11-01", subcategory: "Client Reporting", popular: true },
  { id: 54, title: "Common Tracking Tool Field Explainer", description: "Field-by-field guide explaining each section", category: "reporting", type: "Guide", date: "2026-02-15", subcategory: "Client Reporting" },
  { id: 57, title: "SurveyMonkey Submission Guide", description: "How to enter Client Information Form data into SurveyMonkey", category: "reporting", type: "Guide", date: "2026-03-01", subcategory: "Client Reporting" },

  // ── EVENTS ──────────────────────────────────────────────────────────────────

  // Workshops & Cafes
  { id: 114, title: "Supporting hesitant participants", description: "Workshop on March 6 — strategies for engaging hesitant older adults", category: "events", type: "Video", date: "2026-03-06", subcategory: "Workshops & Cafes" },
  { id: 115, title: "Reporting best practices", description: "Workshop on February 28 — tips for accurate and timely reporting", category: "events", type: "Video", date: "2026-02-28", subcategory: "Workshops & Cafes" },
  { id: 116, title: "Expanding referral networks", description: "Workshop on February 14 — building new referral partnerships", category: "events", type: "Video", date: "2026-02-14", subcategory: "Workshops & Cafes" },

  // Check-in meetings
  { id: 117, title: "Next OACAO check-in meeting", description: "Upcoming OACAO check-in meeting — date to be confirmed", category: "events", type: "Guide", date: "2026-04-01", subcategory: "Check-in meetings" },
];

export const DEADLINES = [
  { date: "Mar 31", label: "Q1 reporting due", urgent: true },
  { date: "Apr 15", label: "Common Tracking Tool due", urgent: true },
  { date: "Apr 15", label: "Financial Report due", urgent: false },
  { date: "Apr 30", label: "Return unspent funds", urgent: false },
];

export const WORKSHOPS = [
  { title: "Trauma-Informed Practice", date: "Apr 02", month: "APR", day: "02", time: "10:00 AM", location: "Teams Link" },
  { title: "Supporting Hesitant Participants", date: "Apr 16", month: "APR", day: "16", time: "1:00 PM", location: "Teams Link" },
  { title: "Reporting Best Practices", date: "May 07", month: "MAY", day: "07", time: "11:00 AM", location: "Teams Link" },
];

export const FAQS = [
  { q: "What is social prescribing?", a: "Social prescribing is a means for healthcare providers to use a formalized referral pathway to connect patients to non-clinical community programs and services to improve their social, mental, and physical wellbeing." },
  { q: "What is Links2Wellbeing?", a: "L2W is a partnership between the Alliance for Healthier Communities and OACAO supporting older adults facing social isolation by connecting them to programs at Senior Active Living Centres." },
  { q: "What is a Designated Centre Contact (DCC)?", a: "The primary staff person at a SALC responsible for managing the L2W program including referrals, outreach, tracking, and reporting." },
  { q: "What follow-ups are required?", a: "A recommended 3-month informal check-in, and required formal follow-ups at 6 and 12 months using the Client Information Form." },
  { q: "How do I submit my annual report?", a: "Complete the Common Tracking Tool and Financial Report, then submit through SurveyMonkey. All reports due April 15." },
  { q: "What if a participant stops attending?", a: "Call to check in. If unable to reach them or their situation changed, complete the discontinued section of the Client Information Form." },
  { q: "How do I handle carry-forward funds?", a: "Unspent funds reviewed by OACAO after year-end reports. Funds not carried forward returned by April 30." },
];

export interface L2WEvent {
  id: number;
  title: string;
  description: string;
  date: string;        // ISO date e.g. "2026-04-02"
  time: string;        // e.g. "10:00 AM – 11:30 AM"
  location: string;    // e.g. "Microsoft Teams" or venue name
  type: "workshop" | "cafe" | "check-in" | "webinar";
  tags: string[];
  registrationUrl?: string;
  isPast?: boolean;
}

export const EVENTS: L2WEvent[] = [
  {
    id: 1, title: "Trauma-Informed Practice", description: "Learn person-centred approaches for working with older adults who have experienced trauma. Includes practical exercises and group discussion.",
    date: "2026-04-02", time: "10:00 AM – 11:30 AM", location: "Microsoft Teams", type: "workshop", tags: ["Training", "Client Support"],
  },
  {
    id: 2, title: "Supporting Hesitant Participants", description: "Strategies for engaging older adults who are reluctant to join programs. Share experiences and learn from successful SALCs.",
    date: "2026-04-16", time: "1:00 PM – 2:30 PM", location: "Microsoft Teams", type: "workshop", tags: ["Engagement", "Best Practices"],
  },
  {
    id: 3, title: "Reporting Best Practices", description: "Walk-through of the Common Tracking Tool and Financial Report. Bring your questions — live Q&A included.",
    date: "2026-05-07", time: "11:00 AM – 12:00 PM", location: "Microsoft Teams", type: "workshop", tags: ["Reporting", "Tracking"],
  },
  {
    id: 4, title: "Partnership Cafe: Expanding Networks", description: "Open discussion on building referral partnerships with healthcare providers, pharmacies, and community organizations.",
    date: "2026-04-23", time: "2:00 PM – 3:00 PM", location: "Microsoft Teams", type: "cafe", tags: ["Outreach", "Networking"],
  },
  {
    id: 5, title: "OACAO Quarterly Check-In", description: "Regular check-in meeting with OACAO coordinators. Updates on funding, timelines, and shared learnings from across SALCs.",
    date: "2026-04-10", time: "10:00 AM – 11:00 AM", location: "Microsoft Teams", type: "check-in", tags: ["Administration"],
  },
  {
    id: 6, title: "Social Prescribing 101 Webinar", description: "Introduction to social prescribing for new DCCs, VLAs, and volunteers. Covers the L2W pathway from referral to follow-up.",
    date: "2026-05-14", time: "1:00 PM – 2:00 PM", location: "Microsoft Teams", type: "webinar", tags: ["Training", "Onboarding"],
  },
  {
    id: 7, title: "Subsidies & Microgrant Q&A", description: "Open session to ask questions about microgrant spending, subsidies, and year-end financial reporting.",
    date: "2026-05-21", time: "11:00 AM – 12:00 PM", location: "Microsoft Teams", type: "workshop", tags: ["Funding", "Financial"],
  },
  {
    id: 8, title: "Reporting best practices", description: "Workshop covering tips for accurate and timely reporting.", date: "2026-02-28", time: "11:00 AM – 12:00 PM", location: "Microsoft Teams", type: "workshop", tags: ["Reporting"], isPast: true,
  },
  {
    id: 9, title: "Expanding referral networks", description: "Building new referral partnerships with healthcare providers.", date: "2026-02-14", time: "2:00 PM – 3:00 PM", location: "Microsoft Teams", type: "workshop", tags: ["Outreach"], isPast: true,
  },
];

export const RECENT_IDS = [5, 54, 40, 31];

// ─── Demo content for the "Guide to Getting Started" content page ──────────
export interface ResourceContent {
  intro?: string;
  sectionTitle?: string;
  sections: { heading: string; body: string; bullets?: string[]; video?: { label: string; duration?: string } }[];
  callout?: string;
  closing?: string;
  relatedIds: number[];
}

export const RESOURCE_CONTENT: Record<number, ResourceContent> = {
  3: {
    intro: "The tools and resources contained in this package have been created for use by participating centres. This package includes all the forms and information that will help you be successful in the project.\n\nAll forms and resources will also be sent as individual digital documents to participating centres.",
    sectionTitle: "Steps to Setting up Links2Wellbeing at your centre:",
    sections: [
      {
        heading: "Orientation Video",
        body: "Watch this short orientation video to get a complete overview of how Links2Wellbeing works at your centre. It covers the referral process, key roles, getting set up, and what to expect in your first few weeks. We recommend watching this before reading through the steps below.",
        video: { label: "Watch: L2W Centre Orientation", duration: "6 min" },
      },
      {
        heading: "1. Select a Designated Centre Contact",
        body: "Select a Designated Centre Contact (DCC) to implement the major aspects of Links2Wellbeing at your centre. Review the opportunities for support and education through the OACAO.",
      },
      {
        heading: "2. Review the Tools and Resources",
        body: "Review the Tools and Resources package in full to understand forms and process:",
        bullets: [
          "Customize your referral form",
          "Have customized prescription pads printed through the OACAO",
          "Familiarize yourself with accessing the L2W Google Drive",
        ],
      },
      {
        heading: "3. Confidentiality and Privacy",
        body: "Participating centres will want to ensure the confidentiality and privacy of clients' personal information:",
        bullets: [
          "Provide an independent email for the sole purpose of the social prescribing project with only designated people having password-protected access",
          "Ensure that your fax machine (if available) is monitored by a trained DCC and/or VLA",
          "Ensure that all social prescriptions are kept in a secure, locked filing cabinet",
          "VLAs to sign a pledge and confidentiality agreement",
        ],
      },
      {
        heading: "4. Advertise for and Train Volunteers",
        body: "Recruit and train Volunteer Link Ambassadors (VLAs) and Volunteer Peer Mentors to support the program.",
      },
      {
        heading: "5. Begin Building a Network of Health Care Partners",
        body: "Your network can start small. 1\u20132 strong health care connections are often all you need to get started. You can expand as you go. Volunteers are a great support in this area.",
      },
      {
        heading: "6. Receive Your First Referral",
        body: "Follow the steps outlined in the Referral Process guide when your first referral arrives.",
      },
    ],
    callout: "Note: all page, section and appendix references are related to the full Tools and Resource document found in the Links2Wellbeing Google Drive.",
    relatedIds: [8, 5, 108],
  },

  // ── Roles & Responsibilities (id: 8) ──────────────────────────────────────
  8: {
    intro: "Links2Wellbeing works through a small but important support structure that helps older adults move from referral to participation in community programs. Each role supports a different part of that journey. Together, the Designated Centre Contact, Volunteer Link Ambassador, and Volunteer Peer Mentor help make the experience organized, welcoming, and safe for participants.",
    sections: [
      {
        heading: "Designated Centre Contact (DCC)",
        body: "The Designated Centre Contact leads the Links2Wellbeing process at the centre. This person helps coordinate implementation, supports project administration, and makes sure the referral and follow up process runs smoothly. The DCC also plays a key role in building relationships with healthcare providers and ensuring project requirements are completed properly.",
      },
      {
        heading: "Key responsibilities — DCC",
        body: "",
        bullets: [
          "Promote Links2Wellbeing in the community, especially with primary healthcare providers and other health professionals",
          "Ensure Volunteer Link Ambassadors are trained and have signed the confidentiality agreement",
          "Receive referrals from healthcare providers, usually by email or fax",
          "Confirm that initial contact has been made with the referred client",
          "Ensure project tracking and reporting are completed",
          "Support submission of required information through the project\u2019s reporting tools",
          "Attend optional check in meetings, training sessions, and Conversation Caf\u00e9s as needed",
        ],
      },
      {
        heading: "Why the DCC role matters",
        body: "The DCC helps hold the program together at the centre level. This role ensures that referrals are not only received, but also acted on, tracked, and followed through in a consistent and responsible way.",
      },
      {
        heading: "Volunteer Link Ambassador (VLA)",
        body: "The Volunteer Link Ambassador supports the intake and onboarding of new Links2Wellbeing participants. This role works more directly with referred older adults and helps connect them to centre programs and services that match their needs, interests, and comfort level.",
      },
      {
        heading: "Key responsibilities — VLA",
        body: "",
        bullets: [
          "Support the Designated Centre Contact with intake for newly referred participants",
          "Contact referred clients",
          "Complete centre tours and intake forms",
          "Work with clients to co-create a participation plan that suits their individual needs and interests",
          "Complete follow up surveys and support data entry",
          "Handle client personal information securely",
          "Assist with reporting and referral tracking when needed",
        ],
      },
      {
        heading: "Why the VLA role matters",
        body: "The VLA helps turn a referral into a real connection. This role supports older adults at an important stage, when they are first exploring what the centre offers and deciding how they would like to participate.",
      },
      {
        heading: "Volunteer Peer Mentor",
        body: "The Volunteer Peer Mentor supports Links2Wellbeing participants during their first experiences at the centre. This role is different from the VLA role. It does not include intake, survey, or reporting responsibilities. Instead, it focuses on helping new participants feel welcome, comfortable, and included.",
      },
      {
        heading: "Key responsibilities — Peer Mentor",
        body: "",
        bullets: [
          "Support referred clients during their first visits to the centre",
          "Offer introductory tours of the centre",
          "Share information about centre programs and participation",
          "Introduce new members to instructors and peers",
          "Attend a class or two with a new member so they feel more comfortable and welcome",
        ],
      },
      {
        heading: "Why the Peer Mentor role matters",
        body: "Trying something new can feel overwhelming, especially for older adults who may already be experiencing loneliness or hesitation. The Peer Mentor helps create a friendlier and more supportive first experience, making it easier for participants to build confidence and a sense of belonging.",
      },
    ],
    closing: "Together, these roles help create a social prescribing experience that is supportive, well coordinated, and welcoming from the first referral to ongoing participation.",
    relatedIds: [9, 10, 3],
  },

  // ── Volunteer Role Postings (id: 9) ───────────────────────────────────────
  9: {
    intro: "Links2Wellbeing offers volunteer opportunities for people who want to support older adults through connection, participation, and community. Volunteers play an important role in helping referred participants feel informed, welcomed, and supported as they begin engaging with centre programs and services. The two main volunteer roles are Volunteer Link Ambassador and Volunteer Peer Mentor.",
    sections: [
      {
        heading: "Volunteer Link Ambassador (VLA) — Role overview",
        body: "Volunteer Link Ambassadors support older adults who have been referred through the Links2Wellbeing program. They help guide participants through intake and onboarding, understand each person\u2019s interests and needs, and support their connection to suitable centre programs and services.",
      },
      {
        heading: "What you may do — VLA",
        body: "",
        bullets: [
          "Meet with the centre designate to understand the referred client and their interests",
          "Meet with potential clients online, by phone, or in person",
          "Complete the client intake form",
          "Explore the client\u2019s areas of interest",
          "Help match participants to relevant centre programs and services",
          "Follow up with participants over time",
          "Stay in contact with the centre designate about participant needs and interests",
          "Support other related duties as needed",
        ],
      },
      {
        heading: "Knowledge and skills — VLA",
        body: "",
        bullets: [
          "Comprehensive knowledge of the centre\u2019s programs and services",
          "Awareness and sensitivity to the diversity represented in the centre\u2019s membership",
          "Strong oral, written, and interpersonal communication skills",
          "Ability to work independently",
          "Good organizational skills",
          "Strong listening and interview skills",
          "Motivational interviewing skills are an asset",
          "Experience using computers and virtual applications such as Zoom is an asset",
        ],
      },
      {
        heading: "Why volunteer as a VLA",
        body: "This role offers an opportunity to support older adults at an important point in their journey. Volunteer Link Ambassadors help participants feel seen, understood, and guided toward programs that can support their wellbeing and social connection. This role is a strong fit for volunteers who enjoy communication, listening, and one to one support.",
      },
      {
        heading: "Volunteer Peer Mentor — Role overview",
        body: "Volunteer Peer Mentors support Links2Wellbeing referred clients during their first experiences at the centre. This role focuses on comfort, welcome, and encouragement. It is especially helpful for individuals who may feel unsure about joining something new and would benefit from support during their first few visits.",
      },
      {
        heading: "What you may do — Peer Mentor",
        body: "",
        bullets: [
          "Lead an individual tour or provide companionship during a group tour",
          "Share centre program, participation, or membership information",
          "Introduce new members to class instructors and peers",
          "Attend a class or two with the new member so they feel comfortable and welcome",
        ],
      },
      {
        heading: "Knowledge and skills — Peer Mentor",
        body: "",
        bullets: [
          "Comprehensive knowledge of the centre\u2019s programs and services",
          "Reliable, self motivated, and able to work independently",
          "Excellent listening and communication skills",
          "Patience, understanding, and tolerance when assisting seniors",
          "Physical stamina to stand, walk, or support seniors during a tour or class, where needed",
          "Respect for confidentiality",
          "Cultural sensitivity and awareness",
          "Genuine concern for the wellbeing of older adults",
        ],
      },
      {
        heading: "Why volunteer as a Peer Mentor",
        body: "This role offers a meaningful opportunity to build connections, reduce barriers to participation, and help older adults feel like they belong. It is well suited to volunteers who enjoy welcoming others, offering companionship, and helping people feel more comfortable in new environments.",
      },
    ],
    closing: "Both volunteer roles contribute to the same larger goal: helping older adults feel supported, connected, and more confident participating in community life through Links2Wellbeing.",
    relatedIds: [8, 10, 3],
  },

  // ── Volunteer Confidentiality Agreement (id: 10) ──────────────────────────
  10: {
    intro: "As a volunteer with Links2Wellbeing, you may become aware of private and confidential client information. Protecting that information is an important part of your role. All volunteers are expected to respect privacy, handle information responsibly, and maintain confidentiality at all times.",
    sections: [
      {
        heading: "Our commitment to privacy",
        body: "Links2Wellbeing volunteers are trusted to handle sensitive information with care. Volunteers may come into contact with personal details about clients, their families, staff, or other volunteers. This information must be respected and protected at all times.",
      },
      {
        heading: "What volunteers agree to",
        body: "By volunteering with the project, volunteers agree that they will not disclose private or confidential information without the client\u2019s consent. They also agree to respect the privacy of clients, families, employees, and fellow volunteers throughout their involvement in the program.",
      },
      {
        heading: "Responsible handling of information",
        body: "Volunteers are expected to ensure that confidential information is not accessed, used, or disclosed inappropriately. This applies to both electronic records and paper records. Volunteers are also expected to ask for a client\u2019s permission before sharing their name, phone number, email address, or any other personal information when making a referral to a program.",
      },
      {
        heading: "Examples of confidentiality breaches",
        body: "Examples of breaching privacy or confidentiality may include:",
        bullets: [
          "Accessing personal information that is not required for your role",
          "Misusing or disclosing personal information without proper authorization",
          "Sharing personal information verbally, through a computer system, or in hard copy without permission",
          "Altering personal information belonging to clients, families, employees, or volunteers without authorization",
        ],
      },
      {
        heading: "Questions or concerns",
        body: "If a volunteer has any questions or concerns about confidentiality, they should contact the appropriate staff member or Designated Centre Contact identified by the centre.",
      },
      {
        heading: "Ongoing responsibility",
        body: "The confidentiality pledge remains in effect even after a volunteer stops serving in their role. Confidentiality is not limited to the duration of active volunteering.",
      },
    ],
    closing: "Respecting confidentiality helps build trust, protect participants, and create a safe and respectful environment for everyone involved in Links2Wellbeing.",
    relatedIds: [8, 9, 3],
  },

  // ── Platform walkthrough guide (id: 1, hub-guide) ──────────────────────────
  1: {
    intro: "Welcome to the L2W Knowledge Hub — your one-stop platform for everything related to Links2Wellbeing. This guide will walk you through each part of the platform so you feel confident finding what you need, whether you are brand new to the project or a returning user.\n\nThe Knowledge Hub is designed to be simple and easy to use. You do not need any technical experience. If you can browse a website, you can use this platform.",
    sectionTitle: "Getting around the Knowledge Hub:",
    sections: [
      {
        heading: "The Home Screen",
        body: "When you first open the Knowledge Hub, you will see your home screen. This is your starting point. It shows a personalized greeting, quick-access cards for common tasks, and a list of recommended resources based on your role. You will also see upcoming workshops, deadlines, and quick links on the right side of the screen.",
        bullets: [
          "\"New Here?\" card — walks you through the basics if it is your first time",
          "\"Practice with AI Scenarios\" card — try realistic practice conversations powered by AI",
          "\"Recommended for You\" — resources hand-picked for your role and stage in the project",
          "Quick links on the right side take you to the Google Drive, support contacts, and feedback forms",
        ],
        video: { label: "Watch: Home screen overview", duration: "2 min" },
      },
      {
        heading: "Using the Sidebar Menu",
        body: "The left sidebar is your main navigation. It is organized into three sections: Resources, Connect, and Workspace. Click any topic to expand it and see sub-topics and individual resources inside.",
        bullets: [
          "Resources — all guides, templates, and training materials organized by topic (e.g., Receiving Referrals, Supporting Clients, Funding & Microgrants)",
          "Connect — community features like the Community Café, Discussion Forum, Workshop Highlights, and Impact Stories",
          "Workspace — practical tools including Workflows, Templates, and Reporting",
          "Click a topic name to expand or collapse it. Click a sub-topic to see its resources. Click a resource to open it.",
        ],
      },
      {
        heading: "Searching for Resources",
        body: "Use the search bar at the top of the page to quickly find what you need. Type any keyword — like \"referral\", \"intake form\", or \"subsidy\" — and results will appear instantly. You can search for resource titles, descriptions, or topics.",
        bullets: [
          "The search bar works from any page — you do not need to go back to the home screen",
          "Results show the resource name, type (Guide, Template, Video, PDF), and which topic it belongs to",
          "Click any result to go directly to that resource",
        ],
      },
      {
        heading: "Reading a Resource Page",
        body: "When you open a resource, you will see the title, a description, and the full content laid out in easy-to-read steps. Some resources include downloadable files (PDFs, templates), and some include video walkthroughs.",
        bullets: [
          "Guides are broken into numbered steps so you can follow along at your own pace",
          "Videos appear as play buttons — click them to watch a walkthrough",
          "PDFs and templates have a download button so you can save them to your computer",
          "At the bottom of each resource, you will see related resources you might also find helpful",
        ],
      },
      {
        heading: "Bookmarking Resources",
        body: "Found a resource you want to come back to later? Click the bookmark icon next to any resource title to save it. You can find all your bookmarked resources by clicking \"Bookmarks\" in the sidebar under Help.",
        bullets: [
          "Click the bookmark icon once to save, click again to remove",
          "Your bookmarks are saved in your browser so they will be there next time you visit",
          "This is useful for saving resources you refer to often, like intake forms or reporting guides",
        ],
      },
      {
        heading: "Community Features",
        body: "The Connect section lets you stay connected with other link workers and centres across the project. This is where you can learn from others, share your experiences, and ask questions.",
        bullets: [
          "Community Café — see upcoming and past Conversation Cafés with dates, topics, and Teams links",
          "Discussion Forum — ask questions, share tips, and read what other link workers are doing",
          "Workshop Highlights — recordings and summaries from past training workshops",
          "Impact Stories — real stories from centres showing how social prescribing is making a difference",
        ],
      },
      {
        heading: "Practice with AI Scenarios",
        body: "The AI Scenarios feature lets you rehearse real-world social prescribing conversations before you encounter them. Choose a category (like \"First Contact Calls\" or \"Hesitant Participants\"), read the scenario, type your response, and receive instant AI feedback based on L2W best practices.",
        bullets: [
          "Select a category that matches what you want to practice",
          "Read the scenario carefully — it describes a realistic situation with a fictional participant",
          "Type your response in the text box as if you were speaking to the participant",
          "Click \"Get Feedback\" to receive specific guidance on what you did well and what to consider",
          "Try as many scenarios as you like — each one is different",
        ],
        video: { label: "Watch: How to use AI Scenarios", duration: "3 min" },
      },
      {
        heading: "Templates and Downloads",
        body: "The Templates section in Workspace gives you access to all the forms and documents you need for day-to-day work. These include referral forms, intake forms, confidentiality agreements, reporting templates, and more.",
        bullets: [
          "Browse by category or search for a specific template name",
          "Click the download button to save a template to your computer",
          "Templates are available in Word (.docx), Excel (.xlsx), and PDF formats",
          "Always use the latest version from the Knowledge Hub rather than older copies you may have saved",
        ],
      },
      {
        heading: "Getting Help",
        body: "If you are stuck or have questions about the platform, there are several ways to get help. The FAQ section covers common questions. You can also reach out to support directly.",
        bullets: [
          "FAQ — answers to the most common questions about the platform and the L2W project",
          "Contact support — use the quick link on the right sidebar to send a message to the support team",
          "Submit feedback — let us know if something is confusing, broken, or if you have a suggestion for improvement",
          "Discussion Forum — ask other link workers for help — chances are someone has had the same question",
        ],
      },
    ],
    callout: "Tip: You do not need to learn everything at once. Start with the resources in \"Using the Knowledge Hub\" and \"Set Up Your L2W Program\", then explore other topics as you need them. The platform is here whenever you need it.",
    closing: "The Knowledge Hub is designed to grow with you. As new resources, templates, and training materials are added, they will appear in the relevant sections automatically. Check back regularly, and do not hesitate to reach out if you need help.",
    relatedIds: [100, 101, 102],
  },

  // ── Getting started video tutorial (id: 100, hub-guide) ────────────────────
  100: {
    intro: "This video tutorial walks you through the L2W Knowledge Hub step by step. It covers everything from logging in for the first time to finding resources, using community features, and practicing with AI scenarios. Watch the full video or skip to the section you need.\n\nNo technical experience is needed. The video moves at a relaxed pace and covers each feature clearly.",
    sectionTitle: "What this video covers:",
    sections: [
      {
        heading: "Logging in and the Home Screen",
        body: "The video starts by showing you how to access the Knowledge Hub and what you see when you first arrive. You will learn about the greeting area, the quick-access cards, and how to use the recommended resources section.",
        video: { label: "Watch: Logging in and Home Screen", duration: "1:30" },
      },
      {
        heading: "Navigating with the Sidebar",
        body: "Next, the video shows how the sidebar menu works. You will see how to expand topics, browse sub-topics, and open individual resources. The video also covers the difference between Resources, Connect, and Workspace sections.",
        video: { label: "Watch: Sidebar navigation", duration: "2:00" },
      },
      {
        heading: "Searching and Bookmarking",
        body: "The video demonstrates how to use the search bar to find resources quickly, and how to bookmark resources you want to come back to later. It also shows where to find your saved bookmarks.",
        video: { label: "Watch: Search and bookmarks", duration: "1:30" },
      },
      {
        heading: "Community Features",
        body: "This section walks through the Community Café, Discussion Forum, Workshop Highlights, and Impact Stories. You will see how to view upcoming events, read and reply to forum posts, and watch workshop recordings.",
        video: { label: "Watch: Community features", duration: "2:30" },
      },
      {
        heading: "AI Scenarios and Practice",
        body: "The final section demonstrates the AI Scenarios feature. You will see how to select a category, read a scenario, type a response, and receive AI-powered feedback based on L2W best practices.",
        video: { label: "Watch: AI Scenarios walkthrough", duration: "3:00" },
      },
    ],
    callout: "Tip: You can pause the video at any point and try things out on the platform. The best way to learn is to follow along as you watch.",
    closing: "If you have questions after watching, check the FAQ section or post in the Discussion Forum. Other link workers and the support team are happy to help.",
    relatedIds: [1, 101, 102],
  },

  // ── Practice with AI Scenarios (id: 101, hub-guide) ────────────────────────
  101: {
    intro: "The AI Scenarios feature helps you build confidence in real-world social prescribing conversations. Instead of reading about what to say, you can actually practice responding to realistic situations and receive instant, personalized feedback.\n\nEach scenario describes a fictional older adult or healthcare provider. Your job is to respond as you would in a real conversation. The AI will then tell you what you did well, what to consider, and which L2W best practices apply.",
    sectionTitle: "How to use AI Scenarios:",
    sections: [
      {
        heading: "Choose a Category",
        body: "Start by selecting one of six practice categories. Each focuses on a different type of conversation you may encounter as a link worker:",
        bullets: [
          "First Contact Calls — your first phone call with a referred participant (great for beginners)",
          "Hesitant Participants — when someone is unsure about joining or attending",
          "Overcoming Barriers — dealing with transportation, mobility, language, or other challenges",
          "Follow-Up Conversations — checking in with participants at 3, 6, or 12 months",
          "Outreach to Healthcare Providers — pitching Links2Wellbeing to a doctor or clinic",
          "Reporting Questions — answering questions about tracking, data entry, and reporting",
        ],
      },
      {
        heading: "Read the Scenario",
        body: "After selecting a category, you will see a scenario describing a specific situation. Each scenario includes a fictional person with a name, age, and backstory. Read it carefully — the details matter. The scenario ends with a question asking how you would handle the situation.",
      },
      {
        heading: "Write Your Response",
        body: "Type your response in the text box as if you were actually speaking to the person in the scenario. Be specific — mention what you would say, ask, or do. The more detail you include, the better the feedback will be.",
        bullets: [
          "Write at least a few sentences for meaningful feedback",
          "Think about what L2W process or approach applies to this situation",
          "Consider the person's specific needs, barriers, and feelings",
          "You can press Ctrl+Enter (or Cmd+Enter on Mac) to submit quickly",
        ],
      },
      {
        heading: "Review Your Feedback",
        body: "After submitting, you will receive feedback in three parts. The AI reads your exact response and gives you personalized guidance — not generic advice.",
        bullets: [
          "Strengths — specific things you said or considered that align with L2W best practices, with quotes from your response",
          "What to Consider — specific gaps or things you may have missed, with concrete suggestions",
          "L2W Reference — the exact L2W process, document, or guideline that applies to this scenario",
        ],
      },
      {
        heading: "Practice Again",
        body: "You can try another scenario in the same category or switch to a different category. Each scenario features a different person with different challenges, so you will never see the same situation twice. The more you practice, the more confident you will feel in real conversations.",
        bullets: [
          "Click \"Try another scenario\" to get a new scenario in the same category",
          "Click \"Different category\" to go back to the category selection",
          "Use the copy button to save a scenario and your feedback for later review",
        ],
      },
    ],
    callout: "Remember: there are no wrong answers. The AI feedback is meant to build your confidence, not test your knowledge. Think of it as a supportive practice partner.",
    closing: "AI Scenarios is available anytime you want to practice. Many link workers find it helpful to try a few scenarios before their first real conversation, and to revisit it periodically as they encounter new types of situations.",
    relatedIds: [1, 100, 102],
  },

  // ── AI-assisted search guide (id: 102, hub-guide) ──────────────────────────
  102: {
    intro: "The Knowledge Hub includes search tools to help you find the right resource quickly. Whether you are looking for a specific form, a guide on how to handle a situation, or a template you used before, the search feature can help you find it in seconds.\n\nYou do not need to know the exact name of what you are looking for. Searching by keyword or topic works just as well.",
    sectionTitle: "How to search effectively:",
    sections: [
      {
        heading: "Using the Search Bar",
        body: "The search bar is located at the top of every page. Click on it and start typing. Results will appear as you type — you do not need to press Enter.",
        bullets: [
          "Type a keyword like \"referral\", \"intake\", \"subsidy\", or \"confidentiality\"",
          "Results show the resource title, type (Guide, Template, Video, PDF), and topic",
          "Click any result to go directly to that resource",
          "The search looks through titles, descriptions, and topic names",
        ],
      },
      {
        heading: "Tips for Better Search Results",
        body: "If you are not finding what you need, try these approaches:",
        bullets: [
          "Use simple keywords instead of full sentences — \"intake form\" works better than \"how do I fill out the intake form\"",
          "Try different words for the same thing — \"referral\" and \"prescription\" may both work",
          "If you are looking for a template, try the template name or the type of form (e.g., \"tracking tool\", \"confidentiality agreement\")",
          "Check spelling — the search needs a close match to find results",
        ],
      },
      {
        heading: "Browsing by Topic",
        body: "If you prefer to browse rather than search, use the sidebar menu. All resources are organized into topics and sub-topics. This is helpful when you want to see everything available in a particular area.",
        bullets: [
          "Click a topic name (e.g., \"Receiving Referrals\") to see all sub-topics",
          "Click a sub-topic to see all resources within it",
          "Resources are listed with their type (Guide, PDF, Video, Template) so you can quickly identify what you need",
        ],
      },
      {
        heading: "Finding Resources You Used Before",
        body: "If you opened a resource recently or bookmarked it, there are two quick ways to find it again:",
        bullets: [
          "Bookmarks — click \"Bookmarks\" in the sidebar under Help to see all resources you have saved",
          "Recently Updated — click \"Recently Updated\" in the sidebar to see resources that were recently added or changed",
          "Your browser may also remember your recent pages — try using your browser's back button or history",
        ],
      },
      {
        heading: "When You Cannot Find What You Need",
        body: "If a search does not return the result you expected, the resource may be listed under a different name, or it may not be in the Knowledge Hub yet. Here is what to do:",
        bullets: [
          "Try browsing the relevant topic in the sidebar instead of searching",
          "Ask in the Discussion Forum — another link worker may know where to find it",
          "Use the \"Request a resource\" quick link to let the support team know what you are looking for",
          "Check the L2W Google Drive — some documents may be stored there rather than in the Knowledge Hub",
        ],
      },
    ],
    callout: "Tip: Bookmark the resources you use most often so you can find them instantly next time. The Bookmarks section is your personal quick-access list.",
    closing: "The search feature and sidebar navigation work together to help you find any resource on the platform. As more resources are added, the search will continue to find them automatically.",
    relatedIds: [1, 100, 101],
  },

  // ── Strategic Healthcare Outreach Advice (id: 22, outreach) ────────────────
  22: {
    intro: "Building a referral network with healthcare providers is one of the most important things you can do as a link worker. This guide provides practical, step-by-step advice on how to approach healthcare providers, what to say, and how to build relationships that lead to consistent referrals.\n\nYou do not need to be a healthcare professional to do this successfully. The key is being prepared, respectful of their time, and clear about how Links2Wellbeing benefits their patients.",
    sectionTitle: "Steps to building your healthcare referral network:",
    sections: [
      {
        heading: "Start Small — Pick 1–2 Providers",
        body: "You do not need to contact every doctor's office in your area at once. Start with one or two healthcare providers who are close to your centre or who already have a relationship with your organization.",
        bullets: [
          "Family physicians and nurse practitioners are the most common referral sources",
          "Walk-in clinics, community health centres, and hospital discharge planners are also good starting points",
          "Ask your centre director or other staff if they have existing contacts in healthcare",
        ],
      },
      {
        heading: "Prepare Your Outreach Package",
        body: "Before contacting a healthcare provider, prepare a small outreach package. This makes your first contact professional and gives the provider something to review when you leave. Your package should include:",
        bullets: [
          "A printed copy of the Social Prescription Pad — this is the form the provider will use to refer patients",
          "The Outreach Cover Letter — customized with your centre's name and contact details",
          "A Promotional Poster or General Flyer to leave behind in their office or waiting room",
          "The \"Identifying Patients With Unmet Social Needs\" one-pager — helps providers know who to refer",
        ],
      },
      {
        heading: "Your Elevator Pitch",
        body: "When you meet a healthcare provider, you may only have 1–2 minutes of their time. Be clear and concise. Here is a sample pitch you can adapt:",
        bullets: [
          "\"We run a free social prescribing program called Links2Wellbeing for adults 55 and older who may be experiencing loneliness, isolation, or inactivity.\"",
          "\"If you have patients who could benefit from community connection, you can refer them to us using this simple prescription pad. We handle everything from there.\"",
          "\"We contact the patient within 3 business days, help them find programs that interest them, and follow up at 3, 6, and 12 months.\"",
          "\"There is no cost to the patient — we can cover membership fees, program costs, and even transportation if needed.\"",
        ],
      },
      {
        heading: "Making the First Contact",
        body: "There are several ways to reach out to a healthcare provider. Choose the approach that feels most natural and appropriate:",
        bullets: [
          "Phone call — ask to speak with the office manager or the provider directly. Keep it brief and offer to drop off materials",
          "In-person visit — drop by the office with your outreach package. Ask if you can leave materials and schedule a 5-minute introduction",
          "Email — send a short introductory email with an attached cover letter and offer to follow up by phone",
          "Through a mutual contact — if someone at your centre knows the provider, ask for an introduction",
        ],
      },
      {
        heading: "Follow Up and Maintain the Relationship",
        body: "One contact is usually not enough. Follow up politely 1–2 weeks after your first outreach. Once you start receiving referrals, keep the relationship alive:",
        bullets: [
          "Send a brief thank-you note after receiving a referral (no patient details — just a thank you for the partnership)",
          "Share anonymized success stories or impact data from your centre if available",
          "Invite healthcare providers to your centre for a visit or community event",
          "Check in every 2–3 months to keep your program top of mind",
          "If referrals slow down, offer to visit the office again or refresh the materials on display",
        ],
      },
      {
        heading: "Common Questions from Healthcare Providers",
        body: "Be prepared to answer these common questions from providers:",
        bullets: [
          "\"What happens after I refer someone?\" — We contact the patient within 3 business days by phone, introduce ourselves, and arrange a first visit to the centre.",
          "\"Is there a cost?\" — No. Links2Wellbeing can cover membership, programs, transportation, and materials through centre subsidies (up to $2,000 per year for new centres).",
          "\"What kinds of patients should I refer?\" — Adults 55+ who may benefit from social connection, physical activity, learning, or community participation. Common indicators include loneliness, recent loss, retirement, chronic conditions, or reduced mobility.",
          "\"Will I get updates on my patient?\" — We respect patient privacy, but we can let you know the referral was received and contact was made. Detailed follow-up is between the participant and our team.",
        ],
      },
    ],
    callout: "Tip: Keep a copy of the Social Prescription Pad and Outreach Cover Letter in your bag or car so you are always ready for an outreach opportunity. Spontaneous conversations with healthcare providers can be just as effective as planned visits.",
    closing: "Building a referral network takes time, but even one or two strong healthcare relationships can generate consistent referrals for your centre. Focus on being helpful, professional, and patient — the referrals will follow.",
    relatedIds: [15, 21, 25, 26],
  },

  // ── Connecting With Your Community Pharmacist (id: 20, outreach) ────────────
  20: {
    intro: "Community pharmacists are an underused but highly valuable referral source for Links2Wellbeing. They see older adults regularly, often know their health challenges, and are trusted members of the community. Many pharmacists are looking for ways to support patients beyond medication — social prescribing gives them a practical tool to do that.\n\nThis guide covers how to approach pharmacists, what to say, and how to make the referral process as easy as possible for them.",
    sections: [
      {
        heading: "Why Pharmacists Make Great Referral Partners",
        body: "Pharmacists interact with older adults more frequently than most healthcare providers. They see patients picking up medications for chronic conditions, managing pain, or dealing with mental health challenges. Many pharmacists notice signs of isolation or loneliness but lack a clear way to help beyond medication.",
        bullets: [
          "Pharmacists often have ongoing, trusting relationships with patients over many years",
          "They may notice changes in mood, appearance, or social behaviour",
          "Pharmacy visits are less formal than doctor appointments — patients may share more openly",
          "Pharmacists are typically easier to access than physicians for an initial conversation",
        ],
      },
      {
        heading: "How to Approach a Pharmacist",
        body: "Visit your local pharmacy in person. Avoid peak hours (Monday mornings and Friday afternoons tend to be busiest). Ask to speak with the pharmacist briefly, or leave your outreach materials with a staff member and ask if you can schedule a short follow-up conversation.",
        bullets: [
          "Bring a Social Prescription Pad and an Outreach Cover Letter — customize it for the pharmacy",
          "Bring a small stack of flyers or postcards to leave at the pharmacy counter",
          "Keep your pitch under 2 minutes — pharmacists are busy and will appreciate brevity",
          "Emphasize that the referral process is simple: fill in the patient's name and contact info on the prescription pad, and your team does the rest",
        ],
      },
      {
        heading: "Sample Conversation Script",
        body: "Here is a simple script you can adapt when speaking with a pharmacist for the first time:",
        bullets: [
          "\"Hi, I work with [Centre Name] and we run a program called Links2Wellbeing. It's a social prescribing program for adults 55 and older.\"",
          "\"If you have regular customers who seem lonely, isolated, or could benefit from getting out and doing activities — you can refer them to us using this simple prescription pad.\"",
          "\"We contact the person within 3 days, help them find programs that match their interests, and there's no cost to them.\"",
          "\"Would you be open to keeping a few of these prescription pads here at the counter?\"",
        ],
      },
      {
        heading: "Making It Easy for the Pharmacist",
        body: "The simpler you make the referral process, the more likely pharmacists will use it. Here are some tips:",
        bullets: [
          "Leave a stack of Social Prescription Pads directly at the pharmacy counter or consultation area",
          "Offer to pre-fill your centre's contact information on the pads so the pharmacist only needs to add the patient's details",
          "Provide a simple email address or phone number where the pharmacist can send referrals directly",
          "Visit the pharmacy every 4–6 weeks to refresh materials and check in",
        ],
      },
    ],
    callout: "Many pharmacists are enthusiastic about social prescribing once they understand it. If you get a positive response, ask if they know other pharmacists in the area who might be interested — word of mouth works well in pharmacy networks.",
    closing: "Pharmacists can become some of your most reliable and consistent referral sources. A single pharmacy relationship can generate several referrals per month, especially in communities with a high concentration of older adults.",
    relatedIds: [22, 15, 26, 21],
  },

  // ── Client Referral Form (id: 25, referrals) ──────────────────────────────
  25: {
    intro: "The Client Referral Form is the standard form used by healthcare providers to refer older adults to Links2Wellbeing. When a healthcare provider identifies a patient who could benefit from social prescribing, they complete this form and send it to your centre by email, fax, or in person.\n\nAs a link worker, you need to understand what information is on this form so you can process referrals quickly and contact the referred person within 3 business days.",
    sectionTitle: "What is on the referral form:",
    sections: [
      {
        heading: "Patient Information",
        body: "The top section of the form collects basic information about the referred person:",
        bullets: [
          "Patient name (first and last)",
          "Date of birth and age",
          "Phone number and email address (if available)",
          "Preferred method of contact (phone, email, or mail)",
          "Preferred language (important for connecting with appropriate programs)",
          "Home address and nearest intersection (helps with transportation planning)",
        ],
      },
      {
        heading: "Referring Provider Information",
        body: "The middle section identifies who is making the referral:",
        bullets: [
          "Provider name and title (e.g., Dr. Smith, NP, Pharmacist)",
          "Clinic or pharmacy name",
          "Provider phone number and fax number",
          "Date of referral",
        ],
      },
      {
        heading: "Reason for Referral",
        body: "The provider checks off one or more reasons why they are referring the patient. Common reasons include:",
        bullets: [
          "Social isolation or loneliness",
          "Recent life change (retirement, loss of spouse, relocation)",
          "Low physical activity or mobility challenges",
          "Chronic health conditions that may benefit from social engagement",
          "Mental health concerns (anxiety, depression, low mood)",
          "Caregiver burnout or stress",
          "Patient interest in community programs or activities",
        ],
      },
      {
        heading: "Additional Notes",
        body: "The bottom section provides space for the provider to add any additional context that may be helpful when you contact the person. This could include mobility limitations, cultural considerations, specific interests, or concerns the patient has expressed.",
      },
      {
        heading: "What to Do When You Receive This Form",
        body: "When a completed referral form arrives at your centre, follow these steps:",
        bullets: [
          "Assign a unique client code using the L2W coding system (see \"How to Assign Client Codes\")",
          "Log the referral in your tracking spreadsheet with the date received",
          "Contact the referred person within 3 business days by phone",
          "Keep the original form in a secure, locked filing cabinet",
          "Do not share the form with anyone who is not a designated L2W team member",
        ],
      },
    ],
    callout: "Important: The referral form contains personal health information. Always store it securely, limit access to trained team members, and follow the privacy guidelines in the Volunteer Confidentiality Agreement.",
    closing: "Download the fillable referral form below and provide copies to your healthcare referral partners. Make sure they know where to send completed forms — include your centre's email address or fax number on the cover letter.",
    relatedIds: [26, 27, 30, 29],
  },

  // ── Social Prescription Pads (id: 26, referrals) ──────────────────────────
  26: {
    intro: "The Social Prescription Pad is one of the most important outreach tools in Links2Wellbeing. It is a simple, tear-off pad that looks and feels like a medical prescription pad — but instead of prescribing medication, healthcare providers use it to \"prescribe\" community connection and social participation.\n\nWhen you give these pads to healthcare providers, you make the referral process as easy as writing a prescription. Providers fill in the patient's name and contact information, tear off the sheet, and send it to your centre. That is all they need to do — your team handles everything from there.",
    sectionTitle: "About the Social Prescription Pad:",
    sections: [
      {
        heading: "Two Versions Available",
        body: "The prescription pad comes in two versions. Both contain the same information but differ in layout:",
        bullets: [
          "Version A — Standard portrait layout. One referral per sheet. Best for offices that prefer a traditional look similar to medical prescription pads.",
          "Version B — Landscape layout with slightly larger fields. Easier to fill out for providers who prefer more writing space.",
          "Both versions are customizable — add your centre's name, logo, email, phone number, and fax number before printing.",
        ],
      },
      {
        heading: "What the Pad Includes",
        body: "Each prescription pad sheet collects the minimum information needed to start the referral process:",
        bullets: [
          "Patient name",
          "Patient phone number",
          "Preferred contact method (phone, email, or mail)",
          "Referring provider name and clinic",
          "Date of referral",
          "Optional: brief reason for referral or notes",
          "Your centre's contact information (pre-printed)",
        ],
      },
      {
        heading: "How to Use the Pads for Outreach",
        body: "The prescription pad is designed to be left at healthcare provider offices. Here is how to distribute them effectively:",
        bullets: [
          "Print pads on sturdy paper or cardstock so they feel professional. The OACAO can arrange printing for you.",
          "Leave 2–3 pads at each healthcare office — one at the front desk, one in the consultation room, one in the break room",
          "Pair each pad with a cover letter and a one-page flyer explaining the program",
          "Visit partner offices every 4–6 weeks to replenish the pads and check in",
          "Track which offices have pads so you know when to refresh the supply",
        ],
      },
      {
        heading: "Customizing the Pad for Your Centre",
        body: "Before printing, customize the pad template with your centre's details. The downloadable template has editable fields for:",
        bullets: [
          "Your centre's name and logo",
          "Email address where providers should send referrals",
          "Fax number (if available)",
          "Phone number for questions",
          "Your centre's address",
          "A short tagline — e.g., \"Prescribe community connection for adults 55+\"",
        ],
      },
      {
        heading: "Why the Pad Format Works",
        body: "Healthcare providers are used to prescription pads. Using a similar format makes the referral process feel familiar and low-effort. Providers have told us that having a physical pad on their desk serves as a constant reminder to consider social prescribing for their patients.",
        bullets: [
          "It takes less than 60 seconds for a provider to fill out",
          "The pad sits on the desk as a visual reminder — unlike emails or brochures that get filed away",
          "Patients respond well to receiving a \"prescription\" — it feels official and motivating",
          "Several centres report that their most consistent referrals come from providers who have pads on their desk",
        ],
      },
    ],
    callout: "Tip: When you visit a healthcare provider for the first time, bring a pad and walk them through how to fill it out. It takes 30 seconds and removes any hesitation about the process.",
    closing: "Download both versions of the Social Prescription Pad below. Customize them with your centre's information, print a batch, and distribute them to your healthcare partners. This single tool can be your biggest driver of referrals.",
    relatedIds: [25, 15, 22, 21],
  },

  // ── Outreach Cover Letter Template (id: 15, outreach) ─────────────────────
  15: {
    intro: "The Outreach Cover Letter is a professional introduction letter that you customize and include when contacting healthcare providers about Links2Wellbeing. It provides a clear, concise overview of the program and invites the provider to participate as a referral partner.\n\nThis template is designed to be easy to customize. Simply replace the placeholder text with your centre's name, contact details, and any specific programs or services you want to highlight.",
    sectionTitle: "What the cover letter includes:",
    sections: [
      {
        heading: "Introduction and Program Overview",
        body: "The opening paragraph introduces Links2Wellbeing and explains what social prescribing is in plain language. It positions the program as a free, evidence-supported service that helps older adults improve wellbeing through community connection.",
      },
      {
        heading: "How Referrals Work",
        body: "The letter explains the referral process in 3 simple steps so the provider understands exactly what is expected of them:",
        bullets: [
          "Step 1: Complete the Social Prescription Pad or Referral Form with the patient's name and contact info",
          "Step 2: Send the form to the centre by email, fax, or in person",
          "Step 3: The L2W team contacts the patient within 3 business days and handles everything from there",
        ],
      },
      {
        heading: "What Your Centre Offers",
        body: "This section is where you highlight 3–5 programs or services at your centre that would be relevant to referred patients. Customize this based on your centre's strengths:",
        bullets: [
          "Examples: fitness classes, art workshops, walking groups, social lunches, computer classes, music programs",
          "Mention any programs specifically designed for older adults or newcomers",
          "Include information about accessibility — wheelchair access, hearing loop, etc.",
          "Note any multilingual programs or cultural-specific offerings",
        ],
      },
      {
        heading: "Customization Tips",
        body: "To make the letter effective, personalize it as much as possible:",
        bullets: [
          "Address it to the specific provider by name, not \"Dear Doctor\"",
          "Mention the provider's clinic or practice by name",
          "Include your name, title, and direct phone number so they have a personal contact",
          "If you have any shared connections or community relationships, mention them",
          "Print on your centre's letterhead for a professional appearance",
        ],
      },
    ],
    callout: "This cover letter works best when paired with a Social Prescription Pad and a one-page flyer. Together, these three items give the provider everything they need to start referring patients.",
    closing: "Download the template below, customize it with your centre's details, and include it in every outreach package you prepare for healthcare providers.",
    relatedIds: [22, 26, 18, 19],
  },

  // ── Identifying Patients With Unmet Social Needs (id: 21, outreach) ────────
  21: {
    intro: "This one-page resource is designed for healthcare providers. It helps them identify patients who may benefit from a social prescribing referral to Links2Wellbeing. You should include a copy of this document in every outreach package you give to healthcare providers.\n\nThe document is written in clinical language that providers are familiar with, and lists specific indicators that a patient may have unmet social needs.",
    sections: [
      {
        heading: "When to Consider a Referral",
        body: "Healthcare providers should consider referring a patient to Links2Wellbeing when they notice any of the following indicators during a visit:",
        bullets: [
          "The patient mentions feeling lonely, bored, or isolated",
          "The patient has experienced a recent loss — spouse, close friend, sibling, or pet",
          "The patient has recently retired and is struggling with the transition",
          "The patient has relocated to a new area and has limited social connections",
          "The patient attends frequent or unnecessary medical appointments (may indicate loneliness)",
          "The patient shows signs of depression, anxiety, or low mood",
          "The patient has chronic conditions that could benefit from physical activity or social engagement",
          "The patient is a caregiver showing signs of burnout or stress",
        ],
      },
      {
        heading: "Screening Questions Providers Can Use",
        body: "Providers can ask one or two simple screening questions during a routine visit:",
        bullets: [
          "\"Do you feel you have enough social contact in your daily life?\"",
          "\"Have you been getting out of the house as much as you'd like?\"",
          "\"Would you be interested in joining a community program or activity near you?\"",
          "\"Is there anything non-medical that would help improve your day-to-day quality of life?\"",
        ],
      },
      {
        heading: "What Links2Wellbeing Can Offer",
        body: "When explaining the program to a provider, emphasize that it is free, voluntary, and person-centred:",
        bullets: [
          "No cost to the patient — subsidies cover membership, programs, transportation, and materials",
          "The patient chooses what they want to participate in — nothing is mandatory",
          "A trained link worker contacts the patient, builds a personalized participation plan, and follows up at regular intervals",
          "Common activities include fitness classes, social lunches, art programs, walking groups, and educational workshops",
        ],
      },
    ],
    callout: "This document is designed to be printed as a single page. Leave copies in provider offices, attach it to outreach emails, or include it in referral packages.",
    closing: "Healthcare providers are more likely to refer patients when they have a clear understanding of who to refer and why. This tool gives them that clarity.",
    relatedIds: [22, 25, 26, 15],
  },
};

export interface ForumComment {
  id: number;
  authorName: string;
  centre: string;
  timestamp: string;
  body: string;
  votes: number;
  children: ForumComment[];
}

export interface ForumPost {
  id: number;
  title: string;
  body: string;
  author: string;
  centre: string;
  timestamp: string;
  topic: string;
  votes: number;
  commentCount: number;
  comments: ForumComment[];
  pinned?: boolean;
}

export const FORUM_TOPIC_COLORS: Record<string, string> = {
  "Intake": "bg-[#E6F4F4] text-[#2C7A7B]",
  "Reporting": "bg-[#F5E6D6] text-[#D88A4B]",
  "First Visits": "bg-[#F2D5D5] text-[#C05656]",
  "Outreach": "bg-[#EDE9FE] text-[#7C3AED]",
  "Participation": "bg-[#ECFDF5] text-[#059669]",
  "Funding": "bg-[#FEF3C7] text-[#D97706]",
  "General": "bg-[#F5F5F4] text-[#525252]",
};

export const FORUM_POSTS: ForumPost[] = [
  {
    id: 1,
    title: "Tips for handling hesitant older adults on the first call",
    body: `I've been a link worker at YWCA Hamilton for about 8 months now, and one thing I've really had to work on is that initial phone call with hesitant participants. A lot of the older adults we connect with have never heard of social prescribing, and some are skeptical about "another program."\n\nHere's what's been working for me:\n\n1. **Mention the referring doctor by name.** Instead of "your doctor referred you," I say "Dr. Chen thought you might enjoy this." It feels more personal and trustworthy.\n\n2. **Don't sell the program — ask about them.** I spend the first 5 minutes just asking about their day, their neighbourhood, what they used to enjoy doing. People open up when they feel heard.\n\n3. **Offer a no-commitment visit.** I say "Why don't you just come see the space? No sign-up, no paperwork. Just a cup of tea and a look around." That takes the pressure off.\n\n4. **Follow up with a handwritten note.** After the call, I mail a short card saying it was nice to chat. Old-fashioned, but it works.\n\nWould love to hear what's working for others!`,
    author: "Yamilly M.",
    centre: "YWCA Hamilton",
    timestamp: "2h ago",
    topic: "Intake",
    votes: 14,
    pinned: true,
    commentCount: 4,
    comments: [
      {
        id: 101,
        authorName: "Sarah K.",
        centre: "Peterborough SALC",
        timestamp: "1h ago",
        body: "The handwritten note idea is lovely! We had a participant last month who was so hesitant on the phone — she actually said \"I don't need help.\" But after her first visit (we paired her with a regular who loves knitting), she's now there three days a week. Sometimes it just takes that one connection.",
        votes: 8,
        children: [
          {
            id: 102,
            authorName: "David L.",
            centre: "Ottawa Senior Centre",
            timestamp: "45m ago",
            body: "Quick question — how do you handle language barriers on that first call? We have a large Arabic-speaking population and I've been struggling with intake calls when there's no interpreter available right away.",
            votes: 3,
            children: [
              {
                id: 103,
                authorName: "Yamilly M.",
                centre: "YWCA Hamilton",
                timestamp: "30m ago",
                body: "Great question David. We partnered with the local settlement agency — they have a phone interpretation line we can conference in. It's not perfect but it helps a lot. I'd also suggest having your welcome materials translated. We did ours in Arabic, Mandarin, and Portuguese and it made a big difference.",
                votes: 5,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 104,
        authorName: "Priya N.",
        centre: "Thunder Bay SALC",
        timestamp: "30m ago",
        body: "Love tip #2 especially. I've also found that pairing new participants with a \"peer mentor\" — someone who's been in the program for a while — really helps with the first visit anxiety. The mentor can share their own story of being nervous at first, and it normalizes the experience.",
        votes: 6,
        children: [],
      },
    ],
  },
  {
    id: 2,
    title: "How we tracked referrals this year — template included",
    body: `Hey everyone! With Q1 reporting coming up I thought I'd share the tracking spreadsheet we built at Peterborough SALC. We were drowning in paper forms last year and decided to move everything into one shared Excel file.\n\nOur columns are:\n- Referral date\n- Referral source (doctor, self, community org, etc.)\n- Participant initials + ID\n- First contact date\n- First visit date\n- Program matched to\n- 3-month check-in status\n- 6-month follow-up status\n- 12-month follow-up status\n- Notes\n\nThe key thing that made this work was adding **conditional formatting** — cells go yellow when a follow-up is coming due in 2 weeks, and red when it's overdue. Our DCC checks it every Monday morning.\n\nWe also added a pivot table tab that auto-generates the numbers we need for the Common Tracking Tool. Saves us about 4 hours every quarter.\n\nHappy to share the template if anyone wants it — just reply here and I'll figure out how to get it to you!`,
    author: "Sarah K.",
    centre: "Peterborough SALC",
    timestamp: "1d ago",
    topic: "Reporting",
    votes: 23,
    commentCount: 7,
    comments: [
      {
        id: 201,
        authorName: "Jean F.",
        centre: "Windsor SALC",
        timestamp: "20h ago",
        body: "Would LOVE this template! We're still using a combination of paper files and sticky notes. Does it work with Google Sheets too or is it Excel-only?",
        votes: 4,
        children: [
          {
            id: 202,
            authorName: "Sarah K.",
            centre: "Peterborough SALC",
            timestamp: "18h ago",
            body: "It works in Google Sheets! You lose some of the conditional formatting but the core tracking is fine. I'll ask our DCC if we can share it through the L2W Google Drive.",
            votes: 3,
            children: [
              {
                id: 203,
                authorName: "Jean F.",
                centre: "Windsor SALC",
                timestamp: "16h ago",
                body: "Amazing, thank you! Our DCC has been asking for exactly this. The pivot table for the Common Tracking Tool alone would save us so much time.",
                votes: 2,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 204,
        authorName: "Priya N.",
        centre: "Thunder Bay SALC",
        timestamp: "22h ago",
        body: "This is great Sarah. One thing we added to ours is a \"warm handoff\" column — did the link worker personally introduce the participant to the program lead, or was it a cold referral? We noticed our retention rates are WAY higher with warm handoffs (like 85% vs 40%).",
        votes: 11,
        children: [
          {
            id: 205,
            authorName: "Yamilly M.",
            centre: "YWCA Hamilton",
            timestamp: "19h ago",
            body: "That's such a useful data point Priya. We should honestly be tracking that across all sites. I wonder if OACAO would consider adding it to the standard tracking tool.",
            votes: 7,
            children: [],
          },
        ],
      },
      {
        id: 206,
        authorName: "David L.",
        centre: "Ottawa Senior Centre",
        timestamp: "12h ago",
        body: "Does anyone else use ActiveNet for tracking? We're trying to figure out if we can import data from this kind of spreadsheet into ActiveNet so we don't have to double-enter everything.",
        votes: 3,
        children: [
          {
            id: 207,
            authorName: "Sarah K.",
            centre: "Peterborough SALC",
            timestamp: "8h ago",
            body: "We looked into ActiveNet integration but it was more trouble than it was worth for our size. The spreadsheet is simpler and everyone on the team can use it without training. But I know Toronto is doing something with ActiveNet — might be worth reaching out to them.",
            votes: 2,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Our creative first visit strategy with welcome cards",
    body: `Wanted to share something that's been a game-changer for us at the Ottawa Senior Centre. We started making personalized welcome cards for every new participant's first visit, and the feedback has been incredible.\n\nHere's what we do:\n\n**Before the visit:**\n- The link worker fills out a short "getting to know you" card with the participant's name, interests (from the intake call), and preferred language\n- We match them with a "welcome buddy" — a current participant who shares an interest\n\n**Day of the visit:**\n- Welcome buddy greets them at the door (huge for anxiety!)\n- We have a personalized welcome card on the table at their spot with their name and a note like "We heard you love gardening — ask Margaret about our community garden plot!"\n- Hot tea/coffee ready (we ask their preference during intake)\n- Short tour focused on areas matching their interests, not the whole building\n\n**After the visit:**\n- Welcome buddy follows up with a phone call the next day\n- Link worker sends a follow-up within the week\n\nOur first-visit-to-second-visit conversion rate went from about 60% to 89% after we started this. The welcome buddy system is the secret sauce — hearing "I was nervous too when I first came" from a peer is way more powerful than anything we can say as staff.\n\nAnyone else doing something similar? Would love to compare notes!`,
    author: "David L.",
    centre: "Ottawa Senior Centre",
    timestamp: "3d ago",
    topic: "First Visits",
    votes: 31,
    commentCount: 12,
    comments: [
      {
        id: 301,
        authorName: "Yamilly M.",
        centre: "YWCA Hamilton",
        timestamp: "3d ago",
        body: "David this is AMAZING. 60% to 89% is incredible. We've been struggling with first visit drop-off and I'm absolutely bringing this to our team meeting next week. Quick question — how do you match welcome buddies? Is it just based on interests or do you consider other factors?",
        votes: 9,
        children: [
          {
            id: 302,
            authorName: "David L.",
            centre: "Ottawa Senior Centre",
            timestamp: "3d ago",
            body: "Thanks Yamilly! We try to match on: 1) shared interest, 2) similar age range, 3) language if relevant, and 4) personality — we won't pair a very quiet person with our most extroverted regular. Our program coordinator keeps a little spreadsheet of willing buddies with their \"profiles.\" We have about 15 buddies who rotate.",
            votes: 7,
            children: [
              {
                id: 303,
                authorName: "Yamilly M.",
                centre: "YWCA Hamilton",
                timestamp: "2d ago",
                body: "A buddy spreadsheet with profiles — that's so smart. Do you find that the buddies enjoy the role? I could see some participants feeling like it's a burden.",
                votes: 3,
                children: [
                  {
                    id: 304,
                    authorName: "David L.",
                    centre: "Ottawa Senior Centre",
                    timestamp: "2d ago",
                    body: "They LOVE it. Honestly some of our buddies say it's their favourite part of coming to the centre. It gives them a sense of purpose and responsibility. We actually have a waitlist of people who want to be buddies. We do a short informal training — just 30 minutes on being welcoming without being overwhelming.",
                    votes: 12,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 305,
        authorName: "Sarah K.",
        centre: "Peterborough SALC",
        timestamp: "2d ago",
        body: "We do something similar but simpler — we have a \"welcome table\" near the entrance with coffee and cookies, and any regulars who are there early naturally gravitate to it and chat with newcomers. It's less structured than your buddy system but it creates a warm atmosphere. Love the personalized card idea though, definitely stealing that!",
        votes: 6,
        children: [],
      },
      {
        id: 306,
        authorName: "Priya N.",
        centre: "Thunder Bay SALC",
        timestamp: "2d ago",
        body: "This is wonderful. In Thunder Bay we have a large Indigenous population and we've adapted something similar — we do a sharing circle on the first visit where everyone introduces themselves and shares one thing they're grateful for. It's culturally appropriate and helps the new person see that everyone is open and welcoming. Our Elder-in-residence often leads it.",
        votes: 15,
        children: [
          {
            id: 307,
            authorName: "Jean F.",
            centre: "Windsor SALC",
            timestamp: "1d ago",
            body: "Priya, the sharing circle sounds beautiful. I think there's something powerful about having a ritual or tradition for welcoming — it signals \"you belong here\" in a way that casual conversation can't always do. We should compile all these ideas into a best practices document!",
            votes: 8,
            children: [
              {
                id: 308,
                authorName: "Priya N.",
                centre: "Thunder Bay SALC",
                timestamp: "1d ago",
                body: "Agreed! Maybe we could propose it as a workshop topic for the next L2W community of practice session? I'd be happy to co-present with David on first visit strategies.",
                votes: 6,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Re-engaging a participant who stopped attending after 3 months",
    body: `Looking for advice on a situation I'm dealing with. We had a participant — I'll call her "M" — who was attending our programs regularly for about 3 months. She seemed to really enjoy the chair yoga and the social lunch program. Then she just stopped coming.\n\nHere's what I've tried so far:\n- Called her twice (no answer, left voicemails)\n- Sent a letter saying we miss her and hope she's doing well\n- Asked other participants if they'd heard from her (they hadn't)\n\nI finally reached her last week. Turns out she had a fall at home and was recovering. She said she feels embarrassed about being "out of shape" now and isn't sure she can keep up with the chair yoga anymore.\n\nI reassured her that the programs are adaptable and that everyone would be happy to see her. She said she'd "think about it" but sounded unsure.\n\nWhat would you do next? Should I keep following up or give her space? How do you re-engage someone who's lost confidence?`,
    author: "Priya N.",
    centre: "Thunder Bay SALC",
    timestamp: "1w ago",
    topic: "Participation",
    votes: 8,
    commentCount: 5,
    comments: [
      {
        id: 401,
        authorName: "Yamilly M.",
        centre: "YWCA Hamilton",
        timestamp: "6d ago",
        body: "Oh Priya, this is so common and so tricky. I think the key is meeting her where she is emotionally. The fall probably shook her confidence in more ways than just the physical. I'd suggest offering to visit her at home first — bring a coffee, chat casually, no pressure about programs. Let HER bring it up when she's ready.",
        votes: 5,
        children: [
          {
            id: 402,
            authorName: "Priya N.",
            centre: "Thunder Bay SALC",
            timestamp: "6d ago",
            body: "That's a really good idea Yamilly. A home visit feels less intimidating than asking her to come back to the centre. I could even bring one of the other participants she was close with — make it feel like friends checking in rather than a \"program\" thing.",
            votes: 3,
            children: [],
          },
        ],
      },
      {
        id: 403,
        authorName: "David L.",
        centre: "Ottawa Senior Centre",
        timestamp: "5d ago",
        body: "We had a similar situation. What worked was offering a different program than the one they left. So instead of going straight back to chair yoga (where she feels she can't keep up), maybe invite her to something social — a coffee morning, a crafts group, a movie afternoon. Something with zero physical pressure. Once she's comfortable being back in the space, she might naturally drift back to yoga on her own terms.",
        votes: 7,
        children: [
          {
            id: 404,
            authorName: "Sarah K.",
            centre: "Peterborough SALC",
            timestamp: "4d ago",
            body: "This is exactly right. We call it \"side door re-engagement\" — don't try to get them back to the same thing, offer a new entry point. We also have a gentle movement class specifically designed for people recovering from falls or mobility changes. Maybe worth exploring if you don't already have one?",
            votes: 4,
            children: [],
          },
        ],
      },
      {
        id: 405,
        authorName: "Jean F.",
        centre: "Windsor SALC",
        timestamp: "4d ago",
        body: "One practical thing — make sure to document this in your follow-up notes for the 6-month check-in. If she was active for 3 months and then had a health event, that's important context for your reporting. It's not a program failure, it's a life event, and the fact that you're actively trying to re-engage shows the program is working as intended.",
        votes: 3,
        children: [],
      },
    ],
  },
  {
    id: 5,
    title: "Connected with community paramedics for referrals",
    body: `Exciting update from Windsor! We just formalized a referral partnership with our local Community Paramedicine program and I wanted to share how it came together in case it's useful for others.\n\n**Background:** Community paramedics in our area do regular home visits with isolated seniors — many of whom are exactly the population we're trying to reach through L2W. But they had no formal pathway to connect these folks to social programs.\n\n**How we set it up:**\n1. I reached out to the Community Paramedicine coordinator through our local Ontario Health Team\n2. We did a lunch-and-learn where I presented what L2W does and they presented their program\n3. We created a simple one-page referral form (name, phone, interests, any mobility/health considerations)\n4. Paramedics carry the forms and can fill them out during home visits with the senior's consent\n5. Forms get faxed (yes, faxed) to our centre weekly\n\n**Results after 2 months:**\n- 11 new referrals (compared to ~3/month from our usual sources)\n- 8 of 11 have attended at least one program\n- 3 are now regulars\n\nThe community paramedics love it because they finally have somewhere to refer people who are lonely but don't have a medical need. And we love it because these referrals come with a built-in trust factor — the seniors already know and trust their paramedic.\n\nStrongly recommend exploring this in your community!`,
    author: "Jean F.",
    centre: "Windsor SALC",
    timestamp: "2w ago",
    topic: "Outreach",
    votes: 19,
    commentCount: 9,
    comments: [
      {
        id: 501,
        authorName: "Priya N.",
        centre: "Thunder Bay SALC",
        timestamp: "2w ago",
        body: "Jean this is fantastic! 11 referrals in 2 months from a single partnership is amazing. We have a community paramedicine program here too — I'm going to reach out to them this week. Did you face any pushback about privacy/consent when setting up the referral pathway?",
        votes: 6,
        children: [
          {
            id: 502,
            authorName: "Jean F.",
            centre: "Windsor SALC",
            timestamp: "2w ago",
            body: "Good question! Yes, privacy was the main concern from their side. We solved it by making it fully consent-based — the paramedic explains what L2W is, shows the referral form, and the senior signs it right there. We also got our privacy policies reviewed together so both organizations were comfortable. Took about a month of back-and-forth but worth it.",
            votes: 5,
            children: [
              {
                id: 503,
                authorName: "Priya N.",
                centre: "Thunder Bay SALC",
                timestamp: "13d ago",
                body: "A month of back-and-forth on privacy is honestly faster than I expected. Would you be willing to share the referral form template? Could save us a lot of time not starting from scratch.",
                votes: 3,
                children: [
                  {
                    id: 504,
                    authorName: "Jean F.",
                    centre: "Windsor SALC",
                    timestamp: "13d ago",
                    body: "Absolutely! I'll upload it to the L2W Google Drive this week. Look for it in the Outreach folder. I'll also include the privacy agreement we drafted — you'll need to adapt it for your local context but it's a good starting point.",
                    votes: 4,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 505,
        authorName: "Yamilly M.",
        centre: "YWCA Hamilton",
        timestamp: "12d ago",
        body: "Love this! We've been thinking about similar partnerships. Has anyone connected with Meals on Wheels? They're in homes with isolated seniors too. Or public library outreach programs? I feel like there's a whole ecosystem of services that could be referring to each other.",
        votes: 8,
        children: [
          {
            id: 506,
            authorName: "David L.",
            centre: "Ottawa Senior Centre",
            timestamp: "11d ago",
            body: "We actually have a great relationship with our local library! They host a seniors' book club and their outreach librarian refers people to us all the time. Libraries are an underrated partner — they're trusted community spaces and many already have programs for isolated adults.",
            votes: 6,
            children: [],
          },
          {
            id: 507,
            authorName: "Sarah K.",
            centre: "Peterborough SALC",
            timestamp: "11d ago",
            body: "Meals on Wheels is a great idea Yamilly. Also consider Victorian Order of Nurses (VON) if they're in your area — they do home care visits and could be another referral source. The more \"touchpoints\" we have in the community, the more isolated seniors we can reach.",
            votes: 5,
            children: [],
          },
        ],
      },
      {
        id: 508,
        authorName: "Sarah K.",
        centre: "Peterborough SALC",
        timestamp: "10d ago",
        body: "This should honestly be a case study that OACAO shares with all L2W sites. The numbers speak for themselves. Jean, would you be open to presenting this at the next community of practice workshop?",
        votes: 7,
        children: [
          {
            id: 509,
            authorName: "Jean F.",
            centre: "Windsor SALC",
            timestamp: "10d ago",
            body: "I'd be honoured! Already mentioned it to our DCC and she's supportive. Maybe we could do a panel with other sites who've built community partnerships? Strength in numbers!",
            votes: 4,
            children: [],
          },
        ],
      },
    ],
  },
];
