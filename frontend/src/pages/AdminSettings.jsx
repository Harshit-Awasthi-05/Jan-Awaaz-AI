import { useState } from 'react';
import { User, Bell, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminSettings() {
  const { mpInfo } = useAuth();

  const [name, setName] = useState(mpInfo?.name || '');
  const [email, setEmail] = useState(mpInfo?.email || mpInfo?.sub || '');
  const [constituency, setConstituency] = useState(mpInfo?.constituency || '');
  const [phone, setPhone] = useState(mpInfo?.phone || '');

  const [notifications, setNotifications] = useState({
    emailNew: true,
    smsHigh: true,
    weeklyDigest: false,
    aiInsights: true,
  });

  const toggleNotification = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const notificationItems = [
    { key: 'emailNew', label: 'Email notifications for new grievances' },
    { key: 'smsHigh', label: 'SMS alerts for high priority issues' },
    { key: 'weeklyDigest', label: 'Weekly digest report' },
    { key: 'aiInsights', label: 'AI insight notifications' },
  ];

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
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Constituency</label>
            <input
              type="text"
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1.5 block">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
        <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#14B8A6]" /> Notifications
        </h3>
        <div className="space-y-3">
          {notificationItems.map((item) => (
            <label key={item.key} className="flex items-center justify-between py-1 cursor-pointer group">
              <span className="text-sm text-[#475569] group-hover:text-[#0F172A] transition-colors">{item.label}</span>
              <button
                type="button"
                onClick={() => toggleNotification(item.key)}
                className={`relative w-10 h-5 rounded-full transition-colors ${notifications[item.key] ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifications[item.key] ? 'left-5' : 'left-0.5'}`} />
              </button>
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
