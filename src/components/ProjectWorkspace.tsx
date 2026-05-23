"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Entry, EntryFormData, EntryType } from "@/types";
import { filterEntries, getAllTags } from "@/lib/entry-filters";
import { useStore } from "@/hooks/use-store";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { EntryList } from "@/components/EntryList";
import { EntryDetail } from "@/components/EntryDetail";
import { EntryEditor } from "@/components/EntryEditor";

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
  } = useStore();

  const [activeType, setActiveType] = useState<EntryType>("character");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

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

  const handleTypeChange = useCallback((type: EntryType) => {
    setActiveType(type);
    setSelectedEntryId(null);
    setPanelMode("view");
    setActiveTag(null);
  }, []);

  const handleSelectEntry = useCallback((entry: Entry) => {
    setSelectedEntryId(entry.id);
    setPanelMode("view");
  }, []);

  const handleSelectRelated = useCallback((entry: Entry) => {
    setActiveType(entry.type);
    setSelectedEntryId(entry.id);
    setPanelMode("view");
    setActiveTag(null);
    setSearchQuery("");
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedEntryId(null);
    setPanelMode("create");
  }, []);

  const handleEdit = useCallback(() => {
    setPanelMode("edit");
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
    },
    [panelMode, addEntry, projectId, selectedEntry, editEntry, activeType],
  );

  const handleDelete = useCallback(() => {
    if (!selectedEntry) return;
    if (!window.confirm(`确定删除「${selectedEntry.title}」吗？此操作不可撤销。`)) return;
    removeEntry(selectedEntry.id);
    setSelectedEntryId(null);
    setPanelMode("view");
  }, [selectedEntry, removeEntry]);

  const handleCancel = useCallback(() => {
    setPanelMode("view");
  }, []);

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
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar project={project} />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          project={project}
          activeType={activeType}
          onTypeChange={handleTypeChange}
          onCreateEntry={handleCreate}
          countByType={(type) => countEntriesByType(projectId, type)}
        />
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
        {panelMode === "view" ? (
          <EntryDetail
            entry={selectedEntry}
            projectEntries={projectEntries}
            relatedEntries={relatedEntries}
            onEdit={handleEdit}
            onSelectRelated={handleSelectRelated}
            onSelectEntry={handleSelectRelated}
            onTagClick={setActiveTag}
          />
        ) : (
          <aside className="flex h-full w-[460px] shrink-0 flex-col border-l border-border/80 bg-card/30">
            <EntryEditor
              entry={panelMode === "edit" ? selectedEntry : null}
              defaultType={activeType}
              mode={panelMode}
              projectEntries={projectEntries}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={panelMode === "edit" ? handleDelete : undefined}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
