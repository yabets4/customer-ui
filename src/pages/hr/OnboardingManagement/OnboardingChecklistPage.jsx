// pages/OnboardingManagement/OnboardingChecklistPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Table from '../../../components/ui/Table'; // Reusable Table component
import ModalWithForm from '../../../components/ui/modal'; // Reusable ModalWithForm component

// Lucide React Icons
import {
    ClipboardCheck, ArrowLeft, Plus, Edit, Trash2, Eye, User, Calendar, Search, Filter,
    CheckCircle, XCircle, Laptop , FileText, Upload, Users, Briefcase, Building2, Send,
    ListChecks, Info, AlertCircle
} from 'lucide-react';

const OnboardingChecklistPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'in_progress', 'completed', 'overdue'

    const [onboardingProcesses, setOnboardingProcesses] = useState([]);
    const [onboardingTemplates, setOnboardingTemplates] = useState([]);

    const [showProcessModal, setShowProcessModal] = useState(false);
    const [currentProcess, setCurrentProcess] = useState(null); // For editing/viewing process
    const [modalMode, setModalMode] = useState('add'); // 'add', 'view', 'edit'

    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState(null); // For editing/viewing template

    // --- Inline Mock Data ---
    const mockEmployees = [
        { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
        { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
        { id: 'emp-003', name: 'Sara Ali', department: 'Operations' },
        { id: 'emp-004', name: 'Kebede Worku', department: 'Finance' },
    ];

    const mockDepartments = [
        { value: 'all', label: 'All Departments' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'Operations', label: 'Operations' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
    ];

    const mockOnboardingTemplates = [
        {
            id: 'tpl-001',
            name: 'Standard Employee Onboarding',
            description: 'General onboarding for all new hires.',
            tasks: [
                { id: 'task-001', name: 'Sign Offer Letter', assignedTo: 'HR', dueDateOffsetDays: 0, status: 'pending', documents: [{ name: 'Offer Letter.pdf', url: '/docs/offer.pdf' }] },
                { id: 'task-002', name: 'IT Setup (Laptop, Accounts)', assignedTo: 'IT', dueDateOffsetDays: 2, status: 'pending' },
                { id: 'task-003', name: 'Welcome Kit Provision', assignedTo: 'HR', dueDateOffsetDays: 1, status: 'pending' },
                { id: 'task-004', name: 'Meet with Manager', assignedTo: 'Manager', dueDateOffsetDays: 3, status: 'pending' },
                { id: 'task-005', name: 'Complete HR Induction', assignedTo: 'Employee', dueDateOffsetDays: 5, status: 'pending' },
            ]
        },
        {
            id: 'tpl-002',
            name: 'IT Department Onboarding',
            description: 'Specific tasks for new IT hires.',
            tasks: [
                { id: 'task-006', name: 'Setup Dev Environment', assignedTo: 'IT', dueDateOffsetDays: 3, status: 'pending' },
                { id: 'task-007', name: 'Access Code Repositories', assignedTo: 'IT', dueDateOffsetDays: 4, status: 'pending' },
                { id: 'task-008', name: 'Security Training', assignedTo: 'Employee', dueDateOffsetDays: 7, status: 'pending' },
            ]
        },
    ];

    const mockOnboardingProcesses = [
        {
            id: 'proc-001',
            employee: { id: 'emp-001', name: 'Aisha Demisse', department: 'HR' },
            templateId: 'tpl-001',
            startDate: '2025-07-01',
            status: 'in_progress', // in_progress, completed, overdue
            tasks: [
                { id: 'task-001', name: 'Sign Offer Letter', assignedTo: 'HR', dueDate: '2025-07-01', completionDate: '2025-07-01', status: 'completed', documents: [{ name: 'Offer Letter.pdf', url: '/docs/offer.pdf' }] },
                { id: 'task-002', name: 'IT Setup (Laptop, Accounts)', assignedTo: 'IT', dueDate: '2025-07-03', completionDate: null, status: 'in_progress' },
                { id: 'task-003', name: 'Welcome Kit Provision', assignedTo: 'HR', dueDate: '2025-07-02', completionDate: null, status: 'pending' },
                { id: 'task-004', name: 'Meet with Manager', assignedTo: 'Manager', dueDate: '2025-07-04', completionDate: null, status: 'pending' },
                { id: 'task-005', name: 'Complete HR Induction', assignedTo: 'Employee', dueDate: '2025-07-06', completionDate: null, status: 'pending' },
            ]
        },
        {
            id: 'proc-002',
            employee: { id: 'emp-002', name: 'Tesfaye Gebre', department: 'IT' },
            templateId: 'tpl-002',
            startDate: '2025-06-15',
            status: 'overdue',
            tasks: [
                { id: 'task-001', name: 'Sign Offer Letter', assignedTo: 'HR', dueDate: '2025-06-15', completionDate: '2025-06-15', status: 'completed' },
                { id: 'task-006', name: 'Setup Dev Environment', assignedTo: 'IT', dueDate: '2025-06-18', completionDate: null, status: 'overdue' },
                { id: 'task-007', name: 'Access Code Repositories', assignedTo: 'IT', dueDate: '2025-06-19', completionDate: null, status: 'overdue' },
                { id: 'task-008', name: 'Security Training', assignedTo: 'Employee', dueDate: '2025-06-22', completionDate: null, status: 'overdue' },
            ]
        },
        {
            id: 'proc-003',
            employee: { id: 'emp-004', name: 'Kebede Worku', department: 'Finance' },
            templateId: 'tpl-001',
            startDate: '2025-05-01',
            status: 'completed',
            tasks: [
                { id: 'task-001', name: 'Sign Offer Letter', assignedTo: 'HR', dueDate: '2025-05-01', completionDate: '2025-05-01', status: 'completed' },
                { id: 'task-002', name: 'IT Setup (Laptop, Accounts)', assignedTo: 'IT', dueDate: '2025-05-03', completionDate: '2025-05-02', status: 'completed' },
                { id: 'task-003', name: 'Welcome Kit Provision', assignedTo: 'HR', dueDate: '2025-05-02', completionDate: '2025-05-02', status: 'completed' },
                { id: 'task-004', name: 'Meet with Manager', assignedTo: 'Manager', dueDate: '2025-05-04', completionDate: '2025-05-03', status: 'completed' },
                { id: 'task-005', name: 'Complete HR Induction', assignedTo: 'Employee', dueDate: '2025-05-06', completionDate: '2025-05-05', status: 'completed' },
            ]
        },
    ];
    // --- End Inline Mock Data ---

    const onboardingStatusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'overdue', label: 'Overdue' },
    ];

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setOnboardingProcesses(mockOnboardingProcesses);
            setOnboardingTemplates(mockOnboardingTemplates);
            setLoading(false);
        }, 700);
    }, []);

    const filteredProcesses = useMemo(() => {
        return onboardingProcesses.filter(process => {
            const matchesSearchTerm = searchTerm.trim() === '' ||
                process.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                process.tasks.some(task => task.name.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDepartment = filterDepartment === 'all' || process.employee.department === filterDepartment;
            const matchesStatus = filterStatus === 'all' || process.status === filterStatus;

            return matchesSearchTerm && matchesDepartment && matchesStatus;
        }).sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Sort by start date descending
    }, [onboardingProcesses, searchTerm, filterDepartment, filterStatus]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800'; // For individual tasks
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAssignedToIcon = (role) => {
        switch (role) {
            case 'HR': return <Users size={14} className="text-purple-500" />;
            case 'IT': return <Laptop size={14} className="text-teal-500" />; // Assuming Laptop for IT
            case 'Manager': return <Briefcase size={14} className="text-indigo-500" />;
            case 'Employee': return <User size={14} className="text-blue-500" />;
            default: return <Info size={14} className="text-gray-500" />;
        }
    };

    // --- Onboarding Process Management ---
    const handleInitiateOnboarding = () => {
        setCurrentProcess(null);
        setModalMode('add');
        setShowProcessModal(true);
    };

    const handleViewProcess = (process) => {
        setCurrentProcess(process);
        setModalMode('view');
        setShowProcessModal(true);
    };

    const handleEditProcess = (process) => {
        setCurrentProcess(process);
        setModalMode('edit');
        setShowProcessModal(true);
    };

    const handleSaveProcess = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            const selectedEmployee = mockEmployees.find(emp => emp.id === formData.employeeId);
            const selectedTemplate = onboardingTemplates.find(tpl => tpl.id === formData.templateId);

            if (!selectedEmployee || !selectedTemplate) {
                throw new Error('Selected employee or template not found.');
            }

            if (modalMode === 'add') {
                // Create new onboarding process based on template
                const newProcess = {
                    id: `proc-${Date.now()}`,
                    employee: selectedEmployee,
                    templateId: selectedTemplate.id,
                    startDate: formData.startDate,
                    status: 'in_progress',
                    tasks: selectedTemplate.tasks.map(task => ({
                        ...task,
                        dueDate: new Date(new Date(formData.startDate).setDate(new Date(formData.startDate).getDate() + task.dueDateOffsetDays)).toISOString().slice(0, 10),
                        status: 'pending', // All tasks start as pending
                        completionDate: null,
                    })),
                };
                setOnboardingProcesses(prev => [...prev, newProcess]);
                alert('New onboarding process initiated successfully!');
            } else if (modalMode === 'edit' && currentProcess) {
                // For editing, we primarily allow updating start date or notes,
                // actual task management happens within the detailed view/modal.
                const updatedProcess = {
                    ...currentProcess,
                    startDate: formData.startDate,
                    // You might allow changing template or employee here, but it's complex for mock
                };
                setOnboardingProcesses(prev => prev.map(p => p.id === updatedProcess.id ? updatedProcess : p));
                alert('Onboarding process updated successfully!');
            }
            setShowProcessModal(false);
        } catch (err) {
            setError(`Failed to save onboarding process. ${err.message || ''}`);
            console.error('Save process error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProcess = (id) => {
        if (window.confirm('Are you sure you want to delete this onboarding process? This cannot be undone.')) {
            setLoading(true);
            setError(null);
            setTimeout(() => {
                setOnboardingProcesses(prev => prev.filter(p => p.id !== id));
                alert('Onboarding process deleted.');
                setLoading(false);
            }, 500);
        }
    };

    const handleUpdateTaskStatus = (processId, taskId, newStatus) => {
        setOnboardingProcesses(prev =>
            prev.map(process => {
                if (process.id === processId) {
                    const updatedTasks = process.tasks.map(task =>
                        task.id === taskId
                            ? { ...task, status: newStatus, completionDate: newStatus === 'completed' ? new Date().toISOString().slice(0, 10) : null }
                            : task
                    );
                    // Update overall process status if all tasks are completed
                    const allCompleted = updatedTasks.every(task => task.status === 'completed');
                    return { ...process, tasks: updatedTasks, status: allCompleted ? 'completed' : process.status };
                }
                return process;
            })
        );
    };

    // Fields for Onboarding Process Modal
    const processFormFields = useMemo(() => {
        const fields = [
            {
                name: 'employeeId',
                label: 'New Employee',
                type: 'select',
                options: [{ value: '', label: 'Select Employee' }, ...mockEmployees.map(emp => ({ value: emp.id, label: emp.name }))],
                required: true,
                placeholder: 'Select Employee',
                icon: User,
                readOnly: modalMode !== 'add', // Only editable when adding new process
            },
            {
                name: 'templateId',
                label: 'Onboarding Template',
                type: 'select',
                options: [{ value: '', label: 'Select Template' }, ...onboardingTemplates.map(tpl => ({ value: tpl.id, label: tpl.name }))],
                required: true,
                placeholder: 'Select Template',
                icon: FileText,
                readOnly: modalMode !== 'add', // Only editable when adding new process
            },
            {
                name: 'startDate',
                label: 'Onboarding Start Date',
                type: 'date',
                required: true,
                icon: Calendar,
                readOnly: modalMode === 'view',
            },
        ];

        if (modalMode === 'view' || modalMode === 'edit') {
            fields.unshift(
                { name: 'employeeNameDisplay', label: 'Employee', type: 'text', readOnly: true, icon: User },
                { name: 'templateNameDisplay', label: 'Template Used', type: 'text', readOnly: true, icon: FileText },
                { name: 'statusDisplay', label: 'Overall Status', type: 'text', readOnly: true, icon: ClipboardCheck },
            );
        }

        return fields;
    }, [modalMode, onboardingTemplates]);

    const processModalFormData = useMemo(() => {
        if (!currentProcess) {
            return { employeeId: '', templateId: '', startDate: new Date().toISOString().slice(0, 10) };
        }
        const templateName = onboardingTemplates.find(tpl => tpl.id === currentProcess.templateId)?.name || 'Unknown Template';
        return {
            ...currentProcess,
            employeeId: currentProcess.employee.id,
            employeeNameDisplay: currentProcess.employee.name,
            templateNameDisplay: templateName,
            statusDisplay: currentProcess.status.replace(/_/g, ' ').toUpperCase(),
        };
    }, [currentProcess, onboardingTemplates]);

    // --- Onboarding Template Management ---
    const handleAddTemplate = () => {
        setCurrentTemplate(null);
        setShowTemplateModal(true);
    };

    const handleEditTemplate = (template) => {
        setCurrentTemplate(template);
        setShowTemplateModal(true);
    };

    const handleDeleteTemplate = (id) => {
        if (window.confirm('Are you sure you want to delete this template? This will not affect existing onboarding processes.')) {
            setLoading(true);
            setError(null);
            setTimeout(() => {
                setOnboardingTemplates(prev => prev.filter(tpl => tpl.id !== id));
                alert('Onboarding template deleted.');
                setLoading(false);
            }, 500);
        }
    };

    const handleSaveTemplate = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

            if (formData.id) {
                // Edit existing template
                const updatedTemplate = { ...formData, tasks: formData.tasks || [] }; // Ensure tasks array
                setOnboardingTemplates(prev => prev.map(tpl => tpl.id === updatedTemplate.id ? updatedTemplate : tpl));
                alert('Onboarding template updated successfully!');
            } else {
                // Add new template
                const newTemplate = {
                    id: `tpl-${Date.now()}`,
                    name: formData.name,
                    description: formData.description,
                    tasks: [], // New templates start with no tasks, tasks are managed in a sub-modal or dedicated page
                };
                setOnboardingTemplates(prev => [...prev, newTemplate]);
                alert('New onboarding template added successfully!');
            }
            setShowTemplateModal(false);
        } catch (err) {
            setError(`Failed to save onboarding template. ${err.message || ''}`);
            console.error('Save template error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fields for Onboarding Template Modal
    const templateFormFields = useMemo(() => [
        { name: 'name', label: 'Template Name', type: 'text', required: true, placeholder: 'e.g., Standard Employee Onboarding', icon: FileText },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, placeholder: 'Brief description of this template.', icon: Info },
    ], []);

    // Columns for Onboarding Processes Table
    const onboardingProcessTableColumns = [
        { header: 'Employee', accessor: 'employee.name' },
        { header: 'Department', accessor: 'employee.department' },
        {
            header: 'Template Used',
            render: (row) => onboardingTemplates.find(tpl => tpl.id === row.templateId)?.name || 'N/A'
        },
        { header: 'Start Date', accessor: 'startDate' },
        {
            header: 'Tasks Completed',
            render: (row) => `${row.tasks.filter(t => t.status === 'completed').length} / ${row.tasks.length}`
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(row.status)}`}>
                    {row.status.replace(/_/g, ' ')}
                </span>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewProcess(row)} className="flex items-center gap-1">
                        <Eye size={16} /> View
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleEditProcess(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteProcess(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <ClipboardCheck className="w-10 h-10 text-blue-600" /> Onboarding Checklist
                </h1>
                <div className="flex gap-4">
                    <Button variant="primary" onClick={handleInitiateOnboarding} className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <Plus size={20} /> Initiate Onboarding
                    </Button>
                    <Link to="/dashboard"> {/* Assuming a main dashboard */}
                        <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <ArrowLeft size={20} /> Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading onboarding data...</p>
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
                    {/* Filters and Search */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Search Onboarding"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by employee, task..."
                                icon={<Search size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Department"
                                name="filterDepartment"
                                options={mockDepartments}
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                icon={<Building2 size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={onboardingStatusOptions}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                icon={<Filter size={18} className="text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {/* Onboarding Processes List */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <ListChecks size={24} className="text-blue-500" /> Active Onboarding Processes
                        </h2>
                        {filteredProcesses.length > 0 ? (
                            <Table columns={onboardingProcessTableColumns} data={filteredProcesses} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No active onboarding processes found matching your criteria.
                            </div>
                        )}
                    </Card>

                    {/* Onboarding Templates Section */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <FileText size={24} className="text-purple-500" /> Onboarding Templates
                            </h2>
                            <Button variant="outline" onClick={handleAddTemplate} className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                                <Plus size={20} /> Create New Template
                            </Button>
                        </div>
                        {onboardingTemplates.length > 0 ? (
                            <ul className="space-y-4">
                                {onboardingTemplates.map(template => (
                                    <li key={template.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                                            <p className="text-sm text-gray-600">{template.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">{template.tasks.length} tasks defined</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)} className="flex items-center gap-1">
                                                <Edit size={16} /> Edit
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteTemplate(template.id)} className="flex items-center gap-1">
                                                <Trash2 size={16} /> Delete
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No onboarding templates defined yet.
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Onboarding Process Add/Edit/View Modal */}
            <ModalWithForm
                isOpen={showProcessModal}
                onClose={() => setShowProcessModal(false)}
                onSubmit={handleSaveProcess}
                title={
                    modalMode === 'add' ? 'Initiate New Onboarding' :
                    modalMode === 'edit' ? 'Edit Onboarding Process' :
                    'Onboarding Process Details'
                }
                fields={processFormFields}
                formData={processModalFormData}
            >
                {modalMode === 'view' && currentProcess && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                            <ListChecks size={20} className="text-green-500" /> Onboarding Tasks
                        </h3>
                        {currentProcess.tasks.length > 0 ? (
                            <ul className="space-y-3">
                                {currentProcess.tasks.map(task => (
                                    <li key={task.id} className="p-3 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getAssignedToIcon(task.assignedTo)}
                                            <div>
                                                <p className="font-semibold text-gray-800">{task.name}</p>
                                                <p className="text-xs text-gray-600">Assigned to: {task.assignedTo} | Due: {task.dueDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(task.status)}`}>
                                                {task.status.replace(/_/g, ' ')}
                                            </span>
                                            {modalMode !== 'view' && ( // Allow status update in edit mode
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleUpdateTaskStatus(currentProcess.id, task.id, task.status === 'completed' ? 'pending' : 'completed')}
                                                    title={task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                                                >
                                                    {task.status === 'completed' ? <XCircle size={18} className="text-red-500" /> : <CheckCircle size={18} className="text-green-500" />}
                                                </Button>
                                            )}
                                            {task.documents && task.documents.length > 0 && (
                                                <a href={task.documents[0].url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center gap-1">
                                                    <Upload size={16} /> Doc
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No tasks defined for this onboarding process.</p>
                        )}
                    </div>
                )}
            </ModalWithForm>

            {/* Onboarding Template Add/Edit Modal */}
            <ModalWithForm
                isOpen={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                onSubmit={handleSaveTemplate}
                title={currentTemplate ? 'Edit Onboarding Template' : 'Create New Onboarding Template'}
                fields={templateFormFields}
                formData={currentTemplate || {}}
            >
                {/* Note: Managing tasks within a template would ideally be a separate sub-modal or a dedicated template detail page */}
                <p className="text-sm text-gray-600 mt-4">
                    Tasks for this template are currently managed internally. For a full implementation, you would add a section here to add/edit/delete tasks within the template.
                </p>
            </ModalWithForm>
        </div>
    );
};

export default OnboardingChecklistPage;
