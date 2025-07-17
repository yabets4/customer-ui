// pages/LeaveManagement/LeaveRequestPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';


// Lucide React Icons
import {
    Calendar, ArrowLeft, User, MessageSquare, Plus, Edit, Trash2, AlertCircle,
    CheckCircle, XCircle, Clock, Send, FileText, Filter, ClipboardList
} from 'lucide-react';

const LeaveRequestPage = () => {

    // --- Inline Mock Data ---
    // Mock current logged-in employee (for self-service)
    const currentEmployee = {
        id: 'emp-001',
        name: 'Aisha Demisse',
        department: 'HR',
        leaveBalances: [
            { typeId: 'annual', typeName: 'Annual Leave', totalDays: 15, remainingDays: 10 },
            { typeId: 'sick', typeName: 'Sick Leave', totalDays: 10, remainingDays: 8 },
            { typeId: 'maternity', typeName: 'Maternity Leave', totalDays: 90, remainingDays: 90 },
        ]
    };

    const mockLeaveTypes = [
        { value: '', label: 'Select Leave Type' },
        { value: 'annual', label: 'Annual Leave' },
        { value: 'sick', label: 'Sick Leave' },
        { value: 'maternity', label: 'Maternity Leave' },
        { value: 'paternity', label: 'Paternity Leave' },
        { value: 'bereavement', label: 'Bereavement Leave' },
        { value: 'unpaid', label: 'Unpaid Leave' },
        { value: 'study', label: 'Study Leave' },
    ];

    const mockLeaveRequests = [
        {
            id: 'lr-001',
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            leaveType: 'annual',
            startDate: '2024-08-01',
            endDate: '2024-08-05',
            numberOfDays: 5,
            reason: 'Family vacation to Bahir Dar.',
            status: 'Approved', // Pending, Approved, Rejected, Canceled
            requestedDate: '2024-07-01',
            approver: { id: 'manager-001', name: 'John Smith' },
            approvalDate: '2024-07-03',
            approverComments: 'Enjoy your vacation!',
        },
        {
            id: 'lr-002',
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            leaveType: 'sick',
            startDate: '2024-07-12',
            endDate: '2024-07-12',
            numberOfDays: 1,
            reason: 'Fever and cold.',
            status: 'Pending',
            requestedDate: '2024-07-11',
            approver: null,
            approvalDate: null,
            approverComments: null,
        },
        {
            id: 'lr-003',
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            leaveType: 'unpaid',
            startDate: '2024-09-01',
            endDate: '2024-09-10',
            numberOfDays: 10,
            reason: 'Personal matters abroad.',
            status: 'Rejected',
            requestedDate: '2024-07-05',
            approver: { id: 'manager-001', name: 'John Smith' },
            approvalDate: '2024-07-07',
            approverComments: 'High workload during that period. Please reconsider dates.',
        },
        {
            id: 'lr-004',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            leaveType: 'annual',
            startDate: '2024-08-10',
            endDate: '2024-08-15',
            numberOfDays: 5,
            reason: 'Annual vacation.',
            status: 'Approved',
            requestedDate: '2024-07-01',
            approver: { id: 'manager-002', name: 'Jane Doe' },
            approvalDate: '2024-07-02',
            approverComments: 'Approved.',
        },
    ];
    // --- End Inline Mock Data ---

    const initialFormData = {
        employeeId: currentEmployee.id, // Auto-fill for self-service
        employeeName: currentEmployee.name,
        leaveType: '',
        startDate: '',
        endDate: '',
        numberOfDays: 0,
        reason: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added setError declaration
    const [submitError, setSubmitError] = useState(null);
    const [formValidationErrors, setFormValidationErrors] = useState({});
    const [userRequests, setUserRequests] = useState([]); // To display current employee's requests
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        setLoading(true);
        setError(null); // This line now correctly refers to the declared setError
        setTimeout(() => {
            // Simulate fetching current employee's requests
            const employeeRequests = mockLeaveRequests.filter(req => req.employee.id === currentEmployee.id);
            setUserRequests(employeeRequests);
            setLoading(false);
        }, 700);
    }, [currentEmployee.id]);

    // Update number of days when start/end dates change
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (start <= end) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
                setFormData(prev => ({ ...prev, numberOfDays: diffDays }));
            } else {
                setFormData(prev => ({ ...prev, numberOfDays: 0 }));
            }
        } else {
            setFormData(prev => ({ ...prev, numberOfDays: 0 }));
        }
    }, [formData.startDate, formData.endDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (formValidationErrors[name]) {
            setFormValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.leaveType) errors.leaveType = 'Leave Type is required.';
        if (!formData.startDate) errors.startDate = 'Start Date is required.';
        if (!formData.endDate) errors.endDate = 'End Date is required.';
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            errors.endDate = 'End Date cannot be before Start Date.';
        }
        if (formData.numberOfDays <= 0) errors.numberOfDays = 'Number of days must be greater than zero.';
        if (!formData.reason.trim()) errors.reason = 'Reason for leave is required.';

        // Check leave balance
        const selectedLeaveTypeBalance = currentEmployee.leaveBalances.find(
            (b) => b.typeId === formData.leaveType
        );

        if (selectedLeaveTypeBalance && formData.numberOfDays > selectedLeaveTypeBalance.remainingDays) {
            errors.numberOfDays = `Not enough ${selectedLeaveTypeBalance.typeName} balance. Remaining: ${selectedLeaveTypeBalance.remainingDays} days.`;
        }


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

        setLoading(true);
        try {
            const newRequest = {
                id: `lr-${Date.now()}`, // Simple unique ID for mock
                employee: { id: currentEmployee.id, name: currentEmployee.name },
                leaveType: formData.leaveType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                numberOfDays: formData.numberOfDays,
                reason: formData.reason,
                status: 'Pending', // New requests are always pending
                requestedDate: new Date().toISOString().slice(0, 10),
                approver: null,
                approvalDate: null,
                approverComments: null,
            };

            console.log('Submitting new leave request:', newRequest);
            // In a real app: await createLeaveRequest(newRequest);
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Leave request submitted successfully! It is now pending approval.');
            // Update local mock data for display
            setUserRequests(prev => [...prev, newRequest]);
            setFormData(initialFormData); // Reset form
        } catch (err) {
            setSubmitError(`Failed to submit leave request. ${err.message || ''}`);
            console.error('Submission error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRequest = (requestId) => {
        // Replaced window.confirm with a custom modal in a real app
        // For this mock, keeping window.confirm for simplicity
        if (window.confirm('Are you sure you want to cancel this leave request?')) {
            setLoading(true);
            setSubmitError(null);
            setTimeout(() => {
                const updatedRequests = userRequests.map(req =>
                    req.id === requestId && req.status === 'Pending'
                        ? { ...req, status: 'Canceled', approverComments: 'Canceled by employee.' }
                        : req
                );
                setUserRequests(updatedRequests);
                alert('Leave request canceled successfully.');
                setLoading(false);
            }, 500);
        }
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Canceled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredRequests = userRequests.filter(req =>
        filterStatus === 'all' || req.status === filterStatus
    );

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-green-50 to-teal-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Calendar className="w-10 h-10 text-teal-600" /> Leave Request
                </h1>
                <Link to="/hr/leave-history">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading leave data...</p>
                </div>
            )}

            {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{submitError}</span>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Leave Request Form */}
                    <Card className="lg:col-span-1 p-8 rounded-xl shadow-lg border border-gray-100 bg-white h-fit">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <Send size={24} className="text-green-500" /> Submit New Request
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Employee Name"
                                name="employeeName"
                                value={formData.employeeName}
                                disabled
                                icon={<User size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Leave Type"
                                name="leaveType"
                                options={mockLeaveTypes}
                                value={formData.leaveType}
                                onChange={handleChange}
                                required
                                error={formValidationErrors.leaveType}
                                icon={<FileText size={18} className="text-gray-400" />}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    error={formValidationErrors.startDate}
                                    icon={<Calendar size={18} className="text-gray-400" />}
                                />
                                <Input
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    error={formValidationErrors.endDate}
                                    icon={<Calendar size={18} className="text-gray-400" />}
                                />
                            </div>
                            <Input
                                label="Number of Days"
                                name="numberOfDays"
                                type="number"
                                value={formData.numberOfDays}
                                disabled // Calculated automatically
                                error={formValidationErrors.numberOfDays}
                                icon={<Clock size={18} className="text-gray-400" />}
                            />
                            <Input
                                label="Reason for Leave"
                                name="reason"
                                type="textarea"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Briefly explain your reason for leave."
                                rows="3"
                                required
                                error={formValidationErrors.reason}
                                icon={<MessageSquare size={18} className="text-gray-400" />}
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {loading ? 'Submitting...' : (
                                    <>
                                        <Send size={20} /> Submit Request
                                    </>
                                )}
                            </Button>
                        </form>
                    </Card>

                    {/* Leave Balances & Request History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Leave Balances */}
                        <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <FileText size={24} className="text-blue-500" /> Your Leave Balances
                            </h2>
                            {currentEmployee.leaveBalances.length > 0 ? (
                                <ul className="space-y-3">
                                    {currentEmployee.leaveBalances.map(balance => (
                                        <li key={balance.typeId} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200">
                                            <p className="text-lg font-semibold text-gray-800">{balance.typeName}</p>
                                            <p className="text-xl font-bold text-indigo-600">
                                                {balance.remainingDays} / {balance.totalDays} <span className="text-sm font-normal text-gray-500">days</span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No leave balance information available.</p>
                            )}
                        </Card>

                        {/* Leave Request History */}
                        <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                                <ClipboardList size={24} className="text-purple-500" /> Your Leave Requests
                            </h2>
                            <div className="mb-4">
                                <Select
                                    label="Filter by Status"
                                    name="filterStatus"
                                    options={[
                                        { value: 'all', label: 'All Statuses' },
                                        { value: 'Pending', label: 'Pending' },
                                        { value: 'Approved', label: 'Approved' },
                                        { value: 'Rejected', label: 'Rejected' },
                                        { value: 'Canceled', label: 'Canceled' },
                                    ]}
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    icon={<Filter size={18} className="text-gray-400" />}
                                />
                            </div>

                            {filteredRequests.length > 0 ? (
                                <ul className="space-y-4">
                                    {filteredRequests.map(request => (
                                        <li key={request.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-md font-semibold text-gray-800">
                                                    {request.leaveType} ({request.numberOfDays} days)
                                                </p>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                <Calendar size={14} className="inline-block mr-1" />
                                                {request.startDate} to {request.endDate}
                                            </p>
                                            <p className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-2 mb-2">
                                                Reason: {request.reason}
                                            </p>
                                            {request.approverComments && (
                                                <p className="text-sm text-red-600 border-l-2 border-red-300 pl-2 mb-2">
                                                    Approver Comments: {request.approverComments}
                                                </p>
                                            )}
                                            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                                <span>Requested: {request.requestedDate}</span>
                                                {request.status !== 'Pending' && request.approver && (
                                                    <span>
                                                        {request.status} by {request.approver.name} on {request.approvalDate}
                                                    </span>
                                                )}
                                            </div>
                                            {request.status === 'Pending' && (
                                                <div className="flex justify-end mt-3">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleCancelRequest(request.id)}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <XCircle size={16} /> Cancel Request
                                                    </Button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-10 text-gray-500 text-lg">
                                    No leave requests found.
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequestPage;
