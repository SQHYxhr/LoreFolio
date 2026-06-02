import type { AppData, CharacterRelation, Entry } from "@/types";
import { RELATION_TYPES, type RelationType } from "@/types";
import { ENTRY_IMAGE_FIELDS } from "@/types";
import { normalizeCharacterProfile } from "@/lib/character-profile";
import { normalizeLocationProfile } from "@/lib/location-profile";
import { normalizeFactionProfile } from "@/lib/faction-profile";
import { normalizeItemProfile } from "@/lib/item-profile";
import { normalizeEventProfile } from "@/lib/event-profile";
import { normalizeSpeciesProfile } from "@/lib/species-profile";
import { normalizeLoreProfile } from "@/lib/lore-profile";

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

  if (entry.type === "location" && entry.locationProfile) {
    return {
      ...base,
      locationProfile: normalizeLocationProfile(entry.locationProfile),
    };
  }

  if (entry.type === "faction" && entry.factionProfile) {
    return {
      ...base,
      factionProfile: normalizeFactionProfile(entry.factionProfile),
    };
  }

  if (entry.type === "item" && entry.itemProfile) {
    return {
      ...base,
      itemProfile: normalizeItemProfile(entry.itemProfile),
    };
  }

  if (entry.type === "event" && entry.eventProfile) {
    return {
      ...base,
      eventProfile: normalizeEventProfile(entry.eventProfile),
    };
  }

  if (entry.type === "species" && entry.speciesProfile) {
    return {
      ...base,
      speciesProfile: normalizeSpeciesProfile(entry.speciesProfile),
    };
  }

  if (entry.type === "lore" && entry.loreProfile) {
    return {
      ...base,
      loreProfile: normalizeLoreProfile(entry.loreProfile),
    };
  }

  return base;
}

export function normalizeCharacterRelation(
  raw: Partial<CharacterRelation> & Pick<CharacterRelation, "id" | "projectId">,
): CharacterRelation {
  return {
    id: raw.id,
    projectId: raw.projectId,
    fromCharacterId: typeof raw.fromCharacterId === "string" ? raw.fromCharacterId : "",
    toCharacterId: typeof raw.toCharacterId === "string" ? raw.toCharacterId : "",
    relationType: RELATION_TYPES.includes(raw.relationType as RelationType)
      ? (raw.relationType as RelationType)
      : "unknown",
    customLabel: typeof raw.customLabel === "string" ? raw.customLabel.trim() : "",
    direction: raw.direction === "mutual" ? "mutual" : "directed",
    status: raw.status === "past" || raw.status === "ambiguous" ? raw.status : "current",
    note: typeof raw.note === "string" ? raw.note : "",
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  };
}

export function migrateData(raw: unknown): AppData {
  if (!raw || typeof raw !== "object") {
    return { projects: [], entries: [], characterRelations: [] };
  }

  const data = raw as Partial<AppData>;
  return {
    projects: Array.isArray(data.projects) ? data.projects : [],
    entries: Array.isArray(data.entries)
      ? data.entries.map((e) => normalizeEntry(e as Partial<Entry> & Pick<Entry, "id" | "projectId" | "type">))
      : [],
    characterRelations: Array.isArray(data.characterRelations)
      ? data.characterRelations.map((r) =>
          normalizeCharacterRelation(
            r as Partial<CharacterRelation> & Pick<CharacterRelation, "id" | "projectId">,
          ),
        )
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
