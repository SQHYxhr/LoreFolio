"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageLightbox({ src, alt = "图片预览", open, onOpenChange }: ImageLightboxProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!src) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-[92vw] border-none bg-black/90 p-2 sm:max-w-5xl">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex max-h-[85vh] items-center justify-center overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="max-h-[85vh] max-w-full object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
