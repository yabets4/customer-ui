import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, CalendarDays, User, ClipboardList, AlertCircle, Briefcase, Info, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const mockEmployees = [
    { id: 'emp-001', fullName: 'Mr x', jobTitle: 'Senior HR Manager', department: 'Human Resources', profilePhoto: 'data:image/jpeg;base64,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' },
    { id: 'emp-002', fullName: 'Tesfaye Gebre', jobTitle: 'Software Engineer', department: 'IT', profilePhoto: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'emp-003', fullName: 'Sara Ali', jobTitle: 'Marketing Specialist', department: 'Marketing', profilePhoto: 'https://placehold.co/150x150/FFD1DC/6B21A8?text=SA' },
    { id: 'emp-004', fullName: 'Kebede Worku', jobTitle: 'Financial Analyst', department: 'Finance', profilePhoto: 'https://placehold.co/150x150/C3DAFE/1E40AF?text=KW' },
];

const mockReviews = [
    {
        id: 'rev-001',
        employeeId: 'emp-001',
        reviewer: { id: 'mgr-001', name: 'John Smith', role: 'HR Director' },
        date: '2025-06-15',
        rating: 2,
        feedback: 'Aisha consistently exceeds expectations in strategic HR initiatives. Her leadership in the recent talent acquisition drive was instrumental in securing top-tier candidates. She fosters a positive and productive team environment.',
        areasOfStrength: ['Strategic Planning', 'Team Leadership', 'Talent Acquisition', 'Communication'],
        areasForDevelopment: ['Delegation of minor tasks'],
        nextSteps: 'Continue to empower team members with more autonomy on routine tasks.',
    },
    {
        id: 'rev-002',
        employeeId: 'emp-001',
        reviewer: { id: 'lead-001', name: 'Jane Doe', role: 'Project Lead' },
        date: '2025-03-20',
        rating: 4,
        feedback: 'Aisha is a highly collaborative and reliable team member. Her contributions to cross-departmental projects are invaluable, and she consistently delivers high-quality work on time. Her problem-solving skills are excellent.',
        areasOfStrength: ['Collaboration', 'Problem Solving', 'Reliability', 'Quality of Work'],
        areasForDevelopment: ['Proactive communication on potential roadblocks'],
        nextSteps: 'Encourage more frequent updates on project challenges, even minor ones.',
    },
    {
        id: 'rev-003',
        employeeId: 'emp-002',
        reviewer: { id: 'lead-002', name: 'Michael Brown', role: 'Tech Lead' },
        date: '2025-06-10',
        rating: 3,
        feedback: 'Tesfaye has shown significant improvement in coding standards and adherence to best practices. He needs to focus on improving punctuality for daily stand-ups and meeting deadlines for smaller tasks.',
        areasOfStrength: ['Coding Standards', 'Technical Skills', 'Learning Agility'],
        areasForDevelopment: ['Punctuality', 'Time Management'],
        nextSteps: 'Implement a strict routine for daily meetings and use task management tools more effectively.',
    },
    {
        id: 'rev-004',
        employeeId: 'emp-003',
        reviewer: { id: 'mgr-001', name: 'John Smith', role: 'HR Director' },
        date: '2025-05-01',
        rating: 5,
        feedback: 'Sara consistently delivers innovative marketing campaigns that exceed targets. Her creativity and attention to detail are exceptional.',
        areasOfStrength: ['Creativity', 'Campaign Management', 'Attention to Detail'],
        areasForDevelopment: ['Mentoring junior team members'],
        nextSteps: 'Lead a workshop on innovative marketing strategies.',
    },
    {
        id: 'rev-005',
        employeeId: 'emp-004',
        reviewer: { id: 'mgr-002', name: 'Jane Doe', role: 'Finance Head' },
        date: '2025-04-20',
        rating: 2,
        feedback: 'Kebede provides thorough financial analysis and is a key asset to the team. Needs to improve presentation skills for executive summaries.',
        areasOfStrength: ['Financial Analysis', 'Accuracy', 'Problem Solving'],
        areasForDevelopment: ['Presentation Skills', 'Public Speaking'],
        nextSteps: 'Enroll in a public speaking course and practice presentations with team.',
    },
];

const PerformanceReviewPage = () => {
    const { employeeId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const foundEmployee = mockEmployees.find(emp => emp.id === employeeId);
            if (!foundEmployee) {
                setError('Employee not found.');
                setLoading(false);
                return;
            }
            setEmployeeInfo(foundEmployee);

            const employeeReviews = mockReviews.filter(r => r.employeeId === employeeId);
            if (employeeReviews.length === 0) {
                setError('No performance reviews found for this employee.');
            }
            setReviews(employeeReviews);
            setLoading(false);
        }, 700);
    }, [employeeId]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={20}
                fill={i < rating ? 'currentColor' : 'none'}
                stroke="currentColor"
                className="text-yellow-400 dark:text-yellow-300"
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <LoadingSpinner />
                <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading performance reviews...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen container mx-auto p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex items-center">
                    <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                    <div>
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                </div>
                <Link to="/hr/employees"> {/* Changed back to /employees for general list */}
                    <Button variant="secondary" className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Employee List
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <ClipboardList className="w-11 h-11 text-blue-600 dark:text-blue-400" /> Performance Reviews
                </h1>
                <Link to="/hr/employees" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Employee List
                    </Button>
                </Link>
            </div>

            {/* Employee Profile Summary */}
            {employeeInfo && (
                <Card className="mb-10 p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex-shrink-0">
                        <img
                            src={employeeInfo.profilePhoto || 'https://placehold.co/150x150/E0F2F7/334155?text=No+Photo'}
                            alt={employeeInfo.fullName}
                            className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-xl transition-transform duration-300 hover:scale-105"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/E0F2F7/334155?text=No+Photo'; }}
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">
                            {employeeInfo.fullName}
                        </h2>
                        <p className="text-xl text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center md:justify-start gap-2">
                            <Briefcase size={20} className="text-purple-500 dark:text-purple-400" /> {employeeInfo.jobTitle} - {employeeInfo.department}
                        </p>
                        <p className="text-md text-gray-600 dark:text-gray-400 mb-3 flex items-center justify-center md:justify-start gap-2">
                            <User size={18} className="text-gray-500 dark:text-gray-400" /> Employee ID: {employeeInfo.id}
                        </p>
                        {/* Optional: Add a button to add new review for this employee */}
                        <Link to='/hr/review-form'>
                        <Button variant="primary" className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <Star size={20} /> Add New Review
                        </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {reviews.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map(review => (
                        <Card key={review.id} className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-md text-gray-700 dark:text-gray-300">
                                        <User size={18} className="text-blue-500 dark:text-blue-400" />
                                        <span className="font-semibold">{review.reviewer.name}</span> ({review.reviewer.role})
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <CalendarDays size={16} /> {review.date}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mb-4">
                                    {renderStars(review.rating)}
                                    <span className="ml-2 text-lg font-bold text-gray-900 dark:text-gray-100">{review.rating}/5</span>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-4">
                                    {review.feedback}
                                </p>

                                {review.areasOfStrength && review.areasOfStrength.length > 0 && (
                                    <div className="mb-3">
                                        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                            <TrendingUp size={16} className="text-green-500" /> Strengths:
                                        </h4>
                                        <ul className="list-none space-y-1 pl-0">
                                            {review.areasOfStrength.map((area, index) => (
                                                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                    <CheckCircle size={14} className="text-green-400" /> {area}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {review.areasForDevelopment && review.areasForDevelopment.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                            <TrendingDown size={16} className="text-orange-500" /> Areas for Development:
                                        </h4>
                                        <ul className="list-none space-y-1 pl-0">
                                            {review.areasForDevelopment.map((area, index) => (
                                                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                    <Info size={14} className="text-orange-400" /> {area}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {review.nextSteps && (
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                            <Lightbulb size={16} className="text-purple-500" /> Next Steps:
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{review.nextSteps}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 font-medium">No performance reviews found.</p>
                    <p className="text-md text-gray-500 dark:text-gray-400 mt-2">It looks like there are no reviews recorded for {employeeInfo?.fullName || 'this employee'} yet.</p>
                </div>
            )}
        </div>
    );
};

export default PerformanceReviewPage;
