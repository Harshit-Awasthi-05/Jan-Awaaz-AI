import { MessageSquare, Search, Filter, ChevronDown } from 'lucide-react';
import GrievanceTable from '../components/GrievanceTable';

const grievances = [
  { id: '2847', subject: 'Water supply disruption in Sector 15', citizen: 'Rahul Kumar', category: 'Water Supply', status: 'processing', priority: 'High', date: 'Jul 4, 2026' },
  { id: '2846', subject: 'Broken footpath near Central Market', citizen: 'Anjali Sharma', category: 'Infrastructure', status: 'assigned', priority: 'Medium', date: 'Jul 4, 2026' },
  { id: '2845', subject: 'Noise pollution from construction site', citizen: 'Vikram Singh', category: 'Environment', status: 'pending', priority: 'Low', date: 'Jul 3, 2026' },
  { id: '2844', subject: 'Request for street light installation', citizen: 'Priya Patel', category: 'Infrastructure', status: 'verified', priority: 'Medium', date: 'Jul 3, 2026' },
  { id: '2843', subject: 'Sewage overflow on Ring Road', citizen: 'Suresh Yadav', category: 'Sanitation', status: 'resolved', priority: 'High', date: 'Jul 2, 2026' },
  { id: '2842', subject: 'Unauthorized parking in residential area', citizen: 'Meena Gupta', category: 'Traffic', status: 'rejected', priority: 'Low', date: 'Jul 2, 2026' },
  { id: '2841', subject: 'Delayed pension disbursement', citizen: 'Ram Prasad', category: 'Welfare', status: 'processing', priority: 'High', date: 'Jul 1, 2026' },
  { id: '2840', subject: 'Stray dog menace near school', citizen: 'Anita Devi', category: 'Safety', status: 'assigned', priority: 'Medium', date: 'Jul 1, 2026' },
  { id: '2839', subject: 'Blocked drainage in Block D', citizen: 'Mohammad Ali', category: 'Sanitation', status: 'pending', priority: 'High', date: 'Jun 30, 2026' },
  { id: '2838', subject: 'Public park maintenance required', citizen: 'Sunita Verma', category: 'Infrastructure', status: 'resolved', priority: 'Low', date: 'Jun 30, 2026' },
];

export default function AdminGrievances() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Grievances</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage and respond to citizen complaints</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search grievances..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
        <div className="flex items-center gap-2">
          {['All Status', 'Category', 'Priority'].map((f) => (
            <button key={f} className="flex items-center gap-1.5 px-3 py-2.5 text-sm bg-white rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] transition-colors">
              {f} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      <GrievanceTable grievances={grievances} />
    </div>
  );
}
