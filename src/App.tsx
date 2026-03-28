import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { authRoutes, creatorRoutes, sponsorRoutes } from './router';

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
