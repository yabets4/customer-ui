// pages/ProjectTaskManagement/ProjectReportsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    BarChart2, ArrowLeft, ClipboardList, CheckCircle, Clock, XCircle,
    DollarSign, TrendingUp, TrendingDown, Users, Calendar, Info
} from 'lucide-react';

const ProjectReportsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            // In a real app, you'd fetch this data from your backend
            setLoading(false);
        }, 700);
    }, []);

    // Calculate overall project summary metrics
    const overallSummary = useMemo(() => {
        const totalProjects = mockProjects.length;
        const activeProjects = mockProjects.filter(p => p.status === 'Active').length;
        const completedProjects = mockProjects.filter(p => p.status === 'Completed').length;
        const onHoldProjects = mockProjects.filter(p => p.status === 'On Hold').length;
        const overdueProjects = mockProjects.filter(p => new Date(p.endDate) < new Date() && p.status !== 'Completed').length;

        const totalProgressSum = mockProjects.reduce((sum, p) => sum + p.progress, 0);
        const averageProgress = totalProjects > 0 ? (totalProgressSum / totalProjects).toFixed(1) : 0;

        const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
        const totalActualCost = mockProjects.reduce((sum, p) => sum + p.actualCost, 0);
        const overallVariance = totalBudget - totalActualCost;

        return {
            totalProjects,
            activeProjects,
            completedProjects,
            onHoldProjects,
            overdueProjects,
            averageProgress,
            totalBudget,
            totalActualCost,
            overallVariance,
        };
    }, [mockProjects]);

    // Group projects by status for distribution
    const projectStatusDistribution = useMemo(() => {
        const distribution = {};
        mockProjects.forEach(p => {
            distribution[p.status] = (distribution[p.status] || 0) + 1;
        });
        return Object.entries(distribution).map(([status, count]) => ({ status, count }));
    }, [mockProjects]);

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'On Hold': return 'bg-yellow-100 text-yellow-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter">
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Generating project reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
                <Link to="/dashboard">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <BarChart2 className="w-10 h-10 text-purple-600" /> Project Reports
                </h1>
                <Link to="/dashboard">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {/* Overall Project Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                    <ClipboardList size={36} className="text-blue-500 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{overallSummary.totalProjects}</p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                    <Clock size={36} className="text-orange-500 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700">Active Projects</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{overallSummary.activeProjects}</p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                    <CheckCircle size={36} className="text-green-500 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700">Completed Projects</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{overallSummary.completedProjects}</p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white flex flex-col items-center text-center">
                    <TrendingUp size={36} className="text-purple-500 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700">Avg. Progress</h3>
                    <p className="text-4xl font-bold text-gray-900 mt-2">{overallSummary.averageProgress}%</p>
                </Card>
            </div>

            {/* Project Status Distribution & Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <Info size={24} className="text-indigo-600" /> Project Status Distribution
                    </h2>
                    {projectStatusDistribution.length > 0 ? (
                        <div className="space-y-3">
                            {projectStatusDistribution.map((item, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <p className="text-lg font-semibold text-gray-700">{item.status}</p>
                                    <span className={`px-4 py-1 rounded-full text-lg font-bold ${getStatusClasses(item.status)}`}>
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No projects to display status distribution.</p>
                    )}
                </Card>

                <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <ClipboardList size={24} className="text-teal-600" /> Project Progress Overview
                    </h2>
                    {mockProjects.length > 0 ? (
                        <ul className="space-y-4">
                            {mockProjects.sort((a, b) => b.progress - a.progress).map(project => (
                                <li key={project.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-semibold text-gray-800">{project.name}</p>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-right text-sm text-gray-600 mt-1">{project.progress}% Complete</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No projects to display progress.</p>
                    )}
                </Card>
            </div>

            {/* Project Budget vs. Actuals */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <DollarSign size={24} className="text-green-600" /> Budget vs. Actuals
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Project Name</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Budget (ETB)</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Cost (ETB)</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Variance (ETB)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockProjects.map(project => {
                                const variance = project.budget - project.actualCost;
                                return (
                                    <tr key={project.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <Link to={`/projects/${project.id}/details`} className="text-blue-600 hover:underline">
                                                {project.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{project.budget.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{project.actualCost.toLocaleString()}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${variance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                            {variance.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr className="bg-gray-100 font-bold">
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">Overall Totals</td>
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 text-right">{overallSummary.totalBudget.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 text-right">{overallSummary.totalActualCost.toLocaleString()}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-base text-right ${overallSummary.overallVariance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {overallSummary.overallVariance.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Recent Project Activities */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <Calendar size={24} className="text-yellow-600" /> Recent Project Activities
                </h2>
                {mockRecentActivities.length > 0 ? (
                    <ul className="space-y-4">
                        {mockRecentActivities.sort((a, b) => new Date(b.date) - new Date(a.date)).map(activity => (
                            <li key={activity.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-sm text-gray-700">
                                        Project: <Link to={`/projects/${activity.projectId}/details`} className="font-semibold text-blue-600 hover:underline">
                                            {mockProjects.find(p => p.id === activity.projectId)?.name || 'Unknown Project'}
                                        </Link>
                                    </p>
                                    <span className="text-xs text-gray-500">{activity.date}</span>
                                </div>
                                <p className="text-md text-gray-800">{activity.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No recent project activities to display.</p>
                )}
            </Card>
        </div>
    );
};

export default ProjectReportsPage;
