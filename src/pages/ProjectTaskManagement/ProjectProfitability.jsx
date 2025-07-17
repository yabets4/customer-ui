// pages/ProjectTaskManagement/ProfitabilityPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    DollarSign, ArrowLeft, TrendingUp, TrendingDown, Percent,
    ClipboardList, Briefcase, BarChart2, AlertCircle, Clock, Users, Target, Scale
} from 'lucide-react';

const ProfitabilityPage = () => {
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

    // Mock financial data (simplified for demonstration)
    const mockProjectFinancials = [
        { projectId: 'proj-001', revenue: 180000, directCosts: 100000, overheadCosts: 20000 },
        { projectId: 'proj-002', revenue: 220000, directCosts: 150000, overheadCosts: 15000 },
        { projectId: 'proj-003', revenue: 100000, directCosts: 80000, overheadCosts: 10000 }, // Less revenue for in-progress project
    ];

    // Mock employee hourly rates (for calculating labor costs if tasks had hours)
    const mockEmployeeRates = {
        'Aisha Demisse': 500, // ETB per hour
        'Tesfaye Gebre': 400,
        'Sara Ali': 300,
        'Kebede Worku': 350,
        'John Smith': 600, // Manager
        'Jane Doe': 550, // Manager
    };

    // Mock tasks with estimated hours (if not already present in your task data)
    const mockTasksWithHours = [
        { id: 'task-001', projectId: 'proj-001', assignedTo: 'Aisha Demisse', estimatedHours: 80 },
        { id: 'task-002', projectId: 'proj-001', assignedTo: 'Tesfaye Gebre', estimatedHours: 120 },
        { id: 'task-003', projectId: 'proj-001', assignedTo: 'Tesfaye Gebre', estimatedHours: 200 },
        { id: 'task-004', projectId: 'proj-001', assignedTo: 'Aisha Demisse', estimatedHours: 180 },
        { id: 'task-005', projectId: 'proj-001', assignedTo: 'Aisha Demisse', estimatedHours: 60 },
        { id: 'task-006', projectId: 'proj-001', assignedTo: 'Aisha Demisse', estimatedHours: 90 },
        { id: 'task-007', projectId: 'proj-001', assignedTo: 'Tesfaye Gebre', estimatedHours: 40 },

        { id: 'task-008', projectId: 'proj-002', assignedTo: 'Sara Ali', estimatedHours: 50 },
        { id: 'task-009', projectId: 'proj-002', assignedTo: 'Tesfaye Gebre', estimatedHours: 100 },
        { id: 'task-010', projectId: 'proj-002', assignedTo: 'Tesfaye Gebre', estimatedHours: 150 },

        { id: 'task-011', projectId: 'proj-003', assignedTo: 'Kebede Worku', estimatedHours: 70 },
        { id: 'task-012', projectId: 'proj-003', assignedTo: 'Tesfaye Gebre', estimatedHours: 110 },
        { id: 'task-013', projectId: 'proj-003', assignedTo: 'Kebede Worku', estimatedHours: 130 },
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

    // Calculate profitability metrics for the specific project
    const projectProfitability = useMemo(() => {
        if (!project) return null;

        const financialsForProject = mockProjectFinancials.find(pf => pf.projectId === projectId);
        const tasksForProject = mockTasksWithHours.filter(task => task.projectId === projectId);

        let revenue = financialsForProject?.revenue || 0;
        let directCosts = financialsForProject?.directCosts || 0;
        let overheadCosts = financialsForProject?.overheadCosts || 0;
        let laborCosts = 0;
        let totalEstimatedHours = 0; // New metric

        tasksForProject.forEach(task => {
            const employeeRate = mockEmployeeRates[task.assignedTo] || 0;
            laborCosts += (task.estimatedHours || 0) * employeeRate;
            totalEstimatedHours += (task.estimatedHours || 0); // Summing estimated hours
        });

        const totalCosts = directCosts + overheadCosts + laborCosts;
        const profitLoss = revenue - totalCosts;
        const profitMargin = revenue > 0 ? (profitLoss / revenue) * 100 : 0;

        // New metrics
        const roi = totalCosts > 0 ? (profitLoss / totalCosts) * 100 : 0;
        const costVariance = project.budget - totalCosts; // Assuming project.budget exists
        const revenuePerHour = totalEstimatedHours > 0 ? revenue / totalEstimatedHours : 0;

        return {
            revenue,
            directCosts,
            overheadCosts,
            laborCosts,
            totalCosts,
            profitLoss,
            profitMargin,
            roi, // Added
            costVariance, // Added
            revenuePerHour, // Added
            totalEstimatedHours, // Added for completeness
        };
    }, [project, projectId, mockProjectFinancials, mockTasksWithHours, mockEmployeeRates]);

    if (loading) {
        return (
            <div className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter dark:from-gray-900 dark:to-black">
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Calculating project profitability...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter dark:from-gray-900 dark:to-black">
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

    if (!project || !projectProfitability) {
        return null; // Should not happen if error handling works
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen font-inter text-gray-900 dark:from-gray-900 dark:to-black dark:text-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                    <DollarSign className="w-10 h-10 text-green-600 dark:text-green-400" /> Profitability for "{project.name}"
                </h1>
                <Link to={`/projects/${projectId}/details`} className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <ArrowLeft size={20} /> Back to Project Details
                    </Button>
                </Link>
            </div>

            {/* Project Overview */}
            <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <ClipboardList size={24} className="text-blue-600 dark:text-blue-400" /> Project Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
                    <p><span className="font-semibold">Description:</span> {project.description}</p>
                    <p><span className="font-semibold">Start Date:</span> {project.startDate}</p>
                    <p><span className="font-semibold">End Date:</span> {project.endDate}</p>
                    <p><span className="font-semibold">Status:</span> {project.status}</p>
                    <p><span className="font-semibold">Manager:</span> {project.manager.name}</p>
                    <p><span className="font-semibold">Department:</span> {project.department}</p>
                    <p><span className="font-semibold">Budget:</span> ETB {project.budget.toLocaleString()}</p>
                    <p><span className="font-semibold">Overall Progress:</span> {project.progress}%</p>
                </div>
            </Card>

            {/* Key Profitability Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <BarChart2 size={36} className="text-blue-500 dark:text-blue-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Revenue</h3>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">ETB {projectProfitability.revenue.toLocaleString()}</p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <TrendingDown size={36} className="text-red-500 dark:text-red-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Costs</h3>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">ETB {projectProfitability.totalCosts.toLocaleString()}</p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    {projectProfitability.profitLoss >= 0 ? (
                        <TrendingUp size={36} className="text-green-500 dark:text-green-400 mb-3" />
                    ) : (
                        <TrendingDown size={36} className="text-red-500 dark:text-red-400 mb-3" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Profit/Loss</h3>
                    <p className={`text-4xl font-bold mt-2 ${projectProfitability.profitLoss >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        ETB {projectProfitability.profitLoss.toLocaleString()}
                    </p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <Percent size={36} className="text-purple-500 dark:text-purple-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Profit Margin</h3>
                    <p className={`text-4xl font-bold mt-2 ${projectProfitability.profitMargin >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {projectProfitability.profitMargin.toFixed(2)}%
                    </p>
                </Card>
            </div>

            {/* Additional Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <Target size={36} className="text-cyan-500 dark:text-cyan-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Return on Investment (ROI)</h3>
                    <p className={`text-4xl font-bold mt-2 ${projectProfitability.roi >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {projectProfitability.roi.toFixed(2)}%
                    </p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <Scale size={36} className="text-orange-500 dark:text-orange-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Cost Variance (Budget vs. Actual)</h3>
                    <p className={`text-4xl font-bold mt-2 ${projectProfitability.costVariance >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        ETB {projectProfitability.costVariance.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {projectProfitability.costVariance >= 0 ? 'Under Budget' : 'Over Budget'}
                    </p>
                </Card>
                <Card className="p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center text-center">
                    <Clock size={36} className="text-yellow-500 dark:text-yellow-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Revenue Per Hour</h3>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                        ETB {projectProfitability.revenuePerHour.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        (Based on {projectProfitability.totalEstimatedHours} estimated hours)
                    </p>
                </Card>
            </div>

            {/* Detailed Cost Breakdown */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <Briefcase size={24} className="text-indigo-600 dark:text-indigo-400" /> Cost Breakdown
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Direct Costs:</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">ETB {projectProfitability.directCosts.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Overhead Costs:</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">ETB {projectProfitability.overheadCosts.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Labor Costs:</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">ETB {projectProfitability.laborCosts.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Costs:</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">ETB {projectProfitability.totalCosts.toLocaleString()}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProfitabilityPage;
