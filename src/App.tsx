import { Route, Routes } from 'react-router-dom';
import HomePage from './shared/pages/HomePage';
import { authRoutes } from './auth/routes/authRoutes';
import { creatorRoutes } from './creators/routes/creatorRoutes';
import { sponsorRoutes } from './sponsors/routes/sponsorRoutes';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {authRoutes}
      {sponsorRoutes}
      {creatorRoutes}
    </Routes>
  );
}
