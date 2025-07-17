// pages/AttendanceManagement/AttendanceLogPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Table from '../../../components/ui/Table'; // Assuming a reusable Table component

// Lucide React Icons
import {
    Clock, ArrowLeft, User, Calendar, Search, Filter, Hourglass, CheckCircle, XCircle,
    AlertCircle, Timer, MapPin, ListChecks
} from 'lucide-react';

const AttendanceLogPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmployeeId, setFilterEmployeeId] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Present', 'Absent', 'Late', 'Early Out', 'On Leave', 'Manual Adjustment'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Items per page, could be user-configurable

    // State to hold the filtered (but not yet paginated) data
    const [allFilteredLogs, setAllFilteredLogs] = useState([]);
    const [totalPages, setTotalPages] = useState(1);


    // --- Inline Mock Data for Attendance Log ---
    const mockAttendanceEntries = [
        {
            id: 'att-001', employee: { id: 'emp-001', name: 'Aisha Demisse' }, date: '2024-07-10',
            clockInTime: '08:00', clockOutTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00',
            totalHours: 8, status: 'Present', notes: '', location: 'Main Office'
        },
        {
            id: 'att-002', employee: { id: 'emp-002', name: 'Tesfaye Gebre' }, date: '2024-07-10',
            clockInTime: '08:00', clockOutTime: '17:00', breakStartTime: '12:30', breakEndTime: '13:30',
            totalHours: 8, status: 'Present', notes: '', location: 'Main Office'
        },
        {
            id: 'att-003', employee: { id: 'emp-003', name: 'Sara Ali' }, date: '2024-07-10',
            clockInTime: '08:45', clockOutTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00',
            totalHours: 7.25, status: 'Late', notes: 'Arrived late due to traffic.', location: 'Main Office'
        },
        {
            id: 'att-004', employee: { id: 'emp-004', name: 'Kebede Worku' }, date: '2024-07-10',
            clockInTime: null, clockOutTime: null, breakStartTime: null, breakEndTime: null,
            totalHours: 0, status: 'Absent', notes: 'Unexplained absence.', location: null
        },
        {
            id: 'att-005', employee: { id: 'emp-001', name: 'Aisha Demisse' }, date: '2024-07-09',
            clockInTime: '08:05', clockOutTime: '16:30', breakStartTime: '12:00', breakEndTime: '13:00',
            totalHours: 7.5, status: 'Early Out', notes: 'Left early for a personal appointment.', location: 'Main Office'
        },
        {
            id: 'att-006', employee: { id: 'emp-002', name: 'Tesfaye Gebre' }, date: '2024-07-09',
            clockInTime: '08:00', clockOutTime: '17:00', breakStartTime: '12:30', breakEndTime: '13:30',
            totalHours: 8, status: 'Present', notes: '', location: 'Main Office'
        },
        {
            id: 'att-007', employee: { id: 'emp-003', name: 'Sara Ali' }, date: '2024-07-09',
            clockInTime: null, clockOutTime: null, breakStartTime: null, breakEndTime: null,
            totalHours: 0, status: 'On Leave', notes: 'Annual Leave', location: null
        },
        {
            id: 'att-008', employee: { id: 'emp-004', name: 'Kebede Worku' }, date: '2024-07-09',
            clockInTime: '08:00', clockOutTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00',
            totalHours: 8, status: 'Present', notes: '', location: 'Main Office'
        },
        {
            id: 'att-009', employee: { id: 'emp-001', name: 'Aisha Demisse' }, date: '2024-07-08',
            clockInTime: '08:00', clockOutTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00',
            totalHours: 8, status: 'Present', notes: '', location: 'Main Office'
        },
        {
            id: 'att-010', employee: { id: 'emp-002', name: 'Tesfaye Gebre' }, date: '2024-07-08',
            clockInTime: '09:15', clockOutTime: '17:00', breakStartTime: '12:30', breakEndTime: '13:30',
            totalHours: 7.0, status: 'Late', notes: 'Technical issue at home.', location: 'Remote'
        },
        {
            id: 'att-011', employee: { id: 'emp-003', name: 'Sara Ali' }, date: '2024-07-08',
            clockInTime: '08:00', clockOutTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00',
            totalHours: 8, status: 'Present', notes: '', location: 'Main Office'
        },
        {
            id: 'att-012', employee: { id: 'emp-004', name: 'Kebede Worku' }, date: '2024-07-08',
            clockInTime: '08:00', clockOutTime: '17:00', breakStartTime: '12:00', breakEndTime: '13:00',
            totalHours: 8, status: 'Present', notes: '', location: 'Main Office'
        },
    ];
    // --- End Inline Mock Data ---

    const mockEmployeesForFilter = [
        { value: '', label: 'All Employees' },
        { value: 'emp-001', label: 'Aisha Demisse' },
        { value: 'emp-002', label: 'Tesfaye Gebre' },
        { value: 'emp-003', label: 'Sara Ali' },
        { value: 'emp-004', label: 'Kebede Worku' },
    ];

    const attendanceStatuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Present', label: 'Present' },
        { value: 'Absent', label: 'Absent' },
        { value: 'Late', label: 'Late' },
        { value: 'Early Out', label: 'Early Out' },
        { value: 'On Leave', label: 'On Leave' },
        { value: 'Manual Adjustment', label: 'Manual Adjustment' },
    ];

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // In a real app, this would be a server-side fetch
            setLoading(false);
        }, 700);
    }, []);

    // Use useMemo to filter and sort the data whenever filters or search terms change
    // This prevents recalculation on every render unless dependencies change
    useEffect(() => {
        let filtered = mockAttendanceEntries.filter(entry => {
            const matchesSearchTerm = searchTerm.trim() === '' ||
                entry.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (entry.location && entry.location.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesEmployee = filterEmployeeId === '' || entry.employee.id === filterEmployeeId;
            const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;

            const entryDate = new Date(entry.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesDateRange = (!start || entryDate >= start) && (!end || entryDate <= end);

            return matchesSearchTerm && matchesEmployee && matchesStatus && matchesDateRange;
        });

        // Sort by date descending
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAllFilteredLogs(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page whenever filters change
    }, [searchTerm, filterEmployeeId, filterStatus, startDate, endDate, itemsPerPage]); // Dependencies for re-filtering

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'Late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Early Out': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'On Leave': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Manual Adjustment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allFilteredLogs.slice(startIndex, endIndex);
    }, [allFilteredLogs, currentPage, itemsPerPage]); // Dependencies for pagination

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const attendanceTableColumns = [
        { header: 'Employee Name', accessor: 'employee.name' },
        { header: 'Date', accessor: 'date' },
        { header: 'Clock In', accessor: 'clockInTime' },
        { header: 'Clock Out', accessor: 'clockOutTime' },
        { header: 'Break (Hours)', render: (row) => {
            if (!row.breakStartTime || !row.breakEndTime) return <span className="text-gray-500 dark:text-gray-400">N/A</span>;
            const breakStart = new Date(`2000/01/01 ${row.breakStartTime}`);
            const breakEnd = new Date(`2000/01/01 ${row.breakEndTime}`);
            const breakDurationMs = breakEnd - breakStart;
            const breakHours = breakDurationMs / (1000 * 60 * 60);
            return breakHours.toFixed(2);
        }},
        { header: 'Total Hours', accessor: 'totalHours' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(row.status)}`}>
                    {row.status}
                </span>
            ),
        },
        { header: 'Notes', accessor: 'notes' },
        { header: 'Location', accessor: 'location' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <Clock className="w-11 h-11 text-teal-600 dark:text-teal-400" /> Attendance Log
                </h1>
                <Link to="/hr/employees" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading attendance records...</p>
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

            {/* Content when not loading and no error */}
            {!loading && !error && (
                <>
                    {/* Filter and Search Section */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Filter size={28} className="text-blue-600 dark:text-blue-400" /> Filter Attendance Records
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Input
                                label="Search by Name/Notes/Location"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                icon={<Search size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full lg:col-span-1"
                            />
                            <Select
                                label="Filter by Employee"
                                name="filterEmployeeId"
                                options={mockEmployeesForFilter}
                                value={filterEmployeeId}
                                onChange={(value) => setFilterEmployeeId(value)} // Changed to receive value directly
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full lg:col-span-1"
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={attendanceStatuses}
                                value={filterStatus}
                                onChange={(value) => setFilterStatus(value)} // Changed to receive value directly
                                icon={<Hourglass size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full lg:col-span-1"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-full lg:col-span-1">
                                <Input
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                                <Input
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                            </div>
                        </div>
                        <div className="mt-6 text-right">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterEmployeeId('');
                                    setFilterStatus('all');
                                    setStartDate('');
                                    setEndDate('');
                                    setCurrentPage(1);
                                }}
                                className="px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </Card>

                    {/* Attendance Log List */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <ListChecks size={28} className="text-teal-600 dark:text-teal-400" /> Daily Attendance Records
                        </h2>
                        {paginatedLogs.length > 0 ? (
                            <>
                                <Table columns={attendanceTableColumns} data={paginatedLogs} />
                                <div className="flex justify-center mt-8 space-x-2">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <Button
                                            key={index + 1}
                                            variant={currentPage === index + 1 ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                                                ${currentPage === index + 1
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg font-medium">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                No attendance records found matching your criteria.
                                <p className="text-sm mt-2">Adjust your filters or check the date range.</p>
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default AttendanceLogPage;
