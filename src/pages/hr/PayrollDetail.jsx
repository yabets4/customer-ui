// src/pages/hr/PayrollDetail.jsx
import { useState } from 'react';
import {
  Wallet,          // For basic salary/earnings
  Banknote,        // For net pay/bank details
  TrendingUp,      // For gross pay / earnings summary
  TrendingDown,    // For deductions summary
  Calendar,        // For month
  User,            // For employee
  Coins,           // For pension/PAYE
  CreditCard,      // For advances/deductions
  FileText,        // For general document/report
} from 'lucide-react'; // Importing icons from lucide-react

const PayrollDetail = () => {
  const [payroll] = useState({
    employee: 'Abebe Kebede',
    employeeId: 'EMP001',
    month: 'June 2025',
    basicSalary: 10000,
    allowances: 2000,
    bonuses: 1500, // Added a bonus for more dynamic data
    overtime: 500,
    pension: 840,
    paye: 1800,
    advances: 1000,
    otherDeductions: 250, // Renamed 'deductions' to 'otherDeductions' for clarity
    gross: 14000, // Updated gross based on new bonus
    net: 10110,   // Updated net based on new bonus and other deductions
    bank: 'Commercial Bank of Ethiopia',
    accountNumber: '1000123456789',
    paymentDate: '2025-06-28',
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <FileText className="text-blue-600 dark:text-blue-400 w-9 h-9" />
          Payroll Details
        </h1>
        {/* You could add an Export PDF button here if needed */}
        {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <Download size={20} /> Export Payslip
        </button> */}
      </div>

      {/* Employee and Month Overview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-lg">
          <div className="flex items-center gap-3">
            <User className="text-purple-500 dark:text-purple-400" size={24} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Employee Name</p>
              <p className="font-semibold">{payroll.employee}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="text-emerald-500 dark:text-emerald-400" size={24} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Payroll Month</p>
              <p className="font-semibold">{payroll.month}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 col-span-1 md:col-span-2">
            <Banknote className="text-orange-500 dark:text-orange-400" size={24} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Bank Account</p>
              <p className="font-semibold">{payroll.bank} - {payroll.accountNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings and Deductions Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Earnings Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
            <TrendingUp size={24} /> Earnings Summary
          </h2>
          <ul className="space-y-4 text-base">
            <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Basic Salary:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">ETB {payroll.basicSalary.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Allowances:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">ETB {payroll.allowances.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Bonuses:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">ETB {payroll.bonuses.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Overtime:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">ETB {payroll.overtime.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center pt-4 border-t-2 border-green-200 dark:border-green-700">
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Gross Pay:</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">ETB {payroll.gross.toLocaleString()}</span>
            </li>
          </ul>
        </div>

        {/* Deductions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
            <TrendingDown size={24} /> Deductions Summary
          </h2>
          <ul className="space-y-4 text-base">
            <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Pension Contribution:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">ETB {payroll.pension.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">PAYE Tax:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">ETB {payroll.paye.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Advances:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">ETB {payroll.advances.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">Other Deductions:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">ETB {payroll.otherDeductions.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center pt-4 border-t-2 border-red-200 dark:border-red-700">
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Total Deductions:</span>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                ETB {(payroll.pension + payroll.paye + payroll.advances + payroll.otherDeductions).toLocaleString()}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Net Pay Card */}
      <div className="bg-blue-600 dark:bg-blue-800 rounded-xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white text-center md:text-left">
        <div className="flex items-center gap-4">
          <Banknote className="w-12 h-12 flex-shrink-0" />
          <div>
            <p className="text-blue-200 dark:text-blue-300 text-base font-medium">Your Net Pay for {payroll.month}</p>
            <h3 className="text-5xl font-extrabold mt-1">ETB {payroll.net.toLocaleString()}</h3>
          </div>
        </div>
        <div className="text-blue-100 dark:text-blue-200 text-sm">
          <p>Payment Date: <span className="font-semibold">{payroll.paymentDate}</span></p>
          <p>Employee ID: <span className="font-semibold">{payroll.employeeId}</span></p>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetail;