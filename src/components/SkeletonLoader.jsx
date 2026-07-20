import React from 'react';

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-8 bg-gray-200 rounded w-1/2 pt-2" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="h-10 bg-gray-200 rounded w-full" />
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
