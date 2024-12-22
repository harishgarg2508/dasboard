'use client';
import Navbar from '../components/navbar';
import { useState } from 'react';
import { savePatient } from '../utils/db';
import { motion } from 'framer-motion';

interface PatientFormData {
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
  paidAmount: string;
  entryDate: string;
}

export default function PatientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PatientFormData>({
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
    paidAmount: '',
    entryDate: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.name && !!formData.age && !!formData.gender && !!formData.phoneNumber && !!formData.entryDate;
      case 2:
        return !!formData.diagnosis && !!formData.treatmentPlan && !!formData.tro && !!formData.toothNumber;
      case 3:
        return !!formData.isNewPatient && !!formData.payment && !!formData.paidAmount;
      default:
        return false;
    }
  };

  const calculateRemainingBalance = () => {
    const totalAmount = parseFloat(formData.payment) || 0;
    const paidAmount = parseFloat(formData.paidAmount) || 0;
    return totalAmount - paidAmount;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      alert('Please fill all fields in this step before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Please fill all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    const patient = {
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
      paidAmount: parseFloat(formData.paidAmount),
      remainingBalance: calculateRemainingBalance(),
      paymentStatus: calculateRemainingBalance() > 0 ? 'UNPAID' : 'PAID',
      entryDate: formData.entryDate,
    };

    try {
      await savePatient(patient);
      setFormData({
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
        paidAmount: '',
        entryDate: new Date().toISOString().split('T')[0],
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingBalance = calculateRemainingBalance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <h2 className="text-3xl font-bold text-white">New Patient Registration</h2>
            <p className="text-blue-100 mt-2">Please fill in the patient information below</p>
          </div>

          <motion.form onSubmit={handleSubmit} className="p-8">
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className="flex flex-col items-center"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                    ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {step}
                  </div>
                  <span className="text-sm mt-2 text-gray-600">
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Medical Details' : 'Payment'}
                  </span>
                </div>
              ))}
            </div>

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Date</label>
                    <input
                      type="date"
                      name="entryDate"
                      value={formData.entryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                      placeholder="Enter age"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis</label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none text-black"
                    placeholder="Enter diagnosis details"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Treatment Plan</label>
                  <textarea
                    name="treatmentPlan"
                    value={formData.treatmentPlan}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none text-black"
                    placeholder="Enter treatment plan"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">TRO</label>
                    <input
                      type="text"
                      name="tro"
                      value={formData.tro}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                      placeholder="Enter TRO"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tooth Number</label>
                    <input
                      type="text"
                      name="toothNumber"
                      value={formData.toothNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                      placeholder="Enter tooth number"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Type</label>
                    <select
                      name="isNewPatient"
                      value={formData.isNewPatient}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                    >
                      <option value="true">New</option>
                      <option value="false">Old</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount</label>
                    <input
                      type="number"
                      name="payment"
                      value={formData.payment}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                      placeholder="Enter total amount"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Paid Amount</label>
                    <input
                      type="number"
                      name="paidAmount"
                      value={formData.paidAmount}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-black"
                      placeholder="Enter paid amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Remaining Balance</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={remainingBalance.toFixed(2)}
                        readOnly
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black"
                      />
                      {remainingBalance > 0 && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          UNPAID
                        </span>
                      )}
                    </div>
                    </div>
                </div>
              </motion.div>
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevious}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  Previous
                </motion.button>
              )}
              
              {currentStep < 3 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all ml-auto"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all ml-auto"
                >
                  {isSubmitting ? 'Saving...' : 'Save Patient'}
                </motion.button>
              )}
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
