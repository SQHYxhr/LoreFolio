"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { CharacterRelation, Entry } from "@/types";
import { RELATION_TYPE_LABELS } from "@/types";
import { RELATION_EDGE_COLORS } from "@/lib/relation-colors";
import { getCharacterDisplayName } from "@/lib/character-profile";
import RelationshipGraphNode from "@/components/RelationshipGraphNode";
import RelationshipGraphEdge from "@/components/RelationshipGraphEdge";

const nodeTypes = { characterNode: RelationshipGraphNode };
const edgeTypes = { relationEdge: RelationshipGraphEdge };

function computeCircularLayout(
  entries: Entry[],
  radius = 300,
  centerX = 400,
  centerY = 350,
): { x: number; y: number }[] {
  const count = entries.length;
  if (count === 0) return [];
  if (count === 1) return [{ x: centerX, y: centerY }];

  const angleStep = (2 * Math.PI) / count;
  return entries.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

interface RelationshipGraphCanvasProps {
  characterEntries: Entry[];
  allRelations: CharacterRelation[];
  filteredEntryIds: Set<string>;
  filteredRelations: CharacterRelation[];
  onNodeClick: (entryId: string) => void;
  onEdgeClick: (relationId: string) => void;
  onPaneClick: () => void;
}

export function RelationshipGraphCanvas({
  characterEntries,
  allRelations,
  filteredEntryIds,
  filteredRelations,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
}: RelationshipGraphCanvasProps) {
  const entryMap = useMemo(() => {
    const map = new Map<string, Entry>();
    for (const e of characterEntries) map.set(e.id, e);
    return map;
  }, [characterEntries]);

  const filteredEntries = useMemo(
    () => characterEntries.filter((e) => filteredEntryIds.has(e.id)),
    [characterEntries, filteredEntryIds],
  );

  const layoutPositions = useMemo(
    () => computeCircularLayout(filteredEntries),
    [filteredEntries],
  );

  const nodes: Node[] = useMemo(
    () =>
      filteredEntries.map((entry, i) => {
        const isIsolated = !entryMap.has(entry.id) || !allRelations.some(
          (r) => r.fromCharacterId === entry.id || r.toCharacterId === entry.id,
        );
        return {
          id: entry.id,
          type: "characterNode",
          position: layoutPositions[i] ?? { x: 0, y: 0 },
          data: {
            entryId: entry.id,
            title: entry.title,
            displayName: getCharacterDisplayName(entry),
            coverImage: entry.coverImage,
            isIsolated,
          },
        };
      }),
    [filteredEntries, layoutPositions, entryMap, allRelations],
  );

  const edges: Edge[] = useMemo(
    () =>
      filteredRelations.map((relation) => ({
        id: relation.id,
        source: relation.fromCharacterId,
        target: relation.toCharacterId,
        type: "relationEdge",
        markerEnd:
          relation.direction === "directed"
            ? { type: MarkerType.ArrowClosed, color: RELATION_EDGE_COLORS[relation.relationType] }
            : undefined,
        style: {
          stroke: RELATION_EDGE_COLORS[relation.relationType],
          strokeWidth: 1.5,
          strokeDasharray:
            relation.status === "past"
              ? "5,5"
              : relation.status === "ambiguous"
                ? "3,3"
                : undefined,
        },
        data: {
          relationId: relation.id,
          relationType: relation.relationType,
          label: relation.customLabel || RELATION_TYPE_LABELS[relation.relationType],
          direction: relation.direction,
          status: relation.status,
        },
      })),
    [filteredRelations],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick(node.id);
    },
    [onNodeClick],
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      onEdgeClick(edge.id);
    },
    [onEdgeClick],
  );

  return (
    <div className="flex-1 min-h-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
        style={{ background: "var(--xy-background-color, hsl(var(--background)))" }}
      >
        <Controls showInteractive={false} />
        <Background color="hsl(var(--border))" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
