// types/patientTypes.ts

export interface PatientFormData {
    name: string;
    age: string;
    gender: string;
    phoneNumber: string;
    diagnosis: string;
    treatmentPlan: string;
    tro: string;
    toothNumber: string;
    isNewPatient: string;
    payment: string;
    entryDate: string;
  }
  
  export interface PatientSubmissionData {
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
    entryDate: string;
  }
  
  export const initialFormData: PatientFormData = {
    name: '',
    age: '',
    gender: '',
    phoneNumber: '',
    diagnosis: '',
    treatmentPlan: '',
    tro: '',
    toothNumber: '',
    isNewPatient: 'true',
    payment: '',
    entryDate: new Date().toISOString().split('T')[0],
  };
  
  export const validateFormStep = (step: number, formData: PatientFormData): boolean => {
    switch (step) {
      case 1:
        return !!formData.name && 
               !!formData.age && 
               !!formData.gender && 
               !!formData.phoneNumber && 
               !!formData.entryDate;
      case 2:
        return !!formData.diagnosis && 
               !!formData.treatmentPlan && 
               !!formData.tro && 
               !!formData.toothNumber;
      case 3:
        return !!formData.isNewPatient && 
               !!formData.payment;
      default:
        return false;
    }
  };
  
  export const transformFormDataForSubmission = (formData: PatientFormData): PatientSubmissionData => {
    return {
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      isNewPatient: formData.isNewPatient === 'true',
      phoneNumber: formData.phoneNumber,
      diagnosis: formData.diagnosis,
      treatmentPlan: formData.treatmentPlan,
      tro: formData.tro,
      toothNumber: formData.toothNumber,
      payment: parseFloat(formData.payment),
      entryDate: formData.entryDate,
    };
  };