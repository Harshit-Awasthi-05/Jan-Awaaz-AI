import { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import StatusChip from '../components/StatusChip';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
const FILTERS = ['All', 'Submitted', 'In Progress', 'Resolved'];

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}


function toChipStatus(status) {
  if (status === 'resolved') return 'resolved';
  if (status === 'in_progress') return 'assigned';
  return 'processing';
}

export default function CitizenTrack() {
  const { citizenToken } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!citizenToken) return;

    async function fetchComplaints() {
      try {
        const res = await fetch(`${API_BASE}/citizen/complaints`, {
          headers: { Authorization: `Bearer ${citizenToken}` },
        });
        if (!res.ok) throw new Error('Failed to load your complaints.');
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, [citizenToken]);

  const filtered = complaints.filter((g) => {
    const matchesSearch =
      !search ||
      g.complaint_id?.toLowerCase().includes(search.toLowerCase()) ||
      g.summary?.toLowerCase().includes(search.toLowerCase()) ||
      g.category?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Submitted' && g.status === 'submitted') ||
      (activeFilter === 'In Progress' && g.status === 'in_progress') ||
      (activeFilter === 'Resolved' && g.status === 'resolved');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Track Grievances</h1>

      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ID or keyword..."
          className="w-full pl-9 pr-4 py-3 text-sm bg-white rounded-2xl shadow-card border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A] placeholder:text-[#94A3B8]"
        />
      </div>

      
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === f
                ? 'bg-[#2563EB] text-white'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      
      {loading ? (
        <p className="text-sm text-[#64748B]">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">No grievances match.</p>
      ) : (
        <div className="space-y-2.5 stagger-children">
          {filtered.map((g) => (
            <div
              key={g.complaint_id}
              className="bg-white rounded-2xl p-4 shadow-card hover:shadow-dropdown transition-shadow active:scale-[0.99] cursor-pointer animate-fade-in-up"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#94A3B8]">#{g.complaint_id}</span>
                    <span className="text-[10px] text-[#94A3B8]">•</span>
                    <span className="text-[10px] text-[#94A3B8]">{formatDate(g.created_at)}</span>
                  </div>
                  <p className="text-sm font-medium text-[#0F172A] truncate">{g.summary}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                      {g.category || 'Uncategorized'}
                    </span>
                    <StatusChip status={toChipStatus(g.status)} />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#CBD5E1] mt-2 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}