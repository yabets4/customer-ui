// pages/LeaveManagement/LeaveRequestHistoryPlaceholder.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/input'; // Keep Input for future use if needed, but remove from UI if not
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    History, ArrowLeft, User, Filter, AlertCircle, CalendarDays, CheckCircle, XCircle, Clock,
    BriefcaseMedical, Plane, BookOpen, Home, DollarSign, Info
} from 'lucide-react';

const LeaveRequestHistoryPlaceholder = () => {
    const { employeeId } = useParams(); // Get employeeId from URL, e.g., /hr/leave-requests/emp-001
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Re-introduced searchTerm for filtering by reason
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterLeaveType, setFilterLeaveType] = useState('all');
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

    // --- Inline Mock Data ---
    const mockLeaveRequests = [
        {
            id: 'emp-001',
            employee: { id: 'emp-001', name: 'Yabets Mebratu' },
            type: 'Annual Leave',
            startDate: '2025-07-20',
            endDate: '2025-07-25',
            status: 'Approved',
            reason: 'Family vacation',
            requestedDate: '2025-07-01',
            approvedBy: 'HR Manager',
        },
        {
            id: 'emp-002',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            type: 'Sick Leave',
            startDate: '2025-07-18',
            endDate: '2025-07-18',
            status: 'Approved',
            reason: 'Flu symptoms',
            requestedDate: '2025-07-17',
            approvedBy: 'Direct Manager',
        },
        {
            id: 'emp-003',
            employee: { id: 'emp-001', name: 'Yabets Mebratu' },
            type: 'Unpaid Leave',
            startDate: '2025-08-10',
            endDate: '2025-08-12',
            status: 'Pending',
            reason: 'Personal matters',
            requestedDate: '2025-07-20',
            approvedBy: null,
        },
        {
            id: 'emp-004',
            employee: { id: 'emp-003', name: 'Sara Ali' },
            type: 'Maternity Leave',
            startDate: '2025-09-01',
            endDate: '2025-11-30',
            status: 'Approved',
            reason: 'Child birth',
            requestedDate: '2025-06-15',
            approvedBy: 'HR Manager',
        },
        {
            id: 'emp-005',
            employee: { id: 'emp-004', name: 'Kebede Worku' },
            type: 'Annual Leave',
            startDate: '2024-12-01',
            endDate: '2024-12-07',
            status: 'Approved',
            reason: 'Holiday break',
            requestedDate: '2024-11-01',
            approvedBy: 'Direct Manager',
        },
        {
            id: 'emp-006',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            type: 'Bereavement Leave',
            startDate: '2025-07-05',
            endDate: '2025-07-06',
            status: 'Rejected',
            reason: 'Family emergency (insufficient documentation)',
            requestedDate: '2025-07-04',
            approvedBy: 'HR Manager',
        },
    ];

    // mockEmployeesForFilter is now only used to get the employee name for the title
    const mockEmployeesForTitle = [
        { value: 'emp-001', label: 'Yabets mebratu' },
        { value: 'emp-002', label: 'Tesfaye Gebre' },
        { value: 'emp-003', label: 'Sara Ali' },
        { value: 'emp-004', label: 'Kebede Worku' },
    ];

    const mockLeaveTypesForFilter = [
        { value: 'all', label: 'All Leave Types' },
        { value: 'Annual Leave', label: 'Annual Leave' },
        { value: 'Sick Leave', label: 'Sick Leave' },
        { value: 'Maternity Leave', label: 'Maternity Leave' },
        { value: 'Paternity Leave', label: 'Paternity Leave' },
        { value: 'Bereavement Leave', label: 'Bereavement Leave' },
        { value: 'Unpaid Leave', label: 'Unpaid Leave' },
        { value: 'Study Leave', label: 'Study Leave' },
    ];

    const mockStatusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' },
    ];

    const mockYears = [
        { value: 'all', label: 'All Years' },
        { value: '2025', label: '2025' },
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
    ];
    // --- End Inline Mock Data ---

    const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate data fetch
            setLeaveRequests(mockLeaveRequests); // Reset to full mock data on initial load
            setLoading(false);
        }, 700);
    }, []);

    const filteredRequests = useMemo(() => {
        let filtered = leaveRequests;

        // ALWAYS filter by employeeId if provided in URL
        if (employeeId) {
            filtered = filtered.filter(req => req.employee.id === employeeId);
        } else {
            // If no employeeId is provided in the URL, this page should not show any data
            // or redirect, depending on desired behavior. For now, we'll show an error.
            setError("Employee ID is required to view leave history.");
            return [];
        }

        // Search by reason
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(req =>
                req.reason.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(req => req.status === filterStatus);
        }

        // Filter by leave type
        if (filterLeaveType !== 'all') {
            filtered = filtered.filter(req => req.type === filterLeaveType);
        }

        // Filter by year
        if (filterYear !== 'all') {
            filtered = filtered.filter(req => new Date(req.startDate).getFullYear().toString() === filterYear);
        }

        return filtered.sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate)); // Sort by requested date descending
    }, [leaveRequests, employeeId, searchTerm, filterStatus, filterLeaveType, filterYear]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getLeaveTypeIcon = (type) => {
        switch (type) {
            case 'Annual Leave': return <Plane size={16} className="text-blue-500" />;
            case 'Sick Leave': return <BriefcaseMedical size={16} className="text-red-500" />;
            case 'Maternity Leave': return <Home size={16} className="text-pink-500" />;
            case 'Paternity Leave': return <User size={16} className="text-indigo-500" />;
            case 'Bereavement Leave': return <XCircle size={16} className="text-gray-500" />;
            case 'Unpaid Leave': return <DollarSign size={16} className="text-orange-500" />;
            case 'Study Leave': return <BookOpen size={16} className="text-purple-500" />;
            default: return <Info size={16} className="text-gray-500" />;
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
        setFilterLeaveType('all');
        setFilterYear(new Date().getFullYear().toString());
    };

    // Determine the employee name for the title if employeeId is present
    const employeeName = useMemo(() => {
        if (employeeId) {
            const employee = mockEmployeesForTitle.find(emp => emp.value === employeeId);
            return employee ? employee.label : 'Unknown Employee';
        }
        return null;
    }, [employeeId, mockEmployeesForTitle]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <History className="w-11 h-11 text-purple-600 dark:text-purple-400" />
                    {employeeName ? `Leave History for ${employeeName}` : 'Leave Request History'}
                </h1>
                <Link to="/hr/leave-history" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Leave Management
                    </Button>
                </Link>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading leave requests...</p>
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

            {!loading && !error && ( // Only render content if not loading and no error
                <>
                    {/* Filter and Search Section */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Filter size={28} className="text-teal-600 dark:text-teal-400" /> Filter Leave Requests for {employeeName}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Re-added Search by Reason Input */}
                            <Input
                                label="Search by Reason"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by reason..."
                                icon={<Info size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={mockStatusOptions}
                                value={filterStatus}
                                onChange={(value) => setFilterStatus(value)}
                                icon={<CheckCircle size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Filter by Leave Type"
                                name="filterLeaveType"
                                options={mockLeaveTypesForFilter}
                                value={filterLeaveType}
                                onChange={(value) => setFilterLeaveType(value)}
                                icon={<Info size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Filter by Year"
                                name="filterYear"
                                options={mockYears}
                                value={filterYear}
                                onChange={(value) => setFilterYear(value)}
                                icon={<CalendarDays size={18} className="text-gray-400 dark:text-gray-500" />}
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

                    {/* Leave Request List */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <CalendarDays size={28} className="text-purple-600 dark:text-purple-400" />
                            Leave Requests for {employeeName}
                        </h2>
                        {filteredRequests.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredRequests.map(request => (
                                    <div key={request.id} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                {getLeaveTypeIcon(request.type)}
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{request.type}</h3>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <User size={16} /> <span className="font-medium">{request.employee.name}</span>
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 flex items-center gap-2">
                                                <CalendarDays size={16} /> {request.startDate} to {request.endDate}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                                <span className="font-medium">Reason:</span> {request.reason}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(request.status)}`}>
                                                {request.status}
                                            </span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Requested: {request.requestedDate}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg font-medium">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                No leave requests found for {employeeName}.
                                <p className="text-sm mt-2">There might be no records or the filters are too restrictive.</p>
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default LeaveRequestHistoryPlaceholder;
