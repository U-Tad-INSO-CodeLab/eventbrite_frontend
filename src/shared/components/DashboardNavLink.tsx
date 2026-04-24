import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

type DashboardNavLinkProps = {
  to: string;
  end?: boolean;
  icon: ReactNode;
  iconClassName: string;
  children: ReactNode;
};

export default function DashboardNavLink({
  to,
  end,
  icon,
  iconClassName,
  children,
}: DashboardNavLinkProps) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
      <Box component="span" className={iconClassName} aria-hidden="true">
        {icon}
      </Box>
      <Typography component="span" sx={{ font: 'inherit', color: 'inherit', lineHeight: 'inherit' }}>
        {children}
      </Typography>
    </NavLink>
  );
}
