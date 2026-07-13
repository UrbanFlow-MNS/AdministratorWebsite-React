import { NavLink } from 'react-router-dom';
import { RiMapPin2Line, RiRouteLine, RiCalendarLine, RiDashboardLine, RiBusLine, RiTimeLine, RiCloseLine } from 'react-icons/ri';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/',         label: 'Tableau de bord', icon: RiDashboardLine },
  { to: '/stops',    label: 'Arrêts',          icon: RiMapPin2Line },
  { to: '/routes',   label: 'Lignes',          icon: RiRouteLine },
  { to: '/trips',    label: 'Voyages',         icon: RiTimeLine },
  { to: '/vehicles', label: 'Véhicules',       icon: RiBusLine },
  { to: '/calendar', label: 'Calendriers',     icon: RiCalendarLine },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside className={['sidebar', open ? 'open' : ''].filter(Boolean).join(' ')}>
      <button className="sidebar-close" onClick={onClose} aria-label="Fermer le menu">
        <RiCloseLine />
      </button>

      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <RiBusLine className="text-white text-[1.1rem]" />
        </div>
        <div>
          <p className="text-sm font-bold text-ink leading-none">UrbanFlow</p>
          <p className="text-xs text-muted mt-[3px]">Administration</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => ['nav-item', isActive ? 'active' : ''].join(' ')}
            onClick={onClose}
          >
            <Icon className="nav-icon" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
