import type { AppData, Entry, EntryType, Project } from "@/types";
import { normalizeTags } from "@/lib/entry-filters";
import { migrateData, loadLegacyData, STORAGE_KEY, LEGACY_STORAGE_KEY, normalizeEntry } from "@/lib/migrate";
import { generateId } from "@/lib/utils";

export { STORAGE_KEY } from "@/lib/migrate";

export function createEmptyData(): AppData {
  return { projects: [], entries: [] };
}

export function loadData(): AppData {
  if (typeof window === "undefined") {
    return createEmptyData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return migrateData(JSON.parse(raw));
    }

    const legacy = loadLegacyData();
    if (legacy) {
      saveData(legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return legacy;
    }

    return createEmptyData();
  } catch {
    return createEmptyData();
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

type EntryInput = Pick<
  Entry,
  | "type"
  | "title"
  | "summary"
  | "content"
  | "coverImage"
  | "galleryImages"
  | "imageAltMap"
  | "isFavorite"
  | "isPinned"
  | "tags"
  | "relatedEntryIds"
  | "characterProfile"
>;

function buildEntryFields(input: EntryInput) {
  const fields = {
    type: input.type,
    title: input.title.trim(),
    summary: input.summary.trim(),
    content: input.content.trim(),
    coverImage: input.coverImage.trim(),
    galleryImages: input.galleryImages.filter(Boolean),
    imageAltMap: input.imageAltMap ?? {},
    isFavorite: input.isFavorite,
    isPinned: input.isPinned,
    tags: normalizeTags(input.tags),
    relatedEntryIds: [...new Set(input.relatedEntryIds.filter(Boolean))],
  };

  if (input.type === "character") {
    return {
      ...fields,
      characterProfile: input.characterProfile,
    };
  }

  return fields;
}

export function createProject(
  data: AppData,
  input: Pick<Project, "name" | "description">,
): { data: AppData; project: Project } {
  const now = new Date().toISOString();
  const project: Project = {
    id: generateId(),
    name: input.name.trim(),
    description: input.description.trim(),
    createdAt: now,
    updatedAt: now,
  };

  return {
    data: { ...data, projects: [project, ...data.projects] },
    project,
  };
}

export function updateProject(
  data: AppData,
  projectId: string,
  input: Pick<Project, "name" | "description">,
): AppData {
  const now = new Date().toISOString();
  return {
    ...data,
    projects: data.projects.map((p) =>
      p.id === projectId
        ? { ...p, name: input.name.trim(), description: input.description.trim(), updatedAt: now }
        : p,
    ),
  };
}

export function deleteProject(data: AppData, projectId: string): AppData {
  return {
    projects: data.projects.filter((p) => p.id !== projectId),
    entries: data.entries.filter((e) => e.projectId !== projectId),
  };
}

export function createEntry(
  data: AppData,
  projectId: string,
  input: EntryInput,
): { data: AppData; entry: Entry } {
  const now = new Date().toISOString();
  const entry = normalizeEntry({
    id: generateId(),
    projectId,
    ...buildEntryFields(input),
    createdAt: now,
    updatedAt: now,
  });

  return {
    data: {
      ...data,
      entries: [entry, ...data.entries],
      projects: data.projects.map((p) =>
        p.id === projectId ? { ...p, updatedAt: now } : p,
      ),
    },
    entry,
  };
}

export function updateEntry(data: AppData, entryId: string, input: EntryInput): AppData {
  const now = new Date().toISOString();
  let projectId = "";

  const entries = data.entries.map((e) => {
    if (e.id !== entryId) return e;
    projectId = e.projectId;
    return normalizeEntry({
      ...e,
      ...buildEntryFields(input),
      updatedAt: now,
    });
  });

  return {
    entries,
    projects: data.projects.map((p) =>
      p.id === projectId ? { ...p, updatedAt: now } : p,
    ),
  };
}

export function deleteEntry(data: AppData, entryId: string): AppData {
  const entry = data.entries.find((e) => e.id === entryId);
  const now = new Date().toISOString();

  return {
    entries: data.entries
      .filter((e) => e.id !== entryId)
      .map((e) =>
        e.relatedEntryIds.includes(entryId)
          ? { ...e, relatedEntryIds: e.relatedEntryIds.filter((id) => id !== entryId) }
          : e,
      ),
    projects: data.projects.map((p) =>
      p.id === entry?.projectId ? { ...p, updatedAt: now } : p,
    ),
  };
}

export function getProjectEntries(data: AppData, projectId: string, type?: EntryType): Entry[] {
  return data.entries
    .filter((e) => e.projectId === projectId && (!type || e.type === type))
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}
