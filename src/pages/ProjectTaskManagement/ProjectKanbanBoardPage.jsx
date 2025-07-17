import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link, useParams } from 'react-router-dom';
import { Kanban, ClipboardList, ArrowLeft, User, Calendar, Tag, AlertCircle, Plus, Edit, Trash2, Info as InfoIcon, CheckCircle, XCircle, Clock } from 'lucide-react'; // Added icons
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ModalWithForm from '../../components/ui/modal'; // Assuming ModalWithForm is available
import Input from '../../components/ui/input'; // Assuming Input component
import Select from '../../components/ui/Select'; // Assuming Select component

const COLUMN_ORDER = ['Not Started', 'In Progress', 'Completed', 'Overdue', 'Blocked'];

const ProjectKanbanBoardPage = () => {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState(null);
    const [columns, setColumns] = useState({});
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [currentEditingTask, setCurrentEditingTask] = useState(null);

    const mockProjects = [{
        id: 'proj-001', name: 'Website Redesign', description: 'Complete overhaul of the company website.',
        startDate: '2025-01-10', endDate: '2025-08-30', status: 'Active',
        manager: { id: 'mgr-001', name: 'John Smith' },
        department: 'Marketing', budget: 150000, progress: 75
    },
    {
        id: 'proj-002', name: 'New HR System Implementation', description: 'Deploying a new HRIS platform.',
        startDate: '2024-11-01', endDate: '2025-07-15', status: 'Completed',
        manager: { id: 'mgr-002', name: 'Jane Doe' },
        department: 'HR', budget: 200000, progress: 100
    },
    {
        id: 'proj-003', name: 'Mobile App Development', description: 'Building a customer-facing mobile application.',
        startDate: '2025-03-01', endDate: '2025-12-31', status: 'Active',
        manager: { id: 'mgr-001', name: 'John Smith' },
        department: 'IT', budget: 300000, progress: 40
    },];
    const mockTasks = [{ id: 'task-001', projectId: 'proj-001', name: 'Initial Planning & Scope Definition', assignedTo: 'Aisha Demisse', status: 'Completed', priority: 'High', startDate: '2025-01-10', endDate: '2025-01-20', progress: 100, description: 'Define project goals, scope, and key deliverables.' },
    { id: 'task-002', projectId: 'proj-001', name: 'UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-01-21', endDate: '2025-02-28', progress: 85, description: 'Create wireframes, mockups, and user flows.' },
    { id: 'task-003', projectId: 'proj-001', name: 'Frontend Development', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Medium', startDate: '2025-03-01', endDate: '2025-05-31', progress: 0, description: 'Develop responsive user interface components.' },
    { id: 'task-004', projectId: 'proj-001', name: 'Backend API Development', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Medium', startDate: '2025-03-15', endDate: '2025-06-30', progress: 0, description: 'Build RESTful APIs for data management.' },
    { id: 'task-005', projectId: 'proj-001', name: 'Content Migration', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Low', startDate: '2025-07-01', endDate: '2025-07-31', progress: 0, description: 'Migrate existing website content to the new platform.' },
    { id: 'task-006', projectId: 'proj-001', name: 'Testing Phase', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'High', startDate: '2025-08-01', endDate: '2025-08-20', progress: 0, description: 'Conduct comprehensive testing of the website.' },
    { id: 'task-007', projectId: 'proj-001', name: 'Deployment', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Urgent', startDate: '2025-08-25', endDate: '2025-08-30', progress: 0, description: 'Deploy the new website to production.' },

    { id: 'task-008', projectId: 'proj-002', name: 'HRIS Vendor Selection', assignedTo: 'Sara Ali', status: 'Completed', priority: 'High', startDate: '2024-11-01', endDate: '2024-11-15', progress: 100, description: 'Evaluate and select HRIS vendor.' },
    { id: 'task-009', projectId: 'proj-002', name: 'Data Migration Plan', assignedTo: 'Tesfaye Gebre', status: 'Completed', priority: 'High', startDate: '2024-11-16', endDate: '2024-11-30', progress: 100, description: 'Plan for migrating employee data.' },
    { id: 'task-010', projectId: 'proj-002', name: 'System Configuration', assignedTo: 'Tesfaye Gebre', status: 'Completed', priority: 'Medium', startDate: '2024-12-01', endDate: '2025-01-31', progress: 100, description: 'Configure new HRIS modules.' },

    { id: 'task-011', projectId: 'proj-003', name: 'Requirement Gathering', assignedTo: 'Kebede Worku', status: 'Completed', priority: 'High', startDate: '2025-03-01', endDate: '2025-03-15', progress: 100, description: 'Gather requirements for mobile app.' },
    { id: 'task-012', projectId: 'proj-003', name: 'Mobile UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-03-16', endDate: '2025-04-30', progress: 60, description: 'Design mobile app interface.' },
    { id: 'task-013', projectId: 'proj-003', name: 'API Integration', assignedTo: 'Kebede Worku', status: 'Not Started', priority: 'Medium', startDate: '2025-05-01', endDate: '2025-06-30', progress: 0, description: 'Integrate with backend APIs.' },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const found = mockProjects.find(p => p.id === projectId);
            if (!found) {
                setError('Project not found');
                setLoading(false);
                return;
            }
            setProject(found);

            const projectTasks = mockTasks.filter(t => t.projectId === projectId);
            const grouped = COLUMN_ORDER.reduce((acc, status) => {
                acc[status] = projectTasks.filter(t => t.status === status);
                return acc;
            }, {});
            setColumns(grouped);
            setLoading(false);
        }, 600);
    }, [projectId]);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // If dropped in the same column and same position, do nothing
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceCol = Array.from(columns[source.droppableId]);
        const destCol = Array.from(columns[destination.droppableId]);

        const [movedTask] = sourceCol.splice(source.index, 1);
        movedTask.status = destination.droppableId; // Update status based on new column

        destCol.splice(destination.index, 0, movedTask);

        setColumns({
            ...columns,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol
        });
    };

    const priorityColor = (priority) => {
        switch (priority) {
            case 'Low': return 'text-gray-500 bg-gray-100 dark:text-gray-300 dark:bg-gray-600';
            case 'Medium': return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-800';
            case 'High': return 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-800';
            case 'Urgent': return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-800 font-bold';
            default: return 'text-gray-500 bg-gray-100 dark:text-gray-300 dark:bg-gray-600';
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Not Started': return 'border-l-4 border-gray-400 dark:border-gray-500';
            case 'In Progress': return 'border-l-4 border-blue-500 dark:border-blue-600';
            case 'Completed': return 'border-l-4 border-green-500 dark:border-green-600';
            case 'Overdue': return 'border-l-4 border-red-500 dark:border-red-600 animate-pulse';
            case 'Blocked': return 'border-l-4 border-orange-500 dark:border-orange-600';
            default: return 'border-l-4 border-gray-300 dark:border-gray-600';
        }
    };

    const handleEditTask = (task) => {
        setCurrentEditingTask(task);
        setShowEditTaskModal(true);
    };

    const handleSaveTask = (formData) => {
        setColumns(prevColumns => {
            const newColumns = { ...prevColumns };
            let oldStatus = null;

            // Find the column the task currently belongs to
            for (const statusKey of COLUMN_ORDER) {
                const taskIndex = newColumns[statusKey]?.findIndex(t => t.id === formData.id);
                if (taskIndex !== -1 && taskIndex !== undefined) {
                    oldStatus = statusKey;
                    break;
                }
            }

            // If it's an existing task and its status has changed, remove from old column
            if (oldStatus && oldStatus !== formData.status) {
                newColumns[oldStatus] = newColumns[oldStatus].filter(t => t.id !== formData.id);
            } else if (!oldStatus) { // This means it's a new task
                 // Ensure the new status column exists
                if (!newColumns[formData.status]) {
                    newColumns[formData.status] = [];
                }
            }

            const updatedTask = {
                ...formData,
                progress: Number(formData.progress),
                startDate: formData.startDate, // Ensure dates are passed as strings
                endDate: formData.endDate
            };

            // Add/update task in the correct column
            if (oldStatus && oldStatus === formData.status) {
                // Update in place if status hasn't changed
                newColumns[formData.status] = newColumns[formData.status].map(t =>
                    t.id === updatedTask.id ? updatedTask : t
                );
            } else {
                // Add to the new status column
                newColumns[updatedTask.status] = [...(newColumns[updatedTask.status] || []), updatedTask];
            }

            // Re-sort the column if necessary (e.g., by priority or due date)
            newColumns[updatedTask.status].sort((a, b) => {
                // Example sort: Urgent > High > Medium > Low
                const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            });


            return newColumns;
        });
        setShowEditTaskModal(false);
        setCurrentEditingTask(null);
    };

    const handleAddTask = () => {
        setCurrentEditingTask({
            id: `task-${Date.now()}`, // Generate a unique ID for new task
            projectId: projectId,
            name: '',
            assignedTo: '',
            status: 'Not Started',
            priority: 'Medium',
            startDate: new Date().toISOString().split('T')[0], // Default to today
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 7 days from now
            progress: 0,
            description: ''
        });
        setShowEditTaskModal(true);
    };

    const handleDeleteTask = (taskId, status) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setColumns(prevColumns => {
                const newColumns = { ...prevColumns };
                newColumns[status] = newColumns[status].filter(task => task.id !== taskId);
                return newColumns;
            });
        }
    };


    const taskFormFields = [
        { name: 'name', label: 'Task Name', type: 'text', required: true, icon: ClipboardList },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, icon: InfoIcon },
        { name: 'assignedTo', label: 'Assigned To', type: 'text', icon: User },
        {
            name: 'status', label: 'Status', type: 'select', required: true, icon: CheckCircle,
            options: COLUMN_ORDER.map(col => ({ value: col, label: col }))
        },
        {
            name: 'priority', label: 'Priority', type: 'select', required: true, icon: Tag,
            options: [
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Urgent', label: 'Urgent' },
            ]
        },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true, icon: Calendar },
        { name: 'endDate', label: 'Due Date', type: 'date', required: true, icon: Calendar },
        { name: 'progress', label: 'Progress (%)', type: 'number', min: 0, max: 100, icon: Clock },
    ];


    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
            <LoadingSpinner />
            <p className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading Kanban board...</p>
        </div>
    );
    if (error) return (
        <div className="min-h-screen container mx-auto p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-black">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md flex items-center">
                <AlertCircle className="mr-3 text-red-500 dark:text-red-300" size={24} />
                <div>
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
            <Link to={`/projects/${projectId}/details`}>
                <Button variant="secondary" className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <ArrowLeft size={20} /> Back to Project
                </Button>
            </Link>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter text-gray-900 dark:bg-gray-900 dark:text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                    <Kanban className="w-9 h-9 text-orange-600 dark:text-orange-400" /> Kanban Board for "{project.name}"
                </h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                        variant="primary"
                        onClick={handleAddTask}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <Plus size={20} /> Add New Task
                    </Button>
                    <Link to={`/projects/${projectId}/details`} className="w-full sm:w-auto">
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <ArrowLeft size={20} /> Back to Project
                        </Button>
                    </Link>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {COLUMN_ORDER.map(status => (
                        <div key={status} className="flex flex-col bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-300 dark:border-gray-600 flex items-center gap-2">
                                {status === 'Not Started' && <Clock size={20} className="text-gray-500" />}
                                {status === 'In Progress' && <ClipboardList size={20} className="text-blue-500" />}
                                {status === 'Completed' && <CheckCircle size={20} className="text-green-500" />}
                                {status === 'Overdue' && <AlertCircle size={20} className="text-red-500" />}
                                {status === 'Blocked' && <XCircle size={20} className="text-orange-500" />}
                                {status} ({columns[status]?.length || 0})
                            </h2>
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="space-y-4 flex-grow min-h-[150px] p-2 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors duration-200"
                                    >
                                        {columns[status]?.length > 0 ? (
                                            columns[status].map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 cursor-grab active:cursor-grabbing
                                                                ${statusColor(task.status)}`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3
                                                                    className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2 cursor-pointer"
                                                                    onDoubleClick={() => handleEditTask(task)} // Double-click on task name
                                                                >
                                                                    <ClipboardList size={18} className="text-blue-500 dark:text-blue-400" />
                                                                    {task.name}
                                                                </h3>
                                                                <div className="flex space-x-1">
                                                                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditTask(task); }} className="p-1">
                                                                        <Edit size={16} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                                                                    </Button>
                                                                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id, task.status); }} className="p-1">
                                                                        <Trash2 size={16} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                                                <User size={14} /> Assigned: {task.assignedTo || 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-3">
                                                                <Calendar size={14} /> Due: {task.endDate}
                                                            </p>
                                                            <div className="flex justify-between items-center gap-2 text-sm">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColor(task.priority)}`}>
                                                                    <Tag size={12} className="inline-block mr-1" />{task.priority}
                                                                </span>
                                                                <div className="w-24 bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                                                                    <div
                                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                        style={{ width: `${task.progress}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-xs text-gray-600 dark:text-gray-400">{task.progress}%</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks in this column.</div>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {/* Edit/Add Task Modal */}
            <ModalWithForm
                isOpen={showEditTaskModal}
                onClose={() => setShowEditTaskModal(false)}
                onSubmit={handleSaveTask}
                title={currentEditingTask?.id.startsWith('task-') ? `Edit Task: ${currentEditingTask.name}` : 'Add New Task'}
                fields={taskFormFields}
                formData={currentEditingTask || {}}
            />
        </div>
    );
};

export default ProjectKanbanBoardPage;
