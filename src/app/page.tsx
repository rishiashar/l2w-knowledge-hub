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
        </h1>
        <p className="text-[15px] text-[#78716C] max-w-md leading-[1.7]">
          Your central hub for social prescribing workflows, community resources, and reporting protocols.
        </p>
      </div>

      {/* Bento Grid */}
      <section className="mb-12 animate-fade-up delay-1" data-tutorial="step-2">
        {/* Row 1: Hero row — Primary & Secondary importance */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">

          {/* Card #1: New Here — HIGHEST importance — Premium teal with mesh gradient */}
          <div
            className="md:col-span-3 cursor-pointer rounded-[1.5rem] p-[1px] relative overflow-hidden min-h-[230px] group transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] hover:shadow-[0_20px_48px_-12px_rgba(44,122,123,0.22)] active:scale-[0.98]"
            onClick={() => setPage({ t: "cat", id: "hub-guide" })}
            style={{ background: 'linear-gradient(145deg, #BDE0E0 0%, #A8D6D7 50%, #96CCCD 100%)' }}
          >
            {/* Inner card — multi-layer mesh gradient surface */}
            <div className="relative h-full rounded-[calc(1.5rem-1px)] overflow-hidden" style={{ background: 'linear-gradient(150deg, #E6F4F4 0%, #D0EAEA 100%)' }}>
              <div className="absolute inset-0 rounded-[calc(1.5rem-1px)]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(44,122,123,0.04)' }} />

              {/* Mesh blob — top-left warm teal */}
              <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full opacity-[0.18]" style={{ background: 'radial-gradient(circle, #38A89D 0%, transparent 65%)', filter: 'blur(60px)' }} />

              {/* Mesh blob — center-right deeper teal */}
              <div className="absolute top-1/3 -right-8 w-56 h-56 rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(circle, #285E61 0%, transparent 65%)', filter: 'blur(55px)' }} />

              {/* Mesh blob — bottom soft mint */}
              <div className="absolute -bottom-12 left-1/4 w-64 h-48 rounded-full opacity-[0.1]" style={{ background: 'radial-gradient(ellipse, #4DC9B0 0%, transparent 65%)', filter: 'blur(50px)' }} />

              {/* Decorative — large concentric arcs (top-right) */}
              <div className="absolute -top-8 -right-8 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-600">
                <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                  <circle cx="90" cy="90" r="85" stroke="#285E61" strokeWidth="0.6" />
                  <circle cx="90" cy="90" r="65" stroke="#285E61" strokeWidth="0.6" />
                  <circle cx="90" cy="90" r="45" stroke="#285E61" strokeWidth="0.6" />
                  <circle cx="90" cy="90" r="25" stroke="#285E61" strokeWidth="0.6" />
                </svg>
              </div>

              {/* Decorative — small dot grid pattern (bottom-left) */}
              <div className="absolute bottom-4 left-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-600">
                <svg width="80" height="60" viewBox="0 0 80 60" fill="#285E61">
                  {[0,1,2,3,4,5,6,7].map(x => [0,1,2,3,4].map(y => (
                    <circle key={`${x}-${y}`} cx={x * 10 + 5} cy={y * 12 + 6} r="1" />
                  )))}
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 pb-7 flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(44,122,123,0.08)', border: '1px solid rgba(44,122,123,0.12)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C7A7B] animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#285E61]">Getting started</span>
                  </div>

                  <h3 className="text-[24px] font-bold text-[#162828] leading-[1.15] mb-3 tracking-[-0.02em]">
                    New here? Learn how<br className="hidden sm:block" /> to use this hub
                  </h3>

                  <p className="text-[14px] text-[#4A6B6B] leading-relaxed max-w-sm">
                    A guided walkthrough for new link workers joining the Links2Wellbeing program.
                  </p>
                </div>

                {/* CTA — solid pill button */}
                <div className="mt-7 flex items-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:gap-3 group-hover:shadow-[0_6px_20px_-4px_rgba(44,122,123,0.35)]" style={{ background: 'linear-gradient(135deg, #2C7A7B 0%, #38958F 100%)' }}>
                    Start learning
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:scale-110 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card #2: AI Scenarios — SECOND importance — Premium warm with mesh gradient */}
          <div
            className="md:col-span-2 cursor-pointer rounded-[1.5rem] p-[1px] relative overflow-hidden min-h-[230px] group transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] hover:shadow-[0_20px_48px_-12px_rgba(201,106,43,0.22)] active:scale-[0.98]"
            onClick={() => setPage({ t: "ai-scenarios" })}
            style={{ background: 'linear-gradient(145deg, #E8D0B8 0%, #E0C4A8 50%, #D6B89C 100%)' }}
          >
            {/* Inner card — multi-layer mesh gradient surface */}
            <div className="relative h-full rounded-[calc(1.5rem-1px)] overflow-hidden" style={{ background: 'linear-gradient(150deg, #FDF5EC 0%, #F4E4D2 100%)' }}>
              <div className="absolute inset-0 rounded-[calc(1.5rem-1px)]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(216,138,75,0.04)' }} />

              {/* Mesh blob — top-right warm amber */}
              <div className="absolute -top-14 -right-14 w-64 h-64 rounded-full opacity-[0.16]" style={{ background: 'radial-gradient(circle, #D88A4B 0%, transparent 65%)', filter: 'blur(55px)' }} />

              {/* Mesh blob — center-left deeper terracotta */}
              <div className="absolute top-1/2 -left-10 w-48 h-48 rounded-full opacity-[0.1]" style={{ background: 'radial-gradient(circle, #B56D30 0%, transparent 65%)', filter: 'blur(50px)' }} />

              {/* Mesh blob — bottom-right soft peach */}
              <div className="absolute -bottom-10 right-1/4 w-52 h-40 rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(ellipse, #E8A86B 0%, transparent 65%)', filter: 'blur(45px)' }} />

              {/* AI Stars Icon — larger and more present */}
              <div className="absolute top-4 right-5 opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-600">
                <svg width="52" height="52" viewBox="-5 -10 110 135" fill="#B56D30">
                  <path d="m59.5 46s-0.30078-2.8281-1.4883-4.0117c-1.1914-1.1797-4.0117-1.4883-4.0117-1.4883s2.8281-0.30078 4.0117-1.4883c1.1797-1.1914 1.4883-4.0117 1.4883-4.0117s0.30078 2.8281 1.4883 4.0117c1.1797 1.1797 4.0117 1.4883 4.0117 1.4883s-2.8281 0.30078-4.0117 1.4883c-1.1797 1.1797-1.4883 4.0117-1.4883 4.0117zm-13.25-3.5s-0.62109 5.7891-3.0391 8.2109c-2.4219 2.4219-8.2109 3.0391-8.2109 3.0391s5.7891 0.62109 8.2109 3.0391c2.4219 2.4219 3.0391 8.2109 3.0391 8.2109s0.62109-5.7891 3.0391-8.2109c2.4219-2.4219 8.2109-3.0391 8.2109-3.0391s-5.7891-0.62109-8.2109-3.0391c-2.4219-2.4219-3.0391-8.2109-3.0391-8.2109zm14.5 17.5c-0.69141 0-1.25 0.55859-1.25 1.25s0.55859 1.25 1.25 1.25 1.25-0.55859 1.25-1.25-0.55859-1.25-1.25-1.25zm-22-19c0.69141 0 1.25-0.55859 1.25-1.25s-0.55859-1.25-1.25-1.25-1.25 0.55859-1.25 1.25 0.55859 1.25 1.25 1.25z" />
                </svg>
              </div>

              {/* Decorative — diagonal line cluster */}
              <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-[0.025]" style={{ backgroundImage: 'repeating-linear-gradient(55deg, #B56D30, #B56D30 1px, transparent 1px, transparent 10px)', backgroundSize: '14px 14px' }} />

              {/* Content */}
              <div className="relative z-10 p-7 pb-6 flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(201,106,43,0.08)', border: '1px solid rgba(201,106,43,0.12)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D88A4B] animate-pulse" />
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#B07432]">AI-Powered</span>
                  </div>

                  <h3 className="text-[22px] font-bold text-[#2A1C10] leading-tight mb-2.5 tracking-[-0.015em]">
                    Practice with{' '}
                    <span className="italic text-[#C96A2B]" style={{ fontFamily: 'var(--font-instrument-serif)' }}>
                      AI Scenarios
                    </span>
                  </h3>

                  <p className="text-[13.5px] text-[#7A6248] leading-relaxed max-w-[260px]">
                    Rehearse real-world conversations with AI feedback grounded in L2W methodology.
                  </p>
                </div>

                {/* CTA — solid pill button */}
                <div className="mt-7 flex items-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:gap-3 group-hover:shadow-[0_6px_20px_-4px_rgba(201,106,43,0.35)]" style={{ background: 'linear-gradient(135deg, #C96A2B 0%, #D88A4B 100%)' }}>
                    Try a scenario
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 group-hover:scale-110 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Three featured topics — Double-Bezel premium cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Card 1: Set Up — Rose/Terracotta */}
          <div
            className="cursor-pointer rounded-[1.5rem] p-[1px] relative overflow-hidden min-h-[170px] group transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] hover:shadow-[0_20px_48px_-12px_rgba(192,86,86,0.18)] active:scale-[0.98]"
            onClick={() => setPage({ t: "cat", id: "setup" })}
            style={{ background: 'linear-gradient(145deg, #EBC8C8 0%, #E8BABA 50%, #DDA8A8 100%)' }}
          >
            <div className="relative h-full rounded-[calc(1.5rem-1px)] overflow-hidden" style={{ background: 'linear-gradient(155deg, #F5E0E0 0%, #F0D2D2 40%, #EBCACA 100%)' }}>
              {/* Inner highlight for glass-edge refraction */}
              <div className="absolute inset-0 rounded-[calc(1.5rem-1px)]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(192,86,86,0.04)' }} />

              {/* Ambient glow */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-[0.15] blur-[40px]" style={{ background: 'radial-gradient(circle, #C05656 0%, transparent 70%)' }} />

              {/* Decorative: stacked layers illustration */}
              <div className="absolute bottom-4 right-5 opacity-[0.08] group-hover:opacity-[0.14] transition-opacity duration-500">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#C05656" strokeWidth="1.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#2D1B1B] leading-snug mb-1.5 tracking-[-0.01em]">Set Up Your L2W Program</h3>
                  <p className="text-[#7A4A4A] text-[13px] leading-relaxed">Pathway, getting started guide, tools, and volunteer resources</p>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#9B4444] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:gap-2.5" style={{ background: 'rgba(192,86,86,0.08)', border: '1px solid rgba(192,86,86,0.1)' }}>
                    Explore
                    <span className="w-4 h-4 rounded-full bg-[#C05656]/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Reporting — Teal */}
          <div
            className="cursor-pointer rounded-[1.5rem] p-[1px] relative overflow-hidden min-h-[170px] group transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] hover:shadow-[0_20px_48px_-12px_rgba(44,122,123,0.18)] active:scale-[0.98]"
            onClick={() => setPage({ t: "cat", id: "reporting" })}
            style={{ background: 'linear-gradient(145deg, #BDE0E0 0%, #A8D6D7 50%, #96CCCD 100%)' }}
          >
            <div className="relative h-full rounded-[calc(1.5rem-1px)] overflow-hidden" style={{ background: 'linear-gradient(155deg, #DDF0F0 0%, #CEECEC 40%, #C4E6E6 100%)' }}>
              <div className="absolute inset-0 rounded-[calc(1.5rem-1px)]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(44,122,123,0.04)' }} />

              {/* Ambient glow */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-[0.12] blur-[40px]" style={{ background: 'radial-gradient(circle, #2C7A7B 0%, transparent 70%)' }} />

              {/* Decorative: bar chart illustration */}
              <div className="absolute bottom-4 right-5 opacity-[0.08] group-hover:opacity-[0.14] transition-opacity duration-500">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#2C7A7B" strokeWidth="1.2">
                  <rect x="3" y="12" width="4" height="9" rx="1" />
                  <rect x="10" y="7" width="4" height="14" rx="1" />
                  <rect x="17" y="3" width="4" height="18" rx="1" />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#1A2E2E] leading-snug mb-1.5 tracking-[-0.01em]">Annual Reporting &amp; Evaluation</h3>
                  <p className="text-[#3D6B6B] text-[13px] leading-relaxed">Financial reports, tracking tools, and submission guides</p>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#2C7A7B] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:gap-2.5" style={{ background: 'rgba(44,122,123,0.08)', border: '1px solid rgba(44,122,123,0.1)' }}>
                    Explore
                    <span className="w-4 h-4 rounded-full bg-[#2C7A7B]/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Templates — Warm Amber */}
          <div
            className="cursor-pointer rounded-[1.5rem] p-[1px] relative overflow-hidden min-h-[170px] group transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] hover:shadow-[0_20px_48px_-12px_rgba(216,138,75,0.18)] active:scale-[0.98]"
            onClick={() => setPage({ t: "templates" })}
            style={{ background: 'linear-gradient(145deg, #E8D0B8 0%, #E0C4A8 50%, #D6B89C 100%)' }}
          >
            <div className="relative h-full rounded-[calc(1.5rem-1px)] overflow-hidden" style={{ background: 'linear-gradient(155deg, #F5E8D8 0%, #F0DECA 40%, #ECDAC4 100%)' }}>
              <div className="absolute inset-0 rounded-[calc(1.5rem-1px)]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(216,138,75,0.04)' }} />

              {/* Ambient glow */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-[0.12] blur-[40px]" style={{ background: 'radial-gradient(circle, #D88A4B 0%, transparent 70%)' }} />

              {/* Decorative: stacked documents */}
              <div className="absolute bottom-3 right-4 opacity-[0.09] group-hover:opacity-[0.16] transition-opacity duration-500">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#D88A4B" strokeWidth="1">
                  <rect x="6" y="3" width="12" height="16" rx="1.5" fill="#D88A4B" fillOpacity="0.04" />
                  <path d="M9 7h6M9 10h6M9 13h4" strokeWidth="1.2" strokeLinecap="round" />
                  <rect x="4" y="5" width="12" height="16" rx="1.5" fill="#D88A4B" fillOpacity="0.03" />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full mb-2.5" style={{ background: 'rgba(216,138,75,0.1)', border: '1px solid rgba(216,138,75,0.1)' }}>
                    <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#D88A4B]">{RESOURCES.filter(r => r.type === "Template").length} files</span>
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#2D2015] leading-snug mb-1.5 tracking-[-0.01em]">Templates</h3>
                  <p className="text-[#7A6248] text-[13px] leading-relaxed">Ready-to-use forms, letters, and tracking sheets</p>
                </div>
                <div className="mt-5 flex items-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#B07432] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:gap-2.5" style={{ background: 'rgba(216,138,75,0.08)', border: '1px solid rgba(216,138,75,0.1)' }}>
                    Browse all
                    <span className="w-4 h-4 rounded-full bg-[#D88A4B]/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            <div className="space-y-2.5">
              {popular.map((r) => {
                const saved = bookmarks.includes(r.id);
                const catLabel = CATEGORIES.find((c) => c.id === r.category)?.label || "";
                const accentMap: Record<string, string> = { "Guide": "#2C7A7B", "PDF": "#C05656", "Template": "#D88A4B", "Video": "#285E61" };
                const accent = accentMap[r.type] || "#2C7A7B";
                // SVG icon paths per type
                const iconPath: Record<string, React.ReactNode> = {
                  "Guide": <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>,
                  "PDF": <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
                  "Template": <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M9 13h6M9 17h4" /><polyline points="14 2 14 8 20 8" /></>,
                  "Video": <><polygon points="5 3 19 12 5 21 5 3" /></>,
                };
                return (
                  <div
                    key={r.id}
                    className="group flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-[#FAFAF9] transition-all duration-200 cursor-pointer active:scale-[0.99]"
                  >
                    {/* Type icon square */}
                    <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center mt-0.5 transition-transform duration-200 group-hover:scale-105" style={{ background: `${accent}12` }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {iconPath[r.type] || iconPath["Guide"]}
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-medium text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors duration-200 leading-snug tracking-tight">{r.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: accent }}>{r.type}</span>
                            <span className="w-[3px] h-[3px] rounded-full bg-[#D6D3D1]" />
                            <span className="text-[10px] text-[#A8998E]">{catLabel}</span>
                          </div>
                        </div>
                        <BookmarkIcon
                          saved={saved}
                          onClick={() => toggleBookmark(r.id)}
                          className={`shrink-0 mt-0.5 ${saved ? "" : "opacity-0 group-hover:opacity-100"}`}
                        />
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
  const [scenarioCount, setScenarioCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [showCopied, setShowCopied] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const getCategoryName = (id: string) => AI_CATEGORIES.find((c) => c.id === id)?.name ?? id;
  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;
  const totalPracticed = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const generateScenario = async (categoryId: string) => {
    setIsLoadingScenario(true); setApiError(null); setScenarioError(false); setScenarioText("");
    try {
      const res = await fetch("/api/ai-scenario", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "generate", category: getCategoryName(categoryId) }) });
      const data = await res.json();
      if (!res.ok) { if (data.error === "API key not configured") { setApiUnavailable(true); return; } throw new Error(data.error); }
      setScenarioText(data.scenario); setScenarioCount((prev) => prev + 1);
    } catch { setScenarioError(true); setApiError("Something went wrong."); } finally { setIsLoadingScenario(false); }
  };

  const handleSelectCategory = (id: string) => { if (id !== selectedCategory) setScenarioCount(0); setSelectedCategory(id); setResponse(""); setShowFeedback(false); setFeedbackData(null); setFeedbackError(false); generateScenario(id); };

  const handleSubmit = async () => {
    if (response.trim().length < 10) return;
    setIsSubmitting(true); setApiError(null); setFeedbackError(false);
    try {
      const res = await fetch("/api/ai-scenario", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "feedback", category: getCategoryName(selectedCategory!), scenario: scenarioText, response }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      const text: string = data.feedback;
      setFeedbackData({ well: text.match(/WHAT YOU DID WELL:\s*([\s\S]*?)(?=WHAT TO CONSIDER:|$)/i)?.[1]?.trim() || text, consider: text.match(/WHAT TO CONSIDER:\s*([\s\S]*?)(?=L2W BEST PRACTICE:|$)/i)?.[1]?.trim() || "", bestPractice: text.match(/L2W BEST PRACTICE:\s*([\s\S]*?)$/i)?.[1]?.trim() || "" });
      setShowFeedback(true);
      if (selectedCategory) setCategoryCounts((prev) => ({ ...prev, [selectedCategory]: (prev[selectedCategory] || 0) + 1 }));
    } catch { setFeedbackError(true); setApiError("Couldn\u2019t get feedback."); } finally { setIsSubmitting(false); }
  };

  const handleRetryFeedback = () => { setFeedbackError(false); handleSubmit(); };
  const handleTryAnother = () => { setResponse(""); setShowFeedback(false); setFeedbackData(null); setFeedbackError(false); if (selectedCategory) generateScenario(selectedCategory); };
  const handleDifferentCategory = () => { setSelectedCategory(null); setResponse(""); setShowFeedback(false); setFeedbackData(null); setScenarioText(""); setScenarioError(false); setFeedbackError(false); setScenarioCount(0); };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && response.trim().length >= 10 && !isSubmitting && !showFeedback) { e.preventDefault(); handleSubmit(); } };
  const handleSaveScenario = async () => {
    const parts = [`CATEGORY: ${getCategoryName(selectedCategory!)}`, "", "SCENARIO:", scenarioText, "", "MY RESPONSE:", response];
    if (feedbackData) { parts.push("", "FEEDBACK:"); if (feedbackData.well) parts.push(`What you did well: ${feedbackData.well}`); if (feedbackData.consider) parts.push(`What to consider: ${feedbackData.consider}`); if (feedbackData.bestPractice) parts.push(`L2W Best Practice: ${feedbackData.bestPractice}`); }
    try { await navigator.clipboard.writeText(parts.join("\n")); setShowCopied(true); setTimeout(() => setShowCopied(false), 2000); } catch { /* silent */ }
  };

  // Category metadata — colors, icons
  const catMeta: Record<string, { accent: string; icon: React.ReactNode }> = {
    "first-contact": { accent: "#2C7A7B", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> },
    "hesitant": { accent: "#D88A4B", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
    "barriers": { accent: "#C05656", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11"/></svg> },
    "follow-up": { accent: "#285E61", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    "outreach": { accent: "#C05656", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    "reporting": { accent: "#2C7A7B", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  };

  if (apiUnavailable) {
    return (
      <div className="animate-fade-up"><BackButton onClick={goHome} label="Home" />
        <div className="mt-16 py-20 text-center"><p className="text-[14px] text-[#78716C]">AI Scenarios is not available. Contact your administrator.</p></div>
      </div>
    );
  }

  const activeCat = AI_CATEGORIES.find((c) => c.id === selectedCategory);
  const activeMeta = selectedCategory ? catMeta[selectedCategory] : null;

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} label="Home" />

      {/* ═══════════════ CATEGORY SELECTION VIEW ═══════════════ */}
      {!selectedCategory && (
        <div>
          {/* Asymmetric hero — large left title, right decorative */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 items-end mb-12 mt-4">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#2C7A7B] to-[#285E61] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(44,122,123,0.3)]">
                  <svg width="16" height="16" viewBox="30 30 45 40" fill="white"><path d="m59.5 46s-0.30078-2.8281-1.4883-4.0117c-1.1914-1.1797-4.0117-1.4883-4.0117-1.4883s2.8281-0.30078 4.0117-1.4883c1.1797-1.1914 1.4883-4.0117 1.4883-4.0117s0.30078 2.8281 1.4883 4.0117c1.1797 1.1797 4.0117 1.4883 4.0117 1.4883s-2.8281 0.30078-4.0117 1.4883c-1.1797 1.1797-1.4883 4.0117-1.4883 4.0117zm-13.25-3.5s-0.62109 5.7891-3.0391 8.2109c-2.4219 2.4219-8.2109 3.0391-8.2109 3.0391s5.7891 0.62109 8.2109 3.0391c2.4219 2.4219 3.0391 8.2109 3.0391 8.2109s0.62109-5.7891 3.0391-8.2109c2.4219-2.4219 8.2109-3.0391 8.2109-3.0391s-5.7891-0.62109-8.2109-3.0391c-2.4219-2.4219-3.0391-8.2109-3.0391-8.2109z"/></svg>
                </div>
                <span className="text-[10px] font-semibold text-[#2C7A7B] uppercase tracking-[0.2em]">AI-Powered Training</span>
              </div>
              <h1 className="text-[32px] md:text-[40px] font-bold tracking-tighter text-[#1C1917] leading-[1.05]">
                Practice real<br />conversations.
              </h1>
              <p className="text-[14px] text-[#78716C] mt-4 leading-relaxed max-w-[42ch]">
                Build confidence with AI-generated scenarios drawn from real social prescribing situations across Ontario SALCs.
              </p>
              {totalPracticed > 0 && (
                <div className="flex items-center gap-3 mt-5">
                  <span className="text-[11px] font-medium text-[#2C7A7B] bg-[#E6F4F4] px-2.5 py-1 rounded-md">{totalPracticed} practiced</span>
                  <span className="text-[11px] text-[#A8998E]">{Object.keys(categoryCounts).length}/{AI_CATEGORIES.length} categories</span>
                </div>
              )}
            </div>
            {/* Right decorative — abstract conversation illustration */}
            <div className="hidden md:flex flex-col items-end gap-2 pb-2">
              <div className="w-40 h-6 rounded-xl bg-[#E6F4F4] opacity-60" />
              <div className="w-28 h-6 rounded-xl bg-[#E6F4F4] self-start ml-4 opacity-40" />
              <div className="w-36 h-6 rounded-xl bg-[#FEF3E2] opacity-50" />
              <div className="w-24 h-6 rounded-xl bg-[#E6F4F4] self-start ml-8 opacity-30" />
              <div className="w-32 h-6 rounded-xl bg-[#FEE2E2] opacity-40" />
            </div>
          </div>

          {/* Category list — stacked rows, NOT card grid */}
          <div className="divide-y divide-[#F0EEEC]">
            {AI_CATEGORIES.map((cat, i) => {
              const meta = catMeta[cat.id];
              const isHovered = hoveredCat === cat.id;
              const practiced = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  onMouseEnter={() => setHoveredCat(cat.id)}
                  onMouseLeave={() => setHoveredCat(null)}
                  className="group w-full text-left grid grid-cols-[auto_1fr_auto] gap-4 py-5 first:pt-2 cursor-pointer transition-all duration-300 active:scale-[0.99]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Number + icon */}
                  <div className="flex items-center gap-3 w-20">
                    <span className="text-[24px] font-bold tracking-tighter transition-colors duration-300" style={{ color: isHovered ? meta.accent : "#E7E5E4" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[#1C1917] group-hover:text-[#2C7A7B] transition-colors duration-200 tracking-tight">{cat.name}</p>
                    <p className="text-[12px] text-[#A8998E] mt-0.5 leading-relaxed group-hover:text-[#78716C] transition-colors duration-200 line-clamp-1">{cat.description}</p>
                  </div>
                  {/* Right side — difficulty + arrow */}
                  <div className="flex items-center gap-3 self-center">
                    {practiced > 0 && <span className="text-[9px] text-[#A8998E] hidden sm:inline">{practiced}x</span>}
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md hidden sm:inline-block" style={{ color: meta.accent, background: `${meta.accent}14` }}>{cat.difficulty}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isHovered ? meta.accent : "#D6D3D1"} strokeWidth="2" strokeLinecap="round" className="transition-all duration-300 group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════ ACTIVE SCENARIO WORKSPACE ═══════════════ */}
      {selectedCategory && activeCat && activeMeta && (
        <div className="animate-fade-up">
          {/* Workspace header — category context */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={handleDifferentCategory} className="flex items-center gap-1.5 text-[11px] font-medium text-[#A8998E] hover:text-[#2C1810] transition-colors active:scale-[0.97]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              All categories
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${activeMeta.accent}14`, color: activeMeta.accent }}>
                {activeMeta.icon}
              </div>
              <span className="text-[12px] font-semibold text-[#1C1917] tracking-tight">{activeCat.name}</span>
              {scenarioCount > 0 && (
                <span className="text-[10px] text-[#A8998E] font-mono">#{scenarioCount}</span>
              )}
            </div>
          </div>

          {/* ── Scenario ── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: activeMeta.accent }} />
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ color: activeMeta.accent }}>Scenario</p>
            </div>

            {isLoadingScenario ? (
              <div className="space-y-3 py-4">
                {[100, 85, 70, 95, 60].map((w, i) => (
                  <div key={i} className="h-[14px] rounded-md animate-pulse" style={{ width: `${w}%`, background: `${activeMeta.accent}0A`, animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            ) : scenarioError ? (
              <div className="py-10 text-center">
                <p className="text-[13px] text-[#78716C]">Could not generate scenario.</p>
                <button onClick={() => generateScenario(selectedCategory)} className="mt-2 text-[12px] font-medium underline underline-offset-2" style={{ color: activeMeta.accent }}>Try again</button>
              </div>
            ) : (
              <>
                <div className="relative pl-5 border-l-2 ml-0.5" style={{ borderColor: `${activeMeta.accent}30` }}>
                  <p className="text-[15px] text-[#1C1917] leading-[1.85] max-w-[58ch]">{scenarioText}</p>
                </div>
                <div className="mt-6 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${activeMeta.accent}14` }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={activeMeta.accent} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: activeMeta.accent }}>How would you respond?</p>
                </div>
              </>
            )}
          </div>

          {/* ── Response ── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D88A4B]" />
              <p className="text-[10px] font-semibold tracking-[0.15em] text-[#D88A4B] uppercase">Your response</p>
            </div>

            <div className="relative">
              <textarea
                value={response}
                onChange={(e) => !showFeedback && setResponse(e.target.value)}
                onKeyDown={handleKeyDown}
                readOnly={showFeedback}
                disabled={isLoadingScenario || isSubmitting}
                placeholder="Type what you would say or do..."
                rows={6}
                className={`w-full rounded-xl border px-5 py-4 text-[14px] text-[#1C1917] placeholder:text-[#C4B5A6] leading-[1.75] resize-y transition-all duration-500 ${showFeedback ? "bg-[#FAFAF9] border-[#E7E5E4] cursor-default" : "bg-white border-[#E7E5E4] focus:border-transparent focus:shadow-[0_0_0_2px_rgba(44,122,123,0.15)]"} focus:outline-none`}
              />
              {/* Bottom bar */}
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-[#C4B5A6] tabular-nums">
                  {response.trim().length > 0 && response.trim().length < 10 ? `${response.trim().length}/10 min` : wordCount > 0 ? `${wordCount} words` : "\u00A0"}
                </p>
                {!showFeedback && (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-[#D6D3D1] hidden sm:inline">{typeof navigator !== "undefined" && navigator?.platform?.includes?.("Mac") ? "Cmd" : "Ctrl"}+Enter</span>
                    <button
                      onClick={handleSubmit}
                      disabled={response.trim().length < 10 || isSubmitting || isLoadingScenario || scenarioError}
                      className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-500 active:scale-[0.96]"
                      style={{ background: isSubmitting ? "#285E61" : activeMeta.accent, boxShadow: `0 4px 14px -4px ${activeMeta.accent}50` }}
                    >
                      {isSubmitting ? "Analyzing..." : "Get Feedback"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            {feedbackError && !showFeedback && (
              <p className="mt-2 text-[11px] text-[#78716C]">Failed. <button onClick={handleRetryFeedback} className="font-medium underline underline-offset-2" style={{ color: activeMeta.accent }}>Retry</button></p>
            )}
          </div>

          {/* ── Feedback ── */}
          {showFeedback && feedbackData && (
            <div className="animate-fade-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2C7A7B]" />
                <p className="text-[10px] font-semibold tracking-[0.15em] text-[#2C7A7B] uppercase">Feedback</p>
              </div>

              {/* Feedback — asymmetric grid: wide + narrow */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 mb-10">
                {/* Left: What went well + what to consider, stacked */}
                <div className="space-y-6">
                  {feedbackData.well && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2C7A7B" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <p className="text-[11px] font-semibold text-[#2C7A7B] uppercase tracking-wider">Strengths</p>
                      </div>
                      <p className="text-[14px] text-[#1C1917] leading-[1.8] max-w-[50ch]">{feedbackData.well}</p>
                    </div>
                  )}
                  {feedbackData.consider && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D88A4B" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p className="text-[11px] font-semibold text-[#D88A4B] uppercase tracking-wider">Consider</p>
                      </div>
                      <p className="text-[14px] text-[#1C1917] leading-[1.8] max-w-[50ch]">{feedbackData.consider}</p>
                    </div>
                  )}
                </div>
                {/* Right: L2W Best Practice — elevated sidebar */}
                {feedbackData.bestPractice && (
                  <div className="bg-[#FAFAF9] rounded-xl p-5 border border-[#F0EEEC] self-start">
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#285E61" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                      <p className="text-[10px] font-semibold text-[#285E61] uppercase tracking-wider">L2W Reference</p>
                    </div>
                    <p className="text-[13px] text-[#57534E] leading-[1.75]">{feedbackData.bestPractice}</p>
                  </div>
                )}
              </div>

              {/* Actions — clean row */}
              <div className="flex items-center gap-3 pt-6 border-t border-[#F0EEEC]">
                <button onClick={handleTryAnother} className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all duration-300 active:scale-[0.96]" style={{ background: activeMeta.accent }}>
                  Next scenario
                </button>
                <button onClick={handleDifferentCategory} className="px-4 py-2 rounded-lg border border-[#E7E5E4] text-[12px] font-medium text-[#57534E] hover:bg-[#F7F5F3] transition-all duration-300 active:scale-[0.96]">
                  Switch category
                </button>
                <button onClick={handleSaveScenario} className="ml-auto text-[10px] text-[#A8998E] hover:text-[#1C1917] transition-colors flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
                  {showCopied ? "Copied" : "Copy"}
                </button>
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
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  // Use CATEGORY_SUBCATS for ordering; flatten children into the list
  const subcatNodes = CATEGORY_SUBCATS[id] || [];
  const subcategories: string[] = [];
  subcatNodes.forEach((node) => {
    if (!node.isContainer) subcategories.push(node.name);
    if (node.children) {
      node.children.forEach((child) => {
        if (resources.some((r) => r.subcategory === child)) {
          subcategories.push(child);
        }
      });
    }
  });
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

  // Color accents per section index to create visual variety
  const sectionAccents = [
    { num: "#2C7A7B", bg: "bg-[#E6F4F4]", border: "border-[#2C7A7B]" },
    { num: "#D88A4B", bg: "bg-[#FEF3C7]", border: "border-[#D88A4B]" },
    { num: "#C05656", bg: "bg-[#F2D5D5]", border: "border-[#C05656]" },
    { num: "#7C3AED", bg: "bg-[#EDE9FE]", border: "border-[#7C3AED]" },
    { num: "#285E61", bg: "bg-[#E6F4F4]", border: "border-[#285E61]" },
    { num: "#D97706", bg: "bg-[#FEF3C7]", border: "border-[#D97706]" },
  ];

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />

      {/* Page header — dramatic typography */}
      <div className="mb-10">
        <h1 className="text-[28px] md:text-[36px] font-bold tracking-tighter text-[#2C1810] leading-[1.1]">{cat?.label}</h1>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[13px] text-[#A8998E]">{subcategories.length} sections</span>
          <span className="w-1 h-1 rounded-full bg-[#D4CFC9]" />
          <span className="text-[13px] text-[#A8998E]">{resources.length} resources</span>
        </div>
        {/* Thin accent line */}
        <div className="mt-5 h-px bg-gradient-to-r from-[#2C7A7B]/30 via-[#D88A4B]/20 to-transparent" />
      </div>

      {/* Subcategory sections — editorial stacked rows */}
      <div className="divide-y divide-[#EDEBE9]">
        {subcategories.map((sub, si) => {
          const items = resources.filter((r) => r.subcategory === sub);
          const accent = sectionAccents[si % sectionAccents.length];
          const isHovered = hoveredSection === si;

          return (
            <div key={sub} className="group/section">
              {/* Section header row */}
              <button
                className="w-full text-left py-5 active:scale-[0.998] transition-transform duration-100"
                onClick={() => setPage({ t: "subcat", categoryId: id, subcategory: sub })}
                onMouseEnter={() => setHoveredSection(si)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="grid grid-cols-[48px_1fr_auto] gap-4 items-start">
                  {/* Large section number */}
                  <span
                    className="text-[32px] font-bold leading-none tracking-tight transition-colors duration-300"
                    style={{ color: isHovered ? accent.num : "#E7E5E4" }}
                  >
                    {String(si + 1).padStart(2, "0")}
                  </span>

                  {/* Section info */}
                  <div className="pt-1">
                    <h2 className="text-[16px] font-semibold text-[#2C1810] group-hover/section:text-[#1a1a1a] transition-colors leading-snug">{sub}</h2>
                    {/* Resource preview — show first 2 resource titles as context */}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {items.slice(0, 3).map((r, ri) => (
                        <span key={r.id} className="text-[12px] text-[#A8998E] flex items-center gap-1.5">
                          {typeIcon(r.type)}
                          <span className="truncate max-w-[180px]">{r.title}</span>
                        </span>
                      ))}
                      {items.length > 3 && (
                        <span className="text-[11px] text-[#C4B5A6]">+{items.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Right side: count + arrow */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] font-medium text-[#A8998E] tabular-nums">{items.length}</span>
                    <ArrowRight
                      size={16}
                      className="text-[#D4CFC9] group-hover/section:text-[#2C7A7B] group-hover/section:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </div>
              </button>

              {/* Inline resource list — revealed on section hover */}
              <div
                className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  maxHeight: isHovered ? `${items.length * 44 + 16}px` : "0px",
                  opacity: isHovered ? 1 : 0,
                }}
              >
                <div className="pb-4 pl-[64px]">
                  {items.map((r) => {
                    const hasContent = !!RESOURCE_CONTENT[r.id];
                    const isReadable = r.type === "Guide" || r.type === "Video" || hasContent;
                    const hasDownload = !!r.downloadUrl;
                    const rowInner = (
                      <div className="flex items-center gap-3 py-2 group/row">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent.num + "60" }} />
                        <span className="flex-1 text-[13px] text-[#57534E] group-hover/row:text-[#2C1810] transition-colors leading-snug">{r.title}</span>
                        <span className="text-[10px] font-medium text-[#A8998E] opacity-0 group-hover/row:opacity-100 transition-opacity">
                          {hasDownload ? "Download" : isReadable ? (r.type === "Video" ? "Watch →" : "Read →") : r.type + " →"}
                        </span>
                      </div>
                    );
                    return hasDownload ? (
                      <a key={r.id} href={r.downloadUrl} download className="block hover:bg-[#FAFAF9] rounded-lg px-2 -mx-2 transition-colors">
                        {rowInner}
                      </a>
                    ) : (
                      <button
                        key={r.id}
                        className="w-full text-left hover:bg-[#FAFAF9] rounded-lg px-2 -mx-2 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setPage({ t: "content", resourceId: r.id, fromCategory: id }); }}
                      >
                        {rowInner}
                      </button>
                    );
                  })}
                </div>
              </div>
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
  const [calView, setCalView] = useState(true);

  const now = new Date("2026-03-29");
  const upcoming = EVENTS.filter((e) => new Date(e.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = EVENTS.filter((e) => new Date(e.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const filtered = filter === "upcoming" ? upcoming : filter === "past" ? past : [...upcoming, ...past];

  const typeColor: Record<string, { dot: string; bg: string; text: string; label: string; border: string }> = {
    workshop: { dot: "#2C7A7B", bg: "bg-[#E6F4F4]", text: "text-[#2C7A7B]", label: "Workshop", border: "border-[#2C7A7B]/20" },
    cafe: { dot: "#D97706", bg: "bg-[#FEF3C7]", text: "text-[#D97706]", label: "Café", border: "border-[#D97706]/20" },
    "check-in": { dot: "#7C3AED", bg: "bg-[#EDE9FE]", text: "text-[#7C3AED]", label: "Check-In", border: "border-[#7C3AED]/20" },
    webinar: { dot: "#C05656", bg: "bg-[#F2D5D5]", text: "text-[#C05656]", label: "Webinar", border: "border-[#C05656]/20" },
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return { month: months[d.getMonth()].toUpperCase(), day: String(d.getDate()).padStart(2, "0"), weekday: days[d.getDay()], monthFull: months[d.getMonth()] };
  };

  const isThisWeek = (iso: string) => {
    const d = new Date(iso);
    const diff = d.getTime() - now.getTime();
    return diff >= 0 && diff < 7 * 24 * 60 * 60 * 1000;
  };

  // Generate Google Calendar link
  const getCalLink = (ev: L2WEvent) => {
    const d = new Date(ev.date);
    const startHour = ev.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (startHour) {
      let h = parseInt(startHour[1]);
      if (startHour[3].toUpperCase() === "PM" && h !== 12) h += 12;
      if (startHour[3].toUpperCase() === "AM" && h === 12) h = 0;
      d.setHours(h, parseInt(startHour[2]));
    }
    const pad = (n: number) => String(n).padStart(2, "0");
    const start = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const endD = new Date(d.getTime() + 90 * 60000);
    const end = `${endD.getFullYear()}${pad(endD.getMonth()+1)}${pad(endD.getDate())}T${pad(endD.getHours())}${pad(endD.getMinutes())}00`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${start}/${end}&details=${encodeURIComponent(ev.description)}&location=${encodeURIComponent(ev.location)}`;
  };

  // Build mini calendar for current and next month
  const buildCalMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(i);
    while (cells.length % 7 !== 0) cells.push(null);

    // Events on each day
    const eventsByDay: Record<number, L2WEvent[]> = {};
    EVENTS.forEach((ev) => {
      const d = new Date(ev.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (!eventsByDay[d.getDate()]) eventsByDay[d.getDate()] = [];
        eventsByDay[d.getDate()].push(ev);
      }
    });

    return { cells, monthName: monthNames[month], year, eventsByDay };
  };

  const cal1 = buildCalMonth(2026, 2); // March 2026
  const cal2 = buildCalMonth(2026, 3); // April 2026

  // Group filtered events by month for list view
  const grouped: Record<string, typeof filtered> = {};
  filtered.forEach((ev) => {
    const d = new Date(ev.date);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ev);
  });

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block w-6 h-[2px] bg-[#2C7A7B] rounded-full" />
            <span className="text-[10px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Schedule</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#2C1810]">Events Calendar</h1>
          <p className="text-[13px] text-[#78716C] mt-1">{upcoming.length} upcoming · {past.length} past</p>
        </div>
        {/* View toggle */}
        <div className="flex items-center bg-[#F7F5F3] rounded-lg p-0.5">
          <button onClick={() => setCalView(true)} className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${calView ? "bg-white shadow-sm text-[#2C1810]" : "text-[#78716C] hover:text-[#2C1810]"}`}>
            <span className="flex items-center gap-1.5"><Calendar size={12} /> Calendar</span>
          </button>
          <button onClick={() => setCalView(false)} className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${!calView ? "bg-white shadow-sm text-[#2C1810]" : "text-[#78716C] hover:text-[#2C1810]"}`}>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              List
            </span>
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 mb-6">
        {(["upcoming", "past", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 active:scale-[0.97] ${
              filter === f
                ? "bg-[#2C7A7B] text-white shadow-sm"
                : "text-[#57534E] hover:bg-[#E6F4F4] hover:text-[#2C7A7B]"
            }`}
          >
            {f === "upcoming" ? `Upcoming (${upcoming.length})` : f === "past" ? `Past (${past.length})` : "All"}
          </button>
        ))}
        {/* Legend */}
        <div className="ml-auto hidden sm:flex items-center gap-3">
          {Object.entries(typeColor).map(([key, tc]) => (
            <span key={key} className="flex items-center gap-1.5 text-[10px] text-[#78716C]">
              <span className="w-2 h-2 rounded-full" style={{ background: tc.dot }} />
              {tc.label}
            </span>
          ))}
        </div>
      </div>

      {calView ? (
        /* ═══ CALENDAR VIEW ═══ */
        <div className="space-y-8">
          {[cal1, cal2].map((cal) => (
            <div key={`${cal.monthName}-${cal.year}`} className="bg-white rounded-xl border border-[#E7E5E4] overflow-hidden">
              {/* Month header */}
              <div className="px-5 py-3 border-b border-[#F0EEEC] flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-[#2C1810]">{cal.monthName} <span className="text-[#A8998E] font-normal">{cal.year}</span></h3>
                <span className="text-[10px] text-[#A8998E]">{Object.keys(cal.eventsByDay).length} events</span>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-[#F0EEEC]">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="py-2 text-center text-[10px] font-semibold text-[#A8998E] uppercase tracking-wider">{d}</div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {cal.cells.map((day, i) => {
                  const eventsOnDay = day ? (cal.eventsByDay[day] || []) : [];
                  const isToday = day === now.getDate() && cal.monthName === ["January","February","March","April","May","June","July","August","September","October","November","December"][now.getMonth()] && cal.year === now.getFullYear();
                  return (
                    <div key={i} className={`min-h-[72px] p-1.5 border-b border-r border-[#F7F5F3] last:border-r-0 ${!day ? "bg-[#FAFAF9]" : "bg-white"} ${i % 7 === 0 ? "" : ""}`}>
                      {day && (
                        <>
                          <span className={`text-[11px] font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? "bg-[#2C7A7B] text-white" : "text-[#57534E]"}`}>{day}</span>
                          <div className="mt-0.5 space-y-0.5">
                            {eventsOnDay.slice(0, 2).map((ev) => {
                              const tc = typeColor[ev.type] || typeColor.workshop;
                              return (
                                <div key={ev.id} className={`text-[8px] leading-tight font-medium px-1 py-0.5 rounded truncate ${tc.bg} ${tc.text}`}>
                                  {ev.title.length > 18 ? ev.title.slice(0, 18) + "…" : ev.title}
                                </div>
                              );
                            })}
                            {eventsOnDay.length > 2 && (
                              <span className="text-[8px] text-[#A8998E] px-1">+{eventsOnDay.length - 2} more</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Event details — editorial rows, no card boxes */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-6 h-[2px] bg-[#D88A4B] rounded-full" />
              <h2 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Event details</h2>
            </div>
            <div className="divide-y divide-[#F0EEEC]">
              {filtered.map((event) => {
                const { monthFull, day, weekday } = formatDate(event.date);
                const tc = typeColor[event.type] || typeColor.workshop;
                const isPast = new Date(event.date) < now;
                const soon = isThisWeek(event.date);
                return (
                  <div key={event.id} className={`group grid grid-cols-[auto_1fr_auto] gap-x-5 py-5 first:pt-0 cursor-pointer transition-all duration-200 ${isPast ? "opacity-40" : ""}`}>
                    {/* Date — inline text, no box */}
                    <div className="w-14 pt-0.5">
                      <span className="text-[26px] font-bold tracking-tighter leading-none" style={{ color: tc.dot }}>{day}</span>
                      <p className="text-[9px] text-[#A8998E] mt-0.5 uppercase tracking-wider">{weekday}</p>
                    </div>
                    {/* Content — flat, no container */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: tc.dot }} />
                        <span className="text-[10px] font-medium" style={{ color: tc.dot }}>{tc.label}</span>
                        {soon && !isPast && <span className="text-[9px] font-medium text-[#D97706]">This week</span>}
                      </div>
                      <h3 className="text-[14px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors leading-snug tracking-tight">{event.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#A8998E]">
                        <span className="flex items-center gap-1"><Clock size={10} />{event.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
                      </div>
                    </div>
                    {/* CTA — minimal */}
                    {!isPast && (
                      <a
                        href={getCalLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="self-center text-[10px] font-medium text-[#2C7A7B] hover:text-[#285E61] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Calendar size={11} />
                        Add to cal
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ═══ LIST VIEW — editorial rows grouped by month ═══ */
        <div className="space-y-8">
          {Object.entries(grouped).map(([monthLabel, events]) => (
            <div key={monthLabel}>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block w-5 h-[2px] bg-[#D6D3D1] rounded-full" />
                <h3 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">{monthLabel}</h3>
                <span className="flex-1 h-px bg-[#F0EEEC]" />
              </div>
              <div className="divide-y divide-[#F0EEEC]">
                {events.map((event) => {
                  const { monthFull, day, weekday } = formatDate(event.date);
                  const tc = typeColor[event.type] || typeColor.workshop;
                  const isPast = new Date(event.date) < now;
                  const soon = isThisWeek(event.date);
                  return (
                    <div key={event.id} className={`group grid grid-cols-[auto_1fr_auto] gap-x-5 py-5 first:pt-2 cursor-pointer transition-all duration-200 ${isPast ? "opacity-40" : ""}`}>
                      {/* Date */}
                      <div className="w-14 pt-0.5">
                        <span className="text-[26px] font-bold tracking-tighter leading-none" style={{ color: tc.dot }}>{day}</span>
                        <p className="text-[9px] text-[#A8998E] mt-0.5 uppercase tracking-wider">{weekday}</p>
                      </div>
                      {/* Content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: tc.dot }} />
                          <span className="text-[10px] font-medium" style={{ color: tc.dot }}>{tc.label}</span>
                          {soon && !isPast && <span className="text-[9px] font-medium text-[#D97706]">This week</span>}
                        </div>
                        <h3 className="text-[14px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors leading-snug tracking-tight">{event.title}</h3>
                        <p className="text-[11px] text-[#78716C] mt-0.5 line-clamp-1 leading-relaxed max-w-[50ch]">{event.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#A8998E]">
                          <span className="flex items-center gap-1"><Clock size={10} />{event.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
                          {event.tags.length > 0 && (
                            <>
                              <span className="w-[3px] h-[3px] rounded-full bg-[#D6D3D1]" />
                              {event.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-[9px] text-[#A8998E]">{tag}</span>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                      {/* CTA */}
                      {!isPast && (
                        <a
                          href={getCalLink(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="self-center text-[10px] font-medium text-[#2C7A7B] hover:text-[#285E61] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Calendar size={11} />
                          Add to cal
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[13px] text-[#A8998E]">No events found.</div>
          )}
        </div>
      )}
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

  const typeColor: Record<string, { accent: string; bg: string; label: string }> = {
    Video: { accent: "#C05656", bg: "#F2D5D5", label: "Watch" },
    PDF: { accent: "#D88A4B", bg: "#F5E6D6", label: "PDF" },
    Template: { accent: "#7C3AED", bg: "#EDE9FE", label: "Template" },
    Guide: { accent: "#2C7A7B", bg: "#E6F4F4", label: "Read" },
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "Video": return <PlayCircle size={16} className="text-[#C05656]" />;
      case "PDF": return <FileText size={16} className="text-[#D88A4B]" />;
      case "Template": return <FileText size={16} className="text-[#7C3AED]" />;
      default: return <NotebookText size={16} className="text-[#2C7A7B]" />;
    }
  };

  return (
    <div className="animate-fade-up max-w-2xl">
      <BackButton onClick={() => setPage({ t: "cat", id: categoryId })} label={`Back to ${cat?.label}`} />

      {/* Header — editorial style */}
      <div className="mb-8">
        <button
          onClick={() => setPage({ t: "cat", id: categoryId })}
          className="text-[12px] font-medium text-[#2C7A7B] tracking-wide uppercase hover:text-[#285E61] transition-colors"
        >
          {cat?.label}
        </button>
        <h1 className="text-[24px] md:text-[30px] font-bold tracking-tighter text-[#2C1810] leading-[1.1] mt-2">{subcategory}</h1>
        <p className="text-[13px] text-[#A8998E] mt-2">{resources.length} resource{resources.length !== 1 ? "s" : ""} available</p>
        <div className="mt-4 h-px bg-gradient-to-r from-[#2C7A7B]/20 via-[#E7E5E4] to-transparent" />
      </div>

      {resources.length ? (
        <div className="divide-y divide-[#EDEBE9]">
          {resources.map((r, i) => {
            const hasContent = !!RESOURCE_CONTENT[r.id];
            const isReadable = r.type === "Guide" || r.type === "Video" || hasContent;
            const hasDownload = !!r.downloadUrl;
            const tc = typeColor[r.type] || typeColor.Guide;

            const rowInner = (
              <div className="grid grid-cols-[40px_1fr_auto] gap-4 items-center py-4 group/row">
                {/* Type icon with colored accent */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/row:scale-105"
                  style={{ backgroundColor: tc.bg + "80" }}
                >
                  {hasDownload ? <Download size={16} className="text-[#D88A4B]" /> : typeIcon(r.type)}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <span className="text-[14px] font-semibold text-[#2C1810] group-hover/row:text-[#2C7A7B] transition-colors duration-200 leading-snug block">{r.title}</span>
                  <p className="text-[12px] text-[#A8998E] leading-relaxed mt-0.5 line-clamp-1">{r.description}</p>
                </div>

                {/* Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full opacity-0 group-hover/row:opacity-100 transition-all duration-200 translate-x-1 group-hover/row:translate-x-0"
                    style={{ backgroundColor: tc.bg, color: tc.accent }}
                  >
                    {hasDownload ? "Download" : isReadable ? tc.label : r.type}
                  </span>
                  {hasDownload
                    ? <Download size={14} className="text-[#D4CFC9] group-hover/row:text-[#D88A4B] transition-all duration-200" />
                    : <ArrowRight size={14} className="text-[#D4CFC9] group-hover/row:text-[#2C7A7B] group-hover/row:translate-x-0.5 transition-all duration-200" />}
                </div>
              </div>
            );

            return hasDownload ? (
              <a key={r.id} href={r.downloadUrl} download className="block active:scale-[0.99] transition-transform duration-100">
                {rowInner}
              </a>
            ) : (
              <button
                key={r.id}
                className="w-full text-left active:scale-[0.99] transition-transform duration-100"
                onClick={() => setPage({ t: "content", resourceId: r.id, fromCategory: categoryId })}
              >
                {rowInner}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 px-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F7F5F3] mx-auto mb-4 flex items-center justify-center">
            <FileText size={22} className="text-[#C4B5A6]" />
          </div>
          <p className="text-[14px] font-semibold text-[#6B5B4E]">No resources yet</p>
          <p className="text-[12px] text-[#A8998E] mt-1.5">Content is being added to this section</p>
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
    <div className="text-[13px] text-[#44403C] leading-[1.75] whitespace-pre-line">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} className="font-semibold text-[#2C1810]">{part.slice(2, -2)}</strong>
          : part
      )}
    </div>
  );
}

function VoteButtons({ votes, vertical = true }: { votes: number; vertical?: boolean }) {
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const displayVotes = votes + (voteState === "up" ? 1 : voteState === "down" ? -1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={(e) => { e.stopPropagation(); setVoteState(voteState === "up" ? null : "up"); }}
        className={`p-1 rounded-md hover:bg-[#E6F4F4] transition-colors ${voteState === "up" ? "text-[#2C7A7B]" : "text-[#C4B5A6] hover:text-[#2C7A7B]"}`}
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <span className={`text-[11px] font-semibold tabular-nums min-w-[1.5ch] text-center ${voteState === "up" ? "text-[#2C7A7B]" : voteState === "down" ? "text-[#C05656]" : "text-[#78716C]"}`}>
        {displayVotes}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); setVoteState(voteState === "down" ? null : "down"); }}
        className={`p-1 rounded-md hover:bg-red-50 transition-colors ${voteState === "down" ? "text-[#C05656]" : "text-[#C4B5A6] hover:text-[#C05656]"}`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}

function CommentThread({ comment, depth = 0 }: { comment: ForumComment; depth?: number }) {
  if (depth >= 4) {
    return (
      <button className="text-[11px] font-medium text-[#2C7A7B] hover:underline ml-2 mt-1">
        Continue thread
      </button>
    );
  }

  const avatarColors = ["#2C7A7B", "#D88A4B", "#C05656", "#285E61"];
  const avatarColor = avatarColors[comment.id % avatarColors.length];

  return (
    <div className={depth > 0 ? "ml-5 border-l border-[#E7E5E4] pl-4" : ""}>
      <div className="py-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: avatarColor }}>
            {comment.authorName.split(" ").map(n => n[0]).join("")}
          </div>
          <span className="text-[12px] font-semibold text-[#2C1810]">{comment.authorName}</span>
          <span className="text-[10px] text-[#A8998E]">{comment.centre}</span>
          <span className="text-[10px] text-[#C4B5A6]">{comment.timestamp}</span>
        </div>
        <p className="text-[13px] text-[#44403C] leading-relaxed">{comment.body}</p>
        <div className="flex items-center gap-3 mt-2">
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
  const avatarColors = ["#2C7A7B", "#D88A4B", "#C05656", "#285E61"];

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2C1810]">Discussion Forum</h1>
        <p className="text-[13px] text-[#78716C] mt-1 max-w-[50ch] leading-relaxed">Share tips, ask questions, and connect with staff across SALCs.</p>
      </div>

      {/* Post feed */}
      <div className="space-y-4">
        {FORUM_POSTS.map((post, postIdx) => {
          const avatarColor = avatarColors[postIdx % avatarColors.length];
          const previewText = post.body.replace(/\*\*[^*]+\*\*/g, "").replace(/\n/g, " ").slice(0, 140);

          return (
            <div
              key={post.id}
              className="group rounded-xl border border-[#E7E5E4] bg-white hover:border-[#2C7A7B]/20 hover:shadow-[0_8px_24px_-8px_rgba(44,122,123,0.08)] transition-all duration-300 cursor-pointer active:scale-[0.995] overflow-hidden"
              onClick={() => setPage({ t: "forum-post", postId: post.id })}
            >
              <div className="p-5">
                {/* Top row: badges */}
                <div className="flex items-center gap-2 mb-3">
                  {post.pinned && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-[#2C7A7B] uppercase tracking-wider bg-[#E6F4F4] px-2 py-0.5 rounded-md">
                      <Pin className="w-2.5 h-2.5" />
                      Pinned
                    </span>
                  )}
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${FORUM_TOPIC_COLORS[post.topic] || "bg-[#F5F5F4] text-[#525252]"}`}>
                    {post.topic}
                  </span>
                  <span className="text-[10px] text-[#C4B5A6] ml-auto">{post.timestamp}</span>
                </div>

                {/* Title */}
                <h2 className="text-[15px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors leading-snug tracking-tight mb-2">{post.title}</h2>

                {/* Preview text */}
                <p className="text-[12px] text-[#78716C] leading-relaxed line-clamp-2 mb-4">{previewText}...</p>

                {/* Bottom bar: author + stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: avatarColor }}>
                      {post.author.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <span className="text-[12px] font-semibold text-[#2C1810]">{post.author}</span>
                      <span className="text-[10px] text-[#A8998E] ml-1.5">{post.centre}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-[#A8998E]" onClick={(e) => e.stopPropagation()}>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span className="font-semibold">{post.votes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#A8998E]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="font-semibold">{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ForumPostPage({ postId, setPage }: { postId: number; setPage: (p: PageState) => void }) {
  const post = FORUM_POSTS.find(p => p.id === postId);
  if (!post) return <p className="text-[#A8998E]">Post not found.</p>;

  return (
    <div className="animate-fade-up max-w-[720px]">
      <BackButton onClick={() => setPage({ t: "forum" })} label="All discussions" />

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        {post.pinned && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-[#2C7A7B] uppercase tracking-wider bg-[#E6F4F4] px-2 py-0.5 rounded-md">
            <Pin className="w-2.5 h-2.5" />
            Pinned
          </span>
        )}
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${FORUM_TOPIC_COLORS[post.topic] || "bg-[#F5F5F4] text-[#525252]"}`}>
          {post.topic}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl font-semibold tracking-tight text-[#2C1810] leading-snug mb-4">{post.title}</h1>

      {/* Author */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#2C7A7B] to-[#285E61] flex items-center justify-center text-[11px] font-bold text-white">
          {post.author.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#2C1810]">{post.author}</p>
          <p className="text-[10px] text-[#A8998E]">{post.centre} &middot; {post.timestamp}</p>
        </div>
      </div>

      {/* Post body */}
      <div className="rounded-xl border border-[#E7E5E4] bg-white p-5 md:p-6 mb-4">
        <ForumBody text={post.body} />
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-[#E7E5E4]">
        <VoteButtons votes={post.votes} vertical={false} />
        <div className="flex items-center gap-1 text-[11px] text-[#A8998E]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="font-medium">{post.commentCount} comments</span>
        </div>
      </div>

      {/* Comments section */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-block w-6 h-[2px] bg-[#2C7A7B] rounded-full" />
          <h2 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Responses ({post.commentCount})</h2>
        </div>
        <div className="space-y-0">
          {post.comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} depth={0} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CommunityFilteredPage ───────────────────────────────────────────────────

// ─── Community Cafe Page ──────────────────────────────────────────────────────

function CommunityCafePage({ goHome }: { goHome: () => void }) {
  const upcomingCafes = EVENTS.filter((e) => (e.type === "cafe" || e.type === "check-in") && !e.isPast);
  const pastCafes = EVENTS.filter((e) => (e.type === "cafe" || e.type === "check-in") && e.isPast);
  const upcomingWorkshops = EVENTS.filter((e) => e.type === "workshop" && !e.isPast);

  const formatDate = (d: string) => {
    const [, m, day] = d.split("-");
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return { month: months[parseInt(m)] || m, day };
  };

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#2C1810]">Community Cafe</h1>
        <p className="text-[13px] text-[#78716C] mt-1 max-w-[55ch] leading-relaxed">Open conversations, networking, and shared learnings across SALCs.</p>
      </div>

      {/* Upcoming sessions */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="inline-block w-6 h-[2px] bg-[#2C7A7B] rounded-full" />
          <h2 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Upcoming sessions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...upcomingCafes, ...upcomingWorkshops].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6).map((ev) => {
            const { month, day } = formatDate(ev.date);
            const typeColors: Record<string, string> = { cafe: "#D88A4B", workshop: "#2C7A7B", "check-in": "#285E61", webinar: "#C05656" };
            const color = typeColors[ev.type] || "#2C7A7B";
            return (
              <div key={ev.id} className="group flex gap-4 p-4 rounded-xl bg-white border border-[#E7E5E4] hover:border-[#2C7A7B]/25 hover:shadow-[0_8px_24px_-8px_rgba(44,122,123,0.1)] transition-all duration-300 cursor-pointer active:scale-[0.99]">
                {/* Date block */}
                <div className="w-14 h-14 rounded-xl shrink-0 flex flex-col items-center justify-center" style={{ background: `${color}0D` }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{month}</span>
                  <span className="text-[20px] font-semibold leading-none" style={{ color }}>{day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors leading-snug tracking-tight">{ev.title}</p>
                  <p className="text-[11px] text-[#78716C] mt-1 line-clamp-2 leading-relaxed">{ev.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ background: `${color}14`, color }}>{ev.type === "check-in" ? "Check-in" : ev.type}</span>
                    <span className="text-[10px] text-[#A8998E]">{ev.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Past sessions */}
      {pastCafes.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-[2px] bg-[#A8998E] rounded-full" />
            <h2 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Past sessions</h2>
          </div>
          <div className="space-y-2">
            {pastCafes.map((ev) => {
              const { month, day } = formatDate(ev.date);
              return (
                <div key={ev.id} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-[#FAFAF9] transition-all duration-200 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#F5F5F4] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#A8998E]">{month}</span>
                    <span className="text-[14px] font-semibold text-[#78716C] leading-none">{day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#57534E] group-hover:text-[#2C7A7B] transition-colors">{ev.title}</p>
                    <p className="text-[10px] text-[#A8998E]">{ev.time}</p>
                  </div>
                  <span className="text-[9px] font-medium text-[#A8998E] bg-[#F5F5F4] px-2 py-0.5 rounded-md uppercase tracking-wider">Recorded</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Workshop Highlights Page ────────────────────────────────────────────────

function WorkshopHighlightsPage({ goHome }: { goHome: () => void }) {
  const workshops = EVENTS.filter((e) => e.type === "workshop" || e.type === "webinar");
  const upcoming = workshops.filter((e) => !e.isPast);
  const past = workshops.filter((e) => e.isPast);

  const formatDate = (d: string) => {
    const [, m, day] = d.split("-");
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(m)]} ${day}`;
  };

  const thumbColors = ["#2C7A7B", "#D88A4B", "#C05656", "#285E61"];

  // Curated Unsplash images for workshop thumbnails
  const workshopImages: Record<string, string> = {
    "Trauma-Informed Practice": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=340&fit=crop",
    "Supporting Hesitant Participants": "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=600&h=340&fit=crop",
    "Reporting Best Practices": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=340&fit=crop",
    "Social Prescribing 101 Webinar": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=340&fit=crop",
    "Subsidies & Microgrant Q&A": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop",
  };
  const defaultWorkshopImg = "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=340&fit=crop";

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block w-6 h-[2px] bg-[#2C7A7B] rounded-full" />
          <span className="text-[10px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Community</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#2C1810]">Workshop Highlights</h1>
        <p className="text-[13px] text-[#78716C] mt-1 max-w-[55ch] leading-relaxed">Recorded sessions, key takeaways, and training resources from past and upcoming workshops.</p>
      </div>

      {/* Upcoming workshops */}
      {upcoming.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-[2px] bg-[#2C7A7B] rounded-full" />
            <h2 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Upcoming workshops</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {upcoming.map((ev, i) => {
              const color = thumbColors[i % thumbColors.length];
              const img = workshopImages[ev.title] || defaultWorkshopImg;
              return (
                <div key={ev.id} className="group cursor-pointer active:scale-[0.99] transition-all duration-200 rounded-xl border border-[#E7E5E4] hover:border-[#2C7A7B]/25 hover:shadow-[0_12px_32px_-8px_rgba(44,122,123,0.12)] overflow-hidden bg-white">
                  {/* Video thumbnail with real image */}
                  <div className="relative h-44 overflow-hidden">
                    <img src={img} alt={ev.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-13 h-13 rounded-full bg-white/90 shadow-[0_6px_16px_rgba(0,0,0,0.1)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ width: 52, height: 52 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} className="ml-0.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                    {/* Date badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
                      <span className="text-[10px] font-semibold text-[#2C1810]">{formatDate(ev.date)}</span>
                    </div>
                    {/* Time */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-[#1A1A1A]/60 backdrop-blur-sm">
                      <span className="text-[9px] font-medium text-white">{ev.time.split("–")[0].trim()}</span>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[15px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors leading-snug tracking-tight">{ev.title}</p>
                    <p className="text-[12px] text-[#78716C] mt-1 line-clamp-2 leading-relaxed">{ev.description}</p>
                    <div className="flex items-center gap-2 mt-2.5">
                      {ev.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E6F4F4] text-[#2C7A7B]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past workshops */}
      {past.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-[2px] bg-[#A8998E] rounded-full" />
            <h2 className="text-[11px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Past recordings</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {past.map((ev, i) => {
              const color = thumbColors[(i + 2) % thumbColors.length];
              const img = workshopImages[ev.title] || defaultWorkshopImg;
              return (
                <div key={ev.id} className="group cursor-pointer active:scale-[0.99] transition-all duration-200 rounded-xl border border-[#E7E5E4] hover:border-[#2C7A7B]/20 hover:shadow-[0_8px_24px_-8px_rgba(44,122,123,0.08)] overflow-hidden bg-white">
                  <div className="relative h-36 overflow-hidden">
                    <img src={img} alt={ev.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/85 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={color} className="ml-0.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/85 backdrop-blur-sm">
                      <span className="text-[10px] font-medium text-[#57534E]">{formatDate(ev.date)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors leading-snug">{ev.title}</p>
                    <p className="text-[11px] text-[#78716C] mt-1 line-clamp-2 leading-relaxed">{ev.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Impact Stories Page ─────────────────────────────────────────────────────

function ImpactStoriesPage({ goHome }: { goHome: () => void }) {
  const impactResources = RESOURCES.filter(
    (r) => r.subcategory === "L2W Overview & Impact" || r.subcategory === "Public Research"
  );

  // Curated Unsplash photos matched to content themes
  const storyImages: Record<string, string> = {
    "L2W Impact Report Year 1": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
    "L2W Data on Impact Infographic": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop",
    "Evidence for social prescribing": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    "Fact sheets on social prescribing": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    "Report — Social Prescribing in Canada 2025 (CISP)": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    "General Social Prescribing Pathways in Canada": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=400&fit=crop",
    "Social Prescribing Pathway Flowchart": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
  };
  const defaultImg = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop";
  const videoImg = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop";

  const storyColors = ["#2C7A7B", "#D88A4B", "#C05656", "#285E61"];

  // Featured item (first one) gets hero treatment
  const featured = impactResources[0];
  const rest = impactResources.slice(1);

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block w-6 h-[2px] bg-[#D88A4B] rounded-full" />
          <span className="text-[10px] font-semibold text-[#A8998E] uppercase tracking-[0.15em]">Community</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#2C1810]">Impact Stories</h1>
        <p className="text-[13px] text-[#78716C] mt-1 max-w-[55ch] leading-relaxed">Evidence, reports, and stories showing how social prescribing transforms lives across Ontario.</p>
      </div>

      {impactResources.length > 0 ? (
        <div className="space-y-6">
          {/* Hero / Featured story */}
          {featured && (() => {
            const isVideo = featured.type === "Video";
            const img = isVideo ? videoImg : (storyImages[featured.title] || defaultImg);
            return (
              <div className="group relative rounded-2xl overflow-hidden border border-[#E7E5E4] hover:border-[#2C7A7B]/25 hover:shadow-[0_16px_40px_-12px_rgba(44,122,123,0.12)] transition-all duration-300 cursor-pointer active:scale-[0.99] bg-white">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] min-h-[280px]">
                  {/* Image */}
                  <div className="relative h-56 md:h-auto overflow-hidden">
                    <img src={img} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#2C7A7B" className="ml-1">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider text-white uppercase bg-[#2C7A7B]/90 backdrop-blur-sm">
                      {featured.type}
                    </div>
                    {featured.popular && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="#D88A4B"><path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3L8 12.5 3.1 15l.9-5.3-4-3.9L5.5 5z"/></svg>
                        <span className="text-[9px] font-semibold text-[#D88A4B] uppercase tracking-wider">Featured</span>
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-7 flex flex-col justify-center">
                    <p className="text-[20px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors leading-snug tracking-tight">{featured.title}</p>
                    <p className="text-[13px] text-[#78716C] mt-3 leading-relaxed max-w-[45ch]">{featured.description}</p>
                    <div className="flex items-center gap-3 mt-5">
                      <span className="text-[11px] text-[#A8998E] font-medium">{featured.date}</span>
                      <span className="w-[3px] h-[3px] rounded-full bg-[#D6D3D1]" />
                      <span className="text-[11px] text-[#2C7A7B] font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200">
                        {isVideo ? "Watch" : "Read report"}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Grid of remaining stories — asymmetric: 2 cols */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rest.map((r, i) => {
              const color = storyColors[(i + 1) % storyColors.length];
              const isVideo = r.type === "Video";
              const img = isVideo ? videoImg : (storyImages[r.title] || defaultImg);
              return (
                <div key={r.id} className="group relative rounded-xl overflow-hidden border border-[#E7E5E4] hover:border-[#2C7A7B]/25 hover:shadow-[0_12px_32px_-8px_rgba(44,122,123,0.1)] transition-all duration-300 cursor-pointer active:scale-[0.99] bg-white">
                  {/* Image thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    <img src={img} alt={r.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill={color} className="ml-0.5">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Type badge */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider text-white uppercase" style={{ background: `${color}E6` }}>
                      {r.type}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <p className="text-[14px] font-semibold text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors leading-snug tracking-tight line-clamp-2">{r.title}</p>
                    <p className="text-[11px] text-[#78716C] mt-1.5 leading-relaxed line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[10px] text-[#A8998E] font-medium">{r.date}</span>
                      {r.popular && (
                        <>
                          <span className="w-[3px] h-[3px] rounded-full bg-[#D6D3D1]" />
                          <span className="text-[9px] font-semibold text-[#2C7A7B] bg-[#E6F4F4] px-1.5 py-0.5 rounded uppercase tracking-wider">Popular</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E6F4F4] mx-auto mb-4 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C7A7B" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-[#2C1810]">Impact stories coming soon</p>
          <p className="text-[12px] text-[#A8998E] mt-1">We are collecting stories from SALCs across Ontario</p>
        </div>
      )}
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
        return <CommunityCafePage goHome={goHome} />;
      case "community-workshops":
        return <WorkshopHighlightsPage goHome={goHome} />;
      case "community-impact":
        return <ImpactStoriesPage goHome={goHome} />;
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
