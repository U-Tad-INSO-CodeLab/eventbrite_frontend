import { useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import './CreatorMyEventsPage.css';
import EventCard from '@/events/components/EventCard';
import { getMockSession } from '@/auth/lib/mockAuth';
import { getMockEventsByCreator } from '@/events/lib/mockEvents';

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
    <Box className="my-events-page">
      <Box component="header" className="my-events-header">
        <Box>
          <Typography component="h1">My Events</Typography>
          <Typography component="p" className="my-events-subtitle">
            {events.length} event{events.length === 1 ? '' : 's'} ·{' '}
            {activeCount} active
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/creator/create-event"
          className="my-events-create-btn"
          variant="contained"
          disableElevation
        >
          + Create Event
        </Button>
      </Box>

      <Box
        component="section"
        className="my-events-section"
        aria-labelledby="active-events-heading"
      >
        <Typography component="h2" id="active-events-heading" className="my-events-section-title">
          Active events
        </Typography>
        {activeEvents.length === 0 ? (
          <Typography component="p" className="my-events-empty">
            No active events.
          </Typography>
        ) : (
          <Box className="my-events-grid">
            {activeEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onStatusChange={refresh}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box component="section" className="my-events-section" aria-labelledby="drafts-heading">
        <Typography component="h2" id="drafts-heading" className="my-events-section-title">
          Drafts
        </Typography>
        {draftEvents.length === 0 ? (
          <Typography component="p" className="my-events-empty">
            No drafts.
          </Typography>
        ) : (
          <Box className="my-events-grid">
            {draftEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onStatusChange={refresh}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
