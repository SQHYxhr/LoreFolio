"use client";

import { ImageIcon, Pin, Star } from "lucide-react";
import type { Entry } from "@/types";
import { ENTRY_TYPE_LABELS } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EntryCardProps {
  entry: Entry;
  selected: boolean;
  onSelect: (entry: Entry) => void;
  onTagClick?: (tag: string) => void;
}

export function EntryCard({ entry, selected, onSelect, onTagClick }: EntryCardProps) {
  const hasImages = Boolean(entry.coverImage) || entry.galleryImages.length > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className={cn(
        "w-full overflow-hidden rounded-xl border bg-card text-left transition-all hover:border-primary/30 hover:shadow-sm",
        selected && "border-primary/40 bg-primary/5 ring-1 ring-primary/20",
        entry.isFavorite && !selected && "border-amber-200/60 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-950/20",
        entry.isPinned && "ring-1 ring-primary/15",
      )}
    >
      {entry.coverImage ? (
        <div className="relative h-24 w-full overflow-hidden border-b border-border/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entry.coverImage} alt="" className="h-full w-full object-cover" />
          {entry.isPinned ? (
            <span className="absolute left-2 top-2 inline-flex items-center gap-0.5 rounded-md bg-primary/90 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              <Pin className="h-2.5 w-2.5" />
              置顶
            </span>
          ) : null}
          {entry.isFavorite ? (
            <span className="absolute right-2 top-2 inline-flex items-center rounded-md bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
              <Star className="mr-0.5 h-2.5 w-2.5 fill-current" />
              收藏
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5">
              {!entry.coverImage && entry.isPinned ? (
                <Pin className="h-3 w-3 shrink-0 text-primary" />
              ) : null}
              {!entry.coverImage && entry.isFavorite ? (
                <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
              ) : null}
              <h3 className="truncate font-serif font-semibold">{entry.title || "未命名条目"}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">
                {ENTRY_TYPE_LABELS[entry.type]}
              </Badge>
              {hasImages ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <ImageIcon className="h-3 w-3" />
                  {entry.galleryImages.length + (entry.coverImage ? 1 : 0)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{entry.summary || "暂无摘要"}</p>
        {entry.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {entry.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                role={onTagClick ? "button" : undefined}
                tabIndex={onTagClick ? 0 : undefined}
                onClick={
                  onTagClick
                    ? (e) => {
                        e.stopPropagation();
                        onTagClick(tag);
                      }
                    : undefined
                }
                onKeyDown={
                  onTagClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          onTagClick(tag);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground",
                  onTagClick && "cursor-pointer hover:bg-primary/10 hover:text-primary",
                )}
              >
                {tag}
              </span>
            ))}
            {entry.tags.length > 4 ? (
              <span className="text-[10px] text-muted-foreground">+{entry.tags.length - 4}</span>
            ) : null}
          </div>
        ) : null}
        <p className="mt-3 text-xs text-muted-foreground">更新于 {formatDate(entry.updatedAt)}</p>
      </div>
    </button>
  );
}
