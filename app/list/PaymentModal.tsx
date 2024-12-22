import React, { useState } from 'react';

interface PaymentModalProps {
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

export default function PaymentModal({ onClose, onSubmit }: PaymentModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    onSubmit(paymentAmount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-96">
        <h3 className="text-xl text-black font-bold mb-4">Update Payment</h3>
        <input
          type="number"
          placeholder="Enter additional payment amount"
          className="w-full px-4 py-2 rounded-xl border text-black border-gray-200 mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700"
          >
            Update Payment
          </button>
        </div>
      </div>
    </div>
  );
}