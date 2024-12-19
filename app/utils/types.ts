export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    isNewPatient: boolean;
    phoneNumber: string;
    diagnosis: string;
    treatmentPlan: string;
    tro: string;
    toothNumber: string;
    payment: number;
  }
  
  export type FilterCriteria = 'all' | 'new' | 'returning' | 'age';
  
  