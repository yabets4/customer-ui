// pages/ProjectTaskManagement/TaskListPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Table from '../../components/ui/Table'; // Reusable Table component
import ModalWithForm from '../../components/ui/modal'; // Reusable ModalWithForm component

// Lucide React Icons
import {
    ListChecks, ArrowLeft, Plus, Edit, Eye, Search, Filter, CheckCircle, XCircle,
    AlertCircle, User, Calendar, Tag, TrendingUp, ClipboardList, Trash2, Info
} from 'lucide-react';

const TaskListPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'Not Started', 'In Progress', 'Completed', 'Overdue', 'Blocked'
    const [filterPriority, setFilterPriority] = useState('all'); // 'all', 'Low', 'Medium', 'High', 'Urgent'
    const [filterAssignedTo, setFilterAssignedTo] = useState('all');
    const [filterProjectId, setFilterProjectId] = useState('all');

    const [tasks, setTasks] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null); // For viewing task details in a modal
    const [modalMode, setModalMode] = useState('view'); // 'view' for this page's modal

    // --- Inline Mock Data ---
    const mockTasks = [
        { id: 'task-001', projectId: 'proj-001', name: 'Initial Planning & Scope Definition', assignedTo: 'Aisha Demisse', status: 'Completed', priority: 'High', startDate: '2025-01-10', endDate: '2025-01-20', progress: 100, description: 'Define project goals, scope, and key deliverables.' },
        { id: 'task-002', projectId: 'proj-001', name: 'UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-01-21', endDate: '2025-02-28', progress: 85, description: 'Create wireframes, mockups, and user flows.' },
        { id: 'task-003', projectId: 'proj-001', name: 'Frontend Development', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Medium', startDate: '2025-03-01', endDate: '2025-05-31', progress: 0, description: 'Develop responsive user interface components.' },
        { id: 'task-004', projectId: 'proj-001', name: 'Backend API Development', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Medium', startDate: '2025-03-15', endDate: '2025-06-30', progress: 0, description: 'Build RESTful APIs for data management.' },
        { id: 'task-005', projectId: 'proj-001', name: 'Content Migration', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Low', startDate: '2025-07-01', endDate: '2025-07-31', progress: 0, description: 'Migrate existing website content to the new platform.' },
        { id: 'task-006', projectId: 'proj-002', name: 'Vendor Selection', assignedTo: 'Sara Ali', status: 'Completed', priority: 'High', startDate: '2024-11-01', endDate: '2024-11-15', progress: 100, description: 'Evaluate and select HRIS vendor.' },
        { id: 'task-007', projectId: 'proj-002', name: 'Data Migration', assignedTo: 'Tesfaye Gebre', status: 'Completed', priority: 'High', startDate: '2025-01-01', endDate: '2025-03-31', progress: 100, description: 'Migrate employee data from old system.' },
        { id: 'task-008', projectId: 'proj-003', name: 'Mobile UI Design', assignedTo: 'Kebede Worku', status: 'In Progress', priority: 'High', startDate: '2025-03-05', endDate: '2025-04-15', progress: 60, description: 'Design user interface for mobile application.' },
        { id: 'task-009', projectId: 'proj-003', name: 'iOS App Development', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Medium', startDate: '2025-04-16', endDate: '2025-07-31', progress: 0, description: 'Develop iOS native application.' },
        { id: 'task-010', projectId: 'proj-003', name: 'Android App Development', assignedTo: 'Kebede Worku', status: 'Not Started', priority: 'Medium', startDate: '2025-04-20', endDate: '2025-08-15', progress: 0, description: 'Develop Android native application.' },
        { id: 'task-011', projectId: 'proj-001', name: 'Testing Phase', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'High', startDate: '2025-08-01', endDate: '2025-08-20', progress: 0, description: 'Conduct comprehensive testing of the website.' },
        { id: 'task-012', projectId: 'proj-001', name: 'Deployment', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Urgent', startDate: '2025-08-25', endDate: '2025-08-30', progress: 0, description: 'Deploy the new website to production.' },
    ];

    const mockProjectsForFilter = [
        { value: 'all', label: 'All Projects' },
        { value: 'proj-001', label: 'Website Redesign' },
        { value: 'proj-002', label: 'New HR System Implementation' },
        { value: 'proj-003', label: 'Mobile App Development' },
    ];

    const mockAssignees = [
        { value: 'all', label: 'All Assignees' },
        { value: 'Aisha Demisse', label: 'Aisha Demisse' },
        { value: 'Tesfaye Gebre', label: 'Tesfaye Gebre' },
        { value: 'Sara Ali', label: 'Sara Ali' },
        { value: 'Kebede Worku', label: 'Kebede Worku' },
    ];

    const taskStatuses = [
        { value: 'all', label: 'All Statuses' },
        { value: 'Not Started', label: 'Not Started' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Overdue', label: 'Overdue' },
        { value: 'Blocked', label: 'Blocked' },
    ];

    const taskPriorities = [
        { value: 'all', label: 'All Priorities' },
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
        { value: 'Urgent', label: 'Urgent' },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            setTasks(mockTasks);
            setLoading(false);
        }, 700);
    }, []);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearchTerm = searchTerm.trim() === '' ||
                task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
            const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
            const matchesAssignedTo = filterAssignedTo === 'all' || task.assignedTo === filterAssignedTo;
            const matchesProjectId = filterProjectId === 'all' || task.projectId === filterProjectId;

            return matchesSearchTerm && matchesStatus && matchesPriority && matchesAssignedTo && matchesProjectId;
        }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)); // Sort by start date ascending
    }, [tasks, searchTerm, filterStatus, filterPriority, filterAssignedTo, filterProjectId]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Not Started': return 'bg-gray-100 text-gray-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            case 'Blocked': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityClasses = (priority) => {
        switch (priority) {
            case 'Low': return 'text-gray-500';
            case 'Medium': return 'text-blue-500';
            case 'High': return 'text-orange-500';
            case 'Urgent': return 'text-red-500 font-bold';
            default: return 'text-gray-500';
        }
    };

    const handleAddTask = () => {
        // Navigate to TaskFormPage for adding a new task
        navigate('/tasks/new');
    };

    const handleViewTask = (task) => {
        setCurrentTask(task);
        setModalMode('view');
        setShowTaskModal(true);
    };

    const handleEditTask = (task) => {
        // Navigate to TaskFormPage for editing an existing task
        navigate(`/tasks/${task.id}/edit`);
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            setLoading(true);
            setError(null);
            setTimeout(() => {
                setTasks(prev => prev.filter(task => task.id !== id));
                alert('Task deleted successfully.');
                setLoading(false);
            }, 500);
        }
    };

    // Columns for Task Table
    const taskTableColumns = [
        { header: 'Task ID', accessor: 'id' },
        { header: 'Task Name', accessor: 'name' },
        {
            header: 'Project',
            render: (row) => mockProjectsForFilter.find(p => p.value === row.projectId)?.label || 'N/A'
        },
        { header: 'Assigned To', accessor: 'assignedTo' },
        { header: 'Start Date', accessor: 'startDate' },
        { header: 'End Date', accessor: 'endDate' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(row.status)}`}>
                    {row.status}
                </span>
            ),
        },
        {
            header: 'Priority',
            render: (row) => (
                <span className={`text-sm font-medium ${getPriorityClasses(row.priority)}`}>
                    {row.priority}
                </span>
            ),
        },
        {
            header: 'Progress',
            render: (row) => (
                <div className="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${row.progress}%` }}></div>
                    <span className="text-xs text-gray-700 ml-2">{row.progress}%</span>
                </div>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Link to={`/projects/${row.id}/details`}>
                    <Button variant="outline" size="sm"  className="flex items-center gap-1">
                        <Eye size={16} /> View
                    </Button>
                    </Link>
                    <Button variant="secondary" size="sm" onClick={() => handleEditTask(row)} className="flex items-center gap-1">
                        <Edit size={16} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteTask(row.id)} className="flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </Button>
                </div>
            ),
        },
    ];

    // Fields for the Task View Modal (read-only)
    const taskViewFormFields = useMemo(() => [
        { name: 'name', label: 'Task Name', type: 'text', readOnly: true, icon: ClipboardList },
        {
            name: 'project',
            label: 'Project',
            type: 'text',
            readOnly: true,
            icon: ClipboardList,
            render: (value, formData) => mockProjectsForFilter.find(p => p.value === formData.projectId)?.label || 'N/A'
        },
        { name: 'assignedTo', label: 'Assigned To', type: 'text', readOnly: true, icon: User },
        { name: 'startDate', label: 'Start Date', type: 'date', readOnly: true, icon: Calendar },
        { name: 'endDate', label: 'End Date', type: 'date', readOnly: true, icon: Calendar },
        { name: 'status', label: 'Status', type: 'text', readOnly: true, icon: CheckCircle },
        { name: 'priority', label: 'Priority', type: 'text', readOnly: true, icon: Tag },
        { name: 'progress', label: 'Progress (%)', type: 'number', readOnly: true, icon: TrendingUp },
        { name: 'description', label: 'Description', type: 'textarea', rows: 4, readOnly: true, icon: Info },
    ], [mockProjectsForFilter]);

    const taskModalFormData = useMemo(() => {
        if (!currentTask) return {};
        return {
            ...currentTask,
            project: mockProjectsForFilter.find(p => p.value === currentTask.projectId)?.label || 'N/A'
        };
    }, [currentTask, mockProjectsForFilter]);


    return (
        <div className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <ListChecks className="w-10 h-10 text-purple-600" /> Task List
                </h1>
                <div className="flex gap-4">
                    <Link to="/tasks/new"> {/* Link to TaskFormPage for adding new task */}
                        <Button variant="primary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <Plus size={20} /> Add New Task
                        </Button>
                    </Link>
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
                    <p className="mt-4 text-lg text-gray-600">Loading tasks...</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Input
                                label="Search Tasks"
                                name="searchTerm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, assignee, description..."
                                icon={<Search size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Status"
                                name="filterStatus"
                                options={taskStatuses}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                icon={<Filter size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Priority"
                                name="filterPriority"
                                options={taskPriorities}
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                icon={<Tag size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Assignee"
                                name="filterAssignedTo"
                                options={mockAssignees}
                                value={filterAssignedTo}
                                onChange={(e) => setFilterAssignedTo(e.target.value)}
                                icon={<User size={18} className="text-gray-400" />}
                            />
                            <Select
                                label="Filter by Project"
                                name="filterProjectId"
                                options={mockProjectsForFilter}
                                value={filterProjectId}
                                onChange={(e) => setFilterProjectId(e.target.value)}
                                icon={<ClipboardList size={18} className="text-gray-400" />}
                            />
                        </div>
                    </Card>

                    {/* Task List Table */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <ListChecks size={24} className="text-purple-500" /> All Tasks
                        </h2>
                        {filteredTasks.length > 0 ? (
                            <Table columns={taskTableColumns} data={filteredTasks} />
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No tasks found matching your criteria.
                            </div>
                        )}
                    </Card>
                </>
            )}

            {/* Task View Modal */}
            <ModalWithForm
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                title="Task Details"
                fields={taskViewFormFields}
                formData={taskModalFormData}
                readOnly={true} // Ensure modal is read-only for viewing
            />
        </div>
    );
};

export default TaskListPage;
