import React from 'react';
import { CheckCircle, DollarSign, AlertCircle } from 'lucide-react'; // Importing icons

export const InvoicePaymentProgress = ({ paid, total }) => {
  // Ensure paid and total are numbers, default to 0 to prevent NaN
  const safePaid = parseFloat(paid) || 0;
  const safeTotal = parseFloat(total) || 0;

  // Calculate percentage, handling division by zero
  const percent = safeTotal > 0 ? Math.min(100, Math.round((safePaid / safeTotal) * 100)) : 0;
  const outstanding = safeTotal - safePaid;

  const isFullyPaid = safePaid >= safeTotal && safeTotal > 0;
  const isPartiallyPaid = safePaid > 0 && safePaid < safeTotal;
  const isUnpaid = safePaid === 0 && safeTotal > 0;

  // Determine status message and icon based on payment progress
  let statusMessage = '';
  let statusIcon = null;
  let statusColor = 'text-gray-600'; // Default color

  if (isFullyPaid) {
    statusMessage = 'Payment Complete';
    statusIcon = <CheckCircle className="w-5 h-5 text-green-600" />;
    statusColor = 'text-green-600';
  } else if (isPartiallyPaid) {
    statusMessage = 'Partial Payment Received';
    statusIcon = <AlertCircle className="w-5 h-5 text-yellow-600" />;
    statusColor = 'text-yellow-600';
  } else if (isUnpaid) {
    statusMessage = 'Awaiting Payment';
    statusIcon = <DollarSign className="w-5 h-5 text-red-600" />;
    statusColor = 'text-red-600';
  } else { // total is 0 or invalid
    statusMessage = 'N/A';
  }


  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Payment Progress</h3>
        <span className={`text-sm font-medium flex items-center gap-1 ${statusColor}`}>
          {statusIcon} {statusMessage}
        </span>
      </div>

      {/* Amounts and Percentage */}
      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {safePaid.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
          </div>
          <span className="text-sm text-gray-500">Paid of{' '}
            <span className="font-semibold text-gray-700">
              {safeTotal.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
            </span>
          </span>
        </div>
        <div className="text-3xl font-extrabold text-blue-600">
          {percent}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out
            ${isFullyPaid ? 'bg-green-500' : 'bg-blue-500'}`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      {/* Outstanding Balance */}
      { !isFullyPaid && safeTotal > 0 && (
        <div className="mt-4 text-right text-base font-semibold text-gray-700">
          Outstanding Balance:{' '}
          <span className="text-red-600">
            {outstanding.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
          </span>
        </div>
      )}
       { safeTotal === 0 && (
        <div className="mt-4 text-center text-base font-semibold text-gray-500">
          No total amount specified for this invoice.
        </div>
      )}
    </div>
  );
};