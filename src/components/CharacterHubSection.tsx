"use client";

import { useMemo } from "react";
import { Gem, Leaf, ScrollText } from "lucide-react";
import type { Entry } from "@/types";
import { ENTRY_TYPE_ICONS } from "@/types";

interface CharacterHubSectionProps {
  entry: Entry;
  projectEntries: Entry[];
  onSelectEntry: (entry: Entry) => void;
}

function HubCard({
  entry,
  onSelect,
}: {
  entry: Entry;
  onSelect: (entry: Entry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="flex w-full items-start gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-2.5 text-left transition-colors hover:bg-accent/50"
    >
      <span className="mt-0.5 shrink-0 text-base">{ENTRY_TYPE_ICONS[entry.type]}</span>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium">{entry.title || "未命名条目"}</span>
        {entry.summary ? (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{entry.summary}</p>
        ) : null}
      </div>
    </button>
  );
}

export function CharacterHubSection({ entry, projectEntries, onSelectEntry }: CharacterHubSectionProps) {
  const participatedEvents = useMemo(
    () =>
      entry.type === "character"
        ? projectEntries.filter(
            (e) =>
              e.type === "event" &&
              e.eventProfile?.participantCharacterIds?.includes(entry.id),
          )
        : [],
    [projectEntries, entry.id, entry.type],
  );

  const representativeSpecies = useMemo(
    () =>
      entry.type === "character"
        ? projectEntries.filter(
            (e) =>
              e.type === "species" &&
              e.speciesProfile?.representativeCharacterIds?.includes(entry.id),
          )
        : [],
    [projectEntries, entry.id, entry.type],
  );

  const ownedItems = useMemo(
    () =>
      entry.type === "character"
        ? projectEntries.filter(
            (e) =>
              e.type === "item" &&
              e.itemProfile?.ownerCharacterId === entry.id,
          )
        : [],
    [projectEntries, entry.id, entry.type],
  );

  if (participatedEvents.length === 0 && representativeSpecies.length === 0 && ownedItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-xl border border-border/70 bg-card/40 p-4">
      <h3 className="font-serif text-sm font-semibold text-foreground/90">角色关联</h3>

      {participatedEvents.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <ScrollText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              参与事件 · {participatedEvents.length}
            </span>
          </div>
          <div className="space-y-1">
            {participatedEvents.map((e) => (
              <HubCard key={e.id} entry={e} onSelect={onSelectEntry} />
            ))}
          </div>
        </div>
      ) : null}

      {representativeSpecies.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              代表种族 · {representativeSpecies.length}
            </span>
          </div>
          <div className="space-y-1">
            {representativeSpecies.map((e) => (
              <HubCard key={e.id} entry={e} onSelect={onSelectEntry} />
            ))}
          </div>
        </div>
      ) : null}

      {ownedItems.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Gem className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              持有物品 · {ownedItems.length}
            </span>
          </div>
          <div className="space-y-1">
            {ownedItems.map((e) => (
              <HubCard key={e.id} entry={e} onSelect={onSelectEntry} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
