"use client";

import { useEffect, useState } from "react";
import { Pin, Star, Trash2 } from "lucide-react";
import type { Entry, EntryFormData, EntryType } from "@/types";
import { createEmptyCharacterProfile } from "@/lib/character-profile";
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
      });
    } else {
      setForm(emptyForm(defaultType));
    }
  }, [entry, mode, defaultType]);

  const handleTypeChange = (newType: EntryType) => {
    if (newType === "character") {
      setForm((prev) => ({
        ...prev,
        type: newType,
        characterProfile: prev.characterProfile ?? createEmptyCharacterProfile(),
      }));
    } else {
      setForm((prev) => {
        const next = { ...prev, type: newType };
        delete next.characterProfile;
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (form.type === "character") {
      onSave({
        ...form,
        characterProfile: form.characterProfile ?? createEmptyCharacterProfile(),
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
                    : "新建条目"
                  : isCharacter
                    ? "编辑角色档案"
                    : "编辑条目"}
              </h2>
              {isCharacter ? (
                <p className="text-xs text-muted-foreground">结构化 OC / 人物设定</p>
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

      {!isCharacter ? (
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
