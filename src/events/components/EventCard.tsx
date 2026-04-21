import { formatIsoDate } from '@/shared/lib/formatIsoDate';
import { formatUsdCompact } from '@/shared/lib/formatUsdCompact';
import { setMockEventStatus, type MockEvent } from '@/events/lib/mockEvents';
import { Box, Button, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';

type EventCardProps = {
  event: MockEvent;
  onStatusChange: () => void;
};

export default function EventCard({ event, onStatusChange }: EventCardProps) {
  const isActive = event.status === 'active';
  const tierCount = Array.isArray(event.sponsorshipTiers)
    ? event.sponsorshipTiers.length
    : event.sponsorshipTierCount;
  const maxTierPrice = Array.isArray(event.sponsorshipTiers)
    ? event.sponsorshipTiers.reduce(
      (maxPrice, tier) => Math.max(maxPrice, tier.priceUsd),
      0
    )
    : event.sponsorshipMaxPriceUsd;
  const maxTierPriceLabel = formatUsdCompact(maxTierPrice);

  return (
    <Box component="article" className="my-events-card">
      <Box className="my-events-card-media">
        <img src={event.coverImageDataUrl} alt="" loading="lazy" />
        <Box component="span" className={`my-events-chip my-events-chip--${event.status}`}>
          {isActive ? 'Active' : 'Draft'}
        </Box>
      </Box>
      <Box className="my-events-card-body">
        <Typography component="h4">{event.title}</Typography>
        <Typography component="p" className="my-events-card-desc">
          {event.description}
        </Typography>
        <Box component="ul" className="my-events-meta">
          <li>
            <CalendarTodayIcon className="my-events-meta-icon" aria-hidden="true" />
            {formatIsoDate(event.date, '—')}
          </li>
          <li>
            <LocationOnIcon className="my-events-meta-icon" aria-hidden="true" />
            {event.location.trim() || '—'}
          </li>
          <li>
            <GroupsIcon className="my-events-meta-icon" aria-hidden="true" />
            {event.expectedAttendance > 0
              ? String(event.expectedAttendance)
              : '—'}
          </li>
        </Box>
        {event.tags.length > 0 ? (
          <Box className="my-events-tags">
            {event.tags.map((tag) => (
              <Box component="span" key={tag}>
                {tag}
              </Box>
            ))}
          </Box>
        ) : null}
      </Box>
      <Box component="footer" className="my-events-card-footer">
        {tierCount === 0 ? (
          <Box component="span" className="my-events-footer-tier">
            No sponsorship tiers yet
          </Box>
        ) : (
          <Box component="span" className="my-events-footer-tier">
            <Box component="span" className="my-events-footer-tier-count">
              {tierCount}
            </Box>{' '}
            tier
            {tierCount === 1 ? '' : 's'} · up to{' '}
            <Box component="span" className="my-events-footer-tier-price">
              {maxTierPriceLabel}
            </Box>
          </Box>
        )}
        <Button
          type="button"
          className="my-events-footer-action"
          variant="text"
          disableElevation
          onClick={() => {
            setMockEventStatus(
              event.creatorId,
              event.id,
              isActive ? 'draft' : 'active'
            );
            onStatusChange();
          }}
        >
          {isActive ? 'Unpublish' : 'Publish'}
        </Button>
      </Box>
    </Box>
  );
}
