"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Map } from "lucide-react";
import type { Entry } from "@/types";
import { ENTRY_TYPE_ICONS, LOCATION_CATEGORY_LABELS } from "@/types";
import { useStore } from "@/hooks/use-store";
import { TopBar } from "@/components/TopBar";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

// ── Types ────────────────────────────────────────────────────

interface WorldMapViewProps {
  projectId: string;
}

interface MapLocation {
  entry: Entry;
  mapX: number;
  mapY: number;
  parentId: string | null;
}

// ── Map Node ─────────────────────────────────────────────────

function MapNode({
  loc,
  onClick,
}: {
  loc: MapLocation;
  onClick: (id: string) => void;
}) {
  const p = loc.entry.locationProfile;
  const catLabel = p?.locationCategory
    ? LOCATION_CATEGORY_LABELS[p.locationCategory] || p.locationCategory
    : null;

  return (
    <g
      role="button"
      tabIndex={0}
      className="cursor-pointer transition-transform hover:scale-110 focus-visible:outline-none"
      style={{ transformOrigin: `${loc.mapX * 100}% ${loc.mapY * 100}%` }}
      onClick={() => onClick(loc.entry.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(loc.entry.id);
        }
      }}
    >
      {/* Transparent hit area for touch / click */}
      <circle
        cx={loc.mapX * 100}
        cy={loc.mapY * 100}
        r={2.4}
        fill="transparent"
      />
      {/* Visual dot */}
      <circle
        cx={loc.mapX * 100}
        cy={loc.mapY * 100}
        r={0.4}
        fill="#fffcf7"
        stroke="#7c4a2d"
        strokeWidth="0.12"
        className="transition-colors group-hover:fill-primary/20"
      />
      <text
        x={loc.mapX * 100}
        y={loc.mapY * 100 + 0.7}
        textAnchor="middle"
        className="fill-foreground/85 text-[0.55px] font-medium"
        style={{ fontFamily: "var(--font-noto-serif), serif", pointerEvents: "none" }}
      >
        {loc.entry.title || "未命名地点"}
      </text>
      {catLabel ? (
        <text
          x={loc.mapX * 100}
          y={loc.mapY * 100 + 1.05}
          textAnchor="middle"
          className="fill-muted-foreground text-[0.4px]"
          style={{ pointerEvents: "none" }}
        >
          {catLabel}
        </text>
      ) : null}
    </g>
  );
}

// ── Component ────────────────────────────────────────────────

export function WorldMapView({ projectId }: WorldMapViewProps) {
  const router = useRouter();
  const { hydrated, data, getProject } = useStore();

  const project = getProject(projectId);

  const locations = useMemo(() => {
    const entries = data.entries.filter(
      (e) => e.type === "location" && e.projectId === projectId,
    );

    return entries
      .filter((e): e is Entry & { locationProfile: NonNullable<Entry["locationProfile"]> } =>
        Boolean(e.locationProfile),
      )
      .map(
        (e): MapLocation => ({
          entry: e,
          mapX: e.locationProfile.mapX,
          mapY: e.locationProfile.mapY,
          parentId: e.locationProfile.parentLocationId || null,
        }),
      );
  }, [data.entries, projectId]);

  const allZero = locations.length > 0 && locations.every((l) => l.mapX === 0 && l.mapY === 0);

  const hasParentLines =
    locations.filter((l) => l.parentId && locations.some((p) => p.entry.id === l.parentId)).length >
    0;

  const handleNodeClick = (id: string) => {
    router.push(`/project/${projectId}?entry=${id}`);
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        正在加载世界地图...
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
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-semibold">世界地图</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              以地点坐标展示当前世界的空间结构
            </p>
          </div>

          {locations.length === 0 ? (
            <EmptyState
              icon={Map}
              title="该项目还没有地点条目"
              description="在项目中创建地点并设置地图坐标后，可在此页查看空间分布。"
              action={
                <Button variant="outline" onClick={() => router.push(`/project/${projectId}`)}>
                  返回项目
                </Button>
              }
            />
          ) : (
            <>
              {allZero ? (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-2 text-center text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  部分地点尚未设置地图坐标，所有地点均显示在左上角。可在编辑地点时设置坐标。
                </div>
              ) : null}

              <div className="overflow-hidden rounded-xl border border-border/70 bg-white/50 p-2 sm:p-4">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  className="h-auto w-full"
                  style={{ background: "radial-gradient(circle at 30% 20%, rgba(124,74,45,0.04), transparent 50%)" }}
                >
                  {/* Grid lines */}
                  {[20, 40, 60, 80].map((n) => (
                    <g key={n}>
                      <line
                        x1={n}
                        y1="0"
                        x2={n}
                        y2="100"
                        stroke="#ddd4c6"
                        strokeWidth="0.05"
                        strokeDasharray="1 2"
                      />
                      <line
                        x1="0"
                        y1={n}
                        x2="100"
                        y2={n}
                        stroke="#ddd4c6"
                        strokeWidth="0.05"
                        strokeDasharray="1 2"
                      />
                    </g>
                  ))}

                  {/* Parent-child lines */}
                  {hasParentLines
                    ? locations.map((loc) => {
                        if (!loc.parentId) return null;
                        const parent = locations.find((p) => p.entry.id === loc.parentId);
                        if (!parent) return null;
                        return (
                          <line
                            key={`${parent.entry.id}-${loc.entry.id}`}
                            x1={parent.mapX * 100}
                            y1={parent.mapY * 100}
                            x2={loc.mapX * 100}
                            y2={loc.mapY * 100}
                            stroke="#c9a44a"
                            strokeWidth="0.08"
                            strokeDasharray="0.5 1"
                          />
                        );
                      })
                    : null}

                  {/* Location nodes */}
                  {locations.map((loc) => (
                    <MapNode key={loc.entry.id} loc={loc} onClick={handleNodeClick} />
                  ))}
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {locations.map((loc) => {
                  const p = loc.entry.locationProfile;
                  return (
                    <button
                      key={loc.entry.id}
                      type="button"
                      onClick={() => handleNodeClick(loc.entry.id)}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/50"
                    >
                      <span>{ENTRY_TYPE_ICONS.location}</span>
                      <span className="flex-1 font-medium truncate">
                        {loc.entry.title || "未命名地点"}
                      </span>
                      {p?.locationCategory ? (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {LOCATION_CATEGORY_LABELS[p.locationCategory] || p.locationCategory}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
