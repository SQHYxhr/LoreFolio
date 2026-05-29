import type { AppData, CharacterRelation, Entry, EntryType, Project } from "@/types";
import { normalizeLocationProfile } from "@/lib/location-profile";
import { normalizeFactionProfile } from "@/lib/faction-profile";
import { normalizeItemProfile } from "@/lib/item-profile";
import { normalizeTags } from "@/lib/entry-filters";
import { migrateData, loadLegacyData, STORAGE_KEY, LEGACY_STORAGE_KEY, normalizeEntry, normalizeCharacterRelation } from "@/lib/migrate";
import { generateId } from "@/lib/utils";

export { STORAGE_KEY } from "@/lib/migrate";

export function createEmptyData(): AppData {
  return { projects: [], entries: [], characterRelations: [] };
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

export type LoadDataResult =
  | { ok: true; data: AppData }
  | { ok: false; error: string; raw: string };

export function loadDataSafe(): LoadDataResult {
  if (typeof window === "undefined") {
    return { ok: true, data: createEmptyData() };
  }

  let raw: string | null = null;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = loadLegacyData();
      if (legacy) {
        saveData(legacy);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return { ok: true, data: legacy };
      }
      return { ok: true, data: createEmptyData() };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        ok: false,
        error: "本地数据读取失败。数据格式已损坏（JSON 解析错误），为避免覆盖你的原始资料，设定档案馆已停止自动保存。请导入此前导出的备份文件恢复数据。",
        raw,
      };
    }

    try {
      return { ok: true, data: migrateData(parsed) };
    } catch {
      return {
        ok: false,
        error: "本地数据读取失败。数据结构不兼容，无法完成迁移，为避免覆盖你的原始资料，设定档案馆已停止自动保存。请导入此前导出的备份文件恢复数据。",
        raw,
      };
    }
  } catch {
    return {
      ok: false,
      error: "本地数据读取失败。为避免覆盖你的原始资料，设定档案馆已停止自动保存当前空数据。请导入此前导出的备份文件恢复数据。",
      raw: raw ?? "",
    };
  }
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
  | "locationProfile"
  | "factionProfile"
  | "itemProfile"
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

  if (input.type === "location" && input.locationProfile) {
    return {
      ...fields,
      locationProfile: normalizeLocationProfile(input.locationProfile),
    };
  }

  if (input.type === "faction" && input.factionProfile) {
    return {
      ...fields,
      factionProfile: normalizeFactionProfile(input.factionProfile),
    };
  }

  if (input.type === "item" && input.itemProfile) {
    return {
      ...fields,
      itemProfile: normalizeItemProfile(input.itemProfile),
    };
  }

  return fields;
}

function clearStructuredReferences(
  data: AppData,
  entryId: string,
  oldType: EntryType | undefined,
): AppData {
  let { entries, characterRelations } = data;

  if (oldType === "location") {
    entries = entries.map((e) => {
      if (e.type === "character" && e.characterProfile?.locationId === entryId) {
        return { ...e, characterProfile: { ...e.characterProfile, locationId: "" } };
      }
      if (e.type === "location" && e.locationProfile?.parentLocationId === entryId) {
        return { ...e, locationProfile: { ...e.locationProfile, parentLocationId: "" } };
      }
      if (e.type === "faction" && e.factionProfile?.headquartersLocationId === entryId) {
        return { ...e, factionProfile: { ...e.factionProfile, headquartersLocationId: "" } };
      }
      if (e.type === "item" && e.itemProfile?.currentLocationId === entryId) {
        return { ...e, itemProfile: { ...e.itemProfile, currentLocationId: "" } };
      }
      return e;
    });
  }

  if (oldType === "faction") {
    entries = entries.map((e) => {
      if (e.type === "character" && e.characterProfile?.factionId === entryId) {
        return { ...e, characterProfile: { ...e.characterProfile, factionId: "" } };
      }
      if (e.type === "location" && e.locationProfile?.governingFactionId === entryId) {
        return { ...e, locationProfile: { ...e.locationProfile, governingFactionId: "" } };
      }
      if (e.type === "faction" && e.factionProfile?.parentFactionId === entryId) {
        return { ...e, factionProfile: { ...e.factionProfile, parentFactionId: "" } };
      }
      if (e.type === "item" && e.itemProfile?.creatorFactionId === entryId) {
        return { ...e, itemProfile: { ...e.itemProfile, creatorFactionId: "" } };
      }
      return e;
    });
  }

  if (oldType === "species") {
    entries = entries.map((e) => {
      if (e.type === "character" && e.characterProfile?.speciesId === entryId) {
        return { ...e, characterProfile: { ...e.characterProfile, speciesId: "" } };
      }
      return e;
    });
  }

  if (oldType === "character") {
    entries = entries.map((e) => {
      if (e.type === "item" && e.itemProfile?.ownerCharacterId === entryId) {
        return { ...e, itemProfile: { ...e.itemProfile, ownerCharacterId: "" } };
      }
      return e;
    });
    characterRelations = characterRelations.filter(
      (r) => r.fromCharacterId !== entryId && r.toCharacterId !== entryId,
    );
  }

  return { ...data, entries, characterRelations };
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
    characterRelations: data.characterRelations.filter((r) => r.projectId !== projectId),
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
  let oldType: EntryType | undefined;

  const entries = data.entries.map((e) => {
    if (e.id !== entryId) return e;
    projectId = e.projectId;
    oldType = e.type;
    return normalizeEntry({
      ...e,
      ...buildEntryFields(input),
      updatedAt: now,
    });
  });

  let result: AppData = { ...data, entries };

  if (oldType && oldType !== input.type) {
    result = clearStructuredReferences(result, entryId, oldType);
  }

  return {
    ...result,
    projects: data.projects.map((p) =>
      p.id === projectId ? { ...p, updatedAt: now } : p,
    ),
  };
}

export function deleteEntry(data: AppData, entryId: string): AppData {
  const entry = data.entries.find((e) => e.id === entryId);
  const now = new Date().toISOString();

  const cleaned = clearStructuredReferences(data, entryId, entry?.type);

  return {
    entries: cleaned.entries
      .filter((e) => e.id !== entryId)
      .map((e) =>
        e.relatedEntryIds.includes(entryId)
          ? { ...e, relatedEntryIds: e.relatedEntryIds.filter((id) => id !== entryId) }
          : e,
      ),
    characterRelations: cleaned.characterRelations.filter(
      (r) => r.fromCharacterId !== entryId && r.toCharacterId !== entryId,
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

type RelationInput = Pick<
  CharacterRelation,
  "projectId" | "fromCharacterId" | "toCharacterId" | "relationType" | "customLabel" | "direction" | "status" | "note"
>;

export function createCharacterRelation(
  data: AppData,
  input: RelationInput,
): { data: AppData; relation: CharacterRelation } {
  const now = new Date().toISOString();
  const relation = normalizeCharacterRelation({
    id: generateId(),
    projectId: input.projectId,
    fromCharacterId: input.fromCharacterId,
    toCharacterId: input.toCharacterId,
    relationType: input.relationType,
    customLabel: input.customLabel.trim(),
    direction: input.direction,
    status: input.status,
    note: input.note,
    createdAt: now,
    updatedAt: now,
  });

  return {
    data: {
      ...data,
      characterRelations: [relation, ...data.characterRelations],
    },
    relation,
  };
}

export function updateCharacterRelation(
  data: AppData,
  relationId: string,
  input: Partial<Pick<CharacterRelation, "relationType" | "customLabel" | "direction" | "status" | "note">>,
): AppData {
  const now = new Date().toISOString();
  return {
    ...data,
    characterRelations: data.characterRelations.map((r) =>
      r.id === relationId
        ? normalizeCharacterRelation({
            ...r,
            ...input,
            customLabel: input.customLabel !== undefined ? input.customLabel.trim() : r.customLabel,
            updatedAt: now,
          })
        : r,
    ),
  };
}

export function deleteCharacterRelation(data: AppData, relationId: string): AppData {
  return {
    ...data,
    characterRelations: data.characterRelations.filter((r) => r.id !== relationId),
  };
}

export function getCharacterRelations(
  data: AppData,
  projectId: string,
  characterId: string,
): CharacterRelation[] {
  return data.characterRelations.filter(
    (r) =>
      r.projectId === projectId &&
      (r.fromCharacterId === characterId || r.toCharacterId === characterId),
  );
}
