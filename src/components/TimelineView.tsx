"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search, X } from "lucide-react";
import type { Entry } from "@/types";
import { useStore } from "@/hooks/use-store";
import { ENTRY_TYPE_ICONS, EVENT_CATEGORY_LABELS, EVENT_STATUS_LABELS } from "@/types";
import { TopBar } from "@/components/TopBar";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Helpers ──────────────────────────────────────────────────

function matchesSearch(entry: Entry, q: string): boolean {
  const p = entry.eventProfile;
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.summary.toLowerCase().includes(q) ||
    entry.tags.some((t) => t.toLowerCase().includes(q)) ||
    (p?.cause?.toLowerCase().includes(q) ?? false) ||
    (p?.process?.toLowerCase().includes(q) ?? false) ||
    (p?.result?.toLowerCase().includes(q) ?? false) ||
    (p?.impact?.toLowerCase().includes(q) ?? false) ||
    (p?.aftermath?.toLowerCase().includes(q) ?? false) ||
    (p?.creatorNotes?.toLowerCase().includes(q) ?? false)
  );
}

function sortTimelineEvents(events: Entry[]): Entry[] {
  return [...events].sort((a, b) => {
    // 1. Pinned first
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    // 2. By timelineOrder (ascending, undefined last)
    const ao = a.eventProfile?.timelineOrder;
    const bo = b.eventProfile?.timelineOrder;
    if (ao !== bo) {
      if (ao == null) return 1;
      if (bo == null) return -1;
      return ao - bo;
    }
    // 3. By updatedAt descending
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function groupByChronology(events: Entry[]): { chronology: string; events: Entry[] }[] {
  const groups: { chronology: string; events: Entry[] }[] = [];
  for (const event of events) {
    const key = event.eventProfile?.chronology?.trim() || "未分类纪年";
    let group = groups.find((g) => g.chronology === key);
    if (!group) {
      group = { chronology: key, events: [] };
      groups.push(group);
    }
    group.events.push(event);
  }
  return groups;
}

// ── Component ────────────────────────────────────────────────

interface TimelineViewProps {
  projectId: string;
}

export function TimelineView({ projectId }: TimelineViewProps) {
  const router = useRouter();
  const { hydrated, data, getProject } = useStore();

  const project = getProject(projectId);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 1. 收集可用标签
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const e of data.entries) {
      if (e.type === "event" && e.projectId === projectId) {
        for (const t of e.tags) tagSet.add(t);
      }
    }
    return [...tagSet].sort((a, b) => a.localeCompare(b, "zh-CN"));
  }, [data.entries, projectId]);

  // 2. 获取并排序事件
  const eventEntries = useMemo(
    () =>
      sortTimelineEvents(
        data.entries.filter((e) => e.type === "event" && e.projectId === projectId),
      ),
    [data.entries, projectId],
  );

  // 3. 搜索 + 标签过滤
  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let events = eventEntries;

    if (q) {
      events = events.filter((e) => matchesSearch(e, q));
    }

    if (activeTag) {
      events = events.filter((e) => e.tags.includes(activeTag));
    }

    return events;
  }, [eventEntries, searchQuery, activeTag]);

  // 4. 按 chronology 分组
  const groups = useMemo(() => groupByChronology(filteredEvents), [filteredEvents]);

  const hasEvents = eventEntries.length > 0;
  const hasFilter = searchQuery.trim().length > 0 || !!activeTag;

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTag(null);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        正在加载时间线...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">未找到该世界项目</p>
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => router.push("/")}
        >
          返回项目列表
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col lg:h-screen lg:overflow-hidden">
      <TopBar
        project={project}
        backHref={`/project/${projectId}`}
        backLabel="返回项目"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-semibold">时间线</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              按事件档案整理当前世界的历史与剧情节点
            </p>
          </div>

          {hasEvents ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索事件标题、标签或内容…"
                  className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-8 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              {availableTags.length > 0 ? (
                <div className="-mx-1 mb-6 flex flex-wrap items-center gap-1.5 px-1">
                  <button
                    type="button"
                    onClick={() => setActiveTag(null)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      !activeTag
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    全部
                  </button>
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        activeTag === tag
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              ) : null}

            <p className="mb-4 text-xs text-muted-foreground/70">
              排序值越小越靠前；未设置排序值的事件会排在后面。
            </p>
            </>
          ) : null}

          {!hasEvents ? (
            <EmptyState
              icon={Clock}
              title="该项目还没有事件条目"
              description="在项目中创建事件后，可在此页浏览时间线。"
              action={
                <Button variant="outline" onClick={() => router.push(`/project/${projectId}`)}>
                  返回项目
                </Button>
              }
            />
          ) : hasFilter && groups.length === 0 ? (
            <EmptyState
              icon={Search}
              title="未找到匹配事件"
              description="尝试调整搜索词或标签筛选。"
              action={
                <Button variant="outline" onClick={clearFilters}>
                  清除全部筛选
                </Button>
              }
            />
          ) : (
            /* Vertical timeline with chronology groups */
            <div className="relative ml-3 border-l-2 border-border/60 pl-8 sm:ml-6 sm:pl-10">
              {groups.map((group) => (
                <div key={group.chronology} className="pb-8 last:pb-0">
                  {/* Group header */}
                  <div className="relative -ml-[calc(2rem+3px)] mb-5 flex items-center gap-3 sm:-ml-[calc(2.5rem+3px)]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary/30 bg-background">
                      <span className="text-xs font-medium text-primary/70">
                        {group.events.length}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-serif text-base font-semibold text-foreground/85">
                        {group.chronology}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {group.events.length} 个事件
                      </p>
                    </div>
                  </div>

                  {/* Group events */}
                  <div className="space-y-5">
                    {group.events.map((entry) => {
                      const p = entry.eventProfile;
                      const hasProfile =
                        !!p &&
                        (!!p.eventCategory ||
                          !!p.status ||
                          !!p.chronology.trim() ||
                          !!p.startDateText.trim() ||
                          !!p.endDateText.trim());

                      return (
                        <div key={entry.id} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-[calc(2rem+1px)] top-1.5 flex h-4 w-4 items-center justify-center sm:-left-[calc(2.5rem+1px)]">
                            <div className="h-2.5 w-2.5 rounded-full border-2 border-border bg-card" />
                          </div>

                          {/* Card */}
                          <button
                            type="button"
                            onClick={() => router.push(`/project/${projectId}?event=${entry.id}`)}
                            className="w-full rounded-xl border border-border/70 bg-card/40 p-4 text-left transition-colors hover:border-primary/30 sm:p-5"
                          >
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              {hasProfile ? (
                                <>
                                  {p?.eventCategory ? (
                                    <Badge variant="secondary" className="text-xs">
                                      {EVENT_CATEGORY_LABELS[p.eventCategory] || p.eventCategory}
                                    </Badge>
                                  ) : null}
                                  {p?.status ? (
                                    <Badge variant="outline" className="text-xs">
                                      {EVENT_STATUS_LABELS[p.status] || p.status}
                                    </Badge>
                                  ) : null}
                                </>
                              ) : (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  尚未补充事件档案
                                </Badge>
                              )}
                              {entry.isPinned ? (
                                <Badge variant="secondary" className="text-xs">
                                  置顶
                                </Badge>
                              ) : null}
                              {entry.eventProfile?.timelineOrder != null ? (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  #{entry.eventProfile.timelineOrder}
                                </Badge>
                              ) : null}
                              <span className="text-xs text-muted-foreground">
                                {ENTRY_TYPE_ICONS.event}
                              </span>
                            </div>

                            <h3 className="font-serif text-lg font-semibold leading-snug">
                              {entry.title || "未命名事件"}
                            </h3>

                            {entry.summary ? (
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                                {entry.summary}
                              </p>
                            ) : null}

                            {hasProfile ? (
                              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-3">
                                {p?.startDateText?.trim() ? (
                                  <div>
                                    <span className="font-medium">起始</span> {p.startDateText}
                                  </div>
                                ) : null}
                                {p?.endDateText?.trim() ? (
                                  <div>
                                    <span className="font-medium">结束</span> {p.endDateText}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}

                            <p className="mt-3 text-right text-xs text-muted-foreground/60">
                              点击查看事件详情 →
                            </p>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
