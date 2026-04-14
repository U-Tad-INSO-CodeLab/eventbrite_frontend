import { useEffect, useId, useMemo, useRef, useState } from 'react';
import './EventDatePicker.css';

type EventDatePickerProps = {
  id: string;
  value: string;
  onChange: (isoDate: string) => void;
  disabled?: boolean;
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toIso(y: number, monthIndex: number, day: number) {
  return `${y}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  if (Number.isNaN(y) || Number.isNaN(mo) || Number.isNaN(d)) return null;
  return { y, m: mo, d };
}

function daysInMonth(y: number, monthIndex: number) {
  return new Date(y, monthIndex + 1, 0).getDate();
}

/** Monday = 0 … Sunday = 6 */
function mondayWeekday(y: number, monthIndex: number) {
  const w = new Date(y, monthIndex, 1).getDay();
  return w === 0 ? 6 : w - 1;
}

function formatDisplay(iso: string): string {
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

export default function EventDatePicker({
  id,
  value,
  onChange,
  disabled = false,
}: EventDatePickerProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const [viewY, setViewY] = useState(() => {
    const p = parseIso(value);
    if (p) return p.y;
    return new Date().getFullYear();
  });
  const [viewM, setViewM] = useState(() => {
    const p = parseIso(value);
    if (p) return p.m;
    return new Date().getMonth();
  });

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openPanel = () => {
    const p = parseIso(value);
    if (p) {
      setViewY(p.y);
      setViewM(p.m);
    }
    setOpen(true);
  };

  const closePanel = () => setOpen(false);

  const togglePanel = () => {
    if (open) {
      closePanel();
      return;
    }
    openPanel();
  };

  const monthLabel = useMemo(
    () =>
      new Date(viewY, viewM, 1).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      }),
    [viewY, viewM]
  );

  const cells = useMemo(() => {
    const first = mondayWeekday(viewY, viewM);
    const count = daysInMonth(viewY, viewM);
    const prevCount = daysInMonth(viewY, viewM - 1);
    const items: Array<{
      day: number;
      iso: string;
      muted: boolean;
      currentMonth: boolean;
    }> = [];

    for (let i = 0; i < first; i += 1) {
      const day = prevCount - first + i + 1;
      const pm = viewM === 0 ? 11 : viewM - 1;
      const py = viewM === 0 ? viewY - 1 : viewY;
      items.push({
        day,
        iso: toIso(py, pm, day),
        muted: true,
        currentMonth: false,
      });
    }
    for (let d = 1; d <= count; d += 1) {
      items.push({
        day: d,
        iso: toIso(viewY, viewM, d),
        muted: false,
        currentMonth: true,
      });
    }
    const rest = 42 - items.length;
    for (let d = 1; d <= rest; d += 1) {
      const nm = viewM === 11 ? 0 : viewM + 1;
      const ny = viewM === 11 ? viewY + 1 : viewY;
      items.push({
        day: d,
        iso: toIso(ny, nm, d),
        muted: true,
        currentMonth: false,
      });
    }
    return items;
  }, [viewY, viewM]);

  const todayIso = useMemo(() => {
    const t = new Date();
    return toIso(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const shiftMonth = (delta: number) => {
    const d = new Date(viewY, viewM + delta, 1);
    setViewY(d.getFullYear());
    setViewM(d.getMonth());
  };

  return (
    <div className="event-date-picker" ref={rootRef}>
      <button
        type="button"
        id={id}
        className="event-date-picker-trigger"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={togglePanel}
      >
        <span className={value ? '' : 'event-date-picker-placeholder'}>
          {value ? formatDisplay(value) : 'Select date'}
        </span>
        <span className="material-symbols-outlined event-date-picker-icon" aria-hidden="true">
          calendar_month
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="event-date-picker-panel"
          role="dialog"
          aria-label="Choose date"
        >
          <div className="event-date-picker-head">
            <button
              type="button"
              className="event-date-picker-nav"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_left
              </span>
            </button>
            <span className="event-date-picker-month">{monthLabel}</span>
            <button
              type="button"
              className="event-date-picker-nav"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_right
              </span>
            </button>
          </div>
          <div className="event-date-picker-weekdays">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="event-date-picker-grid">
            {cells.map((cell, index) => {
              const selected = cell.iso === value;
              const today = cell.iso === todayIso;
              return (
                <button
                  key={`${index}-${cell.iso}`}
                  type="button"
                  className={[
                    'event-date-picker-day',
                    cell.muted ? 'is-muted' : '',
                    selected ? 'is-selected' : '',
                    today && !selected ? 'is-today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    onChange(cell.iso);
                    setOpen(false);
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
