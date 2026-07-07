export default function TableSkeleton({ columns = 7 }) {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F1F5F9]">
              {[...Array(columns)].map((_, i) => (
                <th key={i} className="text-left py-4 px-4">
                  <div className="h-3 bg-slate-200 rounded-md w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[#E2E8F0] last:border-b-0">
                {[...Array(columns)].map((_, colIndex) => (
                  <td key={colIndex} className="py-3 px-4">
                    <div className={`h-4 bg-slate-200 rounded-md ${colIndex === 1 ? 'w-48' : colIndex === columns - 1 ? 'w-20 ml-auto' : 'w-24'}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
