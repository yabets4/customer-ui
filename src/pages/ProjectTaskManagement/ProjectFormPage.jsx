// pages/ProjectTaskManagement/ProjectFormPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    ClipboardList, ArrowLeft, Save, AlertCircle, User, Calendar, DollarSign,
    Briefcase, Building2, TrendingUp, CheckCircle, Users, XCircle,
    Tag, MapPin, Info, Plus, FileText, Upload, MessageSquare,
    ThumbsUp, Layers, Package, Wrench, Factory, Hourglass, Percent, Banknote,
    ShieldAlert, File, MessageSquareText, GitPullRequest, MinusCircle
} from 'lucide-react';

const ProjectFormPage = () => {
    const { projectId } = useParams(); // Get project ID from URL for edit mode
    const navigate = useNavigate(); // For redirection after save

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        // SECTION 1: Project Overview
        name: '',
        type: '', // Project Type
        linkedSalesOrderId: '',
        customer: '',
        managerId: '', // Project Manager (Employee)
        description: '',

        // SECTION 2: Timeline & Priority
        startDate: '', // Estimated Start Date
        endDate: '', // Estimated End Date / Deadline
        priorityLevel: 'Medium', // Default priority
        status: 'Active', // Default status: "Confirmed" or "Active"

        // SECTION 3: Location & Delivery
        productionLocation: '', // Workshop or manufacturing site
        deliveryLocation: '',
        linkedShowroomOrProjectSite: '',

        // SECTION 4: Design & BOM
        linkedDesignFileTemplateId: '',
        linkedProducts: '', // Comma-separated product IDs/names
        billOfMaterialsVersion: '',
        customRequirementsUploads: '', // Text area for notes/sketches

        // SECTION 5: Employee Assignment
        projectTeamMembers: [], // Changed to array for multi-select
        roleOrSkillTags: '', // Comma-separated tags

        // SECTION 6: Tool & Machine Planning
        requiredToolTypes: [], // Changed to array for multi-select
        toolQuantityReservationWindow: '', // E.g., "3 drills for 5 days"
        toolAssignments: [], // New field: array of { toolTypeId, assignedEmployeeId }

        // SECTION 7: Materials Estimation
        triggerMaterialRequest: 'No', // Option to create pre-filled request to store

        // SECTION 8: Costing & Financials
        estimatedLaborCost: '',
        estimatedOverhead: '',
        estimatedProfitMargin: '', // Percentage or ETB
        paymentReceivedDepositStatus: 'Not Received',

        // SECTION 9: Quality Control & Risk
        qcCheckpoints: '', // Text area for checkpoints
        qcResponsibleEmployeeId: '',
        knownRisksWarnings: '', // Text area for risks

        // SECTION 10: Documents & Communication
        uploadedFiles: [], // Changed to array of file objects/names
        notesInstructions: '', // Internal notes
        customerComments: '', // From customer portal

        // SECTION 11: Approval Workflow
        designApprovalNeeded: 'No',
        approvalChain: '', // Comma-separated approvers names/IDs

        // Existing fields that might be updated based on new structure
        budget: '',
        progress: 0,
        department: '', // Moved to Project Overview implicitly via manager's department
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTeamMemberToAdd, setSelectedTeamMemberToAdd] = useState('');
    const [selectedToolTypeToAdd, setSelectedToolTypeToAdd] = useState('');

    // --- Inline Mock Data (extended for new fields) ---
    const mockProjects = [
        {
            id: 'proj-001', name: 'Website Redesign', type: 'Client Job', linkedSalesOrderId: 'SO-001', customer: 'ABC Corp', description: 'Complete overhaul of the company website, focusing on modern UI/UX and improved performance.',
            startDate: '2025-01-10', endDate: '2025-08-30', priorityLevel: 'High', status: 'Active',
            productionLocation: 'Workshop A', deliveryLocation: 'Client Site', linkedShowroomOrProjectSite: 'Showroom X',
            linkedDesignFileTemplateId: 'design-file-001', linkedProducts: 'Web Platform, CRM Integration', billOfMaterialsVersion: 'BOM-WEB-V2', customRequirementsUploads: 'See attached sketches for specific layout.',
            manager: { id: 'mgr-001', name: 'John Smith' }, department: 'Marketing',
            projectTeamMembers: ['emp-001', 'emp-002'], roleOrSkillTags: 'Frontend, Backend, UI/UX',
            requiredToolTypes: ['tool-type-001', 'tool-type-002'], toolQuantityReservationWindow: 'All project duration',
            toolAssignments: [{ toolTypeId: 'tool-type-001', assignedEmployeeId: 'emp-001' }], // Example assignment
            triggerMaterialRequest: 'No', estimatedLaborCost: 70000, estimatedOverhead: 10000, estimatedProfitMargin: 20, paymentReceivedDepositStatus: 'Partial',
            qcCheckpoints: 'UI/UX Review, Code Review, Performance Testing', qcResponsibleEmployeeId: 'emp-001', knownRisksWarnings: 'Potential delays in third-party API integration.',
            uploadedFiles: [{name: 'design_v1.pdf', url: '#'}, {name: 'wireframes.zip', url: '#'}], notesInstructions: 'Focus on mobile responsiveness.', customerComments: 'Client wants more interactive elements.',
            designApprovalNeeded: 'Yes', approvalChain: 'John Smith, Jane Doe',
            budget: 150000, progress: 75
        },
        {
            id: 'proj-002', name: 'New HR System Implementation', type: 'Internal', linkedSalesOrderId: '', customer: 'Internal', description: 'Deploying a new HRIS platform to streamline HR operations and employee data management.',
            startDate: '2024-11-01', endDate: '2025-07-15', priorityLevel: 'High', status: 'Completed',
            productionLocation: 'Head Office', deliveryLocation: 'N/A', linkedShowroomOrProjectSite: '',
            linkedDesignFileTemplateId: 'design-file-002', linkedProducts: 'HRIS Software', billOfMaterialsVersion: 'BOM-HRIS-V1', customRequirementsUploads: '',
            manager: { id: 'mgr-002', name: 'Jane Doe' }, department: 'HR',
            projectTeamMembers: ['emp-001', 'emp-003'], roleOrSkillTags: 'HR, IT Support',
            requiredToolTypes: ['tool-type-003'], toolQuantityReservationWindow: '2 weeks for migration',
            toolAssignments: [{ toolTypeId: 'tool-type-003', assignedEmployeeId: 'emp-003' }],
            triggerMaterialRequest: 'No', estimatedLaborCost: 120000, estimatedOverhead: 15000, estimatedProfitMargin: 10, paymentReceivedDepositStatus: 'Full',
            qcCheckpoints: 'Data Integrity Check, User Acceptance Testing', qcResponsibleEmployeeId: 'emp-003', knownRisksWarnings: 'Data privacy compliance issues.',
            uploadedFiles: [{name: 'HRIS_SOP.docx', url: '#'}], notesInstructions: 'Ensure all legacy data is accurately transferred.', customerComments: '',
            designApprovalNeeded: 'No', approvalChain: 'Jane Doe',
            budget: 200000, progress: 100
        },
    ];

    const mockManagers = [
        { value: 'mgr-001', label: 'John Smith' },
        { value: 'mgr-002', label: 'Jane Doe' },
        { value: 'mgr-003', label: 'Michael Brown' },
    ];

    const mockDepartments = [
        { value: 'Marketing', label: 'Marketing' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'IT', label: 'Information Technology' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Operations', label: 'Operations' },
    ];

    const projectStatuses = [
        { value: 'Confirmed', label: 'Confirmed' },
        { value: 'Active', label: 'Active' },
        { value: 'On Hold', label: 'On Hold' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Canceled', label: 'Canceled' },
    ];

    const projectTypes = [
        { value: 'Customer Order', label: 'Customer Order' },
        { value: 'Internal', label: 'Internal' },
        { value: 'R&D', label: 'R&D' },
    ];

    const priorityLevels = [
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
    ];

    const productionLocations = [
        { value: 'Workshop A', label: 'Workshop A' },
        { value: 'Workshop B', label: 'Workshop B' },
        { value: 'Storage C', label: 'Storage C' },
        { value: 'External Partner', label: 'External Partner' },
    ];

    const paymentStatuses = [
        { value: 'Not Received', label: 'Not Received' },
        { value: 'Partial', label: 'Partial' },
        { value: 'Full', label: 'Full' },
    ];

    const mockEmployees = [ // For QC Responsible Employee, Team Members, Tool Assignments
        { value: 'emp-001', label: 'Aisha Demisse' },
        { value: 'emp-002', label: 'Tesfaye Gebre' },
        { value: 'emp-003', label: 'Sara Ali' },
        { value: 'emp-004', label: 'Kebede Worku' },
        { value: 'emp-005', label: 'Yonas' },
        { value: 'emp-006', label: 'Mekdes' },
        { value: 'emp-007', label: 'Abebe' },
    ];

    const mockToolTypes = [
        { value: 'tool-type-001', label: 'CNC Router' },
        { value: 'tool-type-002', label: 'Upholstery Gun' },
        { value: 'tool-type-003', label: 'Table Saw' },
        { value: 'tool-type-004', label: 'Paint Spray Gun' },
        { value: 'tool-type-005', label: 'Drill Press' },
        { value: 'tool-type-006', label: 'Welding Machine' },
        { value: 'tool-type-007', label: 'Forklift' },
    ];

    const mockDesignFiles = [
        { value: 'design-file-001', label: 'Website Redesign - UI/UX v1.0' },
        { value: 'design-file-002', label: 'HR System - Flowchart v2.1' },
        { value: 'design-file-003', label: 'Mobile App - Wireframes Alpha' },
    ];

    useEffect(() => {
        if (projectId) {
            setIsEditing(true);
            setLoading(true);
            setError(null);
            setTimeout(() => {
                const projectToEdit = mockProjects.find(p => p.id === projectId);
                if (projectToEdit) {
                    setFormData({
                        // SECTION 1: Project Overview
                        name: projectToEdit.name || '',
                        type: projectToEdit.type || '',
                        linkedSalesOrderId: projectToEdit.linkedSalesOrderId || '',
                        customer: projectToEdit.customer || '',
                        managerId: projectToEdit.manager?.id || '',
                        description: projectToEdit.description || '',

                        // SECTION 2: Timeline & Priority
                        startDate: projectToEdit.startDate || '',
                        endDate: projectToEdit.endDate || '',
                        priorityLevel: projectToEdit.priorityLevel || 'Medium',
                        status: projectToEdit.status || 'Active',

                        // SECTION 3: Location & Delivery
                        productionLocation: projectToEdit.productionLocation || '',
                        deliveryLocation: projectToEdit.deliveryLocation || '',
                        linkedShowroomOrProjectSite: projectToEdit.linkedShowroomOrProjectSite || '',

                        // SECTION 4: Design & BOM
                        linkedDesignFileTemplateId: projectToEdit.linkedDesignFileTemplateId || '',
                        linkedProducts: projectToEdit.linkedProducts || '',
                        billOfMaterialsVersion: projectToEdit.billOfMaterialsVersion || '',
                        customRequirementsUploads: projectToEdit.customRequirementsUploads || '',

                        // SECTION 5: Employee Assignment
                        projectTeamMembers: projectToEdit.projectTeamMembers || [],
                        roleOrSkillTags: projectToEdit.roleOrSkillTags || '',

                        // SECTION 6: Tool & Machine Planning
                        requiredToolTypes: projectToEdit.requiredToolTypes || [],
                        toolQuantityReservationWindow: projectToEdit.toolQuantityReservationWindow || '',
                        toolAssignments: projectToEdit.toolAssignments || [], // Load existing tool assignments

                        // SECTION 7: Materials Estimation
                        triggerMaterialRequest: projectToEdit.triggerMaterialRequest || 'No',

                        // SECTION 8: Costing & Financials
                        estimatedLaborCost: projectToEdit.estimatedLaborCost || '',
                        estimatedOverhead: projectToEdit.estimatedOverhead || '',
                        estimatedProfitMargin: projectToEdit.estimatedProfitMargin || '',
                        paymentReceivedDepositStatus: projectToEdit.paymentReceivedDepositStatus || 'Not Received',

                        // SECTION 9: Quality Control & Risk
                        qcCheckpoints: projectToEdit.qcCheckpoints || '',
                        qcResponsibleEmployeeId: projectToEdit.qcResponsibleEmployeeId || '',
                        knownRisksWarnings: projectToEdit.knownRisksWarnings || '',

                        // SECTION 10: Documents & Communication
                        uploadedFiles: projectToEdit.uploadedFiles || [],
                        notesInstructions: projectToEdit.notesInstructions || '',
                        customerComments: projectToEdit.customerComments || '',

                        // SECTION 11: Approval Workflow
                        designApprovalNeeded: projectToEdit.designApprovalNeeded || 'No',
                        approvalChain: projectToEdit.approvalChain || '',

                        // Existing fields
                        budget: projectToEdit.budget || '',
                        progress: projectToEdit.progress || 0,
                        department: projectToEdit.department || '',
                    });
                } else {
                    setError('Project not found for editing.');
                }
                setLoading(false);
            }, 500);
        } else {
            setIsEditing(false);
            setLoading(false);
            // Initialize with default values for new project
            setFormData({
                // SECTION 1: Project Overview
                name: '', type: '', linkedSalesOrderId: '', customer: '', managerId: '', description: '',
                // SECTION 2: Timeline & Priority
                startDate: new Date().toISOString().slice(0, 10), endDate: '', priorityLevel: 'Medium', status: 'Confirmed',
                // SECTION 3: Location & Delivery
                productionLocation: '', deliveryLocation: '', linkedShowroomOrProjectSite: '',
                // SECTION 4: Design & BOM
                linkedDesignFileTemplateId: '', linkedProducts: '', billOfMaterialsVersion: '', customRequirementsUploads: '',
                // SECTION 5: Employee Assignment
                projectTeamMembers: [], roleOrSkillTags: '',
                // SECTION 6: Tool & Machine Planning
                requiredToolTypes: [], toolQuantityReservationWindow: '', toolAssignments: [],
                // SECTION 7: Materials Estimation
                triggerMaterialRequest: 'No',
                // SECTION 8: Costing & Financials
                estimatedLaborCost: '', estimatedOverhead: '', estimatedProfitMargin: '', paymentReceivedDepositStatus: 'Not Received',
                // SECTION 9: Quality Control & Risk
                qcCheckpoints: '', qcResponsibleEmployeeId: '', knownRisksWarnings: '',
                // SECTION 10: Documents & Communication
                uploadedFiles: [], notesInstructions: '', customerComments: '',
                // SECTION 11: Approval Workflow
                designApprovalNeeded: 'No', approvalChain: '',
                // Existing fields
                budget: '', progress: 0, department: '',
            });
        }
    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Handlers for dynamic lists (Team Members, Tool Types, Uploaded Files) ---
    const handleAddTeamMember = () => {
        if (selectedTeamMemberToAdd && !formData.projectTeamMembers.includes(selectedTeamMemberToAdd)) {
            setFormData(prev => ({
                ...prev,
                projectTeamMembers: [...prev.projectTeamMembers, selectedTeamMemberToAdd]
            }));
            setSelectedTeamMemberToAdd('');
        }
    };

    const handleRemoveTeamMember = (memberId) => {
        setFormData(prev => ({
            ...prev,
            projectTeamMembers: prev.projectTeamMembers.filter(id => id !== memberId)
        }));
    };

    const handleAddToolType = () => {
        if (selectedToolTypeToAdd && !formData.requiredToolTypes.includes(selectedToolTypeToAdd)) {
            setFormData(prev => ({
                ...prev,
                requiredToolTypes: [...prev.requiredToolTypes, selectedToolTypeToAdd],
                // Initialize tool assignment for this new tool type
                toolAssignments: [...prev.toolAssignments, { toolTypeId: selectedToolTypeToAdd, assignedEmployeeId: '' }]
            }));
            setSelectedToolTypeToAdd('');
        }
    };

    const handleRemoveToolType = (toolTypeId) => {
        setFormData(prev => ({
            ...prev,
            requiredToolTypes: prev.requiredToolTypes.filter(id => id !== toolTypeId),
            toolAssignments: prev.toolAssignments.filter(assignment => assignment.toolTypeId !== toolTypeId)
        }));
    };

    const handleToolAssignmentChange = (toolTypeId, employeeId) => {
        setFormData(prev => ({
            ...prev,
            toolAssignments: prev.toolAssignments.map(assignment =>
                assignment.toolTypeId === toolTypeId ? { ...assignment, assignedEmployeeId: employeeId } : assignment
            )
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file) // Create a temporary URL for display
        }));
        setFormData(prev => ({
            ...prev,
            uploadedFiles: [...prev.uploadedFiles, ...newFiles]
        }));
    };

    const handleRemoveFile = (fileName) => {
        setFormData(prev => ({
            ...prev,
            uploadedFiles: prev.uploadedFiles.filter(file => file.name !== fileName)
        }));
    };

    // Helper to get employee name from ID
    const getEmployeeLabel = (employeeId) => {
        return mockEmployees.find(emp => emp.value === employeeId)?.label || 'Unknown Employee';
    };

    // Helper to get tool type label from ID
    const getToolTypeLabel = (toolTypeId) => {
        return mockToolTypes.find(tool => tool.value === toolTypeId)?.label || 'Unknown Tool';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation for required fields
        const requiredFields = ['name', 'type', 'startDate', 'endDate', 'managerId', 'productionLocation', 'status', 'priorityLevel'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`Please fill in the required field: ${field.replace(/([A-Z])/g, ' $1').trim()}.`);
                setLoading(false);
                return;
            }
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            const projectToSave = {
                ...formData,
                budget: Number(formData.budget) || 0,
                progress: Number(formData.progress) || 0,
                estimatedLaborCost: Number(formData.estimatedLaborCost) || 0,
                estimatedOverhead: Number(formData.estimatedOverhead) || 0,
                estimatedProfitMargin: Number(formData.estimatedProfitMargin) || 0,
                manager: mockManagers.find(m => m.value === formData.managerId) || { id: formData.managerId, name: 'Unknown Manager' },
                qcResponsibleEmployee: mockEmployees.find(emp => emp.value === formData.qcResponsibleEmployeeId) || null,
                // These are just mock updates; in a real app, you'd integrate with a backend
            };

            if (isEditing) {
                // Logic to update existing project (mocking update in mockProjects array)
                const updatedMockProjects = mockProjects.map(p =>
                    p.id === projectId ? { ...p, ...projectToSave, id: projectId } : p
                );
                console.log('Updated Project:', projectToSave);
                alert('Project updated successfully!');
            } else {
                // Logic to add new project (mocking add to mockProjects array)
                const newProjectId = `proj-${Date.now()}`;
                const newProject = { ...projectToSave, id: newProjectId };
                console.log('New Project Added:', newProject);
                alert('New project created successfully!');
            }

            navigate('/projects'); // Redirect back to project list
        } catch (err) {
            setError(`Failed to save project: ${err.message || 'An unexpected error occurred.'}`);
            console.error('Project save error:', err);
        } finally {
            setLoading(false);
        }
    };

    const title = isEditing ? `Edit Project: ${formData.name || projectId}` : 'Create New Project';

    if (loading && isEditing) { // Show loading spinner only when fetching existing project data
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter dark:from-gray-900 dark:to-black">
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading project data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter text-gray-900 dark:from-gray-900 dark:to-black dark:text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                    <ClipboardList className="w-10 h-10 text-blue-600 dark:text-blue-400" /> {title}
                </h1>
                <Link to="/projects" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Project List
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
            )}

            <Card className="p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* SECTION 1: Project Overview */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <ClipboardList size={24} className="text-blue-600 dark:text-blue-400" /> SECTION 1: Project Overview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Project Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Website Redesign"
                                required
                                icon={<ClipboardList size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Project Type"
                                name="type"
                                options={[{ value: '', label: 'Select Type' }, ...projectTypes]}
                                value={formData.type}
                                onChange={(value) => handleSelectChange('type', value)}
                                required
                                icon={<Briefcase size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Linked Sales Order ID"
                                name="linkedSalesOrderId"
                                value={formData.linkedSalesOrderId}
                                onChange={handleChange}
                                placeholder="e.g., SO-001"
                                icon={<DollarSign size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Customer"
                                name="customer"
                                value={formData.customer}
                                onChange={handleChange}
                                placeholder="e.g., ABC Corp"
                                icon={<Users size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Project Manager"
                                name="managerId"
                                options={[{ value: '', label: 'Select Manager' }, ...mockManagers]}
                                value={formData.managerId}
                                onChange={(value) => handleSelectChange('managerId', value)}
                                required
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Department"
                                name="department"
                                options={[{ value: '', label: 'Select Department' }, ...mockDepartments]}
                                value={formData.department}
                                onChange={(value) => handleSelectChange('department', value)}
                                required
                                icon={<Building2 size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Project Description"
                                    name="description"
                                    type="textarea"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide a detailed description of the project scope."
                                    icon={<FileText size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Timeline & Priority */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <Calendar size={24} className="text-orange-600 dark:text-orange-400" /> SECTION 2: Timeline & Priority
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Estimated Start Date"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Estimated End Date / Deadline"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                icon={<Calendar size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Priority Level"
                                name="priorityLevel"
                                options={priorityLevels}
                                value={formData.priorityLevel}
                                onChange={(value) => handleSelectChange('priorityLevel', value)}
                                required
                                icon={<Tag size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Status"
                                name="status"
                                options={projectStatuses}
                                value={formData.status}
                                onChange={(value) => handleSelectChange('status', value)}
                                required
                                icon={<CheckCircle size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Progress (%)"
                                name="progress"
                                type="number"
                                value={formData.progress}
                                onChange={handleChange}
                                placeholder="0-100"
                                min="0"
                                max="100"
                                icon={<TrendingUp size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                             <Input
                                label="Budget (ETB)"
                                name="budget"
                                type="number"
                                value={formData.budget}
                                onChange={handleChange}
                                placeholder="e.g., 150000"
                                icon={<DollarSign size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>
                    </div>

                    {/* SECTION 3: Location & Delivery */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <MapPin size={24} className="text-teal-600 dark:text-teal-400" /> SECTION 3: Location & Delivery
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Production Location"
                                name="productionLocation"
                                options={[{ value: '', label: 'Select Location' }, ...productionLocations]}
                                value={formData.productionLocation}
                                onChange={(value) => handleSelectChange('productionLocation', value)}
                                required
                                icon={<Factory size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Delivery Location"
                                name="deliveryLocation"
                                value={formData.deliveryLocation}
                                onChange={handleChange}
                                placeholder="Customer address or site location"
                                icon={<MapPin size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Linked Showroom or Project Site"
                                name="linkedShowroomOrProjectSite"
                                value={formData.linkedShowroomOrProjectSite}
                                onChange={handleChange}
                                placeholder="If physical delivery is part of the flow"
                                icon={<Building2 size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>
                    </div>

                    {/* SECTION 4: Design & BOM */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <Layers size={24} className="text-purple-600 dark:text-purple-400" /> SECTION 4: Design & BOM
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Linked Design File/Template"
                                name="linkedDesignFileTemplateId"
                                options={[{ value: '', label: 'Select Design File' }, ...mockDesignFiles]}
                                value={formData.linkedDesignFileTemplateId}
                                onChange={(value) => handleSelectChange('linkedDesignFileTemplateId', value)}
                                icon={<File size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Linked Product(s)"
                                name="linkedProducts"
                                value={formData.linkedProducts}
                                onChange={handleChange}
                                placeholder="Comma-separated product names"
                                icon={<Package size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Bill of Materials (BOM) Version"
                                name="billOfMaterialsVersion"
                                value={formData.billOfMaterialsVersion}
                                onChange={handleChange}
                                placeholder="Auto-linked or manually selected"
                                icon={<ClipboardList size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Custom Requirements / Uploads Notes"
                                    name="customRequirementsUploads"
                                    type="textarea"
                                    rows="2"
                                    value={formData.customRequirementsUploads}
                                    onChange={handleChange}
                                    placeholder="Sketches, images, notes from customer"
                                    icon={<Upload size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: Employee Assignment */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <Users size={24} className="text-cyan-600 dark:text-cyan-400" /> SECTION 5: Employee Assignment
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Team Members</label>
                                <div className="flex items-center gap-2">
                                    <Select
                                        name="selectedTeamMemberToAdd"
                                        options={mockEmployees.filter(emp => !formData.projectTeamMembers.includes(emp.value))}
                                        value={selectedTeamMemberToAdd}
                                        onChange={setSelectedTeamMemberToAdd}
                                        placeholder="Select team member"
                                        icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddTeamMember}
                                        disabled={!selectedTeamMemberToAdd}
                                        className="p-2.5 rounded-lg"
                                    >
                                        <Plus size={20} />
                                    </Button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.projectTeamMembers.map(memberId => (
                                        <span key={memberId} className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">
                                            {getEmployeeLabel(memberId)}
                                            <button type="button" onClick={() => handleRemoveTeamMember(memberId)} className="ml-1 text-blue-600 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100">
                                                <XCircle size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Input
                                label="Role or Skill Tags"
                                name="roleOrSkillTags"
                                value={formData.roleOrSkillTags}
                                onChange={handleChange}
                                placeholder="Used for later task auto-matching (comma-separated)"
                                icon={<Tag size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>
                    </div>

                    {/* SECTION 6: Tool & Machine Planning */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <Wrench size={24} className="text-red-600 dark:text-red-400" /> SECTION 6: Tool & Machine Planning
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Tool Types</label>
                                <div className="flex items-center gap-2">
                                    <Select
                                        name="selectedToolTypeToAdd"
                                        options={mockToolTypes.filter(tool => !formData.requiredToolTypes.includes(tool.value))}
                                        value={selectedToolTypeToAdd}
                                        onChange={setSelectedToolTypeToAdd}
                                        placeholder="Select tool type"
                                        icon={<Wrench size={18} className="text-gray-400 dark:text-gray-500" />}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddToolType}
                                        disabled={!selectedToolTypeToAdd}
                                        className="p-2.5 rounded-lg"
                                    >
                                        <Plus size={20} />
                                    </Button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.requiredToolTypes.map(toolTypeId => (
                                        <span key={toolTypeId} className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-sm font-medium">
                                            {getToolTypeLabel(toolTypeId)}
                                            <button type="button" onClick={() => handleRemoveToolType(toolTypeId)} className="ml-1 text-purple-600 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100">
                                                <XCircle size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {formData.requiredToolTypes.length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                        <User size={20} className="text-blue-600 dark:text-blue-400" /> Assign Tools to Employees
                                    </h3>
                                    {formData.requiredToolTypes.map(toolTypeId => {
                                        const assignment = formData.toolAssignments.find(ta => ta.toolTypeId === toolTypeId);
                                        const assignedEmployeeId = assignment ? assignment.assignedEmployeeId : '';
                                        return (
                                            <div key={toolTypeId} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3">
                                                <p className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-1/3">
                                                    {getToolTypeLabel(toolTypeId)}:
                                                </p>
                                                <Select
                                                    name={`tool-assign-${toolTypeId}`}
                                                    options={[{ value: '', label: 'Select Employee' }, ...mockEmployees]}
                                                    value={assignedEmployeeId}
                                                    onChange={(value) => handleToolAssignmentChange(toolTypeId, value)}
                                                    placeholder="Assign employee"
                                                    icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                                                    className="w-full sm:w-2/3"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <Input
                                label="Tool Quantity / Reservation Window"
                                name="toolQuantityReservationWindow"
                                value={formData.toolQuantityReservationWindow}
                                onChange={handleChange}
                                placeholder="Expected usage time or duration"
                                icon={<Hourglass size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            {/* Tool Location Check and Maintenance Check are auto-generated/system checks, not user input fields */}
                        </div>
                    </div>

                    {/* SECTION 7: Materials Estimation */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <Package size={24} className="text-green-600 dark:text-green-400" /> SECTION 7: Materials Estimation
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* BOM-based Material List and Material Availability Check are auto-generated */}
                            <Select
                                label="Trigger Material Request"
                                name="triggerMaterialRequest"
                                options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
                                value={formData.triggerMaterialRequest}
                                onChange={(value) => handleSelectChange('triggerMaterialRequest', value)}
                                icon={<GitPullRequest size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>
                    </div>

                    {/* SECTION 8: Costing & Financials */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <DollarSign size={24} className="text-yellow-600 dark:text-yellow-400" /> SECTION 8: Costing & Financials
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Estimated Material Cost is auto-generated */}
                            <Input
                                label="Estimated Labor Cost (ETB)"
                                name="estimatedLaborCost"
                                type="number"
                                value={formData.estimatedLaborCost}
                                onChange={handleChange}
                                placeholder="Based on employee roles & task durations"
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Estimated Overhead (ETB)"
                                name="estimatedOverhead"
                                type="number"
                                value={formData.estimatedOverhead}
                                onChange={handleChange}
                                placeholder="Manually entered or system-calculated"
                                icon={<Briefcase size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Input
                                label="Estimated Profit Margin (%)"
                                name="estimatedProfitMargin"
                                type="number"
                                value={formData.estimatedProfitMargin}
                                onChange={handleChange}
                                placeholder="% or ETB based (for internal use)"
                                icon={<Percent size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="Payment Received / Deposit Status"
                                name="paymentReceivedDepositStatus"
                                options={paymentStatuses}
                                value={formData.paymentReceivedDepositStatus}
                                onChange={(value) => handleSelectChange('paymentReceivedDepositStatus', value)}
                                icon={<Banknote size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>
                    </div>

                    {/* SECTION 9: Quality Control & Risk */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <ShieldAlert size={24} className="text-indigo-600 dark:text-indigo-400" /> SECTION 9: Quality Control & Risk
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="QC Checkpoints"
                                name="qcCheckpoints"
                                type="textarea"
                                rows="2"
                                value={formData.qcCheckpoints}
                                onChange={handleChange}
                                placeholder="Auto-suggested or manually set"
                                icon={<CheckCircle size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <Select
                                label="QC Responsible Employee"
                                name="qcResponsibleEmployeeId"
                                options={[{ value: '', label: 'Select Employee' }, ...mockEmployees]}
                                value={formData.qcResponsibleEmployeeId}
                                onChange={(value) => handleSelectChange('qcResponsibleEmployeeId', value)}
                                icon={<User size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Known Risks / Warnings"
                                    name="knownRisksWarnings"
                                    type="textarea"
                                    rows="2"
                                    value={formData.knownRisksWarnings}
                                    onChange={handleChange}
                                    placeholder="Notes on potential issues (delays, complexity)"
                                    icon={<AlertCircle size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 10: Documents & Communication */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <MessageSquareText size={24} className="text-pink-600 dark:text-pink-400" /> SECTION 10: Documents & Communication
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Uploaded Files</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="flex-grow" // Allow input to grow
                                        icon={<Upload size={18} className="text-gray-400 dark:text-gray-500" />}
                                    />
                                </div>
                                <div className="mt-2 space-y-1">
                                    {formData.uploadedFiles.length > 0 ? (
                                        formData.uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-200">
                                                <span>{file.name}</span>
                                                <button type="button" onClick={() => handleRemoveFile(file.name)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                                    <MinusCircle size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No files uploaded.</p>
                                    )}
                                </div>
                            </div>
                            <Input
                                label="Notes / Instructions"
                                name="notesInstructions"
                                type="textarea"
                                rows="2"
                                value={formData.notesInstructions}
                                onChange={handleChange}
                                placeholder="Internal notes for project execution"
                                icon={<Info size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Customer Comments"
                                    name="customerComments"
                                    type="textarea"
                                    rows="2"
                                    value={formData.customerComments}
                                    onChange={handleChange}
                                    placeholder="If created via customer portal"
                                    icon={<MessageSquare size={18} className="text-gray-400 dark:text-gray-500" />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 11: Approval Workflow */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                            <ThumbsUp size={24} className="text-lime-600 dark:text-lime-400" /> SECTION 11: Approval Workflow
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Design Approval Needed"
                                name="designApprovalNeeded"
                                options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
                                value={formData.designApprovalNeeded}
                                onChange={(value) => handleSelectChange('designApprovalNeeded', value)}
                                icon={<CheckCircle size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                            {/* Finance Approval Needed is auto-generated */}
                            <Input
                                label="Approval Chain"
                                name="approvalChain"
                                value={formData.approvalChain}
                                onChange={handleChange}
                                placeholder="Assign approvers if needed (comma-separated)"
                                icon={<Users size={18} className="text-gray-400 dark:text-gray-500" />}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/projects')}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <XCircle size={20} /> Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            {loading ? <LoadingSpinner size={20} /> : <Save size={20} />}
                            {isEditing ? (loading ? 'Updating...' : 'Update Project') : (loading ? 'Creating...' : 'Create Project')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ProjectFormPage;
