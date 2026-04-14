import type { MockSessionUser } from './mockAuth';

const STORAGE_EVENTS = 'eventlink_mock_events';

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

function readEvents(): MockEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MockEvent[];
    return Array.isArray(parsed) ? parsed : [];
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
  const event: MockEvent = {
    id: crypto.randomUUID(),
    creatorId: creator.id,
    creatorName: creator.fullName,
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date.trim(),
    location: input.location.trim(),
    industry: input.industry.trim(),
    expectedAttendance: input.expectedAttendance,
    tags: input.tags,
    coverImageDataUrl: input.coverImageDataUrl,
    createdAt: new Date().toISOString(),
  };

  events.unshift(event);
  writeEvents(events);

  return { ok: true, event };
}

export function getMockEventsByCreator(creatorId: string): MockEvent[] {
  return readEvents().filter((event) => event.creatorId === creatorId);
}
