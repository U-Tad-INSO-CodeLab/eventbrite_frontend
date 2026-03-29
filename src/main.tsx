import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { hydrateSessionFromRememberMe } from './lib/mockAuth'
import './index.css'
import App from './App.tsx'

hydrateSessionFromRememberMe()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
