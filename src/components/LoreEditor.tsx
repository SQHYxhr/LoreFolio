"use client";

import { useState } from "react";
import { Pin, Star, X } from "lucide-react";
import type { Entry, EntryFormData, LoreProfile } from "@/types";
import { createEmptyLoreProfile } from "@/lib/lore-profile";
import { LORE_CATEGORY_LABELS, LORE_CATEGORIES, LORE_STATUS_LABELS, LORE_STATUSES } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImagePicker } from "@/components/ImagePicker";
import { GalleryEditor } from "@/components/GalleryEditor";
import { RichTextEditor } from "@/components/RichTextEditor";
import { TagInput } from "@/components/TagInput";
import { RelatedEntryPicker } from "@/components/RelatedEntryPicker";

interface LoreEditorProps {
  form: EntryFormData;
  setForm: React.Dispatch<React.SetStateAction<EntryFormData>>;
  entry: Entry | null;
  projectEntries: Entry[];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-sm font-semibold text-foreground/90">{children}</h3>
  );
}

function MultiEntryRefField({
  label,
  ids,
  entries,
  filterType,
  onChange,
}: {
  label: string;
  ids: string[];
  entries: Entry[];
  filterType: Entry["type"];
  onChange: (next: string[]) => void;
}) {
  const options = entries
    .filter((e) => e.type === filterType)
    .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));

  const addId = (id: string) => {
    if (!id || ids.includes(id)) return;
    onChange([...ids, id]);
  };

  const removeId = (id: string) => {
    onChange(ids.filter((x) => x !== id));
  };

  const unselected = options.filter((o) => !ids.includes(o.id));
  const resolved = ids.map((id) => entries.find((e) => e.id === id)).filter(Boolean) as Entry[];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {resolved.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {resolved.map((e) => (
            <span
              key={e.id}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs"
            >
              {e.title || "未命名条目"}
              <button
                type="button"
                onClick={() => removeId(e.id)}
                className="ml-0.5 text-muted-foreground hover:text-destructive"
                aria-label={`移除 ${e.title}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      {unselected.length > 0 ? (
        <select
          value=""
          onChange={(e) => addId(e.target.value)}
          className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">添加…</option>
          {unselected.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title || "未命名条目"}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-xs text-muted-foreground">已添加所有可选项</p>
      )}
    </div>
  );
}

export function LoreEditor({ form, setForm, entry, projectEntries }: LoreEditorProps) {
  const [inlineInsert, setInlineInsert] = useState<((url: string, alt?: string) => void) | null>(null);
  const [inlineAlt, setInlineAlt] = useState("");

  const profile = form.loreProfile ?? createEmptyLoreProfile();

  const setProfile = (patch: Partial<LoreProfile>) => {
    setForm((prev) => ({
      ...prev,
      loreProfile: { ...(prev.loreProfile ?? createEmptyLoreProfile()), ...patch },
    }));
  };

  const updateAltMap = (src: string, alt: string) => {
    setForm((prev) => ({ ...prev, imageAltMap: { ...prev.imageAltMap, [src]: alt } }));
  };

  return (
    <>
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>基础信息</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="lore-name">世界观名称</Label>
          <Input
            id="lore-name"
            placeholder="如：星落异象、苍岚纪年"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lore-summary">一句话摘要</Label>
          <Textarea
            id="lore-summary"
            placeholder="用一句话概括这个世界观设定"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="lore-category">世界观分类</Label>
            <select
              id="lore-category"
              value={profile.loreCategory}
              onChange={(e) => setProfile({ loreCategory: e.target.value as LoreProfile["loreCategory"] })}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...LORE_CATEGORIES] as const).map((c) => (
                <option key={c} value={c}>{LORE_CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lore-status">状态</Label>
            <select
              id="lore-status"
              value={profile.status}
              onChange={(e) => setProfile({ status: e.target.value as LoreProfile["status"] })}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...LORE_STATUSES] as const).map((s) => (
                <option key={s} value={s}>{LORE_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>核心设定</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="lore-core">核心概念</Label>
          <Textarea
            id="lore-core"
            placeholder="这个世界观设定的核心概念与定位"
            value={profile.coreConcept}
            onChange={(e) => setProfile({ coreConcept: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lore-rules">世界规则</Label>
          <Textarea
            id="lore-rules"
            placeholder="这个世界的基本物理/魔法/社会法则"
            value={profile.worldRules}
            onChange={(e) => setProfile({ worldRules: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lore-cosmology">宇宙观 / 起源</Label>
          <Textarea
            id="lore-cosmology"
            placeholder="世界的诞生、宇宙结构或神话起源"
            value={profile.cosmology}
            onChange={(e) => setProfile({ cosmology: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>体系设定</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="lore-magic">魔法 / 超自然体系</Label>
          <Textarea
            id="lore-magic"
            placeholder="魔法系统、能量来源、施法方式与限制"
            value={profile.magicSystem}
            onChange={(e) => setProfile({ magicSystem: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lore-tech">科技水平</Label>
          <Textarea
            id="lore-tech"
            placeholder="科技发展阶段、关键技术与社会影响"
            value={profile.technologyLevel}
            onChange={(e) => setProfile({ technologyLevel: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>社会与历史</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="lore-history">历史概述</Label>
          <Textarea
            id="lore-history"
            placeholder="世界的历史脉络、重大事件与时代划分"
            value={profile.historyOverview}
            onChange={(e) => setProfile({ historyOverview: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lore-culture">文化制度</Label>
          <Textarea
            id="lore-culture"
            placeholder="主要文化体系、社会制度、信仰与价值观"
            value={profile.culture}
            onChange={(e) => setProfile({ culture: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lore-conflicts">核心冲突</Label>
          <Textarea
            id="lore-conflicts"
            placeholder="世界中的核心矛盾、张力或悬而未决的问题"
            value={profile.conflicts}
            onChange={(e) => setProfile({ conflicts: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>关联条目</SectionTitle>
        <MultiEntryRefField
          label="关联地点"
          ids={profile.relatedLocationIds}
          entries={projectEntries}
          filterType="location"
          onChange={(relatedLocationIds) => setProfile({ relatedLocationIds })}
        />
        <MultiEntryRefField
          label="关联组织"
          ids={profile.relatedFactionIds}
          entries={projectEntries}
          filterType="faction"
          onChange={(relatedFactionIds) => setProfile({ relatedFactionIds })}
        />
        <MultiEntryRefField
          label="关联种族"
          ids={profile.relatedSpeciesIds}
          entries={projectEntries}
          filterType="species"
          onChange={(relatedSpeciesIds) => setProfile({ relatedSpeciesIds })}
        />
        <MultiEntryRefField
          label="关联事件"
          ids={profile.relatedEventIds}
          entries={projectEntries}
          filterType="event"
          onChange={(relatedEventIds) => setProfile({ relatedEventIds })}
        />
        <MultiEntryRefField
          label="关联物品"
          ids={profile.relatedItemIds}
          entries={projectEntries}
          filterType="item"
          onChange={(relatedItemIds) => setProfile({ relatedItemIds })}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>创作备注</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="lore-notes">创作备注</Label>
          <Textarea
            id="lore-notes"
            placeholder="关于这个世界观设定的创作想法与备注"
            value={profile.creatorNotes}
            onChange={(e) => setProfile({ creatorNotes: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>视觉资产</SectionTitle>
        <ImagePicker
          label="封面图"
          value={form.coverImage}
          alt={form.imageAltMap?.[form.coverImage] || ""}
          onChange={(src) => setForm({ ...form, coverImage: src })}
          onAltChange={(alt) => form.coverImage && updateAltMap(form.coverImage, alt)}
          onRemove={() => setForm({ ...form, coverImage: "" })}
        />
        <GalleryEditor
          images={form.galleryImages}
          imageAltMap={form.imageAltMap}
          onChange={(galleryImages, imageAltMap) => setForm({ ...form, galleryImages, imageAltMap })}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>附加笔记</SectionTitle>
        <p className="text-xs text-muted-foreground">可选：使用富文本记录更多世界观细节与补充设定。</p>
        <RichTextEditor
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          onInsertImage={(insert) => { setInlineAlt(""); setInlineInsert(() => insert); }}
        />
      </section>

      <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
      <RelatedEntryPicker entries={projectEntries} selectedIds={form.relatedEntryIds} currentEntryId={entry?.id} onChange={(relatedEntryIds) => setForm({ ...form, relatedEntryIds })} />

      <div className="flex gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFavorite} onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })} className="rounded border-input" />
          <Star className="h-3.5 w-3.5" />收藏
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} className="rounded border-input" />
          <Pin className="h-3.5 w-3.5" />置顶
        </label>
      </div>

      <Dialog open={!!inlineInsert} onOpenChange={(open) => !open && setInlineInsert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>插入正文图片</DialogTitle>
            <DialogDescription>图片将插入到附加笔记当前光标位置</DialogDescription>
          </DialogHeader>
          <ImagePicker label="正文插图" value="" alt={inlineAlt} onChange={(src) => { inlineInsert?.(src, inlineAlt || "设定插图"); setInlineInsert(null); }} onAltChange={setInlineAlt} />
        </DialogContent>
      </Dialog>
    </>
  );
}
