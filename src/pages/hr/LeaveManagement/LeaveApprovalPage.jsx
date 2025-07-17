// pages/LeaveManagement/LeaveApprovalPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
// Changed import name to match the component provided by the user
import ModalWithForm from '../../../components/ui/modal'; // Assuming this is your ModalWithForm component

// Lucide React Icons
import {
    Calendar, ArrowLeft, User, MessageSquare, CheckCircle, XCircle, Clock,
    AlertCircle, Filter, Search, ClipboardList, Send, Tag // Added Tag for generic fields
} from 'lucide-react';

const LeaveApprovalPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmployeeId, setFilterEmployeeId] = useState('');
    const [filterStatus, setFilterStatus] = useState('Pending'); // Default to show only pending requests
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    // approvalComments will now be managed by ModalWithForm's internal state,
    // but we need a way to pass initial value and retrieve final value.
    // We'll use a temporary state for initial comments for the modal.
    const [modalInitialComments, setModalInitialComments] = useState('');
    const [approvalAction, setApprovalAction] = useState(''); // 'approve' or 'reject'

    // --- Inline Mock Data for Leave Requests (including different employees) ---
    const mockAllLeaveRequests = [
        {
            id: 'lr-001',
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            leaveType: 'Annual Leave',
            startDate: '2024-08-01',
            endDate: '2024-08-05',
            numberOfDays: 5,
            reason: 'Family vacation to Bahir Dar.',
            status: 'Approved',
            requestedDate: '2024-07-01',
            approver: { id: 'manager-001', name: 'John Smith' },
            approvalDate: '2024-07-03',
            approverComments: 'Enjoy your vacation!',
        },
        {
            id: 'lr-002',
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            leaveType: 'Sick Leave',
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
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            leaveType: 'Unpaid Leave',
            startDate: '2024-09-01',
            endDate: '2024-09-10',
            numberOfDays: 10,
            reason: 'Personal matters abroad.',
            status: 'Pending',
            requestedDate: '2024-07-05',
            approver: null,
            approvalDate: null,
            approverComments: null,
        },
        {
            id: 'lr-004',
            employee: { id: 'emp-003', name: 'Sara Ali' },
            leaveType: 'Annual Leave',
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
        {
            id: 'lr-005',
            employee: { id: 'emp-004', name: 'Kebede Worku' },
            leaveType: 'Bereavement Leave',
            startDate: '2024-07-15',
            endDate: '2024-07-17',
            numberOfDays: 3,
            reason: 'Family bereavement.',
            status: 'Pending',
            requestedDate: '2024-07-13',
            approver: null,
            approvalDate: null,
            approverComments: null,
        },
        {
            id: 'lr-006',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            leaveType: 'Sick Leave',
            startDate: '2024-07-14',
            endDate: '2024-07-14',
            numberOfDays: 1,
            reason: 'Food poisoning.',
            status: 'Rejected',
            requestedDate: '2024-07-13',
            approver: { id: 'manager-001', name: 'John Smith' },
            approvalDate: '2024-07-13',
            approverComments: 'Requires doctor\'s note for sick leave.',
        },
    ];
    // --- End Inline Mock Data ---

    const mockEmployeesForFilter = [
        { value: '', label: 'All Employees' },
        { value: 'emp-001', label: 'Aisha Demisse' },
        { value: 'emp-002', label: 'Tesfaye Gebre' },
        { value: 'emp-003', label: 'Sara Ali' },
        { value: 'emp-004', label: 'Kebede Worku' },
    ];

    const leaveRequestStatuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'Canceled', label: 'Canceled' },
    ];

    const [leaveRequests, setLeaveRequests] = useState(mockAllLeaveRequests); // State to hold all requests

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // In a real app, fetch requests from backend
            setLoading(false);
        }, 700);
    }, []);

    const filteredRequests = useMemo(() => {
        return leaveRequests.filter(request => {
            const matchesSearchTerm = searchTerm.trim() === '' ||
                request.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.reason.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEmployee = filterEmployeeId === '' || request.employee.id === filterEmployeeId;
            const matchesStatus = filterStatus === 'all' || request.status === filterStatus;

            return matchesSearchTerm && matchesEmployee && matchesStatus;
        }).sort((a, b) => new Date(b.requestedDate) - new Date(a.requestedDate)); // Sort by requested date descending
    }, [leaveRequests, searchTerm, filterEmployeeId, filterStatus]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Canceled': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleOpenApprovalModal = (request, action) => {
        setSelectedRequest(request);
        setApprovalAction(action);
        setModalInitialComments(''); // Clear previous comments for the modal form
        setShowApprovalModal(true);
    };

    // This function will be called by ModalWithForm's onSubmit
    const handleProcessApproval = async (formDataFromModal) => {
        if (!selectedRequest) return;

        setLoading(true);
        setError(null); // Clear any previous general errors
        setSubmitError(null); // Clear any previous submission errors

        const finalComments = formDataFromModal.approvalComments.trim() ||
                              (approvalAction === 'approve' ? 'Approved.' : 'Rejected.');

        try {
            // Simulate API call to update request status
            await new Promise(resolve => setTimeout(resolve, 800));

            const updatedRequests = leaveRequests.map(req =>
                req.id === selectedRequest.id
                    ? {
                        ...req,
                        status: approvalAction === 'approve' ? 'Approved' : 'Rejected',
                        approver: { id: 'manager-current', name: 'Current Approver' }, // Replace with actual logged-in approver
                        approvalDate: new Date().toISOString().slice(0, 10),
                        approverComments: finalComments,
                    }
                    : req
            );
            setLeaveRequests(updatedRequests); // Update local state

            alert(`Leave request for ${selectedRequest.employee.name} ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully!`);
            setShowApprovalModal(false);
            setSelectedRequest(null);
            setModalInitialComments(''); // Reset comments for next use
        } catch (err) {
            setSubmitError(`Failed to ${approvalAction} leave request. ${err.message || ''}`);
            console.error('Approval error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Define the fields for the ModalWithForm
    const modalFields = [
        {
            name: 'employeeNameDisplay',
            label: 'Employee',
            type: 'text',
            readOnly: true,
            defaultValue: selectedRequest?.employee.name || '',
            icon: User
        },
        {
            name: 'leaveTypeDisplay',
            label: 'Leave Type',
            type: 'text',
            readOnly: true,
            defaultValue: selectedRequest?.leaveType || '',
            icon: Tag // Using Tag icon for generic text display
        },
        {
            name: 'datesDisplay',
            label: 'Dates',
            type: 'text',
            readOnly: true,
            defaultValue: selectedRequest ? `${selectedRequest.startDate} to ${selectedRequest.endDate} (${selectedRequest.numberOfDays} days)` : '',
            icon: Calendar
        },
        {
            name: 'reasonDisplay',
            label: 'Reason',
            type: 'textarea', // Use 'textarea' for the type
            readOnly: true,
            defaultValue: selectedRequest?.reason || '',
            rows: 3,
            icon: MessageSquare
        },
        {
            name: 'approvalComments',
            label: `Comments for Employee (${approvalAction === 'approve' ? 'Optional' : 'Required for Rejection'})`,
            type: 'textarea',
            placeholder: approvalAction === 'approve' ? 'Add a message for the employee upon approval.' : 'Provide a reason for rejection.',
            rows: 3,
            required: approvalAction === 'reject', // Make comments required only for rejection
            icon: MessageSquare
        },
    ];


    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <ClipboardList className="w-10 h-10 text-purple-600" /> Leave Approval
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
                    <p className="mt-4 text-lg text-gray-600">Loading leave requests...</p>
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
                                label="Search Requests"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by employee, type, reason..."
                                icon={<Search size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Employee"
                                name="filterEmployeeId"
                                options={mockEmployeesForFilter}
                                value={filterEmployeeId}
                                onChange={(e) => setFilterEmployeeId(e.target.value)}
                                icon={<User size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={leaveRequestStatuses}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                icon={<Filter size={18} className="text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {/* Leave Request List for Approval */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <Send size={24} className="text-purple-500" /> Requests for Your Action
                        </h2>
                        {filteredRequests.length > 0 ? (
                            <ul className="space-y-6">
                                {filteredRequests.map(request => (
                                    <li key={request.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                    <User size={20} className="text-indigo-600" /> {request.employee.name}
                                                </p>
                                                <p className="text-md text-gray-700 mt-1">
                                                    {request.leaveType} ({request.numberOfDays} days)
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <Calendar size={14} /> {request.startDate} to {request.endDate}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 italic border-l-2 border-gray-300 pl-2 mb-3">
                                            Reason: {request.reason}
                                        </p>
                                        {request.approverComments && (
                                            <p className="text-sm text-gray-700 border-l-2 border-blue-300 pl-2 mb-3">
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
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleOpenApprovalModal(request, 'approve')}
                                                    className="flex items-center gap-1 px-3 py-1.5"
                                                >
                                                    <CheckCircle size={16} /> Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleOpenApprovalModal(request, 'reject')}
                                                    className="flex items-center gap-1 px-3 py-1.5"
                                                >
                                                    <XCircle size={16} /> Reject
                                                </Button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No leave requests found requiring your approval.
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Approval/Rejection Modal using ModalWithForm */}
            <ModalWithForm
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                onSubmit={handleProcessApproval} // ModalWithForm handles its own submit
                title={`${approvalAction === 'approve' ? 'Approve' : 'Reject'} Leave Request`}
                fields={modalFields} // Pass the defined fields array
                formData={{ approvalComments: modalInitialComments }} // Pass initial form data for comments
                onFieldChange={(name, value) => {
                    if (name === 'approvalComments') {
                        setModalInitialComments(value); // Update temporary state for comments
                    }
                }}
            >
                {/* ModalWithForm renders its own content based on 'fields' prop */}
                {/* We can still add some custom content here if needed, but the form is handled by fields */}
                {selectedRequest && (
                    <div className="space-y-2 text-gray-700 mb-4">
                        <p>Reviewing request for: <span className="font-semibold">{selectedRequest.employee.name}</span></p>
                        <p>Leave Type: <span className="font-medium">{selectedRequest.leaveType}</span></p>
                        <p>Dates: <span className="font-medium">{selectedRequest.startDate} to {selectedRequest.endDate} ({selectedRequest.numberOfDays} days)</span></p>
                        <p className="italic">Reason: "{selectedRequest.reason}"</p>
                    </div>
                )}
            </ModalWithForm>
        </div>
    );
};

export default LeaveApprovalPage;
