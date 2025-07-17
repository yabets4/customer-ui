// pages/PayrollManagement/PayslipHistoryPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Table from '../../../components/ui/Table'; // Assuming a reusable Table component

// Lucide React Icons
import {
    FileText, ArrowLeft, User, Calendar, Filter, AlertCircle, Download, DollarSign, ListChecks
} from 'lucide-react';

const PayslipHistoryPage = () => {
    const { employeeId } = useParams(); // Get employee ID from URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterYear, setFilterYear] = useState('all');
    const [filterPayPeriod, setFilterPayPeriod] = useState('all');

    // --- Inline Mock Data for Payslips ---
    const mockPayslips = [
        {
            id: 'ps-001', employee: { id: 'emp-001', name: 'Aisha Demisse' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025', year: '2025' },
            grossPay: 45000, deductions: 6800, netPay: 38200,
            payslipUrl: '/mock-payslips/aisha_july_2025.pdf',
            issueDate: '2025-07-30'
        },
        {
            id: 'ps-002', employee: { id: 'emp-001', name: 'Aisha Demisse' },
            payPeriod: { start: '2025-06-01', end: '2025-06-30', name: 'June 2025', year: '2025' },
            grossPay: 45000, deductions: 6800, netPay: 38200,
            payslipUrl: '/mock-payslips/aisha_june_2025.pdf',
            issueDate: '2025-06-29'
        },
        {
            id: 'ps-003', employee: { id: 'emp-001', name: 'Aisha Demisse' },
            payPeriod: { start: '2025-05-01', end: '2025-05-31', name: 'May 2025', year: '2025' },
            grossPay: 45000, deductions: 6800, netPay: 38200,
            payslipUrl: '/mock-payslips/aisha_may_2025.pdf',
            issueDate: '2025-05-30'
        },
        {
            id: 'ps-004', employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025', year: '2025' },
            grossPay: 30000, deductions: 4400, netPay: 25600,
            payslipUrl: '/mock-payslips/tesfaye_july_2025.pdf',
            issueDate: '2025-07-30'
        },
        {
            id: 'ps-005', employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            payPeriod: { start: '2024-12-01', end: '2024-12-31', name: 'Dec 2024', year: '2024' },
            grossPay: 30000, deductions: 4400, netPay: 25600,
            payslipUrl: '/mock-payslips/tesfaye_dec_2024.pdf',
            issueDate: '2024-12-30'
        },
        {
            id: 'ps-006', employee: { id: 'emp-003', name: 'Sara Ali' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025', year: '2025' },
            grossPay: 28000, deductions: 4070, netPay: 23930,
            payslipUrl: '/mock-payslips/sara_july_2025.pdf',
            issueDate: '2025-07-30'
        },
    ];
    // --- End Inline Mock Data ---

    const mockYears = useMemo(() => {
        const years = new Set(mockPayslips.map(p => p.payPeriod.year));
        return [{ value: 'all', label: 'All Years' }, ...Array.from(years).sort((a, b) => b - a).map(year => ({ value: String(year), label: String(year) }))];
    }, []);

    const mockPayPeriodsForFilter = useMemo(() => {
        const periods = new Set(mockPayslips.map(p => p.payPeriod.name));
        return [{ value: 'all', label: 'All Periods' }, ...Array.from(periods).map(period => ({ value: period, label: period }))];
    }, []);

    const [employeeName, setEmployeeName] = useState('Employee'); // Default name, will be updated

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate fetching payslips for the specific employee
            const employeePayslips = mockPayslips.filter(p => p.employee.id === employeeId);
            if (employeePayslips.length > 0) {
                setEmployeeName(employeePayslips[0].employee.name);
            } else {
                setEmployeeName('Unknown Employee');
                setError('No payslips found for this employee.');
            }
            setLoading(false);
        }, 700);
    }, [employeeId]);

    const filteredPayslips = useMemo(() => {
        return mockPayslips.filter(payslip => {
            const matchesEmployee = payslip.employee.id === employeeId;
            const matchesYear = filterYear === 'all' || payslip.payPeriod.year === filterYear;
            const matchesPayPeriod = filterPayPeriod === 'all' || payslip.payPeriod.name === filterPayPeriod;

            return matchesEmployee && matchesYear && matchesPayPeriod;
        }).sort((a, b) => new Date(b.payPeriod.end) - new Date(a.payPeriod.end)); // Sort by most recent pay period
    }, [employeeId, filterYear, filterPayPeriod]);

    const payslipTableColumns = [
        { header: 'Pay Period', accessor: 'payPeriod.name' },
        { header: 'Issue Date', accessor: 'issueDate' },
        { header: 'Gross Pay', render: (row) => `ETB ${row.grossPay.toLocaleString()}` },
        { header: 'Deductions', render: (row) => `ETB ${row.deductions.toLocaleString()}` },
        { header: 'Net Pay', render: (row) => `ETB ${row.netPay.toLocaleString()}` },
        {
            header: 'Actions',
            render: (row) => (
                <a
                    href={row.payslipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                    download // Suggests download to the browser
                >
                    <Download size={16} /> Download
                </a>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FileText className="w-10 h-10 text-purple-600" /> Payslip History for {employeeName}
                </h1>
                <Link to={`/hr/employees/${employeeId}`}> {/* Link back to employee details */}
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Employee Details
                    </Button>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading payslip history...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <>
                    {/* Filter Section */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Filter by Year"
                                name="filterYear"
                                options={mockYears}
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                icon={<Calendar size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Pay Period"
                                name="filterPayPeriod"
                                options={mockPayPeriodsForFilter}
                                value={filterPayPeriod}
                                onChange={(e) => setFilterPayPeriod(e.target.value)}
                                icon={<Filter size={18} className="text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {/* Payslip List */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <ListChecks size={24} className="text-purple-500" /> Payslips for {employeeName}
                        </h2>
                        {filteredPayslips.length > 0 ? (
                            <Table columns={payslipTableColumns} data={filteredPayslips} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No payslips found for {employeeName} matching your criteria.
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default PayslipHistoryPage;
