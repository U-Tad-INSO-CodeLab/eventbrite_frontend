import EventLinkLogo from '@/events/components/EventLinkLogo';
import DashboardNavLink from '@/shared/components/DashboardNavLink';
import '@/sponsors/components/SponsorSideMenu.css';

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
        <DashboardNavLink to="/sponsor" end icon="explore" iconClassName="sponsor-nav-icon">
          Discover
        </DashboardNavLink>
        <DashboardNavLink to="/sponsor/messages" icon="chat" iconClassName="sponsor-nav-icon">
          Messages
        </DashboardNavLink>
      </nav>
      <button type="button" className="sponsor-logout-btn" onClick={onLogout}>
        <span className="sponsor-nav-icon material-symbols-outlined" aria-hidden="true">
          logout
        </span>
        Logout
      </button>
    </aside>
  );
}
