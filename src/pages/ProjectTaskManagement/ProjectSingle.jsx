// pages/ProjectTaskManagement/ProjectReportsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    BarChart2, ArrowLeft, ClipboardList, CheckCircle, Clock, XCircle,
    DollarSign, TrendingUp, TrendingDown, Users, Calendar, Info, Briefcase, Building2,
    ListTodo, Hourglass, CircleDot, UserCheck, UserX, LineChart, PieChart, Timer, AlertTriangle
} from 'lucide-react';

const Projectsingle = () => { // Renamed from Projectsingle for clarity
    const { projectId } = useParams(); // Get project ID from URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState(null); // State to hold the specific project data

    // --- Inline Mock Data ---
    const mockProjects = [
        {
            id: 'proj-001', name: 'Website Redesign', description: 'Complete overhaul of the company website.',
            startDate: '2025-01-10', endDate: '2025-08-30', status: 'Active',
            manager: { id: 'mgr-001', name: 'John Smith' },
            department: 'Marketing', budget: 150000, actualCost: 120000, progress: 75
        },
        {
            id: 'proj-002', name: 'New HR System Implementation', description: 'Deploying a new HRIS platform.',
            startDate: '2024-11-01', endDate: '2025-07-15', status: 'Completed',
            manager: { id: 'mgr-002', name: 'Jane Doe' },
            department: 'HR', budget: 200000, actualCost: 195000, progress: 100
        },
        {
            id: 'proj-003', name: 'Mobile App Development', description: 'Building a customer-facing mobile application.',
            startDate: '2025-03-01', endDate: '2025-12-31', status: 'Active',
            manager: { id: 'mgr-001', name: 'John Smith' },
            department: 'IT', budget: 300000, actualCost: 180000, progress: 40
        },
        {
            id: 'proj-004', name: 'Data Migration Project', description: 'Migrate legacy data to new database.',
            startDate: '2025-04-01', endDate: '2025-09-30', status: 'On Hold',
            manager: { id: 'mgr-002', name: 'Jane Doe' },
            department: 'IT', budget: 100000, actualCost: 30000, progress: 20
        },
        {
            id: 'proj-005', name: 'Marketing Campaign Launch', description: 'Launch new digital marketing campaign.',
            startDate: '2025-07-01', endDate: '2025-07-31', status: 'Active',
            manager: { id: 'mgr-001', name: 'John Smith' },
            department: 'Marketing', budget: 50000, actualCost: 25000, progress: 50
        },
        {
            id: 'proj-006', name: 'Office Relocation', description: 'Relocate main office to new premises.',
            startDate: '2025-01-01', endDate: '2025-06-30', status: 'Completed',
            manager: { id: 'mgr-002', name: 'Jane Doe' },
            department: 'Operations', budget: 80000, actualCost: 85000, progress: 100
        },
    ];

    const mockTasks = [
        // Project 001 Tasks
        { id: 't1', projectId: 'proj-001', name: 'Requirement Gathering', status: 'Completed', assignedTo: 'John Smith', actualHours: 40, estimatedHours: 40, plannedStartDate: '2025-01-10', plannedEndDate: '2025-01-15', actualStartDate: '2025-01-10', actualEndDate: '2025-01-15' },
        { id: 't2', projectId: 'proj-001', name: 'Design Mockups', status: 'Completed', assignedTo: 'Tesfaye Gebre', actualHours: 80, estimatedHours: 90, plannedStartDate: '2025-01-16', plannedEndDate: '2025-02-10', actualStartDate: '2025-01-16', actualEndDate: '2025-02-08' },
        { id: 't3', projectId: 'proj-001', name: 'Frontend Dev', status: 'In Progress', assignedTo: 'Aisha Demisse', actualHours: 150, estimatedHours: 250, plannedStartDate: '2025-02-11', plannedEndDate: '2025-04-30', actualStartDate: '2025-02-11', actualEndDate: null },
        { id: 't4', projectId: 'proj-001', name: 'Backend Dev', status: 'In Progress', assignedTo: 'Tesfaye Gebre', actualHours: 100, estimatedHours: 200, plannedStartDate: '2025-03-01', plannedEndDate: '2025-05-30', actualStartDate: '2025-03-05', actualEndDate: null },
        { id: 't5', projectId: 'proj-001', name: 'Database Setup', status: 'Completed', assignedTo: 'Kebede Worku', actualHours: 60, estimatedHours: 60, plannedStartDate: '2025-01-20', plannedEndDate: '2025-01-25', actualStartDate: '2025-01-20', actualEndDate: '2025-01-25' },
        { id: 't6', projectId: 'proj-001', name: 'Testing', status: 'Not Started', assignedTo: 'Aisha Demisse', actualHours: 0, estimatedHours: 100, plannedStartDate: '2025-05-01', plannedEndDate: '2025-06-15', actualStartDate: null, actualEndDate: null },
        { id: 't7', projectId: 'proj-001', name: 'Deployment', status: 'Not Started', assignedTo: 'Tesfaye Gebre', actualHours: 0, estimatedHours: 50, plannedStartDate: '2025-06-16', plannedEndDate: '2025-06-30', actualStartDate: null, actualEndDate: null },

        // Project 002 Tasks
        { id: 't8', projectId: 'proj-002', name: 'Vendor Selection', status: 'Completed', assignedTo: 'Jane Doe', actualHours: 30, estimatedHours: 30, plannedStartDate: '2024-11-01', plannedEndDate: '2024-11-10', actualStartDate: '2024-11-01', actualEndDate: '2024-11-10' },
        { id: 't9', projectId: 'proj-002', name: 'System Configuration', status: 'Completed', assignedTo: 'Tesfaye Gebre', actualHours: 180, estimatedHours: 180, plannedStartDate: '2024-11-11', plannedEndDate: '2025-01-31', actualStartDate: '2024-11-11', actualEndDate: '2025-01-31' },
        { id: 't10', projectId: 'proj-002', name: 'User Training', status: 'Completed', assignedTo: 'Aisha Demisse', actualHours: 100, estimatedHours: 100, plannedStartDate: '2025-02-01', plannedEndDate: '2025-02-28', actualStartDate: '2025-02-01', actualEndDate: '2025-02-28' },
    ];

    const mockRecentActivities = [
        { id: 'act-001', projectId: 'proj-001', date: '2025-07-14', description: 'UI/UX design phase completed.' },
        { id: 'act-002', projectId: 'proj-003', date: '2025-07-12', description: 'Backend API sprint review held.' },
        { id: 'act-003', projectId: 'proj-005', date: '2025-07-10', description: 'Social media ad creatives approved.' },
        { id: 'act-004', projectId: 'proj-002', date: '2025-07-08', description: 'Final HR system UAT sign-off.' },
        { id: 'act-005', projectId: 'proj-004', date: '2025-07-05', description: 'Data cleansing efforts paused due to resource reallocation.' },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const foundProject = mockProjects.find(p => p.id === projectId);
            if (foundProject) {
                setProject(foundProject);
            } else {
                setError('Project not found.');
            }
            setLoading(false);
        }, 700);
    }, [projectId]);

    // Calculate metrics for the specific project
    const projectMetrics = useMemo(() => {
        if (!project) return null;

        const variance = project.budget - project.actualCost;
        const isOverdue = new Date(project.endDate) < new Date() && project.status !== 'Completed';

        const tasksForProject = mockTasks.filter(task => task.projectId === projectId);

        // Task Distribution
        const taskDistribution = tasksForProject.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, { 'Not Started': 0, 'In Progress': 0, 'Completed': 0, 'Overdue': 0, 'Blocked': 0 }); // Ensure all statuses are initialized

        const totalTasks = tasksForProject.length;
        const completedTasks = taskDistribution['Completed'];
        const inProgressTasks = taskDistribution['In Progress'];
        const notStartedTasks = taskDistribution['Not Started'];
        const overdueTasks = tasksForProject.filter(task => new Date(task.plannedEndDate) < new Date() && task.status !== 'Completed').length;
        taskDistribution['Overdue'] = overdueTasks; // Update overdue count based on actual logic

        // Team Performance
        const teamPerformance = tasksForProject.reduce((acc, task) => {
            if (!acc[task.assignedTo]) {
                acc[task.assignedTo] = { assigned: 0, completed: 0, totalActualHours: 0, totalEstimatedHours: 0 };
            }
            acc[task.assignedTo].assigned += 1;
            acc[task.assignedTo].totalEstimatedHours += task.estimatedHours || 0;
            if (task.status === 'Completed') {
                acc[task.assignedTo].completed += 1;
                acc[task.assignedTo].totalActualHours += task.actualHours || 0;
            }
            return acc;
        }, {});

        // Timeline Adherence
        let scheduleVarianceDays = 0;
        let tasksOnSchedule = 0;
        let tasksBehindSchedule = 0;
        let tasksAheadSchedule = 0;

        tasksForProject.forEach(task => {
            if (task.status === 'Completed' && task.actualEndDate && task.plannedEndDate) {
                const plannedEnd = new Date(task.plannedEndDate).getTime();
                const actualEnd = new Date(task.actualEndDate).getTime();
                const variance = (plannedEnd - actualEnd) / (1000 * 60 * 60 * 24); // Days
                scheduleVarianceDays += variance;

                if (variance > 0) tasksAheadSchedule++;
                else if (variance < 0) tasksBehindSchedule++;
                else tasksOnSchedule++;
            } else if (task.status === 'In Progress' && task.plannedEndDate) {
                // For in-progress tasks, compare planned end date to today
                const plannedEnd = new Date(task.plannedEndDate).getTime();
                const today = new Date().getTime();
                if (plannedEnd < today) {
                    tasksBehindSchedule++; // Considered behind if planned end is in the past
                } else {
                    tasksOnSchedule++; // Still within planned timeframe
                }
            } else if (task.status === 'Not Started' && new Date(task.plannedStartDate) < new Date()) {
                tasksBehindSchedule++; // Not started but planned start is in the past
            }
        });


        return {
            status: project.status,
            managerName: project.manager.name,
            department: project.department,
            progress: project.progress,
            budget: project.budget,
            actualCost: project.actualCost,
            variance: variance,
            isOverdue: isOverdue,
            startDate: project.startDate,
            endDate: project.endDate,
            description: project.description,
            taskDistribution,
            totalTasks,
            completedTasks,
            inProgressTasks,
            notStartedTasks,
            overdueTasks,
            teamPerformance,
            scheduleVarianceDays,
            tasksOnSchedule,
            tasksBehindSchedule,
            tasksAheadSchedule,
        };
    }, [project, projectId, mockTasks]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'On Hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter dark:from-gray-900 dark:to-black">
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Generating project reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter dark:from-gray-900 dark:to-black">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
                <Link to={`/projects/${projectId}/details`}>
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Project Details
                    </Button>
                </Link>
            </div>
        );
    }

    if (!project || !projectMetrics) {
        return null; // Should not happen if error handling works
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter text-gray-900 dark:from-gray-900 dark:to-black dark:text-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                    <BarChart2 className="w-10 h-10 text-purple-600 dark:text-purple-400" /> Project Reports for "{project.name}"
                </h1>
                <Link to={`/projects/${projectId}/details`} className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Project Details
                    </Button>
                </Link>
            </div>

            {/* Project Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <Info size={36} className="text-blue-500 dark:text-blue-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Project Status</h3>
                    <p className={`text-4xl font-bold mt-2 ${getStatusClasses(projectMetrics.status)}`}>
                        {projectMetrics.status}
                    </p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <Users size={36} className="text-orange-500 dark:text-orange-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Project Manager</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{projectMetrics.managerName}</p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <Building2 size={36} className="text-green-500 dark:text-green-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Department</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{projectMetrics.department}</p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <TrendingUp size={36} className="text-purple-500 dark:text-purple-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Current Progress</h3>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{projectMetrics.progress}%</p>
                </Card>
            </div>

            {/* Project Overview & Key Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                        <ClipboardList size={24} className="text-indigo-600 dark:text-indigo-400" /> Project Details
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{projectMetrics.description}</p>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Start Date</p>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {projectMetrics.startDate}
                            </span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">End Date</p>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {projectMetrics.endDate}
                            </span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Overdue</p>
                            <span className={`px-4 py-1 rounded-full text-lg font-bold ${projectMetrics.isOverdue ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                {projectMetrics.isOverdue ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                        <DollarSign size={24} className="text-green-600 dark:text-green-400" /> Financial Overview
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Budget</p>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">ETB {projectMetrics.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Actual Cost</p>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">ETB {projectMetrics.actualCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Cost Variance</p>
                            <span className={`text-lg font-bold ${projectMetrics.variance >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                                ETB {projectMetrics.variance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Task Distribution by Status */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <ListTodo size={24} className="text-purple-600 dark:text-purple-400" /> Task Distribution by Status
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {Object.entries(projectMetrics.taskDistribution).map(([status, count]) => (
                        <div key={status} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center">
                            {status === 'Not Started' && <Hourglass size={28} className="text-gray-500 dark:text-gray-400 mb-2" />}
                            {status === 'In Progress' && <CircleDot size={28} className="text-blue-500 dark:text-blue-400 mb-2" />}
                            {status === 'Completed' && <CheckCircle size={28} className="text-green-500 dark:text-green-400 mb-2" />}
                            {status === 'Overdue' && <AlertTriangle size={28} className="text-red-500 dark:text-red-400 mb-2" />}
                            {status === 'Blocked' && <XCircle size={28} className="text-orange-500 dark:text-orange-400 mb-2" />}
                            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{status}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{count}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Team Performance */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <Users size={24} className="text-teal-600 dark:text-teal-400" /> Team Performance
                </h2>
                {Object.keys(projectMetrics.teamPerformance).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(projectMetrics.teamPerformance).map(([assignee, data]) => (
                            <div key={assignee} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                                    <UserCheck size={20} className="text-blue-500 dark:text-blue-400" /> {assignee}
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Assigned Tasks: <span className="font-semibold">{data.assigned}</span></p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Completed Tasks: <span className="font-semibold">{data.completed}</span></p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Estimated Hours: <span className="font-semibold">{data.totalEstimatedHours}h</span></p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Actual Hours (Completed): <span className="font-semibold">{data.totalActualHours}h</span></p>
                                {data.totalEstimatedHours > 0 && data.completed > 0 && (
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Efficiency: <span className={`font-semibold ${data.totalActualHours <= data.totalEstimatedHours ? 'text-green-600' : 'text-red-600'}`}>
                                            {((data.totalEstimatedHours / data.totalActualHours) * 100).toFixed(2)}%
                                        </span>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No tasks assigned to team members for this project.</p>
                )}
            </Card>

            {/* Timeline Adherence */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <Timer size={24} className="text-indigo-600 dark:text-indigo-400" /> Timeline Adherence
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center">
                        <CheckCircle size={28} className="text-green-500 dark:text-green-400 mb-2" />
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Tasks On Schedule</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{projectMetrics.tasksOnSchedule}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center">
                        <TrendingDown size={28} className="text-red-500 dark:text-red-400 mb-2" />
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Tasks Behind Schedule</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{projectMetrics.tasksBehindSchedule}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center">
                        <TrendingUp size={28} className="text-purple-500 dark:text-purple-400 mb-2" />
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Tasks Ahead Schedule</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{projectMetrics.tasksAheadSchedule}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center col-span-full">
                        <LineChart size={28} className="text-blue-500 dark:text-blue-400 mb-2" />
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Overall Schedule Variance</p>
                        <p className={`text-3xl font-bold mt-1 ${projectMetrics.scheduleVarianceDays >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            {projectMetrics.scheduleVarianceDays.toFixed(1)} Days
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {projectMetrics.scheduleVarianceDays >= 0 ? 'Ahead/On Schedule' : 'Behind Schedule'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Recent Project Activities for this project */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <Calendar size={24} className="text-yellow-600 dark:text-yellow-400" /> Recent Activities for "{project.name}"
                </h2>
                {mockRecentActivities.filter(activity => activity.projectId === projectId).length > 0 ? (
                    <ul className="space-y-4">
                        {mockRecentActivities
                            .filter(activity => activity.projectId === projectId)
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(activity => (
                                <li key={activity.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Date: <span className="font-semibold">{activity.date}</span>
                                        </p>
                                    </div>
                                    <p className="text-md text-gray-800 dark:text-white">{activity.description}</p>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No recent activities found for "{project.name}".</p>
                )}
            </Card>
        </div>
    );
};

export default Projectsingle;
