import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Box, Button, Typography } from '@mui/material';
import EventLinkLogo from '@/events/components/EventLinkLogo';
import DashboardNavLink from '@/shared/components/DashboardNavLink';
import '@/sponsors/components/SponsorSideMenu.css';

type SponsorSideMenuProps = {
  onLogout: () => void;
};

export default function SponsorSideMenu({ onLogout }: SponsorSideMenuProps) {
  return (
    <Box component="aside" className="sponsor-sidebar">
      <Box component="div" className="sponsor-brand">
        <EventLinkLogo variant="header" />
        <Box component="span">EventLink</Box>
      </Box>
      <Typography component="p" className="sponsor-sidebar-label">
        Sponsor
      </Typography>
      <Box component="nav" className="sponsor-nav">
        <DashboardNavLink
          to="/sponsor"
          end
          icon={<ExploreOutlinedIcon />}
          iconClassName="sponsor-nav-icon"
        >
          Discover
        </DashboardNavLink>
        <DashboardNavLink
          to="/sponsor/messages"
          icon={<ChatOutlinedIcon />}
          iconClassName="sponsor-nav-icon"
        >
          Messages
        </DashboardNavLink>
      </Box>
      <Button
        type="button"
        className="sponsor-logout-btn"
        onClick={onLogout}
        disableElevation
        disableRipple
      >
        <LogoutOutlinedIcon className="sponsor-nav-icon" aria-hidden="true" />
        Logout
      </Button>
    </Box>
  );
}
