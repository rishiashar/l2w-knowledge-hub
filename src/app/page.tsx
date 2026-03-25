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
  | { t: "ai-scenarios" };

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
  if (hour < 12) return "Good morning, Link Worker.";
  if (hour < 17) return "Good afternoon, Link Worker.";
  return "Good evening, Link Worker.";
}

// ─── ResourceCard ─────────────────────────────────────────────────────────────

function ResourceCard({
  r,
  bookmarks,
  toggleBookmark,
}: {
  r: Resource;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
}) {
  const saved = bookmarks.includes(r.id);
  return (
    <Card size="sm" className="border-0 ring-0 shadow-none rounded-none py-3 border-b border-gray-100 last:border-0">
      <CardContent className="p-0 px-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-sm font-medium text-gray-900">{r.title}</span>
              <Badge variant="secondary" className={typeBadgeClass(r.type)}>{r.type}</Badge>
              {r.popular && <Badge variant="secondary" className="bg-[#E6F4F4] text-[#2C7A7B] border-transparent">Popular</Badge>}
            </div>
            <p className="text-[13px] text-gray-500 leading-snug">{r.description}</p>
            <p className="text-xs text-gray-400 mt-1">
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
                    className={`shrink-0 mt-0.5 ${saved ? "bg-[#2C7A7B] text-white hover:bg-[#285E61]" : ""}`}
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
  const [greeting, setGreeting] = useState("Good morning, Link Worker.");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const popular = RESOURCES.filter((r) => r.popular);
  const whatsNew = [...RESOURCES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div>
      {/* Personalized Greeting */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-[1.1]">
          {greeting}
        </h1>
        <p className="text-base text-gray-500 mt-3 max-w-lg">
          Your central hub for social prescribing workflows, community resources, and reporting protocols.
        </p>
      </div>

      {/* Bento Grid */}
      <section className="mb-10">
        {/* Row 1: Hero row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <Card
            className="md:col-span-3 cursor-pointer bg-[#E6F4F4] border-0 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md relative overflow-hidden min-h-[220px]"
            onClick={() => setPage({ t: "cat", id: "training" })}
          >
            <svg className="absolute left-6 bottom-6 opacity-20" width="100" height="100" viewBox="0 0 100 100" fill="none">
              <path d="M50 85 L50 25 M50 25 C50 25 25 20 10 30 L10 80 C25 72 50 85 50 85 M50 25 C50 25 75 20 90 30 L90 80 C75 72 50 85 50 85" stroke="#2F7D5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <CardHeader className="relative z-10 pl-28 pt-8 pb-8 pr-8">
              <CardTitle className="text-xl md:text-2xl font-bold text-black">
                New here? Learn how to use this hub
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm mt-1">
                A guided walkthrough for new link workers joining the Links2Wellbeing program.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="md:col-span-2 cursor-pointer bg-white border-0 ring-1 ring-gray-200 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md relative overflow-hidden min-h-[220px]"
            onClick={() => setPage({ t: "ai-scenarios" })}
          >
            <svg className="absolute right-6 top-6 opacity-20" width="100" height="100" viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L25 35 L50 90 L75 35 Z" stroke="#C96A2B" strokeWidth="2" strokeLinejoin="round" />
              <path d="M25 35 L75 35" stroke="#C96A2B" strokeWidth="2" />
              <path d="M37 35 L50 10 L63 35" stroke="#C96A2B" strokeWidth="1.5" />
              <path d="M37 35 L50 90" stroke="#C96A2B" strokeWidth="1" strokeDasharray="4 3" />
              <path d="M63 35 L50 90" stroke="#C96A2B" strokeWidth="1" strokeDasharray="4 3" />
            </svg>
            <CardHeader className="relative z-10 pt-auto mt-auto p-8 flex flex-col justify-end h-full">
              <div className="flex items-end justify-between">
                <CardTitle className="text-lg md:text-xl font-bold text-black">
                  Practice with<br />AI Scenarios
                </CardTitle>
                <span className="text-4xl font-bold text-black/80 tabular-nums">12</span>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Row 2: Three featured topics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            className="cursor-pointer bg-[#F2D5D5] border-0 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md relative overflow-hidden min-h-[160px]"
            onClick={() => setPage({ t: "cat", id: "training" })}
          >
            <svg className="absolute right-5 top-5 opacity-20" width="90" height="90" viewBox="0 0 90 90" fill="none">
              <path d="M15 55 L45 40 L75 55 L45 70 Z" stroke="#B23A3A" strokeWidth="2" strokeLinejoin="round" />
              <path d="M25 58 L25 75 L45 85 L65 75 L65 58" stroke="#B23A3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="75" y1="55" x2="75" y2="80" stroke="#B23A3A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <CardHeader className="relative z-10 pt-16 px-6 pb-6">
              <CardTitle className="text-base font-bold text-black">Training</CardTitle>
              <CardDescription className="text-gray-600">Modules, workshops, and onboarding resources</CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer bg-[#E6F4F4] border-0 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md relative overflow-hidden min-h-[160px]"
            onClick={() => setPage({ t: "cat", id: "reporting" })}
          >
            <svg className="absolute right-5 top-5 opacity-20" width="90" height="90" viewBox="0 0 90 90" fill="none">
              <rect x="15" y="50" width="12" height="30" rx="2" stroke="#2F7D5B" strokeWidth="2" />
              <rect x="35" y="35" width="12" height="45" rx="2" stroke="#2F7D5B" strokeWidth="2" />
              <rect x="55" y="20" width="12" height="60" rx="2" stroke="#2F7D5B" strokeWidth="2" />
              <path d="M10 82 L80 82" stroke="#2F7D5B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <CardHeader className="relative z-10 pt-16 px-6 pb-6">
              <CardTitle className="text-base font-bold text-black">Reporting</CardTitle>
              <CardDescription className="text-gray-600">Templates, deadlines, and submission guides</CardDescription>
            </CardHeader>
          </Card>
          <Card
            className="cursor-pointer bg-[#F5E6D6] border-0 ring-0 rounded-3xl transition-all duration-200 hover:scale-[1.01] hover:shadow-md relative overflow-hidden min-h-[160px]"
            onClick={() => setPage({ t: "cat", id: "intake" })}
          >
            <svg className="absolute right-5 top-5 opacity-20" width="90" height="90" viewBox="0 0 90 90" fill="none">
              <rect x="20" y="15" width="50" height="65" rx="4" stroke="#C96A2B" strokeWidth="2" />
              <path d="M35 15 L35 10 C35 7 38 5 45 5 C52 5 55 7 55 10 L55 15" stroke="#C96A2B" strokeWidth="2" />
              <line x1="30" y1="35" x2="60" y2="35" stroke="#C96A2B" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="30" y1="47" x2="55" y2="47" stroke="#C96A2B" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="30" y1="59" x2="50" y2="59" stroke="#C96A2B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <CardHeader className="relative z-10 pt-16 px-6 pb-6">
              <CardTitle className="text-base font-bold text-black">Intake &amp; Invite</CardTitle>
              <CardDescription className="text-gray-600">Referrals, first contact, and participant onboarding</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Recommended For You */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
          Recommended for you
        </h2>
        <Card className="border-gray-200">
          <CardContent className="p-0 px-4">
            {popular.map((r) => (
              <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            ))}
          </CardContent>
        </Card>
      </section>

      {/* What's New */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
          What&apos;s new
        </h2>
        <Card className="border-gray-200">
          <CardContent className="p-0 px-4">
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
    <div className="max-w-lg">
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
        Practice with AI Scenarios
      </h1>
      <p className="text-sm text-gray-500 mt-2 mb-6">
        Rehearse real-world social prescribing situations with AI-generated practice scenarios.
      </p>
      <Card className="border-gray-200 mb-6">
        <CardContent>
          <p className="text-sm text-gray-600 leading-relaxed">
            This feature is coming soon. You&apos;ll be able to practice intake calls, handle hesitant participants, navigate reporting questions, and more.
          </p>
        </CardContent>
      </Card>
      <Button
        variant="outline"
        onClick={goHome}
        className="text-[#2C7A7B] border-[#2C7A7B] hover:bg-[#E6F4F4]"
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
    <div>
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">{cat?.label}</h1>
      <p className="text-sm text-gray-500 mt-1">{resources.length} resources</p>
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {["All", ...types].map((t) => (
          <Button
            key={t}
            variant={filter === t ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(t)}
            className={filter === t ? "bg-[#2C7A7B] text-white hover:bg-[#285E61]" : ""}
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Workshops & Events subsection for Community Resources */}
      {isCommunity && (
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Workshops &amp; Events
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WORKSHOPS.map((w, i) => (
              <Card key={i} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm">{w.title}</CardTitle>
                  <CardDescription>{w.date}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {subcategories.map((sub) => {
        const items = filtered.filter((r) => r.subcategory === sub);
        if (!items.length) return null;
        return (
          <div key={sub} className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {sub}
            </p>
            <Card className="border-gray-200">
              <CardContent className="p-0 px-4">
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
    <div>
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
        Search: &ldquo;{q}&rdquo;
      </h1>
      <p className="text-sm text-gray-500 mt-1">{results.length} results</p>
      <div className="mt-5">
        {results.length ? (
          <Card className="border-gray-200">
            <CardContent className="p-0 px-4">
              {results.map((r) => (
                <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200">
            <CardContent className="text-center py-16">
              <p className="text-sm font-medium text-gray-500">No results found</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
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
    <div>
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Saved Resources</h1>
      <p className="text-sm text-gray-500 mt-1">{saved.length} bookmarked</p>
      <div className="mt-5">
        {saved.length ? (
          <Card className="border-gray-200">
            <CardContent className="p-0 px-4">
              {saved.map((r) => (
                <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-200">
            <CardContent className="text-center py-16">
              <p className="text-sm font-medium text-gray-500">No bookmarks yet</p>
              <p className="text-xs text-gray-400 mt-1">Click Save on any resource to save it here</p>
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
    <div>
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">FAQ</h1>
      <p className="text-sm text-gray-500 mt-1">Frequently asked questions about L2W</p>
      <div className="mt-6">
        <Accordion className="space-y-2">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-gray-200 rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium text-gray-900 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed">
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
    <div>
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Templates</h1>
      <p className="text-sm text-gray-500 mt-1">{templates.length} templates</p>
      <div className="mt-5">
        <Card className="border-gray-200">
          <CardContent className="p-0 px-4">
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
    <div>
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Workflows</h1>
      <p className="text-sm text-gray-500 mt-1">{guides.length} guides</p>
      <div className="mt-5">
        <Card className="border-gray-200">
          <CardContent className="p-0 px-4">
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
    <div>
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Recently Updated</h1>
      <p className="text-sm text-gray-500 mt-1">Latest 15 resources by date</p>
      <div className="mt-5">
        <Card className="border-gray-200">
          <CardContent className="p-0 px-4">
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
    <div>
      <Button variant="ghost" size="sm" onClick={goHome} className="mb-5 text-[#2C7A7B] hover:text-[#285E61]">
        &larr; Back
      </Button>
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Community Discussion</h1>
      <p className="text-sm text-gray-500 mt-1">Connect with other link workers and SALCs</p>
      <div className="mt-5 space-y-2">
        {FORUM_POSTS.map((post, i) => (
          <Card key={i} className="border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-3 mb-2">
                <p className="text-sm font-medium text-gray-900">{post.title}</p>
                <Badge variant="secondary" className="shrink-0 bg-[#E6F4F4] text-[#2C7A7B] border-transparent">{post.topic}</Badge>
              </div>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">{post.author}</span> · {post.centre} · {post.time} · {post.replies} replies
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar Nav Content ─────────────────────────────────────────────────────

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
  const isActive = (key: string) => active === key;

  const activeClass = "bg-[#E6F4F4] text-[#2C7A7B] hover:bg-[#E6F4F4] hover:text-[#2C7A7B]";

  const nav = (key: string, page: PageState, label: React.ReactNode) => (
    <Button
      variant={isActive(key) ? "ghost" : "ghost"}
      size="sm"
      className={`w-full justify-start ${isActive(key) ? activeClass : ""}`}
      onClick={() => {
        setPage(page);
        onNavigate?.();
      }}
    >
      {label}
    </Button>
  );

  return (
    <ScrollArea className="flex-1">
      <nav className="p-3 space-y-0.5">
        {nav("home", { t: "home" }, "Home")}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between"
          onClick={() => setTopicsOpen(!topicsOpen)}
        >
          <span>All Topics</span>
          <span className="text-gray-400 text-xs">{topicsOpen ? "\u25B2" : "\u25BC"}</span>
        </Button>

        {topicsOpen && (
          <div className="ml-3 space-y-0.5">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                size="xs"
                className={`w-full justify-start text-[13px] ${isActive(cat.id) ? activeClass : ""}`}
                onClick={() => {
                  setPage({ t: "cat", id: cat.id });
                  onNavigate?.();
                }}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        )}

        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Tools</p>
        </div>
        {nav("workflows", { t: "workflows" }, "Workflows")}
        {nav("templates", { t: "templates" }, "Templates")}
        {nav("reporting", { t: "cat", id: "reporting" }, "Reporting")}

        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Help</p>
        </div>
        {nav("faq", { t: "faq" }, "FAQ")}
        {nav("recent", { t: "recent" }, "Recently Updated")}
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-between ${isActive("bookmarks") ? activeClass : ""}`}
          onClick={() => {
            setPage({ t: "bookmarks" });
            onNavigate?.();
          }}
        >
          <span>Bookmarks</span>
          {bookmarkCount > 0 && (
            <Badge variant="default" className="bg-[#2C7A7B] text-white">{bookmarkCount}</Badge>
          )}
        </Button>
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
    <Card className="w-60 shrink-0 border-r border-gray-200 rounded-none ring-0 flex flex-col h-screen sticky top-0">
      <CardHeader className="px-5 py-5 border-b border-gray-200">
        <CardTitle className="text-[15px] font-bold tracking-tight text-gray-900">L2W Knowledge Hub</CardTitle>
        <CardDescription className="text-xs text-gray-400 mt-0.5">Internal wiki for SALC staff</CardDescription>
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
    <div className="p-5 space-y-6">
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Recently Viewed</p>
        <ul className="space-y-2">
          {RECENT_IDS.map((id) => {
            const r = RESOURCES.find((x) => x.id === id);
            return r ? (
              <li key={id} className="text-[13px] text-[#2C7A7B] leading-snug cursor-pointer hover:underline">{r.title}</li>
            ) : null;
          })}
        </ul>
      </section>

      {saved.length > 0 && (
        <>
          <Separator />
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Saved Resources</p>
            <ul className="space-y-2">
              {saved.map((r) => (
                <li key={r.id} className="text-[13px] text-[#2C7A7B] leading-snug cursor-pointer hover:underline">{r.title}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Separator />

      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Upcoming Deadlines</p>
        <ul className="space-y-2">
          {DEADLINES.map((d, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <span className={`text-xs font-bold min-w-[44px] leading-snug ${d.urgent ? "text-[#C05656]" : "text-gray-600"}`}>
                {d.date}
              </span>
              <span className="text-[13px] text-gray-500 leading-snug">{d.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Quick Links</p>
        <ul className="space-y-1.5">
          {["Contact support", "Submit feedback", "Request a resource", "L2W Google Drive"].map((l) => (
            <li key={l}>
              <span className="text-[13px] text-[#2C7A7B] cursor-pointer hover:underline underline-offset-2">{l}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RightPanel({ bookmarks }: { bookmarks: number[] }) {
  return (
    <Card className="w-64 shrink-0 border-l border-gray-200 rounded-none ring-0 h-screen sticky top-0">
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
  const [topicsOpen, setTopicsOpen] = useState(false);
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
        <Card className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-gray-200 rounded-none ring-0 shrink-0 flex-row">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </Button>
          <div className="flex-1 max-w-xl">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search resources, templates, guidance..."
              className="bg-gray-50 border-gray-200 text-sm focus-visible:border-[#2C7A7B] focus-visible:ring-[#2C7A7B]/30"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setRightPanelOpen(true)}
          >
            More
          </Button>
          <div className="w-8 h-8 rounded-full bg-[#2C7A7B] text-white flex items-center justify-center text-xs font-semibold shrink-0">
            YM
          </div>
        </Card>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="flex">
            <div className="flex-1 p-4 md:p-8 max-w-4xl">
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
