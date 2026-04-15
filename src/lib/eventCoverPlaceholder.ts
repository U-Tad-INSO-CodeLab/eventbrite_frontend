import { hashToIndex } from './hashToIndex';

/**
 * When no cover is uploaded, use Lorem Picsum with a stable seed.
 * Picsum has no “event” category; we rotate through landscape-friendly IDs
 * (venues, cities, wide scenes) so placeholders feel closer to event banners * than a single generic stock shot.
 */
const EVENTISH_PICSUM_IDS = [
  24, 29, 33, 45, 48, 52, 57, 64, 76, 84, 96, 106, 119, 129, 141, 152, 180,
  192, 201, 214, 225, 292, 318, 337, 360, 366, 392, 433, 482, 503, 582, 611,
] as const;

/**
 * Stable image URL for a given seed (e.g. event id, or title while drafting).
 * Same seed → same photo until you change dimensions.
 */
export function eventCoverPlaceholderUrl(
  seed: string,
  width = 800,
  height = 450
): string {
  const normalized = seed.trim() || 'eventlink';
  const id =
    EVENTISH_PICSUM_IDS[hashToIndex(normalized, EVENTISH_PICSUM_IDS.length)];
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}
