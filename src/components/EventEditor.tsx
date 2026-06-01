"use client";

import { useState } from "react";
import { Pin, Star, X } from "lucide-react";
import type { Entry, EntryFormData, EventProfile } from "@/types";
import { createEmptyEventProfile } from "@/lib/event-profile";
import { EVENT_CATEGORY_LABELS, EVENT_CATEGORIES, EVENT_STATUS_LABELS, EVENT_STATUSES } from "@/types";
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

interface EventEditorProps {
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

/** Minimal multi-entry reference editor — add / remove IDs via dropdown + badge list. */
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

export function EventEditor({ form, setForm, entry, projectEntries }: EventEditorProps) {
  const [inlineInsert, setInlineInsert] = useState<((url: string, alt?: string) => void) | null>(null);
  const [inlineAlt, setInlineAlt] = useState("");

  const profile = form.eventProfile ?? createEmptyEventProfile();

  const setProfile = (patch: Partial<EventProfile>) => {
    setForm((prev) => ({
      ...prev,
      eventProfile: { ...(prev.eventProfile ?? createEmptyEventProfile()), ...patch },
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
          <Label htmlFor="event-name">事件名称</Label>
          <Input
            id="event-name"
            placeholder="如：边境冲突·霜线"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-summary">一句话摘要</Label>
          <Textarea
            id="event-summary"
            placeholder="用一句话概括这个事件"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="event-category">事件类型</Label>
            <select
              id="event-category"
              value={profile.eventCategory}
              onChange={(e) =>
                setProfile({ eventCategory: e.target.value as EventProfile["eventCategory"] })
              }
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...EVENT_CATEGORIES] as const).map((c) => (
                <option key={c} value={c}>
                  {EVENT_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-status">状态</Label>
            <select
              id="event-status"
              value={profile.status}
              onChange={(e) =>
                setProfile({ status: e.target.value as EventProfile["status"] })
              }
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...EVENT_STATUSES] as const).map((s) => (
                <option key={s} value={s}>
                  {EVENT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── 时间 / 纪年 ────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>时间 / 纪年</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="event-chronology">纪年法</Label>
          <Input
            id="event-chronology"
            placeholder="如：星历纪元、苍岚纪年"
            value={profile.chronology}
            onChange={(e) => setProfile({ chronology: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="event-start">起始时间</Label>
            <Input
              id="event-start"
              placeholder="如：102 年秋"
              value={profile.startDateText}
              onChange={(e) => setProfile({ startDateText: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-end">结束时间</Label>
            <Input
              id="event-end"
              placeholder="如：104 年春（留空表示瞬时事件或至今）"
              value={profile.endDateText}
              onChange={(e) => setProfile({ endDateText: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* ── 地点与主要组织 ─────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>地点与主要组织</SectionTitle>
        <EntryRefSelect
          label="发生地点"
          value={profile.locationId}
          entries={projectEntries}
          filterType="location"
          onChange={(locationId) => setProfile({ locationId })}
        />
        <EntryRefSelect
          label="主要相关组织"
          value={profile.primaryFactionId}
          entries={projectEntries}
          filterType="faction"
          onChange={(primaryFactionId) => setProfile({ primaryFactionId })}
        />
      </section>

      {/* ── 参与角色 ────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>参与角色</SectionTitle>
        <MultiEntryRefField
          label="选择参与此事件的角色"
          ids={profile.participantCharacterIds}
          entries={projectEntries}
          filterType="character"
          onChange={(participantCharacterIds) => setProfile({ participantCharacterIds })}
        />
      </section>

      {/* ── 涉及组织 ────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>涉及组织</SectionTitle>
        <MultiEntryRefField
          label="选择涉及此事件的组织（可多选）"
          ids={profile.involvedFactionIds}
          entries={projectEntries}
          filterType="faction"
          onChange={(involvedFactionIds) => setProfile({ involvedFactionIds })}
        />
      </section>

      {/* ── 相关物品 ────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>相关物品</SectionTitle>
        <MultiEntryRefField
          label="选择与此事件相关的物品（可多选）"
          ids={profile.relatedItemIds}
          entries={projectEntries}
          filterType="item"
          onChange={(relatedItemIds) => setProfile({ relatedItemIds })}
        />
      </section>

      {/* ── 起因 / 经过 / 结果 ──────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>起因 / 经过 / 结果</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="event-cause">起因</Label>
          <Textarea
            id="event-cause"
            placeholder="事件的起因与导火索"
            value={profile.cause}
            onChange={(e) => setProfile({ cause: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-process">经过</Label>
          <Textarea
            id="event-process"
            placeholder="事件的主要过程、关键节点与转折点"
            value={profile.process}
            onChange={(e) => setProfile({ process: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-result">结果</Label>
          <Textarea
            id="event-result"
            placeholder="事件的直接结果"
            value={profile.result}
            onChange={(e) => setProfile({ result: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      {/* ── 影响 / 后续 ─────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>影响 / 后续</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="event-impact">影响</Label>
          <Textarea
            id="event-impact"
            placeholder="事件的深远影响、对世界格局或角色的改变"
            value={profile.impact}
            onChange={(e) => setProfile({ impact: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-aftermath">后续发展</Label>
          <Textarea
            id="event-aftermath"
            placeholder="事件之后的连锁反应与发展方向"
            value={profile.aftermath}
            onChange={(e) => setProfile({ aftermath: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-creator-notes">创作备注</Label>
          <Textarea
            id="event-creator-notes"
            placeholder="关于该事件的创作想法、灵感来源或待定设定"
            value={profile.creatorNotes}
            onChange={(e) => setProfile({ creatorNotes: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      {/* ── 视觉资产 ────────────────────────────────────────────── */}
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

      {/* ── 附加笔记 ────────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>附加笔记</SectionTitle>
        <p className="text-xs text-muted-foreground">
          可选：使用富文本记录更多事件细节与补充设定。
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
