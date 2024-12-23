'use client';
import React, { useState } from 'react';
import { Patient } from '../types/patient';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';

interface PatientTableProps {
  patients: Patient[];
  selectedPatients: number[];
  onSelect: (id: number) => void;
  onSelectAll: (selected: boolean) => void;
  onDelete: (id: number) => void;
  onUpdatePayment: (id: number) => void;
}

type SortConfig = {
  key: keyof Patient | 'index';
  direction: 'asc' | 'desc';
};

export default function PatientTable({
  patients,
  selectedPatients,
  onSelect,
  onSelectAll,
  onDelete,
  onUpdatePayment,
}: PatientTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'index', 
    direction: 'asc' 
  });

  const sortedPatients = React.useMemo(() => {
    const sortedArray = [...patients];
    
    if (sortConfig.key === 'index') {
      return sortConfig.direction === 'asc' ? sortedArray : sortedArray.reverse();
    }

    return sortedArray.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'string') {
        comparison = aValue.localeCompare(String(bValue));
      } else if (typeof aValue === 'number') {
        comparison = aValue - (bValue as number);
      } else if (typeof aValue === 'boolean') {
        comparison = (aValue === bValue) ? 0 : aValue ? 1 : -1;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [patients, sortConfig]);

  const requestSort = (key: keyof Patient | 'index') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey: keyof Patient | 'index') => {
    if (sortConfig.key === columnKey) {
      return (
        <ArrowUpDown 
          size={16} 
          className={`inline ml-1 transform ${
            sortConfig.direction === 'desc' ? 'rotate-180' : ''
          }`}
        />
      );
    }
    return <ArrowUpDown size={16} className="inline ml-1 text-gray-300" />;
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-100 border-b border-gray-200">
          <th className="px-4 py-3 text-left">
            <input
              type="checkbox"
              onChange={(e) => onSelectAll(e.target.checked)}
              checked={patients.length > 0 && selectedPatients.length === patients.length}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </th>
          <th 
              className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort('index')}
            >
              SNo. {getSortIcon('index')}
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">New/Old</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Age</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Gender</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Diagnosis</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Treatment Plan</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">TRO</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tooth Number</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Entry Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Payment Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Balance</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
      </thead>
      <tbody>
        {sortedPatients.map((patient, index) => (
          <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3">
              <input
                type="checkbox"
                checked={selectedPatients.includes(patient.id)}
                onChange={() => onSelect(patient.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </td>
            <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{patient.name}</td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">{patient.isNewPatient ? 'New' : 'Old'}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{patient.age}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{patient.phoneNumber}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{patient.gender}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{patient.diagnosis}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{patient.treatmentPlan}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{patient.tro}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{patient.toothNumber}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{patient.entryDate}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                patient.paymentStatus === 'PAID' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {patient.paymentStatus}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-900">
              ₹{patient.remainingBalance.toFixed(2)}
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                {patient.paymentStatus === 'UNPAID' && (
                  <button
                    onClick={() => onUpdatePayment(patient.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Update Payment"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => onDelete(patient.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}