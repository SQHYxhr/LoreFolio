import type { AppData, Entry } from "@/types";
import { ENTRY_IMAGE_FIELDS } from "@/types";
import { normalizeCharacterProfile } from "@/lib/character-profile";

export const STORAGE_KEY = "world-archive-v2";
export const LEGACY_STORAGE_KEY = "world-archive-v1";

export function normalizeEntry(entry: Partial<Entry> & Pick<Entry, "id" | "projectId" | "type">): Entry {
  const base: Entry = {
    id: entry.id,
    projectId: entry.projectId,
    type: entry.type,
    title: entry.title ?? "",
    summary: entry.summary ?? "",
    content: entry.content ?? "",
    coverImage: entry.coverImage ?? ENTRY_IMAGE_FIELDS.coverImage,
    galleryImages: entry.galleryImages ?? [...ENTRY_IMAGE_FIELDS.galleryImages],
    imageAltMap: entry.imageAltMap ?? { ...ENTRY_IMAGE_FIELDS.imageAltMap },
    createdAt: entry.createdAt ?? new Date().toISOString(),
    updatedAt: entry.updatedAt ?? new Date().toISOString(),
    isFavorite: entry.isFavorite ?? false,
    isPinned: entry.isPinned ?? false,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    relatedEntryIds: Array.isArray(entry.relatedEntryIds) ? entry.relatedEntryIds : [],
  };

  if (entry.type === "character") {
    return {
      ...base,
      characterProfile: normalizeCharacterProfile(entry.characterProfile),
    };
  }

  return base;
}

export function migrateData(raw: unknown): AppData {
  if (!raw || typeof raw !== "object") {
    return { projects: [], entries: [] };
  }

  const data = raw as Partial<AppData>;
  return {
    projects: Array.isArray(data.projects) ? data.projects : [],
    entries: Array.isArray(data.entries)
      ? data.entries.map((e) => normalizeEntry(e as Partial<Entry> & Pick<Entry, "id" | "projectId" | "type">))
      : [],
  };
}

export function loadLegacyData(): AppData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    return migrateData(JSON.parse(raw));
  } catch {
    return null;
  }
}
