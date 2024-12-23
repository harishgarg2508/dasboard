import { Patient } from '../types/patient';

export const sortPatientsByDate = (patients: Patient[], sortOrder: 'asc' | 'desc'): Patient[] => {
  // Create a new array and sort it based on entry date
  return [...patients].sort((a, b) => {
    const dateA = new Date(a.entryDate).getTime();
    const dateB = new Date(b.entryDate).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
};