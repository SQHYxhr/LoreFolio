"use client";

import { useEffect, useRef } from "react";

function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

interface EntryContentViewProps {
  content: string;
  onImageClick: (src: string, alt: string) => void;
}

export function EntryContentView({ content, onImageClick }: EntryContentViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        const src = target.getAttribute("src");
        if (src) onImageClick(src, target.getAttribute("alt") || "设定插图");
      }
    };

    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [content, onImageClick]);

  if (!content) {
    return <p className="text-sm text-muted-foreground">暂无详细内容，点击编辑补充设定。</p>;
  }

  if (isHtmlContent(content)) {
    return (
      <div
        ref={ref}
        className="entry-prose text-sm leading-relaxed text-foreground/90"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div ref={ref} className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
      {content}
    </div>
  );
}
