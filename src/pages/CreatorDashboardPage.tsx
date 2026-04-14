import { Link } from 'react-router-dom';
import { getMockSession } from '../lib/mockAuth';
import { getMockEventsByCreator } from '../lib/mockEvents';
import './dashboard.css';

export default function CreatorDashboardPage() {
  const session = getMockSession();
  if (!session || session.role !== 'creator') return null;

  const creatorEvents = getMockEventsByCreator(session.id);

  return (
    <main className="dash-main">
      <h1>Panel creador</h1>
      <p>
        Crea y gestiona tus eventos. Todo se guarda en mock usando localStorage.
      </p>
      <section className="dash-events">
        <h2>Quick overview</h2>
        <p className="dash-events-empty">
          Manage listings on{' '}
          <Link to="/creator/my-events" className="dash-link-muted">
            My Events
          </Link>
          . You have {creatorEvents.length} event
          {creatorEvents.length === 1 ? '' : 's'} in mock storage.
        </p>
      </section>
    </main>
  );
}
