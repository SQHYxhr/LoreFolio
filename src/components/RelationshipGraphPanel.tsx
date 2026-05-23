"use client";

import { ArrowRight, ArrowRightLeft, ExternalLink, X } from "lucide-react";
import type { CharacterRelation, Entry } from "@/types";
import { RELATION_TYPE_LABELS } from "@/types";
import { RELATION_CARD_CLASSES } from "@/lib/relation-colors";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const STATUS_LABELS: Record<string, string> = {
  current: "当前",
  past: "过去",
  ambiguous: "模糊",
};

interface RelationshipGraphPanelProps {
  selectedNode: Entry | null;
  selectedEdgeData: {
    relation: CharacterRelation;
    fromEntry: Entry | null;
    toEntry: Entry | null;
  } | null;
  onClose: () => void;
  onNavigateToCharacter: (entryId: string) => void;
}

export function RelationshipGraphPanel({
  selectedNode,
  selectedEdgeData,
  onClose,
  onNavigateToCharacter,
}: RelationshipGraphPanelProps) {
  if (!selectedNode && !selectedEdgeData) return null;

  return (
    <aside className="flex h-full w-[380px] shrink-0 flex-col border-l border-border/80 bg-card/30">
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
        <h3 className="font-serif text-sm font-semibold">
          {selectedNode ? "角色信息" : "关系详情"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="关闭"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {selectedNode ? (
          <div className="space-y-4">
            {selectedNode.coverImage ? (
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedNode.coverImage}
                  alt={selectedNode.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-border/60 bg-muted/30">
                <span className="font-serif text-4xl font-bold text-muted-foreground">
                  {(selectedNode.title || "?").charAt(0)}
                </span>
              </div>
            )}

            <div className="text-center">
              <h4 className="font-serif text-lg font-semibold">
                {selectedNode.title || "未命名条目"}
              </h4>
              {selectedNode.summary ? (
                <p className="mt-2 text-sm text-muted-foreground">{selectedNode.summary}</p>
              ) : null}
            </div>

            {selectedNode.tags.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1.5">
                {selectedNode.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="pt-2 text-center">
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => onNavigateToCharacter(selectedNode.id)}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                查看详情
              </Button>
            </div>
          </div>
        ) : selectedEdgeData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Badge
                className={cn(
                  "border-l-4 px-3 py-1 text-xs font-medium",
                  RELATION_CARD_CLASSES[selectedEdgeData.relation.relationType].border,
                  RELATION_CARD_CLASSES[selectedEdgeData.relation.relationType].bg,
                )}
              >
                {selectedEdgeData.relation.customLabel ||
                  RELATION_TYPE_LABELS[selectedEdgeData.relation.relationType]}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm">
              <button
                type="button"
                className="font-medium hover:underline"
                onClick={() =>
                  selectedEdgeData.fromEntry &&
                  onNavigateToCharacter(selectedEdgeData.fromEntry.id)
                }
              >
                {selectedEdgeData.fromEntry?.title || "未知角色"}
              </button>

              {selectedEdgeData.relation.direction === "mutual" ? (
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              )}

              <button
                type="button"
                className="font-medium hover:underline"
                onClick={() =>
                  selectedEdgeData.toEntry && onNavigateToCharacter(selectedEdgeData.toEntry.id)
                }
              >
                {selectedEdgeData.toEntry?.title || "未知角色"}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-xs text-muted-foreground">
                方向：{selectedEdgeData.relation.direction === "mutual" ? "双向" : "单向"}
              </span>
              <span className="text-xs text-muted-foreground">
                状态：{STATUS_LABELS[selectedEdgeData.relation.status] || selectedEdgeData.relation.status}
              </span>
            </div>

            {selectedEdgeData.relation.note ? (
              <div className="rounded-lg border border-border/70 bg-card/40 p-3">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedEdgeData.relation.note}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </ScrollArea>
    </aside>
  );
}
