import { Search, Filter, ChevronRight } from 'lucide-react';
import StatusChip from '../components/StatusChip';
import SparkleIcon from '../components/SparkleIcon';

const grievances = [
  { id: '2847', subject: 'Water supply disruption in Sector 15', status: 'processing', date: 'Jul 4', category: 'Water Supply' },
  { id: '2831', subject: 'Street lights not working on MG Road', status: 'assigned', date: 'Jul 3', category: 'Infrastructure' },
  { id: '2819', subject: 'Garbage not collected for 3 days', status: 'resolved', date: 'Jul 1', category: 'Sanitation' },
  { id: '2812', subject: 'Pothole on NH-48 near toll booth', status: 'pending', date: 'Jun 30', category: 'Roads' },
  { id: '2805', subject: 'Delayed ration card renewal', status: 'rejected', date: 'Jun 28', category: 'Welfare' },
];

export default function CitizenTrack() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Track Grievances</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search by ID or keyword..."
          className="w-full pl-9 pr-4 py-3 text-sm bg-white rounded-2xl shadow-card border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] placeholder:text-[#94A3B8]"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', 'Pending', 'Processing', 'Assigned', 'Resolved', 'Rejected'].map((f, i) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              i === 0
                ? 'bg-[#2563EB] text-white'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2.5 stagger-children">
        {grievances.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-2xl p-4 shadow-card hover:shadow-dropdown transition-shadow active:scale-[0.99] cursor-pointer animate-fade-in-up"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[#94A3B8]">#{g.id}</span>
                  <span className="text-[10px] text-[#94A3B8]">•</span>
                  <span className="text-[10px] text-[#94A3B8]">{g.date}</span>
                </div>
                <p className="text-sm font-medium text-[#0F172A] truncate">{g.subject}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">{g.category}</span>
                  <StatusChip status={g.status} />
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1] mt-2 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
