import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import HomePage from '@/shared/pages/HomePage';
import { authRoutes } from '@/auth/routes/authRoutes';
import { creatorRoutes } from '@/creators/routes/creatorRoutes';
import { sponsorRoutes } from '@/sponsors/routes/sponsorRoutes';
import { appTheme } from '@/theme/appTheme';

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {authRoutes}
        {sponsorRoutes}
        {creatorRoutes}
      </Routes>
    </ThemeProvider>
  );
}
