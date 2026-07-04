import { Search, UserPlus, ChevronDown, MoreHorizontal, Eye } from 'lucide-react';

const constituents = [
  { id: 'C001', name: 'Rahul Kumar', ward: 'Ward 42', grievances: 5, lastActive: 'Jul 4, 2026', phone: '+91 98XXX XXXXX' },
  { id: 'C002', name: 'Anjali Sharma', ward: 'Ward 15', grievances: 3, lastActive: 'Jul 4, 2026', phone: '+91 97XXX XXXXX' },
  { id: 'C003', name: 'Vikram Singh', ward: 'Ward 28', grievances: 7, lastActive: 'Jul 3, 2026', phone: '+91 96XXX XXXXX' },
  { id: 'C004', name: 'Priya Patel', ward: 'Ward 42', grievances: 2, lastActive: 'Jul 3, 2026', phone: '+91 95XXX XXXXX' },
  { id: 'C005', name: 'Suresh Yadav', ward: 'Ward 11', grievances: 4, lastActive: 'Jul 2, 2026', phone: '+91 94XXX XXXXX' },
  { id: 'C006', name: 'Meena Gupta', ward: 'Ward 33', grievances: 1, lastActive: 'Jul 2, 2026', phone: '+91 93XXX XXXXX' },
];

export default function AdminConstituents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Constituents</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage citizen profiles and engagement</p>
        </div>
        <button className="flex items-center gap-2 bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">
          <UserPlus className="w-4 h-4" /> Add Citizen
        </button>
      </div>

      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input type="text" placeholder="Search constituents..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-white rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] placeholder:text-[#94A3B8]" />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2.5 text-sm bg-white rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] transition-colors">
          All Wards <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-fade-in-up">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F1F5F9]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">Ward</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">Phone</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">Grievances</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">Last Active</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {constituents.map((c) => (
              <tr key={c.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F1F5F9] transition-colors">
                <td className="py-2 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white text-xs font-bold">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium text-[#0F172A]">{c.name}</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-sm text-[#475569]">{c.ward}</td>
                <td className="py-2 px-4 text-sm text-[#64748B] font-mono">{c.phone}</td>
                <td className="py-2 px-4 text-sm font-medium text-[#0F172A]">{c.grievances}</td>
                <td className="py-2 px-4 text-sm text-[#64748B]">{c.lastActive}</td>
                <td className="py-2 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#2563EB] transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#475569] transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
