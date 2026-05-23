"use client";

import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from "@xyflow/react";
import type { RelationStatus, RelationType } from "@/types";
import { RELATION_TYPE_LABELS } from "@/types";
import { RELATION_EDGE_COLORS } from "@/lib/relation-colors";

interface RelationshipGraphEdgeData {
  relationType: RelationType;
  label: string;
  direction: "directed" | "mutual";
  status: RelationStatus;
}

export default function RelationshipGraphEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as RelationshipGraphEdgeData | undefined;
  const color = edgeData ? RELATION_EDGE_COLORS[edgeData.relationType] : "#9ca3af";
  const label = edgeData ? edgeData.label || RELATION_TYPE_LABELS[edgeData.relationType] : "";
  const dashArray =
    edgeData?.status === "past" ? "5,5" : edgeData?.status === "ambiguous" ? "3,3" : undefined;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: color, strokeWidth: selected ? 2.5 : 1.5, strokeDasharray: dashArray }}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute rounded-full border border-border/70 bg-card px-2 py-0.5 text-[10px] leading-none shadow-sm"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
