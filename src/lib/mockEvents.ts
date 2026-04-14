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
  coverImageDataUrl: string;
  createdAt: string;
  status: MockEventStatus;
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
  const id = String(partial.id ?? '');
  const rawCover = partial.coverImageDataUrl;
  const coverImageDataUrl =
    rawCover && String(rawCover).length > 0
      ? String(rawCover)
      : id
        ? eventCoverPlaceholderUrl(id)
        : '';

  return {
    ...partial,
    id,
    coverImageDataUrl,
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

/** Demo events so Discover is populated before any creator publishes. */
function seedEvents(): MockEvent[] {
  const now = new Date().toISOString();
  return [
    withEventDefaults({
      id: 'seed-techconnect',
      creatorId: 'seed-creator',
      creatorName: 'Sarah Chen',
      title: 'TechConnect Summit 2026',
      description:
        'Join industry leaders for three days of keynotes, workshops, and networking focused on AI, cloud, and the future of software.',
      date: '2026-05-15',
      location: 'San Francisco',
      industry: 'Technology',
      expectedAttendance: 5000,
      tags: ['AI', 'SaaS', 'Networking'],
      coverImageDataUrl: '',
      createdAt: now,
      status: 'active',
      sponsorshipTierCount: 0,
      sponsorshipMaxPriceUsd: 0,
    }),
    withEventDefaults({
      id: 'seed-finance-forum',
      creatorId: 'seed-creator',
      creatorName: 'James Okonkwo',
      title: 'Global Finance Forum',
      description:
        'Institutional investors and fintech founders meet to discuss markets, regulation, and digital assets in a two-day curated program.',
      date: '2026-06-03',
      location: 'New York',
      industry: 'Finance',
      expectedAttendance: 1200,
      tags: ['Fintech', 'Investing'],
      coverImageDataUrl: '',
      createdAt: now,
      status: 'active',
      sponsorshipTierCount: 0,
      sponsorshipMaxPriceUsd: 0,
    }),
    withEventDefaults({
      id: 'seed-green-expo',
      creatorId: 'seed-creator-2',
      creatorName: 'Elena Vasquez',
      title: 'Green Energy Expo',
      description:
        'Showcase cleantech solutions, meet buyers, and attend panels on storage, grids, and sustainable infrastructure.',
      date: '2026-07-22',
      location: 'Austin',
      industry: 'Energy & Sustainability',
      expectedAttendance: 8000,
      tags: ['Cleantech', 'Solar'],
      coverImageDataUrl: '',
      createdAt: now,
      status: 'active',
      sponsorshipTierCount: 0,
      sponsorshipMaxPriceUsd: 0,
    }),
    withEventDefaults({
      id: 'seed-wellness',
      creatorId: 'seed-creator-2',
      creatorName: 'Maya Patel',
      title: 'Wellness & Longevity Week',
      description:
        'Clinical innovators and consumer brands share the latest in preventative health, wearables, and mental fitness.',
      date: '2026-09-10',
      location: 'Miami',
      industry: 'Health & Wellness',
      expectedAttendance: 2500,
      tags: ['Health', 'Wearables'],
      coverImageDataUrl: '',
      createdAt: now,
      status: 'active',
      sponsorshipTierCount: 0,
      sponsorshipMaxPriceUsd: 0,
    }),
  ];
}

function readEvents(): MockEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS);
    if (!raw) {
      const seeded = seedEvents();
      localStorage.setItem(STORAGE_EVENTS, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as MockEvent[];
    if (!Array.isArray(parsed)) {
      const seeded = seedEvents();
      writeEvents(seeded);
      return seeded;
    }
    return parsed.map((e) => withEventDefaults(e as MockEvent));
  } catch {
    const seeded = seedEvents();
    writeEvents(seeded);
    return seeded;
  }
}

function writeEvents(events: MockEvent[]) {
  localStorage.setItem(STORAGE_EVENTS, JSON.stringify(events));
}

/** Active events from mock storage (for sponsor Discover). Drafts are excluded. */
export function getDiscoverMockEvents(): MockEvent[] {
  return readEvents()
    .filter((e) => e.status === 'active')
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
    input.coverImageDataUrl && input.coverImageDataUrl.length > 0
      ? input.coverImageDataUrl
      : eventCoverPlaceholderUrl(id, 800, 450);
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

export function formatUsdCompact(amount: number): string {
  if (!amount || amount <= 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
