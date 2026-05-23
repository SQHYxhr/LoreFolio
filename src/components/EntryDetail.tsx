"use client";

import { useCallback, useState } from "react";
import { BookMarked, Edit3, Pin, Star } from "lucide-react";
import type { Entry } from "@/types";
import { ENTRY_TYPE_LABELS } from "@/types";
import { getImageAlt } from "@/lib/images";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/EmptyState";
import { EntryContentView } from "@/components/EntryContentView";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ImageLightbox } from "@/components/ImageLightbox";
import { RelatedEntries } from "@/components/RelatedEntries";
import { CharacterDetail } from "@/components/CharacterDetail";
import { createEmptyCharacterProfile } from "@/lib/character-profile";
import { cn } from "@/lib/utils";

interface EntryDetailProps {
  entry: Entry | null;
  projectEntries: Entry[];
  relatedEntries: Entry[];
  onEdit: () => void;
  onSelectRelated: (entry: Entry) => void;
  onSelectEntry: (entry: Entry) => void;
  onTagClick?: (tag: string) => void;
}

export function EntryDetail({
  entry,
  projectEntries,
  relatedEntries,
  onEdit,
  onSelectRelated,
  onSelectEntry,
  onTagClick,
}: EntryDetailProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const openImage = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  if (!entry) {
    return (
      <aside className="flex h-full w-[460px] shrink-0 flex-col bg-card/30">
        <EmptyState
          icon={BookMarked}
          title="选择一条设定"
          description="从中间列表点击条目，在这里查看完整详情与插图。"
          className="m-4 h-[calc(100%-2rem)]"
        />
      </aside>
    );
  }

  if (entry.type === "character") {
    return (
      <CharacterDetail
        entry={entry}
        profile={entry.characterProfile ?? createEmptyCharacterProfile()}
        projectEntries={projectEntries}
        relatedEntries={relatedEntries}
        onEdit={onEdit}
        onSelectRelated={onSelectRelated}
        onSelectEntry={onSelectEntry}
        onTagClick={onTagClick}
      />
    );
  }

  const coverAlt = entry.coverImage
    ? getImageAlt(entry.coverImage, entry.imageAltMap, entry.title)
    : "";

  return (
    <>
      <aside className="flex h-full w-[460px] shrink-0 flex-col bg-card/30">
        {entry.coverImage ? (
          <button
            type="button"
            onClick={() => openImage(entry.coverImage, coverAlt)}
            className="group relative h-44 w-full shrink-0 overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.coverImage}
              alt={coverAlt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white backdrop-blur-sm">
                  {ENTRY_TYPE_LABELS[entry.type]}
                </Badge>
                {entry.isPinned ? (
                  <Badge variant="secondary" className="gap-1 bg-white/20 text-white">
                    <Pin className="h-3 w-3" /> 置顶
                  </Badge>
                ) : null}
                {entry.isFavorite ? (
                  <Badge variant="secondary" className="gap-1 bg-white/20 text-white">
                    <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> 收藏
                  </Badge>
                ) : null}
              </div>
              <h2 className="font-serif text-xl font-semibold text-white drop-shadow">
                {entry.title || "未命名条目"}
              </h2>
            </div>
          </button>
        ) : (
          <div className="flex items-start justify-between border-b border-border/80 p-5">
            <div className="min-w-0 flex-1 pr-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge>{ENTRY_TYPE_LABELS[entry.type]}</Badge>
                {entry.isPinned ? (
                  <Badge variant="secondary" className="gap-1">
                    <Pin className="h-3 w-3" /> 置顶
                  </Badge>
                ) : null}
                {entry.isFavorite ? (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 收藏
                  </Badge>
                ) : null}
              </div>
              <h2 className="font-serif text-xl font-semibold leading-tight">
                {entry.title || "未命名条目"}
              </h2>
              {entry.summary ? (
                <p className="mt-2 text-sm text-muted-foreground">{entry.summary}</p>
              ) : null}
            </div>
            <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={onEdit}>
              <Edit3 className="h-3.5 w-3.5" />
              编辑
            </Button>
          </div>
        )}

        {entry.coverImage ? (
          <div className="flex items-center justify-between border-b border-border/80 px-5 py-2">
            {entry.summary ? (
              <p className="text-sm text-muted-foreground line-clamp-2">{entry.summary}</p>
            ) : (
              <span className="text-xs text-muted-foreground">点击封面可放大预览</span>
            )}
            <Button size="sm" variant="outline" className="ml-3 shrink-0 gap-1.5" onClick={onEdit}>
              <Edit3 className="h-3.5 w-3.5" />
              编辑
            </Button>
          </div>
        ) : null}

        <ScrollArea className="flex-1">
          <article className="space-y-6 p-5">
            <GalleryGrid
              images={entry.galleryImages}
              imageAltMap={entry.imageAltMap}
              onImageClick={openImage}
            />

            {entry.tags.length > 0 ? (
              <section>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  标签
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onTagClick?.(tag)}
                      className={cn(
                        "rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground",
                        onTagClick && "cursor-pointer hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                详细设定
              </h3>
              <EntryContentView content={entry.content} onImageClick={openImage} />
            </section>

            <RelatedEntries entries={relatedEntries} onSelect={onSelectRelated} />

            <div className="border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <p>创建于 {formatDate(entry.createdAt)}</p>
              <p className="mt-1">更新于 {formatDate(entry.updatedAt)}</p>
            </div>
          </article>
        </ScrollArea>
      </aside>

      <ImageLightbox
        src={lightbox?.src ?? null}
        alt={lightbox?.alt}
        open={!!lightbox}
        onOpenChange={(open) => !open && setLightbox(null)}
      />
    </>
  );
}
