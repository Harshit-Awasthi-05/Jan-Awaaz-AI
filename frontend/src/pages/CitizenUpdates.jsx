import { Bell, Check, Clock, Info, AlertTriangle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'Grievance #2847 Update',
    message: 'Your water supply complaint has been assigned to the Jal Board department.',
    time: '2 hours ago',
    type: 'info',
    read: false,
  },
  {
    id: 2,
    title: 'Grievance #2819 Resolved',
    message: 'Your sanitation complaint has been resolved. Please confirm if the issue is fixed.',
    time: '1 day ago',
    type: 'success',
    read: false,
  },
  {
    id: 3,
    title: 'Community Meeting',
    message: 'MP office is holding a community meeting on July 10th at Community Hall, Sector 15.',
    time: '2 days ago',
    type: 'notice',
    read: true,
  },
  {
    id: 4,
    title: 'Scheduled Maintenance',
    message: 'Water supply will be interrupted on July 6th (10AM-4PM) for pipeline maintenance.',
    time: '3 days ago',
    type: 'warning',
    read: true,
  },
];

const iconMap = {
  info: { Icon: Info, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
  success: { Icon: Check, color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  notice: { Icon: Bell, color: '#14B8A6', bg: 'rgba(20,184,166,0.08)' },
  warning: { Icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
};

export default function CitizenUpdates() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Updates</h1>
        <button className="text-xs font-medium text-[#2563EB]">Mark all read</button>
      </div>

      <div className="space-y-2.5 stagger-children">
        {notifications.map((n) => {
          const { Icon, color, bg } = iconMap[n.type];
          return (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-4 shadow-card transition-all cursor-pointer animate-fade-in-up ${
                !n.read ? 'border-l-[3px]' : ''
              }`}
              style={!n.read ? { borderLeftColor: color } : {}}
            >
              <div className="flex gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{n.title}</p>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />}
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {n.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
