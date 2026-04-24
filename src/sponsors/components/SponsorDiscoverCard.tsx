import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { formatIsoDate } from '@/shared/lib/formatIsoDate';
import { formatUsdCompact } from '@/shared/lib/formatUsdCompact';
import type { MockEvent } from '@/events/lib/mockEvents';
import { organizerInitials } from '@/shared/lib/organizerInitials';
import { getMockSession } from '@/auth/lib/mockAuth';
import { ensureDealThreadForSponsorEvent } from '@/chat/lib/mockDealThreads';

type SponsorDiscoverCardProps = {
  event: MockEvent;
};

export default function SponsorDiscoverCard({ event }: SponsorDiscoverCardProps) {
  const navigate = useNavigate();
  const tierCount = Array.isArray(event.sponsorshipTiers)
    ? event.sponsorshipTiers.length
    : event.sponsorshipTierCount;
  const maxTierPrice = Array.isArray(event.sponsorshipTiers)
    ? event.sponsorshipTiers.reduce(
      (maxPrice, tier) => Math.max(maxPrice, tier.priceUsd),
      0
    )
    : event.sponsorshipMaxPriceUsd;

  return (
    <Box component="article" className="discover-card">
      <Box className="discover-card-media">
        <img src={event.coverImageDataUrl} alt="" loading="lazy" />
        <Box component="span" className="discover-card-category">
          {event.industry || 'Event'}
        </Box>
      </Box>
      <Box className="discover-card-body">
        <Typography component="h3" className="discover-card-title">
          {event.title}
        </Typography>
        <Typography component="p" className="discover-card-desc">
          {event.description}
        </Typography>
        <Box component="ul" className="discover-card-meta">
          <li>
            <CalendarTodayIcon className="discover-card-meta-icon" aria-hidden="true" />
            {formatIsoDate(event.date, '—')}
          </li>
          <li>
            <LocationOnIcon className="discover-card-meta-icon" aria-hidden="true" />
            {event.location.trim() || '—'}
          </li>
          <li>
            <GroupsIcon className="discover-card-meta-icon" aria-hidden="true" />
            {event.expectedAttendance > 0
              ? event.expectedAttendance.toLocaleString()
              : '—'}
          </li>
        </Box>
        {event.tags.length > 0 ? (
          <Box className="discover-card-tags discover-card-tags--chips">
            {event.tags.map((tag) => (
              <Box component="span" key={tag} className="discover-card-tag-chip">
                <LocalOfferIcon className="discover-card-tag-icon" aria-hidden="true" />
                {tag}
              </Box>
            ))}
          </Box>
        ) : null}
        {tierCount > 0 ? (
          <Box className="discover-card-tier-summary">
            <Box component="span">
              <Box component="strong">{tierCount}</Box> tier{tierCount === 1 ? '' : 's'}
            </Box>
            <Box component="span">·</Box>
            <Box component="span">
              up to{' '}
              <Box component="strong" className="discover-card-tier-price">
                {formatUsdCompact(maxTierPrice)}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className="discover-card-tier-summary discover-card-tier-summary--empty">
            No sponsorship tiers yet
          </Box>
        )}
      </Box>
      <Box component="footer" className="discover-card-footer">
        <Box className="discover-card-organizer">
          <Box component="span" className="discover-card-avatar" aria-hidden="true">
            {organizerInitials(event.creatorName)}
          </Box>
          <Box component="span" className="discover-card-organizer-name">
            {event.creatorName}
          </Box>
        </Box>
        <Button
          type="button"
          className="discover-card-cta"
          variant="contained"
          disableElevation
          onClick={() => {
            const session = getMockSession();
            if (!session || session.role !== 'sponsor') return;
            const thread = ensureDealThreadForSponsorEvent(session, event);
            const firstName = event.creatorName?.split(' ')[0];
            const draft = `Hi${firstName ? `, ${firstName}` : ''}! I came across your event ${event.title} and would be interested in discussing a potential collaboration. What do you think?`;
            navigate(`/sponsor/messages?thread=${encodeURIComponent(thread.id)}&draft=${encodeURIComponent(draft)}`);
          }}
        >
          Sponsor Now
        </Button>
      </Box>
    </Box>
  );
}
