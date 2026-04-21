import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  daysInMonth,
  formatIsoForPickerDisplay,
  mondayWeekday,
  parseIso,
  toIso,
} from '@/shared/lib/datePickerUtils';
import '@/events/components/EventDatePicker.css';

type EventDatePickerProps = {
  id: string;
  value: string;
  onChange: (isoDate: string) => void;
  disabled?: boolean;
};

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
    <Box className="event-date-picker" ref={rootRef}>
      <Button
        type="button"
        id={id}
        className="event-date-picker-trigger"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={togglePanel}
      >
        <Box component="span" className={value ? '' : 'event-date-picker-placeholder'}>
          {value ? formatIsoForPickerDisplay(value) : 'Select date'}
        </Box>
        <CalendarMonthIcon className="event-date-picker-icon" aria-hidden="true" />
      </Button>

      {open ? (
        <Box
          id={panelId}
          className="event-date-picker-panel"
          role="dialog"
          aria-label="Choose date"
        >
          <Box className="event-date-picker-head">
            <IconButton
              type="button"
              className="event-date-picker-nav"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography component="span" className="event-date-picker-month">
              {monthLabel}
            </Typography>
            <IconButton
              type="button"
              className="event-date-picker-nav"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box className="event-date-picker-weekdays">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <Box component="span" key={d}>
                {d}
              </Box>
            ))}
          </Box>
          <Box className="event-date-picker-grid">
            {cells.map((cell, index) => {
              const selected = cell.iso === value;
              const today = cell.iso === todayIso;
              return (
                <Button
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
                </Button>
              );
            })}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
