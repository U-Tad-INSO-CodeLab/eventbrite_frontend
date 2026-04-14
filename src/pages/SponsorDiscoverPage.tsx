import { getMockSession } from '../lib/mockAuth';
import { formatIsoDate } from '../lib/formatIsoDate';
import { getDiscoverMockEvents, type MockEvent } from '../lib/mockEvents';
import './sponsorDiscover.css';

function organizerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function DiscoverCard({ event }: { event: MockEvent }) {
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

export default function SponsorDiscoverPage() {
  const session = getMockSession();
  if (!session || session.role !== 'sponsor') return null;

  const events = getDiscoverMockEvents();

  return (
    <div className="discover-page">
      <header className="discover-header">
        <h1>Discover Events</h1>
        <p className="discover-subtitle">
          Find the perfect sponsorship opportunity for your brand.
        </p>
      </header>

      {events.length === 0 ? (
        <p className="discover-empty">No events to show yet.</p>
      ) : (
        <div className="discover-grid">
          {events.map((event) => (
            <DiscoverCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
