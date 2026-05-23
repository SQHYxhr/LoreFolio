"use client";

import { getImageAlt } from "@/lib/images";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  images: string[];
  imageAltMap?: Record<string, string>;
  onImageClick: (src: string, alt: string) => void;
  className?: string;
}

export function GalleryGrid({ images, imageAltMap, onImageClick, className }: GalleryGridProps) {
  if (images.length === 0) return null;

  return (
    <section className={cn("space-y-3", className)}>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">图集</h3>
      <div className={cn("grid gap-2", images.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
        {images.map((src) => {
          const alt = getImageAlt(src, imageAltMap, "图集");
          return (
            <button
              key={src}
              type="button"
              onClick={() => onImageClick(src, alt)}
              className="group overflow-hidden rounded-xl border border-border/70 bg-card transition hover:border-primary/30 hover:shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              {alt !== "图集" ? (
                <p className="px-2 py-1.5 text-left text-xs text-muted-foreground">{alt}</p>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
