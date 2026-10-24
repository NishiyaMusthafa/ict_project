import React from 'react';

export const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200/80 p-0 overflow-hidden shadow-sm animate-pulse flex flex-col"
        >
          {/* Top image box skeleton */}
          <div className="h-48 bg-slate-200 w-full" />

          {/* Body skeleton */}
          <div className="p-5 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-4 bg-slate-200 rounded w-16" />
            </div>
            <div className="h-5 bg-slate-200 rounded w-3/4" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-5/6" />
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-28" />
              <div className="h-4 bg-slate-200 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
