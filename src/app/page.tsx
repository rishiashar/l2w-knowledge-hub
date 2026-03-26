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
  type CategoryId,
  type Resource,
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

type PageState =
  | { t: "home" }
  | { t: "cat"; id: CategoryId }
  | { t: "search"; q: string }
  | { t: "bookmarks" }
  | { t: "faq" }
  | { t: "templates" }
  | { t: "workflows" }
  | { t: "recent" }
  | { t: "forum" }
  | { t: "ai-scenarios" }
  | { t: "community-cafe" }
  | { t: "community-workshops" }
  | { t: "community-impact" };

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant={saved ? "secondary" : "ghost"}
                    size="xs"
                    onClick={() => toggleBookmark(r.id)}
                    className={`shrink-0 mt-0.5 transition-all duration-200 ${saved ? "bg-[#2C7A7B] text-white hover:bg-[#285E61]" : "opacity-0 group-hover/card:opacity-100 hover:bg-gray-100"}`}
                  />
                }
              >
                {saved ? "Saved" : "Save"}
              </TooltipTrigger>
              <TooltipContent>
                {saved ? "Remove from bookmarks" : "Save to bookmarks"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
          Welcome to your knowledge hub!
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
            onClick={() => setPage({ t: "cat", id: "training" })}
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
            onClick={() => setPage({ t: "cat", id: "training" })}
          >
            <CardHeader className="relative z-10 p-6">
              <CardTitle className="text-xl font-semibold text-black">Training</CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">Modules, workshops, and onboarding resources</CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer bg-[#E6F4F4] border border-neutral-200 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:border-neutral-300 relative overflow-hidden min-h-[160px]"
            onClick={() => setPage({ t: "cat", id: "reporting" })}
          >
            <CardHeader className="relative z-10 p-6">
              <CardTitle className="text-xl font-semibold text-black">Reporting</CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">Templates, deadlines, and submission guides</CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer bg-[#F5E6D6] border border-neutral-200 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md hover:border-neutral-300 relative overflow-hidden min-h-[160px]"
            onClick={() => setPage({ t: "cat", id: "intake" })}
          >
            <CardHeader className="relative z-10 p-6">
              <CardTitle className="text-xl font-semibold text-black">Intake &amp; Invite</CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">Referrals, first contact, and participant onboarding</CardDescription>
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
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
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
      <Button
        variant="outline"
        onClick={goHome}
        className="text-[#2C7A7B] border-[#2C7A7B] hover:bg-[#E6F4F4] transition-colors duration-200"
      >
        Back to Home
      </Button>
    </div>
  );
}

// ─── CategoryPage ─────────────────────────────────────────────────────────────

function CategoryPage({
  id,
  bookmarks,
  toggleBookmark,
  goHome,
}: {
  id: CategoryId;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  goHome: () => void;
}) {
  const [filter, setFilter] = useState("All");
  const cat = CATEGORIES.find((c) => c.id === id);
  const resources = RESOURCES.filter((r) => r.category === id);
  const subcategories = [...new Set(resources.map((r) => r.subcategory))];
  const types = [...new Set(resources.map((r) => r.type))];
  const filtered = filter === "All" ? resources : resources.filter((r) => r.type === filter);

  // If this is the Community Resources page, show workshops first
  const isCommunity = id === "community";

  return (
    <div className="animate-fade-up">
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">{cat?.label}</h1>
        <p className="text-sm text-[#A8998E] mt-1">{resources.length} resources</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {["All", ...types].map((t) => (
          <Button
            key={t}
            variant={filter === t ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(t)}
            className={`transition-all duration-200 ${filter === t ? "bg-[#2C7A7B] text-white hover:bg-[#285E61] shadow-sm" : "text-[#6B5B4E] border-gray-200 hover:border-[#2C7A7B] hover:text-[#2C7A7B]"}`}
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Workshops & Events subsection for Community Resources */}
      {isCommunity && (
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#A8998E] mb-3">
            Workshops &amp; Events
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WORKSHOPS.map((w, i) => (
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

      {subcategories.map((sub, idx) => {
        const items = filtered.filter((r) => r.subcategory === sub);
        if (!items.length) return null;
        return (
          <div key={sub} className="mb-8" style={{ animationDelay: `${idx * 0.05}s` }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#A8998E] mb-3">
              {sub}
            </p>
            <Card className="border-gray-200/80 shadow-sm">
              <CardContent className="p-0 px-5">
                {items.map((r) => (
                  <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
                ))}
              </CardContent>
            </Card>
          </div>
        );
      })}
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
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
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
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
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
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
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
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
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
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
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
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
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

// ─── ForumPage ────────────────────────────────────────────────────────────────

function ForumPage({ goHome }: { goHome: () => void }) {
  return (
    <div className="animate-fade-up">
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">Community Discussion</h1>
      <p className="text-sm text-[#A8998E] mt-1">Connect with other link workers and SALCs</p>
      <div className="mt-8 space-y-2.5">
        {FORUM_POSTS.map((post, i) => (
          <Card key={i} className="border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start gap-3 mb-2">
                <p className="text-sm font-medium text-[#2C1810] group-hover:text-[#2C7A7B] transition-colors duration-200">{post.title}</p>
                <Badge variant="secondary" className="shrink-0 bg-[#E6F4F4] text-[#2C7A7B] border-transparent">{post.topic}</Badge>
              </div>
              <p className="text-xs text-[#A8998E]">
                <span className="font-medium text-[#6B5B4E]">{post.author}</span> · {post.centre} · {post.time} · {post.replies} replies
              </p>
            </CardContent>
          </Card>
        ))}
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

  const communityResources = RESOURCES.filter((r) => r.category === "community");

  const filtered = filter === "impact"
    ? communityResources.filter((r) => r.subcategory === "Impact Stories")
    : filter === "workshops"
    ? communityResources.filter((r) => r.type === "Video" || r.subcategory?.toLowerCase().includes("workshop"))
    : communityResources;

  // Also show relevant workshops for cafe filter
  const workshopItems = filter === "cafe" ? WORKSHOPS : [];

  return (
    <div className="animate-fade-up">
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-6 text-[#2C7A7B] hover:text-[#285E61] -ml-2">
        &larr; Back
      </Button>
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

const SIDEBAR_TOPICS = CATEGORIES.filter((c) => c.id !== "community");

function SidebarNav({
  active,
  setPage,
  topicsOpen,
  setTopicsOpen,
  bookmarkCount,
  onNavigate,
}: {
  active: string;
  setPage: (p: PageState) => void;
  topicsOpen: boolean;
  setTopicsOpen: (v: boolean) => void;
  bookmarkCount: number;
  onNavigate?: () => void;
}) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const isActive = (key: string) => active === key;
  const activeClass = "bg-[#E6F4F4] text-[#2C7A7B] hover:bg-[#E6F4F4] hover:text-[#2C7A7B]";

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

  // Primary 20px menu item (non-collapsible)
  const primaryNav = (key: string, page: PageState, label: string) => (
    <button
      className={`w-full text-left px-3 py-2 text-[20px] font-medium rounded-md transition-colors ${isActive(key) ? activeClass : "text-[#2C1810] hover:bg-gray-100"}`}
      onClick={() => { setPage(page); onNavigate?.(); }}
    >
      {label}
    </button>
  );

  // Primary 20px collapsible menu item
  const primaryCollapsible = (label: string, open: boolean, toggle: () => void) => (
    <button
      className="w-full flex items-center justify-between px-3 py-2 text-[20px] font-medium text-[#2C1810] rounded-md transition-colors hover:bg-gray-100"
      onClick={toggle}
    >
      <span>{label}</span>
      <Chevron open={open} />
    </button>
  );

  // Sub-menu 16px item
  const subNav = (key: string, page: PageState, label: string) => (
    <button
      className={`w-full text-left pl-6 pr-3 py-1.5 text-[16px] font-normal rounded-md transition-colors ${isActive(key) ? activeClass : "text-[#6B5B4E] hover:bg-gray-100"}`}
      onClick={() => { setPage(page); onNavigate?.(); }}
    >
      {label}
    </button>
  );

  return (
    <ScrollArea className="flex-1">
      <nav className="p-3 space-y-0.5">
        {/* Home */}
        {primaryNav("home", { t: "home" }, "Home")}

        {/* All Topics */}
        {primaryCollapsible("All Topics", topicsOpen, () => setTopicsOpen(!topicsOpen))}
        {topicsOpen && (
          <div className="space-y-0.5">
            {SIDEBAR_TOPICS.map((cat) => (
              <button
                key={cat.id}
                className={`w-full text-left pl-6 pr-3 py-1.5 text-[16px] font-normal rounded-md transition-colors ${isActive(cat.id) ? activeClass : "text-[#6B5B4E] hover:bg-gray-100"}`}
                onClick={() => { setPage({ t: "cat", id: cat.id }); onNavigate?.(); }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Community */}
        {primaryCollapsible("Community", communityOpen, () => setCommunityOpen(!communityOpen))}
        {communityOpen && (
          <div className="space-y-0.5">
            {subNav("community-cafe", { t: "community-cafe" }, "Community Cafe")}
            {subNav("forum", { t: "forum" }, "Discussion Forum")}
            {subNav("community-workshops", { t: "community-workshops" }, "Workshop Highlights")}
            {subNav("community-impact", { t: "community-impact" }, "Impact Stories")}
          </div>
        )}

        {/* Tools */}
        {primaryCollapsible("Tools", toolsOpen, () => setToolsOpen(!toolsOpen))}
        {toolsOpen && (
          <div className="space-y-0.5">
            {subNav("workflows", { t: "workflows" }, "Workflows")}
            {subNav("templates", { t: "templates" }, "Templates")}
            {subNav("reporting", { t: "cat", id: "reporting" }, "Reporting")}
          </div>
        )}

        {/* Help */}
        {primaryCollapsible("Help", helpOpen, () => setHelpOpen(!helpOpen))}
        {helpOpen && (
          <div className="space-y-0.5">
            {subNav("faq", { t: "faq" }, "FAQ")}
            {subNav("recent", { t: "recent" }, "Recently Updated")}
            <button
              className={`w-full flex items-center justify-between pl-6 pr-3 py-1.5 text-[16px] font-normal rounded-md transition-colors ${isActive("bookmarks") ? activeClass : "text-[#6B5B4E] hover:bg-gray-100"}`}
              onClick={() => { setPage({ t: "bookmarks" }); onNavigate?.(); }}
            >
              <span>Bookmarks</span>
              {bookmarkCount > 0 && (
                <Badge variant="default" className="bg-[#2C7A7B] text-white">{bookmarkCount}</Badge>
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
  setPage,
  topicsOpen,
  setTopicsOpen,
  bookmarkCount,
}: {
  active: string;
  setPage: (p: PageState) => void;
  topicsOpen: boolean;
  setTopicsOpen: (v: boolean) => void;
  bookmarkCount: number;
}) {
  return (
    <Card className="w-60 shrink-0 border-r border-gray-200/80 rounded-none ring-0 flex flex-col h-screen sticky top-0 bg-[#FAFAF8]">
      <CardHeader className="px-5 py-5 border-b border-gray-200/60">
        <CardTitle className="text-[15px] font-medium tracking-tight text-[#2C1810]">L2W Knowledge Hub</CardTitle>
        <CardDescription className="text-xs text-[#A8998E] mt-0.5">Internal wiki for SALC staff</CardDescription>
      </CardHeader>
      <SidebarNav
        active={active}
        setPage={setPage}
        topicsOpen={topicsOpen}
        setTopicsOpen={setTopicsOpen}
        bookmarkCount={bookmarkCount}
      />
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
    page.t === "search" ? "search" :
    page.t;

  const renderPage = () => {
    switch (page.t) {
      case "home":
        return <HomePage bookmarks={bookmarks} toggleBookmark={toggleBookmark} setPage={setPage} />;
      case "cat":
        return <CategoryPage id={page.id} bookmarks={bookmarks} toggleBookmark={toggleBookmark} goHome={goHome} />;
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
        return <ForumPage goHome={goHome} />;
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
          setPage={setPage}
          topicsOpen={topicsOpen}
          setTopicsOpen={setTopicsOpen}
          bookmarkCount={bookmarks.length}
        />
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="px-5 py-5 border-b border-gray-200">
            <SheetTitle>L2W Knowledge Hub</SheetTitle>
          </SheetHeader>
          <SidebarNav
            active={active}
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
