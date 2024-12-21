import { Patient, FilterCriteria } from './types';

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const response = await fetch('/api/patients');
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};

export const savePatient = async (patient: Patient): Promise<void> => {
  try {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    });
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  } catch (error) {
    console.error('Error saving patient:', error);
    throw new Error('Failed to save patient data');
  }
};

export const deletePatient = async (patientId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/patients/${patientId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      console.error(`Failed to delete patient. Status: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting patient:', error);
    return false;
  }
};

export const searchPatients = async (query: string): Promise<Patient[]> => {
  const patients = await getPatients();
  return patients.filter(patient => 
    patient.name.toLowerCase().includes(query.toLowerCase()) ||
    patient.phoneNumber.includes(query)
  );
};

export const filterPatients = async (criteria: FilterCriteria): Promise<Patient[]> => {
  const patients = await getPatients();
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

