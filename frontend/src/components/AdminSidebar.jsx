import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import SparkleIcon from './SparkleIcon';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/grievances', icon: MessageSquare, label: 'Grievances' },
  { to: '/admin/constituents', icon: Users, label: 'Constituents' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#0F172A] text-white flex flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      
      <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <SparkleIcon className="w-7 h-7 shrink-0" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap animate-slide-in-left">
              JanAwaaz<span className="text-[#14B8A6]"> AI</span>
            </span>
          )}
        </div>
      </div>

      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                isActive
                  ? 'bg-[#2563EB]/15 text-white'
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#2563EB] rounded-r-full" />
                )}
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-[#14B8A6]/20 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#14B8A6]" />
            <span className="text-xs font-semibold text-[#14B8A6]">AI Assistant</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Summarize grievances with AI-powered insights.
          </p>
        </div>
      )}

      
      <div className="border-t border-white/10 p-3 space-y-1">
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-all"
        >
          <ChevronLeft
            className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:bg-[#EF4444]/15 hover:text-[#EF4444] transition-all">
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
