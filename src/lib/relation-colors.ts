import type { RelationType } from "@/types";

export const RELATION_CARD_CLASSES: Record<RelationType, { border: string; bg: string }> = {
  friend:     { border: "border-emerald-500", bg: "bg-emerald-500/10" },
  family:     { border: "border-blue-500", bg: "bg-blue-500/10" },
  lover:      { border: "border-rose-500", bg: "bg-rose-500/10" },
  enemy:      { border: "border-red-500", bg: "bg-red-500/10" },
  mentor:     { border: "border-purple-500", bg: "bg-purple-500/10" },
  student:    { border: "border-cyan-500", bg: "bg-cyan-500/10" },
  ally:       { border: "border-teal-500", bg: "bg-teal-500/10" },
  rival:      { border: "border-orange-500", bg: "bg-orange-500/10" },
  colleague:  { border: "border-gray-500", bg: "bg-gray-500/10" },
  superior:   { border: "border-amber-500", bg: "bg-amber-500/10" },
  subordinate:{ border: "border-slate-500", bg: "bg-slate-500/10" },
  unknown:    { border: "border-muted-foreground/30", bg: "bg-muted/30" },
};

export const RELATION_EDGE_COLORS: Record<RelationType, string> = {
  friend:     "#10b981",
  family:     "#3b82f6",
  lover:      "#f43f5e",
  enemy:      "#ef4444",
  mentor:     "#a855f7",
  student:    "#06b6d4",
  ally:       "#14b8a6",
  rival:      "#f97316",
  colleague:  "#6b7280",
  superior:   "#f59e0b",
  subordinate:"#64748b",
  unknown:    "#9ca3af",
};
