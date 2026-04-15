import { formatIsoDate } from '../lib/formatIsoDate';
import { formatUsdCompact } from '../lib/formatUsdCompact';
import { setMockEventStatus, type MockEvent } from '../lib/mockEvents';

type EventCardProps = {
  event: MockEvent;
  onStatusChange: () => void;
};

export default function EventCard({ event, onStatusChange }: EventCardProps) {
  const isActive = event.status === 'active';
  const tierLine =
    event.sponsorshipTierCount > 0
      ? `${event.sponsorshipTierCount} tier${event.sponsorshipTierCount === 1 ? '' : 's'} · up to ${formatUsdCompact(event.sponsorshipMaxPriceUsd)}`
      : 'No sponsorship tiers yet';

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
        <span className="my-events-footer-tier">{tierLine}</span>
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
