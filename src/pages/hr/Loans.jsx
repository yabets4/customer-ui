// Full Loans module with Schedule Modal, Alerts, Analytics Widgets
import { useEffect, useState } from 'react';
import { PlusCircle, Trash2, AlertCircle, CalendarDays, Wallet, TrendingUp, TrendingDown, Landmark, X, FileText, Banknote, Clock, DollarSign, List, Info, CircleCheck, Hourglass, CircleSlash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to format currency
const formatCurrency = (amount) => {
  return `ETB ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Function to generate repayment schedule
const generateSchedule = (loan) => {
  const startDate = new Date(loan.startDate);
  const termMonths = parseInt(loan.term.split(' ')[0]);
  const monthlyInterestRate = loan.interestRate / 100 / 12;
  let remainingBalance = loan.amount;
  const schedule = [];

  // Assuming Equal Principal repayment for simplicity in this demo.
  // For EMI (Equal Monthly Installment), a more complex formula would be needed.
  const principalPerInstallment = loan.amount / termMonths;

  for (let i = 0; i < termMonths; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1); // Payments due at end of each month

    const interestForPeriod = remainingBalance * monthlyInterestRate;
    const totalDue = principalPerInstallment + interestForPeriod;

    // Simulate payment, reduce balance
    remainingBalance = Math.max(0, remainingBalance - principalPerInstallment);

    schedule.push({
      installmentNumber: i + 1,
      dueDate: dueDate.toISOString().split('T')[0],
      principal: principalPerInstallment,
      interest: interestForPeriod,
      totalDue: totalDue,
      balance: remainingBalance,
      status: 'Pending', // Default status
    });
  }
  return schedule;
};

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    type: 'Customer',
    name: '', amount: '', balance: '', startDate: '', dueDate: '',
    interestRate: '', purpose: '', term: '12 months', frequency: 'Monthly',
    repaymentMethod: 'Equal Principal', collateral: '', glAccount: '',
    status: 'Active' // Default status for new loan
  });
  const [showAddLoanModal, setShowAddLoanModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [scheduleModal, setScheduleModal] = useState(null); // Stores loan for which schedule is shown

  // Initial demo data loading
  useEffect(() => {
    const demo = [
      {
        id: 1, type: 'Customer', name: 'Daniel Tadesse', amount: 10000, balance: 4000,
        startDate: '2024-03-01', dueDate: '2025-03-01', interestRate: 5,
        purpose: 'Furniture Credit', term: '12 months', frequency: 'Monthly',
        repaymentMethod: 'Equal Principal', collateral: 'House Deed', glAccount: 'Accounts Receivable', status: 'Active'
      },
      {
        id: 2, type: 'Employee', name: 'Almaz Kebede', amount: 5000, balance: 5000,
        startDate: '2025-06-15', dueDate: '2025-12-15', interestRate: 3,
        purpose: 'Emergency Loan', term: '6 months', frequency: 'Monthly',
        repaymentMethod: 'Equal Principal', collateral: 'Salary Deduction', glAccount: 'Employee Loans', status: 'Active'
      },
      {
        id: 3, type: 'Company', name: 'Supplier Advance', amount: 20000, balance: 0,
        startDate: '2024-01-01', dueDate: '2024-06-01', interestRate: 0,
        purpose: 'Supply Pre-payment', term: '6 months', frequency: 'Monthly',
        repaymentMethod: 'Equal Principal', collateral: 'Goods Delivery', glAccount: 'Advances to Suppliers', status: 'Completed'
      },
    ];
    // Generate schedule for initial loans and ensure `id` is properly set
    const loansWithSchedules = demo.map((loan, index) => ({
      ...loan,
      id: loan.id || index + 1, // Ensure ID exists
      schedule: generateSchedule({ ...loan, id: loan.id || index + 1 }), // Pass id to generateSchedule
    }));
    setLoans(loansWithSchedules);
  }, []);

  // Effect to generate alerts based on loan schedules
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    const warnings = [];

    loans.forEach(loan => {
      // Find the next upcoming/overdue installment
      const relevantInstallment = loan.schedule?.find(inst => {
        const dueDate = new Date(inst.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return inst.status === 'Pending' && dueDate >= today; // Only consider pending and future/current dates
      });

      if (relevantInstallment) {
        const dueDate = new Date(relevantInstallment.dueDate);
        dueDate.setHours(0, 0, 0, 0); // Normalize due date

        if (dueDate < today) {
          // Overdue
          warnings.push({
            id: `${loan.id}-${relevantInstallment.installmentNumber}-overdue`,
            type: 'error',
            message: `Overdue: Installment ${relevantInstallment.installmentNumber} for ${loan.name} was due on ${relevantInstallment.dueDate}. Amount: ${formatCurrency(relevantInstallment.totalDue)}`,
          });
        } else {
          // Upcoming within 7 days (or whatever threshold)
          const daysUntilDue = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
          if (daysUntilDue <= 7) { // Alert if due within 7 days
            warnings.push({
              id: `${loan.id}-${relevantInstallment.installmentNumber}-upcoming`,
              type: 'warning',
              message: `Upcoming: Installment ${relevantInstallment.installmentNumber} for ${loan.name} is due on ${relevantInstallment.dueDate}. Amount: ${formatCurrency(relevantInstallment.totalDue)}`,
            });
          }
        }
      }
    });
    setAlerts(warnings);
  }, [loans]); // Re-run when loans change

  const handleAddLoan = () => {
    // Basic validation
    if (!newLoan.name || !newLoan.amount || !newLoan.startDate || !newLoan.term || !newLoan.interestRate) {
      alert('Please fill in all required fields (Name, Amount, Start Date, Term, Interest Rate).');
      return;
    }

    const id = loans.length > 0 ? Math.max(...loans.map(l => l.id)) + 1 : 1;
    const fullLoan = {
      ...newLoan,
      id,
      amount: parseFloat(newLoan.amount),
      balance: parseFloat(newLoan.amount), // New loans start with full balance
      interestRate: parseFloat(newLoan.interestRate),
    };
    fullLoan.schedule = generateSchedule(fullLoan);
    setLoans([...loans, fullLoan]);
    setNewLoan({ // Reset form
      type: 'Customer', name: '', amount: '', balance: '', startDate: '', dueDate: '',
      interestRate: '', purpose: '', term: '12 months', frequency: 'Monthly',
      repaymentMethod: 'Equal Principal', collateral: '', glAccount: '', status: 'Active'
    });
    setShowAddLoanModal(false);
  };

  const handleDeleteLoan = (id) => {
    if (window.confirm('Are you sure you want to delete this loan record? This action cannot be undone.')) {
      setLoans(loans.filter(l => l.id !== id));
    }
  };

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // --- Analytics Calculations ---
  const totalLoansCount = loans.length;
  const totalOutstandingBalance = loans.reduce((sum, l) => sum + l.balance, 0);
  const totalAmountLent = loans.reduce((sum, l) => sum + l.amount, 0);
  // Calculate total repaid (Amount Lent - Outstanding Balance for active loans, or full amount for completed)
  const totalRepaidAmount = loans.reduce((sum, l) => {
    if (l.status === 'Completed') return sum + l.amount;
    return sum + (l.amount - l.balance);
  }, 0);

  const totalOverdueInstallments = loans.reduce((sum, l) =>
    sum + l.schedule.filter(s => new Date(s.dueDate) < new Date() && s.status === 'Pending').length, 0);

  // Helper for status styling
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Defaulted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 text-gray-800 dark:text-gray-100">
          <Landmark className="text-purple-600 dark:text-purple-400 w-9 h-9" />
          Loans & Liabilities Management
        </h1>
        <button
          onClick={() => setShowAddLoanModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
        >
          <PlusCircle className="mr-2 w-5 h-5" />
          Add New Loan
        </button>
      </div>

      {/* Alerts Section */}
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center justify-between p-4 mb-6 rounded-lg shadow-md ${
              alert.type === 'error' ? 'bg-red-100 border border-red-400 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200' :
              'bg-yellow-100 border border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium text-sm">{alert.message}</p>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-current hover:opacity-75 transition-opacity"
              aria-label="Dismiss alert"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transform hover:scale-102 transition-transform duration-200">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            <List size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Loans Managed</p>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{totalLoansCount}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transform hover:scale-102 transition-transform duration-200">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Outstanding Balance</p>
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{formatCurrency(totalOutstandingBalance)}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transform hover:scale-102 transition-transform duration-200">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount Repaid</p>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(totalRepaidAmount)}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transform hover:scale-102 transition-transform duration-200">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Installments</p>
            <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">{totalOverdueInstallments}</h2>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Outstanding</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Interest Rate</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Start Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Term</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Frequency</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">GL Account</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loans.length === 0 ? (
                <tr>
                  <td colSpan="13" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No loan records found. Click "Add New Loan" to get started!
                  </td>
                </tr>
              ) : (
                loans.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{l.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{l.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(l.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600 dark:text-red-400 font-semibold">{formatCurrency(l.balance)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{l.interestRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{l.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{l.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{l.term}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{l.frequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{l.repaymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{l.glAccount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-3 justify-center">
                        <button
                          onClick={() => setScheduleModal(l)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700"
                          title="View Repayment Schedule"
                        >
                          <CalendarDays size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteLoan(l.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-700"
                          title="Delete Loan"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {scheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-gray-200 dark:border-gray-700"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                onClick={() => setScheduleModal(null)}
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <CalendarDays className="text-blue-600 dark:text-blue-400" /> Repayment Schedule: {scheduleModal.name}
              </h2>

              <div className="mb-4 text-gray-700 dark:text-gray-300 text-sm">
                <p><strong>Loan Amount:</strong> {formatCurrency(scheduleModal.amount)}</p>
                <p><strong>Interest Rate:</strong> {scheduleModal.interestRate}%</p>
                <p><strong>Term:</strong> {scheduleModal.term}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Installment</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Principal</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Interest</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Due</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Balance</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {scheduleModal.schedule?.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap">{s.installmentNumber}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">{s.dueDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatCurrency(s.principal)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatCurrency(s.interest)}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(s.totalDue)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatCurrency(s.balance)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(s.status)}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setScheduleModal(null)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Loan Modal */}
      <AnimatePresence>
        {showAddLoanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl relative border border-gray-200 dark:border-gray-700"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                onClick={() => setShowAddLoanModal(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <PlusCircle className="text-purple-600 dark:text-purple-400" /> Add New Loan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Loan Type */}
                <div>
                  <label htmlFor="loanType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loan Type</label>
                  <div className="relative">
                    <List className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <select
                      id="loanType"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.type}
                      onChange={(e) => setNewLoan({ ...newLoan, type: e.target.value })}
                    >
                      <option value="Customer">Customer</option>
                      <option value="Company">Company</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <div className="relative">
                    <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g., John Doe / Vendor XYZ"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.name}
                      onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (ETB)</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="amount"
                      type="number"
                      placeholder="e.g., 15000"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.amount}
                      onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                      min="0"
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interest Rate (%)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="interestRate"
                      type="number"
                      placeholder="e.g., 5"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.interestRate}
                      onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="startDate"
                      type="date"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.startDate}
                      onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Term */}
                <div>
                  <label htmlFor="term" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Term (e.g., "12 months")</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="term"
                      type="text"
                      placeholder="e.g., 12 months, 2 years"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.term}
                      onChange={(e) => setNewLoan({ ...newLoan, term: e.target.value })}
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purpose</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="purpose"
                      type="text"
                      placeholder="e.g., Business Expansion, Personal"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.purpose}
                      onChange={(e) => setNewLoan({ ...newLoan, purpose: e.target.value })}
                    />
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <select
                      id="frequency"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.frequency}
                      onChange={(e) => setNewLoan({ ...newLoan, frequency: e.target.value })}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Annually">Annually</option>
                    </select>
                  </div>
                </div>

                {/* Repayment Method */}
                <div>
                  <label htmlFor="repaymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repayment Method</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <select
                      id="repaymentMethod"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.repaymentMethod}
                      onChange={(e) => setNewLoan({ ...newLoan, repaymentMethod: e.target.value })}
                    >
                      <option value="Equal Principal">Equal Principal</option>
                      <option value="EMI">EMI (Equal Monthly Installment)</option>
                      <option value="Balloon">Balloon Payment</option>
                    </select>
                  </div>
                </div>

                {/* Collateral */}
                <div>
                  <label htmlFor="collateral" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collateral</label>
                  <div className="relative">
                    <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="collateral"
                      type="text"
                      placeholder="e.g., Property, Vehicle"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.collateral}
                      onChange={(e) => setNewLoan({ ...newLoan, collateral: e.target.value })}
                    />
                  </div>
                </div>

                {/* GL Account */}
                <div>
                  <label htmlFor="glAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GL Account</label>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="glAccount"
                      type="text"
                      placeholder="e.g., Loans Receivable"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.glAccount}
                      onChange={(e) => setNewLoan({ ...newLoan, glAccount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Due Date (This can be auto-calculated from StartDate and Term) */}
                {/* For now, keeping it manual as per original, but it's good to note for future improvements */}
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Due Date</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                      id="dueDate"
                      type="date"
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      value={newLoan.dueDate}
                      onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })}
                    />
                  </div>
                </div>

              </div>
              <div className="flex justify-end mt-8 gap-4">
                <button
                  onClick={() => setShowAddLoanModal(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLoan}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
                >
                  <PlusCircle className="inline-block mr-2 w-5 h-5" /> Add Loan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Loans;