"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  project?: Project;
}

export function TopBar({ project }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/60 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </Link>
        {project ? (
          <>
            <span className="text-muted-foreground">/</span>
            <div>
              <h1 className="font-serif text-base font-semibold">{project.name}</h1>
              {project.description ? (
                <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
              ) : null}
            </div>
          </>
        ) : (
          <h1 className="font-serif text-lg font-semibold">设定档案馆</h1>
        )}
      </div>
      <p className="hidden text-xs text-muted-foreground sm:block">世界观 · OC · 设定手帐</p>
    </header>
  );
}
