"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, GitFork } from "lucide-react";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  project?: Project;
  backHref?: string;
  backLabel?: string;
  showRelationsLink?: boolean;
  relationsHref?: string;
  showTimelineLink?: boolean;
  timelineHref?: string;
}

export function TopBar({
  project,
  backHref,
  backLabel,
  showRelationsLink = false,
  relationsHref,
  showTimelineLink = false,
  timelineHref,
}: TopBarProps) {
  const href = backHref ?? "/";
  const label = backLabel ?? "返回";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/60 px-3 sm:px-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
        <Link href={href} className="shrink-0">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        </Link>
        {project && !backHref ? (
          <>
            <span className="hidden sm:inline text-muted-foreground">/</span>
            <div className="min-w-0">
              <h1 className="font-serif text-base font-semibold truncate">{project.name}</h1>
              {project.description ? (
                <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
              ) : null}
            </div>
          </>
        ) : project ? (
          <>
            <span className="text-muted-foreground">/</span>
            <Link href={`/project/${project.id}`} className="font-serif text-base font-semibold hover:underline">
              {project.name}
            </Link>
          </>
        ) : (
          <h1 className="font-serif text-lg font-semibold">设定档案馆</h1>
        )}
        {showRelationsLink && relationsHref ? (
          <Link href={relationsHref} className="shrink-0 lg:hidden">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <GitFork className="h-4 w-4" />
              <span className="hidden sm:inline">关系图</span>
            </Button>
          </Link>
        ) : null}
        {showTimelineLink && timelineHref ? (
          <Link href={timelineHref} className="shrink-0 lg:hidden">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">时间线</span>
            </Button>
          </Link>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {project && backHref ? (
          <Link href="/" className="text-xs text-muted-foreground hover:underline">
            返回项目列表
          </Link>
        ) : null}
        <p className="hidden text-xs text-muted-foreground sm:block">世界观 · OC · 设定手帐</p>
      </div>
    </header>
  );
}
