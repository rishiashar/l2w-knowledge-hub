"use client";

import { useState, KeyboardEvent } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  | { t: "forum" };

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
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-sm font-medium text-gray-900">{r.title}</span>
          <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
            {r.type}
          </span>
          {r.popular && (
            <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
              Popular
            </span>
          )}
        </div>
        <p className="text-[13px] text-gray-500 leading-snug">{r.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          {r.date} · {CATEGORIES.find((c) => c.id === r.category)?.label}
        </p>
      </div>
      <button
        onClick={() => toggleBookmark(r.id)}
        className={`text-xs shrink-0 mt-0.5 font-medium transition-colors ${
          saved ? "text-gray-900" : "text-gray-400 hover:text-gray-700"
        }`}
      >
        {saved ? "Saved" : "Save"}
      </button>
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
  const popular = RESOURCES.filter((r) => r.popular);
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome to the L2W Knowledge Hub
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse resources by task, topic, or workflow
        </p>
      </div>
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
          Browse by topic
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const items = RESOURCES.filter((r) => r.category === cat.id).slice(0, 4);
            return (
              <Card
                key={cat.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors border-gray-200"
                onClick={() => setPage({ t: "cat", id: cat.id })}
              >
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{cat.label}</p>
                  <ul className="space-y-1">
                    {items.map((r) => (
                      <li key={r.id} className="text-[12px] text-gray-500 leading-snug">
                        {r.title}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
          Popular resources
        </h2>
        <div className="border border-gray-200 rounded-lg px-4">
          {popular.map((r) => (
            <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
          ))}
        </div>
      </section>
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
  return (
    <div>
      <button onClick={goHome} className="text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">{cat?.label}</h1>
      <p className="text-sm text-gray-500 mt-1">{resources.length} resources</p>
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {["All", ...types].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors font-medium ${
              filter === t
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {subcategories.map((sub) => {
        const items = filtered.filter((r) => r.subcategory === sub);
        if (!items.length) return null;
        return (
          <div key={sub} className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {sub}
            </p>
            <div className="border border-gray-200 rounded-lg px-4">
              {items.map((r) => (
                <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
              ))}
            </div>
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
      <button onClick={goHome} className="text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Search: &ldquo;{q}&rdquo;
      </h1>
      <p className="text-sm text-gray-500 mt-1">{results.length} results</p>
      <div className="mt-5">
        {results.length ? (
          <div className="border border-gray-200 rounded-lg px-4">
            {results.map((r) => (
              <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-gray-500">No results found</p>
            <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
          </div>
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
      <button onClick={goHome} className="text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Saved Resources</h1>
      <p className="text-sm text-gray-500 mt-1">{saved.length} bookmarked</p>
      <div className="mt-5">
        {saved.length ? (
          <div className="border border-gray-200 rounded-lg px-4">
            {saved.map((r) => (
              <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-gray-500">No bookmarks yet</p>
            <p className="text-xs text-gray-400 mt-1">Click Save on any resource to save it here</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FaqPage ──────────────────────────────────────────────────────────────────

function FaqPage({ goHome }: { goHome: () => void }) {
  return (
    <div>
      <button onClick={goHome} className="text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">FAQ</h1>
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
      <button onClick={goHome} className="text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Templates</h1>
      <p className="text-sm text-gray-500 mt-1">{templates.length} templates</p>
      <div className="mt-5 border border-gray-200 rounded-lg px-4">
        {templates.map((r) => (
          <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
        ))}
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
      <button onClick={goHome} className="text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Workflows</h1>
      <p className="text-sm text-gray-500 mt-1">{guides.length} guides</p>
      <div className="mt-5 border border-gray-200 rounded-lg px-4">
        {guides.map((r) => (
          <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
        ))}
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
      <button onClick={goHome} className="text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Recently Updated</h1>
      <p className="text-sm text-gray-500 mt-1">Latest 15 resources by date</p>
      <div className="mt-5 border border-gray-200 rounded-lg px-4">
        {recent.map((r) => (
          <ResourceCard key={r.id} r={r} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
        ))}
      </div>
    </div>
  );
}

// ─── ForumPage ────────────────────────────────────────────────────────────────

function ForumPage({ goHome }: { goHome: () => void }) {
  return (
    <div>
      <button onClick={goHome} className="text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors">
        &larr; Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Community Discussion</h1>
      <p className="text-sm text-gray-500 mt-1">Connect with other link workers and SALCs</p>
      <div className="mt-5 space-y-2">
        {FORUM_POSTS.map((post, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex justify-between items-start gap-3 mb-2">
              <p className="text-sm font-medium text-gray-900">{post.title}</p>
              <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium shrink-0">
                {post.topic}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">{post.author}</span> · {post.centre} · {post.time} · {post.replies} replies
            </p>
          </div>
        ))}
      </div>
    </div>
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
  const isActive = (key: string) => active === key;
  const navCls = (key: string) =>
    `w-full text-left text-sm px-3 py-1.5 rounded transition-colors ${
      isActive(key)
        ? "bg-gray-100 text-gray-900 font-medium"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-gray-200">
        <p className="text-[15px] font-bold tracking-tight text-gray-900">L2W Knowledge Hub</p>
        <p className="text-xs text-gray-400 mt-0.5">Internal wiki for SALC staff</p>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-0.5">
          <button className={navCls("home")} onClick={() => setPage({ t: "home" })}>Home</button>

          <button
            className="w-full text-left text-sm px-3 py-1.5 rounded transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-between"
            onClick={() => setTopicsOpen(!topicsOpen)}
          >
            <span>All Topics</span>
            <span className="text-gray-400 text-xs">{topicsOpen ? "▲" : "▼"}</span>
          </button>

          {topicsOpen && (
            <div className="ml-3 space-y-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`w-full text-left text-[13px] px-3 py-1.5 rounded transition-colors ${
                    isActive(cat.id)
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                  onClick={() => setPage({ t: "cat", id: cat.id })}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          <div className="pt-3 pb-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Tools</p>
          </div>
          <button className={navCls("workflows")} onClick={() => setPage({ t: "workflows" })}>Workflows</button>
          <button className={navCls("templates")} onClick={() => setPage({ t: "templates" })}>Templates</button>
          <button className={navCls("reporting")} onClick={() => setPage({ t: "cat", id: "reporting" })}>Reporting</button>
          <button className={navCls("forum")} onClick={() => setPage({ t: "forum" })}>Community</button>

          <div className="pt-3 pb-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Help</p>
          </div>
          <button className={navCls("faq")} onClick={() => setPage({ t: "faq" })}>FAQ</button>
          <button className={navCls("recent")} onClick={() => setPage({ t: "recent" })}>Recently Updated</button>
          <button
            className={`${navCls("bookmarks")} flex items-center justify-between`}
            onClick={() => setPage({ t: "bookmarks" })}
          >
            <span>Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className="text-[10px] bg-gray-900 text-white rounded-full px-1.5 py-0.5 font-semibold leading-none">
                {bookmarkCount}
              </span>
            )}
          </button>
        </nav>
      </ScrollArea>
    </div>
  );
}

// ─── RightPanel ───────────────────────────────────────────────────────────────

function RightPanel({ bookmarks }: { bookmarks: number[] }) {
  const saved = RESOURCES.filter((r) => bookmarks.includes(r.id)).slice(0, 4);
  return (
    <div className="w-64 shrink-0 border-l border-gray-200 bg-white h-screen sticky top-0">
      <ScrollArea className="h-full">
        <div className="p-5 space-y-6">
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Recently Viewed</p>
            <ul className="space-y-2">
              {RECENT_IDS.map((id) => {
                const r = RESOURCES.find((x) => x.id === id);
                return r ? (
                  <li key={id} className="text-[13px] text-gray-600 leading-snug">{r.title}</li>
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
                    <li key={r.id} className="text-[13px] text-gray-600 leading-snug">{r.title}</li>
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
                  <span className={`text-xs font-bold min-w-[44px] leading-snug ${d.urgent ? "text-gray-900" : "text-gray-600"}`}>
                    {d.date}
                  </span>
                  <span className="text-[13px] text-gray-500 leading-snug">{d.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Workshop Highlights</p>
            <ul className="space-y-3">
              {WORKSHOPS.map((w, i) => (
                <li key={i}>
                  <p className="text-[13px] font-medium text-gray-700 leading-snug">{w.title}</p>
                  <p className="text-xs text-gray-400">{w.date}</p>
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
                  <span className="text-[13px] text-gray-900 cursor-pointer hover:underline underline-offset-2">{l}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [page, setPage] = useState<PageState>({ t: "home" });
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [topicsOpen, setTopicsOpen] = useState(false);

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
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar
        active={active}
        setPage={setPage}
        topicsOpen={topicsOpen}
        setTopicsOpen={setTopicsOpen}
        bookmarkCount={bookmarks.length}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="flex-1 max-w-xl">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search resources, templates, guidance..."
              className="bg-gray-50 border-gray-200 text-sm"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            YM
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="flex">
            <div className="flex-1 p-8 max-w-4xl">
              {renderPage()}
            </div>
            <RightPanel bookmarks={bookmarks} />
          </div>
        </main>
      </div>
    </div>
  );
}
