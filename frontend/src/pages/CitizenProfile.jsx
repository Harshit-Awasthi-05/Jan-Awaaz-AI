import { User, ChevronRight, Shield, Globe, Bell, HelpCircle, LogOut, FileText } from 'lucide-react';

const menuItems = [
  { icon: FileText, label: 'My Grievances', description: '5 total filed', color: '#2563EB' },
  { icon: Bell, label: 'Notification Settings', description: 'Manage alerts', color: '#14B8A6' },
  { icon: Globe, label: 'Language', description: 'English', color: '#8B5CF6' },
  { icon: Shield, label: 'Privacy & Security', description: 'Manage your data', color: '#F59E0B' },
  { icon: HelpCircle, label: 'Help & Support', description: 'FAQs and contact', color: '#64748B' },
];

export default function CitizenProfile() {
  return (
    <div className="space-y-5">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 shadow-card text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
          RK
        </div>
        <h2 className="text-base font-bold text-[#0F172A]">Rahul Kumar</h2>
        <p className="text-xs text-[#64748B] mt-0.5">rahul.kumar@email.com</p>
        <p className="text-xs text-[#94A3B8] mt-0.5">Voter ID: DL/15/042/2847</p>
        <button className="mt-3 px-4 py-1.5 text-xs font-medium text-[#2563EB] bg-[rgba(37,99,235,0.08)] rounded-full hover:bg-[rgba(37,99,235,0.15)] transition-colors">
          Edit Profile
        </button>
      </div>

      {/* Menu */}
      <div className="space-y-2 stagger-children">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 shadow-card hover:shadow-dropdown transition-shadow text-left animate-fade-in-up"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${item.color}14` }}
            >
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F172A]">{item.label}</p>
              <p className="text-[10px] text-[#94A3B8]">{item.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1] shrink-0" />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-[#EF4444]/20 text-[#EF4444] text-sm font-medium hover:bg-[rgba(239,68,68,0.05)] transition-colors">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}
