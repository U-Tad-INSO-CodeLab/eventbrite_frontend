import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';
import LoginPage from '@/auth/pages/LoginPage';
import RegisterPage from '@/auth/pages/RegisterPage';

export const authRoutes: ReactElement[] = [
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<RegisterPage />} />,
];
