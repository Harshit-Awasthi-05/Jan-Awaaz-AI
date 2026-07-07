import { Outlet } from 'react-router-dom';
import MobileBottomNav from '../components/MobileBottomNav';
import SparkleIcon from '../components/SparkleIcon';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

export default function CitizenLayout() {
  const { language, toggleLanguage } = useLanguage();
  const { citizenUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 max-w-md mx-auto relative">
      <header className="sticky top-0 z-40 glass-panel border-b-0 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <SparkleIcon className="w-6 h-6" />
            <span className="text-base font-bold tracking-tight text-[#0F172A]">
              JanAwaaz<span className="text-[#14B8A6]"> AI</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
              title="Switch language"
            >
              {language === 'en' ? 'हिं' : 'EN'}
            </button>
            <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center">
              <span className="text-xs font-semibold text-[#64748B]">
                {getInitials(citizenUser?.displayName)}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}