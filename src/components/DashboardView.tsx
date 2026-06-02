"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Clock, LayoutDashboard, Star, Tag } from "lucide-react";
import type { Entry } from "@/types";
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_LABELS } from "@/types";
import { useStore } from "@/hooks/use-store";
import { formatDate } from "@/lib/utils";
import { TopBar } from "@/components/TopBar";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Types ────────────────────────────────────────────────────

const STAT_TYPES = ["character", "location", "faction", "item", "event", "species"] as const;

interface DashboardViewProps {
  projectId: string;
}

// ── Helpers ──────────────────────────────────────────────────

function hasProfile(entry: Entry): boolean {
  switch (entry.type) {
    case "character":
      return Boolean(entry.characterProfile);
    case "location":
      return Boolean(entry.locationProfile);
    case "faction":
      return Boolean(entry.factionProfile);
    case "item":
      return Boolean(entry.itemProfile);
    case "event":
      return Boolean(entry.eventProfile);
    case "species":
      return Boolean(entry.speciesProfile);
    default:
      return false;
  }
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/40 p-4">
      <span className="text-xl">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-serif text-lg font-semibold">{value}</div>
        {sub ? <div className="text-xs text-muted-foreground">{sub}</div> : null}
      </div>
    </div>
  );
}

function miniatureUpdate(entry: Entry) {
  return (
    <div key={entry.id} className="flex items-center gap-2 text-sm">
      <span className="shrink-0 text-xs text-muted-foreground">{ENTRY_TYPE_ICONS[entry.type]}</span>
      <span className="min-w-0 flex-1 truncate font-medium">{entry.title || "未命名条目"}</span>
      <span className="shrink-0 text-xs text-muted-foreground">{formatDate(entry.updatedAt)}</span>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────

export function DashboardView({ projectId }: DashboardViewProps) {
  const router = useRouter();
  const { hydrated, data, getProject } = useStore();

  const project = getProject(projectId);

  const projectEntries = useMemo(
    () => data.entries.filter((e) => e.projectId === projectId),
    [data.entries, projectId],
  );

  // Type counts
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of STAT_TYPES) {
      map[t] = projectEntries.filter((e) => e.type === t).length;
    }
    return map;
  }, [projectEntries]);

  // Profile completeness
  const profiles = useMemo(() => {
    const result: Record<string, { have: number; total: number }> = {};
    for (const t of STAT_TYPES) {
      const entries = projectEntries.filter((e) => e.type === t);
      const have = entries.filter((e) => hasProfile(e)).length;
      result[t] = { have, total: entries.length };
    }
    return result;
  }, [projectEntries]);

  // Recent updates
  const recent = useMemo(
    () =>
      [...projectEntries]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [projectEntries],
  );

  // Favorites & pinned
  const favorites = useMemo(() => projectEntries.filter((e) => e.isFavorite), [projectEntries]);
  const pinned = useMemo(() => projectEntries.filter((e) => e.isPinned), [projectEntries]);

  // Popular tags (top 10)
  const popularTags = useMemo(() => {
    const freq: Record<string, number> = {};
    for (const e of projectEntries) {
      for (const t of e.tags) freq[t] = (freq[t] || 0) + 1;
    }
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [projectEntries]);

  // Event / chronology summary
  const eventEntries = useMemo(
    () => projectEntries.filter((e) => e.type === "event"),
    [projectEntries],
  );
  const chronologyCount = useMemo(() => {
    const set = new Set<string>();
    for (const e of eventEntries) {
      const c = e.eventProfile?.chronology?.trim();
      if (c) set.add(c);
    }
    return set.size;
  }, [eventEntries]);

  const recentEvents = useMemo(
    () =>
      [...eventEntries]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3),
    [eventEntries],
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        正在加载世界概览...
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
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-semibold">世界概览</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              快速查看当前世界的设定规模、更新动态与资料完整度
            </p>
          </div>

          {projectEntries.length === 0 ? (
            <EmptyState
              icon={LayoutDashboard}
              title="该项目还没有任何条目"
              description="在项目中创建条目后，可在此页查看统计概览。"
              action={
                <Button variant="outline" onClick={() => router.push(`/project/${projectId}`)}>
                  返回项目
                </Button>
              }
            />
          ) : (
            <div className="space-y-8">
              {/* ── 条目数量统计 ─────────────────────────────── */}
              <section>
                <h2 className="mb-4 font-serif text-base font-semibold">条目数量</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {STAT_TYPES.map((t) => (
                    <StatCard
                      key={t}
                      icon={ENTRY_TYPE_ICONS[t]}
                      label={ENTRY_TYPE_LABELS[t]}
                      value={counts[t]}
                    />
                  ))}
                </div>
              </section>

              {/* ── Profile 完整度 ───────────────────────────── */}
              <section>
                <h2 className="mb-4 font-serif text-base font-semibold">档案完整度</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {STAT_TYPES.map((t) => {
                    const { have, total } = profiles[t];
                    const pct = total > 0 ? Math.round((have / total) * 100) : null;
                    return (
                      <div
                        key={t}
                        className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/40 p-3"
                      >
                        <span className="text-lg">{ENTRY_TYPE_ICONS[t]}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground">{ENTRY_TYPE_LABELS[t]}</div>
                          <div className="text-sm font-medium">
                            {have}/{total}
                            {pct !== null ? (
                              <span className="ml-1 text-xs text-muted-foreground">({pct}%)</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── 最近更新 + 收藏/置顶 ──────────────────────── */}
              <div className="grid gap-8 lg:grid-cols-2">
                <section>
                  <h2 className="mb-4 font-serif text-base font-semibold">
                    <Clock className="mr-1.5 inline-block h-4 w-4 text-muted-foreground" />
                    最近更新
                  </h2>
                  <div className="space-y-2 rounded-xl border border-border/70 bg-card/40 p-4">
                    {recent.length === 0 ? (
                      <p className="text-sm text-muted-foreground">暂无条目</p>
                    ) : (
                      recent.map(miniatureUpdate)
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 font-serif text-base font-semibold">
                    <Star className="mr-1.5 inline-block h-4 w-4 text-amber-500" />
                    收藏与置顶
                  </h2>
                  <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-muted-foreground">收藏条目</span>
                      <span className="font-semibold">{favorites.length}</span>
                    </div>
                    {favorites.length > 0 ? (
                      <div className="space-y-1 border-t border-border/60 pt-2">
                        {favorites.slice(0, 5).map((e) => (
                          <div key={e.id} className="text-sm text-muted-foreground">
                            {ENTRY_TYPE_ICONS[e.type]} {e.title || "未命名条目"}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex items-center gap-3 text-sm">
                      <Bookmark className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">置顶条目</span>
                      <span className="font-semibold">{pinned.length}</span>
                    </div>
                    {pinned.length > 0 ? (
                      <div className="space-y-1 border-t border-border/60 pt-2">
                        {pinned.slice(0, 5).map((e) => (
                          <div key={e.id} className="text-sm text-muted-foreground">
                            {ENTRY_TYPE_ICONS[e.type]} {e.title || "未命名条目"}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>

              {/* ── 热门标签 + 事件/纪年 ───────────────────────── */}
              <div className="grid gap-8 lg:grid-cols-2">
                {popularTags.length > 0 ? (
                  <section>
                    <h2 className="mb-4 font-serif text-base font-semibold">
                      <Tag className="mr-1.5 inline-block h-4 w-4 text-muted-foreground" />
                      热门标签
                    </h2>
                    <div className="flex flex-wrap gap-2 rounded-xl border border-border/70 bg-card/40 p-4">
                      {popularTags.map(([tag, count]) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                          <span className="ml-1 text-muted-foreground">{count}</span>
                        </Badge>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section>
                  <h2 className="mb-4 font-serif text-base font-semibold">
                    <Clock className="mr-1.5 inline-block h-4 w-4 text-muted-foreground" />
                    事件与纪年
                  </h2>
                  <div className="space-y-3 rounded-xl border border-border/70 bg-card/40 p-4">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-lg">{ENTRY_TYPE_ICONS.event}</span>
                      <span className="text-muted-foreground">事件总数</span>
                      <span className="font-semibold">{eventEntries.length}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-lg">📅</span>
                      <span className="text-muted-foreground">不同纪年</span>
                      <span className="font-semibold">{chronologyCount}</span>
                    </div>
                    {recentEvents.length > 0 ? (
                      <div className="space-y-1 border-t border-border/60 pt-2">
                        <p className="text-xs text-muted-foreground">最近事件</p>
                        {recentEvents.map((e) => (
                          <div key={e.id} className="text-sm text-muted-foreground">
                            {e.title || "未命名事件"}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
