// pages/ReportsManagement/ReportsDashboardPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    BarChart3, ArrowLeft, Users, CheckCircle, CalendarDays, DollarSign, ListChecks, ArrowRight,
    ClipboardList, FileText, TrendingUp, Clock, MessageSquare, AlertCircle,
    PieChart, LineChart, Table, Star , Building2, XCircle, Hourglass, Plane
} from 'lucide-react';

const ReportsDashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Inline Mock Data for Reports ---
    const mockReportCategories = [
        {
            id: 'employees',
            name: 'Employee Reports',
            icon: Users,
            description: 'Comprehensive reports on employee demographics, status, and tenure.',
            reports: [
                { id: 'employee_demographics', name: 'Employee Demographics', description: 'Breakdown by age, gender, nationality, marital status.', link: '/reports/employee/demographics', icon: PieChart },
                { id: 'employee_status', name: 'Employee Status & Headcount', description: 'Active, inactive, on leave counts; total headcount.', link: '/reports/employee/headcount', icon: BarChart3 },
                { id: 'employee_tenure', name: 'Employee Tenure Analysis', description: 'Average tenure, employees by years of service.', link: '/reports/employee/tenure', icon: LineChart },
                { id: 'department_breakdown', name: 'Departmental Breakdown', description: 'Employee distribution across departments.', link: '/reports/employee/department', icon: Building2 },
            ]
        },
        {
            id: 'performance',
            name: 'Performance Reports',
            icon: TrendingUp,
            description: 'Insights into employee performance, reviews, and feedback trends.',
            reports: [
                { id: 'review_completion_rates', name: 'Review Completion Rates', description: 'Track progress of performance review cycles.', link: '/reports/performance/completion', icon: CheckCircle },
                { id: 'average_ratings', name: 'Average Performance Ratings', description: 'Average ratings by department, job title, or overall.', link: '/reports/performance/ratings', icon: Star }, // Assuming Star icon from lucide
                { id: 'feedback_trends', name: 'Feedback Trends', description: 'Analysis of positive vs. constructive feedback over time.', link: '/reports/performance/feedback', icon: MessageSquare },
            ]
        },
        {
            id: 'attendance',
            name: 'Attendance Reports',
            icon: CalendarDays,
            description: 'Detailed reports on attendance, punctuality, and absence patterns.',
            reports: [
                { id: 'daily_attendance_summary', name: 'Daily Attendance Summary', description: 'Overview of daily clock-ins/outs, late arrivals, absences.', link: '/reports/attendance/daily', icon: Clock },
                { id: 'absence_rate', name: 'Absence Rate Analysis', description: 'Track absenteeism by employee, department, or reason.', link: '/reports/attendance/absence', icon: XCircle },
                { id: 'overtime_summary', name: 'Overtime Summary', description: 'Total overtime hours by employee or department.', link: '/reports/attendance/overtime', icon: Hourglass }, // Assuming Hourglass icon
            ]
        },
        {
            id: 'payroll',
            name: 'Payroll Reports',
            icon: DollarSign,
            description: 'Financial reports related to compensation, taxes, and deductions.',
            reports: [
                { id: 'payroll_summary', name: 'Payroll Summary by Period', description: 'Total gross, net, and deductions for a given pay period.', link: '/reports/payroll/summary', icon: ClipboardList },
                { id: 'tax_deduction_summary', name: 'Tax & Deduction Summary', description: 'Breakdown of taxes and other deductions.', link: '/reports/payroll/deductions', icon: FileText },
                { id: 'compensation_breakdown', name: 'Compensation Breakdown', description: 'Analysis of base salary, bonuses, and allowances.', link: '/reports/payroll/compensation', icon: DollarSign },
            ]
        },
        {
            id: 'leave-request',
            name: 'Leave Reports',
            icon: Plane, // Using Plane for leave, consistent with LeaveCalendarPage
            description: 'Reports on leave utilization, balances, and trends.',
            reports: [
                { id: 'leave_balance_summary', name: 'Leave Balance Summary', description: 'Current leave balances for all employees.', link: '/reports/leave/balances', icon: ListChecks },
                { id: 'leave_utilization', name: 'Leave Utilization by Type', description: 'How much of each leave type is being used.', link: '/reports/leave/utilization', icon: BarChart3 },
                { id: 'upcoming_leaves', name: 'Upcoming Leaves Overview', description: 'List of all approved upcoming leaves.', link: '/reports/leave/upcoming', icon: CalendarDays },
            ]
        },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate data fetch (no actual data to fetch for a dashboard, just mock structure)
            setLoading(false);
        }, 700);
    }, []);

    // Helper function to get a generic icon for a report if not specified
    const getDefaultReportIcon = (type) => {
        switch (type) {
            case 'table': return Table;
            case 'chart': return BarChart3;
            default: return FileText;
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <BarChart3 className="w-10 h-10 text-blue-600" /> HR Reports Dashboard
                </h1>
                <Link to="/hr/employees"> {/* Assuming a main dashboard */}
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading reports dashboard...</p>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {mockReportCategories.map(category => {
                        const CategoryIcon = category.icon;
                        return (
                            <Card key={category.id} className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col">
                                <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                                    <CategoryIcon size={32} className="text-purple-600 mr-4" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                                        <p className="text-sm text-gray-600">{category.description}</p>
                                    </div>
                                </div>
                                <div className="flex-grow space-y-4">
                                    {category.reports.length > 0 ? (
                                        category.reports.map(report => {
                                            const ReportIcon = report.icon || getDefaultReportIcon(report.type); // Use specific or default icon
                                            return (
                                                <Link key={report.id} to={report.link} className="block">
                                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 shadow-sm">
                                                        <ReportIcon size={20} className="text-blue-500 mr-3 flex-shrink-0" />
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-800">{report.name}</h3>
                                                            <p className="text-sm text-gray-600">{report.description}</p>
                                                        </div>
                                                        <ArrowRight size={20} className="text-gray-400 ml-auto flex-shrink-0" />
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 italic">No reports available in this category.</p>
                                    )}
                                </div>
                                {/* Optional: Add a "View All" button for the category if it leads to a dedicated page */}
                                 <div className="mt-6 text-right">
                                    <Link to={`/hr/${category.id}`}>
                                        <Button variant="link" className="text-blue-600 hover:underline flex items-center justify-end gap-1">
                                            View All {category.name} <ArrowRight size={16} />
                                        </Button>
                                    </Link>
                                </div> 
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ReportsDashboardPage;
