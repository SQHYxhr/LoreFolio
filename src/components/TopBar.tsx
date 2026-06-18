"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, GitFork, LayoutDashboard, Map, MoreHorizontal, Search } from "lucide-react";
import type { Project } from "@/types";

interface TopBarProps {
  project?: Project;
  backHref?: string;
  backLabel?: string;
  showRelationsLink?: boolean;
  relationsHref?: string;
  showTimelineLink?: boolean;
  timelineHref?: string;
  showDashboardLink?: boolean;
  dashboardHref?: string;
  showMapLink?: boolean;
  mapHref?: string;
  showSearchLink?: boolean;
  searchHref?: string;
}

export function TopBar({
  project, backHref, backLabel,
  showRelationsLink = false, relationsHref,
  showTimelineLink = false, timelineHref,
  showDashboardLink = false, dashboardHref,
  showMapLink = false, mapHref,
  showSearchLink = false, searchHref,
}: TopBarProps) {
  const href = backHref ?? "/";
  const label = backLabel ?? "返回";
  const [menuOpen, setMenuOpen] = useState(false);

  const mobileLinks: { key: string; href: string; icon: React.ReactNode; text: string }[] = [];
  if (showSearchLink && searchHref) mobileLinks.push({ key: "search", href: searchHref, icon: <Search className="h-4 w-4" aria-hidden="true" />, text: "全局搜索" });
  if (showMapLink && mapHref) mobileLinks.push({ key: "map", href: mapHref, icon: <Map className="h-4 w-4" aria-hidden="true" />, text: "世界地图" });
  if (showTimelineLink && timelineHref) mobileLinks.push({ key: "timeline", href: timelineHref, icon: <Calendar className="h-4 w-4" aria-hidden="true" />, text: "时间线" });
  if (showRelationsLink && relationsHref) mobileLinks.push({ key: "relations", href: relationsHref, icon: <GitFork className="h-4 w-4" aria-hidden="true" />, text: "关系图谱" });
  if (showDashboardLink && dashboardHref) mobileLinks.push({ key: "dashboard", href: dashboardHref, icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />, text: "世界概览" });

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 bg-card/60 px-3 sm:px-4 backdrop-blur-sm z-50">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
        {/* Back link — styled link, not button-inside-link */}
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Link>

        {/* Project name area — flex-1 min-w-0 for truncation */}
        {project && !backHref ? (
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-base font-semibold truncate">{project.name}</h1>
            {project.description ? <p className="text-xs text-muted-foreground line-clamp-1 truncate">{project.description}</p> : null}
          </div>
        ) : project ? (
          <div className="min-w-0 flex-1 truncate">
            <Link href={`/project/${project.id}`} className="font-serif text-base font-semibold hover:underline">{project.name}</Link>
          </div>
        ) : (
          <h1 className="font-serif text-lg font-semibold">设定档案馆</h1>
        )}

        {/* Mobile "More" menu */}
        {mobileLinks.length > 0 ? (
          <div className="relative shrink-0 lg:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "关闭项目工具菜单" : "打开项目工具菜单"}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
            {menuOpen ? (
              <>
                <div className="fixed inset-0 z-[51] cursor-default" onClick={closeMenu} role="presentation" />
                <div className="absolute right-0 top-full z-[52] mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-lg" role="menu">
                  {mobileLinks.map((item) => (
                    <Link key={item.key} href={item.href} onClick={closeMenu} className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" role="menuitem">
                      {item.icon}
                      {item.text}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {project && backHref ? <Link href="/" className="hidden text-xs text-muted-foreground hover:underline sm:inline">返回项目列表</Link> : null}
        <p className="hidden text-xs text-muted-foreground sm:block">世界观 · OC · 设定手帐</p>
      </div>
    </header>
  );
}
