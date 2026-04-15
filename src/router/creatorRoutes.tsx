import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import CreatorLayout from '../components/CreatorLayout';
import CreatorDashboardPage from '../pages/CreatorDashboardPage';
import CreatorMyEventsPage from '../pages/CreatorMyEventsPage';
import CreateEventPage from '../pages/CreateEventPage';

export const creatorRoutes: ReactElement[] = [
  <Route key="creator" path="/creator" element={<CreatorLayout />}>
    <Route index element={<CreatorDashboardPage />} />
    <Route path="my-events" element={<CreatorMyEventsPage />} />
    <Route path="create-event" element={<CreateEventPage />} />
  </Route>,
];
