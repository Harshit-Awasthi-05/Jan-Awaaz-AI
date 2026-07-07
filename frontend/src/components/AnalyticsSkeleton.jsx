export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse mt-6">
      <div className="grid grid-cols-12 gap-4">
        
        <div className="col-span-8 bg-white rounded-2xl p-6 shadow-card h-[380px]">
          <div className="h-5 bg-slate-200 rounded-md w-32 mb-1" />
          <div className="h-4 bg-slate-200 rounded-md w-48 mb-6" />
          <div className="h-[280px] bg-slate-100 rounded-lg w-full" />
        </div>

        
        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-card h-[380px] flex flex-col items-center">
          <div className="w-full">
            <div className="h-5 bg-slate-200 rounded-md w-32 mb-1" />
            <div className="h-4 bg-slate-200 rounded-md w-48 mb-6" />
          </div>
          <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 mb-6" />
          <div className="flex gap-4">
            <div className="h-3 bg-slate-200 rounded-md w-16" />
            <div className="h-3 bg-slate-200 rounded-md w-16" />
            <div className="h-3 bg-slate-200 rounded-md w-16" />
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl p-6 shadow-card h-[320px]">
        <div className="h-5 bg-slate-200 rounded-md w-40 mb-1" />
        <div className="h-4 bg-slate-200 rounded-md w-48 mb-6" />
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 bg-slate-200 rounded-md w-20 shrink-0" />
              <div className="h-3 bg-slate-200 rounded-r-md w-full max-w-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
