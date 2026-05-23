"use client";

import type { Entry } from "@/types";
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_LABELS } from "@/types";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RelatedEntryPickerProps {
  entries: Entry[];
  selectedIds: string[];
  currentEntryId?: string;
  onChange: (ids: string[]) => void;
}

export function RelatedEntryPicker({
  entries,
  selectedIds,
  currentEntryId,
  onChange,
}: RelatedEntryPickerProps) {
  const candidates = entries
    .filter((e) => e.id !== currentEntryId)
    .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>关联条目</Label>
      {candidates.length === 0 ? (
        <p className="text-sm text-muted-foreground">项目中暂无其他条目可关联</p>
      ) : (
        <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-input bg-card/50 p-2">
          {candidates.map((entry) => {
            const checked = selectedIds.includes(entry.id);
            return (
              <label
                key={entry.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/60",
                  checked && "bg-primary/5",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(entry.id)}
                  className="rounded border-input"
                />
                <span className="text-base leading-none">{ENTRY_TYPE_ICONS[entry.type]}</span>
                <span className="min-w-0 flex-1 truncate">{entry.title || "未命名条目"}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {ENTRY_TYPE_LABELS[entry.type]}
                </span>
              </label>
            );
          })}
        </div>
      )}
      <p className="text-xs text-muted-foreground">选中的条目将在详情页「相关条目」中展示</p>
    </div>
  );
}
