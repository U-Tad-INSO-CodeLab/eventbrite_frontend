import type { MockSessionUser, MockUserRole } from '@/auth/lib/mockAuth';
import {
  clearMockChannelStorage,
  createMockAblyRealtime,
  listMessagesForEvent,
} from '@/chat/lib/mockAblyChat';
import { MOCK_CHAT_MESSAGE_EVENT, dealRoomChannelName } from '@/chat/constants';
import type { MockEvent } from '@/events/lib/mockEvents';

const STORAGE_THREADS = 'eventlink_mock_deal_threads';

export type MockDealThread = {
  id: string;
  /** When set, matches a row in mock events (Discover / creator inventory). */
  eventId?: string;
  eventTitle: string;
  sponsorId: string;
  creatorId: string;
  /** Nombre que ve el patrocinador (interlocutor creador) */
  peerNameForSponsor: string;
  /** Nombre que ve el creador (interlocutor patrocinador) */
  peerNameForCreator: string;
  lastPreview: string;
  lastAt: string;
  unreadForSponsor: number;
  unreadForCreator: number;
};

function readThreads(): MockDealThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_THREADS);
    if (!raw) return seedIfEmpty();
    const parsed = JSON.parse(raw) as MockDealThread[];
    const list = Array.isArray(parsed) ? parsed : [];
    if (list.length === 0) return seedIfEmpty();
    seedInitialMessagesForThreads(list);
    return list;
  } catch {
    return seedIfEmpty();
  }
}

function writeThreads(threads: MockDealThread[]) {
  localStorage.setItem(STORAGE_THREADS, JSON.stringify(threads));
}

/** Marca local en un día concreto (para sembrar chat con separadores por día). */
function atDaysAgo(daysAgo: number, hours = 10, minutes = 0): number {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hours, minutes, 0, 0);
  return d.getTime();
}

function seedIfEmpty(): MockDealThread[] {
  const seed: MockDealThread[] = [
    {
      id: 'thread-1',
      eventId: 'seed-techconnect',
      eventTitle: 'TechConnect Summit 2026',
      sponsorId: 'seed-sponsor',
      creatorId: 'seed-creator',
      peerNameForSponsor: 'Sarah Chen',
      peerNameForCreator: 'Sponsor demo',
      lastPreview: 'Thanks for the context — can we align on deliverables?',
      lastAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      unreadForSponsor: 2,
      unreadForCreator: 0,
    },
    {
      id: 'thread-2',
      eventTitle: 'GreenBuild Expo',
      sponsorId: 'seed-sponsor',
      creatorId: 'seed-creator',
      peerNameForSponsor: 'Aisha Patel',
      peerNameForCreator: 'Sponsor demo',
      lastPreview: 'Let’s pick this up next week.',
      lastAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      unreadForSponsor: 0,
      unreadForCreator: 1,
    },
    {
      id: 'thread-3',
      eventTitle: 'City Arts Night',
      sponsorId: 'seed-sponsor',
      creatorId: 'seed-creator',
      peerNameForSponsor: 'Emma Watson',
      peerNameForCreator: 'Sponsor demo',
      lastPreview: 'Sounds good — I’ll send a short recap.',
      lastAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      unreadForSponsor: 0,
      unreadForCreator: 0,
    },
  ];
  writeThreads(seed);
  seedInitialMessagesForThreads(seed);
  return seed;
}

function seedInitialMessagesForThreads(threads: MockDealThread[]) {
  const rt = createMockAblyRealtime();
  for (const t of threads) {
    const channel = dealRoomChannelName(t.id);
    const ch = rt.channels.get(channel);
    const history = ch.history();
    if (history.some((m) => m.name === MOCK_CHAT_MESSAGE_EVENT)) continue;

    let seeds: Array<{ data: Record<string, unknown>; at: number }> = [];
    if (t.id === 'thread-1') {
      seeds = [
        {
          at: atDaysAgo(5, 9, 12),
          data: {
            senderId: t.creatorId,
            senderName: t.peerNameForSponsor,
            senderRole: 'creator',
            body: 'Hi — excited about TechConnect. Can we walk through visibility options?',
          },
        },
        {
          at: atDaysAgo(1, 15, 40),
          data: {
            senderId: t.sponsorId,
            senderName: t.peerNameForCreator,
            senderRole: 'sponsor',
            body: 'Absolutely. I’ll share a short overview and we can iterate.',
          },
        },
        {
          at: Date.now() - 2 * 60 * 1000,
          data: {
            senderId: t.creatorId,
            senderName: t.peerNameForSponsor,
            senderRole: 'creator',
            body: 'Thanks for the context — can we align on deliverables?',
          },
        },
      ];
    } else if (t.id === 'thread-2') {
      seeds = [
        {
          at: atDaysAgo(4, 11, 5),
          data: {
            senderId: t.sponsorId,
            senderName: t.peerNameForCreator,
            senderRole: 'sponsor',
            body: 'Following up on GreenBuild — do you have a deck?',
          },
        },
        {
          at: Date.now() - 60 * 60 * 1000,
          data: {
            senderId: t.creatorId,
            senderName: t.peerNameForSponsor,
            senderRole: 'creator',
            body: 'Let’s pick this up next week.',
          },
        },
      ];
    } else if (t.id === 'thread-3') {
      seeds = [
        {
          at: atDaysAgo(8, 10, 0),
          data: {
            senderId: t.creatorId,
            senderName: t.peerNameForSponsor,
            senderRole: 'creator',
            body: 'Thanks for reaching out about City Arts Night.',
          },
        },
        {
          at: atDaysAgo(3, 14, 20),
          data: {
            senderId: t.sponsorId,
            senderName: t.peerNameForCreator,
            senderRole: 'sponsor',
            body: 'Happy to support — what dates work for a call?',
          },
        },
        {
          at: Date.now() - 26 * 60 * 60 * 1000,
          data: {
            senderId: t.creatorId,
            senderName: t.peerNameForSponsor,
            senderRole: 'creator',
            body: 'Sounds good — I’ll send a short recap.',
          },
        },
      ];
    }

    if (seeds.length === 0) continue;

    for (const { data, at } of seeds) {
      ch.publish(MOCK_CHAT_MESSAGE_EVENT, data, at);
    }
  }
}

export function listDealThreadsForUser(userId: string, role: MockUserRole): MockDealThread[] {
  const all = readThreads();
  return all.filter(
    (t) =>
      (role === 'sponsor' && t.sponsorId === userId) ||
      (role === 'creator' && t.creatorId === userId)
  );
}

export function getDealThreadById(threadId: string): MockDealThread | undefined {
  return readThreads().find((t) => t.id === threadId);
}

export function findDealThreadForSponsorAndEvent(
  sponsorId: string,
  event: MockEvent
): MockDealThread | undefined {
  return readThreads().find((t) => {
    if (t.sponsorId !== sponsorId || t.creatorId !== event.creatorId) return false;
    if (t.eventId) return t.eventId === event.id;
    return t.eventTitle === event.title;
  });
}

/**
 * Opens the negotiation for this sponsor + event: reuses an existing thread or persists a new one.
 */
export function ensureDealThreadForSponsorEvent(
  sponsor: MockSessionUser,
  event: MockEvent
): MockDealThread {
  if (sponsor.role !== 'sponsor') {
    throw new Error('Only sponsor accounts can start a deal thread from Discover.');
  }
  const existing = findDealThreadForSponsorAndEvent(sponsor.id, event);
  if (existing) return existing;

  const id = `thread-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const thread: MockDealThread = {
    id,
    eventId: event.id,
    eventTitle: event.title,
    sponsorId: sponsor.id,
    creatorId: event.creatorId,
    peerNameForSponsor: event.creatorName,
    peerNameForCreator: sponsor.fullName,
    lastPreview: `Interested in sponsoring "${event.title}".`,
    lastAt: now,
    unreadForSponsor: 0,
    unreadForCreator: 0,
  };
  const all = readThreads();
  writeThreads([thread, ...all]);
  return thread;
}

/**
 * Removes deal threads owned by this sponsor that have no chat messages yet
 * (e.g. opened from Discover and left without sending).
 */
export function removeEmptyDealThreadsForSponsor(sponsorId: string): void {
  const all = readThreads();
  const toRemove = all.filter((t) => {
    if (t.sponsorId !== sponsorId) return false;
    const channel = dealRoomChannelName(t.id);
    return listMessagesForEvent(channel, MOCK_CHAT_MESSAGE_EVENT).length === 0;
  });
  if (toRemove.length === 0) return;
  const removeIds = new Set(toRemove.map((t) => t.id));
  writeThreads(all.filter((t) => !removeIds.has(t.id)));
  for (const t of toRemove) {
    clearMockChannelStorage(dealRoomChannelName(t.id));
  }
}

export function peerNameForThread(thread: MockDealThread, role: MockUserRole): string {
  return role === 'sponsor' ? thread.peerNameForSponsor : thread.peerNameForCreator;
}

export function markThreadRead(threadId: string, role: MockUserRole): void {
  const all = readThreads();
  const next = all.map((t) => {
    if (t.id !== threadId) return t;
    return {
      ...t,
      unreadForSponsor: role === 'sponsor' ? 0 : t.unreadForSponsor,
      unreadForCreator: role === 'creator' ? 0 : t.unreadForCreator,
    };
  });
  writeThreads(next);
}

export function updateThreadPreview(
  threadId: string,
  preview: string,
  atMs: number
): void {
  const all = readThreads();
  const next = all.map((t) =>
    t.id === threadId ? { ...t, lastPreview: preview, lastAt: new Date(atMs).toISOString() } : t
  );
  writeThreads(next);
}
