import type { ReactNode } from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.06] border border-white/[0.04] ${className}`} />;
}

export function SkeletonText({ className = '' }: { className?: string }) {
  return (
    <Skeleton className={`h-3 rounded-full ${className}`} />
  );
}

export function SkeletonButton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-9 rounded-2xl ${className}`} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-panel-sm p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-1.5">
          <SkeletonText className="w-1/2" />
          <SkeletonText className="w-1/3" />
        </div>
      </div>
      <Skeleton className="h-16 rounded-xl" />
      <div className="flex gap-2">
        <SkeletonButton className="flex-1" />
        <SkeletonButton className="flex-1" />
      </div>
    </div>
  );
}

export function SkeletonMetricGrid({ count = 4, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel-sm p-4 space-y-2">
          <Skeleton className="w-8 h-8 rounded-xl" />
          <SkeletonText className="w-3/4" />
          <SkeletonText className="w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel-sm px-4 py-3.5 flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonText className="w-2/5" />
            <SkeletonText className="w-1/4" />
          </div>
          <SkeletonText className="w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton({ metricCount = 6, listCount = 3 }: { metricCount?: number; listCount?: number }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="w-24 h-4 rounded-full" />
        <SkeletonText className="w-1/2 !h-6" />
        <SkeletonText className="w-1/3" />
      </div>
      <SkeletonMetricGrid count={metricCount} />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass-panel p-5 space-y-3">
          <SkeletonText className="w-1/3" />
          <SkeletonList count={listCount} className="!space-y-2" />
        </div>
        <div className="glass-panel p-5 space-y-3">
          <SkeletonText className="w-1/3" />
          <SkeletonList count={listCount} className="!space-y-2" />
        </div>
      </div>
    </div>
  );
}

export function LoadingHint({ children = 'Loading…' }: { children?: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-text-muted">
      <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-soil-gold animate-spin" />
      <span className="text-xs font-semibold">{children}</span>
    </div>
  );
}