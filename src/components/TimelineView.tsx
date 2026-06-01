"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search, X } from "lucide-react";
import { useStore } from "@/hooks/use-store";
import { ENTRY_TYPE_ICONS, EVENT_CATEGORY_LABELS, EVENT_STATUS_LABELS } from "@/types";
import { TopBar } from "@/components/TopBar";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimelineViewProps {
  projectId: string;
}

export function TimelineView({ projectId }: TimelineViewProps) {
  const router = useRouter();
  const { hydrated, data, getProject } = useStore();

  const project = getProject(projectId);

  const [searchQuery, setSearchQuery] = useState("");

  const groupedEvents = useMemo(() => {
    const sorted = data.entries
      .filter((e) => e.type === "event" && e.projectId === projectId)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

    const q = searchQuery.trim().toLowerCase();
    const events = q
      ? sorted.filter((e) => {
          const p = e.eventProfile;
          return (
            e.title.toLowerCase().includes(q) ||
            e.summary.toLowerCase().includes(q) ||
            e.tags.some((t) => t.toLowerCase().includes(q)) ||
            (p?.cause?.toLowerCase().includes(q) ?? false) ||
            (p?.process?.toLowerCase().includes(q) ?? false) ||
            (p?.result?.toLowerCase().includes(q) ?? false) ||
            (p?.impact?.toLowerCase().includes(q) ?? false) ||
            (p?.aftermath?.toLowerCase().includes(q) ?? false) ||
            (p?.creatorNotes?.toLowerCase().includes(q) ?? false)
          );
        })
      : sorted;

    const groups: { chronology: string; events: typeof events }[] = [];
    for (const event of events) {
      const key = event.eventProfile?.chronology?.trim() || "未分类纪年";
      let group = groups.find((g) => g.chronology === key);
      if (!group) {
        group = { chronology: key, events: [] };
        groups.push(group);
      }
      group.events.push(event);
    }
    return { groups, hasQuery: q.length > 0 };
  }, [data.entries, projectId, searchQuery]);

  const { groups, hasQuery } = groupedEvents;
  const hasEvents = data.entries.some((e) => e.type === "event" && e.projectId === projectId);

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
            <div className="relative mb-6">
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
          ) : hasQuery && groups.length === 0 ? (
            <EmptyState
              icon={Search}
              title="未找到匹配事件"
              description="尝试搜索标题、标签或事件内容，或使用不同的关键词。"
              action={
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  清除搜索
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
