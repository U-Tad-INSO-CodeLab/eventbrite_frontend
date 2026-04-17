export type IsoDateParts = { y: number; m: number; d: number };

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function toIso(y: number, monthIndex: number, day: number) {
  return `${y}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

export function parseIso(iso: string): IsoDateParts | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  if (Number.isNaN(y) || Number.isNaN(mo) || Number.isNaN(d)) return null;
  return { y, m: mo, d };
}

export function daysInMonth(y: number, monthIndex: number) {
  return new Date(y, monthIndex + 1, 0).getDate();
}

/** Monday = 0 … Sunday = 6 */
export function mondayWeekday(y: number, monthIndex: number) {
  const w = new Date(y, monthIndex, 1).getDay();
  return w === 0 ? 6 : w - 1;
}

export function formatIsoForPickerDisplay(iso: string): string {
  const p = parseIso(iso);
  if (!p) return '';
  try {
    return new Date(p.y, p.m, p.d).toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}
