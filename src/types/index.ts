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

/** 角色关系类型预设 */
export const RELATION_TYPES = [
  "friend",
  "family",
  "lover",
  "enemy",
  "mentor",
  "student",
  "ally",
  "rival",
  "colleague",
  "superior",
  "subordinate",
  "unknown",
] as const;

export type RelationType = (typeof RELATION_TYPES)[number];

export const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  friend: "朋友",
  family: "家人",
  lover: "恋人",
  enemy: "敌人",
  mentor: "导师",
  student: "学生",
  ally: "盟友",
  rival: "对手",
  colleague: "同事",
  superior: "上司",
  subordinate: "下属",
  unknown: "未知",
};

export type RelationDirection = "directed" | "mutual";
export type RelationStatus = "current" | "past" | "ambiguous";

export interface CharacterRelation {
  id: string;
  projectId: string;
  fromCharacterId: string;
  toCharacterId: string;
  relationType: RelationType;
  customLabel: string;
  direction: RelationDirection;
  status: RelationStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export const LOCATION_CATEGORIES = [
  "city",
  "academy",
  "building",
  "country",
  "region",
  "ruin",
  "realm",
  "natural",
  "other",
] as const;

export type LocationCategory = "" | (typeof LOCATION_CATEGORIES)[number];

export const LOCATION_CATEGORY_LABELS: Record<LocationCategory, string> = {
  "": "未选择",
  city: "城市",
  academy: "学院",
  building: "建筑",
  country: "国家",
  region: "区域",
  ruin: "遗迹",
  realm: "秘境",
  natural: "自然区域",
  other: "其他",
};

export const LOCATION_STATUSES = [
  "active",
  "abandoned",
  "destroyed",
  "sealed",
  "lost",
  "unknown",
] as const;

export type LocationStatus = "" | (typeof LOCATION_STATUSES)[number];

export const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  "": "未选择",
  active: "正常",
  abandoned: "废弃",
  destroyed: "毁灭",
  sealed: "封锁 / 封印",
  lost: "失落",
  unknown: "未知",
};

export interface LocationProfile {
  locationCategory: LocationCategory;
  status: LocationStatus;
  parentLocationId: string;
  governingFactionId: string;
  environment: string;
  landmarks: string;
  history: string;
  access: string;
  creatorNotes: string;
}

// ── 组织 / 势力结构化档案 ──────────────────────────────────────

export const FACTION_CATEGORIES = [
  "government",
  "military",
  "guild",
  "religious",
  "academic",
  "mercenary",
  "secret",
  "criminal",
  "tribe",
  "other",
] as const;

export type FactionCategory = "" | (typeof FACTION_CATEGORIES)[number];

export const FACTION_CATEGORY_LABELS: Record<FactionCategory, string> = {
  "": "未选择",
  government: "政府 / 统治机构",
  military: "军事组织",
  guild: "公会 / 行会",
  religious: "宗教 / 信仰组织",
  academic: "学术 / 研究机构",
  mercenary: "佣兵团",
  secret: "秘密结社",
  criminal: "犯罪组织",
  tribe: "部落 / 氏族",
  other: "其他",
};

export const FACTION_STATUSES = [
  "active",
  "declining",
  "dissolved",
  "underground",
  "legendary",
  "unknown",
] as const;

export type FactionStatus = "" | (typeof FACTION_STATUSES)[number];

export const FACTION_STATUS_LABELS: Record<FactionStatus, string> = {
  "": "未选择",
  active: "活跃",
  declining: "衰落中",
  dissolved: "已解散",
  underground: "转入地下",
  legendary: "仅存于传说",
  unknown: "未知",
};

export interface FactionProfile {
  factionCategory: FactionCategory;
  status: FactionStatus;
  parentFactionId: string;
  headquartersLocationId: string;
  ideology: string;
  structure: string;
  influence: string;
  history: string;
  creatorNotes: string;
}

// ── 物品 / 道具结构化档案 ──────────────────────────────────────

export const ITEM_CATEGORIES = [
  "weapon",
  "armor",
  "accessory",
  "consumable",
  "tool",
  "artifact",
  "document",
  "material",
  "other",
] as const;

export type ItemCategory = "" | (typeof ITEM_CATEGORIES)[number];

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  "": "未选择",
  weapon: "武器",
  armor: "防具",
  accessory: "饰品 / 护符",
  consumable: "消耗品",
  tool: "工具",
  artifact: "遗物 / 神器",
  document: "文献 / 卷轴",
  material: "材料",
  other: "其他",
};

export const ITEM_STATUSES = [
  "intact",
  "damaged",
  "lost",
  "destroyed",
  "sealed",
  "unknown",
] as const;

export type ItemStatus = "" | (typeof ITEM_STATUSES)[number];

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  "": "未选择",
  intact: "完好",
  damaged: "受损",
  lost: "遗失",
  destroyed: "毁坏",
  sealed: "封印 / 封存",
  unknown: "未知",
};

export interface ItemProfile {
  itemCategory: ItemCategory;
  status: ItemStatus;
  ownerCharacterId: string;
  currentLocationId: string;
  creatorFactionId: string;
  origin: string;
  appearance: string;
  function: string;
  materials: string;
  history: string;
  limitations: string;
  creatorNotes: string;
}

// ── 事件结构化档案 ──────────────────────────────────────────

export const EVENT_CATEGORIES = [
  "battle",
  "conflict",
  "political",
  "disaster",
  "discovery",
  "ceremony",
  "crime",
  "personal",
  "supernatural",
  "other",
] as const;

export type EventCategory = "" | (typeof EVENT_CATEGORIES)[number];

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  "": "未选择",
  battle: "战争 / 战役",
  conflict: "冲突 / 争端",
  political: "政治事件",
  disaster: "灾难",
  discovery: "发现 / 探索",
  ceremony: "仪式 / 庆典",
  crime: "犯罪 / 审判",
  personal: "个人事件",
  supernatural: "超自然事件",
  other: "其他",
};

export const EVENT_STATUSES = [
  "ongoing",
  "concluded",
  "aborted",
  "unknown",
] as const;

export type EventStatus = "" | (typeof EVENT_STATUSES)[number];

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  "": "未选择",
  ongoing: "进行中",
  concluded: "已结束",
  aborted: "中止 / 未发生",
  unknown: "未知",
};

export interface EventProfile {
  eventCategory: EventCategory;
  status: EventStatus;
  chronology: string;
  startDateText: string;
  endDateText: string;
  locationId: string;
  primaryFactionId: string;
  participantCharacterIds: string[];
  involvedFactionIds: string[];
  relatedItemIds: string[];
  cause: string;
  process: string;
  result: string;
  impact: string;
  aftermath: string;
  creatorNotes: string;
}

// ── 种族 / 物种结构化档案 ──────────────────────────────────

export const SPECIES_CATEGORIES = [
  "humanoid",
  "animal",
  "mythic",
  "spirit",
  "monster",
  "plant",
  "construct",
  "other",
] as const;

export type SpeciesCategory = "" | (typeof SPECIES_CATEGORIES)[number];

export const SPECIES_CATEGORY_LABELS: Record<SpeciesCategory, string> = {
  "": "未选择",
  humanoid: "类人种族",
  animal: "动物 / 灵兽",
  mythic: "神话生物",
  spirit: "灵体 / 精怪",
  monster: "魔物 / 异兽",
  plant: "植物生命",
  construct: "造物 / 构装体",
  other: "其他",
};

export const SPECIES_STATUSES = [
  "common",
  "rare",
  "endangered",
  "extinct",
  "legendary",
  "unknown",
] as const;

export type SpeciesStatus = "" | (typeof SPECIES_STATUSES)[number];

export const SPECIES_STATUS_LABELS: Record<SpeciesStatus, string> = {
  "": "未选择",
  common: "常见",
  rare: "稀有",
  endangered: "濒危",
  extinct: "已灭绝",
  legendary: "传说中",
  unknown: "未知",
};

export interface SpeciesProfile {
  speciesCategory: SpeciesCategory;
  status: SpeciesStatus;
  habitatLocationId: string;
  relatedFactionIds: string[];
  representativeCharacterIds: string[];
  appearance: string;
  physiology: string;
  abilities: string;
  culture: string;
  history: string;
  distribution: string;
  relationshipWithHumans: string;
  creatorNotes: string;
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
  /** 地点结构化档案；仅 type === "location" 时有效 */
  locationProfile?: LocationProfile;
  /** 组织 / 势力结构化档案；仅 type === "faction" 时有效 */
  factionProfile?: FactionProfile;
  /** 物品 / 道具结构化档案；仅 type === "item" 时有效 */
  itemProfile?: ItemProfile;
  /** 事件结构化档案；仅 type === "event" 时有效 */
  eventProfile?: EventProfile;
  /** 种族 / 物种结构化档案；仅 type === "species" 时有效 */
  speciesProfile?: SpeciesProfile;
}

export interface AppData {
  projects: Project[];
  entries: Entry[];
  characterRelations: CharacterRelation[];
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
  | "locationProfile"
  | "factionProfile"
  | "itemProfile"
  | "eventProfile"
  | "speciesProfile"
>;

export type ProjectFormData = Pick<Project, "name" | "description">;

export const ENTRY_IMAGE_FIELDS = {
  coverImage: "",
  galleryImages: [] as string[],
  imageAltMap: {} as Record<string, string>,
};
