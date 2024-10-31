import { NavLink } from 'react-router-dom';
import { Users, Tv, Music, Search, LayoutDashboard, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import PropTypes from 'prop-types';

const links = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Characters', href: '/characters', icon: Users },
  { name: 'Episodes', href: '/episodes', icon: Tv },
  { name: 'Songs', href: '/songs', icon: Music },
  { name: 'My Pony Crew', href: '/ponies', icon: Star },
  { name: 'Search', href: '/search', icon: Search },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r md:relative transform transition-transform duration-200",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    )}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      isActive ? 'bg-accent' : 'transparent'
                    )
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {link.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired
};

export default Sidebar;
