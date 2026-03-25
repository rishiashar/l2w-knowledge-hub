export type ResourceType = "PDF" | "Guide" | "Template" | "Video";
export type CategoryId =
  | "training"
  | "outreach"
  | "referral"
  | "intake"
  | "first-visits"
  | "participation"
  | "reporting"
  | "funding"
  | "community";

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
  { id: "training", label: "Training" },
  { id: "outreach", label: "Outreach & Promotion" },
  { id: "referral", label: "Referrals" },
  { id: "intake", label: "Intake & Invite" },
  { id: "first-visits", label: "First Visits" },
  { id: "participation", label: "Participation Tracking" },
  { id: "reporting", label: "Reporting" },
  { id: "funding", label: "Funding & Grants" },
  { id: "community", label: "Community Resources" },
];

export const RESOURCES: Resource[] = [
  { id: 1, title: "How to use this platform", description: "Introduction and guided walkthrough for new users", category: "training", type: "Guide", date: "2026-03-15", subcategory: "Getting Started", popular: true },
  { id: 2, title: "Confidentiality & Privacy Form", description: "Protecting participant information — form for link workers", category: "training", type: "PDF", date: "2026-01-10", subcategory: "Getting Started" },
  { id: 3, title: "Guide to Getting Started", description: "Steps to setting up Links2Wellbeing at your centre", category: "training", type: "Guide", date: "2025-12-01", subcategory: "Getting Started", popular: true },
  { id: 4, title: "Social Prescribing Pathway Flowchart", description: "Visual process flow of the L2W social prescribing pathway", category: "training", type: "PDF", date: "2026-02-20", subcategory: "Understanding SP" },
  { id: 5, title: "L2W Phase 2 Tools & Resources Package", description: "Full digital toolkit with all forms, templates, and guidance for 2025", category: "training", type: "PDF", date: "2025-11-01", subcategory: "Understanding SP", popular: true },
  { id: 6, title: "Orientation for Designated Centre Contacts", description: "Training session recording for new DCCs joining L2W", category: "training", type: "Video", date: "2023-01-15", subcategory: "Delivering the Service" },
  { id: 7, title: "Active Communication Skills & Strategies", description: "Training on building rapport with older adults during intake", category: "training", type: "Video", date: "2025-06-10", subcategory: "Delivering the Service" },
  { id: 8, title: "Roles & Responsibilities (DCC, VLA, Peer Mentor)", description: "Appendix A — Overview of all L2W roles at SALCs", category: "training", type: "PDF", date: "2025-11-01", subcategory: "Onboarding Volunteers" },
  { id: 9, title: "Volunteer Role Postings (VLA & Peer Mentor)", description: "Appendix J — Sample job postings for recruiting volunteers", category: "training", type: "PDF", date: "2025-11-01", subcategory: "Onboarding Volunteers" },
  { id: 10, title: "Volunteer Confidentiality Agreement", description: "Appendix K — Pledge and agreement form for volunteers", category: "training", type: "PDF", date: "2025-11-01", subcategory: "Onboarding Volunteers" },
  { id: 11, title: "Reporting Guidance 2025-2026", description: "Latest reporting requirements and field explainers", category: "training", type: "Guide", date: "2026-02-01", subcategory: "Delivering the Service" },
  { id: 12, title: "Canva 101 for Outreach Materials", description: "Check-in meeting recording on designing outreach materials", category: "training", type: "Video", date: "2025-09-15", subcategory: "Delivering the Service" },
  { id: 13, title: "Interview Tips for Building Rapport", description: "Conversation techniques for intake and first calls", category: "training", type: "Guide", date: "2025-07-20", subcategory: "Delivering the Service" },
  { id: 14, title: "Subsidies Guidance", description: "Check-in meeting recording on managing subsidies", category: "training", type: "Video", date: "2025-10-05", subcategory: "Delivering the Service" },
  { id: 15, title: "Outreach Cover Letter Template", description: "Appendix P — Customizable letter for healthcare providers", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "HCP Outreach", popular: true },
  { id: 16, title: "Outreach Postcards for HCPs", description: "Appendix M — Postcards to distribute to community partners", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "HCP Outreach" },
  { id: 17, title: "Outreach Postcards for Older Adults", description: "Appendix N — Postcards designed for older adults", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Community Outreach" },
  { id: 18, title: "Promotional Poster for PCPs", description: "Appendix O — Poster introducing social prescribing to providers", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "HCP Outreach" },
  { id: 19, title: "General Flyer for PCPs", description: "Appendix I — Informational flyer about L2W for healthcare providers", category: "outreach", type: "PDF", date: "2025-11-01", subcategory: "HCP Outreach" },
  { id: 20, title: "Connecting With Your Community Pharmacist", description: "Practical tips for building referral relationships with pharmacists", category: "outreach", type: "Guide", date: "2025-08-10", subcategory: "HCP Outreach" },
  { id: 21, title: "Identifying Patients With Unmet Social Needs", description: "Tools for healthcare providers to identify suitable referrals", category: "outreach", type: "PDF", date: "2025-06-15", subcategory: "HCP Outreach" },
  { id: 22, title: "Strategic Healthcare Outreach Advice", description: "Advice for new L2W partners on building referral networks", category: "outreach", type: "Guide", date: "2025-05-20", subcategory: "HCP Outreach" },
  { id: 23, title: "Customizable Canva Templates", description: "Editable design templates for community outreach materials", category: "outreach", type: "Template", date: "2026-01-10", subcategory: "Community Outreach" },
  { id: 24, title: "Expanding Networks: Partnership Cafe", description: "Conversation Cafe on developing and nurturing partnerships", category: "outreach", type: "Video", date: "2025-11-20", subcategory: "Community Outreach" },
  { id: 25, title: "Client Referral Form", description: "Appendix B — Standard form used by healthcare providers to refer older adults", category: "referral", type: "PDF", date: "2025-11-01", subcategory: "Referral Process", popular: true },
  { id: 26, title: "Social Prescription Pads", description: "Appendix C — Customizable prescription pads for HCPs", category: "referral", type: "Template", date: "2025-11-01", subcategory: "Referral Process" },
  { id: 27, title: "What to Do When a Referral Arrives", description: "Step-by-step workflow guide for processing new referrals", category: "referral", type: "Guide", date: "2026-03-01", subcategory: "Referral Process", popular: true },
  { id: 28, title: "Sample Excel Tracking Sheet", description: "Pre-built spreadsheet with calculations for tracking referrals", category: "referral", type: "Template", date: "2025-11-01", subcategory: "Tracking" },
  { id: 29, title: "Personal Contact Information Form", description: "Appendix D — Form collected at first contact with referred client", category: "referral", type: "PDF", date: "2025-11-01", subcategory: "Tracking" },
  { id: 30, title: "How to Assign Client Codes", description: "Guide to creating unique client codes for privacy and tracking", category: "referral", type: "Guide", date: "2026-01-15", subcategory: "Tracking" },
  { id: 31, title: "Intake Checklist", description: "Complete checklist for the participant intake process", category: "intake", type: "PDF", date: "2026-02-28", subcategory: "Intake Process", popular: true },
  { id: 32, title: "Client Consent Form", description: "Appendix E — Required consent form for intake, 6-month and 12-month follow-ups", category: "intake", type: "PDF", date: "2025-11-01", subcategory: "Forms" },
  { id: 33, title: "Suggested Consent Script", description: "Appendix E — Word-for-word script for explaining consent to participants", category: "intake", type: "Guide", date: "2025-11-01", subcategory: "Forms" },
  { id: 34, title: "Client Information Form", description: "Appendix F — Master tracking form from intake through 12-month follow-up", category: "intake", type: "PDF", date: "2025-11-01", subcategory: "Forms", popular: true },
  { id: 35, title: "Leisure Interests: Guiding Questions", description: "Appendix G — Conversation prompts for exploring participant interests", category: "intake", type: "PDF", date: "2025-11-01", subcategory: "Intake Process" },
  { id: 36, title: "Outreach Call Guidance", description: "Step-by-step script and tips for the first outreach call", category: "intake", type: "Guide", date: "2026-03-05", subcategory: "Making First Contact", popular: true },
  { id: 37, title: "Common Barriers & How to Address Them", description: "Guide to overcoming barriers like transportation, cost, and hesitancy", category: "intake", type: "Guide", date: "2026-01-20", subcategory: "Making First Contact" },
  { id: 38, title: "Co-Creating a Participation Plan", description: "Workflow for collaboratively building an activity plan with the older adult", category: "intake", type: "Guide", date: "2026-02-10", subcategory: "Intake Process" },
  { id: 39, title: "First Visit Preparation Guide", description: "How to prepare for and conduct successful first visits", category: "first-visits", type: "Guide", date: "2026-03-01", subcategory: "Before the Visit", popular: true },
  { id: 40, title: "First Visit Checklist", description: "What to have ready — schedules, forms, tour plan", category: "first-visits", type: "PDF", date: "2026-02-15", subcategory: "Before the Visit" },
  { id: 41, title: "How to Conduct a First Visit", description: "Workflow guide covering welcome, tour, registration, and next steps", category: "first-visits", type: "Guide", date: "2026-03-01", subcategory: "During the Visit" },
  { id: 42, title: "Creative First Visit Strategies", description: "Shared practices — welcome cards, peer mentors, walking into first class", category: "first-visits", type: "Guide", date: "2026-02-20", subcategory: "During the Visit" },
  { id: 43, title: "Role of Volunteer Peer Mentors", description: "How peer mentors support new participants during first visits", category: "first-visits", type: "Guide", date: "2025-11-01", subcategory: "Peer Support" },
  { id: 44, title: "Follow-Up Tracker Template", description: "Template for tracking 3, 6, and 12-month follow-up dates", category: "participation", type: "Template", date: "2026-01-10", subcategory: "Attendance" },
  { id: 45, title: "Participation Notes Guide", description: "How to record and organize participation notes effectively", category: "participation", type: "Guide", date: "2026-02-05", subcategory: "Attendance" },
  { id: 46, title: "Data Entry Support", description: "Guide to entering attendance and participation data consistently", category: "participation", type: "Guide", date: "2026-01-20", subcategory: "Attendance" },
  { id: 47, title: "3-Month Informal Check-In Guide", description: "How to conduct the recommended 3-month check-in", category: "participation", type: "Guide", date: "2026-02-01", subcategory: "Follow-Ups" },
  { id: 48, title: "6 & 12-Month Formal Follow-Up Guide", description: "Workflow for required follow-up conversations and forms", category: "participation", type: "Guide", date: "2026-02-01", subcategory: "Follow-Ups", popular: true },
  { id: 49, title: "When to Discontinue a Participant", description: "Guidance on when and how to complete the discontinued section", category: "participation", type: "Guide", date: "2026-01-15", subcategory: "Follow-Ups" },
  { id: 50, title: "Client Stories Report Template", description: "Template for capturing impact stories beyond 12 months", category: "participation", type: "Template", date: "2025-11-01", subcategory: "Follow-Ups" },
  { id: 51, title: "Re-engagement Strategies", description: "Shared practices on re-engaging participants who stopped attending", category: "participation", type: "Guide", date: "2026-03-10", subcategory: "Monitoring" },
  { id: 52, title: "Reporting Requirements Overview", description: "What reports are due, when, and what data is needed", category: "reporting", type: "Guide", date: "2026-02-01", subcategory: "Overview", popular: true },
  { id: 53, title: "Common Tracking Tool", description: "Appendix H — Annual tracking tool for referral data and outcomes", category: "reporting", type: "Template", date: "2025-11-01", subcategory: "Common Tracking Tool", popular: true },
  { id: 54, title: "Common Tracking Tool Field Explainer", description: "Field-by-field guide explaining each section of the tracking tool", category: "reporting", type: "Guide", date: "2026-02-15", subcategory: "Common Tracking Tool" },
  { id: 55, title: "Year-End Financial Report", description: "Appendix L — Template for reporting subsidy and admin funding", category: "reporting", type: "Template", date: "2025-11-01", subcategory: "Financial Reporting" },
  { id: 56, title: "How to Complete the Financial Report", description: "Step-by-step guide for the year-end financial report", category: "reporting", type: "Guide", date: "2026-02-20", subcategory: "Financial Reporting" },
  { id: 57, title: "SurveyMonkey Submission Guide", description: "How to enter Client Information Form data into SurveyMonkey", category: "reporting", type: "Guide", date: "2026-03-01", subcategory: "Submitting Data" },
  { id: 58, title: "What Has Changed This Year", description: "Annual update on reporting field changes for 2025-2026", category: "reporting", type: "Guide", date: "2026-02-01", subcategory: "Overview" },
  { id: 59, title: "Micro-Grant Funding Guidelines", description: "L2W use of funding guidelines — what the subsidy can cover", category: "funding", type: "PDF", date: "2025-11-01", subcategory: "L2W Micro-Grant", popular: true },
  { id: 60, title: "Budget Templates", description: "Templates for tracking subsidy spending throughout the year", category: "funding", type: "Template", date: "2025-12-01", subcategory: "L2W Micro-Grant" },
  { id: 61, title: "Partnership Agreement Templates", description: "Sample agreements for community org partnerships", category: "funding", type: "Template", date: "2026-01-10", subcategory: "External Funding" },
  { id: 62, title: "Using L2W Data for Grant Applications", description: "Leveraging tracking data to strengthen funding applications", category: "funding", type: "Guide", date: "2026-02-15", subcategory: "External Funding" },
  { id: 63, title: "L2W Impact Report Year 1", description: "Project report on Links2Wellbeing impacts from the first year", category: "community", type: "PDF", date: "2025-04-01", subcategory: "Impact Stories" },
  { id: 64, title: "Social Prescribing: Pathway to Health & Wellness", description: "L2W video on the impact of social prescribing", category: "community", type: "Video", date: "2025-03-15", subcategory: "Impact Stories" },
  { id: 65, title: "L2W Data on Impact Infographic", description: "Visual summary of Phase 2 program outcomes and reach", category: "community", type: "PDF", date: "2025-10-01", subcategory: "Impact Stories" },
  { id: 66, title: "Mood Walks Partnership Cafe", description: "Conversation Cafe recording on the Mood Walks partnership", category: "community", type: "Video", date: "2025-09-10", subcategory: "Workshops" },
  { id: 67, title: "Evidence for Social Prescribing", description: "Research and evidence supporting the social prescribing model", category: "community", type: "PDF", date: "2025-06-01", subcategory: "Impact Stories" },
  { id: 68, title: "Social Prescribing in Canada Report (CISP)", description: "2025 national report on social prescribing from CISP", category: "community", type: "PDF", date: "2025-05-01", subcategory: "Impact Stories" },
];

export const DEADLINES = [
  { date: "Mar 31", label: "Q1 reporting due", urgent: true },
  { date: "Apr 15", label: "Common Tracking Tool due", urgent: true },
  { date: "Apr 15", label: "Financial Report due", urgent: false },
  { date: "Apr 30", label: "Return unspent funds", urgent: false },
];

export const WORKSHOPS = [
  { title: "Supporting hesitant participants", date: "Mar 6" },
  { title: "Reporting best practices", date: "Feb 28" },
  { title: "Expanding referral networks", date: "Feb 14" },
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

export const RECENT_IDS = [5, 54, 40, 31];

export const FORUM_POSTS = [
  { author: "Yamilly M.", centre: "YWCA Hamilton", time: "2h ago", title: "Tips for handling hesitant older adults on the first call", replies: 4, topic: "Intake" },
  { author: "Sarah K.", centre: "Peterborough SALC", time: "1d ago", title: "How we tracked referrals this year — template included", replies: 7, topic: "Reporting" },
  { author: "David L.", centre: "Ottawa Senior Centre", time: "3d ago", title: "Our creative first visit strategy with welcome cards", replies: 12, topic: "First Visits" },
  { author: "Priya N.", centre: "Thunder Bay SALC", time: "1w ago", title: "Re-engaging a participant who stopped attending after 3 months", replies: 5, topic: "Participation" },
  { author: "Jean F.", centre: "Windsor SALC", time: "2w ago", title: "Connected with community paramedics for referrals", replies: 9, topic: "Outreach" },
];
