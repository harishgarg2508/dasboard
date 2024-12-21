// config/formFields.ts

export interface FormField {
    step: number;
    name: keyof PatientFormData;
    label: string;
    type: 'text' | 'number' | 'tel' | 'select' | 'textarea' | 'date';
    placeholder?: string;
    options?: { value: string; label: string; }[];
    required?: boolean;
    cols?: number;
    rows?: number;
  }
  
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
  
  export const formFields: FormField[] = [
    {
      step: 1,
      name: 'entryDate',
      label: 'Entry Date',
      type: 'date',
      required: true
    },
    {
      step: 1,
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter patient name',
      required: true
    },
    {
      step: 1,
      name: 'age',
      label: 'Age',
      type: 'number',
      placeholder: 'Enter age',
      required: true
    },
    {
      step: 1,
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select gender' },
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
      ]
    },
    {
      step: 1,
      name: 'phoneNumber',
      label: 'Phone',
      type: 'tel',
      placeholder: 'Enter phone number',
      required: true
    },
    {
      step: 2,
      name: 'diagnosis',
      label: 'Diagnosis',
      type: 'textarea',
      placeholder: 'Enter diagnosis details',
      required: true,
      rows: 4
    },
    {
      step: 2,
      name: 'treatmentPlan',
      label: 'Treatment Plan',
      type: 'textarea',
      placeholder: 'Enter treatment plan',
      required: true,
      rows: 4
    },
    {
      step: 2,
      name: 'tro',
      label: 'TRO',
      type: 'text',
      placeholder: 'Enter TRO',
      required: true
    },
    {
      step: 2,
      name: 'toothNumber',
      label: 'Tooth Number',
      type: 'text',
      placeholder: 'Enter tooth number',
      required: true
    },
    {
      step: 3,
      name: 'isNewPatient',
      label: 'Patient Type',
      type: 'select',
      required: true,
      options: [
        { value: 'true', label: 'New' },
        { value: 'false', label: 'Old' }
      ]
    },
    {
      step: 3,
      name: 'payment',
      label: 'Payment Amount',
      type: 'number',
      placeholder: 'Enter payment amount',
      required: true
    }
  ];
  
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
    const stepFields = formFields.filter(field => field.step === step);
    return stepFields.every(field => !!formData[field.name]);
  };