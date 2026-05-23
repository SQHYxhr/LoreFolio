"use client";

import { useState } from "react";
import { Pin, Star } from "lucide-react";
import type { CharacterProfile, Entry, EntryFormData } from "@/types";
import { createEmptyCharacterProfile } from "@/lib/character-profile";
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
import { AliasesInput } from "@/components/AliasesInput";
import { EntryRefSelect } from "@/components/EntryRefSelect";

interface CharacterEditorProps {
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

export function CharacterEditor({ form, setForm, entry, projectEntries }: CharacterEditorProps) {
  const [inlineInsert, setInlineInsert] = useState<((url: string, alt?: string) => void) | null>(null);
  const [inlineAlt, setInlineAlt] = useState("");

  const profile = form.characterProfile ?? createEmptyCharacterProfile();

  const setProfile = (patch: Partial<CharacterProfile>) => {
    setForm((prev) => ({
      ...prev,
      characterProfile: { ...(prev.characterProfile ?? createEmptyCharacterProfile()), ...patch },
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
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>基础信息</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="char-title">档案标题（列表显示名）</Label>
          <Input
            id="char-title"
            placeholder="如：林晚星"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-display-name">展示名称</Label>
          <Input
            id="char-display-name"
            placeholder="详情页主标题，可留空则使用档案标题"
            value={profile.displayName}
            onChange={(e) => setProfile({ displayName: e.target.value })}
          />
        </div>
        <AliasesInput aliases={profile.aliases} onChange={(aliases) => setProfile({ aliases })} />
        <div className="space-y-2">
          <Label htmlFor="char-summary">一句话摘要</Label>
          <Textarea
            id="char-summary"
            placeholder="用一句话介绍这个角色"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="char-pronouns">代称</Label>
            <Input
              id="char-pronouns"
              placeholder="她 / 他 / 他们"
              value={profile.pronouns}
              onChange={(e) => setProfile({ pronouns: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="char-age">年龄描述</Label>
            <Input
              id="char-age"
              placeholder="如：外表17，实际300岁"
              value={profile.ageText}
              onChange={(e) => setProfile({ ageText: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="char-gender">性别</Label>
            <Input
              id="char-gender"
              value={profile.gender}
              onChange={(e) => setProfile({ gender: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="char-identity">身份 / 职业</Label>
            <Input
              id="char-identity"
              value={profile.identity}
              onChange={(e) => setProfile({ identity: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-status">当前状态</Label>
          <Input
            id="char-status"
            placeholder="存活、失踪、幼年期…"
            value={profile.statusText}
            onChange={(e) => setProfile({ statusText: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-quote">代表台词</Label>
          <Input
            id="char-quote"
            placeholder="可选"
            value={profile.quote}
            onChange={(e) => setProfile({ quote: e.target.value })}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>世界关联</SectionTitle>
        <EntryRefSelect
          label="所属组织"
          value={profile.factionId}
          entries={projectEntries}
          filterType="faction"
          onChange={(factionId) => setProfile({ factionId })}
        />
        <EntryRefSelect
          label="常驻地点"
          value={profile.locationId}
          entries={projectEntries}
          filterType="location"
          onChange={(locationId) => setProfile({ locationId })}
        />
        <EntryRefSelect
          label="种族"
          value={profile.speciesId}
          entries={projectEntries}
          filterType="species"
          onChange={(speciesId) => setProfile({ speciesId })}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>形象与性格</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="char-appearance">外貌</Label>
          <Textarea
            id="char-appearance"
            value={profile.appearance}
            onChange={(e) => setProfile({ appearance: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-personality">性格</Label>
          <Textarea
            id="char-personality"
            value={profile.personality}
            onChange={(e) => setProfile({ personality: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>能力与目标</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="char-abilities">能力 / 技能</Label>
          <Textarea
            id="char-abilities"
            value={profile.abilities}
            onChange={(e) => setProfile({ abilities: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-goals">目标 / 执念</Label>
          <Textarea
            id="char-goals"
            value={profile.goals}
            onChange={(e) => setProfile({ goals: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>背景与补充</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="char-background">背景故事</Label>
          <Textarea
            id="char-background"
            value={profile.background}
            onChange={(e) => setProfile({ background: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="char-trivia">补充设定</Label>
          <Textarea
            id="char-trivia"
            value={profile.trivia}
            onChange={(e) => setProfile({ trivia: e.target.value })}
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
          onChange={(galleryImages, imageAltMap) =>
            setForm({ ...form, galleryImages, imageAltMap })
          }
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>附加笔记</SectionTitle>
        <p className="text-xs text-muted-foreground">
          可选：富文本自由记录；旧版角色正文会显示在详情页「附加笔记」
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
