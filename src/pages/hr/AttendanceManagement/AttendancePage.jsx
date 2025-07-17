// pages/AttendanceManagement/AttendancePage.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, User, AlertCircle, Filter, Search, CheckCircle, XCircle, Info, TrendingUp, TrendingDown, Clock3, CalendarCheck2, CalendarX2 } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/input'; // Assuming this input component is available

const mockAttendanceLogs = [
    {
        id: 'emp-001',
        name: 'Aisha Demisse',
        logs: [
            { date: '2025-07-01', in: '08:58', out: '17:05', status: 'Present' },
            { date: '2025-07-02', in: '09:15', out: '17:10', status: 'Late' },
            { date: '2025-07-03', in: null, out: null, status: 'Absent' },
            { date: '2025-07-04', in: '09:00', out: '17:00', status: 'Present' },
            { date: '2025-07-05', in: '08:59', out: '17:02', status: 'Present' },
            { date: '2025-07-08', in: '09:01', out: '17:03', status: 'Present' },
            { date: '2025-07-09', in: '09:20', out: '17:15', status: 'Late' },
            { date: '2025-07-10', in: '08:55', out: '17:00', status: 'Present' },
            { date: '2025-07-11', in: null, out: null, status: 'Absent' },
            { date: '2025-06-01', in: '08:55', out: '17:00', status: 'Present' },
            { date: '2025-06-02', in: '09:05', out: '17:15', status: 'Late' },
            { date: '2024-12-10', in: '08:45', out: '16:50', status: 'Present' },
            { date: '2024-12-11', in: null, out: null, status: 'Absent' },
        ],
    },
    {
        id: 'emp-002',
        name: 'Tesfaye Gebre',
        logs: [
            { date: '2025-07-01', in: '09:00', out: '17:00', status: 'Present' },
            { date: '2025-07-02', in: '09:02', out: '17:05', status: 'Present' },
            { date: '2025-07-03', in: '08:58', out: '16:59', status: 'Present' },
            { date: '2025-06-15', in: '08:50', out: '17:00', status: 'Present' },
        ],
    },
    {
        id: 'emp-003',
        name: 'Sara Ali',
        logs: [
            { date: '2025-07-01', in: '09:00', out: '17:00', status: 'Present' },
            { date: '2025-07-02', in: '09:00', out: '17:00', status: 'Present' },
            { date: '2025-07-03', in: '09:00', out: '17:00', status: 'Present' },
        ],
    },
];

const statusColor = {
    Present: 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900',
    Late: 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900',
    Absent: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900',
};

const AttendancePage = () => {
    const { employeeId } = useParams();
    const [logs, setLogs] = useState([]);
    const [employeeName, setEmployeeName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // Current month (1-indexed)
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [searchTerm, setSearchTerm] = useState(''); // For searching by date or status

    // Generate month options
    const monthOptions = useMemo(() => {
        const months = [];
        for (let i = 1; i <= 12; i++) {
            months.push({ value: i, label: new Date(0, i - 1).toLocaleString('en-US', { month: 'long' }) });
        }
        return months;
    }, []);

    // Generate year options (e.g., current year +/- 2 years)
    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 2; i <= currentYear + 1; i++) {
            years.push({ value: i, label: i.toString() });
        }
        return years.sort((a, b) => b.value - a.value); // Sort descending
    }, []);


    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const record = mockAttendanceLogs.find((emp) => emp.id === employeeId);
            if (record) {
                setLogs(record.logs);
                setEmployeeName(record.name);
                setError(null);
            } else {
                setError('No attendance logs found for this employee.');
            }
            setLoading(false);
        }, 600);
    }, [employeeId]);

    const filteredLogs = useMemo(() => {
        if (!logs) return [];

        let currentLogs = [...logs];

        // Filter by month and year
        currentLogs = currentLogs.filter(log => {
            const logDate = new Date(log.date);
            return logDate.getMonth() + 1 === parseInt(filterMonth) && logDate.getFullYear() === parseInt(filterYear);
        });

        // Search by date or status
        if (searchTerm.trim() !== '') {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            currentLogs = currentLogs.filter(log =>
                log.date.toLowerCase().includes(lowerCaseSearchTerm) ||
                log.status.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        return currentLogs.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    }, [logs, filterMonth, filterYear, searchTerm]);

    // Calculate attendance metrics
    const attendanceMetrics = useMemo(() => {
        const totalDays = filteredLogs.length;
        const presentDays = filteredLogs.filter(log => log.status === 'Present').length;
        const lateDays = filteredLogs.filter(log => log.status === 'Late').length;
        const absentDays = filteredLogs.filter(log => log.status === 'Absent').length;

        let totalInMinutes = 0;
        let totalOutMinutes = 0;
        let clockInCount = 0;
        let clockOutCount = 0;

        filteredLogs.forEach(log => {
            if (log.in) {
                const [hoursIn, minutesIn] = log.in.split(':').map(Number);
                totalInMinutes += (hoursIn * 60) + minutesIn;
                clockInCount++;
            }
            if (log.out) {
                const [hoursOut, minutesOut] = log.out.split(':').map(Number);
                totalOutMinutes += (hoursOut * 60) + minutesOut;
                clockOutCount++;
            }
        });

        const avgInTime = clockInCount > 0 ? new Date(0, 0, 0, Math.floor(totalInMinutes / clockInCount / 60), (totalInMinutes / clockInCount) % 60).toTimeString().slice(0, 5) : 'N/A';
        const avgOutTime = clockOutCount > 0 ? new Date(0, 0, 0, Math.floor(totalOutMinutes / clockOutCount / 60), (totalOutMinutes / clockOutCount) % 60).toTimeString().slice(0, 5) : 'N/A';

        return {
            totalDays,
            presentDays,
            lateDays,
            absentDays,
            avgInTime,
            avgOutTime,
        };
    }, [filteredLogs]);


    const clearFilters = () => {
        setFilterMonth(new Date().getMonth() + 1);
        setFilterYear(new Date().getFullYear());
        setSearchTerm('');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
                <LoadingSpinner />
                <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading attendance logs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl mb-6 shadow-md flex items-center">
                    <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                    <div>
                        <strong className="font-bold">Error:</strong>
                        <span className="ml-2">{error}</span>
                    </div>
                </div>
                <Link to="/hr/employees">
                    <Button variant="secondary" className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Employee List
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-4 sm:p-6 lg:p-8 text-gray-900 dark:text-white font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-4">
                    <CalendarDays className="w-11 h-11 text-blue-600 dark:text-blue-400" /> Attendance Log for {employeeName}
                </h1>
                <Link to="/employees" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Employee List
                    </Button>
                </Link>
            </div>

            {/* Filter and Search Section */}
            <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                    <Filter size={28} className="text-teal-600 dark:text-teal-400" /> Filter Attendance Records
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Select
                        label="Select Month"
                        name="monthFilter"
                        options={monthOptions}
                        value={filterMonth}
                        onChange={(value) => setFilterMonth(value)}
                        icon={<CalendarDays size={18} className="text-gray-400 dark:text-gray-500" />}
                    />
                    <Select
                        label="Select Year"
                        name="yearFilter"
                        options={yearOptions}
                        value={filterYear}
                        onChange={(value) => setFilterYear(value)}
                        icon={<CalendarDays size={18} className="text-gray-400 dark:text-gray-500" />}
                    />
                    <Input
                        label="Search Date/Status"
                        name="searchTerm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="e.g., '2025-07' or 'Present'"
                        icon={<Search size={18} className="text-gray-400 dark:text-gray-500" />}
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

            {/* Attendance Metrics Summary */}
            <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-10">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                    <TrendingUp size={28} className="text-orange-600 dark:text-orange-400" /> Attendance Summary for {monthOptions.find(m => m.value === filterMonth)?.label} {filterYear}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 text-center">
                    <MetricCard
                        icon={<CalendarDays size={24} className="text-blue-500" />}
                        label="Total Days"
                        value={attendanceMetrics.totalDays}
                        description="Days with recorded attendance"
                    />
                    <MetricCard
                        icon={<CalendarCheck2 size={24} className="text-green-500" />}
                        label="Present Days"
                        value={attendanceMetrics.presentDays}
                        description="Days clocked in on time"
                    />
                    <MetricCard
                        icon={<Clock3 size={24} className="text-yellow-500" />}
                        label="Late Days"
                        value={attendanceMetrics.lateDays}
                        description="Days clocked in late"
                    />
                    <MetricCard
                        icon={<CalendarX2 size={24} className="text-red-500" />}
                        label="Absent Days"
                        value={attendanceMetrics.absentDays}
                        description="Days not clocked in"
                    />
                    <MetricCard
                        icon={<TrendingDown size={24} className="text-purple-500" />}
                        label="Avg. Clock-In"
                        value={attendanceMetrics.avgInTime}
                        description="Average time of arrival"
                    />
                    <MetricCard
                        icon={<TrendingUp size={24} className="text-cyan-500" />}
                        label="Avg. Clock-Out"
                        value={attendanceMetrics.avgOutTime}
                        description="Average time of departure"
                    />
                </div>
            </Card>

            {/* Attendance Log Table */}
            {!loading && !error && (
                <Card className="overflow-x-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                        <Clock size={28} className="text-purple-600 dark:text-purple-400" /> Daily Records
                    </h2>
                    {filteredLogs.length > 0 ? (
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold rounded-t-lg">
                                    <th className="py-3 px-4 rounded-tl-lg">Date</th>
                                    <th className="py-3 px-4">Clock In</th>
                                    <th className="py-3 px-4">Clock Out</th>
                                    <th className="py-3 px-4 rounded-tr-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">{log.date}</td>
                                        <td className="py-3 px-4">{log.in || <span className="text-gray-400">-</span>}</td>
                                        <td className="py-3 px-4">{log.out || <span className="text-gray-400">-</span>}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[log.status]}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg font-medium">
                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            No attendance records found for the selected period or filters.
                            <p className="text-sm mt-2">Try adjusting your month, year, or search terms.</p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

// MetricCard Component for consistent display of summary metrics
const MetricCard = ({ icon, label, value, description }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
        <div className="mb-2">{icon}</div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
);

export default AttendancePage;
