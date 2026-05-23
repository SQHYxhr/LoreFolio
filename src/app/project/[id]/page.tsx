import { Suspense } from "react";
import { ProjectWorkspace } from "@/components/ProjectWorkspace";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          正在加载设定档案...
        </div>
      }
    >
      <ProjectWorkspace projectId={id} />
    </Suspense>
  );
}
