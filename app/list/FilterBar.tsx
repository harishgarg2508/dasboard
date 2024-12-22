import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  filters: {
    ageRange: string;
    paymentStatus: string;
    patientType: string;
    startDate: string;
    endDate: string;
  };
  onSearchChange: (value: string) => void;
  onFilterChange: (name: string, value: string) => void;
  onResetFilters: () => void;
}

export default function FilterBar({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  return (
    <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-black" size={20} />
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="px-4 py-2 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-blue-400"
        value={filters.ageRange}
        onChange={(e) => onFilterChange('ageRange', e.target.value)}
      >
        <option value="">Filter by Age</option>
        <option value="0-18">0-18 years</option>
        <option value="19-30">19-30 years</option>
        <option value="31-50">31-50 years</option>
        <option value="51+">51+ years</option>
      </select>

      <select
        className="px-4 py-2 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-blue-400"
        value={filters.paymentStatus}
        onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
      >
        <option value="">Filter by Payment</option>
        <option value="PAID">Paid</option>
        <option value="UNPAID">Unpaid</option>
      </select>

      <select
        className="px-4 py-2 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-blue-400"
        value={filters.patientType}
        onChange={(e) => onFilterChange('patientType', e.target.value)}
      >
        <option value="">Filter by Patient Type</option>
        <option value="NEW">New Patients</option>
        <option value="OLD">Old Patients</option>
      </select>

      <input
        type="date"
        className="px-4 py-2 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-blue-400"
        value={filters.startDate}
        onChange={(e) => onFilterChange('startDate', e.target.value)}
        placeholder="Start Date"
      />

      <input
        type="date"
        className="px-4 py-2 rounded-xl border text-black border-gray-200 focus:ring-2 focus:ring-blue-400"
        value={filters.endDate}
        onChange={(e) => onFilterChange('endDate', e.target.value)}
        placeholder="End Date"
      />

      <button
        onClick={onResetFilters}
        className="px-4 py-2 bg-gray-200 text-black rounded-xl border focus:ring-2 focus:ring-red-400"
      >
        Reset Filters
      </button>
    </div>
  );
}
