import type { Entry, LocationProfile } from "@/types";
import { LOCATION_CATEGORIES, LOCATION_STATUSES } from "@/types";
import { normalizeMapCoordinate } from "@/lib/map-coordinates";

export function createEmptyLocationProfile(): LocationProfile {
  return {
    locationCategory: "",
    status: "",
    parentLocationId: "",
    governingFactionId: "",
    mapX: 0,
    mapY: 0,
    environment: "",
    landmarks: "",
    history: "",
    access: "",
    creatorNotes: "",
  };
}

export function normalizeLocationProfile(raw: unknown): LocationProfile {
  const empty = createEmptyLocationProfile();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return empty;

  const obj = raw as Record<string, unknown>;
  const cat = typeof obj.locationCategory === "string" ? obj.locationCategory : "";

  return {
    locationCategory:
      LOCATION_CATEGORIES.includes(cat as typeof LOCATION_CATEGORIES[number]) || cat === ""
        ? (cat as LocationProfile["locationCategory"])
        : ("" as LocationProfile["locationCategory"]),
    status:
      typeof obj.status === "string" &&
      (LOCATION_STATUSES.includes(obj.status as typeof LOCATION_STATUSES[number]) ||
        obj.status === "")
        ? (obj.status as LocationProfile["status"])
        : ("" as LocationProfile["status"]),
    parentLocationId:
      typeof obj.parentLocationId === "string" ? obj.parentLocationId : "",
    governingFactionId:
      typeof obj.governingFactionId === "string" ? obj.governingFactionId : "",
    mapX: normalizeMapCoordinate(obj.mapX),
    mapY: normalizeMapCoordinate(obj.mapY),
    environment: typeof obj.environment === "string" ? obj.environment : "",
    landmarks: typeof obj.landmarks === "string" ? obj.landmarks : "",
    history: typeof obj.history === "string" ? obj.history : "",
    access: typeof obj.access === "string" ? obj.access : "",
    creatorNotes: typeof obj.creatorNotes === "string" ? obj.creatorNotes : "",
  };
}

export function wouldCreateLocationCycle(
  entries: Entry[],
  currentEntryId: string,
  parentLocationId: string,
): boolean {
  if (!parentLocationId) return false;
  if (parentLocationId === currentEntryId) return true;

  const visited = new Set<string>();
  let cursor: string | undefined = parentLocationId;

  while (cursor) {
    if (cursor === currentEntryId) return true;
    if (visited.has(cursor)) return true;
    visited.add(cursor);

    const parent = entries.find((e) => e.id === cursor);
    cursor = parent?.locationProfile?.parentLocationId || undefined;
  }

  return false;
}
