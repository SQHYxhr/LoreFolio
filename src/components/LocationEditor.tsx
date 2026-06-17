"use client";

import { useState } from "react";
import { Pin, Star } from "lucide-react";
import type { Entry, EntryFormData, LocationProfile } from "@/types";
import { createEmptyLocationProfile } from "@/lib/location-profile";
import { clamp01, toMapPercent } from "@/lib/map-coordinates";
import { LOCATION_CATEGORY_LABELS, LOCATION_CATEGORIES, LOCATION_STATUS_LABELS, LOCATION_STATUSES } from "@/types";
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

interface LocationEditorProps {
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

export function LocationEditor({ form, setForm, entry, projectEntries }: LocationEditorProps) {
  const [inlineInsert, setInlineInsert] = useState<((url: string, alt?: string) => void) | null>(null);
  const [inlineAlt, setInlineAlt] = useState("");

  const profile = form.locationProfile ?? createEmptyLocationProfile();

  const setProfile = (patch: Partial<LocationProfile>) => {
    setForm((prev) => ({
      ...prev,
      locationProfile: { ...(prev.locationProfile ?? createEmptyLocationProfile()), ...patch },
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
          <Label htmlFor="loc-title">地点名称</Label>
          <Input
            id="loc-title"
            placeholder="如：星落学院"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loc-summary">一句话摘要</Label>
          <Textarea
            id="loc-summary"
            placeholder="用一句话介绍这个地点"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="loc-category">地点分类</Label>
            <select
              id="loc-category"
              value={profile.locationCategory}
              onChange={(e) => setProfile({ locationCategory: e.target.value as LocationProfile["locationCategory"] })}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...LOCATION_CATEGORIES] as const).map((c) => (
                <option key={c} value={c}>
                  {LOCATION_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loc-status">当前状态</Label>
            <select
              id="loc-status"
              value={profile.status}
              onChange={(e) => setProfile({ status: e.target.value as LocationProfile["status"] })}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {(["", ...LOCATION_STATUSES] as const).map((s) => (
                <option key={s} value={s}>
                  {LOCATION_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>层级与归属</SectionTitle>
        <EntryRefSelect
          label="上级地点"
          value={profile.parentLocationId}
          entries={projectEntries}
          filterType="location"
          excludeId={entry?.id}
          onChange={(parentLocationId) => setProfile({ parentLocationId })}
        />
        <EntryRefSelect
          label="主要管辖组织"
          value={profile.governingFactionId}
          entries={projectEntries}
          filterType="faction"
          onChange={(governingFactionId) => setProfile({ governingFactionId })}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>环境与场景</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="loc-environment">环境与氛围</Label>
          <Textarea
            id="loc-environment"
            placeholder="描述该地点的自然环境、人文氛围、气候等"
            value={profile.environment}
            onChange={(e) => setProfile({ environment: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loc-landmarks">标志性地点 / 建筑 / 场景</Label>
          <Textarea
            id="loc-landmarks"
            placeholder="列举该地点内的标志性地标、建筑或场景"
            value={profile.landmarks}
            onChange={(e) => setProfile({ landmarks: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>历史与访问</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="loc-history">历史沿革</Label>
          <Textarea
            id="loc-history"
            placeholder="该地点的历史背景与发展脉络"
            value={profile.history}
            onChange={(e) => setProfile({ history: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loc-access">出入方式 / 限制</Label>
          <Textarea
            id="loc-access"
            placeholder="如何进入或离开该地点，是否存在特殊限制"
            value={profile.access}
            onChange={(e) => setProfile({ access: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>创作补充</SectionTitle>
        <div className="space-y-2">
          <Label htmlFor="loc-creator-notes">创作备注</Label>
          <Textarea
            id="loc-creator-notes"
            placeholder="关于该地点的创作想法、灵感来源或待定设定"
            value={profile.creatorNotes}
            onChange={(e) => setProfile({ creatorNotes: e.target.value })}
            rows={3}
          />
        </div>
      </section>

      {/* ── 地图坐标 ──────────────────────────────────────────── */}
      <section className="space-y-4 rounded-xl border border-border/70 bg-card/30 p-4">
        <SectionTitle>地图坐标</SectionTitle>
        <p className="text-xs text-muted-foreground">
          坐标用于世界地图中的地点标注位置。左上为西北，右下为东南。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>X 坐标</Label>
              <input
                type="range" min="0" max="100" step="1"
                value={Math.round((profile.mapX??0)*100)}
                onChange={(e)=>setProfile({mapX:Number(e.target.value)/100})}
                className="w-full h-2"
              />
              <span className="text-xs text-muted-foreground">{Math.round((profile.mapX??0)*100)}</span>
            </div>
            <div className="space-y-1.5">
              <Label>Y 坐标</Label>
              <input
                type="range" min="0" max="100" step="1"
                value={Math.round((profile.mapY??0)*100)}
                onChange={(e)=>setProfile({mapY:Number(e.target.value)/100})}
                className="w-full h-2"
              />
              <span className="text-xs text-muted-foreground">{Math.round((profile.mapY??0)*100)}</span>
            </div>
            <p className="text-xs font-medium text-foreground/70">
              X {Math.round((profile.mapX??0)*100)} · Y {Math.round((profile.mapY??0)*100)}
            </p>
          </div>
          <div
            className="relative aspect-square overflow-hidden rounded-lg border border-border/70 bg-gradient-to-br from-[#faf6ee] to-[#f5efe0]"
            onClick={(e:React.MouseEvent<HTMLDivElement>)=>{
              const rect=e.currentTarget.getBoundingClientRect();
              const x=clamp01((e.clientX-rect.left)/rect.width);
              const y=clamp01((e.clientY-rect.top)/rect.height);
              setProfile({mapX:x,mapY:y});
            }}
          >
            {/* Grid */}
            {[25,50,75].map((p)=>(<div key={`g${p}`} className="absolute bg-[#d4c8b0]/20" style={{left:`${p}%`,top:0,width:1,height:"100%"}}/>))}
            {[25,50,75].map((p)=>(<div key={`h${p}`} className="absolute bg-[#d4c8b0]/20" style={{top:`${p}%`,left:0,height:1,width:"100%"}}/>))}
            {/* Marker */}
            <div className="absolute w-2.5 h-2.5 rounded-full border-2 border-[#7c4a2d] bg-[#fffcf7] -translate-x-1/2 -translate-y-1/2 shadow-sm"
              style={{left:`${(profile.mapX??0)*100}%`,top:`${(profile.mapY??0)*100}%`}}
              onPointerDown={(e)=>{
                e.stopPropagation();
                const div=e.currentTarget.parentElement!;
                const onMove=(ev:PointerEvent)=>{
                  const r=div.getBoundingClientRect();
                  setProfile({mapX:clamp01((ev.clientX-r.left)/r.width),mapY:clamp01((ev.clientY-r.top)/r.height)});
                };
                const onUp=()=>{window.removeEventListener("pointermove",onMove);window.removeEventListener("pointerup",onUp);};
                window.addEventListener("pointermove",onMove);window.addEventListener("pointerup",onUp);
              }}
            />
          </div>
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
          可选：使用富文本记录更多场景细节与补充设定。
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
