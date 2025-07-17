// pages/PerformanceManagement/FeedbackLogPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    MessageSquare, ClipboardList,  ArrowLeft, User, Calendar, Search, Filter, ThumbsUp, ThumbsDown, AlertCircle
} from 'lucide-react';

const FeedbackLogPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'positive', 'constructive'
    const [filterEmployeeId, setFilterEmployeeId] = useState(''); // Filter by employee involved

    // --- Inline Mock Data for Feedback Log ---
    const mockFeedbackEntries = [
        {
            id: 'fb-001',
            fromEmployee: { id: 'manager-001', name: 'John Smith' },
            toEmployee: { id: 'emp-001', name: 'Aisha Demisse' },
            date: '2024-07-08',
            type: 'positive', // 'positive', 'constructive'
            content: 'Excellent leadership and proactive problem-solving on the recent HR policy implementation project. Aisha effectively guided her team through complex changes.',
        },
        {
            id: 'fb-002',
            fromEmployee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            toEmployee: { id: 'emp-003', name: 'Sara Ali' },
            date: '2024-07-05',
            type: 'constructive',
            content: 'Consider improving documentation for new code modules. While the code is functional, comprehensive documentation would greatly assist future maintenance and onboarding.',
        },
        {
            id: 'fb-003',
            fromEmployee: { id: 'manager-002', name: 'Jane Doe' },
            toEmployee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            date: '2024-07-01',
            type: 'positive',
            content: 'Great initiative in solving the critical database performance issue last week. Your quick action prevented potential downtime.',
        },
        {
            id: 'fb-004',
            fromEmployee: { id: 'emp-001', name: 'Aisha Demisse' },
            toEmployee: { id: 'emp-004', name: 'Kebede Worku' },
            date: '2024-06-28',
            type: 'constructive',
            content: 'Please ensure all attendance logs are reconciled by end of day. Timely updates are crucial for payroll processing.',
        },
        {
            id: 'fb-005',
            fromEmployee: { id: 'emp-003', name: 'Sara Ali' },
            toEmployee: { id: 'manager-001', name: 'John Smith' },
            date: '2024-06-20',
            type: 'positive',
            content: 'Thank you for the clear guidance on the new project scope. It helped me prioritize my tasks effectively.',
        },
    ];
    // --- End Inline Mock Data ---

    const mockEmployeesForFilter = [
        { value: '', label: 'All Employees' },
        { value: 'emp-001', label: 'Aisha Demisse' },
        { value: 'emp-002', label: 'Tesfaye Gebre' },
        { value: 'emp-003', label: 'Sara Ali' },
        { value: 'emp-004', label: 'Kebede Worku' },
        { value: 'manager-001', label: 'John Smith (Manager)' },
        { value: 'manager-002', label: 'Jane Doe (Manager)' },
    ];

    const feedbackTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'positive', label: 'Positive' },
        { value: 'constructive', label: 'Constructive' },
    ];

    useEffect(() => {
        // Simulate data fetching
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // In a real app, you'd fetch this data from your backend with filters
            setLoading(false);
        }, 700);
    }, []); // No dependencies here, as filtering is done client-side on mock data

    const filteredFeedback = mockFeedbackEntries.filter(entry => {
        const matchesSearchTerm = searchTerm.trim() === '' ||
            entry.fromEmployee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.toEmployee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || entry.type === filterType;

        const matchesEmployee = filterEmployeeId === '' ||
            entry.fromEmployee.id === filterEmployeeId ||
            entry.toEmployee.id === filterEmployeeId;

        return matchesSearchTerm && matchesType && matchesEmployee;
    });

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <MessageSquare className="w-10 h-10 text-indigo-600" /> Feedback Log
                </h1>
                <Link to="/performance">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading feedback entries...</p>
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
                    {/* Filter and Search Section */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Search Feedback"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or content..."
                                icon={<Search size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Type"
                                name="filterType"
                                options={feedbackTypes}
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                icon={<Filter size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Employee"
                                name="filterEmployeeId"
                                options={mockEmployeesForFilter}
                                value={filterEmployeeId}
                                onChange={(e) => setFilterEmployeeId(e.target.value)}
                                icon={<User size={18} className="text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {/* Feedback List */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <ClipboardList size={24} className="text-purple-500" /> All Feedback Entries
                        </h2>
                        {filteredFeedback.length > 0 ? (
                            <ul className="space-y-6">
                                {filteredFeedback.map(feedback => (
                                    <li key={feedback.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                <User size={20} className="text-gray-600" />
                                                <span className="text-blue-600">{feedback.fromEmployee.name}</span>
                                                <span className="text-gray-500 font-normal text-base mx-1">gave feedback to</span>
                                                <span className="text-blue-600">{feedback.toEmployee.name}</span>
                                            </p>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar size={16} /> {feedback.date}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mb-3">{feedback.content}</p>
                                        <div className="flex items-center text-sm">
                                            {feedback.type === 'positive' ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <ThumbsUp size={16} className="mr-1" /> Positive Feedback
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    <ThumbsDown size={16} className="mr-1" /> Constructive Feedback
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No feedback entries found matching your criteria.
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default FeedbackLogPage;
