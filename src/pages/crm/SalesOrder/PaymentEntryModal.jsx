import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button'; // Assuming your Button component
import {
  X, // Close icon
  DollarSign, // Amount icon
  CreditCard, // Payment method icon
  Hash, // Reference/Tx ID icon
  CalendarDays, // Payment Date icon
  PlusCircle, // Add Payment button icon
} from 'lucide-react';

export default function PaymentEntryModal({ onClose, onAddPayment }) {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'Telebirr', // Default to a common method
    reference: '',
    paymentDate: getTodayDate(), // Default to today's date
  });

  // Reset form when modal opens or component mounts (useful if modal state persists)
  useEffect(() => {
    setPaymentData({
      amount: '',
      paymentMethod: 'Telebirr',
      reference: '',
      paymentDate: getTodayDate(),
    });
  }, [onClose]); // Dependency array to re-run when onClose (implicitly, when modal state changes to open)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!paymentData.amount || paymentData.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!paymentData.paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (!paymentData.paymentDate) {
      alert("Please select a payment date.");
      return;
    }

    onAddPayment(paymentData);
    onClose(); // Close the modal after submission
  };

  const paymentMethods = ["Telebirr", "Santim Pay", "Cash", "Bank Transfer", "CBE Birr"]; // Added more options

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 transform animate-slide-up-modal">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-green-600" />
            Add Payment Entry
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={X}
            className="text-gray-500 hover:text-red-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            iconOnly
            aria-label="Close modal"
          />
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" /> Amount (ETB) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={paymentData.amount}
              onChange={handleChange}
              placeholder="e.g., 5000"
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition duration-200 ease-in-out"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" /> Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 transition duration-200 ease-in-out"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.464 7.293 5.05 8.707 9.293 12.95z"/></svg>
              </div>
            </div>
          </div>

          {/* Reference / Tx ID */}
          <div>
            <label htmlFor="reference" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-500" /> Reference / Tx ID (Optional)
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={paymentData.reference}
              onChange={handleChange}
              placeholder="e.g., TX-00391, Bank Ref: 123456"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition duration-200 ease-in-out"
            />
          </div>

          {/* Payment Date */}
          <div>
            <label htmlFor="paymentDate" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-500" /> Payment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="paymentDate"
              name="paymentDate"
              value={paymentData.paymentDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition duration-200 ease-in-out"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={PlusCircle}
            >
              Add Payment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}