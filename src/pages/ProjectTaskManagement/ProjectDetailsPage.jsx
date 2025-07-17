import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Table from '../../components/ui/Table'; // Reusable Table component

// Lucide React Icons
import {
    ClipboardList, ArrowLeft, User, Calendar, DollarSign, Briefcase, Building2,
    TrendingUp, Edit, Users, Plus, Eye, ListChecks, Info, AlertCircle,
    GanttChartSquare, LayoutDashboard, Kanban, FileText, Link as LinkIcon, // Renamed Link to LinkIcon
    CheckCircle, XCircle, Wrench, Package, BarChart3, Clock, ReceiptText
} from 'lucide-react';

const ProjectDetailsPage = () => {
    const { projectId } = useParams(); // Get project ID from URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]); // Tasks associated with this project

    // --- Inline Mock Data ---
    const mockProjects = [
        {
            id: 'proj-001', name: 'Website Redesign', type: 'Client Job', customer: 'ABC Corp', description: 'Complete overhaul of the company website, focusing on modern UI/UX and improved performance.',
            startDate: '2025-01-10', endDate: '2025-08-30', status: 'Active',
            manager: { id: 'mgr-001', name: 'John Smith' },
            department: 'Marketing', budget: 150000, actualCost: 125000, // Added actualCost
            teamMembers: [{ id: 'emp-001', name: 'Aisha Demisse' }, { id: 'emp-002', name: 'Tesfaye Gebre' }],
            progress: 75,
            attachments: [
                { name: 'Project Brief.pdf', url: 'https://example.com/docs/project_brief.pdf' },
                { name: 'UI/UX Wireframes.zip', url: 'https://example.com/docs/wireframes.zip' }
            ]
        },
        {
            id: 'proj-002', name: 'New HR System Implementation', type: 'Internal', customer: 'Internal', description: 'Deploying a new HRIS platform to streamline HR operations and employee data management.',
            startDate: '2024-11-01', endDate: '2025-07-15', status: 'Completed',
            manager: { id: 'mgr-002', name: 'Jane Doe' },
            department: 'HR', budget: 200000, actualCost: 190000,
            teamMembers: [{ id: 'emp-001', name: 'Aisha Demisse' }, { id: 'emp-003', name: 'Sara Ali' }],
            progress: 100,
            attachments: []
        },
    ];

    const mockTasks = [
        {
            id: 'task-001', projectId: 'proj-001', name: 'Initial Planning & Scope Definition', assignedTo: 'Aisha Demisse', status: 'Completed', priority: 'High', startDate: '2025-01-10', endDate: '2025-01-20', progress: 100, description: 'Define project goals, scope, and key deliverables.',
            qcRequired: true, qcResult: 'Pass', reworkReason: '',
            laborHours: 80, materialCosts: 500, incentive: 1000, penalty: 0,
            materialsUsed: [{ name: 'Whiteboard Markers', qty: 2 }],
            toolsUsed: [{ name: 'Projector', duration: '8hrs' }]
        },
        {
            id: 'task-002', projectId: 'proj-001', name: 'UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-01-21', endDate: '2025-02-28', progress: 85, description: 'Create wireframes, mockups, and user flows.',
            qcRequired: true, qcResult: 'Fail', reworkReason: 'User flow not intuitive',
            laborHours: 120, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Design Software License', duration: '120hrs' }]
        },
        {
            id: 'task-003', projectId: 'proj-001', name: 'Frontend Development', assignedTo: 'Tesfaye Gebre', status: 'Not Started', priority: 'Medium', startDate: '2025-03-01', endDate: '2025-05-31', progress: 0, description: 'Develop responsive user interface components.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: []
        },
        {
            id: 'task-004', projectId: 'proj-001', name: 'Backend API Development', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Medium', startDate: '2025-03-15', endDate: '2025-06-30', progress: 0, description: 'Build RESTful APIs for data management.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: []
        },
        {
            id: 'task-005', projectId: 'proj-001', name: 'Content Migration', assignedTo: 'Aisha Demisse', status: 'Not Started', priority: 'Low', startDate: '2025-07-01', endDate: '2025-07-31', progress: 0, description: 'Migrate existing website content to the new platform.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 0, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: []
        },
        {
            id: 'task-006', projectId: 'proj-001', name: 'Rework UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'In Progress', priority: 'High', startDate: '2025-03-01', endDate: '2025-03-15', progress: 30, description: 'Address feedback from initial UI/UX review.',
            qcRequired: true, qcResult: '', reworkReason: '', // Rework task, QC pending
            laborHours: 40, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Design Software License', duration: '40hrs' }],
            reworkOfTaskId: 'task-002' // Link to original task
        },
        {
            id: 'task-007', projectId: 'proj-002', name: 'Vendor Selection', assignedTo: 'Sara Ali', status: 'Completed', priority: 'High', startDate: '2024-11-01', endDate: '2024-11-15', progress: 100, description: 'Evaluate and select HRIS vendor.',
            qcRequired: true, qcResult: 'Pass', reworkReason: '',
            laborHours: 60, materialCosts: 0, incentive: 500, penalty: 0,
            materialsUsed: [], toolsUsed: []
        },
        {
            id: 'task-008', projectId: 'proj-002', name: 'Data Migration', assignedTo: 'Tesfaye Gebre', status: 'Completed', priority: 'High', startDate: '2025-01-01', endDate: '2025-03-31', progress: 100, description: 'Migrate employee data from old system.',
            qcRequired: false, qcResult: '', reworkReason: '',
            laborHours: 180, materialCosts: 0, incentive: 0, penalty: 0,
            materialsUsed: [], toolsUsed: [{ name: 'Data Migration Tool', duration: '180hrs' }]
        },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const foundProject = mockProjects.find(p => p.id === projectId);
            if (foundProject) {
                setProject(foundProject);
                const projectTasks = mockTasks.filter(task => task.projectId === projectId);
                setTasks(projectTasks);
            } else {
                setError('Project not found.');
            }
            setLoading(false);
        }, 700);
    }, [projectId]);

    // Calculate aggregated data for profitability, QC, and tool usage
    const aggregatedData = useMemo(() => {
        if (!tasks.length) {
            return {
                totalLaborHours: 0,
                totalMaterialCosts: 0,
                totalIncentives: 0,
                totalPenalties: 0,
                tasksRequiringQC: 0,
                tasksFailedQC: 0,
                tasksWithRework: 0,
                totalToolsUsed: 0,
                totalMaterialsConsumed: 0,
                totalTaskCost: 0,
            };
        }

        let totalLaborHours = 0;
        let totalMaterialCosts = 0;
        let totalIncentives = 0;
        let totalPenalties = 0;
        let tasksRequiringQC = 0;
        let tasksFailedQC = 0;
        let tasksWithRework = 0;
        let totalToolsUsed = 0;
        let totalMaterialsConsumed = 0;

        tasks.forEach(task => {
            totalLaborHours += task.laborHours || 0;
            totalMaterialCosts += task.materialCosts || 0;
            totalIncentives += task.incentive || 0;
            totalPenalties += task.penalty || 0;

            if (task.qcRequired) {
                tasksRequiringQC++;
            }
            if (task.qcResult === 'Fail') {
                tasksFailedQC++;
            }
            if (task.reworkOfTaskId) { // Check if this task is a rework of another
                tasksWithRework++;
            }

            totalToolsUsed += task.toolsUsed?.length || 0;
            totalMaterialsConsumed += task.materialsUsed?.length || 0;
        });

        const totalTaskCost = totalLaborHours * 50 + totalMaterialCosts + totalIncentives - totalPenalties; // Example calculation: 50 ETB/hour labor rate

        return {
            totalLaborHours,
            totalMaterialCosts,
            totalIncentives,
            totalPenalties,
            tasksRequiringQC,
            tasksFailedQC,
            tasksWithRework,
            totalToolsUsed,
            totalMaterialsConsumed,
            totalTaskCost,
        };
    }, [tasks]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Active':
            case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'On Hold':
            case 'Paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Canceled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'Not Started':
            case 'To Do': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            case 'Blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const taskTableColumns = [
        { header: 'Task Name', accessor: 'name' },
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
            header: 'QC',
            render: (row) => (
                <div className="flex items-center gap-1">
                    {row.qcRequired ? (
                        row.qcResult === 'Pass' ? <CheckCircle size={18} className="text-green-500" title="QC Passed" /> :
                        row.qcResult === 'Fail' ? <XCircle size={18} className="text-red-500" title="QC Failed" /> :
                        <Info size={18} className="text-yellow-500" title="QC Required" />
                    ) : (
                        <span className="text-gray-400">-</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Progress',
            render: (row) => (
                <div className="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${row.progress}%` }}></div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 ml-2">{row.progress}%</span>
                </div>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Link to={`/tasks/${row.id}/details`}> {/* Link to TaskDetailsPage */}
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye size={16} /> View Task
                        </Button>
                    </Link>
                    {/* Add Edit/Delete Task buttons if TaskFormPage/TaskListPage handles this */}
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md dark:bg-red-900/30 dark:border-red-700 dark:text-red-300" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
                <Link to="/projects">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Project List
                    </Button>
                </Link>
            </div>
        );
    }

    if (!project) {
        return null; // Should not happen if error handling works, but good for safety
    }

    const profitability = project.budget - project.actualCost;
    const profitabilityClass = profitability >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
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
                    <ClipboardList className="w-10 h-10 text-blue-600" /> {project.name}
                </h1>
                <div className="flex gap-4">
                    <Link to="/projects">
                        <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                            <ArrowLeft size={20} /> Back to Project List
                        </Button>
                    </Link>
                    <Link to={`/projects/${project.id}/edit`}> {/* Link to ProjectFormPage for editing */}
                        <Button variant="info" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-600">
                            <Edit size={20} /> Edit Project
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Project Overview */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Info size={24} className="text-indigo-500" /> Project Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2"><ClipboardList size={18} className="text-gray-500" /> <strong>ID:</strong> {project.id}</div>
                    <div className="flex items-center gap-2"><Briefcase size={18} className="text-gray-500" /> <strong>Type:</strong> {project.type}</div>
                    <div className="flex items-center gap-2"><Users size={18} className="text-gray-500" /> <strong>Customer:</strong> {project.customer}</div>
                    <div className="flex items-center gap-2"><User size={18} className="text-gray-500" /> <strong>Manager:</strong> {project.manager.name}</div>
                    <div className="flex items-center gap-2"><Building2 size={18} className="text-gray-500" /> <strong>Department:</strong> {project.department}</div>
                    <div className="flex items-center gap-2"><Calendar size={18} className="text-gray-500" /> <strong>Start Date:</strong> {project.startDate}</div>
                    <div className="flex items-center gap-2"><Calendar size={18} className="text-gray-500" /> <strong>End Date:</strong> {project.endDate}</div>
                    <div className="flex items-center gap-2"><TrendingUp size={18} className="text-gray-500" /> <strong>Progress:</strong> {project.progress}%</div>
                    <div className="col-span-full">
                        <p className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><FileText size={18} className="text-gray-500" /> Description:</p>
                        <p className="text-gray-700 dark:text-gray-300 ml-6">{project.description}</p>
                    </div>
                    {project.attachments && project.attachments.length > 0 && (
                        <div className="col-span-full">
                            <p className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2"><LinkIcon size={18} className="text-gray-500" /> Attachments:</p>
                            <ul className="ml-6 space-y-1">
                                {project.attachments.map((attachment, index) => (
                                    <li key={index}>
                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 dark:text-blue-400">
                                            <FileText size={16} /> {attachment.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Card>

            {/* Financial Summary (Profitability) */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <DollarSign size={24} className="text-green-500" /> Financial Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2"><DollarSign size={18} className="text-gray-500" /> <strong>Budget:</strong> ETB {project.budget.toLocaleString()}</div>
                    <div className="flex items-center gap-2"><ReceiptText size={18} className="text-gray-500" /> <strong>Actual Cost (Project):</strong> ETB {project.actualCost.toLocaleString()}</div>
                    <div className="flex items-center gap-2"><BarChart3 size={18} className="text-gray-500" /> <strong>Profitability:</strong> <span className={`font-bold ${profitabilityClass}`}>ETB {profitability.toLocaleString()}</span></div>
                    <div className="flex items-center gap-2"><Clock size={18} className="text-gray-500" /> <strong>Total Labor Hours:</strong> {aggregatedData.totalLaborHours} hrs</div>
                    <div className="flex items-center gap-2"><Package size={18} className="text-gray-500" /> <strong>Total Material Costs:</strong> ETB {aggregatedData.totalMaterialCosts.toLocaleString()}</div>
                    <div className="flex items-center gap-2"><DollarSign size={18} className="text-gray-500" /> <strong>Total Incentives:</strong> ETB {aggregatedData.totalIncentives.toLocaleString()}</div>
                    <div className="flex items-center gap-2"><DollarSign size={18} className="text-gray-500" /> <strong>Total Penalties:</strong> ETB {aggregatedData.totalPenalties.toLocaleString()}</div>
                    <div className="flex items-center gap-2"><DollarSign size={18} className="text-gray-500" /> <strong>Aggregated Task Cost:</strong> ETB {aggregatedData.totalTaskCost.toLocaleString()}</div>
                </div>
            </Card>

            {/* Quality & Resource Overview (QC & Tool Assignment Summary) */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <ListChecks size={24} className="text-purple-500" /> Quality & Resource Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2"><CheckCircle size={18} className="text-gray-500" /> <strong>Tasks Requiring QC:</strong> {aggregatedData.tasksRequiringQC}</div>
                    <div className="flex items-center gap-2"><XCircle size={18} className="text-gray-500" /> <strong>Tasks Failed QC:</strong> {aggregatedData.tasksFailedQC}</div>
                    <div className="flex items-center gap-2"><AlertCircle size={18} className="text-gray-500" /> <strong>Tasks with Rework:</strong> {aggregatedData.tasksWithRework}</div>
                    <div className="flex items-center gap-2"><Wrench size={18} className="text-gray-500" /> <strong>Tools Used (Unique):</strong> {aggregatedData.totalToolsUsed}</div>
                    <div className="flex items-center gap-2"><Package size={18} className="text-gray-500" /> <strong>Materials Consumed (Unique):</strong> {aggregatedData.totalMaterialsConsumed}</div>
                </div>
            </Card>

            {/* Project Tasks */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <ListChecks size={24} className="text-blue-500" /> Project Tasks
                    </h2>
                    <Link to={`/tasks/new?projectId=${project.id}`}> {/* Link to TaskFormPage for adding new task */}
                        <Button variant="primary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700">
                            <Plus size={20} /> Add New Task
                        </Button>
                    </Link>
                </div>
                {tasks.length > 0 ? (
                    <Table columns={taskTableColumns} data={tasks} />
                ) : (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                        No tasks associated with this project yet.
                    </div>
                )}
            </Card>

            {/* Project Visualizations/Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <Link to={`/projects/${project.id}/gantt`}> {/* Link to ProjectGanttChartPage */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center h-48 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <GanttChartSquare size={48} className="text-teal-500 mb-3" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">View Gantt Chart</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Visualize tasks and dependencies.</p>
                    </Card>
                </Link>
                <Link to={`/projects/${project.id}/kanban`}> {/* Link to ProjectKanbanBoardPage */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center h-48 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Kanban size={48} className="text-orange-500 mb-3" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">View Kanban Board</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage tasks visually by status.</p>
                    </Card>
                </Link>
                <Link to={`/projects/${project.id}/reports`}> {/* Link to ProjectReportsPage */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center h-48 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <LayoutDashboard size={48} className="text-purple-500 mb-3" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Project Reports</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Access detailed project analytics.</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
