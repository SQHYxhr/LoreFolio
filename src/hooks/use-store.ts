"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppData, CharacterRelation, Entry, EntryFormData, EntryType, Project, ProjectFormData } from "@/types";
import { seedIfEmpty } from "@/lib/demo-data";
import {
  createCharacterRelation,
  createEmptyData,
  createEntry,
  createProject,
  deleteCharacterRelation,
  deleteEntry,
  deleteProject,
  getCharacterRelations,
  loadDataSafe,
  saveData,
  updateCharacterRelation,
  updateEntry,
  updateProject,
} from "@/lib/storage";

export function useStore() {
  const [data, setData] = useState<AppData>(createEmptyData);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const result = loadDataSafe();
    if (!result.ok) {
      setData(createEmptyData());
      setStorageError(result.error);
      setHydrated(true);
      return;
    }
    const loaded = seedIfEmpty(result.data);
    setData(loaded);
    saveData(loaded);
    setHydrated(true);
  }, []);

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveData(next);
  }, []);

  const replaceData = useCallback((nextData: AppData) => {
    saveData(nextData);
    setData(nextData);
    setStorageError(null);
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

  const addRelation = useCallback(
    (
      input: Parameters<typeof createCharacterRelation>[1],
    ): CharacterRelation => {
      const { data: next, relation } = createCharacterRelation(data, input);
      persist(next);
      return relation;
    },
    [data, persist],
  );

  const editRelation = useCallback(
    (
      relationId: string,
      input: Parameters<typeof updateCharacterRelation>[2],
    ) => {
      persist(updateCharacterRelation(data, relationId, input));
    },
    [data, persist],
  );

  const removeRelation = useCallback(
    (relationId: string) => {
      persist(deleteCharacterRelation(data, relationId));
    },
    [data, persist],
  );

  const getRelationsByCharacter = useCallback(
    (projectId: string, characterId: string) =>
      getCharacterRelations(data, projectId, characterId),
    [data],
  );

  return {
    data,
    hydrated,
    storageError,
    projects: data.projects,
    replaceData,
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
    addRelation,
    editRelation,
    removeRelation,
    getRelationsByCharacter,
  };
}
