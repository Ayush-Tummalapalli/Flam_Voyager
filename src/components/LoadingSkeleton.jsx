'use client';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner Skeleton */}
      <div className="bg-slate-200 h-44 rounded-2xl w-full" />

      {/* Day Cards Skeleton */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-xl" />
            <div className="h-5 bg-slate-200 rounded w-1/3" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-16 bg-slate-100 rounded-xl w-full" />
            <div className="h-16 bg-slate-100 rounded-xl w-full" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-xl" />
            <div className="h-5 bg-slate-200 rounded w-1/4" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-16 bg-slate-100 rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
