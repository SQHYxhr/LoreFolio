"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { normalizeTags } from "@/lib/entry-filters";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = "输入标签后按 Enter" }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const next = normalizeTags([...tags, raw]);
    if (next.length !== tags.length) onChange(next);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <Label>标签</Label>
      <div
        className={cn(
          "flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5",
          "focus-within:ring-2 focus-within:ring-ring",
        )}
      >
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-sm hover:bg-muted"
              aria-label={`移除标签 ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (input.trim()) addTag(input);
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="h-7 min-w-[80px] flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
        />
      </div>
      <p className="text-xs text-muted-foreground">按 Enter 或逗号添加，支持多个标签</p>
    </div>
  );
}
