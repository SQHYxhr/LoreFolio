import { RelationshipGraphView } from "@/components/RelationshipGraphView";

interface RelationshipsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RelationshipsPage({ params }: RelationshipsPageProps) {
  const { id } = await params;
  return <RelationshipGraphView projectId={id} />;
}
