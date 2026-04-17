import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import SponsorLayout from '@/sponsors/layouts/SponsorLayout';
import SponsorDiscoverPage from '@/sponsors/pages/SponsorDiscoverPage';

export const sponsorRoutes: ReactElement[] = [
  <Route key="sponsor" path="/sponsor" element={<SponsorLayout />}>
    <Route index element={<SponsorDiscoverPage />} />
  </Route>,
];
