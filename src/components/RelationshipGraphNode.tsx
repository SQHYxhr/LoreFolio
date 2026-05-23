"use client";

import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
];

interface RelationshipGraphNodeData {
  entryId: string;
  title: string;
  displayName: string;
  coverImage: string;
  isIsolated: boolean;
}

export default function RelationshipGraphNode({
  data,
  selected,
}: {
  data: RelationshipGraphNodeData;
  selected: boolean;
}) {
  const name = data.displayName || data.title || "未命名";
  const initial = name.charAt(0);
  const colorIndex = data.entryId
    ? [...data.entryId].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length
    : 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 transition-transform",
        selected && "scale-110",
        data.isIsolated && "opacity-60",
      )}
    >
      <Handle type="source" position={Position.Top} className="!h-1 !w-1 !opacity-0" />
      <Handle type="target" position={Position.Top} className="!h-1 !w-1 !opacity-0" />

      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-border/60 shadow-sm",
          selected && "ring-2 ring-primary ring-offset-2",
        )}
      >
        {data.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.coverImage}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "flex h-full w-full items-center justify-center font-serif text-xl font-bold",
              AVATAR_COLORS[colorIndex],
            )}
          >
            {initial}
          </span>
        )}
      </div>

      <span className="max-w-[100px] truncate text-center font-serif text-xs font-semibold leading-tight">
        {name}
      </span>
    </div>
  );
}
