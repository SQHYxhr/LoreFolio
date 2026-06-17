import type { EventProfile } from "@/types";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "@/types";

export function createEmptyEventProfile(): EventProfile {
  return {
    eventCategory: "",
    status: "",
    chronology: "",
    startDateText: "",
    endDateText: "",
    timelineOrder: undefined,
    locationId: "",
    primaryFactionId: "",
    participantCharacterIds: [],
    involvedFactionIds: [],
    relatedItemIds: [],
    cause: "",
    process: "",
    result: "",
    impact: "",
    aftermath: "",
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

export function normalizeEventProfile(raw: unknown): EventProfile {
  const empty = createEmptyEventProfile();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return empty;

  const obj = raw as Record<string, unknown>;
  const cat = typeof obj.eventCategory === "string" ? obj.eventCategory : "";

  return {
    eventCategory:
      EVENT_CATEGORIES.includes(cat as (typeof EVENT_CATEGORIES)[number]) || cat === ""
        ? (cat as EventProfile["eventCategory"])
        : ("" as EventProfile["eventCategory"]),
    status:
      typeof obj.status === "string" &&
      (EVENT_STATUSES.includes(obj.status as (typeof EVENT_STATUSES)[number]) ||
        obj.status === "")
        ? (obj.status as EventProfile["status"])
        : ("" as EventProfile["status"]),
    chronology: typeof obj.chronology === "string" ? obj.chronology : "",
    startDateText: typeof obj.startDateText === "string" ? obj.startDateText : "",
    endDateText: typeof obj.endDateText === "string" ? obj.endDateText : "",
    timelineOrder:
      typeof obj.timelineOrder === "number" && Number.isFinite(obj.timelineOrder)
        ? obj.timelineOrder
        : undefined,
    locationId: typeof obj.locationId === "string" ? obj.locationId : "",
    primaryFactionId:
      typeof obj.primaryFactionId === "string" ? obj.primaryFactionId : "",
    participantCharacterIds: normalizeIdArray(obj.participantCharacterIds),
    involvedFactionIds: normalizeIdArray(obj.involvedFactionIds),
    relatedItemIds: normalizeIdArray(obj.relatedItemIds),
    cause: typeof obj.cause === "string" ? obj.cause : "",
    process: typeof obj.process === "string" ? obj.process : "",
    result: typeof obj.result === "string" ? obj.result : "",
    impact: typeof obj.impact === "string" ? obj.impact : "",
    aftermath: typeof obj.aftermath === "string" ? obj.aftermath : "",
    creatorNotes: typeof obj.creatorNotes === "string" ? obj.creatorNotes : "",
  };
}
