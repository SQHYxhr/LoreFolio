import type { CharacterProfile, Entry } from "@/types";

export function createEmptyCharacterProfile(): CharacterProfile {
  return {
    displayName: "",
    aliases: [],
    pronouns: "",
    ageText: "",
    gender: "",
    identity: "",
    factionId: "",
    locationId: "",
    speciesId: "",
    appearance: "",
    personality: "",
    abilities: "",
    goals: "",
    background: "",
    trivia: "",
    statusText: "",
    quote: "",
  };
}

export function normalizeCharacterProfile(
  raw: Partial<CharacterProfile> | undefined | null,
): CharacterProfile {
  const empty = createEmptyCharacterProfile();
  if (!raw || typeof raw !== "object") return empty;

  return {
    displayName: typeof raw.displayName === "string" ? raw.displayName : "",
    aliases: Array.isArray(raw.aliases)
      ? [...new Set(raw.aliases.map((a) => String(a).trim()).filter(Boolean))]
      : [],
    pronouns: typeof raw.pronouns === "string" ? raw.pronouns : "",
    ageText: typeof raw.ageText === "string" ? raw.ageText : "",
    gender: typeof raw.gender === "string" ? raw.gender : "",
    identity: typeof raw.identity === "string" ? raw.identity : "",
    factionId: typeof raw.factionId === "string" ? raw.factionId : "",
    locationId: typeof raw.locationId === "string" ? raw.locationId : "",
    speciesId: typeof raw.speciesId === "string" ? raw.speciesId : "",
    appearance: typeof raw.appearance === "string" ? raw.appearance : "",
    personality: typeof raw.personality === "string" ? raw.personality : "",
    abilities: typeof raw.abilities === "string" ? raw.abilities : "",
    goals: typeof raw.goals === "string" ? raw.goals : "",
    background: typeof raw.background === "string" ? raw.background : "",
    trivia: typeof raw.trivia === "string" ? raw.trivia : "",
    statusText: typeof raw.statusText === "string" ? raw.statusText : "",
    quote: typeof raw.quote === "string" ? raw.quote : "",
  };
}

export function getCharacterDisplayName(entry: Entry): string {
  if (entry.type !== "character") return entry.title || "未命名条目";
  const name = entry.characterProfile?.displayName?.trim();
  return name || entry.title || "未命名条目";
}

export function getCharacterSearchText(profile: CharacterProfile): string {
  return [
    profile.displayName,
    profile.aliases.join(" "),
    profile.pronouns,
    profile.ageText,
    profile.gender,
    profile.identity,
    profile.appearance,
    profile.personality,
    profile.abilities,
    profile.goals,
    profile.background,
    profile.trivia,
    profile.statusText,
    profile.quote,
  ]
    .filter(Boolean)
    .join(" ");
}
