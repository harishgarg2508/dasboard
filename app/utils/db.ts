import { Patient, FilterCriteria } from './types';

const STORAGE_KEY = 'patients';

export const getPatients = (): Patient[] => {
  if (typeof window === 'undefined') {
    return []; // Return empty array on server-side
  }
  const patients = localStorage.getItem(STORAGE_KEY);
  return patients ? JSON.parse(patients) : [];
};

export const savePatient = (patient: Patient): void => {
  if (typeof window === 'undefined') return; // Don't save on server-side
  const patients = getPatients();
  const newPatient = { 
    ...patient, 
    id: Date.now().toString(), 
    createdAt: new Date().toISOString() 
  };
  patients.push(newPatient);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
};

export const searchPatients = (query: string): Patient[] => {
  const patients = getPatients();
  return patients.filter(patient => 
    patient.name.toLowerCase().includes(query.toLowerCase()) ||
    patient.phoneNumber.includes(query)
  );
};

export const filterPatients = (criteria: FilterCriteria): Patient[] => {
  const patients = getPatients();
  switch (criteria) {
    case 'new':
      return patients.filter(patient => patient.isNewPatient);
    case 'returning':
      return patients.filter(patient => !patient.isNewPatient);
    case 'age':
      return patients.sort((a, b) => a.age - b.age);
    default:
      return patients;
  }
};

export const deletePatient = (id: string): void => {
  if (typeof window === 'undefined') return; // Don't delete on server-side
  const patients = getPatients();
  const updatedPatients = patients.filter(patient => patient.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
};

