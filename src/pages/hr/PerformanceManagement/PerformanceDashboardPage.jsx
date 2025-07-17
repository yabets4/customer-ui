// pages/PerformanceManagement/PerformanceDashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card'; // Assuming Card component is styled with Tailwind
import Button from '../../../components/ui/Button'; // Assuming Button component is styled with Tailwind
import LoadingSpinner from '../../../components/ui/LoadingSpinner'; // Assuming LoadingSpinner component is styled with Tailwind
import Select from '../../../components/ui/Select'; // Assuming Select component is styled with Tailwind

// Lucide React Icons
import {
    Gauge, Star, CheckCircle, XCircle, DollarSign, Users, MessageSquare,
    CalendarCheck, ClipboardList, TrendingUp, TrendingDown, Clock, Target,
    FileText, ArrowRight, ThumbsUp, ThumbsDown, UserPlus, Info, Activity, LineChart, BarChart, Award
} from 'lucide-react';

const PerformanceDashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(''); // New state for department filter

    // --- Inline Mock Data for Performance Dashboard ---
    // Updated mock data to include department for filtering and a topPerformers list
    const mockPerformanceData = {
        overallSummary: {
            averageRating: 4.2, // Overall
            totalEmployeesReviewed: 150, // Overall
            reviewsDueSoon: 12, // Overall
            feedbackGivenLastMonth: 85, // Overall
            feedbackReceivedLastMonth: 120, // Overall
        },
        // KPIs now have a department associated for filtering
        kpiMetrics: [
            { id: 'kpi1', name: 'Task Completion Rate', value: 92, unit: '%', trend: 'up', description: 'Average task completion rate.', department: 'IT', icon: CheckCircle },
            { id: 'kpi2', name: 'Rework Rate', value: 3.5, unit: '%', trend: 'down', description: 'Percentage of tasks requiring rework.', department: 'Operations', icon: XCircle },
            { id: 'kpi3', name: 'Sales Conversion Rate', value: 15.2, unit: '%', trend: 'up', description: 'Average sales conversion rate.', department: 'Sales', icon: DollarSign },
            { id: 'kpi4', name: 'Overtime Hours', value: 250, unit: 'hours', trend: 'down', description: 'Total overtime hours logged.', department: 'HR', icon: Clock },
            { id: 'kpi5', name: 'Customer Satisfaction', value: 4.7, unit: '/5', trend: 'up', description: 'Average customer satisfaction score.', department: 'Customer Service', icon: Star },
            { id: 'kpi6', name: 'Employee Retention', value: 88, unit: '%', trend: 'up', description: 'Employee retention rate.', department: 'HR', icon: Users },
            { id: 'kpi7', name: 'Project Delivery On Time', value: 85, unit: '%', trend: 'up', description: 'Percentage of projects delivered on time.', department: 'IT', icon: CalendarCheck },
        ],
        recentReviews: [
            { id: 'rev-001', employeeName: 'Aisha Demisse', reviewDate: '2024-06-15', rating: 4.5, status: 'Completed', reviewer: 'John Smith', department: 'HR' },
            { id: 'rev-002', employeeName: 'Tesfaye Gebre', reviewDate: '2024-05-20', rating: 4.0, status: 'Completed', reviewer: 'Jane Doe', department: 'IT' },
            { id: 'rev-003', employeeName: 'Sara Ali', reviewDate: '2024-07-01', rating: null, status: 'Pending', reviewer: 'Aisha Demisse', department: 'Finance' },
            { id: 'rev-004', employeeName: 'Bereket Wondwosen', reviewDate: '2024-07-10', rating: 3.8, status: 'Completed', reviewer: 'Manager X', department: 'Operations' },
            { id: 'rev-005', employeeName: 'Kebede Mekonnen', reviewDate: '2024-07-15', rating: null, status: 'Pending', reviewer: 'HR Dept.', department: 'HR' },
        ],
        recentFeedback: [
            { id: 'fb-001', from: 'John Smith', to: 'Aisha Demisse', date: '2024-07-08', type: 'positive', content: 'Excellent leadership on the recent project, truly inspiring!', department: 'HR' },
            { id: 'fb-002', from: 'Tesfaye Gebre', to: 'Sara Ali', date: '2024-07-05', type: 'constructive', content: 'Consider improving documentation for code modules to enhance team collaboration.', department: 'IT' },
            { id: 'fb-003', from: 'Manager X', to: 'Tesfaye Gebre', date: '2024-07-01', type: 'positive', content: 'Great initiative in solving the critical bug, saved us a lot of time.', department: 'IT' },
            { id: 'fb-004', from: 'Sara Ali', to: 'Bereket Wondwosen', date: '2024-06-28', type: 'positive', content: 'Always willing to help out and share knowledge. A valuable team player.', department: 'Finance' },
            { id: 'fb-005', from: 'Aisha Demisse', to: 'Kebede Mekonnen', date: '2024-06-25', type: 'constructive', content: 'Focus on time management for upcoming deadlines to avoid last-minute rushes.', department: 'HR' },
        ],
        topPerformers: [
            { id: 'tp-001', name: 'Aisha Demisse', department: 'HR', rating: 4.8 },
            { id: 'tp-002', name: 'Tesfaye Gebre', department: 'IT', rating: 4.7 },
            { id: 'tp-003', name: 'Bereket Wondwosen', department: 'Operations', rating: 4.6 },
            { id: 'tp-004', name: 'John Smith', department: 'Sales', rating: 4.5 },
            { id: 'tp-005', name: 'Jane Doe', department: 'Finance', rating: 4.4 },
        ]
    };
    // --- End Inline Mock Data ---

    // Derive unique departments for the filter dropdown
    const allDepartments = useMemo(() => {
        const departments = new Set();
        mockPerformanceData.kpiMetrics.forEach(kpi => departments.add(kpi.department));
        mockPerformanceData.recentReviews.forEach(review => departments.add(review.department));
        mockPerformanceData.recentFeedback.forEach(feedback => departments.add(feedback.department));
        mockPerformanceData.topPerformers.forEach(performer => departments.add(performer.department));

        return [{ value: '', label: 'All Departments' }, ...Array.from(departments).sort().map(dept => ({ value: dept, label: dept }))];
    }, []);

    // Filtered data based on selectedDepartment
    const filteredKpiMetrics = useMemo(() => {
        if (!selectedDepartment) return mockPerformanceData.kpiMetrics;
        return mockPerformanceData.kpiMetrics.filter(kpi => kpi.department === selectedDepartment);
    }, [selectedDepartment]);

    const filteredRecentReviews = useMemo(() => {
        if (!selectedDepartment) return mockPerformanceData.recentReviews;
        return mockPerformanceData.recentReviews.filter(review => review.department === selectedDepartment);
    }, [selectedDepartment]);

    const filteredRecentFeedback = useMemo(() => {
        if (!selectedDepartment) return mockPerformanceData.recentFeedback;
        return mockPerformanceData.recentFeedback.filter(feedback => feedback.department === selectedDepartment);
    }, [selectedDepartment]);

    const filteredTopPerformers = useMemo(() => {
        if (!selectedDepartment) return mockPerformanceData.topPerformers;
        return mockPerformanceData.topPerformers.filter(performer => performer.department === selectedDepartment);
    }, [selectedDepartment]);


    useEffect(() => {
        // Simulate data fetching
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setLoading(false);
        }, 700);
    }, []);

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp size={18} className="text-green-500 dark:text-green-400" />;
        if (trend === 'down') return <TrendingDown size={18} className="text-red-500 dark:text-red-400" />;
        return <Info size={18} className="text-gray-400 dark:text-gray-500" />; // Neutral icon
    };

    const getFeedbackTypeBadge = (type) => {
        if (type === 'positive') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <ThumbsUp size={14} className="mr-1" /> Positive
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                <ThumbsDown size={14} className="mr-1" /> Constructive
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative shadow-md" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <Gauge className="w-11 h-11 text-purple-600 dark:text-purple-400" /> Performance Dashboard
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/performance/review-form" className="w-full">
                        <Button variant="primary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform  text-white">
                            <UserPlus size={20} /> Initiate Review
                        </Button>
                    </Link>
                    <Link to="/performance/feedback-log" className="w-full">
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <MessageSquare size={20} /> View Feedback Log
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Department Filter */}
            <div className="mb-8 flex justify-end">
                <div className="w-full sm:w-64">
                    <Select
                        options={allDepartments}
                        value={selectedDepartment}
                        onChange={(value) => setSelectedDepartment(value)}
                        placeholder="Filter by Department"
                        className="w-full"
                    />
                </div>
            </div>

            {/* Overall Performance Summary Cards (These remain global for simplicity in this mock) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Average Rating */}
                <Card className="p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 mb-4">
                        <Star size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Average Rating</h3>
                    <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{mockPerformanceData.overallSummary.averageRating}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">out of 5</p>
                </Card>

                {/* Employees Reviewed */}
                <Card className="p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
                        <Users size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Employees Reviewed</h3>
                    <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{mockPerformanceData.overallSummary.totalEmployeesReviewed}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">total</p>
                </Card>

                {/* Reviews Due Soon */}
                <Card className="p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 mb-4">
                        <CalendarCheck size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Reviews Due Soon</h3>
                    <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{mockPerformanceData.overallSummary.reviewsDueSoon}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">in next 30 days</p>
                </Card>

                {/* Feedback Interactions */}
                <Card className="p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center transform hover:scale-[1.02] transition-transform duration-200">
                    <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 mb-4">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Feedback Interactions</h3>
                    <p className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{mockPerformanceData.overallSummary.feedbackGivenLastMonth + mockPerformanceData.overallSummary.feedbackReceivedLastMonth}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">last month</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KPI Tracking */}
                <Card className="lg:col-span-2 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Target size={28} className="text-blue-600 dark:text-blue-400" /> Key Performance Indicators
                    </h2>
                    {filteredKpiMetrics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredKpiMetrics.map((metric) => (
                                <div key={metric.id} className="flex flex-col p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-transform hover:scale-[1.01] duration-150">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {/* Render specific icon based on metric.icon property */}
                                            {metric.icon && React.createElement(metric.icon, { size: 24, className: "text-current" })}
                                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
                                                {metric.name}
                                            </p>
                                        </div>
                                        {getTrendIcon(metric.trend)}
                                    </div>
                                    <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{metric.value}{metric.unit}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{metric.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-6">No KPI data for the selected department.</p>
                    )}
                </Card>

                {/* Recent Formal Reviews */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <ClipboardList size={28} className="text-orange-600 dark:text-orange-400" /> Recent Reviews
                    </h2>
                    {filteredRecentReviews.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredRecentReviews.map(review => (
                                <li key={review.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-transform hover:scale-[1.01] duration-150">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{review.employeeName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Reviewer: <span className="font-medium">{review.reviewer}</span></p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Date: {review.reviewDate}</p>
                                    </div>
                                    <div className="flex flex-col items-end text-right ml-4">
                                        {review.rating ? (
                                            <span className="inline-flex items-center text-xl font-bold text-yellow-600 dark:text-yellow-400">
                                                {review.rating} <Star size={20} className="ml-1" fill="currentColor" />
                                            </span>
                                        ) : (
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Not Rated Yet</span>
                                        )}
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${review.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {review.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-6">No recent reviews to display for the selected department.</p>
                    )}
                    <div className="mt-8 text-right">
                        <Link to="/performance/review-form">
                            <Button variant="link" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-end gap-1 font-medium">
                                View All Reviews <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Top Performers Section */}
                <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <Award size={28} className="text-yellow-600 dark:text-yellow-400" /> Top Performers
                    </h2>
                    {filteredTopPerformers.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredTopPerformers.map(performer => (
                                <li key={performer.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-transform hover:scale-[1.01] duration-150">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300">
                                            <Star size={18} fill="currentColor" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{performer.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{performer.department}</p>
                                        </div>
                                    </div>
                                    <span className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{performer.rating}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-6">No top performers to display for the selected department.</p>
                    )}
                    {/* Optional: Link to a full list of performers */}
                    {/* <div className="mt-8 text-right">
                        <Link to="/performance/top-performers">
                            <Button variant="link" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-end gap-1 font-medium">
                                View All Top Performers <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div> */}
                </Card>

                {/* Recent Feedback Log - This remains a full width section below */}
                <Card className="lg:col-span-3 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-6">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <MessageSquare size={28} className="text-pink-600 dark:text-pink-400" /> Recent Feedback
                    </h2>
                    {filteredRecentFeedback.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredRecentFeedback.map(feedback => (
                                <li key={feedback.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-transform hover:scale-[1.01] duration-150">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">{feedback.from}</span> gave feedback to <span className="font-semibold text-gray-900 dark:text-gray-100">{feedback.to}</span>
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{feedback.date}</span>
                                    </div>
                                    <p className="text-md text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">{feedback.content}</p>
                                    <div className="flex items-center">
                                        {getFeedbackTypeBadge(feedback.type)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-6">No recent feedback to display for the selected department.</p>
                    )}
                    <div className="mt-8 text-right">
                        <Link to="/performance/feedback-log">
                            <Button variant="link" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-end gap-1 font-medium">
                                View Full Feedback Log <ArrowRight size={18} />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PerformanceDashboardPage;
