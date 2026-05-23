import type { Entry } from "@/types";
import { getCharacterSearchText } from "@/lib/character-profile";

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function matchesSearch(entry: Entry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const contentText = stripHtml(entry.content).toLowerCase();
  const profileText =
    entry.type === "character" && entry.characterProfile
      ? getCharacterSearchText(entry.characterProfile).toLowerCase()
      : "";
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.summary.toLowerCase().includes(q) ||
    contentText.includes(q) ||
    profileText.includes(q)
  );
}

export function matchesTag(entry: Entry, tag: string | null): boolean {
  if (!tag) return true;
  return entry.tags.includes(tag);
}

export function filterEntries(
  entries: Entry[],
  opts: { search?: string; tag?: string | null },
): Entry[] {
  return entries.filter(
    (e) => matchesSearch(e, opts.search ?? "") && matchesTag(e, opts.tag ?? null),
  );
}

export function getAllTags(entries: Entry[]): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    for (const t of e.tags) {
      const trimmed = t.trim();
      if (trimmed) set.add(trimmed);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

export function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map((t) => t.trim()).filter(Boolean))];
}
