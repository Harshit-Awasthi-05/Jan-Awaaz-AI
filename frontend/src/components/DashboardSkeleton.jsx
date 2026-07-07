import TableSkeleton from './TableSkeleton';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-slate-200 rounded-md w-40 mb-2" />
          <div className="h-4 bg-slate-200 rounded-md w-64" />
        </div>
      </div>

      
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded-md w-24" />
              <div className="h-8 bg-slate-200 rounded-md w-16" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 bg-white rounded-2xl p-6 shadow-card h-[340px]">
          <div className="flex justify-between mb-6">
            <div className="space-y-2">
              <div className="h-5 bg-slate-200 rounded-md w-32" />
              <div className="h-4 bg-slate-200 rounded-md w-48" />
            </div>
            <div className="h-4 bg-slate-200 rounded-md w-32" />
          </div>
          <div className="h-[220px] bg-slate-100 rounded-lg w-full" />
        </div>

        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-card h-[340px]">
          <div className="h-5 bg-slate-200 rounded-md w-24 mb-6" />
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-slate-200 rounded-md w-20" />
                  <div className="h-4 bg-slate-200 rounded-md w-10" />
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="bg-slate-200 rounded-2xl p-6 h-32" />

      
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-slate-200 rounded-md w-40" />
          <div className="flex gap-2">
            <div className="h-9 bg-slate-200 rounded-lg w-20" />
            <div className="h-9 bg-slate-200 rounded-lg w-20" />
          </div>
        </div>
        <TableSkeleton />
      </div>
    </div>
  );
}
