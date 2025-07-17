// pages/PayrollManagement/PayrollProcessingPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Table from '../../../components/ui/Table'; // Assuming a reusable Table component

// Lucide React Icons
import {
    DollarSign, ArrowLeft, User, Calendar, Search, Filter, CheckCircle, XCircle,
    AlertCircle, ListChecks, FileText, TrendingUp, TrendingDown, Building2, ReceiptText // Added ReceiptText for payslip
} from 'lucide-react';

const PayrollProcessingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmployeeId, setFilterEmployeeId] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterPayPeriod, setFilterPayPeriod] = useState(''); // e.g., "July 2025"
    const [filterStatus, setFilterStatus] = useState('all'); // Default to show pending payrolls

    // --- Inline Mock Data for Payroll Entries ---
    const mockPayrollEntries = [
        {
            id: 'pay-001',
            employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025' },
            grossPay: 45000,
            deductions: { tax: 4500, socialSecurity: 1800, other: 500 },
            netPay: 38200,
            status: 'Processed', // Pending, Processed, Approved, Rejected
            processedDate: null,
            approvedBy: null,
        },
        {
            id: 'pay-002',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025' },
            grossPay: 30000,
            deductions: { tax: 3000, socialSecurity: 1200, other: 200 },
            netPay: 25600,
            status: 'Pending',
            processedDate: null,
            approvedBy: null,
        },
        {
            id: 'pay-003',
            employee: { id: 'emp-003', name: 'Sara Ali', department: 'Operations' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025' },
            grossPay: 28000,
            deductions: { tax: 2800, socialSecurity: 1120, other: 150 },
            netPay: 23930,
            status: 'Processed',
            processedDate: '2025-07-28',
            approvedBy: null,
        },
        {
            id: 'pay-004',
            employee: { id: 'emp-004', name: 'Kebede Worku', department: 'Finance' },
            payPeriod: { start: '2025-06-01', end: '2025-06-30', name: 'June 2025' },
            grossPay: 35000,
            deductions: { tax: 3500, socialSecurity: 1400, other: 300 },
            netPay: 29800,
            status: 'Approved',
            processedDate: '2025-06-25',
            approvedBy: 'John Smith',
        },
        {
            id: 'pay-005',
            employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
            payPeriod: { start: '2025-06-01', end: '2025-06-30', name: 'June 2025' },
            grossPay: 45000,
            deductions: { tax: 4500, socialSecurity: 1800, other: 500 },
            netPay: 38200,
            status: 'Approved',
            processedDate: '2025-06-25',
            approvedBy: 'Jane Doe',
        },
        {
            id: 'pay-006',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
            payPeriod: { start: '2025-06-01', end: '2025-06-30', name: 'June 2025' },
            grossPay: 30000,
            deductions: { tax: 3000, socialSecurity: 1200, other: 200 },
            netPay: 25600,
            status: 'Rejected',
            processedDate: '2025-06-26',
            approvedBy: 'John Smith',
        },
        {
            id: 'pay-007',
            employee: { id: 'emp-007', name: 'Sara Ali', department: 'Operations' },
            payPeriod: { start: '2025-07-01', end: '2025-07-31', name: 'July 2025' },
            grossPay: 28000,
            deductions: { tax: 2800, socialSecurity: 1120, other: 150 },
            netPay: 23930,
            status: 'Processed', // ✅ Change to Processed or Approved
            processedDate: '2025-07-28',
            approvedBy: null,
}

    ];
    // --- End Inline Mock Data ---

    const mockEmployeesForFilter = [
        { value: '', label: 'All Employees' },
        { value: 'emp-001', label: 'Aisha Demisse' },
        { value: 'emp-002', label: 'Tesfaye Gebre' },
        { value: 'emp-003', label: 'Sara Ali' },
        { value: 'emp-004', label: 'Kebede Worku' },
        
    ];

    const mockDepartmentsForFilter = [
        { value: '', label: 'All Departments' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
    ];

    const mockPayPeriods = [
        { value: '', label: 'All Pay Periods' },
        { value: 'July 2025', label: 'July 2025' },
        { value: 'June 2025', label: 'June 2025' },
        { value: 'May 2025', label: 'May 2025' },
    ];

    const payrollStatuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Processed', label: 'Processed' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' },
    ];

    const [payrolls, setPayrolls] = useState(mockPayrollEntries); // State to hold payroll entries

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate data fetch
            setLoading(false);
        }, 700);
    }, []);

    const filteredPayrolls = useMemo(() => {
        return payrolls.filter(entry => {
            const matchesSearchTerm = searchTerm.trim() === '' ||
                entry.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.payPeriod.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEmployee = filterEmployeeId === '' || entry.employee.id === filterEmployeeId;
            const matchesDepartment = filterDepartment === '' || entry.employee.department === filterDepartment;
            const matchesPayPeriod = filterPayPeriod === '' || entry.payPeriod.name === filterPayPeriod;
            const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;

            return matchesSearchTerm && matchesEmployee && matchesDepartment && matchesPayPeriod && matchesStatus;
        }).sort((a, b) => new Date(b.payPeriod.end) - new Date(a.payPeriod.end)); // Sort by pay period end date descending
    }, [payrolls, searchTerm, filterEmployeeId, filterDepartment, filterPayPeriod, filterStatus]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Processed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const handleAction = (payrollId, actionType) => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const updatedPayrolls = payrolls.map(payroll => {
                if (payroll.id === payrollId) {
                    let newStatus = payroll.status;
                    let newApprovedBy = payroll.approvedBy;
                    let newProcessedDate = payroll.processedDate;

                    if (actionType === 'approve' && payroll.status !== 'Approved') {
                        newStatus = 'Approved';
                        newApprovedBy = 'Current User (HR/Finance)'; // Placeholder for logged-in user
                        newProcessedDate = new Date().toISOString().slice(0, 10);
                    } else if (actionType === 'reject' && payroll.status !== 'Rejected') {
                        newStatus = 'Rejected';
                        newApprovedBy = 'Current User (HR/Finance)';
                        newProcessedDate = new Date().toISOString().slice(0, 10);
                    } else if (actionType === 'process' && payroll.status === 'Pending') {
                        newStatus = 'Processed';
                        newProcessedDate = new Date().toISOString().slice(0, 10);
                    }

                    return {
                        ...payroll,
                        status: newStatus,
                        processedDate: newProcessedDate,
                        approvedBy: newApprovedBy,
                    };
                }
                return payroll;
            });
            setPayrolls(updatedPayrolls);
            setLoading(false);
        }, 500);
    };

    const handleGeneratePayslip = (payrollId) => {
        console.log(`Generating payslip for Payroll ID: ${payrollId}`);
        // In a real app, this would trigger a backend process to generate and potentially email the payslip.
    };

    const payrollTableColumns = [
        { header: 'Employee Name', accessor: 'employee.name' },
        { header: 'Department', accessor: 'employee.department' },
        { header: 'Pay Period', accessor: 'payPeriod.name' },
        { header: 'Gross Pay', render: (row) => `ETB ${row.grossPay.toLocaleString()}` },
        { header: 'Deductions', render: (row) => `ETB ${(row.deductions.tax + row.deductions.socialSecurity + row.deductions.other).toLocaleString()}` },
        { header: 'Net Pay', render: (row) => `ETB ${row.netPay.toLocaleString()}` },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(row.status)}`}>
                    {row.status}
                </span>
            ),
        },
                    {
            header: 'Actions',
            render: (row) => (
                <div className="flex flex-wrap gap-2">
                {row.status === 'Pending' && (
                    <Button variant="primary" size="sm" onClick={() => handleAction(row.id, 'process')}>
                    <ListChecks size={16} /> Process
                    </Button>
                )}
                {row.status === 'Processed' && (
                    <>
                    <Button variant="success" size="sm" onClick={() => handleAction(row.id, 'approve')}>
                        <CheckCircle size={16} /> Approve
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleAction(row.id, 'reject')}>
                        <XCircle size={16} /> Reject
                    </Button>
                    </>
                )}
                {(row.status === 'Approved' || row.status === 'Processed') && (
                    <>
                    <Link to={`/hr/payroll/view/${row.id}`}>

                    <Button variant="outline" size="sm" onClick={() => handleGeneratePayslip(row.id)}>
                        <ReceiptText size={16} /> Payslip
                    </Button>
                    </Link>
                    {/* ✅ Add this: View History Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/hr/payroll/${row.employee.id}`)}
                    >
                        <FileText size={16} /> History
                    </Button>
                    </>
                )}
                </div>
            )
            }
    ];

    // Calculate summary totals
    const summaryTotals = useMemo(() => {
        const initial = { totalGross: 0, totalDeductions: 0, totalNet: 0 };
        return filteredPayrolls.reduce((acc, payroll) => {
            acc.totalGross += payroll.grossPay;
            acc.totalDeductions += (payroll.deductions.tax + payroll.deductions.socialSecurity + payroll.deductions.other);
            acc.totalNet += payroll.netPay;
            return acc;
        }, initial);
    }, [filteredPayrolls]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterEmployeeId('');
        setFilterDepartment('');
        setFilterPayPeriod('');
        setFilterStatus('all'); // Reset to default pending
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <DollarSign className="w-11 h-11 text-green-600 dark:text-green-400" /> Payroll Processing
                </h1>
 
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading payroll data...</p>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <>
                    {/* Filter and Search Section */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Filter size={28} className="text-teal-600 dark:text-teal-400" /> Filter Payrolls
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <Input
                                label="Search Payrolls"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by employee, period..."
                                icon={<Search size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Filter by Employee"
                                name="filterEmployeeId"
                                options={mockEmployeesForFilter}
                                value={filterEmployeeId}
                                onChange={(value) => setFilterEmployeeId(value)}
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Filter by Department"
                                name="filterDepartment"
                                options={mockDepartmentsForFilter}
                                value={filterDepartment}
                                onChange={(value) => setFilterDepartment(value)}
                                icon={<Building2 size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Filter by Pay Period"
                                name="filterPayPeriod"
                                options={mockPayPeriods}
                                value={filterPayPeriod}
                                onChange={(value) => setFilterPayPeriod(value)}
                                icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={payrollStatuses}
                                value={filterStatus}
                                onChange={(value) => setFilterStatus(value)}
                                icon={<Filter size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>
                        <div className="mt-6 text-right">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </Card>

                    {/* Payroll Summary Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <Card className="p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                            <DollarSign size={40} className="text-green-500 dark:text-green-400 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Gross Pay</h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">ETB {summaryTotals.totalGross.toLocaleString()}</p>
                        </Card>
                        <Card className="p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                            <TrendingDown size={40} className="text-red-500 dark:text-red-400 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Deductions</h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">ETB {summaryTotals.totalDeductions.toLocaleString()}</p>
                        </Card>
                        <Card className="p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                            <TrendingUp size={40} className="text-blue-500 dark:text-blue-400 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Net Pay</h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2">ETB {summaryTotals.totalNet.toLocaleString()}</p>
                        </Card>
                    </div>

                    {/* Payroll List */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <ListChecks size={28} className="text-teal-600 dark:text-teal-400" /> Payroll Entries
                        </h2>
                        {filteredPayrolls.length > 0 ? (
                            <div className="overflow-x-auto" > {/* Added for horizontal scrolling on small screens */}
                                <Table  columns={payrollTableColumns} data={filteredPayrolls} />
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg font-medium">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                No payroll entries found matching your criteria.
                                <p className="text-sm mt-2">Adjust your filters or add new payroll entries.</p>
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default PayrollProcessingPage;
