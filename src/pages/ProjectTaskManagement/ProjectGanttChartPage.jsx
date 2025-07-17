// pages/ProjectTaskManagement/ProjectGanttChartPage.jsx

import React, { useState, useEffect, useMemo  } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import GanttChart from '../../components/GanttChart'; // Import the GanttChart component

// Lucide React Icons
import {
    GanttChartSquare, ArrowLeft, AlertCircle, ClipboardList
} from 'lucide-react';

const ProjectGanttChartPage = () => {
    const { projectId } = useParams(); // Get project ID from URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [project, setProject] = useState(null);
    const [projectTasks, setProjectTasks] = useState([]);
    const [taskDependencies, setTaskDependencies] = useState([]);

    // --- Inline Mock Data (consistent with other project/task pages) ---
    const mockProjects = [
        {
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
        },
    ];

    const mockTasks = [
        { id: 'task-001', projectId: 'proj-001', name: 'Initial Planning & Scope Definition', assignedTo: 'Aisha Demisse', status: 'completed', priority: 'High', startDate: '2025-01-10', endDate: '2025-01-20', progress: 100, description: 'Define project goals, scope, and key deliverables.' },
        { id: 'task-002', projectId: 'proj-001', name: 'UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'active', priority: 'High', startDate: '2025-01-21', endDate: '2025-02-28', progress: 85, description: 'Create wireframes, mockups, and user flows.' },
        { id: 'task-003', projectId: 'proj-001', name: 'Frontend Development', assignedTo: 'Tesfaye Gebre', status: 'pending', priority: 'Medium', startDate: '2025-03-01', endDate: '2025-05-31', progress: 0, description: 'Develop responsive user interface components.' },
        { id: 'task-004', projectId: 'proj-001', name: 'Backend API Development', assignedTo: 'Aisha Demisse', status: 'pending', priority: 'Medium', startDate: '2025-03-15', endDate: '2025-06-30', progress: 0, description: 'Build RESTful APIs for data management.' },
        { id: 'task-005', projectId: 'proj-001', name: 'Content Migration', assignedTo: 'Aisha Demisse', status: 'pending', priority: 'Low', startDate: '2025-07-01', endDate: '2025-07-31', progress: 0, description: 'Migrate existing website content to the new platform.' },
        { id: 'task-006', projectId: 'proj-001', name: 'Testing Phase', assignedTo: 'Aisha Demisse', status: 'pending', priority: 'High', startDate: '2025-08-01', endDate: '2025-08-20', progress: 0, description: 'Conduct comprehensive testing of the website.' },
        { id: 'task-007', projectId: 'proj-001', name: 'Deployment', assignedTo: 'Tesfaye Gebre', status: 'pending', priority: 'Urgent', startDate: '2025-08-25', endDate: '2025-08-30', progress: 0, description: 'Deploy the new website to production.' },

        { id: 'task-008', projectId: 'proj-002', name: 'HRIS Vendor Selection', assignedTo: 'Sara Ali', status: 'completed', priority: 'High', startDate: '2024-11-01', endDate: '2024-11-15', progress: 100, description: 'Evaluate and select HRIS vendor.' },
        { id: 'task-009', projectId: 'proj-002', name: 'Data Migration Plan', assignedTo: 'Tesfaye Gebre', status: 'completed', priority: 'High', startDate: '2024-11-16', endDate: '2024-11-30', progress: 100, description: 'Plan for migrating employee data.' },
        { id: 'task-010', projectId: 'proj-002', name: 'System Configuration', assignedTo: 'Tesfaye Gebre', status: 'completed', priority: 'Medium', startDate: '2024-12-01', endDate: '2025-01-31', progress: 100, description: 'Configure new HRIS modules.' },

        { id: 'task-011', projectId: 'proj-003', name: 'Requirement Gathering', assignedTo: 'Kebede Worku', status: 'completed', priority: 'High', startDate: '2025-03-01', endDate: '2025-03-15', progress: 100, description: 'Gather requirements for mobile app.' },
        { id: 'task-012', projectId: 'proj-003', name: 'Mobile UI/UX Design', assignedTo: 'Tesfaye Gebre', status: 'active', priority: 'High', startDate: '2025-03-16', endDate: '2025-04-30', progress: 60, description: 'Design mobile app interface.' },
        { id: 'task-013', projectId: 'proj-003', name: 'API Integration', assignedTo: 'Kebede Worku', status: 'pending', priority: 'Medium', startDate: '2025-05-01', endDate: '2025-06-30', progress: 0, description: 'Integrate with backend APIs.' },
    ];

    // Simplified dependencies for the Gantt Chart. In a real app, these would be fetched.
    const mockDependencies = [
        { fromId: 'task-001', toId: 'task-002', type: 'FS' }, // Website Redesign
        { fromId: 'task-002', toId: 'task-003', type: 'FS' },
        { fromId: 'task-002', toId: 'task-004', type: 'FS' },
        { fromId: 'task-003', toId: 'task-005', type: 'FS' },
        { fromId: 'task-004', toId: 'task-005', type: 'FS' },
        { fromId: 'task-005', toId: 'task-006', type: 'FS' },
        { fromId: 'task-006', toId: 'task-007', type: 'FS' },

        { fromId: 'task-008', toId: 'task-009', type: 'FS' }, // HR System
        { fromId: 'task-009', toId: 'task-010', type: 'FS' },

        { fromId: 'task-011', toId: 'task-012', type: 'FS' }, // Mobile App
        { fromId: 'task-012', toId: 'task-013', type: 'FS' },
    ];
    // --- End Inline Mock Data ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            const foundProject = mockProjects.find(p => p.id === projectId);
            if (foundProject) {
                setProject(foundProject);
                const tasksForProject = mockTasks.filter(task => task.projectId === projectId);
                setProjectTasks(tasksForProject);

                // Filter dependencies relevant to this project's tasks
                const relevantTaskIds = new Set(tasksForProject.map(t => t.id));
                const filteredDependencies = mockDependencies.filter(dep =>
                    relevantTaskIds.has(dep.fromId) && relevantTaskIds.has(dep.toId)
                );
                setTaskDependencies(filteredDependencies);

            } else {
                setError('Project not found.');
            }
            setLoading(false);
        }, 700);
    }, [projectId]);

    if (loading) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter">
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading Gantt chart data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
                <Link to={`/projects/${projectId}/details`}>
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Project Details
                    </Button>
                </Link>
            </div>
        );
    }

    if (!project) {
        return null; // Should not happen if error handling works, but good for safety
    }

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <GanttChartSquare className="w-10 h-10 text-teal-600" /> Gantt Chart for "{project.name}"
                </h1>
                <Link to={`/projects/${projectId}/details`}>
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Project Details
                    </Button>
                </Link>
            </div>

            {projectTasks.length === 0 ? (
                <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white text-center py-10">
                    <ClipboardList size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">No tasks found for this project to display in the Gantt chart.</p>
                    <Link to={`/tasks/new?projectId=${projectId}`} className="mt-4 inline-block">
                        <Button variant="primary" className="flex items-center gap-2">
                            Add First Task
                        </Button>
                    </Link>
                </Card>
            ) : (
                <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                    <GanttChart
                        tasks={projectTasks}
                        dependencies={taskDependencies}
                        projectStartDate={project.startDate}
                        projectEndDate={project.endDate}
                    />
                </Card>
            )}
        </div>
    );
};

export default ProjectGanttChartPage;
