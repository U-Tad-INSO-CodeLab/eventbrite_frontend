/**
 * When no cover is uploaded, use Lorem Picsum with a stable seed.
 */
const EVENTISH_PICSUM_IDS = [
  24, 29, 33, 45, 48, 52, 57, 64, 76, 84, 96, 106, 119, 129, 141, 152, 180,
  192, 201, 214, 225, 292, 318, 337, 360, 366, 392, 433, 482, 503, 582, 611,
] as const;

function hashToIndex(seed: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % modulo;
}

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
