import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Bell, Search } from 'lucide-react';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div
        className={`transition-all duration-300 ${
          collapsed ? 'ml-[72px]' : 'ml-[280px]'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-[#0F172A] tracking-tight">
              MP Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search grievances..."
                className="pl-9 pr-4 py-2 text-sm bg-[#F1F5F9] rounded-lg border-none outline-none focus:ring-2 focus:ring-[#2563EB]/30 w-64 text-[#0F172A] placeholder:text-[#94A3B8] transition-all"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white text-xs font-bold">
              MP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
