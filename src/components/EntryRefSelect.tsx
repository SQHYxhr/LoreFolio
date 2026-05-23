"use client";

import type { Entry, EntryType } from "@/types";
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_LABELS } from "@/types";
import { Label } from "@/components/ui/label";

interface EntryRefSelectProps {
  label: string;
  value: string;
  entries: Entry[];
  filterType: EntryType;
  onChange: (entryId: string) => void;
}

export function EntryRefSelect({
  label,
  value,
  entries,
  filterType,
  onChange,
}: EntryRefSelectProps) {
  const options = entries
    .filter((e) => e.type === filterType)
    .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">未关联</option>
        {options.map((entry) => (
          <option key={entry.id} value={entry.id}>
            {ENTRY_TYPE_ICONS[entry.type]} {entry.title || "未命名条目"}
          </option>
        ))}
      </select>
      {options.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          项目中暂无{ENTRY_TYPE_LABELS[filterType]}条目，可先创建后再关联
        </p>
      ) : null}
    </div>
  );
}
