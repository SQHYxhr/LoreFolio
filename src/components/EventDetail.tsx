"use client";

import { useCallback, useMemo, useState } from "react";
import { Calendar, Edit3, Pin, Star } from "lucide-react";
import type { Entry, EventProfile } from "@/types";
import { ENTRY_TYPE_LABELS, EVENT_CATEGORY_LABELS, EVENT_STATUS_LABELS } from "@/types";
import { getImageAlt } from "@/lib/images";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EntryContentView } from "@/components/EntryContentView";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ImageLightbox } from "@/components/ImageLightbox";
import { RelatedEntries } from "@/components/RelatedEntries";

type ResolvedEntryRef = { id: string; entry?: Entry };

interface EventDetailProps {
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

function EntryRefList({
  label,
  refs,
  onClick,
}: {
  label: string;
  refs: ResolvedEntryRef[];
  onClick: (entry: Entry) => void;
}) {
  if (refs.length === 0) return null;
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      {refs.map((r) =>
        r.entry ? (
          <dd key={r.id}>
            <button
              type="button"
              onClick={() => onClick(r.entry!)}
              className="flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-2.5 text-left text-sm hover:bg-accent/50"
            >
              <span className="text-xs text-muted-foreground">{ENTRY_TYPE_LABELS[r.entry.type]}</span>
              <span className="flex-1 font-medium">{r.entry.title || "未命名条目"}</span>
            </button>
          </dd>
        ) : (
          <dd key={r.id}>
            <span className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border/60 bg-card/30 px-3 py-2.5 text-left text-sm text-muted-foreground">
              已删除条目
            </span>
          </dd>
        ),
      )}
    </div>
  );
}

export function EventDetail({
  entry,
  projectEntries,
  relatedEntries,
  onEdit,
  onSelectRelated,
  onSelectEntry,
  onTagClick,
}: EventDetailProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const openImage = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const profile: EventProfile | undefined = entry.eventProfile;

  const locationEntry = useMemo(
    () =>
      profile?.locationId
        ? projectEntries.find((e) => e.id === profile.locationId && e.type === "location")
        : undefined,
    [profile?.locationId, projectEntries],
  );

  const primaryFaction = useMemo(
    () =>
      profile?.primaryFactionId
        ? projectEntries.find((e) => e.id === profile.primaryFactionId && e.type === "faction")
        : undefined,
    [profile?.primaryFactionId, projectEntries],
  );

  const participantCharacters: ResolvedEntryRef[] = useMemo(
    () =>
      profile?.participantCharacterIds?.map((id) => {
        const found = projectEntries.find((e) => e.id === id && e.type === "character");
        return found ? { id, entry: found } : { id };
      }) ?? [],
    [profile?.participantCharacterIds, projectEntries],
  );

  const involvedFactions: ResolvedEntryRef[] = useMemo(
    () =>
      profile?.involvedFactionIds?.map((id) => {
        const found = projectEntries.find((e) => e.id === id && e.type === "faction");
        return found ? { id, entry: found } : { id };
      }) ?? [],
    [profile?.involvedFactionIds, projectEntries],
  );

  const relatedItems: ResolvedEntryRef[] = useMemo(
    () =>
      profile?.relatedItemIds?.map((id) => {
        const found = projectEntries.find((e) => e.id === id && e.type === "item");
        return found ? { id, entry: found } : { id };
      }) ?? [],
    [profile?.relatedItemIds, projectEntries],
  );

  const coverAlt = entry.coverImage
    ? getImageAlt(entry.coverImage, entry.imageAltMap, entry.title)
    : "";

  const hasProfile =
    !!profile &&
    (!!profile.eventCategory ||
      !!profile.status ||
      !!profile.chronology.trim() ||
      !!profile.startDateText.trim() ||
      !!profile.endDateText.trim() ||
      !!profile.locationId ||
      !!profile.primaryFactionId ||
      (profile.participantCharacterIds?.length ?? 0) > 0 ||
      (profile.involvedFactionIds?.length ?? 0) > 0 ||
      (profile.relatedItemIds?.length ?? 0) > 0 ||
      !!profile.cause.trim() ||
      !!profile.process.trim() ||
      !!profile.result.trim() ||
      !!profile.impact.trim() ||
      !!profile.aftermath.trim() ||
      !!profile.creatorNotes.trim());

  const hasBasicInfo = !!profile?.eventCategory || !!profile?.status;
  const hasTimeInfo =
    (!!profile?.chronology.trim()) ||
    (!!profile?.startDateText.trim()) ||
    (!!profile?.endDateText.trim());
  const hasLocationOrFaction = !!profile?.locationId || !!profile?.primaryFactionId;
  const hasParticipants = (profile?.participantCharacterIds?.length ?? 0) > 0;
  const hasInvolvedFactions = (profile?.involvedFactionIds?.length ?? 0) > 0;
  const hasRelatedItems = (profile?.relatedItemIds?.length ?? 0) > 0;
  const hasNarrative =
    (!!profile?.cause.trim()) ||
    (!!profile?.process.trim()) ||
    (!!profile?.result.trim());
  const hasAftermath =
    (!!profile?.impact.trim()) ||
    (!!profile?.aftermath.trim()) ||
    (!!profile?.creatorNotes.trim());

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
                  事件档案
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
                {entry.title || "未命名事件"}
              </h2>
            </div>
          </button>
        ) : (
          <div className="border-b border-border/80 bg-gradient-to-b from-primary/5 to-transparent p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">事件档案</Badge>
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
              {entry.title || "未命名事件"}
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
                      {profile?.eventCategory ? (
                        <InfoRow
                          label="事件类型"
                          value={EVENT_CATEGORY_LABELS[profile.eventCategory] || profile.eventCategory}
                        />
                      ) : null}
                      {profile?.status ? (
                        <InfoRow
                          label="状态"
                          value={EVENT_STATUS_LABELS[profile.status] || profile.status}
                        />
                      ) : null}
                    </dl>
                  </section>
                ) : null}

                {/* 时间 / 纪年 */}
                {hasTimeInfo ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      时间 / 纪年
                    </h3>
                    <dl className="space-y-2">
                      <InfoRow label="纪年法" value={profile?.chronology ?? ""} />
                      <InfoRow label="起始时间" value={profile?.startDateText ?? ""} />
                      <InfoRow label="结束时间" value={profile?.endDateText ?? ""} />
                    </dl>
                  </section>
                ) : null}

                {/* 地点与主要组织 */}
                {hasLocationOrFaction ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      地点与主要组织
                    </h3>
                    <dl className="space-y-2">
                      <InfoRow
                        label="发生地点"
                        value={locationEntry?.title ?? "已删除条目"}
                        onClick={locationEntry ? () => onSelectEntry(locationEntry) : undefined}
                      />
                      <InfoRow
                        label="主要组织"
                        value={primaryFaction?.title ?? "已删除条目"}
                        onClick={primaryFaction ? () => onSelectEntry(primaryFaction) : undefined}
                      />
                    </dl>
                  </section>
                ) : null}

                {/* 参与角色 */}
                {hasParticipants ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      参与角色
                    </h3>
                    <EntryRefList
                      label=""
                      refs={participantCharacters}
                      onClick={onSelectEntry}
                    />
                  </section>
                ) : null}

                {/* 涉及组织 */}
                {hasInvolvedFactions ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      涉及组织
                    </h3>
                    <EntryRefList
                      label=""
                      refs={involvedFactions}
                      onClick={onSelectEntry}
                    />
                  </section>
                ) : null}

                {/* 相关物品 */}
                {hasRelatedItems ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      相关物品
                    </h3>
                    <EntryRefList
                      label=""
                      refs={relatedItems}
                      onClick={onSelectEntry}
                    />
                  </section>
                ) : null}

                {/* 起因 / 经过 / 结果 */}
                {hasNarrative ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      起因 / 经过 / 结果
                    </h3>
                    <div className="space-y-4">
                      <ProfileBlock title="起因" text={profile?.cause ?? ""} />
                      <ProfileBlock title="经过" text={profile?.process ?? ""} />
                      <ProfileBlock title="结果" text={profile?.result ?? ""} />
                    </div>
                  </section>
                ) : null}

                {/* 影响 / 后续 / 创作备注 */}
                {hasAftermath ? (
                  <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      影响与后续
                    </h3>
                    <div className="space-y-4">
                      <ProfileBlock title="影响" text={profile?.impact ?? ""} />
                      <ProfileBlock title="后续发展" text={profile?.aftermath ?? ""} />
                      {profile?.creatorNotes?.trim() ? (
                        <ProfileBlock title="创作备注" text={profile.creatorNotes} />
                      ) : null}
                    </div>
                  </section>
                ) : null}
              </>
            ) : (
              /* Old event without profile */
              <div className="rounded-xl border border-dashed border-border/80 bg-card/40 px-4 py-8 text-center">
                <Calendar className="mx-auto h-6 w-6 text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">
                  尚未补充事件档案信息，可点击编辑完善。
                </p>
              </div>
            )}

            {/* Gallery */}
            <GalleryGrid
              images={entry.galleryImages}
              imageAltMap={entry.imageAltMap}
              onImageClick={openImage}
            />

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
                {ENTRY_TYPE_LABELS.event} · 创建于 {formatDate(entry.createdAt)}
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
