"use client";

import { useEffect, useState } from "react";
import { Pin, Star, Trash2 } from "lucide-react";
import type { Entry, EntryFormData, EntryType } from "@/types";
import { createEmptyCharacterProfile } from "@/lib/character-profile";
import { createEmptyLocationProfile, wouldCreateLocationCycle } from "@/lib/location-profile";
import { createEmptyFactionProfile, wouldCreateFactionCycle } from "@/lib/faction-profile";
import { createEmptyItemProfile } from "@/lib/item-profile";
import { createEmptyEventProfile } from "@/lib/event-profile";
import { createEmptySpeciesProfile } from "@/lib/species-profile";
import { createEmptyLoreProfile } from "@/lib/lore-profile";
import { ENTRY_IMAGE_FIELDS, ENTRY_TYPE_LABELS, ENTRY_TYPES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { CharacterEditor } from "@/components/CharacterEditor";
import { LocationEditor } from "@/components/LocationEditor";
import { FactionEditor } from "@/components/FactionEditor";
import { ItemEditor } from "@/components/ItemEditor";
import { EventEditor } from "@/components/EventEditor";
import { SpeciesEditor } from "@/components/SpeciesEditor";
import { LoreEditor } from "@/components/LoreEditor";
import { Separator } from "@/components/ui/separator";

interface EntryEditorProps {
  entry: Entry | null;
  defaultType: EntryType;
  mode: "create" | "edit";
  projectEntries: Entry[];
  onSave: (data: EntryFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const emptyForm = (type: EntryType): EntryFormData => ({
  type,
  title: "",
  summary: "",
  content: "",
  isFavorite: false,
  isPinned: false,
  tags: [],
  relatedEntryIds: [],
  coverImage: ENTRY_IMAGE_FIELDS.coverImage,
  galleryImages: [...ENTRY_IMAGE_FIELDS.galleryImages],
  imageAltMap: { ...ENTRY_IMAGE_FIELDS.imageAltMap },
  ...(type === "character" ? { characterProfile: createEmptyCharacterProfile() } : {}),
  ...(type === "location" ? { locationProfile: createEmptyLocationProfile() } : {}),
  ...(type === "faction" ? { factionProfile: createEmptyFactionProfile() } : {}),
  ...(type === "item" ? { itemProfile: createEmptyItemProfile() } : {}),
  ...(type === "event" ? { eventProfile: createEmptyEventProfile() } : {}),
  ...(type === "species" ? { speciesProfile: createEmptySpeciesProfile() } : {}),
  ...(type === "lore" ? { loreProfile: createEmptyLoreProfile() } : {}),
});

export function EntryEditor({
  entry,
  defaultType,
  mode,
  projectEntries,
  onSave,
  onCancel,
  onDelete,
}: EntryEditorProps) {
  const [form, setForm] = useState<EntryFormData>(emptyForm(defaultType));
  const [inlineInsert, setInlineInsert] = useState<((url: string, alt?: string) => void) | null>(null);
  const [inlineAlt, setInlineAlt] = useState("");

  useEffect(() => {
    if (entry && mode === "edit") {
      setForm({
        type: entry.type,
        title: entry.title,
        summary: entry.summary,
        content: entry.content,
        isFavorite: entry.isFavorite,
        isPinned: entry.isPinned,
        tags: [...entry.tags],
        relatedEntryIds: [...entry.relatedEntryIds],
        coverImage: entry.coverImage,
        galleryImages: [...entry.galleryImages],
        imageAltMap: { ...(entry.imageAltMap ?? {}) },
        characterProfile:
          entry.type === "character"
            ? entry.characterProfile
              ? { ...entry.characterProfile, aliases: [...entry.characterProfile.aliases] }
              : createEmptyCharacterProfile()
            : undefined,
        locationProfile:
          entry.type === "location"
            ? entry.locationProfile
              ? { ...entry.locationProfile }
              : createEmptyLocationProfile()
            : undefined,
        factionProfile:
          entry.type === "faction"
            ? entry.factionProfile
              ? { ...entry.factionProfile }
              : createEmptyFactionProfile()
            : undefined,
        itemProfile:
          entry.type === "item"
            ? entry.itemProfile
              ? { ...entry.itemProfile }
              : createEmptyItemProfile()
            : undefined,
        eventProfile:
          entry.type === "event"
            ? entry.eventProfile
              ? { ...entry.eventProfile }
              : createEmptyEventProfile()
            : undefined,
        speciesProfile:
          entry.type === "species"
            ? entry.speciesProfile
              ? { ...entry.speciesProfile }
              : createEmptySpeciesProfile()
            : undefined,
        loreProfile:
          entry.type === "lore"
            ? entry.loreProfile
              ? { ...entry.loreProfile }
              : createEmptyLoreProfile()
            : undefined,
      });
    } else {
      setForm(emptyForm(defaultType));
    }
  }, [entry, mode, defaultType]);

  const handleTypeChange = (newType: EntryType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      ...(newType === "character" && !prev.characterProfile
        ? { characterProfile: createEmptyCharacterProfile() }
        : {}),
      ...(newType === "location" && !prev.locationProfile
        ? { locationProfile: createEmptyLocationProfile() }
        : {}),
      ...(newType === "faction" && !prev.factionProfile
        ? { factionProfile: createEmptyFactionProfile() }
        : {}),
      ...(newType === "item" && !prev.itemProfile
        ? { itemProfile: createEmptyItemProfile() }
        : {}),
      ...(newType === "event" && !prev.eventProfile
        ? { eventProfile: createEmptyEventProfile() }
        : {}),
      ...(newType === "species" && !prev.speciesProfile
        ? { speciesProfile: createEmptySpeciesProfile() }
        : {}),
      ...(newType === "lore" && !prev.loreProfile
        ? { loreProfile: createEmptyLoreProfile() }
        : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (entry && mode === "edit" && entry.type !== form.type) {
      if (
        !window.confirm(
          "更改条目类型将移除当前类型的专属档案内容，并可能删除相关结构化关系。此操作保存后无法自动恢复，是否继续？",
        )
      ) {
        return;
      }
    }

    if (
      form.type === "location" &&
      mode === "edit" &&
      entry &&
      form.locationProfile?.parentLocationId
    ) {
      if (
        wouldCreateLocationCycle(
          projectEntries,
          entry.id,
          form.locationProfile.parentLocationId,
        )
      ) {
        window.alert("无法设置该上级地点，因为这会形成循环层级关系。");
        return;
      }
    }

    if (
      form.type === "faction" &&
      mode === "edit" &&
      entry &&
      form.factionProfile?.parentFactionId
    ) {
      if (
        wouldCreateFactionCycle(
          projectEntries,
          entry.id,
          form.factionProfile.parentFactionId,
        )
      ) {
        window.alert("无法设置该上级组织，因为这会形成循环层级关系。");
        return;
      }
    }

    if (form.type === "character") {
      onSave({
        ...form,
        characterProfile: form.characterProfile ?? createEmptyCharacterProfile(),
      });
    } else if (form.type === "location") {
      onSave({
        ...form,
        locationProfile: form.locationProfile ?? createEmptyLocationProfile(),
      });
    } else if (form.type === "faction") {
      onSave({
        ...form,
        factionProfile: form.factionProfile ?? createEmptyFactionProfile(),
      });
    } else if (form.type === "item") {
      onSave({
        ...form,
        itemProfile: form.itemProfile ?? createEmptyItemProfile(),
      });
    } else if (form.type === "event") {
      onSave({
        ...form,
        eventProfile: form.eventProfile ?? createEmptyEventProfile(),
      });
    } else if (form.type === "species") {
      onSave({
        ...form,
        speciesProfile: form.speciesProfile ?? createEmptySpeciesProfile(),
      });
    } else if (form.type === "lore") {
      onSave({
        ...form,
        loreProfile: form.loreProfile ?? createEmptyLoreProfile(),
      });
    } else {
      onSave({
        type: form.type,
        title: form.title,
        summary: form.summary,
        content: form.content,
        coverImage: form.coverImage,
        galleryImages: form.galleryImages,
        imageAltMap: form.imageAltMap,
        isFavorite: form.isFavorite,
        isPinned: form.isPinned,
        tags: form.tags,
        relatedEntryIds: form.relatedEntryIds,
      });
    }
  };

  const updateAltMap = (src: string, alt: string) => {
    setForm((prev) => ({
      ...prev,
      imageAltMap: { ...prev.imageAltMap, [src]: alt },
    }));
  };

  const isCharacter = form.type === "character";
  const isLocation = form.type === "location";
  const isFaction = form.type === "faction";
  const isItem = form.type === "item";
  const isEvent = form.type === "event";
  const isSpecies = form.type === "species";
  const isLore = form.type === "lore";
  const isStructured = isCharacter || isLocation || isFaction || isItem || isEvent || isSpecies || isLore;

  return (
    <>
      <ScrollArea className="h-full">
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold">
                {mode === "create"
                  ? isCharacter
                    ? "新建角色档案"
                    : isLocation
                      ? "新建地点档案"
                      : isFaction
                        ? "新建组织档案"
                        : isItem
                          ? "新建物品档案"
                          : isEvent
                            ? "新建事件档案"
                            : isSpecies
                              ? "新建种族档案"
                              : isLore
                                ? "新建世界观档案"
                                : "新建条目"
                  : isCharacter
                    ? "编辑角色档案"
                    : isLocation
                      ? "编辑地点档案"
                      : isFaction
                        ? "编辑组织档案"
                        : isItem
                          ? "编辑物品档案"
                          : isEvent
                            ? "编辑事件档案"
                            : isSpecies
                              ? "编辑种族档案"
                              : isLore
                                ? "编辑世界观档案"
                                : "编辑条目"}
              </h2>
              {isCharacter ? (
                <p className="text-xs text-muted-foreground">结构化 OC / 人物设定</p>
              ) : isLocation ? (
                <p className="text-xs text-muted-foreground">结构化地点设定</p>
              ) : isFaction ? (
                <p className="text-xs text-muted-foreground">结构化组织 / 势力设定</p>
              ) : isItem ? (
                <p className="text-xs text-muted-foreground">结构化物品 / 道具设定</p>
              ) : isEvent ? (
                <p className="text-xs text-muted-foreground">结构化事件档案</p>
              ) : isSpecies ? (
                <p className="text-xs text-muted-foreground">结构化种族 / 物种设定</p>
              ) : isLore ? (
                <p className="text-xs text-muted-foreground">结构化世界观设定</p>
              ) : null}
            </div>
            <div className="flex gap-2">
              {mode === "edit" && onDelete ? (
                <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 className="h-3.5 w-3.5" />
                  删除
                </Button>
              ) : null}
              <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                取消
              </Button>
              <Button type="submit" size="sm">
                保存
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entry-type">类型</Label>
            <select
              id="entry-type"
              value={form.type}
              onChange={(e) => handleTypeChange(e.target.value as EntryType)}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {ENTRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ENTRY_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          {isCharacter ? (
            <CharacterEditor
              form={form}
              setForm={setForm}
              entry={entry}
              projectEntries={projectEntries}
            />
          ) : isLocation ? (
            <LocationEditor
              form={form}
              setForm={setForm}
              entry={entry}
              projectEntries={projectEntries}
            />
          ) : isFaction ? (
            <FactionEditor
              form={form}
              setForm={setForm}
              entry={entry}
              projectEntries={projectEntries}
            />
          ) : isItem ? (
            <ItemEditor
              form={form}
              setForm={setForm}
              entry={entry}
              projectEntries={projectEntries}
            />
          ) : isEvent ? (
            <EventEditor
              form={form}
              setForm={setForm}
              entry={entry}
              projectEntries={projectEntries}
            />
          ) : isSpecies ? (
            <SpeciesEditor
              form={form}
              setForm={setForm}
              entry={entry}
              projectEntries={projectEntries}
            />
          ) : isLore ? (
            <LoreEditor
              form={form}
              setForm={setForm}
              entry={entry}
              projectEntries={projectEntries}
            />
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="entry-title">标题</Label>
                <Input
                  id="entry-title"
                  placeholder="输入条目标题"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry-summary">摘要</Label>
                <Textarea
                  id="entry-summary"
                  placeholder="一句话概括这条设定"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={2}
                />
              </div>

              <Separator />

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

              <Separator />

              <div className="space-y-2">
                <Label>详细内容</Label>
                <RichTextEditor
                  value={form.content}
                  onChange={(content) => setForm({ ...form, content })}
                  onInsertImage={(insert) => {
                    setInlineAlt("");
                    setInlineInsert(() => insert);
                  }}
                />
              </div>

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
            </>
          )}
        </form>
      </ScrollArea>

      {!isStructured ? (
        <Dialog open={!!inlineInsert} onOpenChange={(open) => !open && setInlineInsert(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>插入正文图片</DialogTitle>
              <DialogDescription>图片将插入到正文当前光标位置</DialogDescription>
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
      ) : null}
    </>
  );
}
