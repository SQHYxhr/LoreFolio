"use client";

import { useCallback, useMemo, useState } from "react";
import { Edit3, Pin, Quote, Star } from "lucide-react";
import type { CharacterProfile, Entry } from "@/types";
import { ENTRY_TYPE_LABELS } from "@/types";
import { getCharacterDisplayName } from "@/lib/character-profile";
import { getImageAlt } from "@/lib/images";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EntryContentView } from "@/components/EntryContentView";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ImageLightbox } from "@/components/ImageLightbox";
import { RelatedEntries } from "@/components/RelatedEntries";

interface CharacterDetailProps {
  entry: Entry;
  profile: CharacterProfile;
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
    <div className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-0.5">
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

export function CharacterDetail({
  entry,
  profile,
  projectEntries,
  relatedEntries,
  onEdit,
  onSelectRelated,
  onSelectEntry,
  onTagClick,
}: CharacterDetailProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const displayName = getCharacterDisplayName(entry);

  const openImage = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const resolveRef = useCallback(
    (id: string) => projectEntries.find((e) => e.id === id),
    [projectEntries],
  );

  const faction = useMemo(() => resolveRef(profile.factionId), [profile.factionId, resolveRef]);
  const location = useMemo(() => resolveRef(profile.locationId), [profile.locationId, resolveRef]);
  const species = useMemo(() => resolveRef(profile.speciesId), [profile.speciesId, resolveRef]);

  const coverAlt = entry.coverImage
    ? getImageAlt(entry.coverImage, entry.imageAltMap, displayName)
    : "";

  const hasBasicInfo =
    profile.aliases.length > 0 ||
    profile.pronouns ||
    profile.ageText ||
    profile.gender ||
    profile.identity ||
    profile.statusText ||
    faction ||
    location ||
    species;

  const hasProfileBody =
    profile.appearance ||
    profile.personality ||
    profile.abilities ||
    profile.goals ||
    profile.background ||
    profile.trivia;

  const legacyContent = entry.content?.trim();

  return (
    <>
      <aside className="flex h-full w-[460px] shrink-0 flex-col bg-card/30">
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
                <Badge className="bg-white/20 text-white backdrop-blur-sm">角色档案</Badge>
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
              <h2 className="font-serif text-2xl font-semibold text-white drop-shadow">{displayName}</h2>
              {entry.title && entry.title !== displayName ? (
                <p className="mt-0.5 text-sm text-white/80">档案名：{entry.title}</p>
              ) : null}
            </div>
          </button>
        ) : (
          <div className="border-b border-border/80 bg-gradient-to-b from-primary/5 to-transparent p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">角色档案</Badge>
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
            <h2 className="font-serif text-2xl font-semibold leading-tight">{displayName}</h2>
          </div>
        )}

        <div className="flex items-start justify-between gap-3 border-b border-border/80 px-5 py-3">
          <div className="min-w-0 flex-1 space-y-2">
            {entry.summary ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>
            ) : null}
            {profile.quote ? (
              <blockquote className="flex gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm italic text-foreground/80">
                <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span>{profile.quote}</span>
              </blockquote>
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
            {hasBasicInfo ? (
              <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  基础信息
                </h3>
                <dl className="space-y-2">
                  {profile.aliases.length > 0 ? (
                    <div className="grid grid-cols-[4.5rem_1fr] gap-x-3">
                      <dt className="text-xs text-muted-foreground">别名</dt>
                      <dd className="text-sm">{profile.aliases.join(" · ")}</dd>
                    </div>
                  ) : null}
                  <InfoRow label="代称" value={profile.pronouns} />
                  <InfoRow label="年龄" value={profile.ageText} />
                  <InfoRow label="性别" value={profile.gender} />
                  <InfoRow label="身份" value={profile.identity} />
                  <InfoRow label="状态" value={profile.statusText} />
                  <InfoRow
                    label="组织"
                    value={faction?.title ?? ""}
                    onClick={faction ? () => onSelectEntry(faction) : undefined}
                  />
                  <InfoRow
                    label="地点"
                    value={location?.title ?? ""}
                    onClick={location ? () => onSelectEntry(location) : undefined}
                  />
                  <InfoRow
                    label="种族"
                    value={species?.title ?? ""}
                    onClick={species ? () => onSelectEntry(species) : undefined}
                  />
                </dl>
              </section>
            ) : null}

            <GalleryGrid
              images={entry.galleryImages}
              imageAltMap={entry.imageAltMap}
              onImageClick={openImage}
            />

            {hasProfileBody ? (
              <div className="space-y-5 rounded-xl border border-border/70 bg-card/20 p-4">
                <ProfileBlock title="外貌" text={profile.appearance} />
                <ProfileBlock title="性格" text={profile.personality} />
                <ProfileBlock title="能力" text={profile.abilities} />
                <ProfileBlock title="目标" text={profile.goals} />
                <ProfileBlock title="背景故事" text={profile.background} />
                <ProfileBlock title="补充设定" text={profile.trivia} />
              </div>
            ) : null}

            {legacyContent ? (
              <section>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  附加笔记
                </h3>
                <EntryContentView content={entry.content} onImageClick={openImage} />
              </section>
            ) : null}

            <RelatedEntries entries={relatedEntries} onSelect={onSelectRelated} />

            <div className="border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <p>
                {ENTRY_TYPE_LABELS.character} · 创建于 {formatDate(entry.createdAt)}
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
