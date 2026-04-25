import type { MockUserRole } from '@/auth/lib/mockAuth';

const STORAGE_PROPOSALS = 'eventlink_mock_deal_proposals';

export type MockProposalStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'superseded'
  | 'countered';

export type MockDealProposal = {
  id: string;
  threadId: string;
  senderRole: MockUserRole;
  senderName: string;
  kind: 'tier' | 'custom' | 'counter';
  linkedTierId: string | null;
  label: string;
  amountUsd: number;
  description: string;
  status: MockProposalStatus;
  parentProposalId: string | null;
  createdAt: string;
};

type ProposalStore = Record<string, MockDealProposal[]>;

function readStore(): ProposalStore {
  try {
    const raw = localStorage.getItem(STORAGE_PROPOSALS);
    if (!raw) {
      const seeded = seedInitialStore();
      localStorage.setItem(STORAGE_PROPOSALS, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as ProposalStore;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      const seeded = seedInitialStore();
      localStorage.setItem(STORAGE_PROPOSALS, JSON.stringify(seeded));
      return seeded;
    }
    return parsed as ProposalStore;
  } catch {
    const seeded = seedInitialStore();
    localStorage.setItem(STORAGE_PROPOSALS, JSON.stringify(seeded));
    return seeded;
  }
}

function writeStore(store: ProposalStore) {
  localStorage.setItem(STORAGE_PROPOSALS, JSON.stringify(store));
}

function seedInitialStore(): ProposalStore {
  const now = new Date().toISOString();
  return {
    'thread-1': [
      {
        id: 'prop-seed-techconnect-1',
        threadId: 'thread-1',
        senderRole: 'creator',
        senderName: 'Sarah Chen',
        kind: 'tier',
        linkedTierId: 'seed-techconnect-tier-1',
        label: 'Platinum',
        amountUsd: 50_000,
        description: 'Platinum sponsorship with keynote slot and premium booth.',
        status: 'pending',
        parentProposalId: null,
        createdAt: new Date(now).toISOString(),
      },
    ],
  };
}

export function listProposalsForThread(threadId: string): MockDealProposal[] {
  const store = readStore();
  const list = store[threadId] ?? [];
  return [...list].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function appendDealProposal(input: {
  threadId: string;
  senderRole: MockUserRole;
  senderName: string;
  kind: 'tier' | 'custom' | 'counter';
  linkedTierId: string | null;
  label: string;
  amountUsd: number;
  description: string;
  parentProposalId?: string | null;
}): MockDealProposal {
  const store = readStore();
  const list = [...(store[input.threadId] ?? [])];
  const proposal: MockDealProposal = {
    id: `prop-${crypto.randomUUID()}`,
    threadId: input.threadId,
    senderRole: input.senderRole,
    senderName: input.senderName,
    kind: input.kind,
    linkedTierId: input.linkedTierId,
    label: input.label,
    amountUsd: input.amountUsd,
    description: input.description.trim(),
    status: 'pending',
    parentProposalId: input.parentProposalId ?? null,
    createdAt: new Date().toISOString(),
  };
  list.push(proposal);
  store[input.threadId] = list;
  writeStore(store);
  return proposal;
}

export function acceptDealProposal(threadId: string, proposalId: string): void {
  const store = readStore();
  const list = [...(store[threadId] ?? [])];
  const next = list.map((p) => {
    if (p.id === proposalId) return { ...p, status: 'accepted' as const };
    if (p.status === 'pending') return { ...p, status: 'superseded' as const };
    return p;
  });
  store[threadId] = next;
  writeStore(store);
}

export function declineDealProposal(threadId: string, proposalId: string): void {
  const store = readStore();
  const list = [...(store[threadId] ?? [])];
  const next = list.map((p) =>
    p.id === proposalId ? { ...p, status: 'declined' as const } : p
  );
  store[threadId] = next;
  writeStore(store);
}

export function counterDealProposal(input: {
  threadId: string;
  parentProposalId: string;
  senderRole: MockUserRole;
  senderName: string;
  amountUsd: number;
  note: string;
  /** Usually the tier / package label being countered */
  label: string;
  linkedTierId: string | null;
}): MockDealProposal {
  const store = readStore();
  const list = [...(store[input.threadId] ?? [])];
  const parent = list.find((p) => p.id === input.parentProposalId);
  if (!parent || parent.status !== 'pending') {
    throw new Error('Invalid proposal to counter.');
  }
  const marked = list.map((p) =>
    p.id === input.parentProposalId ? { ...p, status: 'countered' as const } : p
  );
  const description =
    input.note.trim().length > 0
      ? input.note.trim()
      : `Counter-offer at $${input.amountUsd.toLocaleString('en-US')}.`;
  const proposal: MockDealProposal = {
    id: `prop-${crypto.randomUUID()}`,
    threadId: input.threadId,
    senderRole: input.senderRole,
    senderName: input.senderName,
    kind: 'counter',
    linkedTierId: input.linkedTierId,
    label: input.label,
    amountUsd: input.amountUsd,
    description,
    status: 'pending',
    parentProposalId: input.parentProposalId,
    createdAt: new Date().toISOString(),
  };
  marked.push(proposal);
  store[input.threadId] = marked;
  writeStore(store);
  return proposal;
}

/** Derived from proposals for this thread — same lifecycle as sponsor My Deals. */
export type DealNegotiationStatus =
  | 'not_started'
  | 'negotiating'
  | 'accepted'
  | 'declined';

export function dealNegotiationStatusForThread(threadId: string): DealNegotiationStatus {
  const proposals = listProposalsForThread(threadId);
  if (proposals.length === 0) return 'not_started';
  if (proposals.some((p) => p.status === 'accepted')) return 'accepted';
  if (proposals.some((p) => p.status === 'pending')) return 'negotiating';
  return 'declined';
}

export function dealNegotiationStatusLabel(status: DealNegotiationStatus): string {
  switch (status) {
    case 'not_started':
      return 'Not started';
    case 'negotiating':
      return 'Negotiating';
    case 'accepted':
      return 'Accepted';
    case 'declined':
      return 'Declined';
  }
}

/** Demo-only: removes all proposals for a thread (e.g. cancel accepted deal → not started). */
export function clearDealProposalsForThread(threadId: string): void {
  const store = readStore();
  const next = { ...store };
  delete next[threadId];
  writeStore(next);
}
