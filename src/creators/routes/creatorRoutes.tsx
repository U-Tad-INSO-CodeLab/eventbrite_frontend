import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import CreatorLayout from '@/creators/layouts/CreatorLayout';
import CreatorDashboardPage from '@/creators/pages/CreatorDashboardPage';
import CreatorMyEventsPage from '@/creators/pages/CreatorMyEventsPage';
import CreateEventPage from '@/creators/pages/CreateEventPage';
import CreatorTierTemplatesPage from '@/creators/pages/CreatorTierTemplatesPage';
import MessagesDealRoomPage from '@/chat/pages/MessagesDealRoomPage';

export const creatorRoutes: ReactElement[] = [
  <Route key="creator" path="/creator" element={<CreatorLayout />}>
    <Route index element={<CreatorDashboardPage />} />
    <Route path="my-events" element={<CreatorMyEventsPage />} />
    <Route path="tier-templates" element={<CreatorTierTemplatesPage />} />
    <Route path="messages" element={<MessagesDealRoomPage />} />
    <Route path="create-event" element={<CreateEventPage />} />
  </Route>,
];
