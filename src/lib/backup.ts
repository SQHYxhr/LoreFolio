import type { AppData } from "@/types";
import { ENTRY_TYPES } from "@/types";

export interface BackupPayload {
  app: "world-archive";
  version: 2;
  exportedAt: string;
  data: AppData;
}

export function createBackupPayload(data: AppData): BackupPayload {
  return {
    app: "world-archive",
    version: 2,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function downloadBackup(data: AppData): void {
  const payload = createBackupPayload(data);
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10);
  const filename = `world-archive-backup-${today}.json`;

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

// ── Import / validation ──────────────────────────────────────────

export interface BackupSummary {
  projectCount: number;
  entryCount: number;
  characterRelationCount: number;
  exportedAt: string;
  version: number;
}

export type BackupValidationResult =
  | { ok: true; payload: BackupPayload; summary: BackupSummary; warnings: string[] }
  | { ok: false; errors: string[] };

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isStr(v: unknown): v is string {
  return typeof v === "string";
}

function isArr(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

export function validateBackupPayload(input: unknown): BackupValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isObj(input)) {
    return { ok: false, errors: ["备份文件格式不正确：根节点必须是对象。"] };
  }

  if (input.app !== "world-archive") {
    errors.push("备份文件格式不正确：缺少 app 字段或值不为 \"world-archive\"。");
  }
  if (input.version !== 2) {
    errors.push("备份文件格式不正确：version 必须为 2。");
  }
  if (!isStr(input.exportedAt)) {
    errors.push("备份文件格式不正确：exportedAt 必须是字符串。");
  }
  if (!isObj(input.data)) {
    errors.push("备份文件格式不正确：缺少 data 字段或 data 不是对象。");
  }

  if (errors.length > 0) return { ok: false, errors };

  const data = input.data as Record<string, unknown>;

  if (!isArr(data.projects)) {
    errors.push("备份文件格式不正确：data.projects 必须是数组。");
  }
  if (!isArr(data.entries)) {
    errors.push("备份文件格式不正确：data.entries 必须是数组。");
  }
  if (!isArr(data.characterRelations)) {
    errors.push("备份文件格式不正确：data.characterRelations 必须是数组。");
  }

  if (errors.length > 0) return { ok: false, errors };

  const projects = data.projects as unknown[];
  const entries = data.entries as unknown[];
  const relations = data.characterRelations as unknown[];

  // Validate projects
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    if (!isObj(p)) { errors.push(`projects[${i}] 必须是对象。`); continue; }
    if (!isStr(p.id)) errors.push(`projects[${i}].id 必须是字符串。`);
    if (!isStr(p.name)) errors.push(`projects[${i}].name 必须是字符串。`);
    if (!isStr(p.createdAt)) errors.push(`projects[${i}].createdAt 必须是字符串。`);
    if (!isStr(p.updatedAt)) errors.push(`projects[${i}].updatedAt 必须是字符串。`);
  }

  // Validate entries
  const validTypes = new Set<string>(ENTRY_TYPES);
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (!isObj(e)) { errors.push(`entries[${i}] 必须是对象。`); continue; }
    if (!isStr(e.id)) errors.push(`entries[${i}].id 必须是字符串。`);
    if (!isStr(e.projectId)) errors.push(`entries[${i}].projectId 必须是字符串。`);
    if (!isStr(e.type) || !validTypes.has(e.type)) {
      errors.push(`entries[${i}].type 必须是合法条目类型，得到 "${String(e.type)}"。`);
    }
    if (!isStr(e.title)) errors.push(`entries[${i}].title 必须是字符串。`);
    if (!isStr(e.createdAt)) errors.push(`entries[${i}].createdAt 必须是字符串。`);
    if (!isStr(e.updatedAt)) errors.push(`entries[${i}].updatedAt 必须是字符串。`);
  }

  // Validate characterRelations
  for (let i = 0; i < relations.length; i++) {
    const r = relations[i];
    if (!isObj(r)) { errors.push(`characterRelations[${i}] 必须是对象。`); continue; }
    if (!isStr(r.id)) errors.push(`characterRelations[${i}].id 必须是字符串。`);
    if (!isStr(r.projectId)) errors.push(`characterRelations[${i}].projectId 必须是字符串。`);
    if (!isStr(r.fromCharacterId)) errors.push(`characterRelations[${i}].fromCharacterId 必须是字符串。`);
    if (!isStr(r.toCharacterId)) errors.push(`characterRelations[${i}].toCharacterId 必须是字符串。`);
    if (!isStr(r.relationType)) errors.push(`characterRelations[${i}].relationType 必须是字符串。`);
    if (!isStr(r.direction)) errors.push(`characterRelations[${i}].direction 必须是字符串。`);
    if (!isStr(r.status)) errors.push(`characterRelations[${i}].status 必须是字符串。`);
    if (!isStr(r.createdAt)) errors.push(`characterRelations[${i}].createdAt 必须是字符串。`);
    if (!isStr(r.updatedAt)) errors.push(`characterRelations[${i}].updatedAt 必须是字符串。`);
  }

  if (errors.length > 0) return { ok: false, errors };

  // Reference consistency (warnings only)
  const typedProjects = projects as { id: string }[];
  const typedEntries = entries as { id: string; projectId: string; type: string; relatedEntryIds?: unknown[] }[];
  const typedRelations = relations as { id: string; projectId: string; fromCharacterId: string; toCharacterId: string }[];

  const projectIds = new Set(typedProjects.map((p) => p.id));
  const entryIds = new Set(typedEntries.map((e) => e.id));
  const characterEntryIds = new Set(
    typedEntries.filter((e) => e.type === "character").map((e) => e.id),
  );

  for (const e of typedEntries) {
    if (!projectIds.has(e.projectId)) {
      warnings.push(`条目 ${String(e.id)} 引用的 projectId "${String(e.projectId)}" 不存在。`);
    }
  }

  for (const e of typedEntries) {
    const refs = e.relatedEntryIds;
    if (isArr(refs)) {
      for (const refId of refs) {
        if (isStr(refId) && !entryIds.has(refId)) {
          warnings.push(`条目 ${String(e.id)} 的 relatedEntryIds 引用了不存在的条目 "${refId}"。`);
        }
      }
    }
  }

  for (const r of typedRelations) {
    if (!projectIds.has(r.projectId)) {
      warnings.push(`角色关系 ${String(r.id)} 的 projectId "${String(r.projectId)}" 不存在。`);
    }
    if (!characterEntryIds.has(r.fromCharacterId)) {
      warnings.push(`角色关系 ${String(r.id)} 的 fromCharacterId "${String(r.fromCharacterId)}" 找不到对应角色条目。`);
    }
    if (!characterEntryIds.has(r.toCharacterId)) {
      warnings.push(`角色关系 ${String(r.id)} 的 toCharacterId "${String(r.toCharacterId)}" 找不到对应角色条目。`);
    }
  }

  const payload: BackupPayload = {
    app: input.app as "world-archive",
    version: 2,
    exportedAt: input.exportedAt as string,
    data: input.data as AppData,
  };

  const summary: BackupSummary = {
    projectCount: projects.length,
    entryCount: entries.length,
    characterRelationCount: relations.length,
    exportedAt: input.exportedAt as string,
    version: 2,
  };

  return { ok: true, payload, summary, warnings };
}

export function parseBackupJson(json: string): BackupValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, errors: ["无法解析备份文件：JSON 格式错误。"] };
  }
  return validateBackupPayload(parsed);
}
