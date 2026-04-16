import { NavLink } from 'react-router-dom';
import EventLinkLogo from './EventLinkLogo';
import './CreatorSideMenu.css';

type CreatorSideMenuProps = {
  onLogout: () => void;
};

export default function CreatorSideMenu({ onLogout }: CreatorSideMenuProps) {
  return (
    <aside className="creator-sidebar">
      <div className="creator-brand">
        <EventLinkLogo variant="header" />
        <span>EventLink</span>
      </div>
      <nav className="creator-nav">
        <NavLink
          to="/creator"
          end
          className={({ isActive }) => (isActive ? 'is-active' : '')}
        >
          <span
            className="creator-nav-icon material-symbols-outlined"
            aria-hidden="true"
          >
            dashboard
          </span>
          Dashboard
        </NavLink>
        <NavLink
          to="/creator/my-events"
          className={({ isActive }) => (isActive ? 'is-active' : '')}
        >
          <span
            className="creator-nav-icon material-symbols-outlined"
            aria-hidden="true"
          >
            calendar_month
          </span>
          My Events
        </NavLink>
        <NavLink
          to="/creator/tier-templates"
          className={({ isActive }) => (isActive ? 'is-active' : '')}
        >
          <span
            className="creator-nav-icon material-symbols-outlined"
            aria-hidden="true"
          >
            layers
          </span>
          My Tiers
        </NavLink>
        <NavLink
          to="/creator/create-event"
          className={({ isActive }) => (isActive ? 'is-active' : '')}
        >
          <span
            className="creator-nav-icon material-symbols-outlined"
            aria-hidden="true"
          >
            add_circle
          </span>
          Create Event
        </NavLink>
      </nav>
      <button type="button" className="creator-logout-btn" onClick={onLogout}>
        <span
          className="creator-nav-icon material-symbols-outlined"
          aria-hidden="true"
        >
          logout
        </span>
        Logout
      </button>
    </aside>
  );
}
