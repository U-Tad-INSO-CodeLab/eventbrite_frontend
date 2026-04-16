import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../../events/components/EventCard';
import { getMockSession } from '../../auth/lib/mockAuth';
import { getMockEventsByCreator } from '../../events/lib/mockEvents';
import './myEvents.css';

export default function CreatorMyEventsPage() {
  const session = getMockSession();
  const [, setRefresh] = useState(0);
  const refresh = useCallback(() => setRefresh((v) => v + 1), []);

  if (!session || session.role !== 'creator') return null;

  const events = getMockEventsByCreator(session.id);
  const activeEvents = events.filter((e) => e.status === 'active');
  const draftEvents = events.filter((e) => e.status === 'draft');
  const activeCount = activeEvents.length;

  return (
    <div className="my-events-page">
      <header className="my-events-header">
        <div>
          <h1>My Events</h1>
          <p className="my-events-subtitle">
            {events.length} event{events.length === 1 ? '' : 's'} ·{' '}
            {activeCount} active
          </p>
        </div>
        <Link to="/creator/create-event" className="my-events-create-btn">
          + Create Event
        </Link>
      </header>

      <section
        className="my-events-section"
        aria-labelledby="active-events-heading"
      >
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
  );
}
