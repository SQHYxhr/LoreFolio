import { Suspense } from "react";
import { GlobalSearchView } from "@/components/GlobalSearchView";

interface SearchPageProps { params: Promise<{ id: string }> }

export default async function SearchPage({ params }: SearchPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">正在加载全局搜索...</div>}>
      <GlobalSearchView projectId={id} />
    </Suspense>
  );
}
