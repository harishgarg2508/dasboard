import React, { useState } from 'react';
import { Patient } from '../utils/types';

interface PaymentUpdateModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (patientId: string, newPaidAmount: number) => Promise<void>;
}

export default function PaymentUpdateModal({ patient, onClose, onUpdate }: PaymentUpdateModalProps) {
  const [paidAmount, setPaidAmount] = useState(patient.paidAmount.toString());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const amount = Number(paidAmount);
      if (isNaN(amount) || amount < 0) {
        throw new Error('Please enter a valid amount');
      }
      
      await onUpdate(patient.id, amount);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Update Payment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount: ${patient.payment}
            </label>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Paid Amount: ${patient.paidAmount}
            </label>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remaining Balance: ${patient.remainingBalance}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Paid Amount
            </label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              step="0.01"
              min="0"
              max={patient.payment}
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}