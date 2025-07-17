// pages/ProjectTaskManagement/TaskDetailsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    ClipboardList, ArrowLeft, User, Calendar, Tag, TrendingUp, CheckCircle,
    Info, AlertCircle, Edit, Clock, XCircle, DollarSign, Wrench, Package, Link as LinkIcon, Plus, ListChecks
} from 'lucide-react';

const TaskDetailsPage = () => {
    const { taskId } = useParams(); // Get task ID from URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [task, setTask] = useState(null);

    // --- Inline Mock Data (consistent with TaskListPage) ---
    const mockTasks = [
        {
            id: 'task-001', projectId: 'proj-001', name: 'Initial Planning & Scope Definition', assignedTo: 'Aisha Demisse', status: 'Completed', priority: 'High', startDate: '2025-01-10', endDate: '2025-01-20', progress: 100, description: 'Define project goals, scope, and key deliverables for the website redesign.',
            qcRequired: true, qcResult: 'Pass', reworkReason: '',
            laborHours: 80, materialCosts: 500, incentive: 1000, penalty: 0,
            materialsUsed: [{ name: 'Whiteboard Markers', qty: 2 }],
            toolsUsed: [{ name: 'Projector', duration: '8hrs' }],
            duration: 10, // Added duration
            dependencies: []
        },
        {
            id: 'task-002', projectId: 'proj-001', name: 'UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-01-21', endDate: '2025-02-28', progress: 85, description: 'Create wireframes, mockups, and user flows for the new website interface.',
            qcRequired: true, qcResult: 'Fail', reworkReason: 'User flow not intuitive',
            laborHours: 120, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Design Software License', duration: '120hrs' }],
            duration: 39, // Added duration
            dependencies: ['task-001'] // Added dependency
        },
        {
            id: 'task-003', projectId: 'proj-001', name: 'Frontend Development', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Medium', startDate: '2025-03-01', endDate: '2025-05-31', progress: 0, description: 'Develop responsive user interface components based on approved designs.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 92, // Added duration
            dependencies: ['task-002'] // Added dependency
        },
        {
            id: 'task-004', projectId: 'proj-001', name: 'Backend API Development', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Medium', startDate: '2025-03-15', endDate: '2025-06-30', progress: 0, description: 'Build RESTful APIs for data management and integration with the frontend.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 107, // Added duration
            dependencies: []
        },
        {
            id: 'task-005', projectId: 'proj-001', name: 'Content Migration', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Low', startDate: '2025-07-01', endDate: '2025-07-31', progress: 0, description: 'Migrate existing website content (text, images, videos) to the new platform.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 31, // Added duration
            dependencies: ['task-003', 'task-004'] // Added dependencies
        },
        {
            id: 'task-006', projectId: 'proj-001', name: 'Rework UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-03-01', endDate: '2025-03-15', progress: 30, description: 'Address feedback from initial UI/UX review.',
            qcRequired: true, qcResult: '', reworkReason: '', // Rework task, QC pending
            laborHours: 40, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Design Software License', duration: '40hrs' }],
            reworkOfTaskId: 'task-002', // Link to original task
            duration: 15, // Added duration
            dependencies: []
        },
        {
            id: 'task-007', projectId: 'proj-002', name: 'Vendor Selection', assignedTo: 'Sara Ali', status: 'Completed', priority: 'High', startDate: '2024-11-01', endDate: '2024-11-15', progress: 100, description: 'Evaluate and select the best HRIS vendor for the new system implementation.',
            qcRequired: true, qcResult: 'Pass', reworkReason: '',
            laborHours: 60, materialCosts: 0, incentive: 500, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 15, // Added duration
            dependencies: []
        },
        {
            id: 'task-008', projectId: 'proj-002', name: 'Data Migration', assignedTo: 'Tesfaye Gebre', status: 'Completed', priority: 'High', startDate: '2025-01-01', endDate: '2025-03-31', progress: 100, description: 'Migrate all historical employee data from the old system to the new HRIS.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 180, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Data Migration Tool', duration: '180hrs' }],
            duration: 90, // Added duration
            dependencies: ['task-007'] // Added dependency
        },
        {
            id: 'task-009', projectId: 'proj-003', name: 'Mobile UI Design', assignedTo: 'Kebede Worku', status: 'In Progress', priority: 'High', startDate: '2025-03-05', endDate: '2025-04-15', progress: 60, description: 'Design the user interface and experience for the new mobile application.',
            qcRequired: true, qcResult: 'Fail', reworkReason: 'Feedback on navigation flow',
            laborHours: 90, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Figma', duration: '90hrs' }],
            duration: 42, // Added duration
            dependencies: []
        },
        {
            id: 'task-010', projectId: 'proj-003', name: 'iOS App Development', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Medium', startDate: '2025-04-16', endDate: '2025-07-31', progress: 0, description: 'Develop the native iOS application based on the approved designs and APIs.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 106, // Added duration
            dependencies: ['task-009'] // Added dependency
        },
        {
            id: 'task-011', projectId: 'proj-003', name: 'Android App Development', assignedTo: 'Kebede Worku', status: 'Not Started', priority: 'Medium', startDate: '2025-04-20', endDate: '2025-08-15', progress: 0, description: 'Develop the native Android application based on the approved designs and APIs.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 118, // Added duration
            dependencies: ['task-009'] // Added dependency
        },
        {
            id: 'task-012', projectId: 'proj-001', name: 'Testing Phase', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'High', startDate: '2025-08-01', endDate: '2025-08-20', progress: 0, description: 'Conduct comprehensive testing (unit, integration, UAT) of the new website.',
            qcRequired: true, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 20, // Added duration
            dependencies: ['task-005'] // Added dependency
        },
        {
            id: 'task-013', projectId: 'proj-001', name: 'Deployment', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Urgent', startDate: '2025-08-25', endDate: '2025-08-30', progress: 0, description: 'Deploy the new website to production servers and monitor initial performance.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [],
            duration: 6, // Added duration
            dependencies: ['task-012'] // Added dependency
        },
        {
            id: 'task-014', projectId: 'proj-003', name: 'Rework Mobile UI Design', assignedTo: 'Kebede Worku', status: 'To Do', priority: 'High', startDate: '2025-04-16', endDate: '2025-04-30', progress: 0, description: 'Implement feedback for mobile UI navigation flow.',
            qcRequired: true, qcResult: '', reworkReason: '',
            laborHours: 20, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Figma', duration: '20hrs' }],
            reworkOfTaskId: 'task-009',
            duration: 15, // Added duration
            dependencies: ['task-009'] // Added dependency
        },
    ];

    const mockProjectsForFilter = [ // Used to get project name from projectId
        { value: 'proj-001', label: 'Website Redesign' },
        { value: 'proj-002', label: 'New HR System Implementation' },
        { value: 'proj-003', label: 'Mobile App Development' },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const foundTask = mockTasks.find(t => t.id === taskId);
            if (foundTask) {
                setTask(foundTask);
            } else {
                setError('Task not found.');
            }
            setLoading(false);
        }, 700);
    }, [taskId]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Not Started': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            case 'To Do': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'Blocked': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getPriorityClasses = (priority) => {
        switch (priority) {
            case 'Low': return 'text-gray-500 dark:text-gray-400';
            case 'Medium': return 'text-blue-500 dark:text-blue-400';
            case 'High': return 'text-orange-500 dark:text-orange-400';
            case 'Urgent': return 'text-red-500 font-bold dark:text-red-400';
            default: return 'text-gray-500 dark:text-gray-400';
        }
    };

    const getQcResultClasses = (qcResult) => {
        switch (qcResult) {
            case 'Pass': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Fail': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading task details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md dark:bg-red-900/30 dark:border-red-700 dark:text-red-300" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
                <Link to="/tasks">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Task List
                    </Button>
                </Link>
            </div>
        );
    }

    if (!task) {
        return null; // Should not happen if error handling works, but good for safety
    }

    const projectName = mockProjectsForFilter.find(p => p.value === task.projectId)?.label || 'N/A Project';
    const taskTotalCost = (task.laborHours || 0) * 50 + (task.materialCosts || 0) + (task.incentive || 0) - (task.penalty || 0); // Example calculation: 50 ETB/hour labor rate

    // Find dependent tasks' names
    const dependentTasks = task.dependencies?.map(depId => {
        const depTask = mockTasks.find(t => t.id === depId);
        return depTask ? { id: depTask.id, name: depTask.name } : null;
    }).filter(Boolean) || [];


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
                    <ClipboardList className="w-10 h-10 text-purple-600" /> {task.name}
                </h1>
                <div className="flex gap-4">
                    <Link to="/tasks">
                        <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            <ArrowLeft size={20} /> Back to Task List
                        </Button>
                    </Link>
                    <Link to={`/tasks/${task.id}/edit`}> {/* Link to TaskFormPage for editing */}
                        <Button variant="info" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600">
                            <Edit size={20} /> Edit Task
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Task Overview */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Info size={24} className="text-indigo-500" /> Task Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2"><ClipboardList size={18} className="text-gray-500" /> <strong>Task ID:</strong> {task.id}</div>
                    <div className="flex items-center gap-2"><ClipboardList size={18} className="text-gray-500" /> <strong>Project:</strong> <Link to={`/projects/${task.projectId}/details`} className="text-blue-600 hover:underline dark:text-blue-400">{projectName}</Link></div>
                    <div className="flex items-center gap-2"><User size={18} className="text-gray-500" /> <strong>Assigned To:</strong> {task.assignedTo}</div>
                    <div className="flex items-center gap-2"><Calendar size={18} className="text-gray-500" /> <strong>Start Date:</strong> {task.startDate}</div>
                    <div className="flex items-center gap-2"><Calendar size={18} className="text-gray-500" /> <strong>End Date:</strong> {task.endDate}</div>
                    <div className="flex items-center gap-2"><Clock size={18} className="text-gray-500" /> <strong>Duration:</strong> {task.duration} days</div> {/* Added Duration */}
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(task.status)}`}>
                            {task.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getPriorityClasses(task.priority)}`}>
                            <strong>Priority:</strong> {task.priority}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-full md:col-span-1">
                        <TrendingUp size={18} className="text-gray-500" /> <strong>Progress:</strong> {task.progress}%
                        <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                    </div>
                    <div className="col-span-full">
                        <p className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><Info size={18} className="text-gray-500" /> Description:</p>
                        <p className="text-gray-700 dark:text-gray-300 ml-6">{task.description}</p>
                    </div>
                </div>
            </Card>

            {/* Dependencies */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <LinkIcon size={24} className="text-indigo-500" /> Dependencies
                </h2>
                {dependentTasks.length > 0 ? (
                    <ul className="ml-6 list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {dependentTasks.map((dep, index) => (
                            <li key={index}>
                                <Link to={`/tasks/${dep.id}/details`} className="text-blue-600 hover:underline dark:text-blue-400">
                                    {dep.name} (ID: {dep.id})
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="ml-6 text-gray-500 dark:text-gray-400">No direct dependencies for this task.</p>
                )}
            </Card>

            {/* QC & Rework Details */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <ListChecks size={24} className="text-purple-500" /> Quality Control & Rework
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-gray-500" /> <strong>QC Required:</strong> {task.qcRequired ? 'Yes' : 'No'}
                    </div>
                    {task.qcRequired && (
                        <>
                            <div className="flex items-center gap-2">
                                <Tag size={18} className="text-gray-500" /> <strong>QC Result:</strong>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQcResultClasses(task.qcResult)}`}>
                                    {task.qcResult || 'Pending'}
                                </span>
                            </div>
                            {task.qcResult === 'Fail' && (
                                <div className="col-span-full">
                                    <p className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><AlertCircle size={18} className="text-red-500" /> Rework Reason:</p>
                                    <p className="text-gray-700 dark:text-gray-300 ml-6">{task.reworkReason || 'N/A'}</p>
                                </div>
                            )}
                            {task.reworkOfTaskId && (
                                <div className="col-span-full flex items-center gap-2">
                                    <LinkIcon size={18} className="text-gray-500" /> <strong>Rework Of:</strong>
                                    <Link to={`/tasks/${task.reworkOfTaskId}/details`} className="text-blue-600 hover:underline dark:text-blue-400">
                                        Task {task.reworkOfTaskId}
                                    </Link>
                                </div>
                            )}
                            {/* Placeholder for QC Checklist */}
                            <div className="col-span-full mt-4">
                                <p className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><ListChecks size={18} className="text-gray-500" /> QC Checklist:</p>
                                <ul className="ml-6 list-disc list-inside text-gray-700 dark:text-gray-300">
                                    <li>Item 1: Verified design mockups match requirements. (Placeholder)</li>
                                    <li>Item 2: Checked for responsiveness across devices. (Placeholder)</li>
                                    <li>Item 3: Reviewed code for best practices. (Placeholder)</li>
                                </ul>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    (This checklist would be dynamic based on task type or QC requirements.)
                                </p>
                            </div>
                            {task.qcResult === 'Fail' && !task.reworkOfTaskId && ( // Only show "Create Rework Task" if original task failed QC and no rework task is linked yet
                                <div className="col-span-full mt-4">
                                    <Button variant="primary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-red-600 dark:text-white dark:hover:bg-red-700">
                                        <Plus size={20} /> Create Rework Task
                                    </Button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        (This button would pre-fill a new task form with rework details, linking it to this task.)
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>

            {/* Financial & Resource Usage Details */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <DollarSign size={24} className="text-green-500" /> Financial & Resource Usage
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2"><Clock size={18} className="text-gray-500" /> <strong>Labor Hours:</strong> {task.laborHours || 0} hrs</div>
                    <div className="flex items-center gap-2"><DollarSign size={18} className="text-gray-500" /> <strong>Material Costs:</strong> ETB {task.materialCosts?.toLocaleString() || 0}</div>
                    <div className="flex items-center gap-2"><DollarSign size={18} className="text-gray-500" /> <strong>Incentive:</strong> ETB {task.incentive?.toLocaleString() || 0}</div>
                    <div className="flex items-center gap-2"><DollarSign size={18} className="text-gray-500" /> <strong>Penalty:</strong> ETB {task.penalty?.toLocaleString() || 0}</div>
                    <div className="flex items-center gap-2 col-span-full">
                        <DollarSign size={18} className="text-gray-500" /> <strong>Total Task Cost:</strong> <span className="font-bold text-lg">ETB {taskTotalCost.toLocaleString()}</span>
                    </div>

                    <div className="col-span-full mt-4">
                        <p className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><Package size={18} className="text-gray-500" /> Materials Used:</p>
                        {task.materialsUsed && task.materialsUsed.length > 0 ? (
                            <ul className="ml-6 list-disc list-inside space-y-1">
                                {task.materialsUsed.map((item, index) => (
                                    <li key={index}>{item.name} (Qty: {item.qty})</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="ml-6 text-gray-500 dark:text-gray-400">No materials logged.</p>
                        )}
                    </div>
                    <div className="col-span-full mt-4">
                        <p className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><Wrench size={18} className="text-gray-500" /> Tools Used:</p>
                        {task.toolsUsed && task.toolsUsed.length > 0 ? (
                            <ul className="ml-6 list-disc list-inside space-y-1">
                                {task.toolsUsed.map((tool, index) => (
                                    <li key={index}>{tool.name} (Duration: {tool.duration})</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="ml-6 text-gray-500 dark:text-gray-400">No tools logged.</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Optional: Add sections for comments, attachments, sub-tasks if applicable */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Clock size={24} className="text-green-500" /> Activity Log (Placeholder)
                </h2>
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                    Activity log and comments for this task would appear here.
                </div>
            </Card>
        </div>
    );
};

export default TaskDetailsPage;
