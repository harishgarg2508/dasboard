'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Table } from 'lucide-react';
import { Patient, FilterCriteria } from '../utils/types';
import { getPatients, searchPatients, filterPatients } from '../utils/db';

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    const fetchPatients = async () => {
      if (searchQuery) {
        const results = searchPatients(searchQuery);
        setPatients(results);
      } else {
        const results = filterPatients(filterCriteria);
        setPatients(results);
      }
    };
    fetchPatients();
  }, [searchQuery, filterCriteria]);

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-xl shadow-sm">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left text-gray-600">Name</th>
            <th className="p-4 text-left text-gray-600">Status</th>
            <th className="p-4 text-left text-gray-600">Age</th>
            <th className="p-4 text-left text-gray-600">Gender</th>
            <th className="p-4 text-left text-gray-600">Phone</th>
            <th className="p-4 text-left text-gray-600">Diagnosis</th>
            <th className="p-4 text-left text-gray-600">Treatment</th>
            <th className="p-4 text-left text-gray-600">TRO</th>
            <th className="p-4 text-left text-gray-600">Tooth #</th>
            <th className="p-4 text-left text-gray-600">Payment</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{patient.name}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  patient.isNewPatient 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-green-50 text-green-600'
                }`}>
                  {patient.isNewPatient ? 'New Patient' : 'Returning'}
                </span>
              </td>
              <td className="p-4">{patient.age}</td>
              <td className="p-4">{patient.gender}</td>
              <td className="p-4">{patient.phoneNumber}</td>
              <td className="p-4">{patient.diagnosis}</td>
              <td className="p-4">{patient.treatmentPlan}</td>
              <td className="p-4">{patient.tro}</td>
              <td className="p-4">{patient.toothNumber}</td>
              <td className="p-4">${patient.payment.toFixed(2)}</td>
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
              <h3 className="text-xl font-semibold text-gray-800">{patient.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                patient.isNewPatient 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-green-50 text-green-600'
              }`}>
                {patient.isNewPatient ? 'New Patient' : 'Returning'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="text-gray-800">{patient.age}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="text-gray-800">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-800">{patient.phoneNumber}</p>
              </div>
              <div className="col-span-2 md:col-span-3">
                <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                <p className="text-gray-800">{patient.diagnosis}</p>
              </div>
              <div className="col-span-2 md:col-span-3">
                <p className="text-sm font-medium text-gray-500">Treatment Plan</p>
                <p className="text-gray-800">{patient.treatmentPlan}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">TRO</p>
                <p className="text-gray-800">{patient.tro}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tooth Number</p>
                <p className="text-gray-800">{patient.toothNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment</p>
                <p className="text-gray-800">${patient.payment.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
            <button
              onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle view"
            >
              {viewMode === 'card' ? (
                <Table className="w-6 h-6 text-gray-600" />
              ) : (
                <LayoutGrid className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border text-black border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <select
              value={filterCriteria}
              onChange={(e) => setFilterCriteria(e.target.value as FilterCriteria)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-black focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="all">All Patients</option>
              <option value="new">New Patients</option>
              <option value="returning">Returning Patients</option>
              <option value="age">Sort by Age</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {viewMode === 'card' ? <CardView /> : <TableView />}
        </AnimatePresence>
      </div>
    </div>
  );
}