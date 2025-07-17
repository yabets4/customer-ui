// pages/PerformanceManagement/FeedbackLog.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    MessageSquare, ArrowLeft, User, Filter, AlertCircle, CalendarDays, CheckCircle, XCircle,
    Star, ThumbsUp, ThumbsDown, Info, Clock, Edit, Trash2
} from 'lucide-react';

const FeedbackLog = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmployeeId, setFilterEmployeeId] = useState('all');
    const [filterFeedbackType, setFilterFeedbackType] = useState('all');
    const [filterDateRange, setFilterDateRange] = useState('all'); // e.g., 'all', 'last_30_days', 'this_year'

    // --- Inline Mock Data ---
    const mockFeedbackEntries = [
        {
            id: 'fb-001',
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            giver: { id: 'mgr-001', name: 'John Smith', role: 'Manager' },
            type: 'Positive', // Positive, Constructive, General
            date: '2025-07-10',
            subject: 'Excellent project leadership',
            details: 'Aisha demonstrated exceptional leadership in the recent HR system implementation project, ensuring smooth coordination and timely delivery.',
        },
        {
            id: 'fb-002',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            giver: { id: 'mgr-001', name: 'John Smith', role: 'Manager' },
            type: 'Constructive',
            date: '2025-07-05',
            subject: 'Improvement in code documentation',
            details: 'Tesfaye\'s recent code submissions are great, but more detailed inline comments would benefit future maintenance.',
        },
        {
            id: 'fb-003',
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            giver: { id: 'col-001', name: 'Sara Ali', role: 'Colleague' },
            type: 'General',
            date: '2025-06-28',
            subject: 'Helpful advice on policy',
            details: 'Aisha provided clear and concise advice regarding the new leave policy.',
        },
        {
            id: 'fb-004',
            employee: { id: 'emp-003', name: 'Sara Ali' },
            giver: { id: 'mgr-002', name: 'Jane Doe', role: 'Manager' },
            type: 'Positive',
            date: '2025-06-20',
            subject: 'Outstanding client presentation',
            details: 'Sara\'s presentation to the new client was very professional and engaging, securing the contract.',
        },
        {
            id: 'fb-005',
            employee: { id: 'emp-004', name: 'Kebede Worku' },
            giver: { id: 'mgr-002', name: 'Jane Doe', role: 'Manager' },
            type: 'Constructive',
            date: '2025-05-15',
            subject: 'Time management for reports',
            details: 'Kebede needs to improve consistency in submitting weekly reports on time.',
        },
        {
            id: 'fb-006',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            giver: { id: 'col-002', name: 'Michael Brown', role: 'Colleague' },
            type: 'Positive',
            date: '2025-07-01',
            subject: 'Quick support on network issue',
            details: 'Tesfaye was very quick to resolve my network connectivity problem, minimizing downtime.',
        },
    ];

    const mockEmployeesForFilter = [
        { value: 'all', label: 'All Employees' },
        { value: 'emp-001', label: 'Aisha Demisse' },
        { value: 'emp-002', label: 'Tesfaye Gebre' },
        { value: 'emp-003', label: 'Sara Ali' },
        { value: 'emp-004', label: 'Kebede Worku' },
    ];

    const mockFeedbackTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'Positive', label: 'Positive' },
        { value: 'Constructive', label: 'Constructive' },
        { value: 'General', label: 'General' },
    ];

    const mockDateRanges = [
        { value: 'all', label: 'All Time' },
        { value: 'last_30_days', label: 'Last 30 Days' },
        { value: 'this_month', label: 'This Month' },
        { value: 'this_year', label: 'This Year' },
        { value: 'last_year', label: 'Last Year' },
    ];
    // --- End Inline Mock Data ---

    const [feedbackEntries, setFeedbackEntries] = useState(mockFeedbackEntries);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate data fetch
            setFeedbackEntries(mockFeedbackEntries);
            setLoading(false);
        }, 700);
    }, []);

    const filteredFeedback = useMemo(() => {
        let filtered = feedbackEntries;

        // Search by employee name, giver name, or subject
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(entry =>
                entry.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.giver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.subject.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by employee
        if (filterEmployeeId !== 'all') {
            filtered = filtered.filter(entry => entry.employee.id === filterEmployeeId);
        }

        // Filter by feedback type
        if (filterFeedbackType !== 'all') {
            filtered = filtered.filter(entry => entry.type === filterFeedbackType);
        }

        // Filter by date range
        const today = new Date();
        filtered = filtered.filter(entry => {
            const entryDate = new Date(entry.date);
            switch (filterDateRange) {
                case 'last_30_days':
                    const thirtyDaysAgo = new Date(today);
                    thirtyDaysAgo.setDate(today.getDate() - 30);
                    return entryDate >= thirtyDaysAgo && entryDate <= today;
                case 'this_month':
                    return entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear();
                case 'this_year':
                    return entryDate.getFullYear() === today.getFullYear();
                case 'last_year':
                    return entryDate.getFullYear() === today.getFullYear() - 1;
                case 'all':
                default:
                    return true;
            }
        });

        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent date
    }, [feedbackEntries, searchTerm, filterEmployeeId, filterFeedbackType, filterDateRange]);

    const getFeedbackTypeClasses = (type) => {
        switch (type) {
            case 'Positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Constructive': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'General': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getFeedbackTypeIcon = (type) => {
        switch (type) {
            case 'Positive': return <ThumbsUp size={16} className="text-green-500" />;
            case 'Constructive': return <ThumbsDown size={16} className="text-orange-500" />;
            case 'General': return <Info size={16} className="text-blue-500" />;
            default: return <MessageSquare size={16} className="text-gray-500" />;
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterEmployeeId('all');
        setFilterFeedbackType('all');
        setFilterDateRange('all');
    };

    const handleEdit = (id) => {
        alert(`Edit feedback entry: ${id}`);
        // In a real app, this would navigate to an edit form
    };

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete feedback entry ${id}?`)) {
            setFeedbackEntries(prev => prev.filter(entry => entry.id !== id));
            alert(`Feedback entry ${id} deleted.`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <MessageSquare className="w-11 h-11 text-purple-600 dark:text-purple-400" /> Feedback Log
                </h1>
                <Link to="/hr/performance" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Performance
                    </Button>
                </Link>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading feedback entries...</p>
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
                            <Filter size={28} className="text-teal-600 dark:text-teal-400" /> Filter Feedback
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Input
                                label="Search by Employee/Giver/Subject"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
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
                                label="Filter by Feedback Type"
                                name="filterFeedbackType"
                                options={mockFeedbackTypes}
                                value={filterFeedbackType}
                                onChange={(value) => setFilterFeedbackType(value)}
                                icon={<Star size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Filter by Date Range"
                                name="filterDateRange"
                                options={mockDateRanges}
                                value={filterDateRange}
                                onChange={(value) => setFilterDateRange(value)}
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

                    {/* Feedback List */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <MessageSquare size={28} className="text-purple-600 dark:text-purple-400" /> All Feedback Entries
                        </h2>
                        {filteredFeedback.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredFeedback.map(entry => (
                                    <div key={entry.id} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                {getFeedbackTypeIcon(entry.type)}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFeedbackTypeClasses(entry.type)}`}>
                                                    {entry.type}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{entry.subject}</h3>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center gap-2">
                                                <User size={16} /> <span className="font-medium">To: {entry.employee.name}</span>
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 flex items-center gap-2">
                                                <User size={16} /> <span className="font-medium">From: {entry.giver.name} ({entry.giver.role})</span>
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                                {entry.details}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <CalendarDays size={12} /> {entry.date}
                                            </p>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(entry.id)}
                                                    className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                    <Edit size={16} />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}
                                                    className="p-1.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 transition-colors">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg font-medium">
                                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                No feedback entries found matching your criteria.
                                <p className="text-sm mt-2">Try adjusting your filters or add new feedback.</p>
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default FeedbackLog;
