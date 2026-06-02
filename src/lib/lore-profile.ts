import type { LoreProfile } from "@/types";

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeIdArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const id = item.trim();
    if (id && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

export function createEmptyLoreProfile(): LoreProfile {
  return {
    loreCategory: "",
    status: "",
    coreConcept: "",
    worldRules: "",
    cosmology: "",
    historyOverview: "",
    magicSystem: "",
    technologyLevel: "",
    culture: "",
    conflicts: "",
    creatorNotes: "",
    relatedLocationIds: [],
    relatedFactionIds: [],
    relatedSpeciesIds: [],
    relatedEventIds: [],
    relatedItemIds: [],
  };
}

export function normalizeLoreProfile(input: unknown): LoreProfile {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return createEmptyLoreProfile();
  }

  const obj = input as Record<string, unknown>;

  return {
    loreCategory:
      typeof obj.loreCategory === "string" &&
      [
        "",
        "world_rule",
        "cosmology",
        "history",
        "magic_system",
        "technology",
        "culture",
        "religion",
        "conflict",
        "other",
      ].includes(obj.loreCategory)
        ? (obj.loreCategory as LoreProfile["loreCategory"])
        : ("" as LoreProfile["loreCategory"]),
    status:
      typeof obj.status === "string" &&
      ["", "draft", "stable", "deprecated", "unknown"].includes(obj.status)
        ? (obj.status as LoreProfile["status"])
        : ("" as LoreProfile["status"]),
    coreConcept: normalizeString(obj.coreConcept),
    worldRules: normalizeString(obj.worldRules),
    cosmology: normalizeString(obj.cosmology),
    historyOverview: normalizeString(obj.historyOverview),
    magicSystem: normalizeString(obj.magicSystem),
    technologyLevel: normalizeString(obj.technologyLevel),
    culture: normalizeString(obj.culture),
    conflicts: normalizeString(obj.conflicts),
    creatorNotes: normalizeString(obj.creatorNotes),
    relatedLocationIds: normalizeIdArray(obj.relatedLocationIds),
    relatedFactionIds: normalizeIdArray(obj.relatedFactionIds),
    relatedSpeciesIds: normalizeIdArray(obj.relatedSpeciesIds),
    relatedEventIds: normalizeIdArray(obj.relatedEventIds),
    relatedItemIds: normalizeIdArray(obj.relatedItemIds),
  };
}
