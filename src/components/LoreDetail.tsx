"use client";

import { useCallback, useMemo, useState } from "react";
import { BookOpen, Edit3, Pin, Star } from "lucide-react";
import type { Entry, LoreProfile } from "@/types";
import { ENTRY_TYPE_LABELS, LORE_CATEGORY_LABELS, LORE_STATUS_LABELS } from "@/types";
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

interface LoreDetailProps {
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

function InfoRow({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  if (!value.trim()) return null;
  const inner = <span className={cn("text-sm", onClick && "text-primary underline-offset-2 hover:underline")}>{value}</span>;
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{onClick ? <button type="button" onClick={onClick} className="text-left">{inner}</button> : inner}</dd>
    </div>
  );
}

function EntryRefList({ label, refs, onClick }: { label: string; refs: ResolvedEntryRef[]; onClick: (entry: Entry) => void }) {
  if (refs.length === 0) return null;
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      {refs.map((r) => r.entry ? (
        <dd key={r.id}>
          <button type="button" onClick={() => onClick(r.entry!)} className="flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-2.5 text-left text-sm hover:bg-accent/50">
            <span className="text-xs text-muted-foreground">{ENTRY_TYPE_LABELS[r.entry.type]}</span>
            <span className="flex-1 font-medium">{r.entry.title || "未命名条目"}</span>
          </button>
        </dd>
      ) : (
        <dd key={r.id}><span className="flex w-full items-center gap-3 rounded-lg border border-dashed border-border/60 bg-card/30 px-3 py-2.5 text-left text-sm text-muted-foreground">已删除条目</span></dd>
      ))}</div>
  );
}

function resolveRefs(ids: string[] | undefined, projectEntries: Entry[], type: string): ResolvedEntryRef[] {
  return (ids ?? []).map((id) => { const found = projectEntries.find((e) => e.id === id && e.type === type); return found ? { id, entry: found } : { id }; });
}

export function LoreDetail({ entry, projectEntries, relatedEntries, onEdit, onSelectRelated, onSelectEntry, onTagClick }: LoreDetailProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const openImage = useCallback((src: string, alt: string) => { setLightbox({ src, alt }); }, []);

  const profile: LoreProfile | undefined = entry.loreProfile;

  const refs = useMemo(() => ({
    locations: resolveRefs(profile?.relatedLocationIds, projectEntries, "location"),
    factions: resolveRefs(profile?.relatedFactionIds, projectEntries, "faction"),
    species: resolveRefs(profile?.relatedSpeciesIds, projectEntries, "species"),
    events: resolveRefs(profile?.relatedEventIds, projectEntries, "event"),
    items: resolveRefs(profile?.relatedItemIds, projectEntries, "item"),
  }), [profile, projectEntries]);

  const coverAlt = entry.coverImage ? getImageAlt(entry.coverImage, entry.imageAltMap, entry.title) : "";

  const hasProfile = !!profile && (!!profile.loreCategory || !!profile.status || !!profile.coreConcept.trim() || !!profile.worldRules.trim());

  const hasTextBody = hasProfile || (!!profile?.cosmology.trim()) || (!!profile?.historyOverview.trim()) || (!!profile?.magicSystem.trim()) || (!!profile?.technologyLevel.trim()) || (!!profile?.culture.trim()) || (!!profile?.conflicts.trim()) || (!!profile?.creatorNotes.trim());

  const hasRefs = refs.locations.length + refs.factions.length + refs.species.length + refs.events.length + refs.items.length > 0;

  return (
    <>
      <aside className="flex h-full w-full lg:w-[460px] shrink-0 flex-col bg-card/30">
        {entry.coverImage ? (
          <button type="button" onClick={() => openImage(entry.coverImage, coverAlt)} className="group relative h-52 w-full shrink-0 overflow-hidden">
            <img src={entry.coverImage} alt={coverAlt} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white backdrop-blur-sm">世界观档案</Badge>
                {entry.isPinned ? <Badge variant="secondary" className="gap-1 bg-white/20 text-white"><Pin className="h-3 w-3" /> 置顶</Badge> : null}
                {entry.isFavorite ? <Badge variant="secondary" className="gap-1 bg-white/20 text-white"><Star className="h-3 w-3 fill-amber-300 text-amber-300" /> 收藏</Badge> : null}
              </div>
              <h2 className="font-serif text-2xl font-semibold text-white drop-shadow">{entry.title || "未命名世界观"}</h2>
            </div>
          </button>
        ) : (
          <div className="border-b border-border/80 bg-gradient-to-b from-primary/5 to-transparent p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">世界观档案</Badge>
              {entry.isPinned ? <Badge variant="secondary" className="gap-1"><Pin className="h-3 w-3" /> 置顶</Badge> : null}
              {entry.isFavorite ? <Badge variant="secondary" className="gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 收藏</Badge> : null}
            </div>
            <h2 className="font-serif text-2xl font-semibold leading-tight">{entry.title || "未命名世界观"}</h2>
          </div>
        )}

        <div className="flex items-start justify-between gap-3 border-b border-border/80 px-5 py-3">
          <div className="min-w-0 flex-1 space-y-2">
            {entry.summary ? <p className="text-sm leading-relaxed text-muted-foreground">{entry.summary}</p> : null}
            {entry.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">{entry.tags.map((tag) => <button key={tag} type="button" onClick={() => onTagClick?.(tag)} className={cn("rounded-full border border-border bg-background/80 px-2.5 py-0.5 text-xs text-muted-foreground", onTagClick && "cursor-pointer hover:border-primary/40 hover:bg-primary/10 hover:text-primary")}>{tag}</button>)}</div>
            ) : null}
          </div>
          <Button size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={onEdit}><Edit3 className="h-3.5 w-3.5" />编辑</Button>
        </div>

        <ScrollArea className="flex-1">
          <article className="space-y-6 p-5">
            {hasProfile ? (
              <>
                <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">基础档案</h3>
                  <dl className="space-y-2">
                    {profile?.loreCategory ? <InfoRow label="分类" value={LORE_CATEGORY_LABELS[profile.loreCategory] || profile.loreCategory} /> : null}
                    {profile?.status ? <InfoRow label="状态" value={LORE_STATUS_LABELS[profile.status] || profile.status} /> : null}
                  </dl>
                </section>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border/80 bg-card/40 px-4 py-8 text-center">
                <BookOpen className="mx-auto h-6 w-6 text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">尚未补充世界观档案信息，可点击编辑完善。</p>
              </div>
            )}

            {hasTextBody ? (
              <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">核心设定</h3>
                <div className="space-y-4">
                  <ProfileBlock title="核心概念" text={profile?.coreConcept ?? ""} />
                  <ProfileBlock title="世界规则" text={profile?.worldRules ?? ""} />
                  <ProfileBlock title="宇宙观 / 起源" text={profile?.cosmology ?? ""} />
                  <ProfileBlock title="魔法 / 超自然体系" text={profile?.magicSystem ?? ""} />
                  <ProfileBlock title="科技水平" text={profile?.technologyLevel ?? ""} />
                  <ProfileBlock title="历史概述" text={profile?.historyOverview ?? ""} />
                  <ProfileBlock title="文化制度" text={profile?.culture ?? ""} />
                  <ProfileBlock title="核心冲突" text={profile?.conflicts ?? ""} />
                  {profile?.creatorNotes?.trim() ? <ProfileBlock title="创作备注" text={profile.creatorNotes} /> : null}
                </div>
              </section>
            ) : null}

            <GalleryGrid images={entry.galleryImages} imageAltMap={entry.imageAltMap} onImageClick={openImage} />

            {hasRefs ? (
              <section className="rounded-xl border border-border/70 bg-card/40 p-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">关联条目</h3>
                <div className="space-y-3">
                  <EntryRefList label="关联地点" refs={refs.locations} onClick={onSelectEntry} />
                  <EntryRefList label="关联组织" refs={refs.factions} onClick={onSelectEntry} />
                  <EntryRefList label="关联种族" refs={refs.species} onClick={onSelectEntry} />
                  <EntryRefList label="关联事件" refs={refs.events} onClick={onSelectEntry} />
                  <EntryRefList label="关联物品" refs={refs.items} onClick={onSelectEntry} />
                </div>
              </section>
            ) : null}

            {entry.content?.trim() ? (
              <section>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">附加笔记</h3>
                <EntryContentView content={entry.content} onImageClick={openImage} />
              </section>
            ) : null}

            <RelatedEntries entries={relatedEntries} onSelect={onSelectRelated} />

            <div className="border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <p>{ENTRY_TYPE_LABELS.lore} · 创建于 {formatDate(entry.createdAt)}</p>
              <p className="mt-1">更新于 {formatDate(entry.updatedAt)}</p>
            </div>
          </article>
        </ScrollArea>
      </aside>
      <ImageLightbox src={lightbox?.src ?? null} alt={lightbox?.alt} open={!!lightbox} onOpenChange={(open) => !open && setLightbox(null)} />
    </>
  );
}
