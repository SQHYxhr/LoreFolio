"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { EntryType } from "@/types";
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_LABELS, ENTRY_TYPES } from "@/types";
import { useStore } from "@/hooks/use-store";
import { TopBar } from "@/components/TopBar";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GlobalSearchViewProps { projectId: string }

interface ScoredResult {
  entry: (typeof searchScope)[number];
  hitSource: "title" | "tag" | "summary";
  sort: number; // 0=title, 1=tag, 2=summary
}

const SEARCHABLE_TYPES: EntryType[] = ["character","location","faction","item","event","species","lore","note"];

// ── Helpers ────────────────────────────────────────────────

function highlightText(text: string, query: string): (string | { h: string })[] {
  if (!query) return [text];
  const parts: (string | { h: string })[] = [];
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let cursor = 0;
  while (cursor < text.length) {
    const idx = lower.indexOf(q, cursor);
    if (idx === -1) { parts.push(text.slice(cursor)); break; }
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push({ h: text.slice(idx, idx + query.length) });
    cursor = idx + query.length;
  }
  return parts;
}

function HighlightedSpan({ text, query }: { text: string; query: string }) {
  const parts = highlightText(text, query);
  if (parts.length === 1 && typeof parts[0] === "string") return <>{text}</>;
  return <>{parts.map((p, i) => typeof p === "string" ? <Fragment key={i}>{p}</Fragment> : <mark key={i} className="rounded-sm bg-amber-200/60 px-0.5 text-inherit dark:bg-amber-800/40">{p.h}</mark>)}</>;
}

// ── Component ──────────────────────────────────────────────

export function GlobalSearchView({ projectId }: GlobalSearchViewProps) {
  const router = useRouter();
  const { hydrated, data, getProject } = useStore();
  const project = getProject(projectId);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<EntryType | "all">("all");

  const searchScope = useMemo(
    () => data.entries.filter((e) => e.projectId === projectId && (typeFilter === "all" || e.type === typeFilter)),
    [data.entries, projectId, typeFilter]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as ScoredResult[];
    const scored: ScoredResult[] = [];
    for (const e of searchScope) {
      if (e.title.toLowerCase().includes(q)) { scored.push({ entry: e, hitSource: "title", sort: 0 }); continue; }
      if (e.tags.some((t) => t.toLowerCase().includes(q))) { scored.push({ entry: e, hitSource: "tag", sort: 1 }); continue; }
      if (e.summary.toLowerCase().includes(q)) { scored.push({ entry: e, hitSource: "summary", sort: 2 }); continue; }
    }
    scored.sort((a, b) => {
      if (a.sort !== b.sort) return a.sort - b.sort;
      return new Date(b.entry.updatedAt).getTime() - new Date(a.entry.updatedAt).getTime();
    });
    return scored;
  }, [searchScope, query]);

  const hitLabel: Record<ScoredResult["hitSource"], string> = { title: "标题命中", tag: "标签命中", summary: "摘要命中" };
  const hasQuery = query.trim().length > 0;

  if (!hydrated) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">正在加载全局搜索...</div>;
  if (!project) return <div className="flex min-h-screen flex-col items-center justify-center gap-4"><p className="text-muted-foreground">未找到该世界项目</p><button type="button" className="text-sm text-primary underline" onClick={() => router.push("/")}>返回项目列表</button></div>;

  return (
    <div className="flex min-h-dvh flex-col lg:h-screen lg:overflow-hidden">
      <TopBar project={project} backHref={`/project/${projectId}`} backLabel="返回项目" />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-semibold">全局搜索</h1>
            <p className="mt-1 text-sm text-muted-foreground">跨分类搜索当前世界的所有条目</p>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <button onClick={() => setTypeFilter("all")} className={`rounded-full border px-3 py-1 text-xs transition-colors ${typeFilter === "all" ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30"}`}>全部</button>
            {SEARCHABLE_TYPES.map((t) => (
              <button key={t} onClick={() => setTypeFilter(typeFilter === t ? "all" : t)} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${typeFilter === t ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/30"}`}>{ENTRY_TYPE_ICONS[t]} {ENTRY_TYPE_LABELS[t]}</button>
            ))}
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索标题、摘要或标签…" className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            {query ? <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button> : null}
          </div>

          {!hasQuery ? (
            <EmptyState icon={Search} title="搜索当前世界的所有条目" description="输入标题、摘要或标签关键词开始搜索。支持按条目类型筛选。" />
          ) : results.length === 0 ? (
            <EmptyState icon={Search} title="未找到匹配条目" description="尝试调整搜索词或条目类型筛选。" action={<Button variant="outline" onClick={() => setQuery("")}>清除搜索</Button>} />
          ) : (
            <>
              <p className="mb-3 text-xs text-muted-foreground">找到 {results.length} 条结果</p>
              <div className="space-y-2">
                {results.map(({ entry, hitSource }) => (
                  <button key={entry.id} type="button" onClick={() => router.push(`/project/${projectId}?entry=${entry.id}`)} className="flex w-full items-start gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-3 text-left transition-colors hover:bg-accent/50">
                    <span className="mt-0.5 text-base">{ENTRY_TYPE_ICONS[entry.type]}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-medium"><HighlightedSpan text={entry.title || "未命名条目"} query={query} /></span>
                        <Badge variant="outline" className="text-xs">{ENTRY_TYPE_LABELS[entry.type]}</Badge>
                        <Badge variant="secondary" className="text-xs text-muted-foreground">{hitLabel[hitSource]}</Badge>
                      </div>
                      {entry.summary ? <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2"><HighlightedSpan text={entry.summary} query={query} /></p> : null}
                      {entry.tags.length > 0 ? <div className="mt-1 flex flex-wrap gap-1">{entry.tags.map((t) => <span key={t} className="rounded-full border border-border/40 bg-muted/30 px-1.5 py-0 text-xs text-muted-foreground">#{t}</span>)}</div> : null}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
