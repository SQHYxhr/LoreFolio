import { Suspense } from "react";
import { WorldMapView } from "@/components/WorldMapView";

interface MapPageProps {
  params: Promise<{ id: string }>;
}

export default async function MapPage({ params }: MapPageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          正在加载世界地图...
        </div>
      }
    >
      <WorldMapView projectId={id} />
    </Suspense>
  );
}
