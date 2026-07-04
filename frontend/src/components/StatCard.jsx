import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, changeType = 'up', icon: Icon, color = '#2563EB' }) {
  const isUp = changeType === 'up';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-dropdown transition-shadow duration-200 animate-fade-in-up">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}14` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
              isUp
                ? 'text-[#22C55E] bg-[rgba(34,197,94,0.1)]'
                : 'text-[#EF4444] bg-[rgba(239,68,68,0.1)]'
            }`}
          >
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-[#64748B] font-medium tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-[#0F172A] mt-1 tracking-tight">{value}</p>
    </div>
  );
}
