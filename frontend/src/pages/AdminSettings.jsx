import { User, Bell, Shield, Globe, Palette, Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Settings</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Manage your dashboard preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
        <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-[#2563EB]" /> Profile Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Full Name</label>
            <input type="text" defaultValue="Shri Rajesh Sharma" className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Email</label>
            <input type="email" defaultValue="mp.rajesh@parliament.in" className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Constituency</label>
            <input type="text" defaultValue="New Delhi South" className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Phone</label>
            <input type="tel" defaultValue="+91 99XXX XXXXX" className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
        <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#14B8A6]" /> Notifications
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Email notifications for new grievances', checked: true },
            { label: 'SMS alerts for high priority issues', checked: true },
            { label: 'Weekly digest report', checked: false },
            { label: 'AI insight notifications', checked: true },
          ].map((item) => (
            <label key={item.label} className="flex items-center justify-between py-1 cursor-pointer group">
              <span className="text-sm text-[#475569] group-hover:text-[#0F172A] transition-colors">{item.label}</span>
              <div className={`relative w-10 h-5 rounded-full transition-colors ${item.checked ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.checked ? 'left-5' : 'left-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Save */}
      <button className="flex items-center gap-2 bg-[#2563EB] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm active:scale-[0.98]">
        <Save className="w-4 h-4" /> Save Changes
      </button>
    </div>
  );
}
