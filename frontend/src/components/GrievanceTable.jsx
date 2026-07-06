import StatusChip from './StatusChip';

const STATUS_OPTIONS = ['submitted', 'in_progress', 'resolved'];

export default function GrievanceTable({ grievances, onStatusChange }) {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-fade-in-up">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F1F5F9] sticky top-0 z-10">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                Subject
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                Category
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                Priority
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                Date
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                Update Status
              </th>
            </tr>
          </thead>
          <tbody>
            {grievances.map((g, i) => (
              <tr
                key={g.id}
                className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F1F5F9] transition-colors duration-100"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td className="py-2 px-4 text-sm font-mono text-[#64748B]">
                  #{g.id}
                </td>
                <td className="py-2 px-4">
                  <p className="text-sm font-medium text-[#0F172A] truncate max-w-[240px]">
                    {g.subject}
                  </p>
                  <p className="text-xs text-[#94A3B8] truncate max-w-[240px]">
                    {g.citizen}
                  </p>
                </td>
                <td className="py-2 px-4 text-sm text-[#475569]">
                  {g.category}
                </td>
                <td className="py-2 px-4">
                  <StatusChip status={g.status} />
                </td>
                <td className="py-2 px-4">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                      g.priority === 'High' || g.priority === 'Critical'
                        ? 'text-[#EF4444] bg-[rgba(239,68,68,0.08)]'
                        : g.priority === 'Medium'
                        ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.08)]'
                        : 'text-[#64748B] bg-[rgba(100,116,139,0.08)]'
                    }`}
                  >
                    {g.priority}
                  </span>
                </td>
                <td className="py-2 px-4 text-sm text-[#64748B]">{g.date}</td>
                <td className="py-2 px-4 text-right">
                  <select
                    value={g.status}
                    onChange={(e) => onStatusChange && onStatusChange(g.id, e.target.value)}
                    className="text-xs font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-[#2563EB]/30 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}