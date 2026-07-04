const statusConfig = {
  pending: {
    color: '#64748B',
    bg: 'rgba(100, 116, 139, 0.1)',
    label: 'Pending',
  },
  processing: {
    color: '#14B8A6',
    bg: 'rgba(20, 184, 166, 0.1)',
    label: 'Processing',
  },
  assigned: {
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.1)',
    label: 'Assigned',
  },
  verified: {
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.1)',
    label: 'Verified',
  },
  resolved: {
    color: '#22C55E',
    bg: 'rgba(34, 197, 94, 0.1)',
    label: 'Resolved',
  },
  rejected: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    label: 'Rejected',
  },
};

export default function StatusChip({ status }) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
