import { Suspense } from "react";
import { DashboardView } from "@/components/DashboardView";

interface DashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          正在加载世界概览...
        </div>
      }
    >
      <DashboardView projectId={id} />
    </Suspense>
  );
}
