// pages/InventoryManagement/AssetAssignmentPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Table from '../../../components/ui/Table'; // Assuming a reusable Table component
import ModalWithForm from '../../../components/ui/modal'; // Assuming ModalWithForm for form editing

// Lucide React Icons
import {
    HardHat, ArrowLeft, User, Calendar, Search, Filter, CheckCircle, MessageSquare ,
    AlertCircle, ListChecks, Plus, Edit, Eye, Tag, Laptop, Smartphone, Cable,
    RotateCcw, Building2, ClipboardList, Monitor // Added Monitor icon
} from 'lucide-react';

const AssetAssignmentPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmployeeId, setFilterEmployeeId] = useState('');
    const [filterAssetType, setFilterAssetType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all'); // Default to show assigned assets
    const [startDate, setStartDate] = useState(''); // Assignment date start
    const [endDate, setEndDate] = useState('');    // Assignment date end

    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null); // For editing/viewing assignment details
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'

    // --- Inline Mock Data ---
    const mockAssets = [
        { id: 'ast-001', name: 'Dell Latitude Laptop', type: 'Laptop', serialNumber: 'DLT-X1234', status: 'Available' },
        { id: 'ast-002', name: 'HP EliteBook Laptop', type: 'Laptop', serialNumber: 'HPE-Y5678', status: 'Assigned' },
        { id: 'ast-003', name: 'iPhone 13 Pro', type: 'Smartphone', serialNumber: 'IP13-Z9012', status: 'Assigned' },
        { id: 'ast-004', name: 'Samsung Galaxy S22', type: 'Smartphone', serialNumber: 'SGS22-A3456', status: 'Available' },
        { id: 'ast-005', name: 'External Monitor (Dell)', type: 'Monitor', serialNumber: 'MON-B7890', status: 'Assigned' },
        { id: 'ast-006', name: 'Office Chair (Ergonomic)', type: 'Furniture', serialNumber: 'OCH-C1234', status: 'Available' },
        { id: 'ast-007', name: 'Projector (Epson)', type: 'Electronics', serialNumber: 'PRJ-D5678', status: 'Assigned' },
        { id: 'ast-008', name: 'Software License (Adobe)', type: 'Software', serialNumber: 'ADOBE-E9012', status: 'Assigned' },
    ];

    const mockEmployees = [
        { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
        { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
        { id: 'emp-003', name: 'Sara Ali', department: 'Operations' },
        { id: 'emp-004', name: 'Kebede Worku', department: 'Finance' },
    ];

    const mockAssignments = [
        {
            id: 'asn-001',
            asset: { id: 'ast-002', name: 'HP EliteBook Laptop', type: 'Laptop', serialNumber: 'HPE-Y5678' },
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            assignmentDate: '2024-01-15',
            returnDate: null,
            status: 'Assigned', // Assigned, Returned, Lost, Damaged
            notes: 'Standard issue laptop for HR Manager.',
        },
        {
            id: 'asn-002',
            asset: { id: 'ast-003', name: 'iPhone 13 Pro', type: 'Smartphone', serialNumber: 'IP13-Z9012' },
            employee: { id: 'emp-001', name: 'Aisha Demisse' },
            assignmentDate: '2024-02-01',
            returnDate: null,
            status: 'Assigned',
            notes: 'Company mobile for official use.',
        },
        {
            id: 'asn-003',
            asset: { id: 'ast-005', name: 'External Monitor (Dell)', type: 'Monitor', serialNumber: 'MON-B7890' },
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            assignmentDate: '2024-03-10',
            returnDate: null,
            status: 'Assigned',
            notes: 'For IT team member, dual monitor setup.',
        },
        {
            id: 'asn-004',
            asset: { id: 'ast-007', name: 'Projector (Epson)', type: 'Electronics', serialNumber: 'PRJ-D5678' },
            employee: { id: 'emp-003', name: 'Sara Ali' },
            assignmentDate: '2024-04-01',
            returnDate: '2024-06-30',
            status: 'Returned',
            notes: 'Used for quarterly operations review. Returned after use.',
        },
        {
            id: 'asn-005',
            asset: { id: 'ast-008', name: 'Software License (Adobe)', type: 'Software', serialNumber: 'ADOBE-E9012' },
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            assignmentDate: '2024-05-01',
            returnDate: null,
            status: 'Assigned',
            notes: 'Annual Adobe Creative Cloud license.',
        },
    ];
    // --- End Inline Mock Data ---

    const mockEmployeesForFilter = [
        { value: '', label: 'All Employees' },
        ...mockEmployees.map(emp => ({ value: emp.id, label: emp.name }))
    ];

    const mockAssetTypesForFilter = [
        { value: 'all', label: 'All Asset Types' },
        ...Array.from(new Set(mockAssets.map(asset => asset.type))).map(type => ({ value: type, label: type }))
    ];

    const assignmentStatuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Assigned', label: 'Assigned' },
        { value: 'Returned', label: 'Returned' },
        { value: 'Lost', label: 'Lost' },
        { value: 'Damaged', label: 'Damaged' },
    ];

    const [assignments, setAssignments] = useState(mockAssignments); // State to hold assignment entries

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate data fetch
            setLoading(false);
        }, 700);
    }, []);

    const filteredAssignments = useMemo(() => {
        return assignments.filter(assignment => {
            const matchesSearchTerm = searchTerm.trim() === '' ||
                assignment.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignment.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignment.asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assignment.notes.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEmployee = filterEmployeeId === '' || assignment.employee.id === filterEmployeeId;
            const matchesAssetType = filterAssetType === 'all' || assignment.asset.type === filterAssetType;
            const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;

            const assignDate = new Date(assignment.assignmentDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            const matchesDateRange = (!start || assignDate >= start) && (!end || assignDate <= end);

            return matchesSearchTerm && matchesEmployee && matchesAssetType && matchesStatus && matchesDateRange;
        }).sort((a, b) => new Date(b.assignmentDate) - new Date(a.assignmentDate)); // Sort by assignment date descending
    }, [assignments, searchTerm, filterEmployeeId, filterAssetType, filterStatus, startDate, endDate]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
            case 'Returned': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
            case 'Damaged': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getAssetIcon = (type) => {
        const iconClasses = "text-gray-600 dark:text-gray-400";
        switch (type) {
            case 'Laptop': return <Laptop size={16} className={iconClasses} />;
            case 'Smartphone': return <Smartphone size={16} className={iconClasses} />;
            case 'Monitor': return <Monitor size={16} className={iconClasses} />;
            case 'Furniture': return <Building2 size={16} className={iconClasses} />;
            case 'Electronics': return <Cable size={16} className={iconClasses} />;
            case 'Software': return <Tag size={16} className={iconClasses} />;
            default: return <ClipboardList size={16} className={iconClasses} />;
        }
    };

    const handleAddAssignment = () => {
        setCurrentAssignment(null);
        setModalMode('add');
        setShowAssignmentModal(true);
    };

    const handleViewAssignment = (assignment) => {
        setCurrentAssignment(assignment);
        setModalMode('view');
        setShowAssignmentModal(true);
    };

    const handleEditAssignment = (assignment) => {
        setCurrentAssignment(assignment);
        setModalMode('edit');
        setShowAssignmentModal(true);
    };

    const handleReturnAsset = (assignmentId) => {
        if (window.confirm('Are you sure you want to mark this asset as returned?')) {
            setLoading(true);
            setError(null);
            setTimeout(() => {
                const updatedAssignments = assignments.map(asn => {
                    if (asn.id === assignmentId && asn.status === 'Assigned') {
                        return {
                            ...asn,
                            status: 'Returned',
                            returnDate: new Date().toISOString().slice(0, 10),
                        };
                    }
                    return asn;
                });
                setAssignments(updatedAssignments);
                alert(`Asset assignment ID ${assignmentId} marked as returned.`);
                setLoading(false);
            }, 500);
        }
    };

    const handleSaveAssignment = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            const selectedAsset = mockAssets.find(asset => asset.id === formData.assetId);
            const selectedEmployee = mockEmployees.find(emp => emp.id === formData.employeeId);

            const newAssignmentData = {
                ...formData,
                asset: selectedAsset || { id: formData.assetId, name: 'Unknown Asset', type: 'Unknown', serialNumber: 'N/A' },
                employee: selectedEmployee || { id: formData.employeeId, name: 'Unknown Employee' },
                assignmentDate: formData.assignmentDate,
                returnDate: formData.returnDate || null, // Ensure null if empty
                status: formData.status || 'Assigned', // Default to 'Assigned' for new
            };

            if (modalMode === 'edit' && currentAssignment) {
                setAssignments(assignments.map(asn => asn.id === currentAssignment.id ? { ...asn, ...newAssignmentData, id: currentAssignment.id } : asn));
                alert('Asset assignment updated successfully!');
            } else {
                setAssignments([...assignments, { ...newAssignmentData, id: `asn-${Date.now()}` }]);
                alert('New asset assigned successfully!');
            }
            setShowAssignmentModal(false);
        } catch (err) {
            setError(`Failed to save asset assignment. ${err.message || ''}`);
            console.error('Save assignment error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fields for the Asset Assignment Add/Edit/View Modal
    const assignmentFormFields = useMemo(() => {
        const fields = [
            {
                name: 'employeeId',
                label: 'Assigned To Employee',
                type: 'select',
                options: [{ value: '', label: 'Select Employee' }, ...mockEmployees.map(emp => ({ value: emp.id, label: emp.name }))],
                required: true,
                placeholder: 'Select Employee',
                icon: User,
                readOnly: modalMode === 'view' || modalMode === 'edit', // Employee cannot be changed after initial assignment
            },
            {
                name: 'assetId',
                label: 'Asset',
                type: 'select',
                options: [{ value: '', label: 'Select Asset' }, ...mockAssets.filter(asset => asset.status === 'Available' || (modalMode === 'edit' && asset.id === currentAssignment?.asset.id)).map(asset => ({ value: asset.id, label: `${asset.name} (${asset.serialNumber})` }))],
                required: true,
                placeholder: 'Select Asset',
                icon: Laptop, // Generic asset icon
                readOnly: modalMode === 'view' || modalMode === 'edit', // Asset cannot be changed after initial assignment
            },
            {
                name: 'assignmentDate',
                label: 'Assignment Date',
                type: 'date',
                required: true,
                icon: Calendar,
                readOnly: modalMode === 'view',
            },
            {
                name: 'returnDate',
                label: 'Return Date (Optional)',
                type: 'date',
                icon: Calendar,
                readOnly: modalMode === 'view' || currentAssignment?.status === 'Returned', // Only editable if not already returned
            },
            {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: assignmentStatuses.filter(s => s.value !== 'all'), // Exclude 'All Statuses'
                required: true,
                icon: CheckCircle,
                readOnly: modalMode === 'view',
            },
            {
                name: 'notes',
                label: 'Notes',
                type: 'textarea',
                rows: 3,
                placeholder: 'Any special notes about the assignment or asset condition.',
                icon: MessageSquare,
                readOnly: modalMode === 'view',
            },
        ];

        // Add display-only fields for view mode
        if (modalMode === 'view') {
            // These fields are for display, not part of the form data to be submitted
            // They will be populated from currentAssignment directly in modalFormData
            fields.unshift(
                { name: 'assetNameDisplay', label: 'Asset Name', type: 'text', readOnly: true, icon: Laptop },
                { name: 'assetSerialNumberDisplay', label: 'Serial Number', type: 'text', readOnly: true, icon: Tag },
                { name: 'employeeNameDisplay', label: 'Assigned To', type: 'text', readOnly: true, icon: User },
            );
        }

        return fields;
    }, [modalMode, mockEmployees, mockAssets, currentAssignment]);

    // Initial form data for the modal, derived from currentAssignment or empty for 'add' mode
    const modalFormData = useMemo(() => {
        if (!currentAssignment) {
            return {
                employeeId: '', assetId: '', assignmentDate: '', returnDate: '', status: 'Assigned', notes: ''
            };
        }
        return {
            ...currentAssignment,
            employeeId: currentAssignment.employee.id,
            assetId: currentAssignment.asset.id,
            assetNameDisplay: currentAssignment.asset.name,
            assetSerialNumberDisplay: currentAssignment.asset.serialNumber,
            employeeNameDisplay: currentAssignment.employee.name,
        };
    }, [currentAssignment]);


    const assetAssignmentTableColumns = [
        { header: 'Asset Name', accessor: 'asset.name' },
        { header: 'Serial Number', accessor: 'asset.serialNumber' },
        { header: 'Type', accessor: 'asset.type' },
        { header: 'Assigned To', accessor: 'employee.name' },
        { header: 'Assignment Date', accessor: 'assignmentDate' },
        { header: 'Return Date', accessor: 'returnDate', render: (row) => row.returnDate || 'N/A' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(row.status)}`}>
                    {row.status}
                </span>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"> {/* Responsive actions */}
                    <Button variant="outline" size="sm" onClick={() => handleViewAssignment(row)} className="flex items-center justify-center gap-1 w-full sm:w-auto">
                        <Eye size={16} /> View
                    </Button>
                    {row.status === 'Assigned' && (
                        <>
                            <Button variant="secondary" size="sm" onClick={() => handleEditAssignment(row)} className="flex items-center justify-center gap-1 w-full sm:w-auto">
                                <Edit size={16} /> Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleReturnAsset(row.id)} className="flex items-center justify-center gap-1 w-full sm:w-auto">
                                <RotateCcw size={16} /> Return
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    // Calculate summary totals
    const summaryTotals = useMemo(() => {
        const totalAssets = mockAssets.length;
        const assignedAssets = assignments.filter(a => a.status === 'Assigned').length;
        const availableAssets = mockAssets.filter(asset => asset.status === 'Available').length;
        const returnedAssets = assignments.filter(a => a.status === 'Returned').length;

        return { totalAssets, assignedAssets, availableAssets, returnedAssets };
    }, [mockAssets, assignments]);

    return (
        <div className="container mx-auto p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-black min-h-screen font-inter text-gray-900 dark:text-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-4 sm:mb-0">
                    <HardHat className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 dark:text-indigo-400" /> Asset Assignment
                </h1>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <Button variant="primary" onClick={handleAddAssignment} className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                        <Plus size={20} /> Assign New Asset
                    </Button>

                </div>
            </div>

            {loading && (
                <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl">
                    <LoadingSpinner />
                    <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">Loading asset assignments...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300 px-4 py-3 sm:px-6 sm:py-4 rounded-xl relative mb-6 shadow-md" role="alert">
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
                    {/* Asset Summary Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <Card className="p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                            <Laptop size={30} sm:size={36} className="text-indigo-500 dark:text-indigo-400 mb-2 sm:mb-3" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Total Assets</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-1 sm:mt-2">{summaryTotals.totalAssets}</p>
                        </Card>
                        <Card className="p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                            <User size={30} sm:size={36} className="text-blue-500 dark:text-blue-400 mb-2 sm:mb-3" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Assigned Assets</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-1 sm:mt-2">{summaryTotals.assignedAssets}</p>
                        </Card>
                        <Card className="p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                            <CheckCircle size={30} sm:size={36} className="text-green-500 dark:text-green-400 mb-2 sm:mb-3" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Available Assets</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-1 sm:mt-2">{summaryTotals.availableAssets}</p>
                        </Card>
                        <Card className="p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                            <RotateCcw size={30} sm:size={36} className="text-teal-500 dark:text-teal-400 mb-2 sm:mb-3" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Returned Assets</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-1 sm:mt-2">{summaryTotals.returnedAssets}</p>
                        </Card>
                    </div>

                    {/* Filter and Search Section */}
                    <Card className="p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-6 sm:mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <Input
                                label="Search Assignments"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by employee, asset, serial..."
                                icon={<Search size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            />
                            <Select
                                label="Filter by Employee"
                                name="filterEmployeeId"
                                options={mockEmployeesForFilter}
                                value={filterEmployeeId}
                                onChange={(e) => setFilterEmployeeId(e.target.value)}
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            />
                            <Select
                                label="Filter by Asset Type"
                                name="filterAssetType"
                                options={mockAssetTypesForFilter}
                                value={filterAssetType}
                                onChange={(e) => setFilterAssetType(e.target.value)}
                                icon={<Tag size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={assignmentStatuses}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                icon={<Filter size={18} className="text-gray-400 dark:text-gray-500" />}
                                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-full lg:col-span-2"> {/* Date range spanning two columns */}
                                <Input
                                    label="Assignment Start Date"
                                    name="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                />
                                <Input
                                    label="Assignment End Date"
                                    name="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Asset Assignment List */}
                    <Card className="p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <ListChecks size={24} className="text-indigo-500 dark:text-indigo-400" /> Current Asset Assignments
                        </h2>
                        {filteredAssignments.length > 0 ? (
                            <div className="overflow-x-auto"> {/* Make table horizontally scrollable on small screens */}
                                <Table columns={assetAssignmentTableColumns} data={filteredAssignments} />
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-10 text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                                No asset assignments found matching your criteria.
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Asset Assignment Add/Edit/View Modal */}
            <ModalWithForm
                isOpen={showAssignmentModal}
                onClose={() => setShowAssignmentModal(false)}
                onSubmit={handleSaveAssignment}
                title={
                    modalMode === 'add' ? 'Assign New Asset' :
                    modalMode === 'edit' ? 'Edit Asset Assignment' :
                    'Asset Assignment Details'
                }
                fields={assignmentFormFields}
                formData={modalFormData}
                // Pass dark mode classes to ModalWithForm if it supports them
                // You might need to adjust ModalWithForm component to accept and apply these
                // For example, by adding a `className` prop to its root div.
                className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
        </div>
    );
};

export default AssetAssignmentPage;