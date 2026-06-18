/** Clamp value to [0, 1] */
export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Normalize a raw map coordinate value (0–1), with optional fallback.
 * Handles non-number, NaN, Infinity.
 */
export function normalizeMapCoordinate(value: unknown, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return clamp01(fallback);
  return clamp01(value);
}

/** Convert map coordinate (0–1) to percent (0–100) for UI display */
export function toMapPercent(value: unknown, fallback = 0): number {
  return Math.round(normalizeMapCoordinate(value, fallback) * 100);
}

/** Convert UI percent (0–100) back to map coordinate (0–1) */
export function fromMapPercent(value: unknown, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return clamp01(fallback);
  return clamp01(value / 100);
}

/** Format "(X, Y)" as "X 52 · Y 34" */
export function formatMapCoordLabel(mapX: unknown, mapY: unknown): string {
  return `X ${toMapPercent(mapX)} · Y ${toMapPercent(mapY)}`;
}

/** Check if coordinates are at (0, 0) — the default empty position */
export function isDefaultMapPosition(mapX: unknown, mapY: unknown): boolean {
  return normalizeMapCoordinate(mapX) === 0 && normalizeMapCoordinate(mapY) === 0;
}

/**
 * Simple stable hash of a string → unsigned 32-bit integer.
 */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

const MIN_GRID = 12;
const COORD_MIN = 0.26;
const COORD_MAX = 0.74;

/**
 * Generate deterministic, collision-free temporary coordinates for a set
 * of entry IDs.  Accepts ALL project location IDs (not just unpositioned
 * ones) so that slot assignments are stable even after individual
 * locations acquire real coordinates.
 *
 * Returns a Map from ID → { mapX, mapY }.  Always finite, always in
 * [COORD_MIN, COORD_MAX], and guaranteed unique across the input set.
 * Dynamically sizes the grid so it never deadlocks regardless of input
 * size (tested up to 10 000 IDs).
 */
export function generateTemporaryLayout(
  entryIds: string[],
): Map<string, { mapX: number; mapY: number }> {
  const sorted = [...new Set(entryIds)].sort();
  if (sorted.length === 0) return new Map();

  const cols = Math.max(MIN_GRID, Math.ceil(Math.sqrt(sorted.length)));
  const rows = Math.max(MIN_GRID, Math.ceil(sorted.length / cols));
  const cells = cols * rows;
  // Use step=1 — guaranteed to probe every cell in a full cycle
  const step = 1;

  const occupied = new Set<number>();
  const result = new Map<string, { mapX: number; mapY: number }>();

  for (const id of sorted) {
    let slot = (hashId(id + "x") % cells + cells) % cells;
    let attempts = 0;
    while (occupied.has(slot) && attempts < cells) {
      slot = (slot + step) % cells;
      attempts++;
    }
    if (attempts >= cells) {
      // Safety fallback — should never trigger with dynamic sizing
      slot = occupied.size; // last resort: sequential
    }
    occupied.add(slot);
    const col = slot % cols;
    const r = Math.floor(slot / cols);
    result.set(id, {
      mapX: COORD_MIN + ((col + 0.5) / cols) * (COORD_MAX - COORD_MIN),
      mapY: COORD_MIN + ((r + 0.5) / rows) * (COORD_MAX - COORD_MIN),
    });
  }
  return result;
}
