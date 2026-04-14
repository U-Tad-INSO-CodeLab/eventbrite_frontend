import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import CreatorDashboardPage from '../pages/CreatorDashboardPage';
import CreatorMyEventsPage from '../pages/CreatorMyEventsPage';
import CreateEventPage from '../pages/CreateEventPage';

export const creatorRoutes: ReactElement[] = [
  <Route
    key="creator-root"
    path="/creator"
    element={<CreatorDashboardPage />}
  />,
  <Route
    key="creator-my-events"
    path="/creator/my-events"
    element={<CreatorMyEventsPage />}
  />,
  <Route
    key="creator-create-event"
    path="/creator/create-event"
    element={<CreateEventPage />}
  />,
];
