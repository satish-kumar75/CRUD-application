import React from "react";

const TableSkeleton = () => {
  return (
    <div className="w-full overflow-x-auto mb-6 border border-slate-700/50 rounded-xl bg-slate-800/50">
      <table className="w-full border-collapse rounded-xl min-w-[800px]">
        <thead className="bg-slate-800">
          <tr>
            {[...Array(6)].map((_, index) => (
              <th
                key={index}
                className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-slate-700"
              >
                <div className="h-4 bg-slate-700 rounded animate-pulse w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {[...Array(10)].map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-700/50 transition-colors">
              {[...Array(6)].map((_, colIndex) => (
                <td

                  key={colIndex}
                  className="px-3 sm:px-6 py-1 sm:py-4 whitespace-nowrap text-[11px] sm:text-sm text-slate-300"
                >
                  <div
                    className={`h-4 bg-slate-700 rounded animate-pulse ${
                      colIndex === 5 ? "w-16" : "w-24"
                    }`}
                    style={{
                      animationDelay: `${(rowIndex * 6 + colIndex) * 0.05}s`,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton; 