"use client";

import { Search, EyeOff } from "lucide-react";
import type { RelationType } from "@/types";
import { RELATION_TYPE_LABELS, RELATION_TYPES } from "@/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RelationshipGraphControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  relationTypeFilter: RelationType | null;
  onRelationTypeFilterChange: (type: RelationType | null) => void;
  hideIsolated: boolean;
  onHideIsolatedChange: (hide: boolean) => void;
}

export function RelationshipGraphControls({
  searchQuery,
  onSearchChange,
  relationTypeFilter,
  onRelationTypeFilterChange,
  hideIsolated,
  onHideIsolatedChange,
}: RelationshipGraphControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border/80 px-4 py-3">
      <div className="relative w-full sm:w-52">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索角色..."
          className="h-8 pl-8 text-sm"
        />
      </div>

      <select
        value={relationTypeFilter ?? ""}
        onChange={(e) =>
          onRelationTypeFilterChange(e.target.value ? (e.target.value as RelationType) : null)
        }
        className="h-8 rounded-lg border border-input bg-card px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">全部关系</option>
        {RELATION_TYPES.map((t) => (
          <option key={t} value={t}>
            {RELATION_TYPE_LABELS[t]}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => onHideIsolatedChange(!hideIsolated)}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs transition-colors",
          hideIsolated
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:border-primary/30",
        )}
      >
        <EyeOff className="h-3 w-3" />
        隐藏孤立
      </button>
    </div>
  );
}
