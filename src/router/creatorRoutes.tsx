import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import CreatorDashboardPage from '../pages/CreatorDashboardPage';

export const creatorRoutes: ReactElement[] = [
  <Route
    key="creator-root"
    path="/creator"
    element={<CreatorDashboardPage />}
  />,
];
