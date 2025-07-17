import { useState } from 'react';
import {
  CustomerPaymentSummary,
  PaymentHistoryTable,
  InvoicePaymentProgress,
  PaymentReceipt,
  PaymentPlanTracker,
} from './PaymentTrackingComponents';

const mockSummary = {
  totalInvoiced: 45000,
  totalPaid: 32000,
  outstandingBalance: 13000,
  overdueAmount: 5000,
  lastPaymentDate: '2025-07-09',
  creditLimit: 60000,
  paymentMethods: ['Telebirr', 'Bank'],
};

const mockPayments = [
  {
    date: '2025-07-09',
    id: 'PAY-10234',
    invoice: 'INV-5012',
    amount: 12000,
    method: 'Telebirr',
    reference: 'TXN-ABCD1234',
    status: '✅ Confirmed',
    notes: 'Partial payment, confirmed by finance',
  },
];

const mockMilestones = [
  { title: 'Advance Payment', amount: 12000, dueDate: '2025-07-01', status: 'Paid' },
  { title: 'Delivery', amount: 18000, dueDate: '2025-07-10', status: 'Pending' },
  { title: 'Installation', amount: 15000, dueDate: '2025-07-20', status: 'Pending' },
];

const mockReceipt = {
  company: 'King\'sWood Furniture',
  date: '2025-07-09',
  amount: 12000,
  reference: 'TXN-ABCD1234',
};

export default function PaymentTrackingPage() {
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payment Tracking</h1>

      {/* Customer Payment Summary */}
      <CustomerPaymentSummary summary={mockSummary} />

      {/* Invoice Payment Progress */}
      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Invoice Payment Progress</h2>
        <InvoicePaymentProgress paid={32000} total={45000} />
      </div>

      {/* Payment History Table */}
      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Payment History</h2>
        <PaymentHistoryTable payments={mockPayments} />
      </div>

      {/* Payment Entry Form */}


      {/* Payment Plan Tracker */}
      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">Payment Plan</h2>
        <PaymentPlanTracker milestones={mockMilestones} />
      </div>

      {/* Receipt Viewer */}
      {showReceipt && (
        <div>
          <h2 className="text-lg font-semibold mt-6 mb-2">Payment Receipt</h2>
          <PaymentReceipt receipt={mockReceipt} />
        </div>
      )}
    </div>
  );
}
