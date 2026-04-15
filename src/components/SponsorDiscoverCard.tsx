import { formatIsoDate } from '../lib/formatIsoDate';
import type { MockEvent } from '../lib/mockEvents';
import { organizerInitials } from '../lib/organizerInitials';

type SponsorDiscoverCardProps = {
  event: MockEvent;
};

export default function SponsorDiscoverCard({ event }: SponsorDiscoverCardProps) {
  return (
    <article className="discover-card">
      <div className="discover-card-media">
        <img src={event.coverImageDataUrl} alt="" loading="lazy" />
        <span className="discover-card-category">{event.industry || 'Event'}</span>
      </div>
      <div className="discover-card-body">
        <h3 className="discover-card-title">{event.title}</h3>
        <p className="discover-card-desc">{event.description}</p>
        <ul className="discover-card-meta">
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
              ? event.expectedAttendance.toLocaleString()
              : '—'}
          </li>
        </ul>
        {event.tags.length > 0 ? (
          <p className="discover-card-tags">
            {event.tags.map((tag) => (
              <span key={tag}>· {tag}</span>
            ))}
          </p>
        ) : null}
      </div>
      <footer className="discover-card-footer">
        <div className="discover-card-organizer">
          <span className="discover-card-avatar" aria-hidden="true">
            {organizerInitials(event.creatorName)}
          </span>
          <span className="discover-card-organizer-name">{event.creatorName}</span>
        </div>
        <button
          type="button"
          className="discover-card-cta"
          onClick={() => {
            window.alert('On develop');
          }}
        >
          Sponsor Now
        </button>
      </footer>
    </article>
  );
}
