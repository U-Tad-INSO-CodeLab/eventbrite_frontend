import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import CreatorDashboardPage from '../pages/CreatorDashboardPage';
import CreateEventPage from '../pages/CreateEventPage';

export const creatorRoutes: ReactElement[] = [
  <Route
    key="creator-root"
    path="/creator"
    element={<CreatorDashboardPage />}
  />,
  <Route
    key="creator-create-event"
    path="/creator/create-event"
    element={<CreateEventPage />}
  />,
];
