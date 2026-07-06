import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import GrievanceTable from '../components/GrievanceTable';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminGrievances() {
  const { mpToken } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mpToken) return;
    fetchComplaints();
  }, [mpToken]);

  async function fetchComplaints() {
    try {
      const res = await fetch(`${API_BASE}/mp/dashboard/complaints`, {
        headers: { Authorization: `Bearer ${mpToken}` },
      });
      if (!res.ok) throw new Error('Failed to load complaints.');
      const data = await res.json();

      const mapped = (data.complaints || []).map((c) => ({
        id: c.complaint_id,
        subject: c.summary || 'No description available',
        citizen: c.citizen_name || 'Unknown Citizen',
        category: c.category || 'Uncategorized',
        status: c.status || 'submitted',
        priority: c.severity || 'Low',
        date: formatDate(c.created_at),
      }));

      setGrievances(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(complaintId, newStatus) {
    
    setGrievances((prev) =>
      prev.map((g) => (g.id === complaintId ? { ...g, status: newStatus } : g))
    );

    try {
      const res = await fetch(`${API_BASE}/mp/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mpToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status.');
    } catch (err) {
      setError(err.message);

      fetchComplaints();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Grievances</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Manage and respond to citizen complaints</p>
        </div>
      </div>


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
            <button
              key={f}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm bg-white rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] transition-colors"
            >
              {f} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading grievances...</p>
      ) : grievances.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">No grievances filed yet.</p>
      ) : (
        <GrievanceTable grievances={grievances} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}