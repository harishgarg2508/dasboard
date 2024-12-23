export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
  diagnosis: string;
  treatmentPlan: string;
  tro: string;
  toothNumber: string;
  isNewPatient: boolean;
  payment: number;
  paidAmount: number;
  remainingBalance: number;
  paymentStatus: 'PAID' | 'UNPAID';
  entryDate: string;
  createdAt: string;
}

export type FilterCriteria = 'all' | 'new' | 'returning' | 'age' | 'unpaid';