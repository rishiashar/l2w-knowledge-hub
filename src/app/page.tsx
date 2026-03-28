"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
import {
  CATEGORIES,
  RESOURCES,
  DEADLINES,
  WORKSHOPS,
  FAQS,
  RECENT_IDS,
  FORUM_POSTS,
  FORUM_TOPIC_COLORS,
  RESOURCE_CONTENT,
  SIDEBAR_TREE_CATS,
  CATEGORY_SUBCATS,
  EVENTS,
  type CategoryId,
  type L2WEvent,
  type Resource,
  type ForumPost,
  type ForumComment,
  type SidebarSubcatNode,
} from "@/lib/data";
import SpotlightTutorial from "@/components/SpotlightTutorial";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// Tooltip imports removed — using bookmark icon instead

// ─── Types ────────────────────────────────────────────────────────────────────

type PageState =
  | { t: "home" }
  | { t: "cat"; id: CategoryId }
  | { t: "content"; resourceId: number; fromCategory: CategoryId }
  | { t: "search"; q: string }
  | { t: "bookmarks" }
  | { t: "faq" }
  | { t: "templates" }
  | { t: "workflows" }
  | { t: "recent" }
  | { t: "forum" }
  | { t: "forum-post"; postId: number }
  | { t: "ai-scenarios" }
  | { t: "community-cafe" }
  | { t: "community-workshops" }
  | { t: "community-impact" }
  | { t: "subcat"; categoryId: CategoryId; subcategory: string };

// ─── Badge color helper ───────────────────────────────────────────────────────

function typeBadgeClass(type: string) {
  switch (type) {
    case "PDF":
      return "bg-[#F2D5D5] text-[#C05656] border-transparent";
    case "Guide":
      return "bg-[#E6F4F4] text-[#2C7A7B] border-transparent";
    case "Template":
      return "bg-[#F5E6D6] text-[#D88A4B] border-transparent";
    case "Video":
      return "bg-[#F5F5F4] text-[#525252] border-transparent";
    default:
      return "";
  }
}

// ─── Back Button ─────────────────────────────────────────────────────────────

function BackButton({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 mb-6 -ml-1 px-2 py-1 rounded-lg text-sm text-[#78716C] hover:text-[#2C1810] hover:bg-gray-100 transition-all duration-150 group"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:-translate-x-0.5 transition-transform duration-150">
        <path d="M10 3L5.5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label || "Back"}
    </button>
  );
}

// ─── Bookmark Icon ───────────────────────────────────────────────────────────

function BookmarkIcon({ saved, onClick, className }: { saved: boolean; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`shrink-0 p-1 rounded transition-all duration-200 hover:bg-gray-100 ${className || ""}`}
      aria-label={saved ? "Remove bookmark" : "Add bookmark"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {saved ? (
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="#C96A2B" stroke="#C96A2B" />
        ) : (
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="none" stroke="#A8A29E" />
        )}
      </svg>
    </button>
  );
}

// ─── Greeting helper ──────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning Maria, welcome to The L2W Knowledge Hub.";
  if (hour < 17) return "Good afternoon Maria, welcome to The L2W Knowledge Hub.";
  return "Good evening Maria, welcome to The L2W Knowledge Hub.";
}

// ─── ResourceCard ─────────────────────────────────────────────────────────────

function ResourceCard({
  r,
  bookmarks,
  toggleBookmark,
  hidePopular,
}: {
  r: Resource;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  hidePopular?: boolean;
}) {
  const saved = bookmarks.includes(r.id);
  return (
    <div className="group/card flex items-center justify-between gap-4 py-3 border-b border-gray-100/80 last:border-0 cursor-pointer">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[14px] font-medium text-[#2C1810] group-hover/card:text-[#2C7A7B] transition-colors duration-200">{r.title}</span>
          <Badge variant="secondary" className={typeBadgeClass(r.type)}>{r.type}</Badge>
          {r.popular && !hidePopular && <Badge variant="secondary" className="bg-[#E6F4F4] text-[#2C7A7B] border-transparent">Popular</Badge>}
        </div>
        <p className="text-[12px] text-[#78716C] leading-relaxed">{r.description}</p>
        <p className="text-[11px] text-[#A8998E] mt-1">
          {r.date} · {CATEGORIES.find((c) => c.id === r.category)?.label}
        </p>
      </div>
      <BookmarkIcon
        saved={saved}
        onClick={() => toggleBookmark(r.id)}
        className={`shrink-0 ${saved ? "" : "opacity-0 group-hover/card:opacity-100"}`}
      />
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

function HomePage({
  bookmarks,
  toggleBookmark,
  setPage,
}: {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  setPage: (p: PageState) => void;
}) {
  const [greeting, setGreeting] = useState("Good morning Maria, welcome to The L2W Knowledge Hub.");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const popular = RESOURCES.filter((r) => r.popular).slice(0, 6);
  const whatsNew = [...RESOURCES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div>
      {/* Personalized Greeting */}
      <div className="mb-12 md:mb-16 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-8 h-[2px] bg-[#C96A2B] rounded-full" />
          <span className="text-[11px] font-semibold tracking-[0.15em] text-[#C96A2B] uppercase">Knowledge Hub</span>
        </div>
        <h1 className="text-3xl md:text-[40px] font-semibold tracking-[-0.02em] text-[#2C1810] leading-[1.1] mb-4">
          {greeting}
          <br />
          <span className="bg-gradient-to-r from-[#2C1810] to-[#6B5B4E] bg-clip-text text-transparent">Welcome to the L2W Knowledge Hub!</span>
        </h1>
        <p className="text-[15px] text-[#78716C] max-w-md leading-[1.7]">
          Your central hub for social prescribing workflows, community resources, and reporting protocols.
        </p>
      </div>

      {/* Bento Grid */}
      <section className="mb-12 animate-fade-up delay-1" data-tutorial="step-2">
        {/* Row 1: Hero row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <Card
            className="md:col-span-3 cursor-pointer bg-gradient-to-br from-[#E6F4F4] via-[#E6F4F4] to-[#D4EDDA]/40 border-0 ring-0 rounded-3xl transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_16px_48px_-12px_rgba(44,122,123,0.15)] relative overflow-hidden min-h-[220px] group"
            onClick={() => setPage({ t: "cat", id: "hub-guide" })}
          >
            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#2C7A7B]/[0.06] to-transparent rounded-bl-[80px]" />
            <div className="absolute bottom-4 right-6 w-24 h-24 rounded-full border border-[#2C7A7B]/[0.08]" />
            <div className="absolute bottom-8 right-10 w-12 h-12 rounded-full border border-[#2C7A7B]/[0.06]" />
            <CardHeader className="relative z-10 p-7 pb-6 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2C7A7B]/10 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2C7A7B] animate-pulse" />
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#2C7A7B]">Getting started</span>
                </div>
                <CardTitle className="text-[20px] font-semibold text-[#1A1A1A] leading-tight mb-2">
                  New here? Learn how to use this hub
                </CardTitle>
                <CardDescription className="text-[#5C6B6B] text-[14px] leading-relaxed max-w-sm">
                  A guided walkthrough for new link workers joining the Links2Wellbeing program.
                </CardDescription>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-[13px] font-medium text-[#2C7A7B] group-hover:gap-2.5 transition-all duration-300">
                Start learning
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </CardHeader>
          </Card>
          <Card
            className="md:col-span-2 cursor-pointer bg-gradient-to-br from-white via-white to-[#FEF7F0] border border-gray-200/60 ring-0 rounded-3xl transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_16px_48px_-12px_rgba(201,106,43,0.12)] hover:border-[#C96A2B]/20 relative overflow-hidden min-h-[220px] group"
            onClick={() => setPage({ t: "ai-scenarios" })}
          >
            {/* AI sparkle decorations */}
            <div className="absolute top-5 right-6">
              <svg width="28" height="28" viewBox="30 30 45 40" fill="#C96A2B" opacity="0.12">
                <path d="m59.5 46s-0.30078-2.8281-1.4883-4.0117c-1.1914-1.1797-4.0117-1.4883-4.0117-1.4883s2.8281-0.30078 4.0117-1.4883c1.1797-1.1914 1.4883-4.0117 1.4883-4.0117s0.30078 2.8281 1.4883 4.0117c1.1797 1.1797 4.0117 1.4883 4.0117 1.4883s-2.8281 0.30078-4.0117 1.4883c-1.1797 1.1797-1.4883 4.0117-1.4883 4.0117zm-13.25-3.5s-0.62109 5.7891-3.0391 8.2109c-2.4219 2.4219-8.2109 3.0391-8.2109 3.0391s5.7891 0.62109 8.2109 3.0391c2.4219 2.4219 3.0391 8.2109 3.0391 8.2109s0.62109-5.7891 3.0391-8.2109c2.4219-2.4219 8.2109-3.0391 8.2109-3.0391s-5.7891-0.62109-8.2109-3.0391c-2.4219-2.4219-3.0391-8.2109-3.0391-8.2109z" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#C96A2B]/[0.04] to-transparent rounded-tl-[60px]" />
            <CardHeader className="relative z-10 p-7 pb-6 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C96A2B]/10 mb-4">
                  <svg width="10" height="10" viewBox="30 30 45 40" fill="#C96A2B">
                    <path d="m59.5 46s-0.30078-2.8281-1.4883-4.0117c-1.1914-1.1797-4.0117-1.4883-4.0117-1.4883s2.8281-0.30078 4.0117-1.4883c1.1797-1.1914 1.4883-4.0117 1.4883-4.0117s0.30078 2.8281 1.4883 4.0117c1.1797 1.1797 4.0117 1.4883 4.0117 1.4883s-2.8281 0.30078-4.0117 1.4883c-1.1797 1.1797-1.4883 4.0117-1.4883 4.0117z" />
                  </svg>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#C96A2B]">AI-Powered</span>
                </div>
                <CardTitle className="text-[20px] font-semibold text-[#1A1A1A] leading-tight mb-2">
                  Practice with <span className="italic" style={{ fontFamily: 'var(--font-instrument-serif)' }}>AI Scenarios</span>
                </CardTitle>
                <CardDescription className="text-[#6B5B4E] text-[14px] leading-relaxed">
                  Rehearse real-world situations with AI feedback based on L2W best practices.
                </CardDescription>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-[13px] font-medium text-[#C96A2B] group-hover:gap-2.5 transition-all duration-300">
                Try a scenario
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Row 2: Three featured topics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            className="cursor-pointer bg-gradient-to-br from-[#F2D5D5] to-[#F2D5D5]/60 border-0 ring-0 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_36px_-8px_rgba(192,86,86,0.12)] relative overflow-hidden min-h-[170px] group"
            onClick={() => setPage({ t: "cat", id: "setup" })}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C05656]/[0.06] to-transparent rounded-bl-[48px]" />
            <CardHeader className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div>
                <CardTitle className="text-[17px] font-semibold text-[#1A1A1A] leading-snug mb-1.5">Set Up Your L2W Program</CardTitle>
                <CardDescription className="text-[#6B5B4E] text-[13px] leading-relaxed">Pathway, getting started guide, tools, and volunteer resources</CardDescription>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-[12px] font-medium text-[#9B4444] group-hover:gap-2.5 transition-all duration-300">
                Explore
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer bg-gradient-to-br from-[#E6F4F4] to-[#E6F4F4]/60 border-0 ring-0 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_36px_-8px_rgba(44,122,123,0.12)] relative overflow-hidden min-h-[170px] group"
            onClick={() => setPage({ t: "cat", id: "reporting" })}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#2C7A7B]/[0.06] to-transparent rounded-bl-[48px]" />
            <CardHeader className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div>
                <CardTitle className="text-[17px] font-semibold text-[#1A1A1A] leading-snug mb-1.5">Annual Reporting &amp; Evaluation</CardTitle>
                <CardDescription className="text-[#5C6B6B] text-[13px] leading-relaxed">Financial reports, tracking tools, and submission guides</CardDescription>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-[12px] font-medium text-[#2C7A7B] group-hover:gap-2.5 transition-all duration-300">
                Explore
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer bg-gradient-to-br from-[#F5E6D6] to-[#F5E6D6]/60 border-0 ring-0 rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_36px_-8px_rgba(216,138,75,0.12)] relative overflow-hidden min-h-[170px] group"
            onClick={() => setPage({ t: "cat", id: "clients" })}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D88A4B]/[0.06] to-transparent rounded-bl-[48px]" />
            <CardHeader className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div>
                <CardTitle className="text-[17px] font-semibold text-[#1A1A1A] leading-snug mb-1.5">Supporting Clients</CardTitle>
                <CardDescription className="text-[#6B5B4E] text-[13px] leading-relaxed">Intake, follow-up, participation tracking, and engagement</CardDescription>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-[12px] font-medium text-[#B07432] group-hover:gap-2.5 transition-all duration-300">
                Explore
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Recommended + Recently Added — asymmetric 2-col layout */}
      <section className="animate-fade-up delay-3">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Left: Recommended — stacked rows with left accent */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block w-6 h-[2px] bg-[#D88A4B] rounded-full" />
              <h2 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">
                Recommended for you
              </h2>
            </div>
            <div className="space-y-3">
              {popular.map((r) => {
                const saved = bookmarks.includes(r.id);
                const catLabel = CATEGORIES.find((c) => c.id === r.category)?.label || "";
                const accentMap: Record<string, string> = { "Guide": "#2C7A7B", "PDF": "#C05656", "Template": "#D88A4B", "Video": "#285E61" };
                const accent = accentMap[r.type] || "#2C7A7B";
                return (
                  <div
                    key={r.id}
                    className="group flex gap-4 p-4 rounded-xl bg-white border border-gray-200/50 hover:border-[#2C7A7B]/25 hover:shadow-[0_8px_24px_-12px_rgba(44,122,123,0.12)] transition-all duration-300 cursor-pointer active:scale-[0.99]"
                  >
                    {/* Left accent bar */}
                    <div className="w-1 shrink-0 rounded-full self-stretch" style={{ background: accent, opacity: 0.5 }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-medium text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors duration-200 leading-snug tracking-tight">{r.title}</p>
                          <p className="text-[12px] text-[#78716C] leading-relaxed mt-1 line-clamp-1 max-w-[50ch]">{r.description}</p>
                        </div>
                        <BookmarkIcon
                          saved={saved}
                          onClick={() => toggleBookmark(r.id)}
                          className={`shrink-0 mt-0.5 ${saved ? "" : "opacity-0 group-hover:opacity-100"}`}
                        />
                      </div>
                      <div className="flex items-center gap-3 mt-2.5">
                        <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md" style={{ background: `${accent}14`, color: accent }}>{r.type}</span>
                        <span className="text-[10px] text-[#A8998E]">{catLabel}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Recently Added — compact vertical feed */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block w-6 h-[2px] bg-[#2C7A7B] rounded-full" />
              <h2 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">
                Recently added
              </h2>
            </div>
            <div className="space-y-0 border-l-[1.5px] border-[#E6F4F4] ml-1 pl-5">
              {whatsNew.map((r, i) => {
                const [, month, day] = r.date.split("-");
                const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthStr = monthNames[parseInt(month)] || month;
                const accentMap: Record<string, string> = { "Guide": "#2C7A7B", "PDF": "#C05656", "Template": "#D88A4B", "Video": "#285E61" };
                const accent = accentMap[r.type] || "#2C7A7B";
                return (
                  <div key={r.id} className="group relative pb-5 last:pb-0 cursor-pointer">
                    {/* Timeline dot */}
                    <div className="absolute -left-[calc(1.25rem+4px)] top-[6px] w-[7px] h-[7px] rounded-full border-2 border-white" style={{ background: accent }} />
                    <p className="text-[10px] text-[#A8998E] font-medium mb-1">{monthStr} {day}</p>
                    <p className="text-[13px] font-medium text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors duration-200 leading-snug tracking-tight">{r.title}</p>
                    <span className="text-[10px] font-semibold tracking-wide uppercase mt-1 inline-block px-1.5 py-0.5 rounded" style={{ background: `${accent}14`, color: accent }}>{r.type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── AI Scenarios ─────────────────────────────────────────────────────────────

const AI_CATEGORIES = [
  { id: "first-contact", name: "First Contact Calls", description: "Practice your first phone call with a referred older adult", difficulty: "Good for beginners" },
  { id: "hesitant", name: "Hesitant Participants", description: "Handle situations where older adults are unsure about attending", difficulty: "Intermediate" },
  { id: "barriers", name: "Overcoming Barriers", description: "Help participants navigate transportation, cost, language, and other challenges", difficulty: "Intermediate" },
  { id: "follow-up", name: "Follow-Up Conversations", description: "Practice 3, 6, and 12-month check-ins and difficult follow-up situations", difficulty: "Intermediate" },
  { id: "outreach", name: "Outreach to Healthcare Providers", description: "Rehearse conversations with doctors, pharmacists, and health teams", difficulty: "Advanced" },
  { id: "reporting", name: "Reporting Questions", description: "Practice understanding reporting fields and resolving confusion", difficulty: "Good for beginners" },
] as const;

const PLACEHOLDER_SCENARIO = "Margaret Thompson, 78, was referred to your SALC by her family doctor at Hamilton FHT. The referral reason listed is \u2018loneliness.\u2019 What the referral doesn\u2019t mention is that Margaret\u2019s husband passed away 6 months ago and her daughter says she hasn\u2019t left the house in weeks and gets anxious around new people. You\u2019re about to call Margaret for the first time.";

const PLACEHOLDER_FEEDBACK = {
  intro: "Good approach. Here are some things to consider:",
  well: "You introduced yourself clearly and mentioned who referred Margaret, which builds trust.",
  consider: "Before jumping into program details, acknowledge her recent loss. A simple \u2018I understand this might be a big step\u2019 can make a huge difference. Also, consider offering a low-pressure first step like \u2018Would you like to come for a coffee and a tour?\u2019 rather than asking her to commit to a program right away.",
  bestPractice: "During the first call, your goal is to develop interest and let the client know what\u2019s available. The conversation should be brief and welcoming, not a full intake. (Reference: L2W Referral Process, Section D)",
};

function AIScenariosPage({ goHome }: { goHome: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scenarioText, setScenarioText] = useState("");
  const [feedbackData, setFeedbackData] = useState<{ well: string; consider: string; bestPractice: string } | null>(null);
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [scenarioError, setScenarioError] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  // Polish: counters
  const [scenarioCount, setScenarioCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  // Polish: clipboard toast
  const [showCopied, setShowCopied] = useState(false);

  const getCategoryName = (id: string) => AI_CATEGORIES.find((c) => c.id === id)?.name ?? id;

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;

  const generateScenario = async (categoryId: string) => {
    setIsLoadingScenario(true);
    setApiError(null);
    setScenarioError(false);
    setScenarioText("");
    try {
      const res = await fetch("/api/ai-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", category: getCategoryName(categoryId) }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "API key not configured") {
          setApiUnavailable(true);
          return;
        }
        throw new Error(data.error || "Failed to generate scenario");
      }
      setScenarioText(data.scenario);
      setScenarioCount((prev) => prev + 1);
    } catch {
      setScenarioError(true);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsLoadingScenario(false);
    }
  };

  const handleSelectCategory = (id: string) => {
    if (id !== selectedCategory) {
      setScenarioCount(0);
    }
    setSelectedCategory(id);
    setResponse("");
    setShowFeedback(false);
    setFeedbackData(null);
    setFeedbackError(false);
    generateScenario(id);
  };

  const handleSubmit = async () => {
    if (response.trim().length < 10) return;
    setIsSubmitting(true);
    setApiError(null);
    setFeedbackError(false);
    try {
      const res = await fetch("/api/ai-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "feedback",
          category: getCategoryName(selectedCategory!),
          scenario: scenarioText,
          response: response,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get feedback");
      const text: string = data.feedback;
      const wellMatch = text.match(/WHAT YOU DID WELL:\s*([\s\S]*?)(?=WHAT TO CONSIDER:|$)/i);
      const considerMatch = text.match(/WHAT TO CONSIDER:\s*([\s\S]*?)(?=L2W BEST PRACTICE:|$)/i);
      const bestMatch = text.match(/L2W BEST PRACTICE:\s*([\s\S]*?)$/i);
      setFeedbackData({
        well: wellMatch?.[1]?.trim() || text,
        consider: considerMatch?.[1]?.trim() || "",
        bestPractice: bestMatch?.[1]?.trim() || "",
      });
      setShowFeedback(true);
      // Track completed scenarios per category
      if (selectedCategory) {
        setCategoryCounts((prev) => ({
          ...prev,
          [selectedCategory]: (prev[selectedCategory] || 0) + 1,
        }));
      }
    } catch {
      setFeedbackError(true);
      setApiError("Couldn\u2019t get feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryFeedback = () => {
    setFeedbackError(false);
    setApiError(null);
    handleSubmit();
  };

  const handleTryAnother = () => {
    setResponse("");
    setShowFeedback(false);
    setFeedbackData(null);
    setFeedbackError(false);
    if (selectedCategory) generateScenario(selectedCategory);
  };

  const handleDifferentCategory = () => {
    setSelectedCategory(null);
    setResponse("");
    setShowFeedback(false);
    setFeedbackData(null);
    setScenarioText("");
    setScenarioError(false);
    setFeedbackError(false);
    setApiError(null);
    setScenarioCount(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && response.trim().length >= 10 && !isSubmitting && !showFeedback) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSaveScenario = async () => {
    const parts = [
      `CATEGORY: ${getCategoryName(selectedCategory!)}`,
      "",
      "SCENARIO:",
      scenarioText,
      "",
      "MY RESPONSE:",
      response,
    ];
    if (feedbackData) {
      parts.push("", "FEEDBACK:");
      if (feedbackData.well) parts.push(`What you did well: ${feedbackData.well}`);
      if (feedbackData.consider) parts.push(`What to consider: ${feedbackData.consider}`);
      if (feedbackData.bestPractice) parts.push(`L2W Best Practice: ${feedbackData.bestPractice}`);
    }
    try {
      await navigator.clipboard.writeText(parts.join("\n"));
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      // Fallback silently
    }
  };

  if (apiUnavailable) {
    return (
      <div className="max-w-2xl animate-fade-up">
        <BackButton onClick={goHome} label="Home" />
        <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-b from-[#FDFBF7] to-white p-8 mt-6 text-center">
          <p className="text-[15px] text-[#78716C] leading-relaxed">
            AI Scenarios is not available right now. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      <BackButton onClick={goHome} label="Home" />

      {/* Header with AI stars icon */}
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E6F4F4] to-[#D4EDDA] flex items-center justify-center shrink-0 mt-0.5">
          <svg width="22" height="22" viewBox="30 30 45 40" fill="#2C7A7B">
            <path d="m59.5 46s-0.30078-2.8281-1.4883-4.0117c-1.1914-1.1797-4.0117-1.4883-4.0117-1.4883s2.8281-0.30078 4.0117-1.4883c1.1797-1.1914 1.4883-4.0117 1.4883-4.0117s0.30078 2.8281 1.4883 4.0117c1.1797 1.1797 4.0117 1.4883 4.0117 1.4883s-2.8281 0.30078-4.0117 1.4883c-1.1797 1.1797-1.4883 4.0117-1.4883 4.0117zm-13.25-3.5s-0.62109 5.7891-3.0391 8.2109c-2.4219 2.4219-8.2109 3.0391-8.2109 3.0391s5.7891 0.62109 8.2109 3.0391c2.4219 2.4219 3.0391 8.2109 3.0391 8.2109s0.62109-5.7891 3.0391-8.2109c2.4219-2.4219 8.2109-3.0391 8.2109-3.0391s-5.7891-0.62109-8.2109-3.0391c-2.4219-2.4219-3.0391-8.2109-3.0391-8.2109zm14.5 17.5c-0.69141 0-1.25 0.55859-1.25 1.25s0.55859 1.25 1.25 1.25 1.25-0.55859 1.25-1.25-0.55859-1.25-1.25-1.25zm-22-19c0.69141 0 1.25-0.55859 1.25-1.25s-0.55859-1.25-1.25-1.25-1.25 0.55859-1.25 1.25 0.55859 1.25 1.25 1.25z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2C1810]">
            Practice with <span className="font-normal italic" style={{ fontFamily: 'var(--font-instrument-serif)' }}>AI Scenarios</span>
          </h1>
          <p className="text-sm text-[#78716C] mt-1.5 leading-relaxed max-w-lg">
            Rehearse real-world social prescribing situations. Pick a category, read the scenario, and practice your response.
          </p>
        </div>
      </div>

      {/* Intro callout for first-time users */}
      {!selectedCategory && (
        <div className="mt-6 mb-2 border-l-2 border-[#C96A2B] pl-4 py-1 opacity-0 animate-[fadeIn_300ms_ease_forwards]">
          <p className="text-[15px] text-[#78716C] leading-[1.7]">
            <span className="font-medium text-[#2C1810]">How it works:</span> Pick a category below. You&#39;ll receive a realistic scenario based on real situations link workers face. Type how you&#39;d respond, and get constructive feedback based on Links2Wellbeing best practices. There are no wrong answers — this is a safe space to practice.
          </p>
        </div>
      )}

      {/* Category label */}
      <div className="flex items-center gap-2 mt-8 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <p className="text-[11px] font-semibold tracking-[0.1em] text-[#78716C] uppercase">Choose a category</p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {AI_CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => handleSelectCategory(cat.id)}
            style={{ animationDelay: `${i * 50}ms` }}
            className={`group text-left rounded-2xl border p-5 transition-all duration-200 cursor-pointer animate-fade-up ${
              selectedCategory === cat.id
                ? "border-[#C96A2B]/40 bg-gradient-to-b from-[#FEF7F0] to-white shadow-[0_2px_12px_-4px_rgba(201,106,43,0.15)]"
                : "border-gray-200/80 bg-gradient-to-b from-[#FDFBF7] to-white hover:from-[#FAF6F1] hover:border-gray-300/80 hover:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)]"
            }`}
          >
            <p className="text-[15px] font-medium text-[#2C1810] mb-1">{cat.name}</p>
            <p className="text-[13px] text-[#78716C] leading-relaxed">{cat.description}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] text-[#A8A29E]">{cat.difficulty}</span>
              {categoryCounts[cat.id] > 0 && (
                <span className="text-[11px] text-[#A8A29E]">· {categoryCounts[cat.id]} practiced</span>
              )}
            </div>
            {selectedCategory === cat.id && (
              <div className="mt-3 pt-3 border-t border-[#C96A2B]/15 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C96A2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
                <span className="text-[11px] font-medium text-[#C96A2B] tracking-wide uppercase">Selected</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Scenario card */}
      {selectedCategory && (
        <div className="opacity-0 animate-[fadeSlideUp_300ms_ease_forwards]">
          {/* Scenario section label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                <path d="M8 9h8M8 13h4" opacity="0.5" />
              </svg>
              <p className="text-[11px] font-semibold tracking-[0.1em] text-[#78716C] uppercase">Scenario</p>
            </div>
            {scenarioCount > 0 && (
              <p className="text-[12px] text-[#A8A29E]">Scenario {scenarioCount} of this session</p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-gradient-to-b from-[#FDFBF7] to-white p-6 mb-6 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.06)]">
            {isLoadingScenario ? (
              <div className="py-8 text-center">
                <p className="text-[14px] text-[#78716C]">Generating your scenario...</p>
              </div>
            ) : scenarioError ? (
              <div className="py-6 text-center">
                <p className="text-[14px] text-[#78716C] mb-3">Something went wrong. Please try again.</p>
                <Button
                  variant="outline"
                  onClick={() => selectedCategory && generateScenario(selectedCategory)}
                  className="rounded-xl border-gray-200/80 text-[#2C1810] hover:bg-[#FDFBF7]"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <p className="text-[15px] text-[#2C1810] leading-[1.75] mb-6 max-w-[60ch]">
                  {scenarioText}
                </p>
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C7A7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <p className="text-[15px] font-semibold text-[#2C1810]">How would you respond?</p>
                </div>
              </>
            )}
          </div>

          {/* Response input section */}
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <p className="text-[11px] font-semibold tracking-[0.1em] text-[#78716C] uppercase">Your response</p>
          </div>

          <div className="mb-6">
            <textarea
              value={response}
              onChange={(e) => !showFeedback && setResponse(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={showFeedback}
              disabled={isLoadingScenario || isSubmitting}
              placeholder="Type what you would say or do in this situation..."
              rows={5}
              className={`w-full rounded-2xl border border-gray-200/80 px-5 py-4 text-[15px] text-[#2C1810] placeholder:text-[#A8A29E] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-[#C96A2B]/20 focus:border-[#C96A2B]/50 transition-all duration-200 shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04)] ${showFeedback ? "bg-[#FAFAF9] cursor-default" : "bg-white"}`}
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-[12px] text-[#A8A29E]">
                  {response.length > 0 && response.trim().length < 10
                    ? `${response.trim().length}/10 characters minimum`
                    : response.trim().length > 0
                    ? `${wordCount} word${wordCount !== 1 ? "s" : ""}`
                    : ""}
                </p>
              </div>
              {!showFeedback && (
                <div className="flex flex-col items-end gap-1">
                  <Button
                    onClick={handleSubmit}
                    disabled={response.trim().length < 10 || isSubmitting || isLoadingScenario || scenarioError}
                    className="bg-[#C96A2B] hover:bg-[#B55D23] active:scale-[0.98] text-white rounded-xl px-6 h-10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(201,106,43,0.3)] hover:shadow-[0_4px_12px_-2px_rgba(201,106,43,0.4)] flex items-center gap-2"
                  >
                    {isSubmitting ? "Getting feedback..." : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22,2 15,22 11,13 2,9" />
                        </svg>
                        Submit Response
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-[#A8A29E]">{navigator?.platform?.includes("Mac") ? "⌘" : "Ctrl"}+Enter to submit</p>
                </div>
              )}
            </div>
            {feedbackError && !showFeedback && (
              <div className="mt-3 flex items-center gap-3">
                <p className="text-[13px] text-[#78716C]">Couldn&#39;t get feedback. Please try again.</p>
                <Button
                  variant="outline"
                  onClick={handleRetryFeedback}
                  className="rounded-xl border-gray-200/80 text-[#2C1810] hover:bg-[#FDFBF7] text-[13px] h-8 px-3"
                >
                  Retry
                </Button>
              </div>
            )}
          </div>

          {/* Feedback card */}
          {showFeedback && (
            <div className="opacity-0 animate-[fadeSlideUp_300ms_ease_forwards]">
              {/* Feedback section label */}
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2C7A7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                </svg>
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[#2C7A7B] uppercase">AI Feedback</p>
              </div>

              <div className="space-y-3 mb-6">
                {feedbackData?.well && (
                  <div className="rounded-2xl border border-green-100 bg-[#F0FDF4] p-5">
                    <p className="text-[13px] font-semibold tracking-[0.08em] text-[#2D6A4F] uppercase mb-2">What you did well</p>
                    <p className="text-[15px] text-[#2C1810] leading-[1.7]">{feedbackData.well}</p>
                  </div>
                )}
                {feedbackData?.consider && (
                  <div className="rounded-2xl border border-orange-100 bg-[#FFF7ED] p-5">
                    <p className="text-[13px] font-semibold tracking-[0.08em] text-[#92400E] uppercase mb-2">What to consider</p>
                    <p className="text-[15px] text-[#2C1810] leading-[1.7]">{feedbackData.consider}</p>
                  </div>
                )}
                {feedbackData?.bestPractice && (
                  <div className="rounded-2xl border border-gray-100 bg-[#FAFAF9] p-5">
                    <p className="text-[13px] font-semibold tracking-[0.08em] text-[#2C7A7B] uppercase mb-2">L2W Best Practice</p>
                    <p className="text-[15px] text-[#2C1810] leading-[1.7]">{feedbackData.bestPractice}</p>
                  </div>
                )}
              </div>

              {/* Save scenario link */}
              <div className="mb-5 relative">
                <button
                  onClick={handleSaveScenario}
                  className="text-[13px] text-[#78716C] hover:text-[#2C1810] underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors duration-200"
                >
                  Save this scenario
                </button>
                {showCopied && (
                  <span className="ml-3 text-[13px] text-[#2C7A7B] font-medium animate-[fadeIn_200ms_ease_forwards]">
                    Copied to clipboard
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleTryAnother}
                  className="rounded-xl border-gray-200/80 text-[#2C1810] hover:bg-[#FDFBF7] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1,4 1,10 7,10" />
                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                  </svg>
                  Try Another Scenario
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDifferentCategory}
                  className="rounded-xl border-gray-200/80 text-[#2C1810] hover:bg-[#FDFBF7] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  Try a Different Category
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CategoryPage (subcategory box grid) ─────────────────────────────────────

function CategoryPage({
  id,
  goHome,
  setPage,
}: {
  id: CategoryId;
  goHome: () => void;
  setPage: (p: PageState) => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === id);
  const resources = RESOURCES.filter((r) => r.category === id);
  // Use CATEGORY_SUBCATS for ordering; flatten children into the list
  const subcatNodes = CATEGORY_SUBCATS[id] || [];
  const subcategories: string[] = [];
  subcatNodes.forEach((node) => {
    if (!node.isContainer) subcategories.push(node.name);
    if (node.children) {
      node.children.forEach((child) => {
        // Only add child as a separate subcategory if it actually has resources
        if (resources.some((r) => r.subcategory === child)) {
          subcategories.push(child);
        }
      });
    }
  });
  // Fallback: add any subcategories from resources not in the config
  const configuredSubs = new Set(subcategories);
  resources.forEach((r) => {
    if (!configuredSubs.has(r.subcategory)) subcategories.push(r.subcategory);
    configuredSubs.add(r.subcategory);
  });

  const typeIcon = (type: string) => {
    switch (type) {
      case "Video": return <PlayCircle size={14} className="text-[#C05656]" />;
      case "PDF": return <FileText size={14} className="text-[#D88A4B]" />;
      case "Template": return <FileText size={14} className="text-[#7C3AED]" />;
      default: return <NotebookText size={14} className="text-[#2C7A7B]" />;
    }
  };

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2C1810]">{cat?.label}</h1>
        <p className="text-sm text-[#A8998E] mt-1.5">{subcategories.length} sections · {resources.length} resources</p>
      </div>

      {/* Subcategory sections — stacked list layout */}
      <div className="space-y-6">
        {subcategories.map((sub, si) => {
          const items = resources.filter((r) => r.subcategory === sub);
          return (
            <div key={sub}>
              {/* Section header — clickable to go to subcategory */}
              <button
                className="w-full group/sec flex items-center gap-3 mb-3 text-left"
                onClick={() => setPage({ t: "subcat", categoryId: id, subcategory: sub })}
              >
                <div className="w-7 h-7 rounded-lg bg-[#E6F4F4]/60 flex items-center justify-center shrink-0 group-hover/sec:bg-[#E6F4F4] transition-colors">
                  <span className="text-xs font-bold text-[#2C7A7B]">{si + 1}</span>
                </div>
                <h2 className="text-[15px] font-semibold text-[#2C1810] group-hover/sec:text-[#2C7A7B] transition-colors flex-1">{sub}</h2>
                <span className="text-[10px] font-medium text-[#A8998E] bg-[#F7F5F3] px-2 py-0.5 rounded-full">{items.length}</span>
                <ChevronRight size={14} className="text-[#D4CFC9] group-hover/sec:text-[#2C7A7B] group-hover/sec:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Resource list */}
              <div className="ml-10 space-y-1">
                {items.map((r) => {
                  const hasContent = !!RESOURCE_CONTENT[r.id];
                  const isReadable = r.type === "Guide" || r.type === "Video" || hasContent;
                  const hasDownload = !!r.downloadUrl;
                  const rowInner = (
                    <>
                      <div className="w-6 h-6 rounded-md bg-[#F7F5F3] group-hover/row:bg-white flex items-center justify-center shrink-0 transition-colors">
                        {hasDownload ? <Download size={14} className="text-[#D88A4B]" /> : typeIcon(r.type)}
                      </div>
                      <span className="flex-1 text-sm text-[#3D3229] group-hover/row:text-[#2C7A7B] transition-colors leading-snug">{r.title}</span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity ${
                        hasDownload ? "bg-[#F5E6D6]/60 text-[#D88A4B]" : isReadable ? "bg-[#E6F4F4]/60 text-[#2C7A7B]" : r.type === "Template" ? "bg-[#EDE9FE]/60 text-[#7C3AED]" : "bg-[#F5E6D6]/60 text-[#D88A4B]"
                      }`}>{hasDownload ? "Download" : isReadable ? (r.type === "Video" ? "Watch" : "Read") : r.type}</span>
                    </>
                  );
                  return hasDownload ? (
                    <a key={r.id} href={r.downloadUrl} download className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 hover:bg-[#F7F5F3] group/row">
                      {rowInner}
                    </a>
                  ) : (
                    <button
                      key={r.id}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 hover:bg-[#F7F5F3] group/row"
                      onClick={() => setPage({ t: "content", resourceId: r.id, fromCategory: id })}
                    >
                      {rowInner}
                    </button>
                  );
                })}
              </div>

              {/* Divider between sections */}
              {si < subcategories.length - 1 && <Separator className="mt-5 bg-gray-200/50" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── EventsPage ─────────────────────────────────────────────────────────────

function EventsPage({ goHome }: { goHome: () => void }) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  const now = new Date("2026-03-27");
  const upcoming = EVENTS.filter((e) => new Date(e.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = EVENTS.filter((e) => new Date(e.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const filtered = filter === "upcoming" ? upcoming : filter === "past" ? past : [...upcoming, ...past];

  const typeColor: Record<string, { bg: string; text: string; label: string }> = {
    workshop: { bg: "bg-[#E6F4F4]", text: "text-[#2C7A7B]", label: "Workshop" },
    cafe: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", label: "Café" },
    "check-in": { bg: "bg-[#EDE9FE]", text: "text-[#7C3AED]", label: "Check-In" },
    webinar: { bg: "bg-[#F2D5D5]", text: "text-[#C05656]", label: "Webinar" },
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return { month: months[d.getMonth()].toUpperCase(), day: String(d.getDate()).padStart(2, "0"), weekday: days[d.getDay()] };
  };

  const isThisWeek = (iso: string) => {
    const d = new Date(iso);
    const diff = d.getTime() - now.getTime();
    return diff >= 0 && diff < 7 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2C1810]">Upcoming Events</h1>
        <p className="text-sm text-[#A8998E] mt-1.5">{upcoming.length} upcoming · {past.length} past</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6">
        {(["upcoming", "past", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
              filter === f
                ? "bg-[#2C7A7B] text-white"
                : "bg-[#F7F5F3] text-[#6B5B4E] hover:bg-[#EDE8E3]"
            }`}
          >
            {f === "upcoming" ? `Upcoming (${upcoming.length})` : f === "past" ? `Past (${past.length})` : "All"}
          </button>
        ))}
      </div>

      {/* Event cards */}
      <div className="space-y-3">
        {filtered.map((event) => {
          const { month, day, weekday } = formatDate(event.date);
          const tc = typeColor[event.type] || typeColor.workshop;
          const isPast = new Date(event.date) < now;
          const soon = isThisWeek(event.date);

          return (
            <Card key={event.id} className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isPast ? "opacity-60 border-gray-200/60" : "border-gray-200/80 hover:shadow-md hover:border-[#2C7A7B]/20"}`}>
              <div className="flex">
                {/* Date column */}
                <div className={`w-20 shrink-0 flex flex-col items-center justify-center py-5 ${isPast ? "bg-[#F7F5F3]/50" : "bg-[#E6F4F4]/30"}`}>
                  <span className={`text-[10px] font-bold tracking-widest ${isPast ? "text-[#A8998E]" : "text-[#2C7A7B]"}`}>{month}</span>
                  <span className={`text-2xl font-bold leading-none mt-0.5 ${isPast ? "text-[#6B5B4E]" : "text-[#2C1810]"}`}>{day}</span>
                  <span className="text-[10px] text-[#A8998E] mt-1">{weekday}</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tc.bg} ${tc.text}`}>{tc.label}</span>
                      {soon && !isPast && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">This Week</span>}
                      {isPast && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F5F5F4] text-[#A8998E]">Past</span>}
                    </div>
                  </div>

                  <h3 className={`text-[15px] font-semibold leading-snug mb-1.5 ${isPast ? "text-[#6B5B4E]" : "text-[#2C1810]"}`}>{event.title}</h3>
                  <p className="text-xs text-[#A8998E] leading-relaxed mb-3">{event.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-[#6B5B4E]">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-[#A8998E]" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#A8998E]" />
                      {event.location}
                    </span>
                  </div>

                  {/* Tags */}
                  {event.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-3">
                      {event.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-medium text-[#A8998E] bg-[#F7F5F3] px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-[#A8998E]">No events found.</div>
        )}
      </div>
    </div>
  );
}

// ─── SubcategoryPage ─────────────────────────────────────────────────────────

function SubcategoryPage({
  categoryId,
  subcategory,
  bookmarks,
  toggleBookmark,
  setPage,
}: {
  categoryId: CategoryId;
  subcategory: string;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  setPage: (p: PageState) => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const resources = RESOURCES.filter((r) => r.category === categoryId && r.subcategory === subcategory);

  return (
    <div className="animate-fade-up max-w-2xl">
      <BackButton onClick={() => setPage({ t: "cat", id: categoryId })} label={`Back to ${cat?.label}`} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2C7A7B] bg-[#E6F4F4]/50 px-2.5 py-1 rounded-full">{cat?.label}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">{subcategory}</h1>
        <p className="text-sm text-[#A8998E] mt-1">{resources.length} resource{resources.length !== 1 ? "s" : ""} available</p>
      </div>

      {resources.length ? (
        <div className="space-y-2.5">
          {resources.map((r, i) => {
            const hasContent = !!RESOURCE_CONTENT[r.id];
            const isReadable = r.type === "Guide" || r.type === "Video" || hasContent;
            const hasDownload = !!r.downloadUrl;

            const cardInner = (
              <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-gray-200/70 bg-white hover:border-[#2C7A7B]/30 hover:shadow-sm transition-all duration-200">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  hasDownload
                    ? "bg-[#F5E6D6]/50 group-hover/card:bg-[#F5E6D6]/70"
                    : isReadable
                    ? "bg-[#E6F4F4]/50 group-hover/card:bg-[#E6F4F4]/70"
                    : r.type === "Template" ? "bg-[#EDE9FE]/40 group-hover/card:bg-[#EDE9FE]/60"
                    : "bg-[#F5E6D6]/50 group-hover/card:bg-[#F5E6D6]/70"
                }`}>
                  {hasDownload
                    ? <Download size={16} className="text-[#D88A4B]" />
                    : isReadable
                    ? (r.type === "Video" ? <PlayCircle size={16} className="text-[#2C7A7B]" /> : <NotebookText size={16} className="text-[#2C7A7B]" />)
                    : r.type === "Template" ? <FileText size={16} className="text-[#7C3AED]" />
                    : <FileText size={16} className="text-[#D88A4B]" />}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-medium text-[#2C1810] group-hover/card:text-[#2C7A7B] transition-colors duration-150 leading-snug">{r.title}</span>
                  <p className="text-xs text-[#A8998E] leading-relaxed mt-0.5 line-clamp-1">{r.description}</p>
                </div>
                {/* Action hint */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    hasDownload ? "bg-[#F5E6D6]/60 text-[#D88A4B]" : isReadable ? "bg-[#E6F4F4]/60 text-[#2C7A7B]" : r.type === "Template" ? "bg-[#EDE9FE]/60 text-[#7C3AED]" : "bg-[#F5E6D6]/60 text-[#D88A4B]"
                  }`}>{hasDownload ? "Download" : isReadable ? (r.type === "Video" ? "Watch" : "Read") : r.type}</span>
                  {hasDownload
                    ? <Download size={14} className="text-[#D4CFC9] group-hover/card:text-[#D88A4B] transition-all duration-150" />
                    : <ArrowRight size={14} className="text-[#D4CFC9] group-hover/card:text-[#2C7A7B] group-hover/card:translate-x-0.5 transition-all duration-150" />}
                </div>
              </div>
            );

            return hasDownload ? (
              <a key={r.id} href={r.downloadUrl} download className="block group/card">
                {cardInner}
              </a>
            ) : (
              <button
                key={r.id}
                className="w-full group/card text-left"
                onClick={() => setPage({ t: "content", resourceId: r.id, fromCategory: categoryId })}
              >
                {cardInner}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-gray-200/80 bg-[#FAFAF9]">
          <div className="w-12 h-12 rounded-full bg-[#F5E6D6]/40 mx-auto mb-3 flex items-center justify-center">
            <FileText size={20} className="text-[#A8998E]" />
          </div>
          <p className="text-sm font-medium text-[#6B5B4E]">No resources yet</p>
          <p className="text-xs text-[#A8998E] mt-1">Content is being added to this section</p>
        </div>
      )}
    </div>
  );
}

// ─── ContentPage (individual resource view) ─────────────────────────────────

function ContentPage({
  resourceId,
  fromCategory,
  bookmarks,
  toggleBookmark,
  setPage,
}: {
  resourceId: number;
  fromCategory: CategoryId;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  setPage: (p: PageState) => void;
}) {
  const r = RESOURCES.find((x) => x.id === resourceId);
  const cat = CATEGORIES.find((c) => c.id === fromCategory);
  const content = RESOURCE_CONTENT[resourceId];
  const saved = bookmarks.includes(resourceId);

  if (!r) return null;

  // Find related resources — use content.relatedIds if available, else same subcategory
  const related = content?.relatedIds
    ? content.relatedIds.map((id) => RESOURCES.find((x) => x.id === id)).filter(Boolean) as Resource[]
    : RESOURCES.filter((x) => x.category === r.category && x.subcategory === r.subcategory && x.id !== r.id).slice(0, 3);

  const typeIcon = (type: string, size = 15) => {
    switch (type) {
      case "Video": return <PlayCircle size={size} className="text-[#C05656]" />;
      case "PDF": return <FileText size={size} className="text-[#D88A4B]" />;
      case "Template": return <FileText size={size} className="text-[#7C3AED]" />;
      default: return <NotebookText size={size} className="text-[#2C7A7B]" />;
    }
  };

  const typeBadgeColor = (type: string) => {
    const isReadable = type === "Guide" || type === "Video";
    if (isReadable) return "bg-[#E6F4F4]/60 text-[#2C7A7B]";
    switch (type) {
      case "PDF": return "bg-[#F5E6D6]/60 text-[#D88A4B]";
      case "Template": return "bg-[#EDE9FE]/60 text-[#7C3AED]";
      default: return "bg-[#E6F4F4]/60 text-[#2C7A7B]";
    }
  };

  const typeBadgeLabel = (type: string) => {
    switch (type) {
      case "Guide": return "Read";
      case "Video": return "Watch";
      default: return type;
    }
  };

  return (
    <div className="animate-fade-up max-w-2xl">
      <BackButton onClick={() => setPage({ t: "cat", id: fromCategory })} label={cat?.label} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2C7A7B] bg-[#E6F4F4]/50 px-2.5 py-1 rounded-full">{cat?.label}</span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeBadgeColor(r.type)}`}>{r.type}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810] leading-tight">{r.title}</h1>
          <BookmarkIcon saved={saved} onClick={() => toggleBookmark(resourceId)} />
        </div>
        <p className="text-sm text-[#6B5B4E] mt-2 leading-relaxed">{r.description}</p>
      </div>

      <Separator className="bg-gray-200/60 mb-8" />

      {/* Content area */}
      {content ? (
        /* Rich content page */
        <div className="space-y-8">
          {content.intro && (
            <div className="space-y-4">
              {content.intro.split("\n\n").map((p, i) => (
                <p key={i} className="text-[15px] text-[#3D3229] leading-[1.75]">{p}</p>
              ))}
            </div>
          )}

          {content.sectionTitle && (
            <h2 className="text-lg font-semibold text-[#2C1810] pt-2">{content.sectionTitle}</h2>
          )}

          {content.sections.map((s, i) => (
            <div key={i} className="relative">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-md bg-[#E6F4F4]/60 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-[#2C7A7B]">{i + 1}</span>
                </div>
                <h3 className="text-base font-semibold text-[#2C1810] leading-snug pt-0.5">{s.heading}</h3>
              </div>
              <div className="pl-10">
                {s.body && <p className="text-[15px] text-[#3D3229] leading-[1.75]">{s.body}</p>}
                {s.bullets && (
                  <ul className="mt-3 space-y-2">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[15px] text-[#3D3229] leading-[1.7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2C7A7B]/50 shrink-0 mt-2.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          {content.closing && (
            <div className="border-t border-gray-200/60 mt-8 pt-6">
              <p className="text-[15px] text-[#3D3229] leading-[1.75]">{content.closing}</p>
            </div>
          )}

          {content.callout && (
            <div className="flex gap-3 bg-[#F5E6D6]/30 border border-[#C96A2B]/15 rounded-xl p-4">
              <div className="shrink-0 mt-0.5">
                <Lightbulb size={16} className="text-[#C96A2B]" />
              </div>
              <p className="text-sm text-[#6B5B4E] leading-relaxed">{content.callout}</p>
            </div>
          )}

          {r.type === "PDF" && (
            <Button className="bg-[#2C7A7B] hover:bg-[#245F60] text-white mt-2 gap-2 rounded-lg">
              <Download size={16} />
              Download {r.title} (PDF)
            </Button>
          )}
        </div>
      ) : r.type === "Video" ? (
        /* Video placeholder */
        <div>
          <div className="bg-gradient-to-br from-[#F7F5F3] to-[#EDE9E5] rounded-xl aspect-video flex items-center justify-center mb-6 border border-gray-200/50">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/90 mx-auto mb-3 flex items-center justify-center shadow-sm border border-gray-200/40">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#2C7A7B"><polygon points="9,6 19,12 9,18" /></svg>
              </div>
              <p className="text-sm font-medium text-[#6B5B4E]">Video: {r.title}</p>
            </div>
          </div>
          <p className="text-[15px] text-[#3D3229] leading-[1.75]">{r.description}</p>
        </div>
      ) : (r.type === "PDF" || r.type === "Template") ? (
        /* PDF / Template download page */
        <div>
          <p className="text-[15px] text-[#3D3229] leading-[1.75] mb-6">{r.description}</p>
          <div className="flex items-center gap-4 p-5 bg-[#F7F5F3] rounded-xl border border-gray-200/50">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-200/40">
              {r.type === "PDF" ? <Download size={22} className="text-[#D88A4B]" /> : <FileText size={22} className="text-[#7C3AED]" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#2C1810]">{r.title}</p>
              <p className="text-xs text-[#A8998E]">{r.type} document</p>
            </div>
            <Button className="bg-[#2C7A7B] hover:bg-[#245F60] text-white gap-2 rounded-lg">
              <Download size={16} />
              Download
            </Button>
          </div>
        </div>
      ) : (
        /* Guide without rich content */
        <div>
          <p className="text-[15px] text-[#3D3229] leading-[1.75] mb-6">{r.description}</p>
          <div className="text-center py-12 px-6 rounded-xl border border-dashed border-gray-200/80 bg-[#FAFAF9]">
            <div className="w-10 h-10 rounded-full bg-[#E6F4F4]/50 mx-auto mb-3 flex items-center justify-center">
              <FileText size={18} className="text-[#2C7A7B]/60" />
            </div>
            <p className="text-sm text-[#78716C]">Full guide content will be available here.</p>
          </div>
        </div>
      )}

      {/* Related Resources */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200/60">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A8998E] mb-4">Related Resources</h3>
          <div className="space-y-2">
            {related.map((rel) => (
              <button
                key={rel.id}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 hover:bg-[#F7F5F3] hover:shadow-sm group/rel border border-gray-200/50"
                onClick={() => setPage({ t: "content", resourceId: rel.id, fromCategory })}
              >
                <div className="w-8 h-8 rounded-lg bg-[#F7F5F3] group-hover/rel:bg-white flex items-center justify-center shrink-0 transition-colors duration-200">
                  {typeIcon(rel.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-[#2C1810] group-hover/rel:text-[#2C7A7B] transition-colors duration-150 font-medium">{rel.title}</span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeBadgeColor(rel.type)}`}>{typeBadgeLabel(rel.type)}</span>
                <ChevronRight size={14} className="text-[#D4CFC9] group-hover/rel:text-[#2C7A7B] transition-colors duration-150 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SearchPage ───────────────────────────────────────────────────────────────

function SearchPage({
  q,
  bookmarks,
  toggleBookmark,
  goHome,
}: {
  q: string;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  goHome: () => void;
}) {
  const results = RESOURCES.filter(
    (r) =>
      r.title.toLowerCase().includes(q.toLowerCase()) ||
      r.description.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">
        Search: &ldquo;{q}&rdquo;
      </h1>
      <p className="text-sm text-[#A8998E] mt-1">{results.length} results</p>
      <div className="mt-6">
        {results.length ? (
          <Card className="border-gray-200/80 shadow-sm">
            <CardContent className="p-0 px-5">
              {results.map((r) => (
                <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200/80 shadow-sm">
            <CardContent className="text-center py-20">
              <div className="w-10 h-10 rounded-xl bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8998E" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <p className="text-sm font-medium text-[#6B5B4E]">No results found</p>
              <p className="text-xs text-[#A8998E] mt-1">Try different keywords</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── BookmarksPage ────────────────────────────────────────────────────────────

function BookmarksPage({
  bookmarks,
  toggleBookmark,
  goHome,
}: {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  goHome: () => void;
}) {
  const saved = RESOURCES.filter((r) => bookmarks.includes(r.id));
  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">Saved Resources</h1>
      <p className="text-sm text-[#A8998E] mt-1">{saved.length} bookmarked</p>
      <div className="mt-6">
        {saved.length ? (
          <Card className="border-gray-200/80 shadow-sm">
            <CardContent className="p-0 px-5">
              {saved.map((r) => (
                <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200/80 shadow-sm">
            <CardContent className="text-center py-20">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4F4] mx-auto mb-3 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C7A7B" strokeWidth="1.5" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="text-sm font-medium text-[#6B5B4E]">No bookmarks yet</p>
              <p className="text-xs text-[#A8998E] mt-1">Click Save on any resource to save it here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── FaqPage ──────────────────────────────────────────────────────────────────

function FaqPage({ goHome }: { goHome: () => void }) {
  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">FAQ</h1>
      <p className="text-sm text-[#A8998E] mt-1">Frequently asked questions about L2W</p>
      <div className="mt-8">
        <Accordion className="space-y-2.5">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-gray-200/80 rounded-xl px-5 shadow-sm hover:shadow-md transition-shadow duration-200">
              <AccordionTrigger className="text-sm font-medium text-[#2C1810] hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#78716C] leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

// ─── TemplatesPage ────────────────────────────────────────────────────────────

function TemplatesPage({
  bookmarks,
  toggleBookmark,
  goHome,
}: {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  goHome: () => void;
}) {
  const allTemplates = RESOURCES.filter((r) => r.type === "Template");
  const [filter, setFilter] = useState<string>("all");

  const templateCats = Array.from(new Set(allTemplates.map((t) => t.category)));
  const filterOptions = [
    { id: "all", label: "All templates" },
    ...templateCats.map((catId) => ({
      id: catId,
      label: CATEGORIES.find((c) => c.id === catId)?.label || catId,
    })),
  ];

  const templates = filter === "all" ? allTemplates : allTemplates.filter((t) => t.category === filter);

  const catAccent: Record<string, string> = {
    "outreach": "#D88A4B", "referrals": "#2C7A7B", "clients": "#285E61",
    "funding": "#C05656", "reporting": "#2C7A7B", "setup": "#D88A4B",
  };

  // File extension helpers
  const fileExts: Record<string, string> = {
    "outreach": "DOCX", "referrals": "XLSX", "clients": "DOCX",
    "funding": "XLSX", "reporting": "XLSX", "setup": "PDF",
  };

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2C1810]">Templates</h1>
        <p className="text-[13px] text-[#78716C] mt-1 max-w-[55ch] leading-relaxed">
          {allTemplates.length} ready-to-use forms, letters, and tracking sheets. Download and customize for your centre.
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 active:scale-[0.97] ${
              filter === opt.id
                ? "bg-[#2C7A7B] text-white shadow-sm"
                : "text-[#57534E] hover:bg-[#E6F4F4] hover:text-[#2C7A7B]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Document-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((r) => {
          const saved = bookmarks.includes(r.id);
          const catLabel = CATEGORIES.find((c) => c.id === r.category)?.label || "";
          const accent = catAccent[r.category] || "#2C7A7B";
          const ext = fileExts[r.category] || "DOC";

          return (
            <div
              key={r.id}
              className="group relative bg-white rounded-xl border border-[#E7E5E4] hover:border-[#2C7A7B]/30 hover:shadow-[0_8px_24px_-8px_rgba(44,122,123,0.12)] transition-all duration-300 cursor-pointer active:scale-[0.98] overflow-hidden"
            >
              {/* Document preview area — looks like a paper */}
              <div className="relative h-36 overflow-hidden" style={{ background: `linear-gradient(145deg, ${accent}0A, ${accent}05)` }}>
                {/* Grid lines to mimic a document */}
                <div className="absolute inset-4 flex flex-col gap-2 opacity-[0.15]">
                  <div className="h-2.5 rounded-sm w-3/4" style={{ background: accent }} />
                  <div className="h-1.5 rounded-sm w-full bg-[#D6D3D1]" />
                  <div className="h-1.5 rounded-sm w-full bg-[#D6D3D1]" />
                  <div className="h-1.5 rounded-sm w-5/6 bg-[#D6D3D1]" />
                  <div className="h-1.5 rounded-sm w-full bg-[#D6D3D1]" />
                  <div className="h-1.5 rounded-sm w-2/3 bg-[#D6D3D1]" />
                </div>
                {/* File type badge */}
                <div
                  className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-white shadow-sm"
                  style={{ background: accent }}
                >
                  {ext}
                </div>
                {/* Bookmark */}
                <div className={`absolute top-3 right-3 ${saved ? "" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>
                  <BookmarkIcon
                    saved={saved}
                    onClick={() => toggleBookmark(r.id)}
                  />
                </div>
                {/* Popular badge */}
                {r.popular && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 shadow-sm border border-[#E6F4F4]">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="#2C7A7B"><path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3L8 12.5 3.1 15l.9-5.3-4-3.9L5.5 5z"/></svg>
                    <span className="text-[9px] font-semibold text-[#2C7A7B] uppercase tracking-wider">Popular</span>
                  </div>
                )}
              </div>

              {/* Info area */}
              <div className="p-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: accent }}>{catLabel}</span>
                <p className="text-[14px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors duration-200 leading-snug tracking-tight line-clamp-2">{r.title}</p>
                <p className="text-[11px] text-[#78716C] leading-relaxed mt-1.5 line-clamp-2">{r.description}</p>
                {/* Download hint */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[#A8998E] group-hover:text-[#2C7A7B] transition-colors duration-200">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download template
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {templates.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E6F4F4] mx-auto mb-4 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C7A7B" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-[#2C1810]">No templates in this category</p>
          <p className="text-[12px] text-[#A8998E] mt-1">Try selecting a different filter above</p>
        </div>
      )}
    </div>
  );
}

// ─── WorkflowsPage ────────────────────────────────────────────────────────────

function WorkflowsPage({
  bookmarks,
  toggleBookmark,
  goHome,
}: {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  goHome: () => void;
}) {
  const guides = RESOURCES.filter((r) => r.type === "Guide");
  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">Workflows</h1>
      <p className="text-sm text-[#A8998E] mt-1">{guides.length} guides</p>
      <div className="mt-6">
        <Card className="border-gray-200/80 shadow-sm">
          <CardContent className="p-0 px-5">
            {guides.map((r) => (
              <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── RecentPage ───────────────────────────────────────────────────────────────

function RecentPage({
  bookmarks,
  toggleBookmark,
  goHome,
}: {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  goHome: () => void;
}) {
  const recent = [...RESOURCES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15);
  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">Recently Updated</h1>
      <p className="text-sm text-[#A8998E] mt-1">Latest 15 resources by date</p>
      <div className="mt-6">
        <Card className="border-gray-200/80 shadow-sm">
          <CardContent className="p-0 px-5">
            {recent.map((r) => (
              <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Forum Components ─────────────────────────────────────────────────────────

import { ChevronUp, ChevronDown, MessageSquare, Flame, Clock, TrendingUp, Pin, Reply, Home as HomeIcon, BookOpen, Users, Wrench, CircleHelp, FileText, Video, Download, ChevronRight, ExternalLink, BookMarked, Lightbulb, ArrowRight, NotebookText, PlayCircle, Calendar, MapPin } from "lucide-react";

function ForumBody({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div className="text-sm text-[#2C1810] leading-relaxed whitespace-pre-line">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : part
      )}
    </div>
  );
}

function VoteButtons({ votes, vertical = true }: { votes: number; vertical?: boolean }) {
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const displayVotes = votes + (voteState === "up" ? 1 : voteState === "down" ? -1 : 0);

  const containerClass = vertical
    ? "flex flex-col items-center gap-0.5 min-w-[40px]"
    : "flex items-center gap-1";

  return (
    <div className={containerClass}>
      <button
        onClick={(e) => { e.stopPropagation(); setVoteState(voteState === "up" ? null : "up"); }}
        className={`p-0.5 rounded hover:bg-[#E6F4F4] transition-colors ${voteState === "up" ? "text-[#2C7A7B]" : "text-[#A8998E] hover:text-[#6B5B4E]"}`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <span className={`text-xs font-bold tabular-nums ${voteState === "up" ? "text-[#2C7A7B]" : voteState === "down" ? "text-[#C05656]" : "text-[#6B5B4E]"}`}>
        {displayVotes}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); setVoteState(voteState === "down" ? null : "down"); }}
        className={`p-0.5 rounded hover:bg-red-50 transition-colors ${voteState === "down" ? "text-[#C05656]" : "text-[#A8998E] hover:text-[#6B5B4E]"}`}
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}

function CommentThread({ comment, depth = 0 }: { comment: ForumComment; depth?: number }) {
  if (depth >= 4) {
    return (
      <button className="text-xs text-[#2C7A7B] hover:underline ml-2 mt-1">
        Continue this thread &rarr;
      </button>
    );
  }

  return (
    <div className={depth > 0 ? "ml-4 md:ml-6 border-l-2 border-[#2C7A7B]/15 pl-3 md:pl-4" : ""}>
      <div className="py-2.5">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-[#E6F4F4] flex items-center justify-center text-[10px] font-bold text-[#2C7A7B]">
            {comment.authorName.split(" ").map(n => n[0]).join("")}
          </div>
          <span className="text-xs font-semibold text-[#2C1810]">{comment.authorName}</span>
          <span className="text-[10px] text-[#A8998E]">{comment.centre}</span>
          <span className="text-[10px] text-[#A8998E]">&middot;</span>
          <span className="text-[10px] text-[#A8998E]">{comment.timestamp}</span>
        </div>
        <p className="text-sm text-[#2C1810] leading-relaxed whitespace-pre-line">{comment.body}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <VoteButtons votes={comment.votes} vertical={false} />
          <button className="flex items-center gap-1 text-[11px] text-[#A8998E] hover:text-[#2C7A7B] transition-colors">
            <Reply className="w-3 h-3" />
            Reply
          </button>
        </div>
      </div>
      {comment.children.map((child) => (
        <CommentThread key={child.id} comment={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function ForumListPage({ goHome, setPage }: { goHome: () => void; setPage: (p: PageState) => void }) {
  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">Community Discussion</h1>
      <p className="text-sm text-[#A8998E] mt-1 mb-6">Connect with other link workers and SALCs</p>

      {/* Post feed */}
      <div className="space-y-6">
        {FORUM_POSTS.map((post) => (
          <div key={post.id}>
            {/* Post header */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {post.pinned && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#2C7A7B] uppercase tracking-wider">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
              <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 border-transparent ${FORUM_TOPIC_COLORS[post.topic] || "bg-gray-100 text-[#6B5B4E]"}`}>
                {post.topic}
              </Badge>
            </div>
            <h2 className="text-base font-semibold text-[#2C1810] mb-1.5">{post.title}</h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#E6F4F4] flex items-center justify-center text-[10px] font-bold text-[#2C7A7B]">
                {post.author.split(" ").map(n => n[0]).join("")}
              </div>
              <span className="text-xs font-semibold text-[#2C1810]">{post.author}</span>
              <span className="text-[10px] text-[#A8998E]">{post.centre}</span>
              <span className="text-[10px] text-[#A8998E]">&middot;</span>
              <span className="text-[10px] text-[#A8998E]">{post.timestamp}</span>
            </div>

            {/* Post body */}
            <Card className="border-gray-200/80 shadow-sm mb-3">
              <CardContent className="p-4">
                <ForumBody text={post.body} />
              </CardContent>
            </Card>

            {/* Action bar */}
            <div className="flex items-center gap-4 mb-4">
              <VoteButtons votes={post.votes} vertical={false} />
              <div className="flex items-center gap-1 text-xs text-[#A8998E]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.commentCount} comments</span>
              </div>
            </div>

            {/* Comments */}
            {post.comments.length > 0 && (
              <div className="mb-2">
                <div className="space-y-1 divide-y divide-gray-100">
                  {post.comments.map((comment) => (
                    <CommentThread key={comment.id} comment={comment} depth={0} />
                  ))}
                </div>
              </div>
            )}

            {/* Separator between posts */}
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ForumPostPage({ postId, setPage }: { postId: number; setPage: (p: PageState) => void }) {
  const post = FORUM_POSTS.find(p => p.id === postId);
  if (!post) return <p className="text-[#A8998E]">Post not found.</p>;

  return (
    <div className="animate-fade-up">
      <BackButton onClick={() => setPage({ t: "forum" })} label="Back to discussions" />

      {/* Post header */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {post.pinned && (
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#2C7A7B] uppercase tracking-wider">
            <Pin className="w-3 h-3" />
            Pinned
          </span>
        )}
        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 border-transparent ${FORUM_TOPIC_COLORS[post.topic] || "bg-gray-100 text-[#6B5B4E]"}`}>
          {post.topic}
        </Badge>
      </div>
      <h1 className="text-lg md:text-xl font-semibold tracking-tight text-[#2C1810] mb-2">{post.title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-[#E6F4F4] flex items-center justify-center text-[11px] font-bold text-[#2C7A7B]">
          {post.author.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#2C1810]">{post.author}</p>
          <p className="text-[10px] text-[#A8998E]">{post.centre} &middot; {post.timestamp}</p>
        </div>
      </div>

      {/* Post body */}
      <Card className="border-gray-200/80 shadow-sm mb-4">
        <CardContent className="p-4 md:p-5">
          <ForumBody text={post.body} />
        </CardContent>
      </Card>

      {/* Action bar */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <VoteButtons votes={post.votes} vertical={false} />
        <div className="flex items-center gap-1 text-xs text-[#A8998E]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{post.commentCount} comments</span>
        </div>
      </div>

      {/* Comments section */}
      <div className="mb-2">
        <h2 className="text-sm font-semibold text-[#2C1810] mb-4">Comments ({post.commentCount})</h2>
        <div className="space-y-1 divide-y divide-gray-100">
          {post.comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} depth={0} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CommunityFilteredPage ───────────────────────────────────────────────────

function CommunityFilteredPage({
  filter,
  bookmarks,
  toggleBookmark,
  goHome,
}: {
  filter: "cafe" | "workshops" | "impact";
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  goHome: () => void;
}) {
  const titles: Record<string, string> = {
    cafe: "Community Cafe",
    workshops: "Workshop Highlights",
    impact: "Impact Stories",
  };
  const descriptions: Record<string, string> = {
    cafe: "Community engagement events, social gatherings, and cafe sessions",
    workshops: "Recorded workshop sessions and training highlights",
    impact: "Stories and evidence showing program impact",
  };

  // Community resources come from learn-sp (impact reports, evidence) and events
  const communityResources = RESOURCES.filter((r) => r.category === "learn-sp" || r.category === "events");

  const filtered = filter === "impact"
    ? communityResources.filter((r) => r.subcategory === "Links2Wellbeing Overview & Impact Reports" || r.subcategory === "Public Research and Resources")
    : filter === "workshops"
    ? communityResources.filter((r) => r.type === "Video" || r.category === "events")
    : communityResources;

  // Also show relevant workshops for cafe filter
  const workshopItems = filter === "cafe" ? WORKSHOPS : [];

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">{titles[filter]}</h1>
      <p className="text-sm text-[#A8998E] mt-1">{descriptions[filter]}</p>

      {workshopItems.length > 0 && (
        <div className="mt-8 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#A8998E] mb-3">
            Upcoming Events
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workshopItems.map((w, i) => (
              <Card key={i} className="border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-[#2C1810]">{w.title}</CardTitle>
                  <CardDescription className="text-[#A8998E]">{w.date}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        {filtered.length ? (
          <Card className="border-gray-200/80 shadow-sm">
            <CardContent className="p-0 px-5">
              {filtered.map((r) => (
                <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200/80 shadow-sm">
            <CardContent className="text-center py-20">
              <div className="w-10 h-10 rounded-xl bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A8998E" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <p className="text-sm font-medium text-[#6B5B4E]">No resources yet</p>
              <p className="text-xs text-[#A8998E] mt-1">Content is being added</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar Nav Content ─────────────────────────────────────────────────────

const SIDEBAR_TOPICS = CATEGORIES;

// Minimal dot indicator for sub-items
const SubDot = () => (
  <span className="w-1 h-1 rounded-full bg-[#C4B5A6] shrink-0" />
);

function SidebarNav({
  active,
  activeCategory,
  setPage,
  topicsOpen,
  setTopicsOpen,
  bookmarkCount,
  onNavigate,
}: {
  active: string;
  activeCategory: CategoryId | null;
  setPage: (p: PageState) => void;
  topicsOpen: boolean;
  setTopicsOpen: (v: boolean) => void;
  bookmarkCount: number;
  onNavigate?: () => void;
}) {
  const [toolsOpen, setToolsOpen] = useState(true);
  const [communityOpen, setCommunityOpen] = useState(true);
  const [helpOpen, setHelpOpen] = useState(true);

  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SIDEBAR_TOPICS.forEach((cat) => { init[cat.id] = false; });
    return init;
  });

  const toggleTopic = (catId: string) => {
    setExpandedTopics((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const isActive = (key: string) => active === key;

  // Chevron for collapsible sections
  const SectionChevron = ({ open }: { open: boolean }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Small chevron for topic items
  const SmallChevron = ({ open }: { open: boolean }) => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`transition-transform duration-200 opacity-40 ${open ? "rotate-90" : ""}`}
    >
      <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <ScrollArea className="flex-1">
      <nav className="px-3 py-4 space-y-1">
        {/* Home — primary nav */}
        <button
          className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-xl transition-all duration-200 ${
            isActive("home")
              ? "bg-[#2C7A7B] text-white shadow-sm"
              : "text-[#44403C] hover:bg-[#F5F0EB]"
          }`}
          onClick={() => { setPage({ t: "home" }); onNavigate?.(); }}
        >
          <HomeIcon className="w-[18px] h-[18px] shrink-0" />
          <span className="text-[14px] font-medium">Home</span>
        </button>

        {/* ── Section divider ─────────────────────────────── */}
        <div className="pt-3 pb-1 px-3">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#A8998E]">Resources</p>
        </div>

        {/* All Topics — collapsible section */}
        <button
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
            topicsOpen ? "text-[#2C1810]" : "text-[#57534E] hover:bg-[#F5F0EB]"
          }`}
          onClick={() => setTopicsOpen(!topicsOpen)}
        >
          <span className="flex items-center gap-3">
            <BookOpen className="w-[18px] h-[18px] shrink-0 opacity-60" />
            <span className="text-[14px] font-medium">All Topics</span>
          </span>
          <SectionChevron open={topicsOpen} />
        </button>

        {topicsOpen && (
          <div className="ml-3 pl-3 border-l-[1.5px] border-[#E7E5E4] space-y-0.5">
            {SIDEBAR_TOPICS.map((cat) => {
              const subcatNodes = SIDEBAR_TREE_CATS.has(cat.id) ? (CATEGORY_SUBCATS[cat.id] || []) : [];
              const isExpanded = expandedTopics[cat.id];
              const isCatActive = activeCategory === cat.id;

              return (
                <div key={cat.id}>
                  <div className="flex items-center">
                    <button
                      className={`flex-1 flex items-center gap-2 text-left px-2.5 py-[6px] rounded-lg text-[13px] transition-all duration-200 ${
                        isCatActive && !active.startsWith("subcat:")
                          ? "bg-[#E6F4F4] text-[#2C7A7B] font-medium"
                          : isCatActive
                          ? "text-[#2C7A7B] font-medium"
                          : "text-[#57534E] hover:bg-[#F5F0EB] hover:text-[#2C1810]"
                      }`}
                      onClick={() => {
                        setPage({ t: "cat", id: cat.id });
                        if (!isExpanded && subcatNodes.length > 0) toggleTopic(cat.id);
                        onNavigate?.();
                      }}
                    >
                      {cat.label}
                    </button>
                    {subcatNodes.length > 0 && (
                      <button
                        className="p-1 rounded-md hover:bg-[#F5F0EB] transition-colors shrink-0"
                        onClick={(e) => { e.stopPropagation(); toggleTopic(cat.id); }}
                      >
                        <SmallChevron open={isExpanded} />
                      </button>
                    )}
                  </div>

                  {/* Subcategories (Level 2) */}
                  {isExpanded && subcatNodes.length > 0 && (
                    <div className="ml-2.5 pl-2.5 border-l border-[#EDEBE9] space-y-0.5 pb-1">
                      {subcatNodes.map((node) => {
                        const hasChildren = node.children && node.children.length > 0;
                        const subKey = `subcat:${cat.id}:${node.name}`;

                        return (
                          <div key={node.name}>
                            <button
                              className={`w-full flex items-center gap-2 text-left px-2 py-[4px] rounded-md text-[12px] transition-all duration-200 ${
                                isActive(subKey)
                                  ? "bg-[#E6F4F4] text-[#2C7A7B] font-medium"
                                  : "text-[#78716C] hover:bg-[#F5F0EB] hover:text-[#57534E]"
                              }`}
                              onClick={() => {
                                if (!node.isContainer) {
                                  setPage({ t: "subcat", categoryId: cat.id, subcategory: node.name });
                                  onNavigate?.();
                                }
                              }}
                            >
                              <SubDot />
                              <span className="leading-snug">{node.name}</span>
                            </button>

                            {/* Level 3 children */}
                            {hasChildren && node.children!.map((child) => {
                              const childKey = `subcat:${cat.id}:${child}`;
                              const childIsSubcat = RESOURCES.some((r) => r.category === cat.id && r.subcategory === child);

                              return (
                                <button
                                  key={child}
                                  className={`w-full flex items-center gap-2 text-left pl-6 pr-2 py-[3px] rounded-md text-[11px] transition-all duration-200 ${
                                    isActive(childKey)
                                      ? "bg-[#E6F4F4] text-[#2C7A7B] font-medium"
                                      : "text-[#A8A29E] hover:text-[#57534E] hover:bg-[#F5F0EB]"
                                  }`}
                                  onClick={() => {
                                    if (childIsSubcat) {
                                      setPage({ t: "subcat", categoryId: cat.id, subcategory: child });
                                    } else {
                                      setPage({ t: "subcat", categoryId: cat.id, subcategory: node.name });
                                    }
                                    onNavigate?.();
                                  }}
                                >
                                  <span className="w-0.5 h-0.5 rounded-full bg-[#D6D3D1] shrink-0" />
                                  <span className="leading-snug">{child}</span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Section divider ─────────────────────────────── */}
        <div className="pt-4 pb-1 px-3">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#A8998E]">Connect</p>
        </div>

        {/* Community */}
        <button
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
            communityOpen ? "text-[#2C1810]" : "text-[#57534E] hover:bg-[#F5F0EB]"
          }`}
          onClick={() => setCommunityOpen(!communityOpen)}
        >
          <span className="flex items-center gap-3">
            <Users className="w-[18px] h-[18px] shrink-0 opacity-60" />
            <span className="text-[14px] font-medium">Community</span>
          </span>
          <SectionChevron open={communityOpen} />
        </button>
        {communityOpen && (
          <div className="ml-3 pl-3 border-l-[1.5px] border-[#E7E5E4] space-y-0.5">
            {([
              { key: "community-cafe", page: { t: "community-cafe" } as PageState, label: "Community Cafe" },
              { key: "forum", page: { t: "forum" } as PageState, label: "Discussion Forum" },
              { key: "community-workshops", page: { t: "community-workshops" } as PageState, label: "Workshop Highlights" },
              { key: "community-impact", page: { t: "community-impact" } as PageState, label: "Impact Stories" },
            ]).map((item) => (
              <button
                key={item.key}
                className={`w-full flex items-center gap-2 text-left px-2.5 py-[6px] rounded-lg text-[13px] transition-all duration-200 ${
                  isActive(item.key)
                    ? "bg-[#E6F4F4] text-[#2C7A7B] font-medium"
                    : "text-[#57534E] hover:bg-[#F5F0EB] hover:text-[#2C1810]"
                }`}
                onClick={() => { setPage(item.page); onNavigate?.(); }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Section divider ─────────────────────────────── */}
        <div className="pt-4 pb-1 px-3">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[#A8998E]">Workspace</p>
        </div>

        {/* Tools */}
        <button
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
            toolsOpen ? "text-[#2C1810]" : "text-[#57534E] hover:bg-[#F5F0EB]"
          }`}
          onClick={() => setToolsOpen(!toolsOpen)}
        >
          <span className="flex items-center gap-3">
            <Wrench className="w-[18px] h-[18px] shrink-0 opacity-60" />
            <span className="text-[14px] font-medium">Tools</span>
          </span>
          <SectionChevron open={toolsOpen} />
        </button>
        {toolsOpen && (
          <div className="ml-3 pl-3 border-l-[1.5px] border-[#E7E5E4] space-y-0.5">
            {([
              { key: "workflows", page: { t: "workflows" } as PageState, label: "Workflows" },
              { key: "templates", page: { t: "templates" } as PageState, label: "Templates" },
              { key: "reporting", page: { t: "cat", id: "reporting" as CategoryId } as PageState, label: "Reporting" },
            ]).map((item) => (
              <button
                key={item.key}
                className={`w-full flex items-center gap-2 text-left px-2.5 py-[6px] rounded-lg text-[13px] transition-all duration-200 ${
                  isActive(item.key)
                    ? "bg-[#E6F4F4] text-[#2C7A7B] font-medium"
                    : "text-[#57534E] hover:bg-[#F5F0EB] hover:text-[#2C1810]"
                }`}
                onClick={() => { setPage(item.page); onNavigate?.(); }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Help */}
        <button
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 ${
            helpOpen ? "text-[#2C1810]" : "text-[#57534E] hover:bg-[#F5F0EB]"
          }`}
          onClick={() => setHelpOpen(!helpOpen)}
        >
          <span className="flex items-center gap-3">
            <CircleHelp className="w-[18px] h-[18px] shrink-0 opacity-60" />
            <span className="text-[14px] font-medium">Help</span>
          </span>
          <SectionChevron open={helpOpen} />
        </button>
        {helpOpen && (
          <div className="ml-3 pl-3 border-l-[1.5px] border-[#E7E5E4] space-y-0.5">
            {([
              { key: "faq", page: { t: "faq" } as PageState, label: "FAQ" },
              { key: "recent", page: { t: "recent" } as PageState, label: "Recently Updated" },
            ]).map((item) => (
              <button
                key={item.key}
                className={`w-full flex items-center gap-2 text-left px-2.5 py-[6px] rounded-lg text-[13px] transition-all duration-200 ${
                  isActive(item.key)
                    ? "bg-[#E6F4F4] text-[#2C7A7B] font-medium"
                    : "text-[#57534E] hover:bg-[#F5F0EB] hover:text-[#2C1810]"
                }`}
                onClick={() => { setPage(item.page); onNavigate?.(); }}
              >
                {item.label}
              </button>
            ))}
            <button
              className={`w-full flex items-center justify-between text-left px-2.5 py-[6px] rounded-lg text-[13px] transition-all duration-200 ${
                isActive("bookmarks")
                  ? "bg-[#E6F4F4] text-[#2C7A7B] font-medium"
                  : "text-[#57534E] hover:bg-[#F5F0EB] hover:text-[#2C1810]"
              }`}
              onClick={() => { setPage({ t: "bookmarks" }); onNavigate?.(); }}
            >
              <span>Bookmarks</span>
              {bookmarkCount > 0 && (
                <span className="text-[10px] font-semibold bg-[#2C7A7B] text-white px-1.5 py-0.5 rounded-full leading-none">{bookmarkCount}</span>
              )}
            </button>
          </div>
        )}
      </nav>
    </ScrollArea>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function AppSidebar({
  active,
  activeCategory,
  setPage,
  topicsOpen,
  setTopicsOpen,
  bookmarkCount,
}: {
  active: string;
  activeCategory: CategoryId | null;
  setPage: (p: PageState) => void;
  topicsOpen: boolean;
  setTopicsOpen: (v: boolean) => void;
  bookmarkCount: number;
}) {
  return (
    <div data-tutorial="step-3" className="w-[272px] shrink-0 flex flex-col h-screen sticky top-0 bg-white border-r border-[#F0EDEA] overflow-hidden">
      {/* Logo area */}
      <div className="px-5 py-5 shrink-0">
        <div className="flex items-center justify-center">
          <img src="/l2w-logo.svg" alt="Links2Wellbeing" className="h-9 w-auto" />
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#E7E5E4] to-transparent mx-4" />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <SidebarNav
          active={active}
          activeCategory={activeCategory}
          setPage={setPage}
          topicsOpen={topicsOpen}
          setTopicsOpen={setTopicsOpen}
          bookmarkCount={bookmarkCount}
        />
      </div>
    </div>
  );
}

// ─── RightPanel ───────────────────────────────────────────────────────────────

function RightPanelContent({ bookmarks }: { bookmarks: number[] }) {
  const saved = RESOURCES.filter((r) => bookmarks.includes(r.id)).slice(0, 4);
  return (
    <div className="p-5 space-y-6">
      {/* Upcoming Workshops */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C96A2B]" />
          <p className="text-[11px] font-semibold tracking-[0.1em] text-[#6B5B4E] uppercase">Upcoming Workshops</p>
        </div>
        <div className="space-y-2.5">
          {WORKSHOPS.map((w, i) => (
            <div key={i} className="flex items-start gap-3 group cursor-pointer p-2.5 -mx-2.5 rounded-xl hover:bg-[#F5E6D6]/30 transition-colors duration-200">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-b from-[#F5E6D6] to-[#F5E6D6]/60 flex flex-col items-center justify-center overflow-hidden">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#C96A2B] leading-none">{w.month}</span>
                <span className="text-[15px] font-semibold text-[#2C1810] leading-tight">{w.day}</span>
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13px] font-medium text-[#2C1810] group-hover:text-[#C96A2B] transition-colors duration-200 leading-snug">{w.title}</p>
                <p className="text-[11px] text-[#A8998E] mt-0.5">{w.time} · {w.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200/80 to-transparent" />

      {/* Upcoming Deadlines */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B23A3A]" />
          <p className="text-[11px] font-semibold tracking-[0.1em] text-[#6B5B4E] uppercase">Upcoming Deadlines</p>
        </div>
        <div className="space-y-2.5">
          {DEADLINES.map((d, i) => {
            const [month, day] = d.date.split(" ");
            return (
              <div key={i} className="flex items-start gap-3 p-2.5 -mx-2.5 rounded-xl">
                <div className={`shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center overflow-hidden ${d.urgent ? "bg-gradient-to-b from-[#F2D5D5] to-[#F2D5D5]/60" : "bg-gradient-to-b from-gray-100 to-gray-50"}`}>
                  <span className={`text-[8px] font-bold uppercase tracking-wider leading-none ${d.urgent ? "text-[#B23A3A]" : "text-[#6B5B4E]"}`}>{month.toUpperCase()}</span>
                  <span className="text-[15px] font-semibold text-[#2C1810] leading-tight">{day}</span>
                </div>
                <div className="min-w-0 pt-1.5">
                  <p className="text-[13px] font-medium text-[#2C1810] leading-snug">{d.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200/80 to-transparent" />

      {/* Quick Links */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D5B]" />
          <p className="text-[11px] font-semibold tracking-[0.1em] text-[#6B5B4E] uppercase">Quick Links</p>
        </div>
        <div className="space-y-1.5">
          {[
            { label: "L2W Google Drive", external: true },
            { label: "Contact support", external: true },
            { label: "Submit feedback", external: false },
            { label: "Request a resource", external: false },
          ].map((l) => (
            <div key={l.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-transparent hover:border-gray-200/60 hover:bg-white/80 cursor-pointer transition-all duration-200 group">
              <span className="text-[13px] text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors duration-200">{l.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8998E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 group-hover:stroke-[#2C7A7B] transition-colors duration-200">
                {l.external ? (
                  <>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 8 16 12 12 16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </>
                )}
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* Saved Resources */}
      {saved.length > 0 && (
        <>
          <Separator className="bg-gray-200/60" />
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#2C7A7B]" />
              <p className="text-sm font-semibold text-[#2C1810]">Saved Resources</p>
            </div>
            <ul className="space-y-2">
              {saved.map((r) => (
                <li key={r.id} className="text-[13px] text-[#2C7A7B] leading-snug cursor-pointer hover:underline underline-offset-2 transition-colors duration-150">{r.title}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function RightPanel({ bookmarks }: { bookmarks: number[] }) {
  return (
    <Card data-tutorial="step-5" className="w-64 shrink-0 border-l border-gray-200/60 rounded-none ring-0 h-screen sticky top-0 bg-[#FAFAF8]">
      <ScrollArea className="h-full">
        <RightPanelContent bookmarks={bookmarks} />
      </ScrollArea>
    </Card>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [page, setPage] = useState<PageState>({ t: "home" });
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [topicsOpen, setTopicsOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const goHome = () => setPage({ t: "home" });

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setPage({ t: "search", q: query.trim() });
    }
  };

  const active =
    page.t === "cat" ? page.id :
    page.t === "subcat" ? `subcat:${page.categoryId}:${page.subcategory}` :
    page.t === "content" ? page.fromCategory :
    page.t === "search" ? "search" :
    page.t === "forum-post" ? "forum" :
    page.t;

  const activeCategory =
    page.t === "cat" ? page.id :
    page.t === "subcat" ? page.categoryId :
    page.t === "content" ? page.fromCategory :
    null;

  const renderPage = () => {
    switch (page.t) {
      case "home":
        return <HomePage bookmarks={bookmarks} toggleBookmark={toggleBookmark} setPage={setPage} />;
      case "cat":
        if (page.id === "events") return <EventsPage goHome={goHome} />;
        return <CategoryPage id={page.id} goHome={goHome} setPage={setPage} />;
      case "subcat":
        return <SubcategoryPage categoryId={page.categoryId} subcategory={page.subcategory} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setPage={setPage} />;
      case "content":
        return <ContentPage resourceId={page.resourceId} fromCategory={page.fromCategory} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setPage={setPage} />;
      case "search":
        return <SearchPage q={page.q} bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
      case "bookmarks":
        return <BookmarksPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
      case "faq":
        return <FaqPage goHome={goHome} />;
      case "templates":
        return <TemplatesPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
      case "workflows":
        return <WorkflowsPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
      case "recent":
        return <RecentPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
      case "forum":
        return <ForumListPage goHome={goHome} setPage={setPage} />;
      case "forum-post":
        return <ForumPostPage postId={page.postId} setPage={setPage} />;
      case "ai-scenarios":
        return <AIScenariosPage goHome={goHome} />;
      case "community-cafe":
        return <CommunityFilteredPage filter="cafe" bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
      case "community-workshops":
        return <CommunityFilteredPage filter="workshops" bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
      case "community-impact":
        return <CommunityFilteredPage filter="impact" bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9F9]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          active={active}
          activeCategory={activeCategory}
          setPage={setPage}
          topicsOpen={topicsOpen}
          setTopicsOpen={setTopicsOpen}
          bookmarkCount={bookmarks.length}
        />
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-white">
          <SheetHeader className="px-5 py-5">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center justify-center">
              <img src="/l2w-logo.svg" alt="Links2Wellbeing" className="h-9 w-auto" />
            </div>
          </SheetHeader>
          <div className="h-px bg-gradient-to-r from-transparent via-[#E7E5E4] to-transparent mx-4" />
          <SidebarNav
            active={active}
            activeCategory={activeCategory}
            setPage={setPage}
            topicsOpen={topicsOpen}
            setTopicsOpen={setTopicsOpen}
            bookmarkCount={bookmarks.length}
            onNavigate={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-2.5 md:gap-4 px-3 md:px-6 py-2 md:py-3 border-b border-[#F0EDEA] shrink-0 bg-white">
          {/* Mobile: logo + hamburger */}
          <button
            className="md:hidden shrink-0 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#F5F0EB] active:bg-[#EDE8E3] transition-colors duration-150"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#57534E" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="17" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
          <div className="flex-1 min-w-0" data-tutorial="step-4">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8998E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search resources, templates, guidance..."
                className="pl-9 bg-[#F7F7F5] border-[#E7E5E4] text-[13px] md:text-sm text-[#2C1810] placeholder:text-[#A8998E] focus-visible:border-[#2C7A7B] focus-visible:ring-[#2C7A7B]/20 transition-all duration-200 rounded-lg h-9 md:h-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <button
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#F5F0EB] active:bg-[#EDE8E3] transition-colors duration-150"
              onClick={() => setRightPanelOpen(true)}
              aria-label="Quick access"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#57534E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#2C7A7B] to-[#285E61] text-white flex items-center justify-center text-[11px] font-semibold shadow-sm">
              MA
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="flex">
            <div className="flex-1 px-4 py-5 md:p-10">
              {renderPage()}
            </div>
            {/* Desktop right panel */}
            <div className="hidden lg:block">
              <RightPanel bookmarks={bookmarks} />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile right panel sheet */}
      <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
        <SheetContent side="right" className="w-72 p-0 overflow-auto">
          <SheetHeader className="px-5 pt-5">
            <SheetTitle>Quick Access</SheetTitle>
          </SheetHeader>
          <RightPanelContent bookmarks={bookmarks} />
        </SheetContent>
      </Sheet>

      {/* Spotlight tutorial overlay */}
      {showTutorial && page.t === "home" && (
        <SpotlightTutorial onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
