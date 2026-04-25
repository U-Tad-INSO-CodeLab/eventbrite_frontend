import type { MockSessionUser } from '@/auth/lib/mockAuth';
import { eventCoverPlaceholderUrl } from '@/events/lib/eventCoverPlaceholder';

const STORAGE_EVENTS = 'eventlink_mock_events';

export type MockEventStatus = 'active' | 'draft';

export type MockSponsorshipTier = {
  id: string;
  eventId: string;
  name: string;
  priceUsd: number;
  benefits: string[];
};

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
  /** Data URL from upload, or remote placeholder URL (e.g. Picsum). */
  coverImageDataUrl: string;
  createdAt: string;
  status: MockEventStatus;
  sponsorshipTiers: MockSponsorshipTier[];
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
  sponsorshipTiers: Array<{
    name: string;
    priceUsd: number;
    benefits: string[];
  }>;
};

export type CreateMockEventResult =
  | { ok: true; event: MockEvent }
  | { ok: false; error: string };

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Default sponsorship packages for seeded catalog events (also used to migrate old localStorage). */
export function blueprintTiersForSeedEvent(
  eventId: string
): Array<{ name: string; priceUsd: number; benefits: string[] }> {
  const blueprints: Record<
    string,
    Array<{ name: string; priceUsd: number; benefits: string[] }>
  > = {
    'seed-techconnect': [
      {
        name: 'Platinum',
        priceUsd: 50_000,
        benefits: [
          'Keynote speaking slot',
          'Premium booth location',
          'Logo on all materials',
          'VIP dinner access',
        ],
      },
      {
        name: 'Gold',
        priceUsd: 25_000,
        benefits: [
          'Workshop hosting slot',
          'Standard booth',
          'Logo on website',
          'Networking passes',
        ],
      },
      {
        name: 'Silver',
        priceUsd: 10_000,
        benefits: ['Logo on website', 'Two conference passes', 'Social mention'],
      },
    ],
    'seed-finance-forum': [
      {
        name: 'Title',
        priceUsd: 75_000,
        benefits: ['Opening keynote', 'Private investor dinner', 'Brand on main stage'],
      },
      {
        name: 'Partner',
        priceUsd: 35_000,
        benefits: ['Panel slot', 'Exhibit table', 'Lead scan'],
      },
    ],
    'seed-green-expo': [
      {
        name: 'Platinum',
        priceUsd: 40_000,
        benefits: ['Main hall booth', 'Speaking slot', 'Report feature', 'Lead capture'],
      },
      {
        name: 'Gold',
        priceUsd: 18_000,
        benefits: ['Standard booth', 'Logo in program', '4 passes'],
      },
    ],
    'seed-wellness': [
      {
        name: 'Presenting',
        priceUsd: 30_000,
        benefits: ['Stage naming', 'Workshop block', 'VIP lounge'],
      },
      {
        name: 'Supporting',
        priceUsd: 12_000,
        benefits: ['Booth', 'Newsletter inclusion', '2 passes'],
      },
    ],
  };
  return blueprints[eventId] ?? [];
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

  const rawTiers = Array.isArray(partial.sponsorshipTiers)
    ? partial.sponsorshipTiers
    : [];
  const sponsorshipTiers = rawTiers.map((tier, index) => ({
    id:
      typeof tier.id === 'string' && tier.id.length > 0
        ? tier.id
        : `${id}-tier-${index + 1}`,
    eventId:
      typeof tier.eventId === 'string' && tier.eventId.length > 0
        ? tier.eventId
        : id,
    name: String(tier.name ?? '').trim(),
    priceUsd:
      typeof tier.priceUsd === 'number' && Number.isFinite(tier.priceUsd)
        ? Math.max(0, Math.floor(tier.priceUsd))
        : 0,
    benefits: Array.isArray(tier.benefits)
      ? tier.benefits.map((benefit) => String(benefit).trim()).filter(Boolean)
      : [],
  }));

  const computedTierCount = sponsorshipTiers.length;
  const computedMaxTierPrice = sponsorshipTiers.reduce(
    (maxPrice, tier) => Math.max(maxPrice, tier.priceUsd),
    0
  );

  return {
    ...partial,
    id,
    coverImageDataUrl,
    status: partial.status === 'draft' ? 'draft' : 'active',
    sponsorshipTiers,
    sponsorshipTierCount:
      typeof partial.sponsorshipTierCount === 'number'
        ? partial.sponsorshipTierCount
        : computedTierCount,
    sponsorshipMaxPriceUsd:
      typeof partial.sponsorshipMaxPriceUsd === 'number'
        ? partial.sponsorshipMaxPriceUsd
        : computedMaxTierPrice,
  };
}

function buildSeedTiersForEvent(eventId: string): MockSponsorshipTier[] {
  return blueprintTiersForSeedEvent(eventId).map((t, index) => ({
    id: `${eventId}-tier-${index + 1}`,
    eventId,
    name: t.name,
    priceUsd: t.priceUsd,
    benefits: [...t.benefits],
  }));
}

/** Fills empty tier lists on known seed event ids (older mock localStorage). */
function migrateSeedTiersIfNeeded(events: MockEvent[]): MockEvent[] {
  let changed = false;
  const next = events.map((e) => {
    if (e.sponsorshipTiers.length > 0) return e;
    const tiers = buildSeedTiersForEvent(e.id);
    if (tiers.length === 0) return e;
    changed = true;
    return withEventDefaults({ ...e, sponsorshipTiers: tiers });
  });
  if (changed) writeEvents(next);
  return next;
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
      sponsorshipTiers: buildSeedTiersForEvent('seed-techconnect'),
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
      sponsorshipTiers: buildSeedTiersForEvent('seed-finance-forum'),
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
      sponsorshipTiers: buildSeedTiersForEvent('seed-green-expo'),
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
      sponsorshipTiers: buildSeedTiersForEvent('seed-wellness'),
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
    return migrateSeedTiersIfNeeded(parsed.map((e) => withEventDefaults(e as MockEvent)));
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

export function getMockEventById(eventId: string): MockEvent | undefined {
  return readEvents().find((e) => e.id === eventId);
}

/** Resolve catalog event for a deal thread (by id or title + creator). */
export function getMockEventForDealThread(thread: {
  eventId?: string;
  eventTitle: string;
  creatorId: string;
}): MockEvent | undefined {
  const events = readEvents();
  if (thread.eventId) {
    const byId = events.find((e) => e.id === thread.eventId);
    if (byId) return byId;
  }
  return events.find(
    (e) => e.title === thread.eventTitle && e.creatorId === thread.creatorId
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
  const sponsorshipTiers: MockSponsorshipTier[] = input.sponsorshipTiers
    .map((tier, index) => {
      const name = tier.name.trim();
      const benefits = tier.benefits.map((benefit) => benefit.trim()).filter(Boolean);
      const priceUsd = Number.isFinite(tier.priceUsd)
        ? Math.max(0, Math.floor(tier.priceUsd))
        : 0;

      if (!name) return null;
      return {
        id: `${id}-tier-${index + 1}`,
        eventId: id,
        name,
        priceUsd,
        benefits,
      };
    })
    .filter((tier): tier is MockSponsorshipTier => Boolean(tier));

  const sponsorshipTierCount = sponsorshipTiers.length;
  const sponsorshipMaxPriceUsd = sponsorshipTiers.reduce(
    (maxPrice, tier) => Math.max(maxPrice, tier.priceUsd),
    0
  );

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
    sponsorshipTiers,
    sponsorshipTierCount,
    sponsorshipMaxPriceUsd,
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
