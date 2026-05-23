"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { resolveImageSource } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GalleryEditorProps {
  images: string[];
  imageAltMap?: Record<string, string>;
  onChange: (images: string[], imageAltMap: Record<string, string>) => void;
}

export function GalleryEditor({ images, imageAltMap = {}, onChange }: GalleryEditorProps) {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addImage = async (source: string | File) => {
    setLoading(true);
    setError("");
    try {
      const resolved = await resolveImageSource(source);
      if (images.includes(resolved)) {
        setError("该图片已在图集中");
        return;
      }
      onChange([...images, resolved], imageAltMap);
      setUrlInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "添加失败");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (src: string) => {
    const nextMap = { ...imageAltMap };
    delete nextMap[src];
    onChange(
      images.filter((i) => i !== src),
      nextMap,
    );
  };

  const updateAlt = (src: string, alt: string) => {
    onChange(images, { ...imageAltMap, [src]: alt });
  };

  return (
    <div className="space-y-3">
      <Label>图集</Label>
      <p className="text-xs text-muted-foreground">为条目添加多张参考图、立绘或场景图</p>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {images.map((src) => (
            <div key={src} className="overflow-hidden rounded-lg border border-border/80 bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={imageAltMap[src] || "图集"} className="h-24 w-full object-cover" />
              <div className="space-y-2 p-2">
                <Input
                  placeholder="图片描述"
                  value={imageAltMap[src] || ""}
                  onChange={(e) => updateAlt(src, e.target.value)}
                  className="h-8 text-xs"
                />
                <Button type="button" variant="ghost" size="sm" className="h-7 w-full text-destructive" onClick={() => removeImage(src)}>
                  <X className="h-3.5 w-3.5" />
                  移除
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
          还没有图集图片
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="图片 URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          disabled={loading}
        />
        <Button type="button" variant="outline" size="sm" disabled={loading || !urlInput.trim()} onClick={() => addImage(urlInput)}>
          <Plus className="h-4 w-4" />
          添加
        </Button>
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="gallery-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void addImage(file);
            e.target.value = "";
          }}
        />
        <Button type="button" variant="secondary" size="sm" disabled={loading} onClick={() => document.getElementById("gallery-upload")?.click()}>
          上传本地图片
        </Button>
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
