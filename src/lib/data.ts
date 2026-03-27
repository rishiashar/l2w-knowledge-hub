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
  { id: 55, title: "Year-End Financial Report Template", description: "Template for reporting subsidy and admin funding", category: "funding", type: "Template", date: "2025-11-01", subcategory: "Financial Report" },
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
  { id: 112, title: "Year-End Financial Report Template", description: "Template for reporting subsidy and admin funding", category: "reporting", type: "Template", date: "2025-11-01", subcategory: "Financial Report" },
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
  sections: { heading: string; body: string; bullets?: string[] }[];
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
