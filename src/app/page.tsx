"use client";

import { useState, useEffect, KeyboardEvent } from "react";
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
  if (hour < 12) return "Good morning, Maria.";
  if (hour < 17) return "Good afternoon, Maria.";
  return "Good evening, Maria.";
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
    <Card size="sm" className="border-0 ring-0 shadow-none rounded-none py-3.5 border-b border-gray-100/80 last:border-0 group/card">
      <CardContent className="p-0 px-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-medium text-[#2C1810] group-hover/card:text-[#2C7A7B] transition-colors duration-200">{r.title}</span>
              <Badge variant="secondary" className={typeBadgeClass(r.type)}>{r.type}</Badge>
              {r.popular && !hidePopular && <Badge variant="secondary" className="bg-[#E6F4F4] text-[#2C7A7B] border-transparent">Popular</Badge>}
            </div>
            <p className="text-[13px] text-[#78716C] leading-relaxed">{r.description}</p>
            <p className="text-xs text-[#A8998E] mt-1.5">
              {r.date} · {CATEGORIES.find((c) => c.id === r.category)?.label}
            </p>
          </div>
          <BookmarkIcon
            saved={saved}
            onClick={() => toggleBookmark(r.id)}
            className={`mt-0.5 ${saved ? "" : "opacity-0 group-hover/card:opacity-100"}`}
          />
        </div>
      </CardContent>
    </Card>
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
  const [greeting, setGreeting] = useState("Good morning, Maria.");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const popular = RESOURCES.filter((r) => r.popular);
  const whatsNew = [...RESOURCES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div>
      {/* Personalized Greeting */}
      <div className="mb-10 md:mb-14 animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#2C1810] leading-[1.15]">
          {greeting}
          <br />
          Welcome to L2W Knowledge Hub!
        </h1>
        <p className="text-base text-[#78716C] mt-4 max-w-lg leading-relaxed">
          Your central hub for social prescribing workflows, community resources, and reporting protocols.
        </p>
      </div>

      {/* Bento Grid */}
      <section className="mb-10 animate-fade-up delay-1">
        {/* Row 1: Hero row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <Card
            className="md:col-span-3 cursor-pointer bg-[#E6F4F4] border border-neutral-200 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:border-neutral-300 relative overflow-hidden min-h-[220px]"
            onClick={() => setPage({ t: "cat", id: "hub-guide" })}
          >
            <CardHeader className="relative z-10 p-6">
              <CardTitle className="text-xl font-semibold text-black">
                New here? Learn how to use this hub
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">
                A guided walkthrough for new link workers joining the Links2Wellbeing program.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="md:col-span-2 cursor-pointer bg-white border border-neutral-200 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:border-neutral-300 relative overflow-hidden min-h-[220px]"
            onClick={() => setPage({ t: "ai-scenarios" })}
          >
            <CardHeader className="relative z-10 p-6">
              <CardTitle className="text-xl font-semibold text-black">
                Practice with AI Scenarios
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">
                Rehearse real-world situations like intake calls, hesitant participants, and reporting questions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Row 2: Three featured topics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            className="cursor-pointer bg-[#F2D5D5] border border-neutral-200 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:border-neutral-300 relative overflow-hidden min-h-[160px]"
            onClick={() => setPage({ t: "cat", id: "setup" })}
          >
            <CardHeader className="relative z-10 p-6">
              <CardTitle className="text-xl font-semibold text-black">Set Up Your L2W Program</CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">Pathway, getting started guide, tools, and volunteer resources</CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer bg-[#E6F4F4] border border-neutral-200 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:border-neutral-300 relative overflow-hidden min-h-[160px]"
            onClick={() => setPage({ t: "cat", id: "reporting" })}
          >
            <CardHeader className="relative z-10 p-6">
              <CardTitle className="text-xl font-semibold text-black">Annual Reporting &amp; Evaluation</CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">Financial reports, tracking tools, and submission guides</CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer bg-[#F5E6D6] border border-neutral-200 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:border-neutral-300 relative overflow-hidden min-h-[160px]"
            onClick={() => setPage({ t: "cat", id: "clients" })}
          >
            <CardHeader className="relative z-10 p-6">
              <CardTitle className="text-xl font-semibold text-black">Supporting Clients</CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">Intake, follow-up, participation tracking, and engagement</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Spacer + Separator */}
      <div className="pt-8 pb-6 animate-fade-in delay-3">
        <Separator className="bg-gray-200/80" />
      </div>

      {/* Recommended For You */}
      <section className="mb-12 animate-fade-up delay-4">
        <h2 className="text-sm font-semibold text-[#A8998E] uppercase tracking-widest mb-4">
          Recommended for you
        </h2>
        <Card className="border-gray-200/80 shadow-sm">
          <CardContent className="p-0 px-5">
            {popular.map((r) => (
              <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} hidePopular />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* What's New */}
      <section className="mb-8 animate-fade-up delay-5">
        <h2 className="text-sm font-semibold text-[#A8998E] uppercase tracking-widest mb-4">
          What&apos;s new
        </h2>
        <Card className="border-gray-200/80 shadow-sm">
          <CardContent className="p-0 px-5">
            {whatsNew.map((r) => (
              <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// ─── AI Scenarios Placeholder ─────────────────────────────────────────────────

function AIScenariosPage({ goHome }: { goHome: () => void }) {
  return (
    <div className="max-w-xl animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2C1810]">
        Practice with AI Scenarios
      </h1>
      <p className="text-sm text-[#78716C] mt-2 mb-8 leading-relaxed">
        Rehearse real-world social prescribing situations with AI-generated practice scenarios.
      </p>
      <Card className="border-gray-200/80 shadow-sm mb-8">
        <CardContent className="py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4F4] mx-auto mb-4 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C7A7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#2C1810] mb-1.5">Coming Soon</p>
          <p className="text-sm text-[#78716C] leading-relaxed max-w-sm mx-auto">
            You&apos;ll be able to practice intake calls, handle hesitant participants, navigate reporting questions, and more.
          </p>
        </CardContent>
      </Card>
      <BackButton onClick={goHome} label="Home" />
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
  const templates = RESOURCES.filter((r) => r.type === "Template");
  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">Templates</h1>
      <p className="text-sm text-[#A8998E] mt-1">{templates.length} templates</p>
      <div className="mt-6">
        <Card className="border-gray-200/80 shadow-sm">
          <CardContent className="p-0 px-5">
            {templates.map((r) => (
              <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            ))}
          </CardContent>
        </Card>
      </div>
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

// Small folder icon SVG
const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" style={{ opacity: 0.6 }}>
    <path d="M2 4.5C2 3.67 2.67 3 3.5 3H6.29a1 1 0 0 1 .7.29L8 4.3h4.5c.83 0 1.5.67 1.5 1.5v5.7c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7z" stroke="#C96A2B" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
  </svg>
);

// Tree connector line component
const TreeLine = ({ isLast }: { isLast: boolean }) => (
  <span className="shrink-0 w-4 h-full flex items-center relative" style={{ minHeight: 20 }}>
    {/* Vertical line */}
    {!isLast && <span className="absolute left-[7px] top-0 bottom-0 w-px bg-[#D6D3D1]" />}
    {isLast && <span className="absolute left-[7px] top-0 h-1/2 w-px bg-[#D6D3D1]" />}
    {/* Horizontal branch */}
    <span className="absolute left-[7px] top-1/2 w-[9px] h-px bg-[#D6D3D1]" />
  </span>
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

  // Track which topics have their subcategories expanded (all expanded by default)
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SIDEBAR_TOPICS.forEach((cat) => { init[cat.id] = true; });
    return init;
  });

  const toggleTopic = (catId: string) => {
    setExpandedTopics((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const isActive = (key: string) => active === key;
  const activeClass = "bg-[#E6F4F4] text-[#2C7A7B] hover:bg-[#E6F4F4] hover:text-[#2C7A7B]";
  const parentActiveClass = "bg-[#E6F4F4]/50 text-[#2C7A7B]";

  // Chevron SVG component
  const Chevron = ({ open }: { open: boolean }) => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <path d="M3.5 2L7 5L3.5 8" stroke="#A8998E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Primary 18px menu item (non-collapsible)
  const primaryNav = (key: string, page: PageState, label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <button
      className={`w-full flex items-center gap-2.5 text-left px-3 py-2 text-[18px] font-medium rounded-md transition-colors ${isActive(key) ? activeClass : "text-[#2C1810] hover:bg-gray-100"}`}
      onClick={() => { setPage(page); onNavigate?.(); }}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {label}
    </button>
  );

  // Primary 18px collapsible menu item
  const primaryCollapsible = (label: string, open: boolean, toggle: () => void, Icon: React.ComponentType<{ className?: string }>) => (
    <button
      className="w-full flex items-center justify-between px-3 py-2 text-[18px] font-medium text-[#2C1810] rounded-md transition-colors hover:bg-gray-100"
      onClick={toggle}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="w-[18px] h-[18px] shrink-0" />
        {label}
      </span>
      <Chevron open={open} />
    </button>
  );

  // Tree sub-item (for Community, Tools, Help)
  const treeSubNav = (key: string, page: PageState, label: string, isLast: boolean) => (
    <button
      className={`w-full flex items-center text-left pl-6 pr-3 py-1 text-[14px] font-normal rounded-md transition-colors ${isActive(key) ? activeClass : "text-[#6B5B4E] hover:bg-gray-100"}`}
      onClick={() => { setPage(page); onNavigate?.(); }}
    >
      <TreeLine isLast={isLast} />
      <span className="ml-1">{label}</span>
    </button>
  );

  return (
    <ScrollArea className="flex-1">
      <nav className="p-3 space-y-0.5">
        {/* Home */}
        {primaryNav("home", { t: "home" }, "Home", HomeIcon)}

        {/* All Topics */}
        {primaryCollapsible("All Topics", topicsOpen, () => setTopicsOpen(!topicsOpen), BookOpen)}
        {topicsOpen && (
          <div className="space-y-0">
            {SIDEBAR_TOPICS.map((cat, catIdx) => {
              const subcatNodes = SIDEBAR_TREE_CATS.has(cat.id) ? (CATEGORY_SUBCATS[cat.id] || []) : [];
              const isExpanded = expandedTopics[cat.id];
              const isCatActive = activeCategory === cat.id;
              const isLastTopic = catIdx === SIDEBAR_TOPICS.length - 1;

              return (
                <div key={cat.id}>
                  {/* Topic row with chevron */}
                  <div className="flex items-center pl-5 pr-3">
                    <span className="shrink-0 w-4 flex items-center relative" style={{ minHeight: 28 }}>
                      {!isLastTopic && <span className="absolute left-[7px] top-0 bottom-0 w-px bg-[#D6D3D1]" />}
                      {isLastTopic && <span className="absolute left-[7px] top-0 h-1/2 w-px bg-[#D6D3D1]" />}
                      <span className="absolute left-[7px] top-1/2 w-[9px] h-px bg-[#D6D3D1]" />
                    </span>
                    <button
                      className={`flex-1 flex items-center justify-between py-1.5 pl-1 pr-1 text-[15px] font-normal rounded-md transition-colors ${
                        isCatActive && !active.startsWith("subcat:") ? activeClass : isCatActive ? parentActiveClass : "text-[#6B5B4E] hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setPage({ t: "cat", id: cat.id });
                        if (!isExpanded && subcatNodes.length > 0) toggleTopic(cat.id);
                        onNavigate?.();
                      }}
                    >
                      <span>{cat.label}</span>
                    </button>
                    {subcatNodes.length > 0 && (
                      <button
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        onClick={(e) => { e.stopPropagation(); toggleTopic(cat.id); }}
                      >
                        <Chevron open={isExpanded} />
                      </button>
                    )}
                  </div>

                  {/* Subcategories with tree connectors (Level 2) */}
                  {isExpanded && subcatNodes.length > 0 && (
                    <div className="relative">
                      {!isLastTopic && (
                        <span className="absolute left-[27px] top-0 bottom-0 w-px bg-[#D6D3D1]" />
                      )}
                      {subcatNodes.map((node, subIdx) => {
                        const isLastSub = subIdx === subcatNodes.length - 1;
                        const hasChildren = node.children && node.children.length > 0;
                        const subKey = `subcat:${cat.id}:${node.name}`;
                        const isChildActive = hasChildren && node.children!.some((ch) => active === `subcat:${cat.id}:${ch}`);

                        return (
                          <div key={node.name}>
                            {/* Level 2 subcategory button */}
                            <button
                              className={`w-full flex items-center text-left pl-10 pr-3 py-0.5 text-[13px] font-normal rounded-md transition-colors ${
                                isActive(subKey) ? activeClass : isChildActive ? parentActiveClass : "text-[#6B5B4E] hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                if (node.isContainer) {
                                  // Container nodes don't navigate, just visual grouping
                                } else {
                                  setPage({ t: "subcat", categoryId: cat.id, subcategory: node.name });
                                  onNavigate?.();
                                }
                              }}
                            >
                              <span className="shrink-0 w-4 flex items-center relative" style={{ minHeight: 22 }}>
                                {!isLastSub && <span className="absolute left-[7px] top-0 bottom-0 w-px bg-[#D6D3D1]" />}
                                {isLastSub && <span className="absolute left-[7px] top-0 h-1/2 w-px bg-[#D6D3D1]" />}
                                <span className="absolute left-[7px] top-1/2 w-[9px] h-px bg-[#D6D3D1]" />
                              </span>
                              <span className="ml-1 flex items-center gap-1.5">
                                <FolderIcon />
                                <span className="leading-snug">{node.name}</span>
                              </span>
                            </button>

                            {/* Level 3 children (sub-subcategories) */}
                            {hasChildren && node.children!.map((child, childIdx) => {
                              const isLastChild = childIdx === node.children!.length - 1;
                              const childKey = `subcat:${cat.id}:${child}`;
                              // Check if child is a real subcategory (has resources) or just a label
                              const childIsSubcat = RESOURCES.some((r) => r.category === cat.id && r.subcategory === child);

                              return (
                                <button
                                  key={child}
                                  className={`w-full flex items-center text-left pl-[60px] pr-3 py-0.5 text-[12px] font-normal rounded-md transition-colors ${
                                    isActive(childKey) ? activeClass : "text-[#A8998E] hover:text-[#6B5B4E] hover:bg-gray-100"
                                  }`}
                                  onClick={() => {
                                    if (childIsSubcat) {
                                      setPage({ t: "subcat", categoryId: cat.id, subcategory: child });
                                    } else {
                                      // Navigate to parent subcategory
                                      setPage({ t: "subcat", categoryId: cat.id, subcategory: node.name });
                                    }
                                    onNavigate?.();
                                  }}
                                >
                                  <span className="shrink-0 w-4 flex items-center relative" style={{ minHeight: 20 }}>
                                    {!isLastChild && <span className="absolute left-[7px] top-0 bottom-0 w-px bg-[#E7E5E4]" />}
                                    {isLastChild && <span className="absolute left-[7px] top-0 h-1/2 w-px bg-[#E7E5E4]" />}
                                    <span className="absolute left-[7px] top-1/2 w-[7px] h-px bg-[#E7E5E4]" />
                                  </span>
                                  <span className="ml-1 flex items-center gap-1.5">
                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0" style={{ opacity: 0.45 }}>
                                      <path d="M2 4.5C2 3.67 2.67 3 3.5 3H6.29a1 1 0 0 1 .7.29L8 4.3h4.5c.83 0 1.5.67 1.5 1.5v5.7c0 .83-.67 1.5-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5v-7z" stroke="#C96A2B" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
                                    </svg>
                                    <span className="leading-snug">{child}</span>
                                  </span>
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

        {/* Community */}
        {primaryCollapsible("Community", communityOpen, () => setCommunityOpen(!communityOpen), Users)}
        {communityOpen && (
          <div className="space-y-0">
            {([
              { key: "community-cafe", page: { t: "community-cafe" } as PageState, label: "Community Cafe" },
              { key: "forum", page: { t: "forum" } as PageState, label: "Discussion Forum" },
              { key: "community-workshops", page: { t: "community-workshops" } as PageState, label: "Workshop Highlights" },
              { key: "community-impact", page: { t: "community-impact" } as PageState, label: "Impact Stories" },
            ]).map((item, i, arr) => (
              <div key={item.key}>
                {treeSubNav(item.key, item.page, item.label, i === arr.length - 1)}
              </div>
            ))}
          </div>
        )}

        {/* Tools */}
        {primaryCollapsible("Tools", toolsOpen, () => setToolsOpen(!toolsOpen), Wrench)}
        {toolsOpen && (
          <div className="space-y-0">
            {treeSubNav("workflows", { t: "workflows" }, "Workflows", false)}
            {treeSubNav("templates", { t: "templates" }, "Templates", false)}
            {treeSubNav("reporting", { t: "cat", id: "reporting" }, "Reporting", true)}
          </div>
        )}

        {/* Help */}
        {primaryCollapsible("Help", helpOpen, () => setHelpOpen(!helpOpen), CircleHelp)}
        {helpOpen && (
          <div className="space-y-0">
            {treeSubNav("faq", { t: "faq" }, "FAQ", false)}
            {treeSubNav("recent", { t: "recent" }, "Recently Updated", false)}
            <button
              className={`w-full flex items-center pl-6 pr-3 py-1 text-[14px] font-normal rounded-md transition-colors ${isActive("bookmarks") ? activeClass : "text-[#6B5B4E] hover:bg-gray-100"}`}
              onClick={() => { setPage({ t: "bookmarks" }); onNavigate?.(); }}
            >
              <TreeLine isLast={true} />
              <span className="ml-1 flex items-center justify-between flex-1">
                <span>Bookmarks</span>
                {bookmarkCount > 0 && (
                  <Badge variant="default" className="bg-[#2C7A7B] text-white">{bookmarkCount}</Badge>
                )}
              </span>
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
    <Card className="w-80 shrink-0 border-r border-gray-200/80 rounded-none ring-0 flex flex-col h-screen sticky top-0 bg-[#FAFAF8] overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-gray-200/60 shrink-0">
        <div className="flex items-center justify-center">
          <img src="/l2w-logo.svg" alt="Links2Wellbeing" className="h-10 w-auto" />
        </div>
      </CardHeader>
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
    </Card>
  );
}

// ─── RightPanel ───────────────────────────────────────────────────────────────

function RightPanelContent({ bookmarks }: { bookmarks: number[] }) {
  const saved = RESOURCES.filter((r) => bookmarks.includes(r.id)).slice(0, 4);
  return (
    <div className="p-5 space-y-7">
      {/* Upcoming Workshops */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#C96A2B]" />
          <p className="text-sm font-semibold text-[#2C1810]">Upcoming Workshops</p>
        </div>
        <div className="space-y-3">
          {WORKSHOPS.map((w, i) => (
            <div key={i} className="flex items-start gap-3 group cursor-pointer">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-[#F5E6D6] flex flex-col items-center justify-center overflow-hidden">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#C96A2B] leading-none">{w.month}</span>
                <span className="text-base font-semibold text-[#2C1810] leading-tight">{w.day}</span>
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13px] font-medium text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors duration-200 leading-snug">{w.title}</p>
                <p className="text-[11px] text-[#A8998E] mt-0.5">{w.time} · {w.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-gray-200/60" />

      {/* Upcoming Deadlines */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#B23A3A]" />
          <p className="text-sm font-semibold text-[#2C1810]">Upcoming Deadlines</p>
        </div>
        <div className="space-y-3">
          {DEADLINES.map((d, i) => {
            const [month, day] = d.date.split(" ");
            return (
              <div key={i} className="flex items-start gap-3">
                <div className={`shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center overflow-hidden ${d.urgent ? "bg-[#F2D5D5]" : "bg-gray-100"}`}>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider leading-none ${d.urgent ? "text-[#B23A3A]" : "text-[#6B5B4E]"}`}>{month.toUpperCase()}</span>
                  <span className="text-base font-semibold text-[#2C1810] leading-tight">{day}</span>
                </div>
                <div className="min-w-0 pt-1.5">
                  <p className="text-[13px] font-medium text-[#2C1810] leading-snug">{d.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Separator className="bg-gray-200/60" />

      {/* Quick Links */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#2F7D5B]" />
          <p className="text-sm font-semibold text-[#2C1810]">Quick Links</p>
        </div>
        <div className="space-y-2">
          {[
            { label: "L2W Google Drive", external: true },
            { label: "Contact support", external: true },
            { label: "Submit feedback", external: false },
            { label: "Request a resource", external: false },
          ].map((l) => (
            <div key={l.label} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200/80 hover:border-[#2C7A7B]/30 hover:bg-[#E6F4F4]/30 cursor-pointer transition-all duration-200 group">
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
    <Card className="w-64 shrink-0 border-l border-gray-200/60 rounded-none ring-0 h-screen sticky top-0 bg-[#FAFAF8]">
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
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="px-5 py-4 border-b border-gray-200">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex items-center justify-center">
              <img src="/l2w-logo.svg" alt="Links2Wellbeing" className="h-10 w-auto" />
            </div>
          </SheetHeader>
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
        <Card className="flex items-center justify-between gap-4 px-4 md:px-6 py-3 border-b border-gray-200/60 rounded-none ring-0 shrink-0 flex-row bg-white/80 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden shrink-0 text-[#6B5B4E]"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </Button>
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search resources, templates, guidance..."
              className="bg-[#F7F7F5] border-gray-200/80 text-sm text-[#2C1810] placeholder:text-[#A8998E] focus-visible:border-[#2C7A7B] focus-visible:ring-[#2C7A7B]/20 transition-all duration-200 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-[#6B5B4E]"
              onClick={() => setRightPanelOpen(true)}
            >
              More
            </Button>
            <div className="w-8 h-8 rounded-full bg-[#2C7A7B] text-white flex items-center justify-center text-[11px] font-semibold shadow-sm">
              MA
            </div>
          </div>
        </Card>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="flex">
            <div className="flex-1 p-5 md:p-10">
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
    </div>
  );
}
