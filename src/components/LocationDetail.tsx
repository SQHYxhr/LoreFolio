"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, MapPin, Pin, Star } from "lucide-react";
import type { Entry, LocationProfile } from "@/types";
import { ENTRY_TYPE_LABELS, LOCATION_CATEGORY_LABELS, LOCATION_STATUS_LABELS } from "@/types";
import { getImageAlt } from "@/lib/images";
import { formatMapCoordLabel } from "@/lib/map-coordinates";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EntryContentView } from "@/components/EntryContentView";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ImageLightbox } from "@/components/ImageLightbox";
import { RelatedEntries } from "@/components/RelatedEntries";
import { LocationHubSection } from "@/components/LocationHubSection";

interface LocationDetailProps {
  entry: Entry;
  projectEntries: Entry[];
  relatedEntries: Entry[];
  onEdit: () => void;
  onSelectRelated: (entry: Entry) => void;
  onSelectEntry: (entry: Entry) => void;
  onTagClick?: (tag: string) => void;
}

function ProfileBlock({ title, text }: { title: string; text: string }) {
  if (!text.trim()) return null;
  return (
    <section>
      <h3 className="mb-2 font-serif text-sm font-semibold text-foreground/90">{title}</h3>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{text}</p>
    </section>
  );
}

function InfoRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  if (!value.trim()) return null;
  const inner = (
    <span className={cn("text-sm", onClick && "text-primary underline-offset-2 hover:underline")}>
      {value}
    </span>
  );
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>
        {onClick ? (
          <button type="button" onClick={onClick} className="text-left">
            {inner}
          </button>
        ) : (
          inner
        )}
      </dd>
    </div>
  );
}

export function LocationDetail({
  entry,
  projectEntries,
  relatedEntries,
  onEdit,
  onSelectRelated,
  onSelectEntry,
  onTagClick,
}: LocationDetailProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const openImage = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const hasMapCoords = entry.locationProfile != null;

  const profile: LocationProfile | undefined = entry.locationProfile;

  const parentLocation = useMemo(
    () =>
      profile?.parentLocationId
        ? projectEntries.find(
            (e) => e.id === profile.parentLocationId && e.type === "location",
          )
        : undefined,
    [profile?.parentLocationId, projectEntries],
  );

  const governingFaction = useMemo(
    () =>
      profile?.governingFactionId
        ? projectEntries.find(
            (e) => e.id === profile.governingFactionId && e.type === "faction",
          )
        : undefined,
    [profile?.governingFactionId, projectEntries],
  );

  const residents = useMemo(
    () =>
      projectEntries.filter(
        (e) =>
          e.type === "character" &&
          e.characterProfile?.locationId === entry.id,
      ),
    [projectEntries, entry.id],
  );

  const childLocations = useMemo(
    () =>
      projectEntries.filter(
        (e) =>
          e.type === "location" &&
          e.id !== entry.id &&
          e.locationProfile?.parentLocationId === entry.id,
      ),
    [projectEntries, entry.id],
  );

  const coverAlt = entry.coverImage
    ? getImageAlt(entry.coverImage, entry.imageAltMap, entry.title)
    : "";

  const hasProfile =
    !!profile &&
    (!!profile.locationCategory ||
      !!profile.status ||
      !!profile.parentLocationId ||
      !!profile.governingFactionId ||
      !!profile.environment.trim() ||
      !!profile.landmarks.trim() ||
      !!profile.history.trim() ||
      !!profile.access.trim() ||
      !!profile.creatorNotes.trim());

  const hasBasicInfo =
    !!profile?.locationCategory || !!profile?.status;

  const hasEnvironmentSection =
    (!!profile?.environment.trim()) ||
    (!!profile?.landmarks.trim());

  const hasHistorySection =
    (!!profile?.history.trim()) ||
    (!!profile?.access.trim());

  const hasCreatorNotes = !!(profile?.creatorNotes.trim());

  const hasDerivedRelations = residents.length > 0 || childLocations.length > 0;

  return (
    <>
      <aside className="flex h-full w-full lg:w-[460px] shrink-0 flex-col bg-card/30">
        {/* Cover image header */}
        {entry.coverImage ? (
          <button
            type="button"
            onClick={() => openImage(entry.coverImage, coverAlt)}
            className="group relative h-52 w-full shrink-0 overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.coverImage}
              alt={coverAlt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white backdrop-blur-sm">
                  地点档案
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
              <h2 className="font-serif text-2xl font-semibold text-white drop-shadow">
                {entry.title || "未命名地点"}
              </h2>
            </div>
          </button>
        ) : (
          <div className="border-b border-border/80 bg-gradient-to-b from-primary/5 to-transparent p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">地点档案</Badge>
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
            <h2 className="font-serif text-2xl font-semibold leading-tight">
              {entry.title || "未命名地点"}
            </h2>
          </div>
        )}

        {/* Summary + meta + edit button strip */}
        <div className="flex items-start justify-between gap-3 border-b border-border/80 px-5 py-3">
          <div className="min-w-0 flex-1 space-y-2">
            {entry.summary ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>
            ) : null}
            {entry.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick?.(tag)}
                    className={cn(
                      "rounded-full border border-border bg-background/80 px-2.5 py-0.5 text-xs text-muted-foreground",
                      onTagClick &&
                        "cursor-pointer hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={onEdit}>
            <Edit3 className="h-3.5 w-3.5" />
            编辑
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <article className="space-y-6 p-5">
            {/* Structured profile */}
            {hasProfile ? (
              <>
                {/* 基础档案 */}
                {hasBasicInfo ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      基础档案
                    </h3>
                    <dl className="space-y-2">
                      {profile?.locationCategory ? (
                        <InfoRow
                          label="地点分类"
                          value={LOCATION_CATEGORY_LABELS[profile.locationCategory] || profile.locationCategory}
                        />
                      ) : null}
                      {profile?.status ? (
                        <InfoRow
                          label="当前状态"
                          value={LOCATION_STATUS_LABELS[profile.status] || profile.status}
                        />
                      ) : null}
                    </dl>
                  </section>
                ) : null}

                {/* 层级与归属 */}
                {parentLocation || governingFaction ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      层级与归属
                    </h3>
                    <dl className="space-y-2">
                      <InfoRow
                        label="上级地点"
                        value={parentLocation?.title ?? ""}
                        onClick={parentLocation ? () => onSelectEntry(parentLocation) : undefined}
                      />
                      <InfoRow
                        label="管辖组织"
                        value={governingFaction?.title ?? ""}
                        onClick={governingFaction ? () => onSelectEntry(governingFaction) : undefined}
                      />
                    </dl>
                  </section>
                ) : null}

                {/* 环境与场景 */}
                {hasEnvironmentSection ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      环境与场景
                    </h3>
                    <div className="space-y-4">
                      <ProfileBlock title="环境与氛围" text={profile?.environment ?? ""} />
                      <ProfileBlock title="标志性地点 / 建筑 / 场景" text={profile?.landmarks ?? ""} />
                    </div>
                  </section>
                ) : null}

                {/* 历史与访问 */}
                {hasHistorySection ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      历史与访问
                    </h3>
                    <div className="space-y-4">
                      <ProfileBlock title="历史沿革" text={profile?.history ?? ""} />
                      <ProfileBlock title="出入方式 / 限制" text={profile?.access ?? ""} />
                    </div>
                  </section>
                ) : null}

                {/* 创作补充 */}
                {hasCreatorNotes ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      创作补充
                    </h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                      {profile?.creatorNotes}
                    </p>
                  </section>
                ) : null}
              </>
            ) : (
              /* Old location without profile */
              <div className="rounded-xl border border-dashed border-border/80 bg-card/40 px-4 py-8 text-center">
                <MapPin className="mx-auto h-6 w-6 text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">
                  尚未补充地点档案信息，可点击编辑完善。
                </p>
              </div>
            )}

            {hasMapCoords ? (
              <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h3 className="font-serif text-sm font-semibold text-foreground/90">地图位置</h3>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    <MapPin className="mr-1 inline-block h-3.5 w-3.5" />
                    {formatMapCoordLabel(entry.locationProfile!.mapX, entry.locationProfile!.mapY)}
                  </p>
                  <Link
                    href={`/project/${entry.projectId}/map?location=${entry.id}`}
                    className="shrink-0 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    在世界地图中查看 →
                  </Link>
                </div>
              </section>
            ) : null}

            <LocationHubSection
              entry={entry}
              projectEntries={projectEntries}
              onSelectEntry={onSelectEntry}
            />

            {/* Gallery */}
            <GalleryGrid
              images={entry.galleryImages}
              imageAltMap={entry.imageAltMap}
              onImageClick={openImage}
            />

            {/* Derived relations */}
            {hasDerivedRelations ? (
              <section className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  关联设定
                </h3>
                <dl className="space-y-2">
                  {residents.length > 0 ? (
                    <InfoRow
                      label="常驻角色"
                      value={residents.map((c) => c.title).join("、")}
                    />
                  ) : null}
                  {childLocations.length > 0 ? (
                    <InfoRow
                      label="下属地点"
                      value={childLocations.map((l) => l.title).join("、")}
                    />
                  ) : null}
                </dl>
                {/* Clickable resident cards */}
                <div className="space-y-1">
                  {residents.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectEntry(c)}
                      className="flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-2.5 text-left hover:bg-accent/50"
                    >
                      <span className="text-xs text-muted-foreground">
                        {ENTRY_TYPE_LABELS.character}
                      </span>
                      <span className="flex-1 text-sm font-medium">{c.title}</span>
                      {c.summary ? (
                        <span className="hidden text-xs text-muted-foreground line-clamp-1 sm:inline">
                          {c.summary}
                        </span>
                      ) : null}
                    </button>
                  ))}
                  {childLocations.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => onSelectEntry(l)}
                      className="flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-2.5 text-left hover:bg-accent/50"
                    >
                      <span className="text-xs text-muted-foreground">
                        {ENTRY_TYPE_LABELS.location}
                      </span>
                      <span className="flex-1 text-sm font-medium">{l.title}</span>
                      {l.summary ? (
                        <span className="hidden text-xs text-muted-foreground line-clamp-1 sm:inline">
                          {l.summary}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Rich text content (legacy / additional notes) */}
            {entry.content?.trim() ? (
              <section>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  附加笔记
                </h3>
                <EntryContentView content={entry.content} onImageClick={openImage} />
              </section>
            ) : null}

            {/* Generic related entries */}
            <RelatedEntries entries={relatedEntries} onSelect={onSelectRelated} />

            {/* Timestamps */}
            <div className="border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <p>
                {ENTRY_TYPE_LABELS.location} · 创建于 {formatDate(entry.createdAt)}
              </p>
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
