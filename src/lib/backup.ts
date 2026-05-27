import type { AppData } from "@/types";

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
