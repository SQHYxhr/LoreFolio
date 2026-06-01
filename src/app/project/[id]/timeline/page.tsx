import { Suspense } from "react";
import { TimelineView } from "@/components/TimelineView";

interface TimelinePageProps {
  params: Promise<{ id: string }>;
}

export default async function TimelinePage({ params }: TimelinePageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          正在加载时间线...
        </div>
      }
    >
      <TimelineView projectId={id} />
    </Suspense>
  );
}
