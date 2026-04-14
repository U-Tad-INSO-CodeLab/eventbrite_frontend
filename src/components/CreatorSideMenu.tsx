import { Link } from 'react-router-dom';
import EventLinkLogo from './EventLinkLogo';
import './CreatorSideMenu.css';

type CreatorSideMenuProps = {
  active: 'dashboard' | 'create-event';
  onLogout: () => void;
};

export default function CreatorSideMenu({
  active,
  onLogout,
}: CreatorSideMenuProps) {
  return (
    <aside className="creator-sidebar">
      <div className="creator-brand">
        <EventLinkLogo variant="header" />
        <span>EventLink</span>
      </div>
      <nav className="creator-nav">
        <Link
          to="/creator"
          className={active === 'dashboard' ? 'is-active' : ''}
        >
          <span className="creator-nav-icon material-symbols-outlined" aria-hidden="true">
            dashboard
          </span>
          Dashboard
        </Link>
        <Link
          to="/creator/create-event"
          className={active === 'create-event' ? 'is-active' : ''}
        >
          <span className="creator-nav-icon material-symbols-outlined" aria-hidden="true">
            add_circle
          </span>
          Create Event
        </Link>
      </nav>
      <button type="button" className="creator-logout-btn" onClick={onLogout}>
        <span className="creator-nav-icon material-symbols-outlined" aria-hidden="true">
          logout
        </span>
        Logout
      </button>
    </aside>
  );
}
