import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreatorSideMenu from '../components/CreatorSideMenu';
import {
  clearMockSession,
  getHomePathForRole,
  getMockSession,
  MOCK_SESSION_KEY,
} from '../lib/mockAuth';
import { eventCoverPlaceholderUrl } from '../lib/eventCoverPlaceholder';
import {
  formatMockEventDate,
  formatUsdCompact,
  getMockEventsByCreator,
  setMockEventStatus,
  type MockEvent,
} from '../lib/mockEvents';
import './myEvents.css';

function EventCard({
  event,
  onStatusChange,
}: {
  event: MockEvent;
  onStatusChange: () => void;
}) {
  const isActive = event.status === 'active';
  const tierLine =
    event.sponsorshipTierCount > 0
      ? `${event.sponsorshipTierCount} tier${event.sponsorshipTierCount === 1 ? '' : 's'} · up to ${formatUsdCompact(event.sponsorshipMaxPriceUsd)}`
      : 'No sponsorship tiers yet';

  return (
    <article className="my-events-card">
      <div className="my-events-card-media">
        {event.coverImageDataUrl ? (
          <img src={event.coverImageDataUrl} alt="" />
        ) : (
          <img
            src={eventCoverPlaceholderUrl(event.id, 800, 450)}
            alt=""
            loading="lazy"
          />
        )}
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
            {event.date ? formatMockEventDate(event.date) : '—'}
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

export default function CreatorMyEventsPage() {
  const navigate = useNavigate();
  const session = getMockSession();
  const [listVersion, setListVersion] = useState(0);
  const refresh = useCallback(() => setListVersion((v) => v + 1), []);

  const events = useMemo(() => {
    if (!session) return [];
    void listVersion;
    return getMockEventsByCreator(session.id);
  }, [session, listVersion]);

  if (!session) {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          <Link to="/login">Sign in</Link> to view your events.
        </p>
      </div>
    );
  }

  if (session.role !== 'creator') {
    return (
      <div className="dash-page">
        <p className="dash-gate">
          This account is a sponsor.{' '}
          <Link to={getHomePathForRole('sponsor')}>Go to sponsor dashboard</Link>
        </p>
      </div>
    );
  }

  const activeEvents = events.filter((e) => e.status === 'active');
  const draftEvents = events.filter((e) => e.status === 'draft');
  const activeCount = activeEvents.length;

  return (
    <div className="creator-shell">
      <CreatorSideMenu
        active="my-events"
        onLogout={() => {
          clearMockSession();
          localStorage.removeItem(MOCK_SESSION_KEY);
          navigate('/', { replace: true });
        }}
      />
      <div className="creator-content my-events-page">
        <header className="my-events-header">
          <div>
            <h1>My Events</h1>
            <p className="my-events-subtitle">
              {events.length} event{events.length === 1 ? '' : 's'} · {activeCount}{' '}
              active
            </p>
          </div>
          <Link to="/creator/create-event" className="my-events-create-btn">
            + Create Event
          </Link>
        </header>

        <section className="my-events-section" aria-labelledby="active-events-heading">
          <h2 id="active-events-heading" className="my-events-section-title">
            Active events
          </h2>
          {activeEvents.length === 0 ? (
            <p className="my-events-empty">No active events.</p>
          ) : (
            <div className="my-events-grid">
              {activeEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onStatusChange={refresh}
                />
              ))}
            </div>
          )}
        </section>

        <section className="my-events-section" aria-labelledby="drafts-heading">
          <h2 id="drafts-heading" className="my-events-section-title">
            Drafts
          </h2>
          {draftEvents.length === 0 ? (
            <p className="my-events-empty">No drafts.</p>
          ) : (
            <div className="my-events-grid">
              {draftEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onStatusChange={refresh}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
