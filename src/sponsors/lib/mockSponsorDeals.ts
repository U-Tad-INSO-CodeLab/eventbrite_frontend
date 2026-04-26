import {
  dealNegotiationStatusForThread,
  listProposalsForThread,
  type DealNegotiationStatus,
} from '@/chat/lib/mockDealProposals';
import { listDealThreadsForUser, type MockDealThread } from '@/chat/lib/mockDealThreads';

/** Same values as deal room / proposals store (see `dealNegotiationStatusForThread`). */
export type SponsorDealStatus = DealNegotiationStatus;

export type SponsorDealSummary = {
  threadId: string;
  eventTitle: string;
  /** Creator / organizer name shown on the deal card */
  organizerName: string;
  /** e.g. "Platinum · Sarah Chen" (package label · organizer) */
  detailLine: string;
  /** Formatted USD or em dash when no amount yet */
  amountLabel: string;
  status: SponsorDealStatus;
};

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function detailAndAmount(thread: MockDealThread): { detailLine: string; amountLabel: string } {
  const proposals = listProposalsForThread(thread.id);
  const sorted = [...proposals].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const focus =
    sorted.find((p) => p.status === 'pending') ?? sorted.find((p) => p.status === 'accepted') ?? sorted[0];

  const organizer = thread.peerNameForSponsor;
  if (!focus) {
    return {
      detailLine: `Open conversation · ${organizer}`,
      amountLabel: '—',
    };
  }
  return {
    detailLine: `${focus.label} · ${organizer}`,
    amountLabel: formatUsd(focus.amountUsd),
  };
}

export function listSponsorDealSummaries(sponsorId: string): SponsorDealSummary[] {
  const threads = listDealThreadsForUser(sponsorId, 'sponsor');
  return threads.map((t) => {
    const { detailLine, amountLabel } = detailAndAmount(t);
    return {
      threadId: t.id,
      eventTitle: t.eventTitle,
      organizerName: t.peerNameForSponsor,
      detailLine,
      amountLabel,
      status: dealNegotiationStatusForThread(t.id),
    };
  });
}
