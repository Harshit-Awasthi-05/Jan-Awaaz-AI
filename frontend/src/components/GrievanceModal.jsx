import { X, MapPin, Image as ImageIcon, AlertCircle, Info } from 'lucide-react';
import StatusChip from './StatusChip';

export default function GrievanceModal({ grievance, onClose, onStatusChange }) {
  if (!grievance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A]">Grievance #{grievance.id}</h3>
            <p className="text-sm text-[#64748B]">Filed by {grievance.citizen} via {grievance.channel || 'App'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="flex flex-wrap gap-4 items-center">
            <StatusChip status={grievance.status} />
            <span
              className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${
                grievance.priority === 'High' || grievance.priority === 'Critical'
                  ? 'text-[#EF4444] bg-[rgba(239,68,68,0.08)]'
                  : grievance.priority === 'Medium'
                  ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.08)]'
                  : 'text-[#64748B] bg-[rgba(100,116,139,0.08)]'
              }`}
            >
              Priority: {grievance.priority}
            </span>
            <span className="text-sm font-medium text-[#475569] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
              {grievance.category}
            </span>
            <span className="text-sm text-[#64748B] ml-auto">{grievance.date}</span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-2">
                <Info className="w-4 h-4 text-[#2563EB]" />
                Summary / Problem Description
              </h4>
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] text-[#334155] text-sm leading-relaxed whitespace-pre-wrap">
                {grievance.subject}
              </div>
            </div>

            {grievance.action_insight && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-2">
                  <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                  AI Actionable Insight
                </h4>
                <div className="bg-[#FFFBEB] p-4 rounded-xl border border-[#FEF3C7] text-[#92400E] text-sm leading-relaxed whitespace-pre-wrap">
                  {grievance.action_insight}
                </div>
              </div>
            )}

            {(grievance.latitude || grievance.constituency) && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-2">
                  <MapPin className="w-4 h-4 text-[#10B981]" />
                  Location Details
                </h4>
                <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#DCFCE7] text-[#166534] text-sm flex flex-col gap-3">
                  {grievance.constituency && <p><strong>Constituency:</strong> {grievance.constituency}</p>}
                  {grievance.latitude && grievance.longitude && (
                    <>
                      <p>
                        <strong>Coordinates:</strong> {grievance.latitude}, {grievance.longitude}{' '}
                        <a
                          href={`https://maps.google.com/?q=${grievance.latitude},${grievance.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2563EB] hover:underline ml-2"
                        >
                          (View on Google Maps)
                        </a>
                      </p>
                      <div className="rounded-lg overflow-hidden border border-[#DCFCE7]">
                        <iframe
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${grievance.latitude},${grievance.longitude}&hl=en&z=14&output=embed`}
                        ></iframe>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {grievance.media_url && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] mb-2">
                  <ImageIcon className="w-4 h-4 text-[#8B5CF6]" />
                  Attached Media
                </h4>
                <div className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-gray-50 flex justify-center">
                  <img
                    src={grievance.media_url}
                    alt="Grievance Media"
                    className="max-h-64 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {onStatusChange && (
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <span className="text-sm font-medium text-[#475569]">Update Status:</span>
            <select
              value={grievance.status}
              onChange={(e) => onStatusChange(grievance.id, e.target.value)}
              className="text-sm font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]/30 cursor-pointer shadow-sm"
            >
              <option value="submitted">Submitted</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}

      </div>
    </div>
  );
}
