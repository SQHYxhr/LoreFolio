"use client";

import { Library } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/use-store";
import { TopBar } from "@/components/TopBar";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { EmptyState } from "@/components/EmptyState";

export default function HomePage() {
  const router = useRouter();
  const { hydrated, projects, data, addProject } = useStore();

  const handleCreate = (input: { name: string; description: string }) => {
    const project = addProject(input);
    router.push(`/project/${project.id}`);
  };

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
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm text-primary">世界观 · OC · 设定手帐</p>
            <h1 className="font-serif text-3xl font-bold tracking-tight">我的世界</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              集中整理角色、地点、组织与世界观设定。选择一个世界进入，或创建新的档案空间。
            </p>
          </div>
          <CreateProjectDialog onCreate={handleCreate} />
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
