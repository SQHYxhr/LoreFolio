"use client";

import { Calendar, GitFork, LayoutDashboard, Map, Plus } from "lucide-react";
import type { EntryType, Project } from "@/types";
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_LABELS, ENTRY_TYPES } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  project: Project;
  activeType: EntryType;
  onTypeChange: (type: EntryType) => void;
  onCreateEntry: () => void;
  countByType: (type: EntryType) => number;
  onNavigateToRelations?: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToMap?: () => void;
}

export function Sidebar({
  project,
  activeType,
  onTypeChange,
  onCreateEntry,
  countByType,
  onNavigateToRelations,
  onNavigateToTimeline,
  onNavigateToDashboard,
  onNavigateToMap,
}: SidebarProps) {
  return (
    <aside className="hidden lg:flex h-full lg:w-56 shrink-0 flex-col border-r border-border/80 bg-card/40">
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">当前世界</p>
        <h2 className="mt-1 font-serif text-lg font-semibold leading-tight">{project.name}</h2>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-2 py-3">
        <p className="mb-2 px-2 text-xs text-muted-foreground">设定分类</p>
        <nav className="space-y-0.5">
          {ENTRY_TYPES.map((type) => {
            const count = countByType(type);
            const isActive = activeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onTypeChange(type)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-foreground/80 hover:bg-accent",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{ENTRY_TYPE_ICONS[type]}</span>
                  {ENTRY_TYPE_LABELS[type]}
                </span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
      {onNavigateToDashboard ? (
        <div className="border-t border-border/80 px-2 py-2">
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            世界概览
          </button>
        </div>
      ) : null}
      {onNavigateToMap ? (
        <div className="border-t border-border/80 px-2 py-2">
          <button
            type="button"
            onClick={onNavigateToMap}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Map className="h-4 w-4" />
            世界地图
          </button>
        </div>
      ) : null}
      {onNavigateToRelations ? (
        <div className="border-t border-border/80 px-2 py-2">
          <button
            type="button"
            onClick={onNavigateToRelations}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <GitFork className="h-4 w-4" />
            关系图谱
          </button>
        </div>
      ) : null}
      {onNavigateToTimeline ? (
        <div className="border-t border-border/80 px-2 py-2">
          <button
            type="button"
            onClick={onNavigateToTimeline}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Calendar className="h-4 w-4" />
            时间线
          </button>
        </div>
      ) : null}
      <div className="border-t border-border/80 p-4">
        <Button className="w-full gap-2" onClick={onCreateEntry}>
          <Plus className="h-4 w-4" />
          新建条目
        </Button>
      </div>
    </aside>
  );
}
