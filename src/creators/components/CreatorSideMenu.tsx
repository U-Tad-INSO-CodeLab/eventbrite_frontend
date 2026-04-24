import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Box, Button, Typography } from '@mui/material';
import EventLinkLogo from '@/events/components/EventLinkLogo';
import DashboardNavLink from '@/shared/components/DashboardNavLink';
import '@/creators/components/CreatorSideMenu.css';

type CreatorSideMenuProps = {
  onLogout: () => void;
};

export default function CreatorSideMenu({ onLogout }: CreatorSideMenuProps) {
  return (
    <Box component="aside" className="creator-sidebar">
      <Box component="div" className="creator-brand">
        <EventLinkLogo variant="header" />
        <Box component="span">EventLink</Box>
      </Box>
      <Typography component="p" className="creator-sidebar-label">
        Creator
      </Typography>
      <Box component="nav" className="creator-nav">
        <DashboardNavLink
          to="/creator"
          end
          icon={<DashboardOutlinedIcon />}
          iconClassName="creator-nav-icon"
        >
          Dashboard
        </DashboardNavLink>
        <DashboardNavLink
          to="/creator/my-events"
          icon={<CalendarMonthOutlinedIcon />}
          iconClassName="creator-nav-icon"
        >
          My Events
        </DashboardNavLink>
        <DashboardNavLink
          to="/creator/tier-templates"
          icon={<LayersOutlinedIcon />}
          iconClassName="creator-nav-icon"
        >
          My Tiers
        </DashboardNavLink>
        <DashboardNavLink
          to="/creator/messages"
          icon={<ChatOutlinedIcon />}
          iconClassName="creator-nav-icon"
        >
          Messages
        </DashboardNavLink>
        <DashboardNavLink
          to="/creator/create-event"
          icon={<AddCircleOutlinedIcon />}
          iconClassName="creator-nav-icon"
        >
          Create Event
        </DashboardNavLink>
      </Box>
      <Button
        type="button"
        className="creator-logout-btn"
        onClick={onLogout}
        disableElevation
        disableRipple
      >
        <LogoutOutlinedIcon className="creator-nav-icon" aria-hidden="true" />
        Logout
      </Button>
    </Box>
  );
}
