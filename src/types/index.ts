export type EntryType =
  | "character"
  | "location"
  | "faction"
  | "item"
  | "species"
  | "event"
  | "lore"
  | "note";

/** 角色专属结构化档案（仅 character 类型使用，其他类型可忽略） */
export interface CharacterProfile {
  displayName: string;
  aliases: string[];
  pronouns: string;
  ageText: string;
  gender: string;
  identity: string;
  factionId: string;
  locationId: string;
  speciesId: string;
  appearance: string;
  personality: string;
  abilities: string;
  goals: string;
  background: string;
  trivia: string;
  statusText: string;
  quote: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Entry {
  id: string;
  projectId: string;
  type: EntryType;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  galleryImages: string[];
  imageAltMap?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isPinned: boolean;
  tags: string[];
  relatedEntryIds: string[];
  /** 角色结构化档案；仅 type === "character" 时有效 */
  characterProfile?: CharacterProfile;
}

export interface AppData {
  projects: Project[];
  entries: Entry[];
}

export const ENTRY_TYPES: EntryType[] = [
  "character",
  "location",
  "faction",
  "item",
  "species",
  "event",
  "lore",
  "note",
];

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  character: "角色",
  location: "地点",
  faction: "组织",
  item: "物品",
  species: "种族",
  event: "事件",
  lore: "世界观",
  note: "笔记",
};

export const ENTRY_TYPE_ICONS: Record<EntryType, string> = {
  character: "👤",
  location: "📍",
  faction: "⚔️",
  item: "💎",
  species: "🌿",
  event: "📜",
  lore: "🌍",
  note: "📝",
};

export type EntryFormData = Pick<
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

export type ProjectFormData = Pick<Project, "name" | "description">;

export const ENTRY_IMAGE_FIELDS = {
  coverImage: "",
  galleryImages: [] as string[],
  imageAltMap: {} as Record<string, string>,
};
