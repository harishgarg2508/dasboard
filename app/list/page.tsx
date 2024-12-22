'use client';
import { useState, useEffect } from 'react';
import { getPatients, deletePatient, deleteMultiplePatients, updatePatientPayment } from '../utils/db';
import { Patient } from '../types/patient';
import Navbar from '../components/navbar';
import { exportToExcel } from '../utils/excelExport';
import { Trash2, FileText } from 'lucide-react'; // Add FileText for the button icon
import FilterBar from './FilterBar';
import PatientTable from './PatientTable';
import PaymentModal from './PaymentModal';

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    ageRange: '',
    paymentStatus: '',
    patientType: '',
    startDate: '',
    endDate: '',
  });
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const allPatients = await getPatients();
      setPatients(allPatients);
      setFilteredPatients(allPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, filters);
  };

  const matchesAgeRange = (age: number, range: string) => {
    switch (range) {
      case '0-18': return age >= 0 && age <= 18;
      case '19-30': return age >= 19 && age <= 30;
      case '31-50': return age >= 31 && age <= 50;
      case '51+': return age >= 51;
      default: return true;
    }
  };

  const applyFilters = (search: string, currentFilters = filters) => {
    let filtered = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.phoneNumber.includes(search);

      const matchesAge = !currentFilters.ageRange || matchesAgeRange(patient.age, currentFilters.ageRange);
      const matchesPayment = !currentFilters.paymentStatus || patient.paymentStatus === currentFilters.paymentStatus;
      const matchesType = !currentFilters.patientType || 
        (currentFilters.patientType === 'NEW' ? patient.isNewPatient : !patient.isNewPatient);
      
      const matchesDate = (!currentFilters.startDate || patient.entryDate >= currentFilters.startDate) &&
        (!currentFilters.endDate || patient.entryDate <= currentFilters.endDate);

      return matchesSearch && matchesAge && matchesPayment && matchesType && matchesDate;
    });

    setFilteredPatients(filtered);
  };

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        await loadPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const handleExportToExcel = () => {
    exportToExcel(filteredPatients); // Use filtered patients for export
  };

  const handleMultiDelete = async () => {
    if (selectedPatients.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedPatients.length} selected patients?`)) {
      try {
        await deleteMultiplePatients(selectedPatients);
        await loadPatients();
        setSelectedPatients([]);
      } catch (error) {
        console.error('Error deleting patients:', error);
      }
    }
  };

  const handlePaymentUpdate = async (amount: number) => {
    if (selectedPatientId === null) return;

    try {
      await updatePatientPayment(selectedPatientId, amount);
      await loadPatients();
      setShowPaymentModal(false);
      setSelectedPatientId(null);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedPatients(selected ? filteredPatients.map(p => p.id!).filter(id => id !== undefined) : []);
  };

  const handleSelect = (id: number) => {
    setSelectedPatients(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };
  const onResetFilters = async () => {
    setSearchTerm('');
    setFilters({
      ageRange: '',
      paymentStatus: '',
      patientType: '',
      startDate: '',
      endDate: '',
    });
    // Fetch all patients again after resetting filters
    const allPatients = await getPatients();
    setPatients(allPatients);
    setFilteredPatients(allPatients);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <h2 className="text-3xl font-bold text-white">Patient Management</h2>
            <p className="text-blue-100 mt-2">View and manage all patient records</p>
          </div>

          <div className="p-8">
            <FilterBar
              searchTerm={searchTerm}
              filters={filters}
              onSearchChange={handleSearch}
              onFilterChange={handleFilterChange}
              onResetFilters={onResetFilters}
            />

            {selectedPatients.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-xl flex items-center justify-between">
                <span className="text-blue-700">
                  {selectedPatients.length} patients selected
                </span>
                <button
                  onClick={handleMultiDelete}
                  className="px-4 py-2 bg-red-600 text-black rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Selected
                </button>
              </div>
            )}

            <div className="flex justify-end mb-4">
              <button
                onClick={handleExportToExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FileText size={16} />
                Export to Excel
              </button>
            </div>

            <div className="overflow-x-auto">
              <PatientTable
                patients={filteredPatients}
                selectedPatients={selectedPatients}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                onDelete={handleDelete}
                onUpdatePayment={(id) => {
                  setSelectedPatientId(id);
                  setShowPaymentModal(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPatientId(null);
          }}
          onSubmit={handlePaymentUpdate}
        />
      )}
    </div>
  );
}
