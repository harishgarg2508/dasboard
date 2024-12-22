import { utils, writeFile } from 'xlsx';
import { Patient } from '../types/patient';

export const exportToExcel = (patients: Patient[]) => {
  // Prepare data for export
  const exportData = patients.map(patient => ({
    'Name': patient.name,
    'Age': patient.age,
    'Gender': patient.gender,
    'Phone': patient.phoneNumber,
    'Entry Date': patient.entryDate,
    'Patient Type': patient.isNewPatient ? 'New' : 'Old',
    'Diagnosis': patient.diagnosis,
    'Treatment Plan': patient.treatmentPlan,
    'TRO': patient.tro,
    'Tooth Number': patient.toothNumber,
    'Total Amount': patient.payment,
    'Paid Amount': patient.paidAmount,
    'Remaining Balance': patient.remainingBalance,
    'Payment Status': patient.paymentStatus
  }));

  // Create workbook and worksheet
  const wb = utils.book_new();
  const ws = utils.json_to_sheet(exportData);

  // Add worksheet to workbook
  utils.book_append_sheet(wb, ws, 'Patients');

  // Generate file name with current date
  const fileName = `patients_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Save file
  writeFile(wb, fileName);
};