import { formatIsoDate } from '@/shared/lib/formatIsoDate';
import { formatUsdCompact } from '@/shared/lib/formatUsdCompact';
import { setMockEventStatus, type MockEvent } from '@/events/lib/mockEvents';

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
    <article className="my-events-card">
      <div className="my-events-card-media">
        <img src={event.coverImageDataUrl} alt="" loading="lazy" />
        <span className={`my-events-chip my-events-chip--${event.status}`}>
          {isActive ? 'Active' : 'Draft'}
        </span>
      </div>
      <div className="my-events-card-body">
        <h4>{event.title}</h4>
        <p className="my-events-card-desc">{event.description}</p>
        <ul className="my-events-meta">
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">
              calendar_today
            </span>
            {formatIsoDate(event.date, '—')}
          </li>
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">
              location_on
            </span>
            {event.location.trim() || '—'}
          </li>
          <li>
            <span className="material-symbols-outlined" aria-hidden="true">
              groups
            </span>
            {event.expectedAttendance > 0
              ? String(event.expectedAttendance)
              : '—'}
          </li>
        </ul>
        {event.tags.length > 0 ? (
          <div className="my-events-tags">
            {event.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
      <footer className="my-events-card-footer">
        {tierCount === 0 ? (
          <span className="my-events-footer-tier">No sponsorship tiers yet</span>
        ) : (
          <span className="my-events-footer-tier">
            <span className="my-events-footer-tier-count">{tierCount}</span> tier
            {tierCount === 1 ? '' : 's'} · up to{' '}
            <span className="my-events-footer-tier-price">{maxTierPriceLabel}</span>
          </span>
        )}
        <button
          type="button"
          className="my-events-footer-action"
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
        </button>
      </footer>
    </article>
  );
}
