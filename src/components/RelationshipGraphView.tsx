"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GitFork } from "lucide-react";
import type { RelationType } from "@/types";
import { getCharacterDisplayName } from "@/lib/character-profile";
import { useStore } from "@/hooks/use-store";
import { TopBar } from "@/components/TopBar";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { RelationshipGraphControls } from "@/components/RelationshipGraphControls";
import { RelationshipGraphCanvas } from "@/components/RelationshipGraphCanvas";
import { RelationshipGraphPanel } from "@/components/RelationshipGraphPanel";

interface RelationshipGraphViewProps {
  projectId: string;
}

export function RelationshipGraphView({ projectId }: RelationshipGraphViewProps) {
  const router = useRouter();
  const { hydrated, data, getProject } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [relationTypeFilter, setRelationTypeFilter] = useState<RelationType | null>(null);
  const [hideIsolated, setHideIsolated] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const project = getProject(projectId);

  const characterEntries = useMemo(
    () => data.entries.filter((e) => e.type === "character" && e.projectId === projectId),
    [data.entries, projectId],
  );

  const allRelations = useMemo(
    () => data.characterRelations.filter((r) => r.projectId === projectId),
    [data.characterRelations, projectId],
  );

  const { filteredEntryIds, filteredRelations } = useMemo(() => {
    let entries = characterEntries;
    let relations = allRelations;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchingIds = new Set(
        entries
          .filter((e) => {
            const displayName = getCharacterDisplayName(e).toLowerCase();
            const title = e.title.toLowerCase();
            const aliases =
              e.type === "character" && e.characterProfile
                ? e.characterProfile.aliases.join(" ").toLowerCase()
                : "";
            return title.includes(q) || displayName.includes(q) || aliases.includes(q);
          })
          .map((e) => e.id),
      );

      const adjacentIds = new Set<string>();
      for (const r of relations) {
        if (matchingIds.has(r.fromCharacterId)) adjacentIds.add(r.toCharacterId);
        if (matchingIds.has(r.toCharacterId)) adjacentIds.add(r.fromCharacterId);
      }

      const visibleIds = new Set([...matchingIds, ...adjacentIds]);
      entries = entries.filter((e) => visibleIds.has(e.id));
      relations = relations.filter(
        (r) => visibleIds.has(r.fromCharacterId) && visibleIds.has(r.toCharacterId),
      );
    }

    if (relationTypeFilter) {
      relations = relations.filter((r) => r.relationType === relationTypeFilter);
      const relatedIds = new Set<string>();
      for (const r of relations) {
        relatedIds.add(r.fromCharacterId);
        relatedIds.add(r.toCharacterId);
      }
      entries = entries.filter((e) => relatedIds.has(e.id));
    }

    if (hideIsolated) {
      const connectedIds = new Set<string>();
      for (const r of relations) {
        connectedIds.add(r.fromCharacterId);
        connectedIds.add(r.toCharacterId);
      }
      entries = entries.filter((e) => connectedIds.has(e.id));
    }

    return {
      filteredEntryIds: new Set(entries.map((e) => e.id)),
      filteredRelations: relations,
    };
  }, [characterEntries, allRelations, searchQuery, relationTypeFilter, hideIsolated]);

  const selectedNode = useMemo(
    () => (selectedNodeId ? characterEntries.find((e) => e.id === selectedNodeId) ?? null : null),
    [selectedNodeId, characterEntries],
  );

  const selectedEdgeData = useMemo(() => {
    if (!selectedEdgeId) return null;
    const relation = allRelations.find((r) => r.id === selectedEdgeId);
    if (!relation) return null;
    return {
      relation,
      fromEntry: characterEntries.find((e) => e.id === relation.fromCharacterId) ?? null,
      toEntry: characterEntries.find((e) => e.id === relation.toCharacterId) ?? null,
    };
  }, [selectedEdgeId, allRelations, characterEntries]);

  const handleNodeClick = useCallback((entryId: string) => {
    setSelectedNodeId(entryId);
    setSelectedEdgeId(null);
  }, []);

  const handleEdgeClick = useCallback(
    (relationId: string) => {
      setSelectedEdgeId(relationId);
      setSelectedNodeId(null);
    },
    [],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, []);

  const handleNavigateToCharacter = useCallback(
    (entryId: string) => {
      router.push(`/project/${projectId}?character=${entryId}`);
    },
    [router, projectId],
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        正在加载关系图谱...
      </div>
    );
  }

  const hasSelection = Boolean(selectedNodeId || selectedEdgeId);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">未找到该世界项目</p>
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() => router.push("/")}
        >
          返回项目列表
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden lg:h-screen">
      <TopBar
        project={project}
        backHref={`/project/${projectId}`}
        backLabel="返回项目"
      />

      {characterEntries.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4">
          <EmptyState
            icon={GitFork}
            title="该项目还没有角色条目"
            description="在项目中创建角色后，可在此页查看角色关系图谱。"
            action={
              <Button onClick={() => router.push(`/project/${projectId}`)}>返回项目</Button>
            }
          />
        </div>
      ) : allRelations.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-border/80 bg-amber-50/40 px-4 py-2 text-center text-sm text-muted-foreground">
            角色之间暂无关系记录。在角色详情页中添加关系后，将在此处显示关系连线。
          </div>
          <div className="shrink-0">
            <RelationshipGraphControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              relationTypeFilter={relationTypeFilter}
              onRelationTypeFilterChange={setRelationTypeFilter}
              hideIsolated={hideIsolated}
              onHideIsolatedChange={setHideIsolated}
            />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <RelationshipGraphCanvas
              characterEntries={characterEntries}
              allRelations={allRelations}
              filteredEntryIds={filteredEntryIds}
              filteredRelations={filteredRelations}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onPaneClick={handlePaneClick}
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0">
              <RelationshipGraphControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                relationTypeFilter={relationTypeFilter}
                onRelationTypeFilterChange={setRelationTypeFilter}
                hideIsolated={hideIsolated}
                onHideIsolatedChange={setHideIsolated}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              {filteredEntryIds.size === 0 ? (
                <div className="flex h-full items-center justify-center px-4">
                  <EmptyState
                    icon={GitFork}
                    title="没有匹配的角色或关系"
                    description="试试调整搜索词或清除筛选条件。"
                    action={
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setRelationTypeFilter(null);
                          setHideIsolated(false);
                        }}
                      >
                        清除筛选
                      </Button>
                    }
                  />
                </div>
              ) : (
                <RelationshipGraphCanvas
                  characterEntries={characterEntries}
                  allRelations={allRelations}
                  filteredEntryIds={filteredEntryIds}
                  filteredRelations={filteredRelations}
                  onNodeClick={handleNodeClick}
                  onEdgeClick={handleEdgeClick}
                  onPaneClick={handlePaneClick}
                />
              )}
            </div>
          </div>

          {hasSelection && (
            <aside className="hidden lg:flex h-full w-[380px] shrink-0 flex-col border-l border-border/80 bg-card/30">
              <RelationshipGraphPanel
                selectedNode={selectedNode}
                selectedEdgeData={selectedEdgeData}
                onClose={handleClosePanel}
                onNavigateToCharacter={handleNavigateToCharacter}
              />
            </aside>
          )}
        </div>
      )}

      {hasSelection && (
        <div className="fixed inset-0 z-20 flex flex-col bg-card lg:hidden">
          <RelationshipGraphPanel
            selectedNode={selectedNode}
            selectedEdgeData={selectedEdgeData}
            onClose={handleClosePanel}
            onNavigateToCharacter={handleNavigateToCharacter}
          />
        </div>
      )}
    </div>
  );
}
