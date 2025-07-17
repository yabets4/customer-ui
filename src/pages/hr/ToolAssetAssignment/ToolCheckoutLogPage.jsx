// pages/InventoryManagement/ToolCheckoutLogPage.jsx

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
    Wrench, ArrowLeft, User, Calendar, Search, Filter, CheckCircle, XCircle,
    AlertCircle, ListChecks, Plus, Eye, Tag, Cable, RotateCcw, Box, Clock, MessageSquare, 
} from 'lucide-react';

const ToolCheckoutLogPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEmployeeId, setFilterEmployeeId] = useState('');
    const [filterToolType, setFilterToolType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('Checked Out'); // Default to show checked out tools
    const [startDate, setStartDate] = useState(''); // Checkout date start
    const [endDate, setEndDate] = useState('');   // Checkout date end

    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [currentLogEntry, setCurrentLogEntry] = useState(null); // For editing/viewing log details
    const [modalMode, setModalMode] = useState('add'); // 'add', 'view', 'checkin'

    // --- Inline Mock Data ---
    const mockTools = [
        { id: 'tool-001', name: 'Digital Multimeter', type: 'Electrical', serialNumber: 'DM-12345', status: 'Available' },
        { id: 'tool-002', name: 'Cordless Drill', type: 'Power Tool', serialNumber: 'CD-67890', status: 'Checked Out' },
        { id: 'tool-003', name: 'Adjustable Wrench Set', type: 'Hand Tool', serialNumber: 'AWS-11223', status: 'Available' },
        { id: 'tool-004', name: 'Thermal Camera', type: 'Diagnostic', serialNumber: 'TC-44556', status: 'Checked Out' },
        { id: 'tool-005', name: 'Impact Driver', type: 'Power Tool', serialNumber: 'ID-77889', status: 'Available' },
        { id: 'tool-006', name: 'Network Cable Tester', type: 'IT', serialNumber: 'NCT-99001', status: 'Checked Out' },
    ];

    const mockEmployees = [
        { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
        { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
        { id: 'emp-003', name: 'Sara Ali', department: 'Operations' },
        { id: 'emp-004', name: 'Kebede Worku', department: 'Finance' },
    ];

    const mockCheckoutLogs = [
        {
            id: 'log-001',
            tool: { id: 'tool-002', name: 'Cordless Drill', type: 'Power Tool', serialNumber: 'CD-67890' },
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            checkoutDate: '2025-07-01',
            checkinDate: null,
            status: 'Checked Out', // Checked Out, Checked In, Overdue, Lost, Damaged
            purpose: 'Installation of new server racks.',
        },
        {
            id: 'log-002',
            tool: { id: 'tool-004', name: 'Thermal Camera', type: 'Diagnostic', serialNumber: 'TC-44556' },
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            checkoutDate: '2025-07-05',
            checkinDate: null,
            status: 'Checked Out',
            purpose: 'Troubleshooting overheating network equipment.',
        },
        {
            id: 'log-003',
            tool: { id: 'tool-006', name: 'Network Cable Tester', type: 'IT', serialNumber: 'NCT-99001' },
            employee: { id: 'emp-002', name: 'Tesfaye Gebre' },
            checkoutDate: '2025-06-20',
            checkinDate: null,
            status: 'Overdue', // Manually set for demonstration
            purpose: 'Testing network cables in new office section.',
        },
        {
            id: 'log-004',
            tool: { id: 'tool-001', name: 'Digital Multimeter', type: 'Electrical', serialNumber: 'DM-12345' },
            employee: { id: 'emp-003', name: 'Sara Ali' },
            checkoutDate: '2025-06-10',
            checkinDate: '2025-06-12',
            status: 'Checked In',
            purpose: 'Electrical checks on production line.',
        },
        {
            id: 'log-005',
            tool: { id: 'tool-003', name: 'Adjustable Wrench Set', type: 'Hand Tool', serialNumber: 'AWS-11223' },
            employee: { id: 'emp-003', name: 'Sara Ali' },
            checkoutDate: '2025-05-25',
            checkinDate: '2025-05-26',
            status: 'Checked In',
            purpose: 'Minor equipment adjustment.',
        },
    ];
    // --- End Inline Mock Data ---

    const mockEmployeesForFilter = [
        { value: '', label: 'All Employees' },
        ...mockEmployees.map(emp => ({ value: emp.id, label: emp.name }))
    ];

    const mockToolTypesForFilter = [
        { value: 'all', label: 'All Tool Types' },
        ...Array.from(new Set(mockTools.map(tool => tool.type))).map(type => ({ value: type, label: type }))
    ];

    const checkoutStatuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Checked Out', label: 'Checked Out' },
        { value: 'Checked In', label: 'Checked In' },
        { value: 'Overdue', label: 'Overdue' },
        { value: 'Lost', label: 'Lost' },
        { value: 'Damaged', label: 'Damaged' },
    ];

    const [checkoutLogs, setCheckoutLogs] = useState(mockCheckoutLogs); // State to hold log entries

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Simulate data fetch
            setLoading(false);
        }, 700);
    }, []);

    const filteredLogs = useMemo(() => {
        return checkoutLogs.filter(log => {
            const matchesSearchTerm = searchTerm.trim() === '' ||
                log.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.tool.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.purpose.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesEmployee = filterEmployeeId === '' || log.employee.id === filterEmployeeId;
            const matchesToolType = filterToolType === 'all' || log.tool.type === filterToolType;
            const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

            const checkoutDate = new Date(log.checkoutDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            const matchesDateRange = (!start || checkoutDate >= start) && (!end || checkoutDate <= end);

            return matchesSearchTerm && matchesEmployee && matchesToolType && matchesStatus && matchesDateRange;
        }).sort((a, b) => new Date(b.checkoutDate) - new Date(a.checkoutDate)); // Sort by checkout date descending
    }, [checkoutLogs, searchTerm, filterEmployeeId, filterToolType, filterStatus, startDate, endDate]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Checked Out': return 'bg-blue-100 text-blue-800';
            case 'Checked In': return 'bg-green-100 text-green-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            case 'Lost': return 'bg-orange-100 text-orange-800';
            case 'Damaged': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getToolIcon = (type) => {
        switch (type) {
            case 'Electrical': return <Cable size={16} className="text-gray-600" />;
            case 'Power Tool': return <Wrench size={16} className="text-gray-600" />; // Wrench for power tools
            case 'Hand Tool': return <Tag size={16} className="text-gray-600" />; // Generic tag for hand tools
            case 'Diagnostic': return <Search size={16} className="text-gray-600" />;
            case 'IT': return <Laptop size={16} className="text-gray-600" />; // Using Laptop for IT tools
            default: return <Cable size={16} className="text-gray-600" />;
        }
    };

    const handleCheckoutTool = () => {
        setCurrentLogEntry(null); // Clear for new entry
        setModalMode('add');
        setShowCheckoutModal(true);
    };

    const handleViewLogEntry = (entry) => {
        setCurrentLogEntry(entry);
        setModalMode('view');
        setShowCheckoutModal(true);
    };

    const handleCheckinTool = (logEntry) => {
        setCurrentLogEntry(logEntry);
        setModalMode('checkin');
        setShowCheckoutModal(true);
    };

    const handleSaveLogEntry = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            const selectedTool = mockTools.find(tool => tool.id === formData.toolId);
            const selectedEmployee = mockEmployees.find(emp => emp.id === formData.employeeId);

            if (modalMode === 'add') {
                const newLog = {
                    id: `log-${Date.now()}`,
                    tool: selectedTool || { id: formData.toolId, name: 'Unknown Tool', type: 'Unknown', serialNumber: 'N/A' },
                    employee: selectedEmployee || { id: formData.employeeId, name: 'Unknown Employee' },
                    checkoutDate: formData.checkoutDate,
                    checkinDate: null,
                    status: 'Checked Out',
                    purpose: formData.purpose,
                };
                setCheckoutLogs([...checkoutLogs, newLog]);
                // Update tool status in mockTools (for accurate summary)
                mockTools.find(t => t.id === formData.toolId).status = 'Checked Out';
                alert('Tool checked out successfully!');
            } else if (modalMode === 'checkin' && currentLogEntry) {
                const updatedLogs = checkoutLogs.map(log =>
                    log.id === currentLogEntry.id
                        ? { ...log, checkinDate: formData.checkinDate, status: 'Checked In', purpose: formData.purpose }
                        : log
                );
                setCheckoutLogs(updatedLogs);
                // Update tool status in mockTools
                mockTools.find(t => t.id === currentLogEntry.tool.id).status = 'Available';
                alert('Tool checked in successfully!');
            }
            setShowCheckoutModal(false);
        } catch (err) {
            setError(`Failed to save log entry. ${err.message || ''}`);
            console.error('Save log entry error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fields for the Tool Checkout/Check-in/View Modal
    const checkoutFormFields = useMemo(() => {
        if (modalMode === 'add') {
            return [
                {
                    name: 'employeeId',
                    label: 'Checked Out By',
                    type: 'select',
                    options: [{ value: '', label: 'Select Employee' }, ...mockEmployees.map(emp => ({ value: emp.id, label: emp.name }))],
                    required: true,
                    placeholder: 'Select Employee',
                    icon: User,
                },
                {
                    name: 'toolId',
                    label: 'Tool',
                    type: 'select',
                    options: [{ value: '', label: 'Select Tool' }, ...mockTools.filter(tool => tool.status === 'Available').map(tool => ({ value: tool.id, label: `${tool.name} (${tool.serialNumber})` }))],
                    required: true,
                    placeholder: 'Select Tool',
                    icon: Cable,
                },
                {
                    name: 'checkoutDate',
                    label: 'Checkout Date',
                    type: 'date',
                    required: true,
                    icon: Calendar,
                    defaultValue: new Date().toISOString().slice(0, 10), // Default to today
                },
                {
                    name: 'purpose',
                    label: 'Purpose / Notes',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Reason for checkout, project, etc.',
                    icon: MessageSquare,
                },
            ];
        } else if (modalMode === 'checkin') {
            return [
                { name: 'toolNameDisplay', label: 'Tool', type: 'text', readOnly: true, icon: Cable },
                { name: 'employeeNameDisplay', label: 'Checked Out By', type: 'text', readOnly: true, icon: User },
                { name: 'checkoutDateDisplay', label: 'Checkout Date', type: 'text', readOnly: true, icon: Calendar },
                {
                    name: 'checkinDate',
                    label: 'Check-in Date',
                    type: 'date',
                    required: true,
                    icon: Calendar,
                    defaultValue: new Date().toISOString().slice(0, 10), // Default to today
                },
                {
                    name: 'purpose',
                    label: 'Check-in Notes (e.g., condition)',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Notes on tool condition, any issues, etc.',
                    icon: MessageSquare,
                },
            ];
        } else { // 'view' mode
            return [
                { name: 'toolNameDisplay', label: 'Tool', type: 'text', readOnly: true, icon: Cable },
                { name: 'toolSerialNumberDisplay', label: 'Serial Number', type: 'text', readOnly: true, icon: Tag },
                { name: 'toolTypeDisplay', label: 'Tool Type', type: 'text', readOnly: true, icon: Box },
                { name: 'employeeNameDisplay', label: 'Checked Out By', type: 'text', readOnly: true, icon: User },
                { name: 'checkoutDateDisplay', label: 'Checkout Date', type: 'text', readOnly: true, icon: Calendar },
                { name: 'checkinDateDisplay', label: 'Check-in Date', type: 'text', readOnly: true, icon: Calendar },
                { name: 'statusDisplay', label: 'Status', type: 'text', readOnly: true, icon: CheckCircle },
                { name: 'purpose', label: 'Purpose / Notes', type: 'textarea', rows: 3, readOnly: true, icon: MessageSquare },
            ];
        }
    }, [modalMode, mockEmployees, mockTools, currentLogEntry]);

    // Initial form data for the modal, derived from currentLogEntry or empty for 'add' mode
    const modalFormData = useMemo(() => {
        if (!currentLogEntry) {
            return {}; // Empty for add mode, ModalWithForm will use defaultValue
        }
        return {
            ...currentLogEntry,
            toolNameDisplay: currentLogEntry.tool.name,
            toolSerialNumberDisplay: currentLogEntry.tool.serialNumber,
            toolTypeDisplay: currentLogEntry.tool.type,
            employeeNameDisplay: currentLogEntry.employee.name,
            checkoutDateDisplay: currentLogEntry.checkoutDate,
            checkinDateDisplay: currentLogEntry.checkinDate || 'N/A',
            statusDisplay: currentLogEntry.status,
            // For checkin mode, ensure checkinDate is pre-filled if it exists or is current date
            checkinDate: currentLogEntry.checkinDate || new Date().toISOString().slice(0, 10),
        };
    }, [currentLogEntry]);


    const toolCheckoutTableColumns = [
        { header: 'Tool Name', accessor: 'tool.name' },
        { header: 'Serial Number', accessor: 'tool.serialNumber' },
        { header: 'Type', accessor: 'tool.type' },
        { header: 'Checked Out By', accessor: 'employee.name' },
        { header: 'Checkout Date', accessor: 'checkoutDate' },
        { header: 'Check-in Date', accessor: 'checkinDate', render: (row) => row.checkinDate || 'N/A' },
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
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewLogEntry(row)} className="flex items-center gap-1">
                        <Eye size={16} /> View
                    </Button>
                    {row.status === 'Checked Out' || row.status === 'Overdue' ? (
                        <Button variant="success" size="sm" onClick={() => handleCheckinTool(row)} className="flex items-center gap-1">
                            <RotateCcw size={16} /> Check In
                        </Button>
                    ) : null}
                    {/* Optionally add an edit button for checked-in logs if needed */}
                </div>
            ),
        },
    ];

    // Calculate summary totals for tools
    const summaryTotals = useMemo(() => {
        const totalTools = mockTools.length;
        const checkedOutTools = mockTools.filter(tool => tool.status === 'Checked Out').length;
        const availableTools = mockTools.filter(tool => tool.status === 'Available').length;
        const overdueTools = checkoutLogs.filter(log => log.status === 'Overdue').length;

        return { totalTools, checkedOutTools, availableTools, overdueTools };
    }, [mockTools, checkoutLogs]); // Depend on mockTools and checkoutLogs for accurate counts

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-teal-50 to-green-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Wrench className="w-10 h-10 text-teal-600" /> Tool Checkout Log
                </h1>
                <div className="flex gap-4">
                    <Button variant="primary" onClick={handleCheckoutTool} className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <Plus size={20} /> Checkout Tool
                    </Button>
                    <Link to="/hr/tools-assigned"> {/* Link back to a main dashboard or Inventory dashboard */}
                        <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <ArrowLeft size={20} /> Back to Tools
                        </Button>
                    </Link>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading tool checkout logs...</p>
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
                    {/* Tool Summary Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                            <Cable size={36} className="text-teal-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700">Total Tools</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-2">{summaryTotals.totalTools}</p>
                        </Card>
                        <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                            <User size={36} className="text-blue-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700">Checked Out Tools</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-2">{summaryTotals.checkedOutTools}</p>
                        </Card>
                        <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                            <CheckCircle size={36} className="text-green-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700">Available Tools</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-2">{summaryTotals.availableTools}</p>
                        </Card>
                        <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                            <Clock size={36} className="text-orange-500 mb-3" />
                            <h3 className="text-lg font-semibold text-gray-700">Overdue Tools</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-2">{summaryTotals.overdueTools}</p>
                        </Card>
                    </div>

                    {/* Filter and Search Section */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Input
                                label="Search Logs"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by employee, tool, serial..."
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
                                label="Filter by Tool Type"
                                name="filterToolType"
                                options={mockToolTypesForFilter}
                                value={filterToolType}
                                onChange={(e) => setFilterToolType(e.target.value)}
                                icon={<Tag size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={checkoutStatuses}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                icon={<Filter size={18} className="text-gray-400" />}
                            />
                            <div className="grid grid-cols-2 gap-4 col-span-full lg:col-span-2"> {/* Date range spanning two columns */}
                                <Input
                                    label="Checkout Start Date"
                                    name="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    icon={<Calendar size={18} className="text-gray-400" />}
                                />
                                <Input
                                    label="Checkout End Date"
                                    name="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    icon={<Calendar size={18} className="text-gray-400" />}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Tool Checkout Log List */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <ListChecks size={24} className="text-teal-500" /> Tool Checkout History
                        </h2>
                        {filteredLogs.length > 0 ? (
                            <Table columns={toolCheckoutTableColumns} data={filteredLogs} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No tool checkout logs found matching your criteria.
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Tool Checkout/Check-in/View Modal */}
            <ModalWithForm
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onSubmit={handleSaveLogEntry}
                title={
                    modalMode === 'add' ? 'Checkout New Tool' :
                    modalMode === 'checkin' ? 'Check-in Tool' :
                    'Tool Checkout Details'
                }
                fields={checkoutFormFields}
                formData={modalFormData}
            />
        </div>
    );
};

export default ToolCheckoutLogPage;
