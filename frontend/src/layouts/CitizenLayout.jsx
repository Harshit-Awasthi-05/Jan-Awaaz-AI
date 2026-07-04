import { Outlet } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import SparkleIcon from '../components/SparkleIcon';

export default function CitizenLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 max-w-md mx-auto relative">
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <SparkleIcon className="w-6 h-6" />
            <span className="text-base font-bold tracking-tight text-[#0F172A]">
              JanAwaaz<span className="text-[#14B8A6]"> AI</span>
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <span className="text-xs font-semibold text-[#64748B]">RK</span>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="px-4 py-4">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}
