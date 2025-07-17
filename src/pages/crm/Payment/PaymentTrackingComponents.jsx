import {
  ReceiptText, ChevronDown ,Banknote,Clock, XCircle, ListChecks,
  Wallet, AlertTriangle,
  CalendarCheck,
  CreditCard,
  CircleCheck, // For success states
  CircleAlert, // For warning states
  CircleDollarSign,
  CircleX,
  Hourglass,
  Info,
  History,
  CheckCircle2,
  User,
  FileText,
  DollarSign,
  Hash,
  Calendar,
  UploadCloud,
  FilePenLine, // For notes/textarea
  Send,
  CheckCircle,
  Building,
  CalendarDays,
  Download,
  Printer,
} from "lucide-react"; // Import necessary icons

// Helper component for a single statistic card
const StatCard = ({ title, value, icon: Icon, type = 'default' }) => {
  let bgColorClass = "bg-white";
  let textColorClass = "text-gray-800";
  let iconColorClass = "text-gray-500";
  let borderColorClass = "border-gray-200";
  let shadowClass = "shadow-md";

  switch (type) {
    case 'invoiced':
      bgColorClass = "bg-blue-50";
      borderColorClass = "border-blue-200";
      iconColorClass = "text-blue-600";
      textColorClass = "text-blue-800";
      shadowClass = "shadow-lg";
      break;
    case 'paid':
      bgColorClass = "bg-green-50";
      borderColorClass = "border-green-200";
      iconColorClass = "text-green-600";
      textColorClass = "text-green-800";
      shadowClass = "shadow-lg";
      break;
    case 'outstanding':
      bgColorClass = "bg-yellow-50";
      borderColorClass = "border-yellow-200";
      iconColorClass = "text-yellow-600";
      textColorClass = "text-yellow-800";
      shadowClass = "shadow-lg";
      break;
    case 'overdue':
      bgColorClass = "bg-red-50";
      borderColorClass = "border-red-200";
      iconColorClass = "text-red-600";
      textColorClass = "text-red-800";
      shadowClass = "shadow-lg";
      break;
    case 'info':
      bgColorClass = "bg-gray-50";
      borderColorClass = "border-gray-200";
      iconColorClass = "text-gray-500";
      textColorClass = "text-gray-700";
      shadowClass = "shadow-md";
      break;
    case 'credit':
      bgColorClass = "bg-indigo-50";
      borderColorClass = "border-indigo-200";
      iconColorClass = "text-indigo-600";
      textColorClass = "text-indigo-800";
      shadowClass = "shadow-lg";
      break;
    default:
      break;
  }

  return (
    <div className={`p-5 rounded-xl border ${borderColorClass} ${bgColorClass} ${shadowClass} transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-medium ${textColorClass} opacity-80`}>{title}</h3>
        {Icon && <Icon className={`w-6 h-6 ${iconColorClass}`} />}
      </div>
      <div className={`text-2xl font-bold ${textColorClass}`}>{value}</div>
    </div>
  );
};

export const CustomerPaymentSummary = ({ summary }) => {
  const {
    totalInvoiced,
    totalPaid,
    outstandingBalance,
    overdueAmount,
    lastPaymentDate,
    creditLimit,
    // paymentMethods, // Not used in the original UI, but could be added as a separate section
  } = summary;

  // Helper to format currency
  const formatCurrency = (amount) => {
    return amount != null ? `ETB ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <CreditCard className="w-7 h-7 text-blue-600" />
        Customer Payment Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Invoiced"
          value={formatCurrency(totalInvoiced)}
          icon={ReceiptText}
          type="invoiced"
        />
        <StatCard
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          icon={Banknote}
          type="paid"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(outstandingBalance)}
          icon={Wallet}
          type="outstanding"
        />
        <StatCard
          title="Overdue Amount"
          value={overdueAmount > 0 ? formatCurrency(overdueAmount) : "ETB 0.00"}
          icon={AlertTriangle}
          type={overdueAmount > 0 ? "overdue" : "paid"} // Change type if no overdue
        />
        <StatCard
          title="Last Payment Date"
          value={lastPaymentDate || 'N/A'}
          icon={CalendarCheck}
          type="info"
        />
        <StatCard
          title="Credit Limit"
          value={creditLimit ? formatCurrency(creditLimit) : 'N/A'}
          icon={CreditCard}
          type="credit"
        />
      </div>
    </div>
  );
};

// 2. PaymentHistoryTable.jsx
export const PaymentHistoryTable = ({ payments }) => {
  const getStatusBadge = (status) => {
    let bgColor = '';
    let textColor = '';
    let Icon = null;

    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        Icon = CircleCheck;
        break;
      case 'pending':
      case 'in progress':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        Icon = Hourglass;
        break;
      case 'failed':
      case 'cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        Icon = CircleX;
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-700';
        Icon = Info;
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return amount != null ? `ETB ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <History className="w-7 h-7 text-blue-600" />
        Payment History
      </h2>
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Invoice #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Method
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Reference
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No payment history available.
                </td>
              </tr>
            ) : (
              payments.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{p.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{p.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{p.invoice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{p.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.reference || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(p.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{p.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. InvoicePaymentProgress.jsx
export const InvoicePaymentProgress = ({ paid, total }) => {
  const percent = Math.min(100, Math.round((paid / total) * 100));

  const remaining = total - paid;

  // Determine status and associated color for the progress bar
  let progressBarColor = 'bg-gradient-to-r from-blue-400 to-blue-600'; // Default to blue for general progress
  let statusText = 'Payment in Progress';
  let statusIcon = <CircleDollarSign className="w-5 h-5 text-blue-500" />;

  if (percent === 100) {
    progressBarColor = 'bg-gradient-to-r from-green-400 to-green-600';
    statusText = 'Payment Completed!';
    statusIcon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
  } else if (percent > 0) {
    progressBarColor = 'bg-gradient-to-r from-yellow-400 to-orange-500'; // More vibrant for partial
  } else {
    progressBarColor = 'bg-gray-400'; // Gray if no payment made yet
    statusText = 'No Payment Received';
    statusIcon = <CircleDollarSign className="w-5 h-5 text-gray-500" />;
  }

  // Helper to format currency
  const formatCurrency = (amount) => {
    return `ETB ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          {statusIcon}
          {statusText}
        </h3>
        <span className={`text-2xl font-bold ${percent === 100 ? 'text-green-600' : 'text-blue-600'}`}>
          {percent}%
        </span>
      </div>

      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden shadow-inner">
        <div
          className={`${progressBarColor} h-full rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      <div className="flex justify-between text-sm mt-3 text-gray-600 font-medium">
        <span><strong className="text-gray-800">{formatCurrency(paid)}</strong> paid</span>
        <span><strong className="text-gray-800">{formatCurrency(remaining)}</strong> remaining</span>
        <span>Total: <strong className="text-gray-800">{formatCurrency(total)}</strong></span>
      </div>
    </div>
  );
};

// 4. PaymentEntryForm.jsx


// 5. PaymentReceipt.jsx
export const PaymentReceipt = ({ receipt }) => {
  const { company, date, amount, reference, customerName, invoiceNumber, paymentMethod } = receipt;

  // Helper to format currency
  const formatCurrency = (value) => {
    return value != null ? `ETB ${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-lg mx-auto my-8">
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mb-3 animate-bounce-in" /> {/* Added a subtle animation class */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Confirmed!</h2>
        <p className="text-gray-600">Your payment has been successfully processed.</p>
      </div>

      <div className="border-t border-b border-gray-200 py-6 mb-6 space-y-4">
        {/* Company Logo Placeholder */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-semibold border border-gray-200">
            Company Logo
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
          <div className="flex items-center gap-3">
            <ReceiptText className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Invoice #</p>
              <p className="font-semibold text-gray-800">{invoiceNumber || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Customer</p>
              <p className="font-semibold text-gray-800">{customerName || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Payment Date</p>
              <p className="font-semibold text-gray-800">{date || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Reference ID</p>
              <p className="font-semibold text-gray-800">{reference || 'N/A'}</p>
            </div>
          </div>
           <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Method</p>
              <p className="font-semibold text-gray-800">{paymentMethod || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
        <p className="text-lg text-blue-700 font-semibold mb-2">Total Amount Paid</p>
        <p className="text-5xl font-extrabold text-blue-800">
          {formatCurrency(amount)}
        </p>
      </div>

      <p className="text-center text-gray-600 mt-6 text-base leading-relaxed">
        Thank you for your payment! Your business is highly valued.
        For any inquiries, please contact our support team.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button
          onClick={() => window.print()} // Basic print functionality
          className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold
                     hover:bg-gray-100 shadow-sm transition-all duration-200"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Receipt
        </button>
        <button
          onClick={() => alert('Download PDF functionality to be implemented!')} // Placeholder for PDF download
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold
                     hover:bg-blue-700 shadow-md transition-all duration-200"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </button>
      </div>
    </div>
      );
};

// 6. PaymentPlanTracker.jsx
export const PaymentPlanTracker = ({ milestones }) => {
  // Helper to format currency
  const formatCurrency = (amount) => {
    return amount != null ? `ETB ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
  };

  // Helper to get status badge styling and icon
  const getStatusInfo = (status, dueDate) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-700';
    let Icon = Info;
    let daysDiff = null;
    let dueStatusText = '';

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (status.toLowerCase()) {
      case 'paid':
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        Icon = CheckCircle;
        dueStatusText = 'Completed';
        break;
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        Icon = Clock;
        if (daysDiff > 0) {
          dueStatusText = `Due in ${daysDiff} days`;
        } else if (daysDiff === 0) {
          dueStatusText = 'Due Today';
        } else {
          dueStatusText = `Overdue by ${Math.abs(daysDiff)} days`;
          bgColor = 'bg-red-100';
          textColor = 'text-red-700';
          Icon = XCircle;
        }
        break;
      case 'overdue': // Explicitly handled if status is directly 'overdue'
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        Icon = XCircle;
        dueStatusText = `Overdue by ${Math.abs(daysDiff > 0 ? 0 : daysDiff)} days`; // Ensure overdue is correct
        break;
      default:
        // Default for any other status not explicitly defined
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        Icon = Info;
        dueStatusText = '';
        break;
    }

    return { bgColor, textColor, Icon, dueStatusText };
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ListChecks className="w-7 h-7 text-blue-600" />
        Payment Plan Tracker
      </h2>
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No payment milestones defined.</div>
        ) : (
          milestones.map((m, idx) => {
            const { bgColor, textColor, Icon, dueStatusText } = getStatusInfo(m.status, m.dueDate);
            const isOverdue = m.status.toLowerCase() === 'pending' && new Date(m.dueDate) < new Date();

            return (
              <div
                key={idx}
                className={`flex items-center p-5 rounded-xl border-2 ${isOverdue ? 'border-red-300' : 'border-gray-200'}
                            bg-white shadow-sm hover:shadow-md transition-all duration-200 ease-in-out`}
              >
                <div className={`flex-shrink-0 p-3 rounded-full ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{m.title}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
                      <Icon className="w-4 h-4 mr-1.5" />
                      {m.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 text-sm">
                    <span className="font-medium flex items-center gap-1">
                      <CircleDollarSign className="w-4 h-4 text-gray-500" />
                      {formatCurrency(m.amount)}
                    </span>
                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      <CalendarDays className="w-4 h-4" />
                      Due {m.dueDate} ({dueStatusText})
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};