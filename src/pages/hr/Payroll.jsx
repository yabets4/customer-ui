// src/pages/hr/Payroll.jsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Eye,             // View details
  X,               // Close button
  Search,          // Search input
  Filter,          // Filter section
  CalendarDays,    // Month filter
  Banknote,        // Payment method filter, Net Pay
  DollarSign,      // Gross pay
  Users,           // Total employees
  ChevronsRight,   // Action button arrow
} from 'lucide-react'; // Importing icons from lucide-react

const mockPayrolls = [
  {
    id: 1,
    employee: 'Abebe Kebede',
    month: 'June 2025',
    gross: 12000,
    pension: 840,
    paye: 1800,
    advances: 1000,
    bonuses: 500,
    overtime: 300,
    net: 9160, // Recalculated: 12000 + 500 + 300 - 840 - 1800 - 1000 = 9160
    method: 'Bank',
    bankDetails: 'CBE - 1000123456789',
    deductions: 0, // Placeholder for other deductions
  },
  {
    id: 2,
    employee: 'Yabets Mebratu',
    month: 'June 2025',
    gross: 9500,
    pension: 665,
    paye: 1200,
    advances: 0,
    bonuses: 100, // Added a bonus
    overtime: 150,
    net: 7885, // Recalculated: 9500 + 100 + 150 - 665 - 1200 - 0 = 7885
    method: 'Telebirr',
    bankDetails: 'Telebirr - 0911223344',
    deductions: 0,
  },
  {
    id: 3,
    employee: 'Mr. X',
    month: 'June 2025',
    gross: 15000,
    pension: 1050,
    paye: 2500,
    advances: 1500,
    bonuses: 1000,
    overtime: 400,
    net: 11350, // Recalculated: 15000 + 1000 + 400 - 1050 - 2500 - 1500 = 11350
    method: 'Cash',
    bankDetails: 'N/A',
    deductions: 0,
  },
  {
    id: 4,
    employee: 'Helen Hailu',
    month: 'May 2025', // Different month
    gross: 11000,
    pension: 770,
    paye: 1500,
    advances: 500,
    bonuses: 0,
    overtime: 200,
    net: 8430, // Recalculated
    method: 'Bank',
    bankDetails: 'Awash Bank - 001122334455',
    deductions: 0,
  },
  {
    id: 5,
    employee: 'Kebede Alamu',
    month: 'May 2025', // Different month
    gross: 8000,
    pension: 560,
    paye: 900,
    advances: 0,
    bonuses: 0,
    overtime: 50,
    net: 6590, // Recalculated
    method: 'Bank',
    bankDetails: 'Dashen Bank - 998877665544',
    deductions: 0,
  },
];

const formatCurrency = (amount) => {
  return `ETB ${amount.toLocaleString()}`;
};

const Payroll = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [payrolls] = useState(mockPayrolls);
  // We no longer need `selectedPayroll` state as we are navigating to a new page
  // const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [minNetPay, setMinNetPay] = useState('');
  const [maxNetPay, setMaxNetPay] = useState('');
  const [monthFilter, setMonthFilter] = useState('All');

  // Derive unique months and payment methods from data
  const availableMonths = useMemo(() => {
    const months = [...new Set(payrolls.map(p => p.month))];
    // Sort months, e.g., chronologically if they include year, or by a custom order
    // For simplicity, a reverse string sort if year is part of the month name
    return months.sort((a, b) => b.localeCompare(a));
  }, [payrolls]);

  const availablePaymentMethods = useMemo(() => {
    return [...new Set(payrolls.map(p => p.method))];
  }, [payrolls]);

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter(p => {
      const matchesText =
        p.employee.toLowerCase().includes(filterText.toLowerCase()) ||
        p.month.toLowerCase().includes(filterText.toLowerCase());
      const matchesPayment = paymentMethodFilter ? p.method === paymentMethodFilter : true;
      const matchesMin = minNetPay !== '' ? p.net >= parseFloat(minNetPay) : true;
      const matchesMax = maxNetPay !== '' ? p.net <= parseFloat(maxNetPay) : true;
      const matchesMonth = monthFilter === 'All' || p.month === monthFilter;

      return matchesText && matchesPayment && matchesMin && matchesMax && matchesMonth;
    });
  }, [payrolls, filterText, paymentMethodFilter, minNetPay, maxNetPay, monthFilter]);

  // Calculate summary statistics
  const totalEmployeesPaid = filteredPayrolls.length;
  const totalGrossPay = filteredPayrolls.reduce((sum, p) => sum + p.gross, 0);
  const totalNetPay = filteredPayrolls.reduce((sum, p) => sum + p.net, 0);
  const avgNetPay = totalEmployeesPaid > 0 ? (totalNetPay / totalEmployeesPaid) : 0;

  const clearFilters = () => {
    setFilterText('');
    setPaymentMethodFilter('');
    setMinNetPay('');
    setMaxNetPay('');
    setMonthFilter('All');
  };

  const handleViewDetails = (id) => {
    navigate(`/hr/payroll/${id}`); // Redirect to the detail page
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <Banknote className="text-green-600 dark:text-green-400 w-9 h-9" />
        Payroll Register
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02] duration-200">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Employees Paid</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{totalEmployeesPaid}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02] duration-200">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Gross Pay</p>
            <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{formatCurrency(totalGrossPay)}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02] duration-200">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
            <Banknote size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Net Pay</p>
            <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(totalNetPay)}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02] duration-200">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Net Pay</p>
            <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">{formatCurrency(avgNetPay.toFixed(2))}</h3>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Filter size={20} className="text-blue-500 dark:text-blue-400" /> Filter Payrolls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search employee or month..."
              className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div className="relative">
            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <select
              className="appearance-none pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-10"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="">All Payment Methods</option>
              {availablePaymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <select
              className="appearance-none pl-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-10"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="All">All Months</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <input
            type="number"
            placeholder="Min Net Pay"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={minNetPay}
            onChange={(e) => setMinNetPay(e.target.value)}
            min="0"
          />
          <input
            type="number"
            placeholder="Max Net Pay"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={maxNetPay}
            onChange={(e) => setMaxNetPay(e.target.value)}
            min="0"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gross Pay</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bonuses</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Overtime</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pension</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PAYE</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Advances</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Net Pay</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayrolls.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No payroll records found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPayrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{p.employee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{p.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{formatCurrency(p.gross)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{formatCurrency(p.bonuses)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{formatCurrency(p.overtime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{formatCurrency(p.pension)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{formatCurrency(p.paye)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{formatCurrency(p.advances)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600 dark:text-green-400">{formatCurrency(p.net)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{p.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDetails(p.id)} // Call handleViewDetails with id
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center mx-auto text-sm font-medium transition-colors duration-200 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* The Detail Modal is removed since we are navigating to a new page */}
      {/* <AnimatePresence>
        {selectedPayroll && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative border border-gray-200 dark:border-gray-700"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                onClick={() => setSelectedPayroll(null)}
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <Banknote className="text-green-600 dark:text-green-400" /> Payslip: {selectedPayroll.employee}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-base">
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Payroll Period</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedPayroll.month}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Gross Salary</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(selectedPayroll.gross)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Bonuses</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(selectedPayroll.bonuses)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Overtime Pay</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(selectedPayroll.overtime)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Pension Contribution</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(selectedPayroll.pension)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">PAYE Tax</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(selectedPayroll.paye)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Advances</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{formatCurrency(selectedPayroll.advances)}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Net Pay</p>
                  <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{formatCurrency(selectedPayroll.net)}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedPayroll.method}</p>
                </div>
                {selectedPayroll.method === 'Bank' && (
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Bank Details</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedPayroll.bankDetails}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedPayroll(null)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default Payroll;