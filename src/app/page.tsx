"use client";

import { useCallback, useRef, useState } from "react";
import { Download, FileSearch, Library } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { downloadBackup, parseBackupJson } from "@/lib/backup";
import type { BackupValidationResult } from "@/lib/backup";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/TopBar";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { EmptyState } from "@/components/EmptyState";

export default function HomePage() {
  const router = useRouter();
  const { hydrated, projects, data, addProject } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [exported, setExported] = useState(false);
  const [exportError, setExportError] = useState("");
  const [checkResult, setCheckResult] = useState<BackupValidationResult | null>(null);

  const handleCreate = (input: { name: string; description: string }) => {
    const project = addProject(input);
    router.push(`/project/${project.id}`);
  };

  const handleExport = useCallback(() => {
    setExportError("");
    try {
      downloadBackup(data);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    } catch (e) {
      console.error(e);
      setExportError("导出失败，请稍后重试。");
    }
  }, [data]);

  const handleFileCheck = useCallback(() => {
    setCheckResult(null);
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const result = parseBackupJson(text);
        setCheckResult(result);
      } catch {
        setCheckResult({ ok: false, errors: ["无法读取文件内容。"] });
      }

      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [],
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        正在打开设定档案馆...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar />

      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm text-primary">世界观 · OC · 设定手帐</p>
            <h1 className="font-serif text-3xl font-bold tracking-tight">我的世界</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              集中整理角色、地点、组织与世界观设定。选择一个世界进入，或创建新的档案空间。
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <CreateProjectDialog onCreate={handleCreate} />
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleExport}
                disabled={exported}
              >
                <Download className="h-3.5 w-3.5" />
                {exported ? "已导出" : "导出数据"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleFileCheck}
              >
                <FileSearch className="h-3.5 w-3.5" />
                检查备份文件
              </Button>
            </div>
            {exportError ? (
              <p className="text-xs text-destructive">{exportError}</p>
            ) : null}
            {checkResult ? (
              checkResult.ok ? (
                <div className="max-w-md text-xs">
                  <p className="text-muted-foreground">
                    备份文件校验通过：{checkResult.summary.projectCount} 个世界，{checkResult.summary.entryCount} 个条目，{checkResult.summary.characterRelationCount} 条角色关系。
                    {checkResult.warnings.length > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400">
                        {" "}（{checkResult.warnings.length} 条警告）
                      </span>
                    ) : null}
                  </p>
                  <p className="text-muted-foreground">
                    仅完成校验，尚未导入或覆盖当前数据。
                  </p>
                  {checkResult.warnings.length > 0 ? (
                    <ul className="mt-1 space-y-0.5 text-muted-foreground">
                      {checkResult.warnings.slice(0, 5).map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                      {checkResult.warnings.length > 5 ? (
                        <li>… 还有 {checkResult.warnings.length - 5} 条警告</li>
                      ) : null}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <div className="max-w-md text-xs">
                  <p className="text-destructive">备份文件校验失败：</p>
                  <ul className="mt-1 space-y-0.5 text-destructive">
                    {checkResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )
            ) : null}
          </div>
        </section>

        {projects.length === 0 ? (
          <EmptyState
            icon={Library}
            title="还没有任何世界"
            description="创建你的第一个世界项目，开始整理 OC 与设定吧。"
            action={<CreateProjectDialog onCreate={handleCreate} />}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                entryCount={data.entries.filter((e) => e.projectId === project.id).length}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
