// pages/LeaveManagement/LeaveCalendarPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    CalendarDays, ArrowLeft, User, Filter, AlertCircle, ChevronLeft, ChevronRight,
    BriefcaseMedical, Plane, BookOpen, Home, XCircle, CheckCircle, Building2, DollarSign, Clock, Info // Added Info for generic icon
} from 'lucide-react';

const LeaveCalendarPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [filterEmployeeId, setFilterEmployeeId] = useState('');
    const [filterLeaveType, setFilterLeaveType] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState(''); // New state for department filter

    // --- Inline Mock Data ---
    const mockLeaveEntries = [
        // Updated years to 2025 for better current year visibility
        { id: 'lce-001', employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' }, type: 'Annual Leave', startDate: '2025-07-20', endDate: '2025-07-25', status: 'Approved' },
        { id: 'lce-002', employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' }, type: 'Sick Leave', startDate: '2025-07-18', endDate: '2025-07-18', status: 'Approved' },
        { id: 'lce-003', employee: { id: 'emp-003', name: 'Sara Ali', department: 'Operations' }, type: 'Paternity Leave', startDate: '2025-08-01', endDate: '2025-08-05', status: 'Pending' },
        { id: 'lce-004', employee: { id: 'emp-004', name: 'Kebede Worku', department: 'Finance' }, type: 'Annual Leave', startDate: '2025-08-10', endDate: '2025-08-14', status: 'Approved' },
        { id: 'lce-005', employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' }, type: 'Unpaid Leave', startDate: '2025-08-28', endDate: '2025-08-30', status: 'Rejected' },
        { id: 'lce-006', employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' }, type: 'Annual Leave', startDate: '2025-09-01', endDate: '2025-09-07', status: 'Approved' },
        { id: 'lce-007', employee: { id: 'emp-003', name: 'Sara Ali', department: 'Operations' }, type: 'Sick Leave', startDate: '2025-07-15', endDate: '2025-07-15', status: 'Approved' },
        { id: 'lce-008', employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' }, type: 'Annual Leave', startDate: '2025-07-14', endDate: '2025-07-16', status: 'Approved' },
        { id: 'lce-009', employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' }, type: 'Sick Leave', startDate: '2025-07-11', endDate: '2025-07-11', status: 'Pending' },
        { id: 'lce-010', employee: { id: 'emp-003', name: 'Sara Ali', department: 'Operations' }, type: 'Annual Leave', startDate: '2025-07-28', endDate: '2025-08-02', status: 'Approved' },
    ];

    const mockPublicHolidays = [
        // Updated years to 2025
        { date: '2025-07-20', name: 'Eid al-Adha (Arafa)' },
        { date: '2025-09-11', name: 'Enkutatash (Ethiopian New Year)' },
        { date: '2025-09-27', name: 'Meskel' },
    ];
    // --- End Inline Mock Data ---

    const mockEmployeesForFilter = [
        { value: '', label: 'All Employees' },
        { value: 'emp-001', label: 'Aisha Demisse' },
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

    const mockDepartmentsForFilter = [
        { value: '', label: 'All Departments' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
    ];

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate data fetch
            setLoading(false);
        }, 700);
    }, []);

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysArray = useMemo(() => {
        const numDays = daysInMonth(currentMonth, currentYear);
        const firstDay = firstDayOfMonth(currentMonth, currentYear);
        const days = [];

        // Add empty cells for preceding days of the week
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= numDays; i++) {
            days.push(i);
        }
        return days;
    }, [currentMonth, currentYear]);

    const getLeavesForDay = (day) => {
        if (!day) return [];
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayDate = new Date(dateString);

        return mockLeaveEntries.filter(leave => {
            const leaveStart = new Date(leave.startDate);
            const leaveEnd = new Date(leave.endDate);

            const matchesEmployee = filterEmployeeId === '' || leave.employee.id === filterEmployeeId;
            const matchesLeaveType = filterLeaveType === 'all' || leave.type === filterLeaveType;
            const matchesDepartment = filterDepartment === '' || leave.employee.department === filterDepartment;
            const isWithinRange = dayDate >= leaveStart && dayDate <= leaveEnd;

            return matchesEmployee && matchesLeaveType && matchesDepartment && isWithinRange;
        });
    };

    const getHolidayForDay = (day) => {
        if (!day) return null;
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return mockPublicHolidays.find(holiday => holiday.date === dateString);
    };

    // New useMemo to get all unique leavers for the current month, regardless of day
    const currentMonthLeavers = useMemo(() => {
        const leaversMap = new Map(); // Using a Map to store unique employees

        mockLeaveEntries.forEach(leave => {
            const leaveStart = new Date(leave.startDate);
            const leaveEnd = new Date(leave.endDate);

            // Check if any part of the leave falls within the current month/year
            const isLeaveInCurrentMonth =
                (leaveStart.getFullYear() === currentYear && leaveStart.getMonth() === currentMonth) ||
                (leaveEnd.getFullYear() === currentYear && leaveEnd.getMonth() === currentMonth) ||
                (leaveStart.getFullYear() < currentYear && leaveEnd.getFullYear() > currentYear) ||
                (leaveStart.getFullYear() === currentYear && leaveStart.getMonth() < currentMonth && leaveEnd.getFullYear() === currentYear && leaveEnd.getMonth() > currentMonth);


            const matchesEmployee = filterEmployeeId === '' || leave.employee.id === filterEmployeeId;
            const matchesLeaveType = filterLeaveType === 'all' || leave.type === filterLeaveType;
            const matchesDepartment = filterDepartment === '' || leave.employee.department === filterDepartment;

            if (isLeaveInCurrentMonth && matchesEmployee && matchesLeaveType && matchesDepartment) {
                // If employee is already in map, update their leave details (e.g., if multiple leaves)
                if (leaversMap.has(leave.employee.id)) {
                    const existingLeave = leaversMap.get(leave.employee.id);
                    // For simplicity, combine notes or just keep the first/last one
                    // Here, we'll just ensure the employee is listed once with one of their leaves
                    // You might want more sophisticated logic for multiple leaves per employee
                } else {
                    leaversMap.set(leave.employee.id, leave);
                }
            }
        });
        return Array.from(leaversMap.values()); // Convert map values to an array
    }, [mockLeaveEntries, currentMonth, currentYear, filterEmployeeId, filterLeaveType, filterDepartment]);


    const handlePrevMonth = () => {
        setCurrentMonth(prev => {
            if (prev === 0) {
                setCurrentYear(prevYear => prevYear - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => {
            if (prev === 11) {
                setCurrentYear(prevYear => prevYear + 1);
                return 0;
            }
            return prev + 1;
        });
    };

    const getLeaveIcon = (type) => {
        switch (type) {
            case 'Annual Leave': return <Plane size={14} className="text-blue-500 dark:text-blue-300" />;
            case 'Sick Leave': return <BriefcaseMedical size={14} className="text-red-500 dark:text-red-300" />;
            case 'Maternity Leave': return <Home size={14} className="text-pink-500 dark:text-pink-300" />;
            case 'Paternity Leave': return <User size={14} className="text-indigo-500 dark:text-indigo-300" />;
            case 'Bereavement Leave': return <XCircle size={14} className="text-gray-500 dark:text-gray-300" />;
            case 'Unpaid Leave': return <DollarSign size={14} className="text-orange-500 dark:text-orange-300" />;
            case 'Study Leave': return <BookOpen size={14} className="text-purple-500 dark:text-purple-300" />;
            default: return <CalendarDays size={14} className="text-gray-500 dark:text-gray-300" />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle size={12} className="text-green-500 dark:text-green-300" />;
            case 'Pending': return <Clock size={12} className="text-yellow-500 dark:text-yellow-300" />;
            case 'Rejected': return <XCircle size={12} className="text-red-500 dark:text-red-300" />;
            default: return null;
        }
    };

    const clearFilters = () => {
        setFilterEmployeeId('');
        setFilterLeaveType('all');
        setFilterDepartment('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <CalendarDays className="w-11 h-11 text-blue-600 dark:text-blue-400" /> Leave Calendar
                </h1>
                <Link to="/hr/leave-history" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading calendar data...</p>
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
                    {/* Filter Section */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Filter size={28} className="text-teal-600 dark:text-teal-400" /> Filter Calendar View
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                label="Filter by Leave Type"
                                name="filterLeaveType"
                                options={mockLeaveTypesForFilter}
                                value={filterLeaveType}
                                onChange={(value) => setFilterLeaveType(value)}
                                icon={<Info size={18} className="text-gray-400 dark:text-gray-500" />}
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

                    {/* Calendar View */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevMonth}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <ChevronLeft size={18} /> Prev
                            </Button>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {monthNames[currentMonth]} {currentYear}
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextMonth}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Next <ChevronRight size={18} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {getDaysArray.map((day, index) => {
                                const leaves = getLeavesForDay(day);
                                const holiday = getHolidayForDay(day);
                                const isToday = day && new Date().getDate() === day &&
                                                new Date().getMonth() === currentMonth &&
                                                new Date().getFullYear() === currentYear;

                                return (
                                    <div
                                        key={index}
                                        className={`p-3 min-h-[120px] border rounded-lg flex flex-col items-start relative overflow-hidden transition-all duration-200
                                            ${day ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'}
                                            ${isToday ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-300 dark:ring-blue-600' : ''}
                                            ${day ? 'hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500' : ''}
                                        `}
                                    >
                                        <span className={`font-bold text-lg ${isToday ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-100'}`}>
                                            {day}
                                        </span>
                                        {holiday && (
                                            <div className="text-xs text-red-700 dark:text-red-200 font-medium mt-1 flex items-center gap-1 bg-red-100 dark:bg-red-900 p-1.5 rounded-md w-full shadow-sm">
                                                <XCircle size={12} className="flex-shrink-0" /> <span className="truncate">{holiday.name}</span>
                                            </div>
                                        )}
                                        {leaves.length > 0 && (
                                            <div className="mt-2 space-y-1 w-full max-h-[60px] overflow-y-auto custom-scrollbar">
                                                {leaves.map(leave => (
                                                    <div key={leave.id} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md w-full truncate shadow-sm
                                                        ${leave.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                          leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                        }`}
                                                        title={`${leave.employee.name} - ${leave.type} (${leave.status})`}
                                                    >
                                                        {getLeaveIcon(leave.type)}
                                                        <span className="truncate">{leave.employee.name}</span>
                                                        {getStatusIcon(leave.status)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Employees on Leave This Month Card */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <User size={28} className="text-purple-600 dark:text-purple-400" /> Employees on Leave in {monthNames[currentMonth]} {currentYear}
                        </h2>
                        {currentMonthLeavers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentMonthLeavers.map(leave => (
                                    <div key={leave.id} className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm">
                                        <div className="flex-shrink-0 mr-3">
                                            {getLeaveIcon(leave.type)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{leave.employee.name}</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{leave.type}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {leave.startDate} to {leave.endDate}
                                                <span className="ml-2 inline-flex items-center gap-1">
                                                    {getStatusIcon(leave.status)} {leave.status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-lg font-medium">
                                No employees are on leave in {monthNames[currentMonth]} {currentYear}.
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default LeaveCalendarPage;
