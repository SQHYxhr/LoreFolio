"use client";

import { ArrowRight, ArrowRightLeft, Edit3, Trash2 } from "lucide-react";
import type { CharacterRelation, Entry } from "@/types";
import { RELATION_TYPE_LABELS } from "@/types";
import { cn } from "@/lib/utils";
import { RELATION_CARD_CLASSES } from "@/lib/relation-colors";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  current: "当前",
  past: "过去",
  ambiguous: "模糊",
};

interface CharacterRelationCardProps {
  relation: CharacterRelation;
  currentCharacterId: string;
  targetEntry: Entry | null;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onNavigate?: (entryId: string) => void;
}

export function CharacterRelationCard({
  relation,
  currentCharacterId,
  targetEntry,
  showActions = false,
  onEdit,
  onDelete,
  onNavigate,
}: CharacterRelationCardProps) {
  const isFrom = relation.fromCharacterId === currentCharacterId;
  const colors = RELATION_CARD_CLASSES[relation.relationType];
  const label = relation.customLabel || RELATION_TYPE_LABELS[relation.relationType];
  const targetId = isFrom ? relation.toCharacterId : relation.fromCharacterId;
  const targetName = targetEntry?.title || "未知角色";

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-3",
        colors.border,
        colors.bg,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="text-sm font-medium hover:underline truncate text-left"
              onClick={() => targetEntry && onNavigate?.(targetId)}
              disabled={!targetEntry}
            >
              {targetName}
            </button>
            {relation.direction === "mutual" ? (
              <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground" title="互为关系">
                <ArrowRightLeft className="h-3 w-3" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground" title={isFrom ? "单向 →" : "被指向 ←"}>
                <ArrowRight className={cn("h-3 w-3", !isFrom && "rotate-180")} />
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">{label}</Badge>
            <span className="text-[10px] text-muted-foreground">
              {STATUS_LABELS[relation.status] || relation.status}
            </span>
          </div>

          {relation.note ? (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{relation.note}</p>
          ) : null}
        </div>

        {showActions ? (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="编辑关系"
            >
              <Edit3 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="删除关系"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
