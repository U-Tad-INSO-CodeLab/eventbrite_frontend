import { useState } from 'react';
import { Box, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SponsorDiscoverCard from '@/sponsors/components/SponsorDiscoverCard';
import { getMockSession } from '@/auth/lib/mockAuth';
import { getDiscoverMockEvents } from '@/events/lib/mockEvents';
import '@/sponsors/pages/SponsorDiscoverPage.css';

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
    <Box className="discover-page">
      <Box component="header" className="discover-header">
        <Typography component="h1">Discover Events</Typography>
        <Typography component="p" className="discover-subtitle">
          Find the perfect sponsorship opportunity for your brand.
        </Typography>
        <Box component="label" className="discover-search">
          <SearchIcon className="discover-search-icon" aria-hidden="true" />
          <InputBase
            type="search"
            className="discover-search-input-root"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputProps={{
              className: 'discover-search-input',
              'aria-label': 'Search events by name',
              autoComplete: 'off',
            }}
          />
        </Box>
      </Box>

      {events.length === 0 ? (
        <Typography component="p" className="discover-empty">
          No events to show yet.
        </Typography>
      ) : filteredEvents.length === 0 ? (
        <Typography component="p" className="discover-empty">
          No events match your search.
        </Typography>
      ) : (
        <Box className="discover-grid">
          {filteredEvents.map((event) => (
            <SponsorDiscoverCard key={event.id} event={event} />
          ))}
        </Box>
      )}
    </Box>
  );
}
