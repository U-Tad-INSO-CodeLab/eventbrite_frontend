import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  InputBase,
  Typography,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type { MockSessionUser } from '@/auth/lib/mockAuth';
import {
  acceptDealProposal,
  appendDealProposal,
  clearDealProposalsForThread,
  counterDealProposal,
  declineDealProposal,
  listProposalsForThread,
  type MockDealProposal,
} from '@/chat/lib/mockDealProposals';
import { publishDealThreadChatMessage } from '@/chat/lib/dealRoomChatPublish';
import type { MockDealThread } from '@/chat/lib/mockDealThreads';
import {
  bumpUnreadChatForPeerOf,
  bumpUnreadProposalForPeerOf,
  updateThreadPreview,
} from '@/chat/lib/mockDealThreads';
import type { MockSponsorshipTier } from '@/events/lib/mockEvents';
import { getMockEventForDealThread } from '@/events/lib/mockEvents';

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseUsdInput(raw: string): number {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return 0;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

type DealRoomProposalTabProps = {
  session: MockSessionUser;
  thread: MockDealThread;
  peerName: string;
  onMutate: () => void;
};

export default function DealRoomProposalTab({
  session,
  thread,
  peerName,
  onMutate,
}: DealRoomProposalTabProps) {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
    onMutate();
  }, [onMutate]);

  const proposals = useMemo(
    () => listProposalsForThread(thread.id),
    [thread.id, version]
  );

  const hasAccepted = useMemo(
    () => proposals.some((p) => p.status === 'accepted'),
    [proposals]
  );

  const acceptedProposal = useMemo((): MockDealProposal | null => {
    const accepted = proposals.filter((p) => p.status === 'accepted');
    if (accepted.length === 0) return null;
    return [...accepted].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]!;
  }, [proposals]);

  const { incomingPending, outgoingPending, respondIncoming, waitOutgoing, initiate } =
    useMemo(() => {
      const incoming = proposals.filter(
        (p) => p.status === 'pending' && p.senderRole !== session.role
      );
      const outgoing = proposals.filter(
        (p) => p.status === 'pending' && p.senderRole === session.role
      );
      const respond = incoming.length > 0;
      const wait = !respond && outgoing.length > 0;
      const init = !respond && !wait;
      return {
        incomingPending: incoming,
        outgoingPending: outgoing,
        respondIncoming: respond,
        waitOutgoing: wait,
        initiate: init,
      };
    }, [proposals, session.role]);

  /** Latest outgoing only when waiting on peer (solo “tu oferta” activa). */
  const proposalsForWaitView = useMemo(() => {
    if (outgoingPending.length === 0) return [];
    const sorted = [...outgoingPending].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return [sorted[sorted.length - 1]!];
  }, [outgoingPending]);

  const activityProposals = respondIncoming ? incomingPending : proposalsForWaitView;

  const event = useMemo(
    () => getMockEventForDealThread(thread),
    [thread.eventId, thread.eventTitle, thread.creatorId]
  );
  const tiers: MockSponsorshipTier[] = event?.sponsorshipTiers ?? [];

  const [counterForId, setCounterForId] = useState<string | null>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterNote, setCounterNote] = useState('');

  const [customAmount, setCustomAmount] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  const openCounter = useCallback((p: MockDealProposal) => {
    setCounterForId(p.id);
    setCounterAmount(String(p.amountUsd));
    setCounterNote('');
  }, []);

  const cancelCounter = useCallback(() => {
    setCounterForId(null);
    setCounterAmount('');
    setCounterNote('');
  }, []);

  const postProposalActivityToChat = useCallback(
    (body: string) => {
      publishDealThreadChatMessage({
        threadId: thread.id,
        senderId: session.id,
        senderName: session.fullName,
        senderRole: session.role,
        body,
      });
      bumpUnreadChatForPeerOf(thread.id, session.role);
      bumpUnreadProposalForPeerOf(thread.id, session.role);
    },
    [session.fullName, session.id, session.role, thread.id]
  );

  const sendTierProposal = useCallback(
    (tier: MockSponsorshipTier) => {
      appendDealProposal({
        threadId: thread.id,
        senderRole: session.role,
        senderName: session.fullName,
        kind: 'tier',
        linkedTierId: tier.id,
        label: tier.name,
        amountUsd: tier.priceUsd,
        description:
          tier.benefits.length > 0
            ? `${tier.name} — ${tier.benefits.join(' · ')}`
            : `${tier.name} sponsorship package.`,
      });
      updateThreadPreview(
        thread.id,
        `Proposal: ${tier.name} · ${formatUsd(tier.priceUsd)}`,
        Date.now()
      );
      postProposalActivityToChat(
        `Sent a sponsorship proposal: ${tier.name} · ${formatUsd(tier.priceUsd)}.`
      );
      refresh();
    },
    [postProposalActivityToChat, refresh, session.fullName, session.role, thread.id]
  );

  const sendCustomProposal = useCallback(() => {
    const amount = parseUsdInput(customAmount);
    if (amount <= 0) return;
    const label = 'Custom tier';
    appendDealProposal({
      threadId: thread.id,
      senderRole: session.role,
      senderName: session.fullName,
      kind: 'custom',
      linkedTierId: null,
      label,
      amountUsd: amount,
      description:
        customDesc.trim().length > 0
          ? customDesc.trim()
          : `Custom tier at ${formatUsd(amount)}.`,
    });
    updateThreadPreview(thread.id, `Proposal: ${label} · ${formatUsd(amount)}`, Date.now());
    postProposalActivityToChat(`Sent a custom tier proposal · ${formatUsd(amount)}.`);
    setCustomAmount('');
    setCustomDesc('');
    refresh();
  }, [customAmount, customDesc, postProposalActivityToChat, refresh, session.fullName, session.role, thread.id]);

  const submitCounter = useCallback(
    (parent: MockDealProposal) => {
      const amount = parseUsdInput(counterAmount);
      if (amount <= 0) return;
      try {
        counterDealProposal({
          threadId: thread.id,
          parentProposalId: parent.id,
          senderRole: session.role,
          senderName: session.fullName,
          amountUsd: amount,
          note: counterNote,
          label: parent.label,
          linkedTierId: parent.linkedTierId,
        });
        updateThreadPreview(
          thread.id,
          `Counter-offer: ${parent.label} · ${formatUsd(amount)}`,
          Date.now()
        );
        postProposalActivityToChat(
          `Sent a counter-offer on ${parent.label} · ${formatUsd(amount)}.`
        );
        cancelCounter();
        refresh();
      } catch {
        cancelCounter();
      }
    },
    [
      cancelCounter,
      counterAmount,
      counterNote,
      postProposalActivityToChat,
      refresh,
      session.fullName,
      session.role,
      thread.id,
    ]
  );

  const tierSectionTitle =
    session.role === 'sponsor'
      ? 'Available sponsorship tiers'
      : 'Your event tiers';
  const tierSectionHint =
    session.role === 'sponsor'
      ? 'Select a tier to send a proposal to the organizer.'
      : 'Select a tier to suggest to the sponsor.';

  const showAcceptedSummary = hasAccepted;
  const showActivitySection = !hasAccepted && (respondIncoming || waitOutgoing);
  const showTiers = !hasAccepted && initiate && tiers.length > 0;
  const showCustom = !hasAccepted && initiate && session.role === 'sponsor';

  const matchedTierForCustomAmount = useMemo((): MockSponsorshipTier | null => {
    if (!showCustom || tiers.length === 0) return null;
    const amount = parseUsdInput(customAmount);
    if (amount <= 0) return null;
    return tiers.find((t) => t.priceUsd === amount) ?? null;
  }, [customAmount, showCustom, tiers]);

  const activityTitle = respondIncoming
    ? 'Incoming proposal'
    : 'Your proposal';
  const activityLead = respondIncoming
    ? `Respond with accept, counter, or decline. Offer from ${peerName}.`
    : `Waiting for ${peerName} to respond.`;

  const tierCtaLabel = session.role === 'sponsor' ? 'Send this proposal' : 'Suggest this tier';

  const cancelAcceptedDeal = useCallback(() => {
    if (
      !window.confirm(
        'Cancel this accepted deal? In demo mode all proposals for this conversation will be cleared and you can negotiate again from scratch.'
      )
    ) {
      return;
    }
    clearDealProposalsForThread(thread.id);
    updateThreadPreview(thread.id, 'Deal cancelled — you can send new proposals.', Date.now());
    postProposalActivityToChat(
      'Cancelled the accepted sponsorship deal. You can send new proposals when ready.'
    );
    refresh();
  }, [postProposalActivityToChat, refresh, thread.id]);

  return (
    <Box className="deal-room-proposal-root">
      {showAcceptedSummary && acceptedProposal ? (
        <Box className="deal-room-proposal-section">
          <Box className="deal-room-proposal-accepted-hero">
            <CheckCircleOutlinedIcon className="deal-room-proposal-accepted-hero-icon" aria-hidden />
            <Box>
              <Typography component="h2" className="deal-room-proposal-accepted-title">
                Deal in place
              </Typography>
              <Typography component="p" className="deal-room-proposal-accepted-lead">
                You and {peerName} have an accepted sponsorship agreement for{' '}
                <Box component="strong" className="deal-room-proposal-accepted-event">
                  {thread.eventTitle}
                </Box>
                . There is nothing left to negotiate on this package unless you start over.
              </Typography>
            </Box>
          </Box>

          <Box className="deal-room-proposal-accepted-card">
            <Box className="deal-room-proposal-accepted-card-head">
              <Typography component="span" className="deal-room-proposal-accepted-package">
                {acceptedProposal.label} · {formatUsd(acceptedProposal.amountUsd)}
              </Typography>
              <span className="deal-room-proposal-status deal-room-proposal-status--accepted">
                accepted
              </span>
            </Box>
            <Typography component="p" className="deal-room-proposal-accepted-desc">
              {acceptedProposal.description}
            </Typography>
            <Typography component="p" className="deal-room-proposal-accepted-meta">
              Confirmed offer from{' '}
              <Box component="strong" className="deal-room-proposal-accepted-strong">
                {acceptedProposal.senderName}
              </Box>{' '}
              · {acceptedProposal.kind === 'counter' ? 'Counter-offer' : acceptedProposal.kind === 'custom' ? 'Custom tier' : 'Tier package'}
            </Typography>
          </Box>

          <Box className="deal-room-proposal-accepted-actions">
            <Button
              type="button"
              variant="outlined"
              className="deal-room-proposal-btn-cancel-deal"
              onClick={cancelAcceptedDeal}
            >
              Cancel deal
            </Button>
            <Typography component="p" className="deal-room-proposal-accepted-footnote">
              Demo only: cancels the agreement and clears proposal history for this thread (back to
              &quot;not started&quot; on My Deals).
            </Typography>
          </Box>
        </Box>
      ) : null}

      {showActivitySection ? (
        <Box className="deal-room-proposal-section">
          <Typography component="h2" className="deal-room-proposal-section-title">
            {activityTitle}
          </Typography>
          <Typography component="p" className="deal-room-proposal-section-lead">
            {activityLead}
          </Typography>

          <Box className="deal-room-proposal-list">
            {activityProposals.map((p) => {
              const incoming = p.senderRole !== session.role;
              const pending = p.status === 'pending';
              const readOnly = waitOutgoing;
              const showActions = !readOnly && incoming && pending;
              const counterOpen = counterForId === p.id;

              return (
                <Box key={p.id} className="deal-room-proposal-card">
                  <Box className="deal-room-proposal-card-head">
                    <Box className="deal-room-proposal-card-title-row">
                      <AttachMoneyIcon className="deal-room-proposal-card-icon" aria-hidden />
                      <Typography component="span" className="deal-room-proposal-card-title">
                        {p.label} · {formatUsd(p.amountUsd)}
                      </Typography>
                    </Box>
                    <Typography
                      component="span"
                      className={
                        incoming
                          ? 'deal-room-proposal-card-sender'
                          : 'deal-room-proposal-card-sender deal-room-proposal-card-sender--you'
                      }
                    >
                      {incoming ? `${p.senderName} sent` : 'You sent'}
                    </Typography>
                  </Box>
                  <Typography component="p" className="deal-room-proposal-card-desc">
                    {p.description}
                  </Typography>
                  <Box className="deal-room-proposal-card-meta">
                    <span className={`deal-room-proposal-status deal-room-proposal-status--${p.status}`}>
                      {p.status}
                    </span>
                    {p.kind === 'counter' ? (
                      <span className="deal-room-proposal-kind">Counter-offer</span>
                    ) : null}
                  </Box>

                  {counterOpen ? (
                    <Box className="deal-room-proposal-counter">
                      <Typography component="h3" className="deal-room-proposal-counter-title">
                        <AttachMoneyIcon fontSize="small" aria-hidden />
                        Send counter-offer for {p.label}
                      </Typography>
                      <Typography component="label" className="deal-room-proposal-field-label">
                        Your amount
                      </Typography>
                      <InputBase
                        className="deal-room-proposal-input"
                        value={counterAmount ? `$${counterAmount}` : ''}
                        onChange={(e) =>
                          setCounterAmount(e.target.value.replace(/[^\d]/g, ''))
                        }
                        inputProps={{ 'aria-label': 'Counter amount in USD' }}
                      />
                      <InputBase
                        className="deal-room-proposal-input deal-room-proposal-input--note"
                        placeholder="Optional note…"
                        value={counterNote}
                        onChange={(e) => setCounterNote(e.target.value)}
                      />
                      <Box className="deal-room-proposal-counter-actions">
                        <Button
                          type="button"
                          variant="contained"
                          className="deal-room-proposal-btn-primary"
                          onClick={() => submitCounter(p)}
                        >
                          Send counter
                        </Button>
                        <Button
                          type="button"
                          variant="outlined"
                          className="deal-room-proposal-btn-cancel"
                          onClick={cancelCounter}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : null}

                  {showActions && !counterOpen ? (
                    <Box className="deal-room-proposal-actions">
                      <Button
                        type="button"
                        variant="contained"
                        className="deal-room-proposal-btn-primary"
                        startIcon={<CheckIcon />}
                        onClick={() => {
                          acceptDealProposal(thread.id, p.id);
                          updateThreadPreview(thread.id, 'Proposal accepted', Date.now());
                          postProposalActivityToChat(
                            `Accepted the proposal: ${p.label} · ${formatUsd(p.amountUsd)}.`
                          );
                          refresh();
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        className="deal-room-proposal-btn-counter"
                        startIcon={<AttachMoneyIcon />}
                        onClick={() => openCounter(p)}
                      >
                        Counter
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        className="deal-room-proposal-btn-decline"
                        startIcon={<CloseIcon />}
                        onClick={() => {
                          declineDealProposal(thread.id, p.id);
                          updateThreadPreview(thread.id, 'Proposal declined', Date.now());
                          postProposalActivityToChat(`Declined the proposal: ${p.label}.`);
                          refresh();
                        }}
                      >
                        Decline
                      </Button>
                    </Box>
                  ) : null}

                  {readOnly && pending ? (
                    <Typography component="p" className="deal-room-proposal-waiting">
                      Waiting for {peerName} to respond.
                    </Typography>
                  ) : null}
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : null}

      {showTiers ? (
        <Box className="deal-room-proposal-section">
          <Typography component="h2" className="deal-room-proposal-section-title">
            {tierSectionTitle}
          </Typography>
          <Typography component="p" className="deal-room-proposal-section-lead">
            {tierSectionHint}
          </Typography>
          <Box className="deal-room-proposal-tier-stack">
            {tiers.map((tier) => (
              <Box key={tier.id} className="deal-room-proposal-tier-card">
                <Box className="deal-room-proposal-tier-top">
                  <Box className="deal-room-proposal-tier-name-row">
                    <StarBorderIcon className="deal-room-proposal-tier-star" aria-hidden />
                    <Typography component="span" className="deal-room-proposal-tier-name">
                      {tier.name}
                    </Typography>
                  </Box>
                  <Typography component="span" className="deal-room-proposal-tier-price">
                    {formatUsd(tier.priceUsd)}
                  </Typography>
                </Box>
                <Typography component="p" className="deal-room-proposal-tier-benefits">
                  {tier.benefits.join(' · ')}
                </Typography>
                <Box className="deal-room-proposal-tier-footer">
                  <Button
                    type="button"
                    variant="outlined"
                    className="deal-room-proposal-tier-btn"
                    onClick={() => sendTierProposal(tier)}
                  >
                    {tierCtaLabel}
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : !hasAccepted && initiate && tiers.length === 0 ? (
        <Box className="deal-room-proposal-section">
          <Typography component="p" className="deal-room-proposal-empty deal-room-proposal-empty--solo">
            This conversation is not linked to an event with sponsorship tiers in mock data.
          </Typography>
        </Box>
      ) : null}

      {showCustom ? (
        <Box className="deal-room-proposal-section">
          <Typography component="h2" className="deal-room-proposal-section-title">
            Custom tier
          </Typography>
          <Typography component="p" className="deal-room-proposal-section-lead">
            Set your amount and optional details. The proposal is always labeled “Custom tier”.
          </Typography>
          <Box className="deal-room-proposal-custom">
            <InputBase
              className={`deal-room-proposal-input${matchedTierForCustomAmount ? ' deal-room-proposal-input--tier-match' : ''}`}
              placeholder="Amount (USD)"
              value={customAmount ? `$${customAmount}` : ''}
              onChange={(e) => setCustomAmount(e.target.value.replace(/[^\d]/g, ''))}
              inputProps={{ 'aria-label': 'Custom tier amount in USD' }}
            />
            {matchedTierForCustomAmount ? (
              <Box
                className="deal-room-proposal-tier-match"
                role="status"
                aria-live="polite"
              >
                <InfoOutlinedIcon
                  className="deal-room-proposal-tier-match-icon"
                  aria-hidden
                />
                <Box className="deal-room-proposal-tier-match-body">
                  <Typography
                    component="p"
                    className="deal-room-proposal-tier-match-title"
                  >
                    This price matches an existing tier
                  </Typography>
                  <Typography
                    component="p"
                    className="deal-room-proposal-tier-match-text"
                  >
                    <Box component="strong" className="deal-room-proposal-tier-match-strong">
                      {matchedTierForCustomAmount.name}
                    </Box>{' '}
                    at {formatUsd(matchedTierForCustomAmount.priceUsd)} already includes:{' '}
                    {matchedTierForCustomAmount.benefits.length > 0
                      ? `${matchedTierForCustomAmount.benefits.join(', ')}.`
                      : 'the standard deliverables for this package.'}
                  </Typography>
                  <Typography
                    component="p"
                    className="deal-room-proposal-tier-match-text deal-room-proposal-tier-match-tip"
                  >
                    If that package works for you, choose{' '}
                    <Box component="strong" className="deal-room-proposal-tier-match-strong">
                      {matchedTierForCustomAmount.name}
                    </Box>{' '}
                    from the list above—it keeps things clear for the organizer. If you want the{' '}
                    <em>same budget</em> but <em>different or extra</em> benefits, describe the changes
                    below so they can review a tailored offer.
                  </Typography>
                </Box>
              </Box>
            ) : null}
            <InputBase
              id="deal-room-proposal-custom-description"
              className="deal-room-proposal-input"
              placeholder={
                matchedTierForCustomAmount
                  ? 'Describe different or extra benefits you want at this budget…'
                  : 'Description or deliverables…'
              }
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              multiline
            />
            <Button
              type="button"
              variant="contained"
              className="deal-room-proposal-btn-primary deal-room-proposal-custom-send"
              onClick={sendCustomProposal}
            >
              Send custom tier
            </Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
