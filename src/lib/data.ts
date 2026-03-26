export type ResourceType = "PDF" | "Guide" | "Template" | "Video";
export type CategoryId =
  | "training"
  | "outreach"
  | "intake"
  | "first-visits"
  | "ongoing-participation"
  | "follow-up"
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
  { id: "outreach", label: "Outreach / Promotion" },
  { id: "intake", label: "Intake & Invite" },
  { id: "first-visits", label: "First Visits" },
  { id: "ongoing-participation", label: "Ongoing Participation" },
  { id: "follow-up", label: "Follow Up" },
  { id: "reporting", label: "Reporting" },
  { id: "funding", label: "Funding & Grants" },
  { id: "community", label: "Community Resources" },
];

export const RESOURCES: Resource[] = [
  // ── TRAINING ──────────────────────────────────────────────────────────────────

  // Set up Links2Wellbeing at your centre
  { id: 1, title: "How to use this platform", description: "Introduction and guided walkthrough for new users", category: "training", type: "Guide", date: "2026-03-15", subcategory: "Set up Links2Wellbeing at your centre", popular: true },
  { id: 2, title: "Confidentiality & Privacy Form", description: "Protecting participant information — form for link workers", category: "training", type: "PDF", date: "2026-01-10", subcategory: "Set up Links2Wellbeing at your centre" },
  { id: 3, title: "Guide to Getting Started", description: "Steps to setting up Links2Wellbeing at your centre", category: "training", type: "Guide", date: "2025-12-01", subcategory: "Set up Links2Wellbeing at your centre", popular: true },

  // Support & Education — Understanding social prescription
  { id: 4, title: "Social Prescribing Pathway Flowchart", description: "Visual process flow of the L2W social prescribing pathway", category: "training", type: "PDF", date: "2026-02-20", subcategory: "Support & Education — Understanding social prescription" },
  { id: 5, title: "L2W Phase 2 Tools & Resources Package", description: "Full digital toolkit with all forms, templates, and guidance for 2025", category: "training", type: "PDF", date: "2025-11-01", subcategory: "Support & Education — Understanding social prescription", popular: true },
  { id: 68, title: "Social Prescribing in Canada Report (CISP)", description: "2025 national report on social prescribing", category: "training", type: "PDF", date: "2025-05-01", subcategory: "Support & Education — Understanding social prescription" },
  { id: 63, title: "L2W Impact Report Year 1", description: "Project report on L2W impacts from the first year", category: "training", type: "PDF", date: "2025-04-01", subcategory: "Support & Education — Understanding social prescription" },
  { id: 65, title: "L2W Data on Impact Infographic", description: "Visual summary of Phase 2 program outcomes", category: "training", type: "PDF", date: "2025-10-01", subcategory: "Support & Education — Understanding social prescription" },

  // Onboarding volunteers
  { id: 8, title: "Roles & Responsibilities (DCC, VLA, Peer Mentor)", description: "Appendix A — Overview of all L2W roles at SALCs", category: "training", type: "PDF", date: "2025-11-01", subcategory: "Onboarding volunteers" },
  { id: 9, title: "Volunteer Role Postings (VLA & Peer Mentor)", description: "Appendix J — Sample postings for recruiting volunteers", category: "training", type: "PDF", date: "2025-11-01", subcategory: "Onboarding volunteers" },
  { id: 10, title: "Volunteer Confidentiality Agreement", description: "Appendix K — Pledge and agreement form for volunteers", category: "training", type: "PDF", date: "2025-11-01", subcategory: "Onboarding volunteers" },

  // Training for orientation
  { id: 6, title: "Orientation for Designated Centre Contacts", description: "Training session recording for new DCCs joining L2W", category: "training", type: "Video", date: "2023-01-15", subcategory: "Training for orientation" },

  // Training for outreach
  { id: 12, title: "Canva 101 for Outreach Materials", description: "Check-in meeting recording on designing outreach materials", category: "training", type: "Video", date: "2025-09-15", subcategory: "Training for outreach" },
  { id: 22, title: "Strategic Healthcare Outreach Advice", description: "Advice for new L2W partners on building referral networks", category: "training", type: "Guide", date: "2025-05-20", subcategory: "Training for outreach" },
  { id: 20, title: "Connecting With Your Community Pharmacist", description: "Tips for building referral relationships with pharmacists", category: "training", type: "Guide", date: "2025-08-10", subcategory: "Training for outreach" },
  { id: 24, title: "Expanding Networks: Partnership Cafe", description: "Conversation Cafe on developing and nurturing partnerships", category: "training", type: "Video", date: "2025-11-20", subcategory: "Training for outreach" },

  // Training for Intake & Invite
  { id: 7, title: "Active Communication Skills & Strategies", description: "Training on building rapport with older adults during intake", category: "training", type: "Video", date: "2025-06-10", subcategory: "Training for Intake & Invite" },
  { id: 13, title: "Interview Tips for Building Rapport", description: "Conversation techniques for intake and first calls", category: "training", type: "Guide", date: "2025-07-20", subcategory: "Training for Intake & Invite" },
  { id: 81, title: "Intake/Co-Creation of Participation", description: "How to conduct intake and co-create a participation plan", category: "training", type: "Guide", date: "2026-01-10", subcategory: "Training for Intake & Invite" },

  // Training for reporting
  { id: 11, title: "Reporting Guidance 2025-2026", description: "Latest reporting requirements and field explainers", category: "training", type: "Guide", date: "2026-02-01", subcategory: "Training for reporting" },
  { id: 82, title: "Reporting Update 2024-2025", description: "Training session on reporting changes", category: "training", type: "Video", date: "2025-09-01", subcategory: "Training for reporting" },

  // Training for funding
  { id: 14, title: "Subsidies Guidance", description: "Check-in meeting recording on managing subsidies", category: "training", type: "Video", date: "2025-10-05", subcategory: "Training for funding" },
  { id: 83, title: "Microgrant and Funding Guidance", description: "How to use and manage L2W micro-grant funding", category: "training", type: "Guide", date: "2025-11-15", subcategory: "Training for funding" },

  // ── OUTREACH / PROMOTION ──────────────────────────────────────────────────────

  // Healthcare provider outreach
  { id: 15, title: "Outreach Cover Letter Template", description: "Appendix P — Customizable letter for healthcare providers", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Healthcare provider outreach", popular: true },
  { id: 16, title: "Outreach Postcards for HCPs", description: "Appendix M — Postcards for community partners", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Healthcare provider outreach" },
  { id: 18, title: "Promotional Poster for PCPs", description: "Appendix O — Poster introducing social prescribing", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Healthcare provider outreach" },
  { id: 19, title: "General Flyer for PCPs", description: "Appendix I — Informational flyer about L2W", category: "outreach", type: "PDF", date: "2025-11-01", subcategory: "Healthcare provider outreach" },
  { id: 21, title: "Identifying Patients With Unmet Social Needs", description: "Tools for HCPs to identify suitable referrals", category: "outreach", type: "PDF", date: "2025-06-15", subcategory: "Healthcare provider outreach" },
  { id: 84, title: "Sample Infographics", description: "Visual materials for outreach presentations", category: "outreach", type: "PDF", date: "2026-01-20", subcategory: "Healthcare provider outreach" },
  { id: 85, title: "Client Impact Stories", description: "Stories showing program impact for outreach use", category: "outreach", type: "Guide", date: "2026-02-10", subcategory: "Healthcare provider outreach" },

  // Community organization outreach
  { id: 17, title: "Outreach Postcards for Older Adults", description: "Appendix N — Postcards designed for older adults", category: "outreach", type: "Template", date: "2025-11-01", subcategory: "Community organization outreach" },
  { id: 23, title: "Customizable Canva Templates", description: "Editable design templates for community outreach", category: "outreach", type: "Template", date: "2026-01-10", subcategory: "Community organization outreach" },
  { id: 66, title: "Mood Walks Partnership Cafe", description: "Conversation Cafe on the Mood Walks partnership", category: "outreach", type: "Video", date: "2025-09-10", subcategory: "Community organization outreach" },
  { id: 86, title: "Social Tea Gathering Guide", description: "Ideas for hosting community engagement events", category: "outreach", type: "Guide", date: "2026-02-05", subcategory: "Community organization outreach" },

  // ── INTAKE & INVITE ───────────────────────────────────────────────────────────

  // Receiving Referrals
  { id: 25, title: "Client Referral Form", description: "Appendix B — Standard form used by HCPs to refer older adults", category: "intake", type: "PDF", date: "2025-11-01", subcategory: "Receiving Referrals", popular: true },
  { id: 26, title: "Social Prescription Pads", description: "Appendix C — Customizable prescription pads for HCPs", category: "intake", type: "Template", date: "2025-11-01", subcategory: "Receiving Referrals" },
  { id: 27, title: "What to Do When a Referral Arrives", description: "Step-by-step workflow for processing new referrals", category: "intake", type: "Guide", date: "2026-03-01", subcategory: "Receiving Referrals", popular: true },
  { id: 28, title: "Sample Excel Tracking Sheet", description: "Pre-built spreadsheet for tracking referrals", category: "intake", type: "Template", date: "2025-11-01", subcategory: "Receiving Referrals" },
  { id: 29, title: "Personal Contact Information Form", description: "Appendix D — Form collected at first contact", category: "intake", type: "PDF", date: "2025-11-01", subcategory: "Receiving Referrals" },
  { id: 30, title: "How to Assign Client Codes", description: "Creating unique client codes for privacy and tracking", category: "intake", type: "Guide", date: "2026-01-15", subcategory: "Receiving Referrals" },

  // Making First Contact
  { id: 36, title: "Outreach Call Guidance", description: "Step-by-step script and tips for the first outreach call", category: "intake", type: "Guide", date: "2026-03-05", subcategory: "Making First Contact", popular: true },
  { id: 37, title: "Common Barriers & How to Address Them", description: "Overcoming barriers like transportation, cost, hesitancy", category: "intake", type: "Guide", date: "2026-01-20", subcategory: "Making First Contact" },

  // Intake Process
  { id: 31, title: "Intake Checklist", description: "Complete checklist for the participant intake process", category: "intake", type: "PDF", date: "2026-02-28", subcategory: "Intake Process", popular: true },
  { id: 38, title: "Co-Creating a Participation Plan", description: "Collaboratively building an activity plan with the older adult", category: "intake", type: "Guide", date: "2026-02-10", subcategory: "Intake Process" },
  { id: 35, title: "Leisure Interests: Guiding Questions", description: "Appendix G — Prompts for exploring participant interests", category: "intake", type: "PDF", date: "2025-11-01", subcategory: "Intake Process" },

  // Forms
  { id: 32, title: "Client Consent Form", description: "Appendix E — Required consent form for intake and follow-ups", category: "intake", type: "PDF", date: "2025-11-01", subcategory: "Forms" },
  { id: 33, title: "Suggested Consent Script", description: "Word-for-word script for explaining consent", category: "intake", type: "Guide", date: "2025-11-01", subcategory: "Forms" },
  { id: 34, title: "Client Information Form", description: "Appendix F — Master tracking form from intake through 12 months", category: "intake", type: "PDF", date: "2025-11-01", subcategory: "Forms", popular: true },

  // ── FIRST VISITS ──────────────────────────────────────────────────────────────

  { id: 39, title: "First Visit Preparation Guide", description: "How to prepare for and conduct successful first visits", category: "first-visits", type: "Guide", date: "2026-03-01", subcategory: "Before the Visit", popular: true },
  { id: 40, title: "First Visit Checklist", description: "What to have ready — schedules, forms, tour plan", category: "first-visits", type: "PDF", date: "2026-02-15", subcategory: "Before the Visit" },
  { id: 41, title: "How to Conduct a First Visit", description: "Workflow guide covering welcome, tour, registration, and next steps", category: "first-visits", type: "Guide", date: "2026-03-01", subcategory: "During the Visit" },
  { id: 42, title: "Creative First Visit Strategies", description: "Shared practices — welcome cards, peer mentors, walking into first class", category: "first-visits", type: "Guide", date: "2026-02-20", subcategory: "During the Visit" },
  { id: 43, title: "Role of Volunteer Peer Mentors", description: "How peer mentors support new participants during first visits", category: "first-visits", type: "Guide", date: "2025-11-01", subcategory: "Peer Support" },

  // ── ONGOING PARTICIPATION ─────────────────────────────────────────────────────

  // Attendance
  { id: 69, title: "How to Track Attendance Using Sign-In Lists", description: "Working with attendance lists at your centre", category: "ongoing-participation", type: "Guide", date: "2026-03-10", subcategory: "Attendance" },
  { id: 70, title: "Working with ActiveNet or My Senior Centre", description: "Using attendance platforms for tracking", category: "ongoing-participation", type: "Guide", date: "2026-02-20", subcategory: "Attendance" },
  { id: 45, title: "Participation Notes Guide", description: "How to record and organize participation notes effectively", category: "ongoing-participation", type: "Guide", date: "2026-02-05", subcategory: "Attendance" },

  // Monitoring
  { id: 71, title: "Noticing When Someone Has Disengaged", description: "Signs to watch for and what to do", category: "ongoing-participation", type: "Guide", date: "2026-03-05", subcategory: "Monitoring" },
  { id: 72, title: "What to Do When a Participant Stops Attending", description: "Follow-up steps for disengaged participants", category: "ongoing-participation", type: "Guide", date: "2026-02-28", subcategory: "Monitoring" },
  { id: 73, title: "Re-engagement Strategies from Other SALCs", description: "Shared practices on bringing participants back", category: "ongoing-participation", type: "Guide", date: "2026-03-15", subcategory: "Monitoring" },

  // ── FOLLOW UP ─────────────────────────────────────────────────────────────────

  // Scheduled Follow-Ups
  { id: 47, title: "3-Month Informal Check-In Guide", description: "How to conduct the recommended 3-month check-in", category: "follow-up", type: "Guide", date: "2026-02-01", subcategory: "Scheduled Follow-Ups" },
  { id: 48, title: "6 and 12-Month Formal Follow-Up Guide", description: "Workflow for required follow-up conversations", category: "follow-up", type: "Guide", date: "2026-02-01", subcategory: "Scheduled Follow-Ups", popular: true },
  { id: 76, title: "Client Information Form (Follow-Up Sections)", description: "Sections B of the Client Information Form", category: "follow-up", type: "PDF", date: "2025-11-01", subcategory: "Scheduled Follow-Ups" },
  { id: 77, title: "Consent Review Script for Follow-Ups", description: "Reviewing consent before each follow-up", category: "follow-up", type: "Guide", date: "2026-01-15", subcategory: "Scheduled Follow-Ups" },

  // Discontinuation
  { id: 49, title: "When and How to Discontinue a Participant", description: "Guidance on completing the discontinued section", category: "follow-up", type: "Guide", date: "2026-01-15", subcategory: "Discontinuation" },

  // Beyond 12 Months
  { id: 50, title: "Client Stories Report Template", description: "Capturing impact stories from long-term participants", category: "follow-up", type: "Template", date: "2025-11-01", subcategory: "Beyond 12 Months" },
  { id: 80, title: "Transitioning Participants to General Membership", description: "Moving participants off L2W subsidy after 12 months", category: "follow-up", type: "Guide", date: "2026-03-01", subcategory: "Beyond 12 Months" },

  // ── REPORTING ─────────────────────────────────────────────────────────────────

  // Overview
  { id: 52, title: "Reporting Requirements Overview", description: "What reports are due, when, and what data is needed", category: "reporting", type: "Guide", date: "2026-02-01", subcategory: "Overview", popular: true },
  { id: 58, title: "What Has Changed This Year", description: "Annual update on reporting field changes for 2025-2026", category: "reporting", type: "Guide", date: "2026-02-01", subcategory: "Overview" },

  // Common Tracking Tool
  { id: 53, title: "Common Tracking Tool", description: "Appendix H — Annual tracking tool for referral data and outcomes", category: "reporting", type: "Template", date: "2025-11-01", subcategory: "Common Tracking Tool", popular: true },
  { id: 54, title: "Common Tracking Tool Field Explainer", description: "Field-by-field guide explaining each section", category: "reporting", type: "Guide", date: "2026-02-15", subcategory: "Common Tracking Tool" },

  // Financial Reporting
  { id: 55, title: "Year-End Financial Report", description: "Appendix L — Template for reporting subsidy and admin funding", category: "reporting", type: "Template", date: "2025-11-01", subcategory: "Financial Reporting" },
  { id: 56, title: "How to Complete the Financial Report", description: "Step-by-step guide for the year-end financial report", category: "reporting", type: "Guide", date: "2026-02-20", subcategory: "Financial Reporting" },

  // Submitting Data
  { id: 57, title: "SurveyMonkey Submission Guide", description: "How to enter Client Information Form data into SurveyMonkey", category: "reporting", type: "Guide", date: "2026-03-01", subcategory: "Submitting Data" },

  // ── FUNDING & GRANTS ──────────────────────────────────────────────────────────

  { id: 59, title: "Micro-Grant Funding Guidelines", description: "L2W use of funding guidelines — what the subsidy can cover", category: "funding", type: "PDF", date: "2025-11-01", subcategory: "L2W Micro-Grant", popular: true },
  { id: 60, title: "Budget Templates", description: "Templates for tracking subsidy spending throughout the year", category: "funding", type: "Template", date: "2025-12-01", subcategory: "L2W Micro-Grant" },
  { id: 61, title: "Partnership Agreement Templates", description: "Sample agreements for community org partnerships", category: "funding", type: "Template", date: "2026-01-10", subcategory: "External Funding" },
  { id: 62, title: "Using L2W Data for Grant Applications", description: "Leveraging tracking data to strengthen funding applications", category: "funding", type: "Guide", date: "2026-02-15", subcategory: "External Funding" },

  // ── COMMUNITY RESOURCES ───────────────────────────────────────────────────────

  { id: 64, title: "Social Prescribing: Pathway to Health & Wellness", description: "L2W video on the impact of social prescribing", category: "community", type: "Video", date: "2025-03-15", subcategory: "Impact Stories" },
  { id: 67, title: "Evidence for Social Prescribing", description: "Research and evidence supporting the social prescribing model", category: "community", type: "PDF", date: "2025-06-01", subcategory: "Impact Stories" },
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
    relatedIds: [2, 8, 5],
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
    relatedIds: [8, 9, 2],
  },
};

export const FORUM_POSTS = [
  { author: "Yamilly M.", centre: "YWCA Hamilton", time: "2h ago", title: "Tips for handling hesitant older adults on the first call", replies: 4, topic: "Intake" },
  { author: "Sarah K.", centre: "Peterborough SALC", time: "1d ago", title: "How we tracked referrals this year — template included", replies: 7, topic: "Reporting" },
  { author: "David L.", centre: "Ottawa Senior Centre", time: "3d ago", title: "Our creative first visit strategy with welcome cards", replies: 12, topic: "First Visits" },
  { author: "Priya N.", centre: "Thunder Bay SALC", time: "1w ago", title: "Re-engaging a participant who stopped attending after 3 months", replies: 5, topic: "Participation" },
  { author: "Jean F.", centre: "Windsor SALC", time: "2w ago", title: "Connected with community paramedics for referrals", replies: 9, topic: "Outreach" },
];
