"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { resolveImageSource } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImagePickerProps {
  label: string;
  value: string;
  alt?: string;
  onChange: (src: string) => void;
  onAltChange?: (alt: string) => void;
  onRemove?: () => void;
  compact?: boolean;
  className?: string;
}

export function ImagePicker({
  label,
  value,
  alt = "",
  onChange,
  onAltChange,
  onRemove,
  compact = false,
  className,
}: ImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const applySource = async (source: string | File) => {
    setLoading(true);
    setError("");
    try {
      const resolved = await resolveImageSource(source);
      onChange(resolved);
      setUrlInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "图片处理失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-secondary/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={alt || label} className={cn("w-full object-cover", compact ? "h-32" : "h-44")} />
          <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
            {onRemove ? (
              <Button type="button" size="sm" variant="destructive" onClick={onRemove}>
                <Trash2 className="h-3.5 w-3.5" />
                移除
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/60 px-4 py-8 text-center">
          <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">添加封面或插图</p>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="粘贴图片 URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          disabled={loading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading || !urlInput.trim()}
          onClick={() => applySource(urlInput)}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
          URL
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void applySource(file);
            e.target.value = "";
          }}
        />
        <Button type="button" variant="secondary" size="sm" disabled={loading} onClick={() => fileRef.current?.click()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          上传本地图片
        </Button>
        <span className="text-xs text-muted-foreground">支持 JPG / PNG，最大 2MB</span>
      </div>

      {onAltChange ? (
        <div className="space-y-1.5">
          <Label htmlFor={`alt-${label}`}>图片描述（可选）</Label>
          <Input
            id={`alt-${label}`}
            placeholder="例如：林晚星立绘"
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
          />
        </div>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
