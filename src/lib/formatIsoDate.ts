/** Format `YYYY-MM-DD` for display; `whenEmpty` when input is blank or invalid. */
export function formatIsoDate(iso: string, whenEmpty = '—'): string {
  if (!iso) return whenEmpty;
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return iso;
  const [y, m, d] = parts;
  try {
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}
