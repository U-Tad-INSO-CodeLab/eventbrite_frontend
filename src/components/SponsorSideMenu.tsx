import { Link } from 'react-router-dom';
import EventLinkLogo from './EventLinkLogo';
import './SponsorSideMenu.css';

type SponsorSideMenuProps = {
  onLogout: () => void;
};

export default function SponsorSideMenu({ onLogout }: SponsorSideMenuProps) {
  return (
    <aside className="sponsor-sidebar">
      <div className="sponsor-brand">
        <EventLinkLogo variant="header" />
        <span>EventLink</span>
      </div>
      <p className="sponsor-sidebar-label">Sponsor</p>
      <nav className="sponsor-nav">
        <Link to="/sponsor" className="is-active">
          <span
            className="sponsor-nav-icon material-symbols-outlined"
            aria-hidden="true"
          >
            explore
          </span>
          Discover
        </Link>
      </nav>
      <button type="button" className="sponsor-logout-btn" onClick={onLogout}>
        <span
          className="sponsor-nav-icon material-symbols-outlined"
          aria-hidden="true"
        >
          logout
        </span>
        Logout
      </button>
    </aside>
  );
}
