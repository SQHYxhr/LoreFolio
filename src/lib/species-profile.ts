import type { SpeciesProfile } from "@/types";
import { SPECIES_CATEGORIES, SPECIES_STATUSES } from "@/types";

export function createEmptySpeciesProfile(): SpeciesProfile {
  return {
    speciesCategory: "",
    status: "",
    habitatLocationId: "",
    relatedFactionIds: [],
    representativeCharacterIds: [],
    appearance: "",
    physiology: "",
    abilities: "",
    culture: "",
    history: "",
    distribution: "",
    relationshipWithHumans: "",
    creatorNotes: "",
  };
}

function normalizeIdArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const id = item.trim();
    if (id && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

export function normalizeSpeciesProfile(raw: unknown): SpeciesProfile {
  const empty = createEmptySpeciesProfile();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return empty;

  const obj = raw as Record<string, unknown>;
  const cat = typeof obj.speciesCategory === "string" ? obj.speciesCategory : "";

  return {
    speciesCategory:
      SPECIES_CATEGORIES.includes(cat as (typeof SPECIES_CATEGORIES)[number]) || cat === ""
        ? (cat as SpeciesProfile["speciesCategory"])
        : ("" as SpeciesProfile["speciesCategory"]),
    status:
      typeof obj.status === "string" &&
      (SPECIES_STATUSES.includes(obj.status as (typeof SPECIES_STATUSES)[number]) ||
        obj.status === "")
        ? (obj.status as SpeciesProfile["status"])
        : ("" as SpeciesProfile["status"]),
    habitatLocationId:
      typeof obj.habitatLocationId === "string" ? obj.habitatLocationId : "",
    relatedFactionIds: normalizeIdArray(obj.relatedFactionIds),
    representativeCharacterIds: normalizeIdArray(obj.representativeCharacterIds),
    appearance: typeof obj.appearance === "string" ? obj.appearance : "",
    physiology: typeof obj.physiology === "string" ? obj.physiology : "",
    abilities: typeof obj.abilities === "string" ? obj.abilities : "",
    culture: typeof obj.culture === "string" ? obj.culture : "",
    history: typeof obj.history === "string" ? obj.history : "",
    distribution: typeof obj.distribution === "string" ? obj.distribution : "",
    relationshipWithHumans:
      typeof obj.relationshipWithHumans === "string"
        ? obj.relationshipWithHumans
        : "",
    creatorNotes: typeof obj.creatorNotes === "string" ? obj.creatorNotes : "",
  };
}
