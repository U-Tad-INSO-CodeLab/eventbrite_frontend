import type { MockSessionUser } from './mockAuth';
import { eventCoverPlaceholderUrl } from './eventCoverPlaceholder';

const STORAGE_EVENTS = 'eventlink_mock_events';

export type MockEventStatus = 'active' | 'draft';

export type MockEvent = {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  date: string;
  location: string;
  industry: string;
  expectedAttendance: number;
  tags: string[];
  coverImageDataUrl: string | null;
  createdAt: string;
  status: MockEventStatus;
  /** Shown in My Events footer when > 0 */
  sponsorshipTierCount: number;
  sponsorshipMaxPriceUsd: number;
};

export type CreateMockEventInput = {
  title: string;
  description: string;
  date: string;
  location: string;
  industry: string;
  expectedAttendance: number;
  tags: string[];
  coverImageDataUrl: string | null;
};

export type CreateMockEventResult =
  | { ok: true; event: MockEvent }
  | { ok: false; error: string };

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withEventDefaults(partial: MockEvent): MockEvent {
  return {
    ...partial,
    status: partial.status === 'draft' ? 'draft' : 'active',
    sponsorshipTierCount:
      typeof partial.sponsorshipTierCount === 'number'
        ? partial.sponsorshipTierCount
        : 0,
    sponsorshipMaxPriceUsd:
      typeof partial.sponsorshipMaxPriceUsd === 'number'
        ? partial.sponsorshipMaxPriceUsd
        : 0,
  };
}

function readEvents(): MockEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MockEvent[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((e) => withEventDefaults(e as MockEvent));
  } catch {
    return [];
  }
}

function writeEvents(events: MockEvent[]) {
  localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
}

export async function createMockEvent(
  creator: MockSessionUser,
  input: CreateMockEventInput
): Promise<CreateMockEventResult> {
  await delay(500);

  if (creator.role !== 'creator') {
    return { ok: false, error: 'Only creators can publish events.' };
  }
  if (!input.title.trim()) {
    return { ok: false, error: 'Event title is required.' };
  }
  if (!input.description.trim()) {
    return { ok: false, error: 'Event description is required.' };
  }

  const events = readEvents();
  const id = crypto.randomUUID();
  const coverImageDataUrl =
    input.coverImageDataUrl ?? eventCoverPlaceholderUrl(id, 800, 450);
  const event: MockEvent = {
    id,
    creatorId: creator.id,
    creatorName: creator.fullName,
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date.trim(),
    location: input.location.trim(),
    industry: input.industry.trim(),
    expectedAttendance: input.expectedAttendance,
    tags: input.tags,
    coverImageDataUrl,
    createdAt: new Date().toISOString(),
    status: 'active',
    sponsorshipTierCount: 0,
    sponsorshipMaxPriceUsd: 0,
  };

  events.unshift(event);
  writeEvents(events);

  return { ok: true, event };
}

export function getMockEventsByCreator(creatorId: string): MockEvent[] {
  return readEvents().filter((event) => event.creatorId === creatorId);
}

export function setMockEventStatus(
  creatorId: string,
  eventId: string,
  status: MockEventStatus
): boolean {
  const events = readEvents();
  const index = events.findIndex(
    (e) => e.id === eventId && e.creatorId === creatorId
  );
  if (index === -1) return false;
  events[index] = { ...events[index], status };
  writeEvents(events);
  return true;
}

export function formatMockEventDate(iso: string): string {
  if (!iso) return '—';
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return iso;
  const [y, m, d] = parts;
  try {
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function formatUsdCompact(amount: number): string {
  if (!amount || amount <= 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
