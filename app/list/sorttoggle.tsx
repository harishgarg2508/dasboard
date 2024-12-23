import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface SortToggleProps {
  sortOrder: 'asc' | 'desc';
  onToggle: () => void;
}

export default function SortToggle({ sortOrder, onToggle }: SortToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
      title={`Sort by Date (${sortOrder === 'asc' ? 'Oldest' : 'Latest'} First)`}
    >
      <ArrowUpDown size={16} />
      <span>{sortOrder === 'asc' ? 'Oldest First' : 'Latest First'}</span>
    </button>
  );
}