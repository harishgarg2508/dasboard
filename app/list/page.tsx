'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Table, Download, Trash2, Calendar } from 'lucide-react';
import { Patient, FilterCriteria } from '../utils/types';
import { getPatients, searchPatients, filterPatients, deletePatient } from '../utils/db';
import Navbar from '../components/navbar';

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        let results = await (searchQuery ? searchPatients(searchQuery) : filterPatients(filterCriteria));
      
        // Apply date filtering if dates are selected
        if (startDate && endDate) {
          results = results.filter(patient => {
            const patientDate = new Date(patient.createdAt).toISOString().split('T')[0];
            return patientDate >= startDate && patientDate <= endDate;
          });
        }
      
        setPatients(results);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [searchQuery, filterCriteria, startDate, endDate]);

  const handleDelete = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        await deletePatient(patientId);
        // Fetch the updated list of patients after deletion
        const updatedPatients = await getPatients();
        setPatients(updatedPatients);
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  const downloadCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Status', 'Age', 'Gender', 'Phone', 'Diagnosis', 'Treatment', 'TRO', 'Tooth #', 'Payment', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...patients.map(patient => [
        patient.name,
        patient.isNewPatient ? 'New Patient' : 'Returning',
        patient.age,
        patient.gender,
        patient.phoneNumber,
        `"${patient.diagnosis}"`,
        `"${patient.treatmentPlan}"`,
        patient.tro,
        patient.toothNumber,
        patient.payment.toFixed(2),
        new Date(patient.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `patients_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-xl shadow-sm">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left font-bold text-gray-900">Name</th>
            <th className="p-4 text-left font-bold text-gray-900">Status</th>
            <th className="p-4 text-left font-bold text-gray-900">Age</th>
            <th className="p-4 text-left font-bold text-gray-900">Gender</th>
            <th className="p-4 text-left font-bold text-gray-900">Phone</th>
            <th className="p-4 text-left font-bold text-gray-900">Diagnosis</th>
            <th className="p-4 text-left font-bold text-gray-900">Treatment</th>
            <th className="p-4 text-left font-bold text-gray-900">TRO</th>
            <th className="p-4 text-left font-bold text-gray-900">Tooth #</th>
            <th className="p-4 text-left font-bold text-gray-900">Payment</th>
            <th className="p-4 text-left font-bold text-gray-900">Date</th>
            <th className="p-4 text-left font-bold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b hover:bg-gray-50">
              <td className="p-4 font-medium text-gray-900">{patient.name || 'N/A'}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  patient.isNewPatient 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {patient.isNewPatient ? 'New Patient' : 'Returning'}
                </span>
              </td>
              <td className="p-4 text-gray-700">{patient.age || 'N/A'}</td>
              <td className="p-4 text-gray-700">{patient.gender || 'N/A'}</td>
              <td className="p-4 text-gray-700">{patient.phoneNumber || 'N/A'}</td>
              <td className="p-4 text-gray-900 font-medium">{patient.diagnosis || 'N/A'}</td>
              <td className="p-4 text-gray-900">{patient.treatmentPlan || 'N/A'}</td>
              <td className="p-4 text-gray-700">{patient.tro || 'N/A'}</td>
              <td className="p-4 text-gray-700">{patient.toothNumber || 'N/A'}</td>
              <td className="p-4 font-medium text-gray-900">${patient.payment ? patient.payment.toFixed(2) : '0.00'}</td>
              <td className="p-4 text-gray-700">{new Date(patient.createdAt).toLocaleDateString()}</td>
              <td className="p-4">
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete patient"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const CardView = () => (
    <div className="space-y-4">
      {patients.map((patient) => (
        <motion.div
          key={patient.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-xl font-bold text-gray-900">{patient.name || 'N/A'}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    patient.isNewPatient 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {patient.isNewPatient ? 'New Patient' : 'Returning'}
                  </span>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete patient"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="mt-1 text-sm text-gray-900">{patient.age || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="mt-1 text-sm text-gray-900">{patient.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1 text-sm text-gray-900">{patient.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                <p className="mt-1 text-sm text-gray-900">{patient.diagnosis || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Treatment</p>
                <p className="mt-1 text-sm text-gray-900">{patient.treatmentPlan || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">TRO</p>
                <p className="mt-1 text-sm text-gray-900">{patient.tro || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tooth #</p>
                <p className="mt-1 text-sm text-gray-900">{patient.toothNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment</p>
                <p className="mt-1 text-sm font-medium text-gray-900">${patient.payment ? patient.payment.toFixed(2) : '0.00'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">{new Date(patient.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
              <div className="flex gap-4">
                <button
                  onClick={downloadCSV}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Toggle view"
                >
                  {viewMode === 'card' ? (
                    <Table className="w-6 h-6 text-gray-700" />
                  ) : (
                    <LayoutGrid className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border text-gray-900 placeholder-gray-500 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <select
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value as FilterCriteria)}
                className="px-4 py-2 rounded-lg border text-gray-900 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
              >
                <option value="all">All Patients</option>
                <option value="new">New</option>
                <option value="returning">Old</option>
                <option value="age">Sort by Age</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border text-gray-900 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border text-gray-900 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-gray-600">Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl text-gray-600">No patients found.</p>
            </div>
          ) : (
            <AnimatePresence>
              {viewMode === 'card' ? <CardView /> : <TableView />}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

