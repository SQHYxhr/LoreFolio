"use client";

import { useState } from "react";
import { Pin, Star, X } from "lucide-react";
import type { Entry, EntryFormData, SpeciesProfile } from "@/types";
import { createEmptySpeciesProfile } from "@/lib/species-profile";
import { SPECIES_CATEGORY_LABELS, SPECIES_CATEGORIES, SPECIES_STATUS_LABELS, SPECIES_STATUSES } from "@/types";
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
import { EntryRefSelect } from "@/components/EntryRefSelect";

interface SpeciesEditorProps {
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

  const resolved = ids
    .map((id) => entries.find((e) => e.id === id))
    .filter(Boolean) as Entry[];

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

export function SpeciesEditor({ form, setForm, entry, projectEntries }: SpeciesEditorProps) {
  const [inlineInsert, setInlineInsert] = useState<((url: string, alt?: string) => void) | null>(null);
  const [inlineAlt, setInlineAlt] = useState("");

  const profile = form.speciesProfile ?? createEmptySpeciesProfile();

  const setProfile = (patch: Partial<SpeciesProfile>) => {
    setForm((prev) => ({
      ...prev,
      speciesProfile: { ...(prev.speciesProfile ?? createEmptySpeciesProfile()), ...patch },
    }));
  };

  const updateAltMap = (src: string, alt: string) => {
    setForm((prev) => ({
      ...prev,
      imageAltMap: { ...prev.imageAltMap, [src]: alt },
    }));
  };

  return (
    <>
      {/* ── 基础信息 ──────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>基础信息</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="species-name">种族 / 物种名称</Label>
          <Input
            id="species-name"
            placeholder="如：云栖狐"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species-summary">一句话摘要</Label>
          <Textarea
            id="species-summary"
            placeholder="用一句话介绍这个种族或物种"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="species-category">种族分类</Label>
            <select
              id="species-category"
              value={profile.speciesCategory}
              onChange={(e) =>
                setProfile({ speciesCategory: e.target.value as SpeciesProfile["speciesCategory"] })
              }
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...SPECIES_CATEGORIES] as const).map((c) => (
                <option key={c} value={c}>
                  {SPECIES_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="species-status">状态</Label>
            <select
              id="species-status"
              value={profile.status}
              onChange={(e) =>
                setProfile({ status: e.target.value as SpeciesProfile["status"] })
              }
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...SPECIES_STATUSES] as const).map((s) => (
                <option key={s} value={s}>
                  {SPECIES_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── 栖息地与关联 ──────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>栖息地与关联</SectionTitle>
        <EntryRefSelect
          label="主要栖息地"
          value={profile.habitatLocationId}
          entries={projectEntries}
          filterType="location"
          onChange={(habitatLocationId) => setProfile({ habitatLocationId })}
        />
        <MultiEntryRefField
          label="相关组织（可多选）"
          ids={profile.relatedFactionIds}
          entries={projectEntries}
          filterType="faction"
          onChange={(relatedFactionIds) => setProfile({ relatedFactionIds })}
        />
        <MultiEntryRefField
          label="代表角色（可多选）"
          ids={profile.representativeCharacterIds}
          entries={projectEntries}
          filterType="character"
          onChange={(representativeCharacterIds) => setProfile({ representativeCharacterIds })}
        />
      </section>

      {/* ── 生理与能力 ────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>生理与能力</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="species-appearance">外貌特征</Label>
          <Textarea
            id="species-appearance"
            placeholder="该种族 / 物种的外貌、体型、独特标识等"
            value={profile.appearance}
            onChange={(e) => setProfile({ appearance: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species-physiology">生理 / 生态特征</Label>
          <Textarea
            id="species-physiology"
            placeholder="该种族 / 物种的生理结构、生命周期、生态习性等"
            value={profile.physiology}
            onChange={(e) => setProfile({ physiology: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species-abilities">能力与天赋</Label>
          <Textarea
            id="species-abilities"
            placeholder="该种族 / 物种的独特能力、天赋、魔法或感应等"
            value={profile.abilities}
            onChange={(e) => setProfile({ abilities: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      {/* ── 文化与历史 ────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>文化与历史</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="species-culture">文化 / 习俗 / 社会结构</Label>
          <Textarea
            id="species-culture"
            placeholder="该种族 / 物种的文化传统、社会结构、价值观与生活方式"
            value={profile.culture}
            onChange={(e) => setProfile({ culture: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species-history">历史与起源</Label>
          <Textarea
            id="species-history"
            placeholder="该种族 / 物种的起源传说、重大历史事件与演化脉络"
            value={profile.history}
            onChange={(e) => setProfile({ history: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species-distribution">分布范围</Label>
          <Textarea
            id="species-distribution"
            placeholder="该种族 / 物种的地理分布、栖息区域与迁移模式"
            value={profile.distribution}
            onChange={(e) => setProfile({ distribution: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species-relations">与其他族群关系</Label>
          <Textarea
            id="species-relations"
            placeholder="该种族 / 物种与人类或其他智慧种族的关系、态度与互动模式"
            value={profile.relationshipWithHumans}
            onChange={(e) => setProfile({ relationshipWithHumans: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      {/* ── 创作备注 ──────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>创作备注</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="species-creator-notes">创作备注</Label>
          <Textarea
            id="species-creator-notes"
            placeholder="关于该种族的创作想法、灵感来源或待定设定"
            value={profile.creatorNotes}
            onChange={(e) => setProfile({ creatorNotes: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      {/* ── 视觉资产 ──────────────────────────────────────────── */}
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
          onChange={(galleryImages, imageAltMap) =>
            setForm({ ...form, galleryImages, imageAltMap })
          }
        />
      </section>

      {/* ── 附加笔记 ──────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>附加笔记</SectionTitle>
        <p className="text-xs text-muted-foreground">
          可选：使用富文本记录更多种族细节与补充设定。
        </p>
        <RichTextEditor
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          onInsertImage={(insert) => {
            setInlineAlt("");
            setInlineInsert(() => insert);
          }}
        />
      </section>

      <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />

      <RelatedEntryPicker
        entries={projectEntries}
        selectedIds={form.relatedEntryIds}
        currentEntryId={entry?.id}
        onChange={(relatedEntryIds) => setForm({ ...form, relatedEntryIds })}
      />

      <div className="flex gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFavorite}
            onChange={(e) => setForm({ ...form, isFavorite: e.target.checked })}
            className="rounded border-input"
          />
          <Star className="h-3.5 w-3.5" />
          收藏
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPinned}
            onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
            className="rounded border-input"
          />
          <Pin className="h-3.5 w-3.5" />
          置顶
        </label>
      </div>

      <Dialog open={!!inlineInsert} onOpenChange={(open) => !open && setInlineInsert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>插入正文图片</DialogTitle>
            <DialogDescription>图片将插入到附加笔记当前光标位置</DialogDescription>
          </DialogHeader>
          <ImagePicker
            label="正文插图"
            value=""
            alt={inlineAlt}
            onChange={(src) => {
              inlineInsert?.(src, inlineAlt || "设定插图");
              setInlineInsert(null);
            }}
            onAltChange={setInlineAlt}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
