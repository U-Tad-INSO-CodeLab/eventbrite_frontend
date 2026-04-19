import EventLinkLogo from '@/events/components/EventLinkLogo';
import DashboardNavLink from '@/shared/components/DashboardNavLink';
import '@/creators/components/CreatorSideMenu.css';

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
        <DashboardNavLink to="/creator" end icon="dashboard" iconClassName="creator-nav-icon">
          Dashboard
        </DashboardNavLink>
        <DashboardNavLink
          to="/creator/my-events"
          icon="calendar_month"
          iconClassName="creator-nav-icon"
        >
          My Events
        </DashboardNavLink>
        <DashboardNavLink
          to="/creator/tier-templates"
          icon="layers"
          iconClassName="creator-nav-icon"
        >
          My Tiers
        </DashboardNavLink>
        <DashboardNavLink to="/creator/messages" icon="chat" iconClassName="creator-nav-icon">
          Messages
        </DashboardNavLink>
        <DashboardNavLink
          to="/creator/create-event"
          icon="add_circle"
          iconClassName="creator-nav-icon"
        >
          Create Event
        </DashboardNavLink>
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
