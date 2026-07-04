import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/track', icon: Search, label: 'Track' },
  { to: '/submit', icon: PlusCircle, label: 'Submit', isMain: true },
  { to: '/updates', icon: Bell, label: 'Updates' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[#E2E8F0] z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

          if (item.isMain) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg shadow-[#2563EB]/30 hover:shadow-[#2563EB]/50 transition-shadow active:scale-95">
                  <PlusCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-medium text-[#2563EB] mt-1">
                  {item.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1"
            >
              <div
                className={`flex items-center justify-center w-14 h-8 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2563EB]/10'
                    : ''
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
