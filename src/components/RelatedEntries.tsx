"use client";

import type { Entry } from "@/types";
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_LABELS } from "@/types";
import { cn } from "@/lib/utils";

interface RelatedEntriesProps {
  entries: Entry[];
  onSelect: (entry: Entry) => void;
}

export function RelatedEntries({ entries, onSelect }: RelatedEntriesProps) {
  if (entries.length === 0) return null;

  return (
    <section>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        相关条目
      </h3>
      <div className="space-y-2">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border border-border/80 bg-card/50 p-3 text-left",
              "transition-colors hover:border-primary/30 hover:bg-primary/5",
            )}
          >
            <span className="text-lg leading-none">{ENTRY_TYPE_ICONS[entry.type]}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{entry.title || "未命名条目"}</p>
              <p className="text-xs text-muted-foreground">{ENTRY_TYPE_LABELS[entry.type]}</p>
            </div>
            {entry.summary ? (
              <p className="hidden max-w-[140px] truncate text-xs text-muted-foreground sm:block">
                {entry.summary}
              </p>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
