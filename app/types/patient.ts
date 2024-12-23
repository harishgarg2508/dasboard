export interface Patient {
  id?: number;
  name: string;
  age: number;
  gender: string;
  isNewPatient: boolean;
  phoneNumber: string;
  diagnosis: string;
  treatmentPlan: string;
  tro: string;
  toothNumber: string;
  payment: number;
  paidAmount: number;
  remainingBalance: number;
  paymentStatus: 'PAID' | 'UNPAID';
  entryDate: string;
  serialNumber?: number; 
}