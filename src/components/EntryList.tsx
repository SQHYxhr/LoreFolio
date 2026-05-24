"use client";

import { Feather, Plus, Search, X } from "lucide-react";
import type { Entry, EntryType } from "@/types";
import { ENTRY_TYPE_LABELS } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EntryCard } from "@/components/EntryCard";
import { EmptyState } from "@/components/EmptyState";

interface EntryListProps {
  entries: Entry[];
  allEntriesForTags: Entry[];
  activeType: EntryType;
  selectedEntryId: string | null;
  searchQuery: string;
  activeTag: string | null;
  onSearchChange: (query: string) => void;
  onTagChange: (tag: string | null) => void;
  availableTags: string[];
  onSelect: (entry: Entry) => void;
  onCreate: () => void;
}

export function EntryList({
  entries,
  allEntriesForTags,
  activeType,
  selectedEntryId,
  searchQuery,
  activeTag,
  onSearchChange,
  onTagChange,
  availableTags,
  onSelect,
  onCreate,
}: EntryListProps) {
  const typeLabel = ENTRY_TYPE_LABELS[activeType];
  const hasFilters = Boolean(searchQuery.trim() || activeTag);
  const totalInType = allEntriesForTags.length;

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col lg:border-r border-border/80 bg-background/50">
      <div className="space-y-3 border-b border-border/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-semibold">{typeLabel}</h2>
            <p className="text-xs text-muted-foreground">
              {hasFilters
                ? `筛选结果 ${entries.length} / ${totalInType} 条`
                : `共 ${entries.length} 条设定`}
            </p>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onCreate}>
            <Plus className="h-3.5 w-3.5" />
            新建
          </Button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索标题、摘要、正文..."
            className="h-8 pl-8 pr-8 text-sm"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="清除搜索"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        {availableTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onTagChange(null)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                !activeTag
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30",
              )}
            >
              全部
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagChange(activeTag === tag ? null : tag)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                  activeTag === tag
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ScrollArea className="flex-1 p-4">
        {entries.length === 0 ? (
          <EmptyState
            icon={Feather}
            title={hasFilters ? "没有匹配的条目" : `这里还没有${typeLabel}`}
            description={
              hasFilters
                ? "试试调整搜索词或清除标签筛选。"
                : `先创建一个${typeLabel}条目，开始搭建你的设定吧。`
            }
            action={
              hasFilters ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    onSearchChange("");
                    onTagChange(null);
                  }}
                >
                  清除筛选
                </Button>
              ) : (
                <Button onClick={onCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  创建{typeLabel}
                </Button>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                selected={selectedEntryId === entry.id}
                onSelect={onSelect}
                onTagClick={onTagChange}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </section>
  );
}
