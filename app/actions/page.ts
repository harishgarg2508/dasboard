'use server'

import { Patient } from '../utils/types';
import { savePatient, searchPatients, filterPatients } from '../utils/db';

export async function addPatient(formData: FormData) {
  const patient: Patient = {
    id: '',
    name: formData.get('name') as string,
    age: parseInt(formData.get('age') as string),
    gender: formData.get('gender') as 'Male' | 'Female' | 'Other',
    isNewPatient: formData.get('isNewPatient') === 'true',
    phoneNumber: formData.get('phoneNumber') as string,
    diagnosis: formData.get('diagnosis') as string,
    treatmentPlan: formData.get('treatmentPlan') as string,
    tro: formData.get('tro') as string,
    toothNumber: formData.get('toothNumber') as string,
    payment: parseFloat(formData.get('payment') as string),
  };

  savePatient(patient);
}

export async function searchPatientsByName(query: string) {
  return searchPatients(query);
}

export async function filterPatientsByCriteria(criteria: string) {
  return filterPatients(criteria);
}

