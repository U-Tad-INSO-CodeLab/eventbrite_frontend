import type { ReactElement } from 'react'
import { Route } from 'react-router-dom'
import SponsorDashboardPage from '../pages/SponsorDashboardPage'

/** Rutas del área sponsor (patrocinadores) */
export const sponsorRoutes: ReactElement[] = [
  <Route
    key="sponsor-root"
    path="/sponsor"
    element={<SponsorDashboardPage />}
  />,
]
