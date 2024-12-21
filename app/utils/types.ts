export interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID';
export type FilterCriteria = 'all' | 'new' | 'returning' | 'age' | 'unpaid';

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
  createdAt: string;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
  payments: Payment[];
}
