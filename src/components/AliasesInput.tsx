"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AliasesInputProps {
  aliases: string[];
  onChange: (aliases: string[]) => void;
}

export function AliasesInput({ aliases, onChange }: AliasesInputProps) {
  const [input, setInput] = useState("");

  const addAlias = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || aliases.includes(trimmed)) {
      setInput("");
      return;
    }
    onChange([...aliases, trimmed]);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addAlias(input);
    } else if (e.key === "Backspace" && !input && aliases.length > 0) {
      onChange(aliases.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <Label>别名</Label>
      <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
        {aliases.map((alias) => (
          <Badge key={alias} variant="secondary" className="gap-1 pr-1 text-xs">
            {alias}
            <button
              type="button"
              onClick={() => onChange(aliases.filter((a) => a !== alias))}
              className="rounded-sm hover:bg-muted"
              aria-label={`移除别名 ${alias}`}
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
            if (input.trim()) addAlias(input);
          }}
          placeholder={aliases.length === 0 ? "输入别名后按 Enter" : ""}
          className="h-7 min-w-[60px] flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
