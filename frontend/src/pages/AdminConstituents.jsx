import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import TableSkeleton from '../components/TableSkeleton';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

function formatDate(isoString) {
  if (!isoString) return 'Never';
  return new Date(isoString).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminConstituents() {
  const { mpToken } = useAuth();
  const [constituents, setConstituents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!mpToken) return;

    async function fetchConstituents() {
      try {
        const res = await fetch(`${API_BASE}/mp/dashboard/constituents`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });
        if (!res.ok) throw new Error('Failed to load constituents.');
        const data = await res.json();
        setConstituents(data.constituents || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchConstituents();
  }, [mpToken]);

  const filtered = constituents.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.constituency?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Constituents</h2>
          <p className="text-sm text-[#64748B] mt-0.5">
            Citizens who have filed at least one grievance
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or constituency..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white rounded-lg border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] placeholder:text-[#94A3B8]"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <TableSkeleton columns={5} />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">No constituents found.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-fade-in-up">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F5F9]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                  Constituency
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                  Grievances
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                  Last Active
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.citizen_uid}
                  className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F1F5F9] transition-colors"
                >
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(c.name)}
                      </div>
                      <span className="text-sm font-medium text-[#0F172A]">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-sm text-[#475569]">{c.constituency}</td>
                  <td className="py-2 px-4 text-sm text-[#64748B] font-mono">{c.phone}</td>
                  <td className="py-2 px-4 text-sm font-medium text-[#0F172A]">
                    {c.grievance_count}
                  </td>
                  <td className="py-2 px-4 text-sm text-[#64748B]">
                    {formatDate(c.last_active)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}