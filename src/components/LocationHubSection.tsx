"use client";

import { useMemo } from "react";
import { Castle, Gem, Leaf, ScrollText } from "lucide-react";
import type { Entry } from "@/types";
import { ENTRY_TYPE_ICONS } from "@/types";

interface LocationHubSectionProps {
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

export function LocationHubSection({ entry, projectEntries, onSelectEntry }: LocationHubSectionProps) {
  const headquarterFactions = useMemo(
    () =>
      entry.type === "location"
        ? projectEntries.filter(
            (e) =>
              e.type === "faction" &&
              e.factionProfile?.headquartersLocationId === entry.id,
          )
        : [],
    [projectEntries, entry.id, entry.type],
  );

  const eventsAtLocation = useMemo(
    () =>
      entry.type === "location"
        ? projectEntries.filter(
            (e) =>
              e.type === "event" &&
              e.eventProfile?.locationId === entry.id,
          )
        : [],
    [projectEntries, entry.id, entry.type],
  );

  const speciesAtLocation = useMemo(
    () =>
      entry.type === "location"
        ? projectEntries.filter(
            (e) =>
              e.type === "species" &&
              e.speciesProfile?.habitatLocationId === entry.id,
          )
        : [],
    [projectEntries, entry.id, entry.type],
  );

  const itemsAtLocation = useMemo(
    () =>
      entry.type === "location"
        ? projectEntries.filter(
            (e) =>
              e.type === "item" &&
              e.itemProfile?.currentLocationId === entry.id,
          )
        : [],
    [projectEntries, entry.id, entry.type],
  );

  if (
    headquarterFactions.length === 0 &&
    eventsAtLocation.length === 0 &&
    speciesAtLocation.length === 0 &&
    itemsAtLocation.length === 0
  ) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-xl border border-border/70 bg-card/40 p-4">
      <h3 className="font-serif text-sm font-semibold text-foreground/90">地点关联</h3>

      {headquarterFactions.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Castle className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              总部组织 · {headquarterFactions.length}
            </span>
          </div>
          <div className="space-y-1">
            {headquarterFactions.map((e) => (
              <HubCard key={e.id} entry={e} onSelect={onSelectEntry} />
            ))}
          </div>
        </div>
      ) : null}

      {eventsAtLocation.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <ScrollText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              发生事件 · {eventsAtLocation.length}
            </span>
          </div>
          <div className="space-y-1">
            {eventsAtLocation.map((e) => (
              <HubCard key={e.id} entry={e} onSelect={onSelectEntry} />
            ))}
          </div>
        </div>
      ) : null}

      {speciesAtLocation.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Leaf className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              栖息种族 · {speciesAtLocation.length}
            </span>
          </div>
          <div className="space-y-1">
            {speciesAtLocation.map((e) => (
              <HubCard key={e.id} entry={e} onSelect={onSelectEntry} />
            ))}
          </div>
        </div>
      ) : null}

      {itemsAtLocation.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <Gem className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              存放物品 · {itemsAtLocation.length}
            </span>
          </div>
          <div className="space-y-1">
            {itemsAtLocation.map((e) => (
              <HubCard key={e.id} entry={e} onSelect={onSelectEntry} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
