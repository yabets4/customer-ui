// pages/PerformanceManagement/ReviewFormPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input'; // Ensure this path is correct
import Select from '../../../components/ui/Select'; // Ensure this path is correct
import LoadingSpinner from '../../../components/ui/LoadingSpinner'; // Ensure this path is correct
import Card from '../../../components/ui/Card'; // Ensure this path is correct

// Lucide React Icons
import {
    FileText, User, Calendar, Star, MessageSquare, Target, CheckSquare,
    ClipboardList, Plus, Minus, Save, ArrowLeft, Users, Paperclip, AlertCircle,
    UserCheck, Clock, ListChecks, Award, Briefcase, Zap, Activity, Lightbulb , ArrowRight, 
} from 'lucide-react';

const ReviewFormPage = () => {
    const { id } = useParams(); // Review ID for editing, if available
    const navigate = useNavigate();
    const isEditMode = !!id;

    // --- Inline Mock Data ---
    const mockEmployees = [
        { value: '', label: 'Select Employee' },
        { value: 'emp-001', label: 'Aisha Demisse (HR Manager)' },
        { value: 'emp-002', label: 'Tesfaye Gebre (Software Engineer)' },
        { value: 'emp-003', label: 'Sara Ali (Financial Analyst)' },
        { value: 'emp-004', label: 'Kebede Worku (Operations Lead)' },
    ];

    const mockReviewTypes = [
        { value: '', label: 'Select Review Type' },
        { value: 'annual', label: 'Annual Performance Review' },
        { value: 'quarterly', label: 'Quarterly Review' },
        { value: 'probation', label: 'Probation Review' },
        { value: 'mid-year', label: 'Mid-Year Review' },
        { value: 'ad-hoc', label: 'Ad-Hoc Review' },
    ];

    const mockRatingScale = [
        { value: '', label: 'Select Rating' },
        { value: '1', label: '1 - Needs Improvement' },
        { value: '2', label: '2 - Developing' },
        { value: '3', label: '3 - Meets Expectations' },
        { value: '4', label: '4 - Exceeds Expectations' },
        { value: '5', label: '5 - Outstanding' },
    ];

    const mockPerformanceAreas = [
        { id: 'job_knowledge', name: 'Job Knowledge & Expertise', description: 'Demonstrates understanding of job requirements and technical skills.' },
        { id: 'communication', name: 'Communication', description: 'Effectively conveys information and listens actively.' },
        { id: 'problem_solving', name: 'Problem Solving', description: 'Identifies issues, analyzes problems, and develops solutions.' },
        { id: 'teamwork', name: 'Teamwork & Collaboration', description: 'Works effectively with others to achieve common goals.' },
        { id: 'adaptability', name: 'Adaptability', description: 'Adjusts to changing priorities and work environments.' },
        { id: 'leadership', name: 'Leadership', description: 'Guides and motivates others, takes initiative, and fosters a positive team environment.' },
        { id: 'innovation', name: 'Innovation', description: 'Generates new ideas, approaches challenges creatively, and implements novel solutions.' },
    ];

    // Mock existing reviews for edit mode
    const inlineMockReviews = [
        {
            id: 'rev-001',
            employeeId: 'emp-001',
            employeeName: 'Aisha Demisse',
            reviewType: 'annual',
            reviewDate: '2024-06-15',
            reviewPeriodStart: '2023-07-01',
            reviewPeriodEnd: '2024-06-30',
            reviewerId: 'manager-001', // Placeholder for reviewer ID
            reviewerName: 'John Smith',
            performanceRatings: {
                job_knowledge: { rating: '4', comments: 'Consistently demonstrates deep understanding of HR policies and best practices.' },
                communication: { rating: '5', comments: 'Exceptional communication skills, both written and verbal. Leads team meetings effectively.' },
                problem_solving: { rating: '4', comments: 'Proactive in identifying and resolving complex employee relations issues.' },
                teamwork: { rating: '4', comments: 'Highly collaborative and supportive of team members.' },
                adaptability: { rating: '4', comments: 'Adapts well to new HR regulations and organizational changes.' },
                leadership: { rating: '4', comments: 'Mentors junior staff and takes initiative on new projects.' },
                innovation: { rating: '3', comments: 'Open to new ideas, but could proactively suggest more novel solutions.' },
            },
            overallRating: '4',
            overallComments: 'Aisha is a highly valuable asset to the HR team. Her leadership and expertise are commendable. She consistently exceeds expectations in her core responsibilities and is a strong team player.',
            goals: [
                { description: 'Develop and implement new employee onboarding program.', status: 'Completed' },
                { description: 'Reduce employee turnover by 10% in the next fiscal year.', status: 'In Progress' },
                { description: 'Lead a cross-departmental training initiative.', status: 'Not Started' },
            ],
            developmentPlan: 'Attend advanced leadership training. Mentor junior HR staff. Explore opportunities for cross-functional project leadership.',
            employeeComments: 'I appreciate the comprehensive feedback and look forward to implementing the development plan. I am particularly excited about the leadership training.',
            attachments: [
                { name: 'Aisha_Performance_Review_2024.pdf', url: 'https://placehold.co/300x200/FF0000/FFFFFF?text=PDF' },
                { name: 'Project_Report_Q2.xlsx', url: 'https://placehold.co/300x200/00FF00/FFFFFF?text=XLSX' }
            ],
        },
        {
            id: 'rev-002',
            employeeId: 'emp-002',
            employeeName: 'Tesfaye Gebre',
            reviewType: 'quarterly',
            reviewDate: '2024-05-20',
            reviewPeriodStart: '2024-03-01',
            reviewPeriodEnd: '2024-05-31',
            reviewerId: 'manager-002',
            reviewerName: 'Jane Doe',
            performanceRatings: {
                job_knowledge: { rating: '3', comments: 'Solid understanding of core development principles.' },
                communication: { rating: '3', comments: 'Communicates clearly in daily stand-ups.' },
                problem_solving: { rating: '4', comments: 'Demonstrated strong problem-solving skills on recent bug fixes.' },
                teamwork: { rating: '3', comments: 'Collaborates well within the sprint team.' },
                adaptability: { rating: '3', comments: 'Adapts to new tech stacks as required.' },
                leadership: { rating: '2', comments: 'Needs to take more initiative in team discussions.' },
                innovation: { rating: '3', comments: 'Contributes to brainstorming sessions, but could bring more novel ideas.' },
            },
            overallRating: '3',
            overallComments: 'Tesfaye is a consistent performer. His contribution to critical bug fixes has been noteworthy this quarter. He meets expectations in most areas but has room for growth in leadership.',
            goals: [
                { description: 'Complete the backend API integration for the new module.', status: 'Completed' },
                { description: 'Improve code documentation practices.', status: 'In Progress' },
            ],
            developmentPlan: 'Focus on improving code documentation practices. Seek opportunities to lead small technical discussions.',
            employeeComments: '',
            attachments: [],
        }
    ];
    // --- End Inline Mock Data ---

    const initialFormData = {
        employeeId: '',
        employeeName: '', // Will be set if employeeId is selected
        reviewType: '',
        reviewDate: new Date().toISOString().slice(0, 10), // Default to today
        reviewPeriodStart: '',
        reviewPeriodEnd: '',
        reviewerId: 'current-user-id', // In a real app, this would be the logged-in user's ID
        reviewerName: 'Current User (HR Admin)', // In a real app, this would be the logged-in user's name
        performanceRatings: mockPerformanceAreas.reduce((acc, area) => ({
            ...acc,
            [area.id]: { rating: '', comments: '' }
        }), {}),
        overallRating: '',
        overallComments: '',
        goals: [{ description: '', status: 'In Progress' }],
        developmentPlan: '',
        employeeComments: '',
        attachments: [], // For file uploads
    };

    const [formData, setFormData] = useState(initialFormData);
    const [pageLoading, setPageLoading] = useState(true); // Renamed to avoid conflict with submit loading
    const [submitLoading, setSubmitLoading] = useState(false); // New state for submit loading
    const [submitError, setSubmitError] = useState(null);
    const [formValidationErrors, setFormValidationErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            setPageLoading(true);
            setTimeout(() => {
                const reviewToEdit = inlineMockReviews.find(review => review.id === id);
                if (reviewToEdit) {
                    setFormData({
                        ...reviewToEdit,
                        // Ensure arrays have at least one empty item for form fields if empty
                        goals: reviewToEdit.goals.length > 0 ? reviewToEdit.goals : [{ description: '', status: 'In Progress' }],
                        attachments: reviewToEdit.attachments || [],
                        // Ensure performanceRatings structure matches mockPerformanceAreas for new fields
                        performanceRatings: {
                            ...mockPerformanceAreas.reduce((acc, area) => ({
                                ...acc,
                                [area.id]: { rating: '', comments: '' }
                            }), {}),
                            ...reviewToEdit.performanceRatings,
                        }
                    });
                } else {
                    setSubmitError('Review not found for editing.');
                }
                setPageLoading(false);
            }, 500);
        } else {
            setPageLoading(false); // No loading needed for new form
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'employeeId') {
            const selectedEmployeeLabel = mockEmployees.find(emp => emp.value === value)?.label;
            const employeeName = selectedEmployeeLabel ? selectedEmployeeLabel.split('(')[0].trim() : '';
            setFormData(prev => ({
                ...prev,
                employeeId: value,
                employeeName: employeeName, // Set employeeName based on selected ID
            }));
        } else if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
        // Clear validation error for the changed field
        if (formValidationErrors[name]) {
            setFormValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handlePerformanceRatingChange = (areaId, field, value) => {
        setFormData(prev => ({
            ...prev,
            performanceRatings: {
                ...prev.performanceRatings,
                [areaId]: {
                    ...prev.performanceRatings[areaId],
                    [field]: value
                }
            }
        }));
        // Clear validation error for the specific rating field
        const errorKey = `performanceRatings.${areaId}.${field}`;
        if (formValidationErrors[errorKey]) {
            setFormValidationErrors(prev => ({ ...prev, [errorKey]: undefined }));
        }
    };

    const handleArrayChange = (index, field, value, arrayName) => {
        setFormData(prev => {
            const newArray = [...prev[arrayName]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    const addArrayItem = (arrayName, emptyItem) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], emptyItem],
        }));
    };

    const removeArrayItem = (index, arrayName) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index),
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file), // Create a temporary URL for display
            file: file // Store the actual file object for submission
        }));
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...newAttachments]
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.employeeId && !isEditMode) errors.employeeId = 'Employee is required for a new review.';
        if (!formData.reviewType) errors.reviewType = 'Review Type is required.';
        if (!formData.reviewDate) errors.reviewDate = 'Review Date is required.';
        if (!formData.reviewPeriodStart) errors.reviewPeriodStart = 'Review Period Start Date is required.';
        if (!formData.reviewPeriodEnd) errors.reviewPeriodEnd = 'Review Period End Date is required.';

        // Validate performance ratings
        mockPerformanceAreas.forEach(area => {
            const ratingKey = `performanceRatings.${area.id}.rating`;
            const commentsKey = `performanceRatings.${area.id}.comments`;
            if (!formData.performanceRatings[area.id]?.rating) {
                errors[ratingKey] = `${area.name} rating is required.`;
            }
            if (!formData.performanceRatings[area.id]?.comments?.trim()) {
                errors[commentsKey] = `${area.name} comments are required.`;
            }
        });

        if (!formData.overallRating) errors.overallRating = 'Overall Rating is required.';
        if (!formData.overallComments.trim()) errors.overallComments = 'Overall Comments are required.';

        setFormValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validateForm()) {
            setSubmitError('Please correct the highlighted errors in the form.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setSubmitLoading(true); // Use submitLoading
        try {
            if (isEditMode) {
                console.log('Updating Performance Review:', formData);
                // await updatePerformanceReview(id, formData); // In a real app, call your API
            } else {
                console.log('Creating New Performance Review:', formData);
                // await createPerformanceReview(formData); // In a real app, call your API
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            // Use a custom message box instead of alert()
            alert(`Performance review ${isEditMode ? 'updated' : 'created'} successfully! (Check console for data)`);
            navigate('/performance/dashboard'); // Redirect to dashboard or review log
        } catch (err) {
            setSubmitError(`Failed to ${isEditMode ? 'update' : 'create'} review. ${err.message || 'Please try again.'}`);
            console.error('Submission error:', err);
        } finally {
            setSubmitLoading(false); // Use submitLoading
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-inter">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-4">
                    <FileText className="w-11 h-11 text-purple-600 dark:text-purple-400" /> {isEditMode ? 'Edit Performance Review' : 'Initiate New Performance Review'}
                </h1>
                <Link to="/performance/dashboard" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {/* Loading State */}
            {pageLoading && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading review data...</p>
                </div>
            )}

            {/* Submission Error Alert */}
            {submitError && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{submitError}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Content */}
            {!pageLoading && (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Review Details */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <ClipboardList size={28} className="text-blue-600 dark:text-blue-400" /> Review Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {!isEditMode && ( // Employee selection only for new reviews
                                <Select
                                    label="Employee"
                                    name="employeeId"
                                    options={mockEmployees}
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    required
                                    error={formValidationErrors.employeeId}
                                    icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                                    className="col-span-full md:col-span-1"
                                />
                            )}
                            {isEditMode && ( // Display employee name in edit mode
                                <Input
                                    label="Employee Being Reviewed"
                                    name="employeeName"
                                    value={formData.employeeName}
                                    disabled
                                    icon={<UserCheck size={18} className="text-gray-400 dark:text-gray-500" />}
                                    className="col-span-full md:col-span-1"
                                />
                            )}
                            <Select
                                label="Review Type"
                                name="reviewType"
                                options={mockReviewTypes}
                                value={formData.reviewType}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.reviewType}
                                icon={<FileText size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full md:col-span-1"
                            />
                            <Input
                                label="Review Date"
                                name="reviewDate"
                                type="date"
                                value={formData.reviewDate}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.reviewDate}
                                icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full md:col-span-1"
                            />
                            <Input
                                label="Review Period Start"
                                name="reviewPeriodStart"
                                type="date"
                                value={formData.reviewPeriodStart}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.reviewPeriodStart}
                                icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full md:col-span-1"
                            />
                            <Input
                                label="Review Period End"
                                name="reviewPeriodEnd"
                                type="date"
                                value={formData.reviewPeriodEnd}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.reviewPeriodEnd}
                                icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full md:col-span-1"
                            />
                            <Input
                                label="Reviewer"
                                name="reviewerName"
                                value={formData.reviewerName}
                                disabled // Reviewer is usually the logged-in user or selected from a different module
                                icon={<Users size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="col-span-full md:col-span-1"
                            />
                        </div>
                    </Card>

                    {/* Performance Areas */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Star size={28} className="text-yellow-600 dark:text-yellow-400" /> Performance Areas
                        </h2>
                        {mockPerformanceAreas.map((area) => (
                            <div key={area.id} className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-sm">
                                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    {area.id === 'job_knowledge' && <Briefcase size={20} className="text-blue-500" />}
                                    {area.id === 'communication' && <MessageSquare size={20} className="text-green-500" />}
                                    {area.id === 'problem_solving' && <Zap size={20} className="text-orange-500" />}
                                    {area.id === 'teamwork' && <Users size={20} className="text-purple-500" />}
                                    {area.id === 'adaptability' && <Activity size={20} className="text-teal-500" />}
                                    {area.id === 'leadership' && <Award size={20} className="text-yellow-500" />}
                                    {area.id === 'innovation' && <Lightbulb size={20} className="text-pink-500" />} {/* Assuming Lightbulb icon for innovation */}
                                    {area.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{area.description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Select
                                        label="Rating"
                                        name={`performanceRatings.${area.id}.rating`}
                                        options={mockRatingScale}
                                        value={formData.performanceRatings[area.id]?.rating || ''}
                                        onChange={(value) => handlePerformanceRatingChange(area.id, 'rating', value)} // Changed to receive value directly
                                        required
                                        error={formValidationErrors[`performanceRatings.${area.id}.rating`]}
                                        icon={<Star size={18} className="text-gray-400 dark:text-gray-500" />}
                                    />
                                    <Input
                                        label="Comments"
                                        name={`performanceRatings.${area.id}.comments`}
                                        type="textarea"
                                        value={formData.performanceRatings[area.id]?.comments || ''}
                                        onChange={(e) => handlePerformanceRatingChange(area.id, 'comments', e.target.value)}
                                        placeholder={`Provide specific examples for ${area.name}`}
                                        rows="4"
                                        required
                                        error={formValidationErrors[`performanceRatings.${area.id}.comments`]}
                                        icon={<MessageSquare size={18} className="text-gray-400 dark:text-gray-500" />}
                                    />
                                </div>
                            </div>
                        ))}
                    </Card>

                    {/* Overall Assessment */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Target size={28} className="text-green-600 dark:text-green-400" /> Overall Assessment
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Overall Rating"
                                name="overallRating"
                                options={mockRatingScale}
                                value={formData.overallRating}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.overallRating}
                                icon={<Star size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Overall Comments"
                                name="overallComments"
                                type="textarea"
                                value={formData.overallComments}
                                onChange={handleChange}
                                placeholder="Summarize overall performance and key takeaways."
                                rows="5"
                                required
                                error={formValidationErrors.overallComments}
                                icon={<MessageSquare size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>
                    </Card>

                    {/* Goals & Objectives */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <ListChecks size={28} className="text-teal-600 dark:text-teal-400" /> Goals & Objectives
                        </h2>
                        {formData.goals.map((goal, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700 shadow-sm">
                                <Input
                                    label="Goal Description"
                                    name={`goal-description-${index}`}
                                    value={goal.description}
                                    onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'goals')}
                                    placeholder="e.g., Complete Project X by Q3"
                                    className="md:col-span-2"
                                    icon={<Target size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                                <div className="flex items-end gap-3">
                                    <Select
                                        label="Status"
                                        name={`goal-status-${index}`}
                                        options={[
                                            { value: 'In Progress', label: 'In Progress' },
                                            { value: 'Completed', label: 'Completed' },
                                            { value: 'Deferred', label: 'Deferred' },
                                            { value: 'Not Started', label: 'Not Started' },
                                        ]}
                                        value={goal.status}
                                        onChange={(value) => handleArrayChange(index, 'status', value, 'goals')} // Changed to receive value directly
                                        icon={<CheckSquare size={18} className="text-gray-400 dark:text-gray-500" />}
                                    />
                                    {formData.goals.length > 1 && ( // Only show remove if more than one goal
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="icon"
                                            onClick={() => removeArrayItem(index, 'goals')}
                                            className="flex-shrink-0 w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                                            title="Remove Goal"
                                        >
                                            <Minus size={20} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => addArrayItem('goals', { description: '', status: 'In Progress' })}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            <Plus size={20} /> Add Goal
                        </Button>
                    </Card>

                    {/* Development Plan */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Target size={28} className="text-orange-600 dark:text-orange-400" /> Development Plan
                        </h2>
                        <Input
                            label="Development Plan Details"
                            name="developmentPlan"
                            type="textarea"
                            value={formData.developmentPlan}
                            onChange={handleChange}
                            placeholder="Outline areas for development and actionable steps (e.g., training, mentorship, new projects)."
                            rows="6"
                            icon={<FileText size={18} className="text-gray-400 dark:text-gray-500" />}
                        />
                    </Card>

                    {/* Employee Comments */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <MessageSquare size={28} className="text-indigo-600 dark:text-indigo-400" /> Employee Comments
                        </h2>
                        <Input
                            label="Employee's Self-Assessment / Comments"
                            name="employeeComments"
                            type="textarea"
                            value={formData.employeeComments}
                            onChange={handleChange}
                            placeholder="Employee's perspective on their performance and the review."
                            rows="6"
                            icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                        />
                    </Card>

                    {/* Attachments */}
                    <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                            <Paperclip size={28} className="text-gray-600 dark:text-gray-400" /> Attachments
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                            (File upload functionality would be implemented here. For mock, we'll just list existing attachments.)
                        </p>
                        {formData.attachments.length > 0 && (
                            <ul className="space-y-3 mb-4">
                                {formData.attachments.map((attachment, index) => (
                                    <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 text-sm font-medium truncate">
                                            <Paperclip size={16} /> {attachment.name}
                                        </a>
                                        <Button type="button" variant="danger" size="sm" onClick={() => removeArrayItem(index, 'attachments')} className="flex-shrink-0">
                                            Remove
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="mt-4 block w-full text-sm text-gray-500 dark:text-gray-300
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800"
                        />
                    </Card>


                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 mt-10">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/performance/dashboard')}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <ArrowLeft size={20} /> Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={submitLoading}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300  text-white"
                        >
                            {submitLoading ? (
                                <>
                                    <LoadingSpinner size={20} className="text-white" />
                                    {isEditMode ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> {isEditMode ? 'Update Review' : 'Create Review'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ReviewFormPage;
