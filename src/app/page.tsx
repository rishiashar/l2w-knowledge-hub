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
  type CategoryId,
  type Resource,
  type ForumPost,
  type ForumComment,
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
  const subcategories = [...new Set(resources.map((r) => r.subcategory))];

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">{cat?.label}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subcategories.map((sub) => {
          const items = resources.filter((r) => r.subcategory === sub);
          return (
            <Card key={sub} className="border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-[#2C1810]">{sub}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="space-y-0.5">
                  {items.map((r) => (
                    <button
                      key={r.id}
                      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors duration-150 hover:bg-[#F5E6D6]/40 group/row"
                      onClick={() => setPage({ t: "content", resourceId: r.id, fromCategory: id })}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0 text-[#A8998E] group-hover/row:text-[#2C7A7B] transition-colors duration-150">
                        <path d="M2.5 1L6 4L2.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-sm text-[#2C1810] group-hover/row:text-[#2C7A7B] transition-colors duration-150 leading-snug">{r.title}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
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
    <div className="animate-fade-up">
      <BackButton onClick={() => setPage({ t: "cat", id: categoryId })} label={`Back to ${cat?.label}`} />
      <div className="mb-8">
        <p className="text-xs font-medium text-[#A8998E] uppercase tracking-widest mb-1">{cat?.label}</p>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">{subcategory}</h1>
      </div>

      {resources.length ? (
        <Card className="border border-gray-200/80 rounded-2xl shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="space-y-0.5">
              {resources.map((r) => (
                <button
                  key={r.id}
                  className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors duration-150 hover:bg-[#F5E6D6]/40 group/row"
                  onClick={() => setPage({ t: "content", resourceId: r.id, fromCategory: categoryId })}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0 text-[#A8998E] group-hover/row:text-[#2C7A7B] transition-colors duration-150">
                    <path d="M2.5 1L6 4L2.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-[#2C1810] group-hover/row:text-[#2C7A7B] transition-colors duration-150 leading-snug">{r.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-200/80 shadow-sm">
          <CardContent className="text-center py-20">
            <p className="text-sm font-medium text-[#6B5B4E]">No resources yet</p>
            <p className="text-xs text-[#A8998E] mt-1">Content is being added</p>
          </CardContent>
        </Card>
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

  return (
    <div className="animate-fade-up max-w-2xl">
      <BackButton onClick={() => setPage({ t: "cat", id: fromCategory })} label={cat?.label} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">{r.title}</h1>
        <BookmarkIcon saved={saved} onClick={() => toggleBookmark(resourceId)} />
      </div>
      <p className="text-sm text-[#78716C] mb-1">{r.description}</p>
      <p className="text-xs text-[#A8998E] mb-6">{r.type}</p>

      <Separator className="bg-gray-200/80 mb-8" />

      {/* Content area */}
      {content ? (
        /* Rich content page */
        <div className="space-y-6">
          {content.intro && (
            <div className="space-y-4">
              {content.intro.split("\n\n").map((p, i) => (
                <p key={i} className="text-[15px] text-[#2C1810] leading-relaxed">{p}</p>
              ))}
            </div>
          )}

          {content.sectionTitle && (
            <h2 className="text-lg font-semibold text-[#2C1810] pt-2">{content.sectionTitle}</h2>
          )}

          {content.sections.map((s, i) => (
            <div key={i}>
              <h3 className="text-base font-semibold text-[#2C1810] mb-2">{s.heading}</h3>
              {s.body && <p className="text-[15px] text-[#2C1810] leading-relaxed">{s.body}</p>}
              {s.bullets && (
                <ul className="mt-2 space-y-1.5 pl-5">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="text-[15px] text-[#2C1810] leading-relaxed list-disc">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {content.closing && (
            <p className="text-[15px] text-[#2C1810] leading-relaxed pt-2 border-t border-gray-200/60 mt-8 pt-6">{content.closing}</p>
          )}

          {content.callout && (
            <Card className="bg-[#F5E6D6]/40 border-[#C96A2B]/20">
              <CardContent className="py-4 px-5">
                <p className="text-sm text-[#6B5B4E] leading-relaxed">{content.callout}</p>
              </CardContent>
            </Card>
          )}

          {r.type === "PDF" && (
            <Button className="bg-[#C96A2B] hover:bg-[#A8561E] text-white mt-2">
              Download {r.title} (PDF)
            </Button>
          )}
        </div>
      ) : r.type === "Video" ? (
        /* Video placeholder */
        <div>
          <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white/80 mx-auto mb-3 flex items-center justify-center shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#2C1810"><polygon points="9,6 19,12 9,18" /></svg>
              </div>
              <p className="text-sm font-medium text-[#6B5B4E]">Video: {r.title}</p>
            </div>
          </div>
          <p className="text-[15px] text-[#2C1810] leading-relaxed">{r.description}</p>
        </div>
      ) : (r.type === "PDF" || r.type === "Template") ? (
        /* PDF / Template download page */
        <div>
          <p className="text-[15px] text-[#2C1810] leading-relaxed mb-6">{r.description}</p>
          <Button className="bg-[#C96A2B] hover:bg-[#A8561E] text-white">
            Download {r.title} ({r.type === "PDF" ? "PDF" : "Template"})
          </Button>
        </div>
      ) : (
        /* Guide without rich content */
        <div>
          <p className="text-[15px] text-[#2C1810] leading-relaxed mb-6">{r.description}</p>
          <Card className="bg-[#E6F4F4]/30 border-[#2C7A7B]/10">
            <CardContent className="py-6 text-center">
              <p className="text-sm text-[#78716C]">Full guide content will be available here.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Related Resources */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200/80">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#A8998E] mb-4">Related Resources</h3>
          <div className="space-y-2">
            {related.map((rel) => (
              <button
                key={rel.id}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 hover:bg-[#E6F4F4]/40 group/rel border border-gray-200/60"
                onClick={() => setPage({ t: "content", resourceId: rel.id, fromCategory })}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0 text-[#A8998E] group-hover/rel:text-[#2C7A7B] transition-colors duration-150">
                  <path d="M2.5 1L6 4L2.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-[#2C1810] group-hover/rel:text-[#2C7A7B] transition-colors duration-150">{rel.title}</span>
                <span className="text-xs text-[#A8998E] ml-auto">{rel.type}</span>
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

import { ChevronUp, ChevronDown, MessageSquare, Flame, Clock, TrendingUp, Pin, Reply, Home as HomeIcon, BookOpen, Users, Wrench, CircleHelp } from "lucide-react";

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

type ForumSort = "hot" | "new" | "top";

function ForumListPage({ goHome, setPage }: { goHome: () => void; setPage: (p: PageState) => void }) {
  const [sort, setSort] = useState<ForumSort>("hot");

  const sortedPosts = [...FORUM_POSTS].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    switch (sort) {
      case "hot": return (b.votes * b.commentCount) - (a.votes * a.commentCount);
      case "new": return 0;
      case "top": return b.votes - a.votes;
      default: return 0;
    }
  });

  return (
    <div className="animate-fade-up">
      <BackButton onClick={goHome} />
      <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-[#2C1810]">Community Discussion</h1>
      <p className="text-sm text-[#A8998E] mt-1 mb-5">Connect with other link workers and SALCs</p>

      {/* Sort tabs */}
      <div className="flex items-center gap-1 mb-5 bg-white rounded-lg border border-gray-200/80 p-1 w-fit shadow-sm">
        {([
          { key: "hot" as ForumSort, label: "Hot", icon: Flame },
          { key: "new" as ForumSort, label: "New", icon: Clock },
          { key: "top" as ForumSort, label: "Top", icon: TrendingUp },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sort === key
                ? "bg-[#E6F4F4] text-[#2C7A7B]"
                : "text-[#A8998E] hover:text-[#6B5B4E] hover:bg-gray-50"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-2.5">
        {sortedPosts.map((post) => (
          <Card
            key={post.id}
            onClick={() => setPage({ t: "forum-post", postId: post.id })}
            className={`border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200 group ${post.pinned ? "ring-1 ring-[#2C7A7B]/10 bg-[#F7FDFD]" : ""}`}
          >
            <CardContent className="p-0">
              <div className="flex">
                {/* Vote column */}
                <div className="flex flex-col items-center justify-center px-2 md:px-3 py-3 bg-gray-50/50 rounded-l-lg border-r border-gray-100">
                  <VoteButtons votes={post.votes} />
                </div>
                {/* Content column */}
                <div className="flex-1 p-3 md:p-4 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                  <p className="text-sm font-semibold text-[#2C1810] mb-1 leading-snug group-hover:text-[#2C7A7B] transition-colors duration-200">{post.title}</p>
                  <p className="text-xs text-[#A8998E]">
                    <span className="font-medium text-[#6B5B4E]">{post.author}</span>
                    <span className="mx-1">&middot;</span>
                    {post.centre}
                    <span className="mx-1">&middot;</span>
                    {post.timestamp}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-[#A8998E]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentCount} comments</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

const SIDEBAR_TOPICS = CATEGORIES.filter((c) => c.id !== "community");

// Precompute subcategories per category for sidebar tree
const SUBCATS_BY_CATEGORY: Record<string, string[]> = {};
SIDEBAR_TOPICS.forEach((cat) => {
  const subs = [...new Set(RESOURCES.filter((r) => r.category === cat.id).map((r) => r.subcategory))];
  if (subs.length) SUBCATS_BY_CATEGORY[cat.id] = subs;
});

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
              const subs = SUBCATS_BY_CATEGORY[cat.id] || [];
              const isExpanded = expandedTopics[cat.id];
              const isCatActive = activeCategory === cat.id;
              const isLastTopic = catIdx === SIDEBAR_TOPICS.length - 1;

              return (
                <div key={cat.id}>
                  {/* Topic row with chevron */}
                  <div className="flex items-center pl-5 pr-3">
                    {/* Tree connector for topic level */}
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
                        if (!isExpanded) toggleTopic(cat.id);
                        onNavigate?.();
                      }}
                    >
                      <span>{cat.label}</span>
                    </button>
                    {subs.length > 0 && (
                      <button
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                        onClick={(e) => { e.stopPropagation(); toggleTopic(cat.id); }}
                      >
                        <Chevron open={isExpanded} />
                      </button>
                    )}
                  </div>

                  {/* Subcategories with tree connectors */}
                  {isExpanded && subs.length > 0 && (
                    <div className="relative">
                      {/* Vertical continuation line from parent */}
                      {!isLastTopic && (
                        <span className="absolute left-[27px] top-0 bottom-0 w-px bg-[#D6D3D1]" />
                      )}
                      {subs.map((sub, subIdx) => {
                        const isLastSub = subIdx === subs.length - 1;
                        const subKey = `subcat:${cat.id}:${sub}`;
                        return (
                          <button
                            key={sub}
                            className={`w-full flex items-center text-left pl-10 pr-3 py-0.5 text-[13px] font-normal rounded-md transition-colors ${
                              isActive(subKey) ? activeClass : "text-[#6B5B4E] hover:bg-gray-100"
                            }`}
                            onClick={() => { setPage({ t: "subcat", categoryId: cat.id, subcategory: sub }); onNavigate?.(); }}
                          >
                            <span className="shrink-0 w-4 flex items-center relative" style={{ minHeight: 22 }}>
                              {!isLastSub && <span className="absolute left-[7px] top-0 bottom-0 w-px bg-[#D6D3D1]" />}
                              {isLastSub && <span className="absolute left-[7px] top-0 h-1/2 w-px bg-[#D6D3D1]" />}
                              <span className="absolute left-[7px] top-1/2 w-[9px] h-px bg-[#D6D3D1]" />
                            </span>
                            <span className="ml-1 flex items-center gap-1.5">
                              <FolderIcon />
                              <span className="leading-snug">{sub}</span>
                            </span>
                          </button>
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
    <Card className="w-72 shrink-0 border-r border-gray-200/80 rounded-none ring-0 flex flex-col h-screen sticky top-0 bg-[#FAFAF8]">
      <CardHeader className="px-5 py-4 border-b border-gray-200/60">
        <div className="flex items-center justify-center">
          <img src="/l2w-logo.svg" alt="Links2Wellbeing" className="h-10 w-auto" />
        </div>
      </CardHeader>
      <SidebarNav
        active={active}
        activeCategory={activeCategory}
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
        <SheetContent side="left" className="w-72 p-0">
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
