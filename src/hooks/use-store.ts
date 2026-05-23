"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppData, Entry, EntryFormData, EntryType, Project, ProjectFormData } from "@/types";
import { seedIfEmpty } from "@/lib/demo-data";
import {
  createEmptyData,
  createEntry,
  createProject,
  deleteEntry,
  deleteProject,
  loadData,
  saveData,
  updateEntry,
  updateProject,
} from "@/lib/storage";

export function useStore() {
  const [data, setData] = useState<AppData>(createEmptyData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = seedIfEmpty(loadData());
    setData(loaded);
    saveData(loaded);
    setHydrated(true);
  }, []);

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveData(next);
  }, []);

  const addProject = useCallback(
    (input: ProjectFormData): Project => {
      const { data: next, project } = createProject(data, input);
      persist(next);
      return project;
    },
    [data, persist],
  );

  const editProject = useCallback(
    (projectId: string, input: ProjectFormData) => {
      persist(updateProject(data, projectId, input));
    },
    [data, persist],
  );

  const removeProject = useCallback(
    (projectId: string) => {
      persist(deleteProject(data, projectId));
    },
    [data, persist],
  );

  const addEntry = useCallback(
    (projectId: string, input: EntryFormData): Entry => {
      const { data: next, entry } = createEntry(data, projectId, input);
      persist(next);
      return entry;
    },
    [data, persist],
  );

  const editEntry = useCallback(
    (entryId: string, input: EntryFormData) => {
      persist(updateEntry(data, entryId, input));
    },
    [data, persist],
  );

  const removeEntry = useCallback(
    (entryId: string) => {
      persist(deleteEntry(data, entryId));
    },
    [data, persist],
  );

  const getProject = useCallback(
    (projectId: string) => data.projects.find((p) => p.id === projectId),
    [data.projects],
  );

  const getEntriesByType = useCallback(
    (projectId: string, type: EntryType) =>
      data.entries
        .filter((e) => e.projectId === projectId && e.type === type)
        .sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }),
    [data.entries],
  );

  const countEntriesByType = useCallback(
    (projectId: string, type: EntryType) =>
      data.entries.filter((e) => e.projectId === projectId && e.type === type).length,
    [data.entries],
  );

  const getProjectEntries = useCallback(
    (projectId: string) => data.entries.filter((e) => e.projectId === projectId),
    [data.entries],
  );

  const getEntryById = useCallback(
    (entryId: string) => data.entries.find((e) => e.id === entryId),
    [data.entries],
  );

  const getRelatedEntries = useCallback(
    (entry: Entry) =>
      entry.relatedEntryIds
        .map((id) => data.entries.find((e) => e.id === id))
        .filter((e): e is Entry => Boolean(e)),
    [data.entries],
  );

  return {
    data,
    hydrated,
    projects: data.projects,
    addProject,
    editProject,
    removeProject,
    addEntry,
    editEntry,
    removeEntry,
    getProject,
    getEntriesByType,
    countEntriesByType,
    getProjectEntries,
    getEntryById,
    getRelatedEntries,
  };
}
