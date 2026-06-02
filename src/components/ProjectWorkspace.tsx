"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CharacterRelation, Entry, EntryFormData, EntryType, RelationDirection, RelationStatus, RelationType } from "@/types";
import { ENTRY_TYPE_LABELS, ENTRY_TYPES } from "@/types";
import { filterEntries, getAllTags } from "@/lib/entry-filters";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { EntryList } from "@/components/EntryList";
import { EntryDetail } from "@/components/EntryDetail";
import { EntryEditor } from "@/components/EntryEditor";
import { CharacterRelationDialog } from "@/components/CharacterRelationDialog";
import { BackToTopButton } from "@/components/BackToTopButton";

type PanelMode = "view" | "create" | "edit";

interface ProjectWorkspaceProps {
  projectId: string;
}

export function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
  const router = useRouter();
  const {
    hydrated,
    data,
    getProject,
    getEntriesByType,
    getProjectEntries,
    getRelatedEntries,
    countEntriesByType,
    addEntry,
    editEntry,
    removeEntry,
    addRelation,
    editRelation,
    removeRelation,
    getRelationsByCharacter,
  } = useStore();

  const [activeType, setActiveType] = useState<EntryType>("character");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [relationDialog, setRelationDialog] = useState<{
    open: boolean;
    editingRelation: CharacterRelation | null;
  }>({ open: false, editingRelation: null });

  const [mobilePanel, setMobilePanel] = useState<"list" | "detail" | "edit">("list");

  const searchParams = useSearchParams();
  const characterParam = searchParams.get("character");
  const eventParam = searchParams.get("event");
  const entryParam = searchParams.get("entry");
  const processedParamRef = useRef<string | null>(null);
  const eventParamRef = useRef<string | null>(null);
  const entryParamRef = useRef<string | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated || !characterParam || processedParamRef.current === characterParam) return;

    const entry = data.entries.find(
      (e) =>
        e.id === characterParam &&
        e.projectId === projectId &&
        e.type === "character",
    );

    if (entry) {
      processedParamRef.current = characterParam;
      setActiveType("character");
      setSelectedEntryId(entry.id);
      setPanelMode("view");
      setActiveTag(null);
      setSearchQuery("");
      router.replace(`/project/${projectId}`);
    }
  }, [hydrated, characterParam, data.entries, projectId, router]);

  useEffect(() => {
    if (!hydrated || !eventParam || eventParamRef.current === eventParam) return;

    const entry = data.entries.find(
      (e) =>
        e.id === eventParam &&
        e.projectId === projectId &&
        e.type === "event",
    );

    if (entry) {
      eventParamRef.current = eventParam;
      setActiveType("event");
      setSelectedEntryId(entry.id);
      setPanelMode("view");
      setActiveTag(null);
      setSearchQuery("");
      setMobilePanel("detail");
      router.replace(`/project/${projectId}`);
    }
  }, [hydrated, eventParam, data.entries, projectId, router]);

  useEffect(() => {
    if (!hydrated || !entryParam || entryParamRef.current === entryParam) return;

    const entry = data.entries.find(
      (e) => e.id === entryParam && e.projectId === projectId,
    );

    if (entry) {
      entryParamRef.current = entryParam;
      setActiveType(entry.type);
      setSelectedEntryId(entry.id);
      setPanelMode("view");
      setActiveTag(null);
      setSearchQuery("");
      setMobilePanel("detail");
      router.replace(`/project/${projectId}`);
    }
  }, [hydrated, entryParam, data.entries, projectId, router]);

  const project = getProject(projectId);
  const typeEntries = useMemo(
    () => getEntriesByType(projectId, activeType),
    [getEntriesByType, projectId, activeType],
  );

  const availableTags = useMemo(() => getAllTags(typeEntries), [typeEntries]);

  const entries = useMemo(
    () => filterEntries(typeEntries, { search: searchQuery, tag: activeTag }),
    [typeEntries, searchQuery, activeTag],
  );

  const projectEntries = useMemo(() => getProjectEntries(projectId), [getProjectEntries, projectId]);

  const selectedEntry = useMemo(
    () =>
      data.entries.find((e) => e.id === selectedEntryId && e.projectId === projectId) ?? null,
    [data.entries, selectedEntryId, projectId],
  );

  const relatedEntries = useMemo(
    () => (selectedEntry ? getRelatedEntries(selectedEntry) : []),
    [selectedEntry, getRelatedEntries],
  );

  const characterRelations = useMemo(
    () =>
      selectedEntry && selectedEntry.type === "character"
        ? getRelationsByCharacter(projectId, selectedEntry.id)
        : [],
    [selectedEntry, projectId, getRelationsByCharacter],
  );

  const characterEntries = useMemo(
    () => data.entries.filter((e) => e.type === "character" && e.projectId === projectId),
    [data.entries, projectId],
  );

  const handleTypeChange = useCallback((type: EntryType) => {
    setActiveType(type);
    setSelectedEntryId(null);
    setPanelMode("view");
    setActiveTag(null);
    setMobilePanel("list");
  }, []);

  const handleSelectEntry = useCallback((entry: Entry) => {
    setSelectedEntryId(entry.id);
    setPanelMode("view");
    setMobilePanel("detail");
  }, []);

  const handleSelectRelated = useCallback((entry: Entry) => {
    setActiveType(entry.type);
    setSelectedEntryId(entry.id);
    setPanelMode("view");
    setActiveTag(null);
    setSearchQuery("");
    setMobilePanel("detail");
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedEntryId(null);
    setPanelMode("create");
    setMobilePanel("edit");
  }, []);

  const handleEdit = useCallback(() => {
    setPanelMode("edit");
    setMobilePanel("edit");
  }, []);

  const handleSave = useCallback(
    (formData: EntryFormData) => {
      if (panelMode === "create") {
        const entry = addEntry(projectId, formData);
        setActiveType(formData.type);
        setSelectedEntryId(entry.id);
      } else if (selectedEntry) {
        editEntry(selectedEntry.id, formData);
        if (formData.type !== activeType) {
          setActiveType(formData.type);
        }
      }
      setPanelMode("view");
      setMobilePanel("detail");
    },
    [panelMode, addEntry, projectId, selectedEntry, editEntry, activeType],
  );

  const handleDelete = useCallback(() => {
    if (!selectedEntry) return;
    if (!window.confirm(`确定删除「${selectedEntry.title}」吗？此操作不可撤销。`)) return;
    removeEntry(selectedEntry.id);
    setSelectedEntryId(null);
    setPanelMode("view");
    setMobilePanel("list");
  }, [selectedEntry, removeEntry]);

  const handleCancel = useCallback(() => {
    setPanelMode("view");
  }, []);

  const handleMobileBack = useCallback(() => {
    if (panelMode === "create") {
      setPanelMode("view");
      setSelectedEntryId(null);
      setMobilePanel("list");
    } else if (panelMode === "edit") {
      setPanelMode("view");
      setMobilePanel("detail");
    } else {
      setSelectedEntryId(null);
      setMobilePanel("list");
    }
  }, [panelMode]);

  const handleAddRelation = useCallback(() => {
    setRelationDialog({ open: true, editingRelation: null });
  }, []);

  const handleEditRelation = useCallback((relationId: string) => {
    const relation = data.characterRelations.find((r) => r.id === relationId) ?? null;
    setRelationDialog({ open: true, editingRelation: relation });
  }, [data.characterRelations]);

  const handleDeleteRelation = useCallback(
    (relationId: string) => {
      if (!window.confirm("确定删除此关系吗？")) return;
      removeRelation(relationId);
    },
    [removeRelation],
  );

  const handleSaveRelation = useCallback(
    (
      input: {
        projectId: string;
        fromCharacterId: string;
        toCharacterId: string;
        relationType: RelationType;
        customLabel: string;
        direction: RelationDirection;
        status: RelationStatus;
        note: string;
      },
      editRelationId?: string,
    ) => {
      if (editRelationId) {
        editRelation(editRelationId, {
          relationType: input.relationType,
          customLabel: input.customLabel,
          direction: input.direction,
          status: input.status,
          note: input.note,
        });
      } else {
        addRelation(input);
      }
    },
    [addRelation, editRelation],
  );

  const handleNavigateToCharacter = useCallback(
    (entryId: string) => {
      setActiveType("character");
      setSelectedEntryId(entryId);
      setPanelMode("view");
      setActiveTag(null);
      setSearchQuery("");
      setMobilePanel("detail");
    },
    [],
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        正在加载设定档案...
      </div>
    );
  }

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
    <div className="flex min-h-dvh lg:h-screen flex-col lg:overflow-hidden">
      <TopBar
        project={project}
        showRelationsLink
        relationsHref={`/project/${projectId}/relationships`}
        showTimelineLink
        timelineHref={`/project/${projectId}/timeline`}
        showDashboardLink
        dashboardHref={`/project/${projectId}/dashboard`}
        showMapLink
        mapHref={`/project/${projectId}/map`}
      />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <Sidebar
          project={project}
          activeType={activeType}
          onTypeChange={handleTypeChange}
          onCreateEntry={handleCreate}
          countByType={(type) => countEntriesByType(projectId, type)}
          onNavigateToRelations={() => router.push(`/project/${projectId}/relationships`)}
          onNavigateToTimeline={() => router.push(`/project/${projectId}/timeline`)}
          onNavigateToDashboard={() => router.push(`/project/${projectId}/dashboard`)}
          onNavigateToMap={() => router.push(`/project/${projectId}/map`)}
        />

        <section
          className={cn(
            "flex min-h-0 flex-1 flex-col bg-background/50",
            mobilePanel !== "list" && "hidden",
            "lg:flex lg:border-r lg:border-border/80",
          )}
        >
          <div className="flex items-center justify-between gap-2 border-b border-border/80 px-3 py-2 lg:hidden">
            <select
              value={activeType}
              onChange={(e) => handleTypeChange(e.target.value as EntryType)}
              className="h-8 rounded-lg border border-input bg-card px-2 text-sm font-medium"
            >
              {ENTRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ENTRY_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-sm"
            >
              新建
            </button>
          </div>
          <EntryList
            entries={entries}
            allEntriesForTags={typeEntries}
            activeType={activeType}
            selectedEntryId={selectedEntryId}
            searchQuery={searchQuery}
            activeTag={activeTag}
            onSearchChange={setSearchQuery}
            onTagChange={setActiveTag}
            availableTags={availableTags}
            onSelect={handleSelectEntry}
            onCreate={handleCreate}
          />
        </section>

        <aside
          ref={mainContentRef}
          className={cn(
            "flex min-h-0 w-full lg:w-[460px] shrink-0 flex-col border-l border-border/80 bg-card/30",
            mobilePanel === "list" && "hidden",
            "lg:flex",
          )}
        >
          <div className="flex items-center justify-between border-b border-border/80 px-3 py-2 lg:hidden">
            <button
              type="button"
              onClick={handleMobileBack}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              ← 返回
            </button>
            {panelMode !== "view" ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (panelMode === "create") {
                      setPanelMode("view");
                      setMobilePanel("list");
                    } else {
                      setPanelMode("view");
                      setMobilePanel("detail");
                    }
                  }}
                  className="inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-sm"
                >
                  取消
                </button>
              </div>
            ) : null}
          </div>
          {panelMode === "view" ? (
            <EntryDetail
              entry={selectedEntry}
              projectEntries={projectEntries}
              relatedEntries={relatedEntries}
              onEdit={handleEdit}
              onSelectRelated={handleSelectRelated}
              onSelectEntry={handleSelectRelated}
              onTagClick={setActiveTag}
              characterRelations={characterRelations}
              allCharacterEntries={characterEntries}
              onAddRelation={handleAddRelation}
              onEditRelation={handleEditRelation}
              onDeleteRelation={handleDeleteRelation}
              onNavigateToCharacter={handleNavigateToCharacter}
            />
          ) : (
            <EntryEditor
              entry={panelMode === "edit" ? selectedEntry : null}
              defaultType={activeType}
              mode={panelMode}
              projectEntries={projectEntries}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={panelMode === "edit" ? handleDelete : undefined}
            />
          )}
        </aside>
      </div>

      <CharacterRelationDialog
        open={relationDialog.open}
        onOpenChange={(open) => setRelationDialog({ open, editingRelation: open ? relationDialog.editingRelation : null })}
        editingRelation={relationDialog.editingRelation}
        currentCharacterId={selectedEntry?.id ?? ""}
        projectId={projectId}
        characterEntries={characterEntries}
        existingRelations={data.characterRelations.filter((r) => r.projectId === projectId)}
        onSave={handleSaveRelation}
      />

      <BackToTopButton scrollContainerRef={mainContentRef} />
    </div>
  );
}
