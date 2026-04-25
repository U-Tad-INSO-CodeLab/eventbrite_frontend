import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import '@/shared/components/DashboardNavLink.css';

type DashboardNavLinkProps = {
  to: string;
  end?: boolean;
  icon: ReactNode;
  iconClassName: string;
  children: ReactNode;
  /** Unread / notification count; hidden when 0 or undefined. */
  badgeCount?: number;
};

export default function DashboardNavLink({
  to,
  end,
  icon,
  iconClassName,
  children,
  badgeCount,
}: DashboardNavLinkProps) {
  const showBadge = typeof badgeCount === 'number' && badgeCount > 0;
  const badgeLabel = badgeCount !== undefined && badgeCount > 9 ? '9+' : String(badgeCount ?? '');

  return (
    <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
      <Box component="span" className="dash-nav-link-inner">
        <Box component="span" className={iconClassName} aria-hidden="true">
          {icon}
        </Box>
        <Typography
          component="span"
          className="dash-nav-link-text"
          sx={{ font: 'inherit', color: 'inherit', lineHeight: 'inherit' }}
        >
          {children}
        </Typography>
        {showBadge ? (
          <Box component="span" className="dash-nav-badge" aria-label={`${badgeCount} unread`}>
            {badgeLabel}
          </Box>
        ) : null}
      </Box>
    </NavLink>
  );
}
