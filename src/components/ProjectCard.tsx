import { BookOpen } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
  entryCount: number;
}

export function ProjectCard({ project, entryCount }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.id}`} className="group block">
      <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <BookOpen className="h-4 w-4" />
            <Badge variant="secondary">{entryCount} 条设定</Badge>
          </div>
          <CardTitle className="group-hover:text-primary">{project.name}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-[2.5rem]">
            {project.description || "暂无描述"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">更新于 {formatDate(project.updatedAt)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
