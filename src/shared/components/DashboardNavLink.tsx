import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type DashboardNavLinkProps = {
  to: string;
  end?: boolean;
  icon: string;
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
      <span className={`${iconClassName} material-symbols-outlined`} aria-hidden="true">
        {icon}
      </span>
      {children}
    </NavLink>
  );
}
