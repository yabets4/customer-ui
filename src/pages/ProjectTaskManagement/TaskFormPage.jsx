// pages/ProjectTaskManagement/TaskFormPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input'; // Assuming this is a custom Input component
import Select from '../../components/ui/Select'; // Assuming this is a custom Select component
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    ClipboardList, ArrowLeft, Save, AlertCircle, User, Calendar, Tag, Clock, ListChecks,
    TrendingUp, CheckCircle, XCircle, Info, DollarSign, Wrench, Package, Link as LinkIcon, Plus, MinusCircle
} from 'lucide-react';

const TaskFormPage = () => {
    const { taskId } = useParams(); // Get task ID from URL for edit mode
    const navigate = useNavigate(); // For redirection after save
    const location = useLocation(); // To get query parameters (e.g., projectId for new task)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' }); // For success/error messages
    const [formData, setFormData] = useState({
        name: '',
        projectId: '', // Associated project
        assignedTo: '',
        startDate: '',
        endDate: '',
        status: 'Not Started', // Default status for new tasks
        priority: 'Medium', // Default priority for new tasks
        progress: 0,
        description: '',
        // New fields for rework, profitability, QC, tools, and dependencies
        qcRequired: false,
        qcResult: '', // 'Pass', 'Fail', or '' (pending)
        reworkReason: '',
        laborHours: 0,
        materialCosts: 0,
        incentive: 0,
        penalty: 0,
        materialsUsed: [], // [{ name: 'Material A', qty: 1 }]
        toolsUsed: [],     // [{ name: 'Tool X', duration: '2hrs' }]
        duration: 0,       // in days
        dependencies: [],  // ['task-id-1', 'task-id-2']
        reworkOfTaskId: '', // If this task is a rework of another
    });
    const [isEditing, setIsEditing] = useState(false);

    // --- Inline Mock Data (consistent with TaskListPage and TaskDetailsPage) ---
    const mockTasks = [
        {
            id: 'task-001', projectId: 'proj-001', name: 'Initial Planning & Scope Definition', assignedTo: 'Aisha Demisse', status: 'Completed', priority: 'High', startDate: '2025-01-10', endDate: '2025-01-20', progress: 100, description: 'Define project goals, scope, and key deliverables for the website redesign.',
            qcRequired: true, qcResult: 'Pass', reworkReason: '',
            laborHours: 80, materialCosts: 500, incentive: 1000, penalty: 0,
            materialsUsed: [{ name: 'Whiteboard Markers', qty: 2 }],
            toolsUsed: [{ name: 'Projector', duration: '8hrs' }],
            duration: 10,
            dependencies: []
        },
        {
            id: 'task-002', projectId: 'proj-001', name: 'UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-01-21', endDate: '2025-02-28', progress: 85, description: 'Create wireframes, mockups, and user flows for the new website interface.',
            qcRequired: true, qcResult: 'Fail', reworkReason: 'User flow not intuitive',
            laborHours: 120, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Design Software License', duration: '120hrs' }],
            duration: 39,
            dependencies: ['task-001']
        },
        {
            id: 'task-003', projectId: 'proj-001', name: 'Frontend Development', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Medium', startDate: '2025-03-01', endDate: '2025-05-31', progress: 0, description: 'Develop responsive user interface components based on approved designs.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 92,
            dependencies: ['task-002']
        },
        {
            id: 'task-004', projectId: 'proj-001', name: 'Backend API Development', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Medium', startDate: '2025-03-15', endDate: '2025-06-30', progress: 0, description: 'Build RESTful APIs for data management and integration with the frontend.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 107,
            dependencies: []
        },
        {
            id: 'task-005', projectId: 'proj-001', name: 'Content Migration', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Low', startDate: '2025-07-01', endDate: '2025-07-31', progress: 0, description: 'Migrate existing website content (text, images, videos) to the new platform.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 31,
            dependencies: ['task-003', 'task-004']
        },
        {
            id: 'task-006', projectId: 'proj-001', name: 'Rework UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-03-01', endDate: '2025-03-15', progress: 30, description: 'Address feedback from initial UI/UX review.',
            qcRequired: true, qcResult: '', reworkReason: '',
            laborHours: 40, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Design Software License', duration: '40hrs' }],
            reworkOfTaskId: 'task-002',
            duration: 15,
            dependencies: []
        },
        {
            id: 'task-007', projectId: 'proj-002', name: 'Vendor Selection', assignedTo: 'Sara Ali', status: 'Completed', priority: 'High', startDate: '2024-11-01', endDate: '2024-11-15', progress: 100, description: 'Evaluate and select the best HRIS vendor for the new system implementation.',
            qcRequired: true, qcResult: 'Pass', reworkReason: '',
            laborHours: 60, materialCosts: 0, incentive: 500, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 15,
            dependencies: []
        },
        {
            id: 'task-008', projectId: 'proj-002', name: 'Data Migration', assignedTo: 'Tesfaye Gebre', status: 'Completed', priority: 'High', startDate: '2025-01-01', endDate: '2025-03-31', progress: 100, description: 'Migrate all historical employee data from the old system to the new HRIS.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 180, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Data Migration Tool', duration: '180hrs' }],
            duration: 90,
            dependencies: ['task-007']
        },
        {
            id: 'task-009', projectId: 'proj-003', name: 'Mobile UI Design', assignedTo: 'Kebede Worku', status: 'In Progress', priority: 'High', startDate: '2025-03-05', endDate: '2025-04-15', progress: 60, description: 'Design the user interface and experience for the new mobile application.',
            qcRequired: true, qcResult: 'Fail', reworkReason: 'Feedback on navigation flow',
            laborHours: 90, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Figma', duration: '90hrs' }],
            duration: 42,
            dependencies: []
        },
        {
            id: 'task-010', projectId: 'proj-003', name: 'iOS App Development', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Medium', startDate: '2025-04-16', endDate: '2025-07-31', progress: 0, description: 'Develop the native iOS application based on the approved designs and APIs.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 106,
            dependencies: ['task-009']
        },
        {
            id: 'task-011', projectId: 'proj-003', name: 'Android App Development', assignedTo: 'Kebede Worku', status: 'Not Started', priority: 'Medium', startDate: '2025-04-20', endDate: '2025-08-15', progress: 0, description: 'Develop the native Android application based on the approved designs and APIs.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 118,
            dependencies: ['task-009']
        },
        {
            id: 'task-012', projectId: 'proj-001', name: 'Testing Phase', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'High', startDate: '2025-08-01', endDate: '2025-08-20', progress: 0, description: 'Conduct comprehensive testing (unit, integration, UAT) of the new website.',
            qcRequired: true, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 20,
            dependencies: ['task-005']
        },
        {
            id: 'task-013', projectId: 'proj-001', name: 'Deployment', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Urgent', startDate: '2025-08-25', endDate: '2025-08-30', progress: 0, description: 'Deploy the new website to production servers and monitor initial performance.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 6,
            dependencies: ['task-012']
        },
        {
            id: 'task-014', projectId: 'proj-003', name: 'Rework Mobile UI Design', assignedTo: 'Kebede Worku', status: 'To Do', priority: 'High', startDate: '2025-04-16', endDate: '2025-04-30', progress: 0, description: 'Implement feedback for mobile UI navigation flow.',
            qcRequired: true, qcResult: '', reworkReason: '',
            laborHours: 20, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Figma', duration: '20hrs' }],
            reworkOfTaskId: 'task-009',
            duration: 15,
            dependencies: ['task-009']
        },
    ];

    const mockProjects = [ // Full project data for dropdown
        { id: 'proj-001', name: 'Website Redesign' },
        { id: 'proj-002', name: 'New HR System Implementation' },
        { id: 'proj-003', name: 'Mobile App Development' },
    ];

    const mockAssignees = [
        { value: 'Aisha Demisse', label: 'Aisha Demisse' },
        { value: 'Tesfaye Gebre', label: 'Tesfaye Gebre' },
        { value: 'Sara Ali', label: 'Sara Ali' },
        { value: 'Kebede Worku', label: 'Kebede Worku' },
    ];

    const taskStatuses = [
        { value: 'Not Started', label: 'Not Started' },
        { value: 'To Do', label: 'To Do' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Overdue', label: 'Overdue' },
        { value: 'Blocked', label: 'Blocked' },
    ];

    const taskPriorities = [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
        { value: 'Urgent', label: 'Urgent' },
    ];

    const qcResults = [
        { value: '', label: 'Pending/N/A' },
        { value: 'Pass', label: 'Pass' },
        { value: 'Fail', label: 'Fail' },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const preselectedProjectId = queryParams.get('projectId');
        const preselectedReworkOfTaskId = queryParams.get('reworkOfTaskId');

        if (taskId) {
            setIsEditing(true);
            setLoading(true);
            setError(null);
            setTimeout(() => {
                const taskToEdit = mockTasks.find(t => t.id === taskId);
                if (taskToEdit) {
                    setFormData({
                        name: taskToEdit.name,
                        projectId: taskToEdit.projectId,
                        assignedTo: taskToEdit.assignedTo,
                        startDate: taskToEdit.startDate,
                        endDate: taskToEdit.endDate,
                        status: taskToEdit.status,
                        priority: taskToEdit.priority,
                        progress: taskToEdit.progress,
                        description: taskToEdit.description,
                        qcRequired: taskToEdit.qcRequired || false,
                        qcResult: taskToEdit.qcResult || '',
                        reworkReason: taskToEdit.reworkReason || '',
                        laborHours: taskToEdit.laborHours || 0,
                        materialCosts: taskToEdit.materialCosts || 0,
                        incentive: taskToEdit.incentive || 0,
                        penalty: taskToEdit.penalty || 0,
                        materialsUsed: taskToEdit.materialsUsed || [],
                        toolsUsed: taskToEdit.toolsUsed || [],
                        duration: taskToEdit.duration || 0,
                        dependencies: taskToEdit.dependencies || [],
                        reworkOfTaskId: taskToEdit.reworkOfTaskId || '',
                    });
                } else {
                    setError('Task not found for editing.');
                }
                setLoading(false);
            }, 500);
        } else {
            setIsEditing(false);
            setLoading(false);
            // Initialize with default values for new task, pre-filling from query params
            setFormData(prev => ({
                ...prev,
                projectId: preselectedProjectId || '',
                startDate: new Date().toISOString().slice(0, 10), // Default to today
                reworkOfTaskId: preselectedReworkOfTaskId || '',
                // If it's a rework task, default qcRequired to true and status to 'To Do'
                qcRequired: preselectedReworkOfTaskId ? true : false,
                status: preselectedReworkOfTaskId ? 'To Do' : 'Not Started',
            }));
        }
    }, [taskId, location.search]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
        }));
    };

    const handleArrayChange = (arrayName, index, field, value) => {
        setFormData(prev => {
            const newArray = [...prev[arrayName]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayName]: newArray };
        });
    };

    const handleAddArrayItem = (arrayName, newItem) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], newItem]
        }));
    };

    const handleRemoveArrayItem = (arrayName, index) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage({ type: '', text: '' }); // Clear previous messages

        // Basic validation
        if (!formData.name || !formData.projectId || !formData.assignedTo || !formData.startDate || !formData.endDate) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

            const taskToSave = {
                ...formData,
                progress: Number(formData.progress),
                laborHours: Number(formData.laborHours),
                materialCosts: Number(formData.materialCosts),
                incentive: Number(formData.incentive),
                penalty: Number(formData.penalty),
                // Ensure arrays are clean
                materialsUsed: formData.materialsUsed.filter(item => item.name),
                toolsUsed: formData.toolsUsed.filter(item => item.name),
                dependencies: formData.dependencies.filter(dep => dep),
            };

            if (isEditing) {
                // In a real app, you'd send taskToSave to a service for update
                console.log('Updated Task:', taskToSave);
                setMessage({ type: 'success', text: 'Task updated successfully!' });
                navigate(`/tasks/${taskId}/details`); // Redirect to task details page
            } else {
                // In a real app, you'd send taskToSave to a service for creation
                const newTaskId = `task-${Date.now()}`; // Simulate new ID from backend
                console.log('New Task Added:', { ...taskToSave, id: newTaskId });
                setMessage({ type: 'success', text: 'New task created successfully!' });
                navigate(`/tasks/${newTaskId}/details`); // Redirect to new task details page
            }
        } catch (err) {
            setError(`Failed to save task: ${err.message || 'An unexpected error occurred.'}`);
            console.error('Task save error:', err);
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000); // Clear message after 5 seconds
        }
    };

    const title = isEditing ? `Edit Task: ${formData.name || taskId}` : 'Create New Task';

    if (loading && isEditing) { // Show loading spinner only when fetching existing task data
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading task data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                .font-inter {
                    font-family: 'Inter', sans-serif;
                }
                `}
            </style>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                    <ClipboardList className="w-10 h-10 text-purple-600" /> {title}
                </h1>
                <Link to="/tasks">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Task List
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md dark:bg-red-900/30 dark:border-red-700 dark:text-red-300" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
            )}
            {message.text && (
                <div className={`flex items-center p-4 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {message.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <AlertCircle size={20} className="mr-2" />}
                    {message.text}
                </div>
            )}

            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Task Core Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Task Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., UI/UX Design"
                            required
                            icon={<ClipboardList size={18} className="text-gray-400" />}
                        />
                        <Select
                            label="Project"
                            name="projectId"
                            options={[{ value: '', label: 'Select Project' }, ...mockProjects.map(p => ({ value: p.id, label: p.name }))]}
                            value={formData.projectId}
                            onChange={handleChange}
                            required
                            icon={<ClipboardList size={18} className="text-gray-400" />}
                            disabled={!!formData.reworkOfTaskId} // Disable project selection if it's a rework task
                        />
                        <Select
                            label="Assigned To"
                            name="assignedTo"
                            options={[{ value: '', label: 'Select Assignee' }, ...mockAssignees]}
                            value={formData.assignedTo}
                            onChange={handleChange}
                            required
                            icon={<User size={18} className="text-gray-400" />}
                        />
                        <Input
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            icon={<Calendar size={18} className="text-gray-400" />}
                        />
                        <Input
                            label="End Date"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            icon={<Calendar size={18} className="text-gray-400" />}
                        />
                        <Select
                            label="Status"
                            name="status"
                            options={taskStatuses}
                            value={formData.status}
                            onChange={handleChange}
                            required
                            icon={<CheckCircle size={18} className="text-gray-400" />}
                        />
                        <Select
                            label="Priority"
                            name="priority"
                            options={taskPriorities}
                            value={formData.priority}
                            onChange={handleChange}
                            required
                            icon={<Tag size={18} className="text-gray-400" />}
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
                            icon={<TrendingUp size={18} className="text-gray-400" />}
                        />
                        <Input
                            label="Duration (Days)"
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="e.g., 10"
                            min="0"
                            icon={<Clock size={18} className="text-gray-400" />}
                        />
                    </div>
                    <div className="col-span-full">
                        <Input
                            label="Description"
                            name="description"
                            type="textarea"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide a detailed description of the task."
                            icon={<Info size={18} className="text-gray-400" />}
                        />
                    </div>

                    {/* Financial Details */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-500" /> Financial Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Input
                            label="Labor Hours"
                            name="laborHours"
                            type="number"
                            value={formData.laborHours}
                            onChange={handleChange}
                            placeholder="e.g., 80"
                            min="0"
                            icon={<Clock size={18} className="text-gray-400" />}
                        />
                        <Input
                            label="Material Costs (ETB)"
                            name="materialCosts"
                            type="number"
                            value={formData.materialCosts}
                            onChange={handleChange}
                            placeholder="e.g., 500"
                            min="0"
                            icon={<Package size={18} className="text-gray-400" />}
                        />
                        <Input
                            label="Incentive (ETB)"
                            name="incentive"
                            type="number"
                            value={formData.incentive}
                            onChange={handleChange}
                            placeholder="e.g., 1000"
                            min="0"
                            icon={<DollarSign size={18} className="text-gray-400" />}
                        />
                        <Input
                            label="Penalty (ETB)"
                            name="penalty"
                            type="number"
                            value={formData.penalty}
                            onChange={handleChange}
                            placeholder="e.g., 200"
                            min="0"
                            icon={<XCircle size={18} className="text-gray-400" />}
                        />
                    </div>

                    {/* QC & Rework Details */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4 flex items-center gap-2">
                        <ListChecks size={20} className="text-purple-500" /> Quality Control & Rework
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="qcRequired"
                                name="qcRequired"
                                checked={formData.qcRequired}
                                onChange={handleChange}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="qcRequired" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">QC Required</label>
                        </div>
                        {formData.qcRequired && (
                            <>
                                <Select
                                    label="QC Result"
                                    name="qcResult"
                                    options={qcResults}
                                    value={formData.qcResult}
                                    onChange={handleChange}
                                    icon={<CheckCircle size={18} className="text-gray-400" />}
                                />
                                {formData.qcResult === 'Fail' && (
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Rework Reason"
                                            name="reworkReason"
                                            type="textarea"
                                            rows="2"
                                            value={formData.reworkReason}
                                            onChange={handleChange}
                                            placeholder="Reason for rework (e.g., 'Design not responsive on mobile')"
                                            icon={<AlertCircle size={18} className="text-gray-400" />}
                                        />
                                    </div>
                                )}
                                {formData.reworkOfTaskId && (
                                    <div className="md:col-span-2">
                                        <Input
                                            label="Rework Of Task ID"
                                            name="reworkOfTaskId"
                                            value={formData.reworkOfTaskId}
                                            onChange={handleChange} // Allow changing if needed, or make disabled
                                            disabled // Typically, this would be pre-filled and not editable
                                            icon={<LinkIcon size={18} className="text-gray-400" />}
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            This task is a rework of another task.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Materials Used */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4 flex items-center gap-2">
                        <Package size={20} className="text-blue-500" /> Materials Used
                    </h3>
                    {formData.materialsUsed.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <Input
                                label="Material Name"
                                value={item.name}
                                onChange={(e) => handleArrayChange('materialsUsed', index, 'name', e.target.value)}
                                placeholder="e.g., Wood Panels"
                            />
                            <Input
                                label="Quantity"
                                type="number"
                                value={item.qty}
                                onChange={(e) => handleArrayChange('materialsUsed', index, 'qty', parseFloat(e.target.value) || 0)}
                                placeholder="e.g., 5"
                                min="0"
                            />
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => handleRemoveArrayItem('materialsUsed', index)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 md:col-span-1"
                            >
                                <MinusCircle size={18} /> Remove
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddArrayItem('materialsUsed', { name: '', qty: 0 })}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <Plus size={18} /> Add Material
                    </Button>

                    {/* Tools Used */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4 flex items-center gap-2">
                        <Wrench size={20} className="text-orange-500" /> Tools Used
                    </h3>
                    {formData.toolsUsed.map((tool, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <Input
                                label="Tool Name"
                                value={tool.name}
                                onChange={(e) => handleArrayChange('toolsUsed', index, 'name', e.target.value)}
                                placeholder="e.g., Hammer Drill"
                            />
                            <Input
                                label="Duration"
                                value={tool.duration}
                                onChange={(e) => handleArrayChange('toolsUsed', index, 'duration', e.target.value)}
                                placeholder="e.g., 4hrs or 2 days"
                            />
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => handleRemoveArrayItem('toolsUsed', index)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 md:col-span-1"
                            >
                                <MinusCircle size={18} /> Remove
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddArrayItem('toolsUsed', { name: '', duration: '' })}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <Plus size={18} /> Add Tool
                    </Button>

                    {/* Dependencies */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4 flex items-center gap-2">
                        <LinkIcon size={20} className="text-indigo-500" /> Dependencies
                    </h3>
                    {formData.dependencies.map((depId, index) => (
                        <div key={index} className="flex items-center gap-4 mb-3">
                            <Input
                                label={`Dependent Task ID ${index + 1}`}
                                value={depId}
                                onChange={(e) => handleArrayChange('dependencies', index, null, e.target.value)} // null for field as it's a string array
                                placeholder="e.g., task-001"
                                className="flex-grow"
                            />
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => handleRemoveArrayItem('dependencies', index)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <MinusCircle size={18} />
                            </Button>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddArrayItem('dependencies', '')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <Plus size={18} /> Add Dependency
                    </Button>


                    <div className="flex justify-end gap-4 mt-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/tasks')}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            <XCircle size={20} /> Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                        >
                            {loading ? <LoadingSpinner size={20} /> : <Save size={20} />}
                            {isEditing ? (loading ? 'Updating...' : 'Update Task') : (loading ? 'Creating...' : 'Create Task')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default TaskFormPage;
