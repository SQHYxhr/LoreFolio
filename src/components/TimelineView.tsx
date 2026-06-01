"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
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

  const eventEntries = useMemo(
    () =>
      data.entries
        .filter((e) => e.type === "event" && e.projectId === projectId)
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }),
    [data.entries, projectId],
  );

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
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-semibold">时间线</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              按事件档案整理当前世界的历史与剧情节点
            </p>
          </div>

          {eventEntries.length === 0 ? (
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
          ) : (
            /* Vertical timeline */
            <div className="relative ml-3 space-y-6 border-l-2 border-border/60 pl-8 sm:ml-6 sm:pl-10">
              {eventEntries.map((entry) => {
                const p = entry.eventProfile;
                const hasProfile =
                  !!p &&
                  (!!p.eventCategory ||
                    !!p.status ||
                    !!p.chronology.trim() ||
                    !!p.startDateText.trim() ||
                    !!p.endDateText.trim());

                return (
                  <div key={entry.id} className="relative pb-6 last:pb-0">
                    {/* Timeline dot */}
                    <div className="absolute -left-[calc(2rem+1px)] top-1 flex h-4 w-4 items-center justify-center sm:-left-[calc(2.5rem+1px)]">
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
                          {p?.chronology?.trim() ? (
                            <div>
                              <span className="font-medium">纪年</span> {p.chronology}
                            </div>
                          ) : null}
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
          )}
        </div>
      </div>
    </div>
  );
}
