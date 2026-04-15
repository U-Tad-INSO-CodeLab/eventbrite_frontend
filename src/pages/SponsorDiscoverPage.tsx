import { useState } from 'react';
import SponsorDiscoverCard from '../components/SponsorDiscoverCard';
import { getMockSession } from '../lib/mockAuth';
import { getDiscoverMockEvents } from '../lib/mockEvents';
import './sponsorDiscover.css';

export default function SponsorDiscoverPage() {
  const [search, setSearch] = useState('');
  const session = getMockSession();
  if (!session || session.role !== 'sponsor') return null;

  const events = getDiscoverMockEvents();
  const q = search.trim().toLowerCase();
  const filteredEvents = q
    ? events.filter((e) => e.title.toLowerCase().includes(q))
    : events;

  return (
    <div className="discover-page">
      <header className="discover-header">
        <h1>Discover Events</h1>
        <p className="discover-subtitle">
          Find the perfect sponsorship opportunity for your brand.
        </p>
        <label className="discover-search">
          <span
            className="material-symbols-outlined discover-search-icon"
            aria-hidden="true"
          >
            search
          </span>
          <input
            type="search"
            className="discover-search-input"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search events by name"
            autoComplete="off"
          />
        </label>
      </header>

      {events.length === 0 ? (
        <p className="discover-empty">No events to show yet.</p>
      ) : filteredEvents.length === 0 ? (
        <p className="discover-empty">No events match your search.</p>
      ) : (
        <div className="discover-grid">
          {filteredEvents.map((event) => (
            <SponsorDiscoverCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
