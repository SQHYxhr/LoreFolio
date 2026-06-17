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
