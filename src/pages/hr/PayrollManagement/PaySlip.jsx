// pages/PayrollManagement/PayslipPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    AlertCircle, ArrowLeft, Printer, DollarSign, User, Calendar, Briefcase, Building2,
    Banknote, TrendingUp, TrendingDown, Info, FileText, CheckCircle, XCircle, Download,
    CreditCard
} from 'lucide-react';

const PayslipPage = () => {
    // Get payslip ID from URL parameters
    const { id } = useParams();
    const [payslip, setPayslip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Inline Mock Payslip Data ---
    const mockPayslips = [
        {
            id: 'pay-001',
            employeeId: 'emp-001',
            payPeriodId: 'July 2025',
            employee: { id: 'emp-001', name: 'Aisha Demisse', jobTitle: 'Senior HR Manager', department: 'HR' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025' },
            earnings: {
                baseSalary: 45000,
                overtime: 0,
                bonus: 2000,
                allowances: 1500,
            },
            deductions: {
                incomeTax: 4500,
                socialSecurity: 1800,
                pension: 1000,
                loanRepayment: 500, // Loan deduction
                other: 200,
            },
            netPay: 40400, // 45000 + 2000 + 1500 - (4500 + 1800 + 1000 + 500 + 200) = 48500 - 8000 = 40500
            paymentDate: '2025-07-31',
            status: 'Paid',
            bankAccount: '1000123456789 (Commercial Bank of Ethiopia)',
        },
        {
            id: 'pay-002',
            employeeId: 'emp-002',
            payPeriodId: 'July 2025',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre', jobTitle: 'Software Engineer', department: 'IT' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025' },
            earnings: {
                baseSalary: 30000,
                overtime: 500,
                bonus: 0,
                allowances: 1000,
            },
            deductions: {
                incomeTax: 3000,
                socialSecurity: 1200,
                pension: 800,
                loanRepayment: 0, // No loan deduction for this payslip
                other: 100,
            },
            netPay: 26400, // 30000 + 500 + 1000 - (3000 + 1200 + 800 + 100) = 31500 - 5100 = 26400
            paymentDate: '2025-07-31',
            status: 'Paid',
            bankAccount: '1000987654321 (Awash Bank)',
        },
        {
            id: 'pay-003',
            employeeId: 'emp-001',
            payPeriodId: 'June 2025',
            employee: { id: 'emp-001', name: 'Aisha Demisse', jobTitle: 'Senior HR Manager', department: 'HR' },
            payPeriod: { start: '2025-06-01', end: '2025-06-30', name: 'June 2025' },
            earnings: {
                baseSalary: 45000,
                overtime: 0,
                bonus: 0,
                allowances: 1500,
            },
            deductions: {
                incomeTax: 4500,
                socialSecurity: 1800,
                pension: 1000,
                loanRepayment: 500,
                other: 200,
            },
            netPay: 38500,
            paymentDate: '2025-06-30',
            status: 'Paid',
            bankAccount: '1000123456789 (Commercial Bank of Ethiopia)',
        },
    ];
    // --- End Inline Mock Payslip Data ---

    useEffect(() => {
        const fetchPayslip = async () => {
            setLoading(true);
            setError(null);
            try {
                // Simulate API call with a delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Find payslip by its ID
                const data = mockPayslips.find((p) => p.id === id);

                if (data) {
                    setPayslip(data);
                } else {
                    setError('Payslip not found with the provided ID.');
                }
            } catch (err) {
                setError('Failed to load payslip details. Please try again later.');
                console.error('Error fetching payslip details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPayslip();
    }, [id]); // Re-fetch if ID changes

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // In a real application, this would trigger a backend endpoint
        // to generate and serve a PDF or other document format.
        // For this mock, we'll just log to console.
        console.log(`Downloading payslip for ID: ${payslip.id}`);
        // Using a custom message box instead of alert()
        const messageBox = document.createElement('div');
        messageBox.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'; // Added p-4 for mobile padding
        messageBox.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto w-full">
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Download Initiated!</p>
                <p class="text-gray-700 dark:text-gray-300 mb-6">Check console for mock action. In a real app, a PDF would download.</p>
                <button id="closeMessageBox" class="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto">OK</button>
            </div>
        `;
        document.body.appendChild(messageBox);
        document.getElementById('closeMessageBox').onclick = () => document.body.removeChild(messageBox);
    };


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black p-4">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading payslip...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen container mx-auto p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex flex-col sm:flex-row items-center text-center sm:text-left">
                    <AlertCircle className="mb-3 sm:mb-0 sm:mr-3 text-red-500 dark:text-red-300" size={24} />
                    <div>
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline sm:ml-2 mt-2 sm:mt-0">{error}</span>
                    </div>
                </div>
                <Link to="/payroll-processing">
                    <Button variant="secondary" className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Payroll
                    </Button>
                </Link>
            </div>
        );
    }

    if (!payslip) {
        return (
            <div className="min-h-screen container mx-auto p-6 text-center flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex flex-col sm:flex-row items-center text-center sm:text-left">
                    <Info className="mb-3 sm:mb-0 sm:mr-3 text-yellow-500 dark:text-yellow-300" size={24} />
                    <div>
                        <strong className="font-bold">Information:</strong>
                        <span className="block sm:inline sm:ml-2 mt-2 sm:mt-0">Payslip data could not be loaded or does not exist.</span>
                    </div>
                </div>
                <Link to="/payroll-processing">
                    <Button variant="secondary" className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Payroll
                    </Button>
                </Link>
            </div>
        );
    }

    // Calculate total earnings and deductions
    const totalEarnings = Object.values(payslip.earnings).reduce((sum, val) => sum + val, 0);
    const totalDeductions = Object.values(payslip.deductions).reduce((sum, val) => sum + val, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 print:hidden max-w-screen-xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3 sm:gap-4">
                    <DollarSign className="w-9 h-9 sm:w-11 sm:h-11 text-green-600 dark:text-green-400" /> Payslip
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Button
                        variant="primary"
                        onClick={handlePrint}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                        <Printer size={20} /> Print Payslip
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                        <Download size={20} /> Download PDF
                    </Button>
                    <Link to="/payroll-processing" className="w-full">
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <ArrowLeft size={20} /> Back to Payroll
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Payslip Content */}
            <Card className="p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="mb-4 sm:mb-0">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payslip</h2>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">For the period: <span className="font-semibold">{payslip.payPeriod.name}</span></p>
                        <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400">Payment Date: {payslip.paymentDate}</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Company Name</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">123 Main Street, Addis Ababa</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">info@company.com</p>
                    </div>
                </div>

                {/* Employee Details */}
                <div className="mb-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 shadow-inner">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <User size={20} className="text-blue-600 dark:text-blue-400" /> Employee Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <PayslipDetailItem label="Employee Name" value={payslip.employee.name} icon={<User size={16} />} />
                        <PayslipDetailItem label="Job Title" value={payslip.employee.jobTitle} icon={<Briefcase size={16} />} />
                        <PayslipDetailItem label="Department" value={payslip.employee.department} icon={<Building2 size={16} />} />
                        <PayslipDetailItem label="Employee ID" value={payslip.employee.id} icon={<Info size={16} />} />
                        <PayslipDetailItem label="Bank Account" value={payslip.bankAccount} icon={<Banknote size={16} />} />
                    </div>
                </div>

                {/* Loan Deduction Metric Card (New Section) */}
                {payslip.deductions.loanRepayment > 0 && (
                    <Card className="p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                <CreditCard size={24} sm:size={28} className="text-purple-600 dark:text-purple-400" />
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Loan Repayment</h3>
                            </div>
                            <p className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-300">
                                - ETB {payslip.deductions.loanRepayment.toLocaleString()}
                            </p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            This amount has been deducted for loan repayment this period.
                        </p>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
                    {/* Earnings */}
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg border border-green-200 dark:border-green-700 shadow-md">
                        <h3 className="text-lg sm:text-xl font-bold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-green-600 dark:text-green-300" /> Earnings
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(payslip.earnings).map(([key, value]) => (
                                <PayslipDetailItem key={key} label={formatLabel(key)} value={`ETB ${value.toLocaleString()}`} />
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-green-300 dark:border-green-700 flex justify-between items-center">
                            <p className="text-base sm:text-lg font-bold text-green-800 dark:text-green-200">Total Earnings:</p>
                            <p className="text-base sm:text-lg font-bold text-green-800 dark:text-green-200">ETB {totalEarnings.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 rounded-lg border border-red-200 dark:border-red-700 shadow-md">
                        <h3 className="text-lg sm:text-xl font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                            <TrendingDown size={20} className="text-red-600 dark:text-red-300" /> Deductions
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(payslip.deductions).map(([key, value]) => (
                                <PayslipDetailItem key={key} label={formatLabel(key)} value={`ETB ${value.toLocaleString()}`} />
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-red-300 dark:border-red-700 flex justify-between items-center">
                            <p className="text-base sm:text-lg font-bold text-red-800 dark:text-red-200">Total Deductions:</p>
                            <p className="text-base sm:text-lg font-bold text-red-800 dark:text-red-200">ETB {totalDeductions.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Net Pay */}
                <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 rounded-2xl shadow-2xl text-center text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                        <DollarSign size={24} sm:size={28} className="text-white" /> Net Pay
                    </h3>
                    <p className="text-5xl sm:text-6xl font-extrabold leading-tight">ETB {payslip.netPay.toLocaleString()}</p>
                    <p className="text-base sm:text-lg opacity-90 mt-3">This is the total amount paid to the employee after all deductions.</p>
                </div>
            </Card>
        </div>
    );
};

// Helper component for consistent detail item display within payslip sections
const PayslipDetailItem = ({ icon, label, value }) => (
    <div className="flex justify-between items-center text-sm sm:text-base">
        <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
            {icon} <span className="font-medium">{label}</span>:
        </p>
        <p className="font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
);

// Helper function to format labels (e.g., "incomeTax" to "Income Tax")
const formatLabel = (str) => {
    return str
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (char) => char.toUpperCase()) // Capitalize the first letter
        .trim();
};

export default PayslipPage;