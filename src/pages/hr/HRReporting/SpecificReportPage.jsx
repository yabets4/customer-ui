// pages/ReportsManagement/HRReporting/SpecificReportPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Table from '../../../components/ui/Table'; // Assuming a reusable Table component

// Lucide React Icons
import {
    ArrowLeft, BarChart3, Users, Filter, AlertCircle, PieChart, LineChart, Building2,
    CalendarDays, Tag, DollarSign, Briefcase, CheckCircle, XCircle,
    Star, MessageSquare, Clock, Hourglass, ClipboardList, FileText, Download, Table as TableIcon // Renamed Table import to TableIcon
} from 'lucide-react';

const SpecificReportPage = () => {
    const { reportId } = useParams(); // To identify which specific report is being viewed
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterYear, setFilterYear] = useState('all');

    // --- Inline Mock Data for a generic report (e.g., Employee Demographics) ---
    const mockReportData = [
        { id: 'emp-001', name: 'Aisha Demisse', department: 'HR', status: 'Active', hireYear: 2020, gender: 'Female', ageGroup: '30-39' },
        { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT', status: 'Active', hireYear: 2021, gender: 'Male', ageGroup: '25-34' },
        { id: 'emp-003', name: 'Sara Ali', department: 'Operations', status: 'Active', hireYear: 2019, gender: 'Female', ageGroup: '40-49' },
        { id: 'emp-004', name: 'Kebede Worku', department: 'Finance', status: 'Active', hireYear: 2022, gender: 'Male', ageGroup: '25-34' },
        { id: 'emp-005', name: 'Lelisa Abera', department: 'Sales', status: 'Active', hireYear: 2023, gender: 'Male', ageGroup: '20-29' },
        { id: 'emp-006', name: 'Chaltu Lemma', department: 'HR', status: 'On Leave', hireYear: 2018, gender: 'Female', ageGroup: '30-39' },
        { id: 'emp-007', name: 'Dawit Bekele', department: 'IT', status: 'Inactive', hireYear: 2017, gender: 'Male', ageGroup: '40-49' },
    ];
    // --- End Inline Mock Data ---

    const mockDepartments = [
        { value: 'all', label: 'All Departments' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
    ];

    const mockStatuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Active', label: 'Active' },
        { value: 'On Leave', label: 'On Leave' },
        { value: 'Inactive', label: 'Inactive' },
    ];

    const mockYears = useMemo(() => {
        const years = new Set(mockReportData.map(d => d.hireYear));
        return [{ value: 'all', label: 'All Years' }, ...Array.from(years).sort((a, b) => b - a).map(year => ({ value: String(year), label: String(year) }))];
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // In a real app, you'd fetch data specific to `reportId`
            // For now, we'll use the generic mockReportData
            setLoading(false);
        }, 800);
    }, [reportId]);

    // Define filteredReportData BEFORE mockChartData
    const filteredReportData = useMemo(() => {
        return mockReportData.filter(item => {
            const matchesDepartment = filterDepartment === 'all' || item.department === filterDepartment;
            const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
            const matchesYear = filterYear === 'all' || String(item.hireYear) === filterYear;
            return matchesDepartment && matchesStatus && matchesYear;
        });
    }, [mockReportData, filterDepartment, filterStatus, filterYear]);

    // Mock data for charts (simplified for demonstration)
    const mockChartData = useMemo(() => {
        const genderData = {};
        const departmentData = {};
        const statusData = {};
        const tenureData = {}; // For LineChart/BarChart

        filteredReportData.forEach(item => {
            genderData[item.gender] = (genderData[item.gender] || 0) + 1;
            departmentData[item.department] = (departmentData[item.department] || 0) + 1;
            statusData[item.status] = (statusData[item.status] || 0) + 1;

            const tenureGroup = `${new Date().getFullYear() - item.hireYear} years`;
            tenureData[tenureGroup] = (tenureData[tenureGroup] || 0) + 1;
        });

        return {
            genderDistribution: Object.keys(genderData).map(key => ({ name: key, value: genderData[key] })),
            departmentBreakdown: Object.keys(departmentData).map(key => ({ name: key, value: departmentData[key] })),
            statusBreakdown: Object.keys(statusData).map(key => ({ name: key, value: statusData[key] })),
            tenureAnalysis: Object.keys(tenureData).map(key => ({ name: key, count: tenureData[key] })).sort((a,b) => parseInt(a.name) - parseInt(b.name)),
        };
    }, [filteredReportData]);


    // Define columns for the table based on the mock report data structure
    const reportTableColumns = [
        { header: 'Employee Name', accessor: 'name' },
        { header: 'Department', accessor: 'department' },
        { header: 'Status', accessor: 'status' },
        { header: 'Hire Year', accessor: 'hireYear' },
        { header: 'Gender', accessor: 'gender' },
        { header: 'Age Group', accessor: 'ageGroup' },
    ];

    // Function to get a more descriptive title based on reportId
    const getReportTitle = (id) => {
        switch (id) {
            case 'employee_demographics': return 'Employee Demographics Report';
            case 'employee_status': return 'Employee Status & Headcount Report';
            case 'employee_tenure': return 'Employee Tenure Analysis Report';
            case 'department_breakdown': return 'Departmental Employee Breakdown Report';
            case 'review_completion_rates': return 'Performance Review Completion Rates';
            case 'average_ratings': return 'Average Performance Ratings Report';
            case 'feedback_trends': return 'Feedback Trends Analysis';
            case 'daily_attendance_summary': return 'Daily Attendance Summary Report';
            case 'absence_rate': return 'Absence Rate Analysis Report';
            case 'overtime_summary': return 'Overtime Summary Report';
            case 'payroll_summary': return 'Payroll Summary by Period Report';
            case 'tax_deduction_summary': return 'Tax & Deduction Summary Report';
            case 'compensation_breakdown': return 'Compensation Breakdown Report';
            case 'leave_balance_summary': return 'Leave Balance Summary Report';
            case 'leave_utilization': return 'Leave Utilization Report by Type';
            case 'upcoming_leaves': return 'Upcoming Leaves Overview Report';
            default: return 'Custom HR Report';
        }
    };

    const getReportIcon = (id) => {
        switch (id) {
            case 'employee_demographics': return PieChart;
            case 'employee_status': return BarChart3;
            case 'employee_tenure': return LineChart;
            case 'department_breakdown': return Building2;
            case 'review_completion_rates': return CheckCircle;
            case 'average_ratings': return Star;
            case 'feedback_trends': return MessageSquare;
            case 'daily_attendance_summary': return Clock;
            case 'absence_rate': return XCircle;
            case 'overtime_summary': return Hourglass;
            case 'payroll_summary': return ClipboardList;
            case 'tax_deduction_summary': return FileText;
            case 'compensation_breakdown': return DollarSign;
            case 'leave_balance_summary': return ListChecks;
            case 'leave_utilization': return BarChart3;
            case 'upcoming_leaves': return CalendarDays;
            default: return BarChart3;
        }
    };

    const ReportIcon = getReportIcon(reportId);

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <ReportIcon className="w-10 h-10 text-purple-600" /> {getReportTitle(reportId)}
                </h1>
                <Link to="/hr/Reports-Dashboard"> {/* Link back to the main reports dashboard */}
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Reports Dashboard
                    </Button>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Generating report...</p>
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
                    {/* Report Filters */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                            <Filter size={20} className="text-blue-500" /> Report Filters
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Select
                                label="Department"
                                name="filterDepartment"
                                options={mockDepartments}
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                icon={<Building2 size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Employee Status"
                                name="filterStatus"
                                options={mockStatuses}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                icon={<Briefcase size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Hire Year"
                                name="filterYear"
                                options={mockYears}
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                icon={<CalendarDays size={18} className="text-gray-400" />}
                            />
                            {/* Add more filters as needed based on the specific report */}
                        </div>
                    </Card>

                    {/* Report Content */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <TableIcon size={24} className="text-green-500" /> Report Data
                        </h2>
                        {filteredReportData.length > 0 ? (
                            <>
                                <Table columns={reportTableColumns} data={filteredReportData} />
                                <div className="mt-6 flex justify-end">
                                    <Button variant="outline" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                        <Download size={20} /> Export to CSV
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No data found for the selected filters.
                            </div>
                        )}
                    </Card>

                    {/* Charts and Visualizations */}
                    {reportId === 'employee_demographics' && (
                        <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white mt-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <PieChart size={24} className="text-orange-500" /> Gender Distribution
                            </h2>
                            <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                                (Placeholder for a Pie Chart showing Gender Distribution)
                                <pre className="text-xs text-gray-600 mt-2">{JSON.stringify(mockChartData.genderDistribution, null, 2)}</pre>
                            </div>
                        </Card>
                    )}

                    {reportId === 'department_breakdown' && (
                        <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white mt-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <BarChart3 size={24} className="text-teal-500" /> Employees by Department
                            </h2>
                            <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                                (Placeholder for a Bar Chart showing Departmental Breakdown)
                                <pre className="text-xs text-gray-600 mt-2">{JSON.stringify(mockChartData.departmentBreakdown, null, 2)}</pre>
                            </div>
                        </Card>
                    )}

                    {reportId === 'employee_tenure' && (
                        <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white mt-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <LineChart size={24} className="text-red-500" /> Employee Tenure Analysis
                            </h2>
                            <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                                (Placeholder for a Line Chart or Bar Chart showing Employee Tenure)
                                <pre className="text-xs text-gray-600 mt-2">{JSON.stringify(mockChartData.tenureAnalysis, null, 2)}</pre>
                            </div>
                        </Card>
                    )}

                    {reportId === 'employee_status' && (
                        <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white mt-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <BarChart3 size={24} className="text-indigo-500" /> Employee Status Breakdown
                            </h2>
                            <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                                (Placeholder for a Bar Chart showing Employee Status)
                                <pre className="text-xs text-gray-600 mt-2">{JSON.stringify(mockChartData.statusBreakdown, null, 2)}</pre>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default SpecificReportPage;
