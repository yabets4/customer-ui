// components/GanttChart.jsx

import React, { useMemo } from 'react';

// Lucide React Icons (for potential use in task details/status)
import { CheckCircle, XCircle, Clock, Link as LinkIcon, AlertCircle, ClipboardList, Info, Calendar } from 'lucide-react';

/**
 * GanttChart Component
 * A reusable UI component to visualize project tasks, timelines, and dependencies.
 *
 * Props:
 * - tasks: Array of task objects. Each task should have:
 * - id: Unique string identifier (e.g., 'task-001')
 * - name: String, display name of the task
 * - startDate: String (YYYY-MM-DD), task start date
 * - endDate: String (YYYY-MM-DD), task end date
 * - progress: Number (0-100), completion percentage
 * - status: String (e.g., 'active', 'completed', 'overdue', 'blocked', 'pending', 'on_hold', 'canceled')
 * - assignedTo: String (e.g., 'John Doe') - optional
 * - dependencies: Array of dependency objects. Each dependency should have:
 * - fromId: String, ID of the preceding task
 * - toId: String, ID of the dependent task
 * - type: String (e.g., 'FS' - Finish-to-Start) - optional
 * - projectStartDate: String (YYYY-MM-DD), overall project start date (determines chart start)
 * - projectEndDate: String (YYYY-MM-DD), overall project end date (determines chart end)
 */
const GanttChart = ({ tasks = [], dependencies = [], projectStartDate, projectEndDate }) => {

    // --- Mock Data for internal testing if props are not provided ---
    const defaultProjectStartDate = '2025-07-01';
    const defaultProjectEndDate = '2025-09-30';

    const defaultTasks = [
        { id: 't1', name: 'Phase 1 Planning', startDate: '2025-07-01', endDate: '2025-07-05', progress: 100, status: 'completed', assignedTo: 'Alice' },
        { id: 't2', name: 'Design Mockups', startDate: '2025-07-06', endDate: '2025-07-15', progress: 80, status: 'active', assignedTo: 'Bob' },
        { id: 't3', name: 'Database Setup', startDate: '2025-07-08', endDate: '2025-07-20', progress: 50, status: 'active', assignedTo: 'Charlie' },
        { id: 't4', name: 'Frontend Development', startDate: '2025-07-16', endDate: '2025-08-10', progress: 30, status: 'active', assignedTo: 'Bob' },
        { id: 't5', name: 'Backend API', startDate: '2025-07-21', endDate: '2025-08-25', progress: 10, status: 'active', assignedTo: 'Charlie' },
        { id: 't6', name: 'User Acceptance Testing', startDate: '2025-08-26', endDate: '2025-09-10', progress: 0, status: 'pending', assignedTo: 'Alice' },
        { id: 't7', name: 'Deployment', startDate: '2025-09-11', endDate: '2025-09-15', progress: 0, status: 'pending', assignedTo: 'Charlie' },
        { id: 't8', name: 'Marketing Launch', startDate: '2025-09-10', endDate: '2025-09-20', progress: 0, status: 'pending', assignedTo: 'Alice' },
        { id: 't9', name: 'Budget Review', startDate: '2025-07-10', endDate: '2025-07-12', progress: 100, status: 'completed', assignedTo: 'Bob' },
        { id: 't10', name: 'Procurement', startDate: '2025-07-15', endDate: '2025-07-20', progress: 100, status: 'completed', assignedTo: 'Alice' },
        { id: 't11', name: 'Risk Assessment', startDate: '2025-07-22', endDate: '2025-07-25', progress: 0, status: 'overdue', assignedTo: 'Bob' }, // Example overdue task
        { id: 't12', name: 'Blocked Task Example', startDate: '2025-08-01', endDate: '2025-08-05', progress: 0, status: 'blocked', assignedTo: 'Charlie' }, // Example blocked task
    ];

    const defaultDependencies = [
        { fromId: 't1', toId: 't2', type: 'FS' }, // Finish-to-Start
        { fromId: 't1', toId: 't3', type: 'FS' },
        { fromId: 't2', toId: 't4', type: 'FS' },
        { fromId: 't3', toId: 't5', type: 'FS' },
        { fromId: 't4', toId: 't6', type: 'FS' },
        { fromId: 't5', toId: 't6', type: 'FS' },
        { fromId: 't6', toId: 't7', type: 'FS' },
        { fromId: 't4', toId: 't8', type: 'FS' }, // Marketing can start after frontend is mostly done
        { fromId: 't11', toId: 't12', type: 'FS' }, // Blocked task depends on overdue task
    ];
    // --- End Mock Data ---

    // Use provided props or fall back to default mock data
    const chartTasks = tasks.length > 0 ? tasks : defaultTasks;
    const chartDependencies = dependencies.length > 0 ? dependencies : defaultDependencies;
    const chartProjectStartDate = projectStartDate || defaultProjectStartDate;
    const chartProjectEndDate = projectEndDate || defaultProjectEndDate;

    const chartTimelineStart = useMemo(() => new Date(chartProjectStartDate), [chartProjectStartDate]);
    const chartTimelineEnd = useMemo(() => new Date(chartProjectEndDate), [chartProjectEndDate]);
    const totalChartDays = useMemo(() => {
        // Add one day to include the end date in the total duration
        return (chartTimelineEnd.getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
    }, [chartTimelineStart, chartTimelineEnd]);

    // Helper function to get status-based styling
    const getStatusStyle = (status, isOverdue) => {
        let classes = '';
        let icon = null;
        let text = status;

        switch (status) {
            case 'completed':
                classes = 'bg-gradient-to-r from-green-500 to-green-600';
                icon = <CheckCircle size={14} className="text-white" />;
                break;
            case 'active':
                classes = 'bg-gradient-to-r from-blue-500 to-blue-600';
                icon = <Clock size={14} className="text-white" />;
                break;
            case 'pending':
                classes = 'bg-gradient-to-r from-gray-400 to-gray-500';
                icon = <Clock size={14} className="text-white" />;
                break;
            case 'on_hold':
                classes = 'bg-gradient-to-r from-yellow-500 to-yellow-600';
                icon = <AlertCircle size={14} className="text-white" />;
                break;
            case 'canceled':
                classes = 'bg-gradient-to-r from-red-500 to-red-600';
                icon = <XCircle size={14} className="text-white" />;
                break;
            case 'overdue': // This case is for tasks explicitly marked overdue in data
                classes = 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse';
                icon = <AlertCircle size={14} className="text-white" />;
                text = 'Overdue!';
                break;
            case 'blocked':
                classes = 'bg-gradient-to-r from-orange-600 to-orange-700';
                icon = <XCircle size={14} className="text-white" />;
                text = 'Blocked!';
                break;
            default:
                classes = 'bg-gradient-to-r from-gray-500 to-gray-600';
                icon = <Info size={14} className="text-white" />;
        }

        // Override if dynamically determined as overdue
        if (isOverdue && status !== 'completed') {
            classes = 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse';
            icon = <AlertCircle size={14} className="text-white" />;
            text = 'Overdue!';
        }

        return { classes, icon, text };
    };

    // Calculate position and width for each task bar
    const positionedTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of day

        return chartTasks.map(task => {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);

            const offsetDays = (taskStart.getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24);
            const durationDays = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) + 1; // Add 1 to include end day

            const leftPercentage = (offsetDays / totalChartDays) * 100;
            const widthPercentage = (durationDays / totalChartDays) * 100;

            const isOverdue = task.status !== 'completed' && taskEnd < today;
            const { classes: statusClasses, icon: statusIcon, text: statusText } = getStatusStyle(task.status, isOverdue);

            return {
                ...task,
                left: leftPercentage,
                width: widthPercentage,
                statusClasses,
                statusIcon,
                statusText,
            };
        });
    }, [chartTasks, chartTimelineStart, totalChartDays]);

    // Generate month headers for the timeline
    const monthHeaders = useMemo(() => {
        const headers = [];
        let current = new Date(chartTimelineStart.getFullYear(), chartTimelineStart.getMonth(), 1);
        const end = new Date(chartTimelineEnd.getFullYear(), chartTimelineEnd.getMonth(), 1);

        while (current <= end) {
            const nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, 1);
            // Ensure the month's end is within the chart's end
            const monthEndForCalc = nextMonth > chartTimelineEnd ? chartTimelineEnd : nextMonth;

            const monthStartOffsetDays = (current.getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24);
            const monthEndOffsetDays = (monthEndForCalc.getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24);

            const leftPercentage = (monthStartOffsetDays / totalChartDays) * 100;
            const widthPercentage = ((monthEndOffsetDays - monthStartOffsetDays) / totalChartDays) * 100;

            headers.push({
                name: current.toLocaleString('default', { month: 'short', year: 'numeric' }),
                left: leftPercentage,
                width: widthPercentage,
            });
            current = nextMonth;
        }
        return headers;
    }, [chartTimelineStart, chartTimelineEnd, totalChartDays]);

    // Simplified SVG for dependencies. A more robust solution would calculate exact start/end points of bars.
    const dependencyLines = useMemo(() => {
        const lines = [];
        const taskMap = new Map(positionedTasks.map(task => [task.id, task]));

        chartDependencies.forEach(dep => {
            const fromTask = taskMap.get(dep.fromId);
            const toTask = taskMap.get(dep.toId);

            if (fromTask && toTask) {
                // Approximate positions for SVG lines
                // Convert percentage positions to pixels for SVG drawing
                const chartWidthPx = 1000; // Corresponds to min-w-[1000px]
                const taskHeightPx = 40; // Height of each task row

                const x1 = (fromTask.left + fromTask.width) / 100 * chartWidthPx; // End of 'from' task
                const y1 = positionedTasks.indexOf(fromTask) * taskHeightPx + (taskHeightPx / 2); // Center of task bar

                const x2 = toTask.left / 100 * chartWidthPx; // Start of 'to' task
                const y2 = positionedTasks.indexOf(toTask) * taskHeightPx + (taskHeightPx / 2); // Center of task bar

                lines.push({ x1, y1, x2, y2 });
            }
        });
        return lines;
    }, [chartDependencies, positionedTasks]);

    // Legend data for status colors
    const statusLegend = [
        { status: 'completed', label: 'Completed', color: 'bg-green-500', icon: <CheckCircle size={16} className="text-green-500" /> },
        { status: 'active', label: 'Active', color: 'bg-blue-500', icon: <Clock size={16} className="text-blue-500" /> },
        { status: 'pending', label: 'Pending', color: 'bg-gray-400', icon: <Clock size={16} className="text-gray-400" /> },
        { status: 'on_hold', label: 'On Hold', color: 'bg-yellow-500', icon: <AlertCircle size={16} className="text-yellow-500" /> },
        { status: 'overdue', label: 'Overdue', color: 'bg-red-600', icon: <AlertCircle size={16} className="text-red-600" /> },
        { status: 'blocked', label: 'Blocked', color: 'bg-orange-600', icon: <XCircle size={16} className="text-orange-600" /> },
        { status: 'canceled', label: 'Canceled', color: 'bg-red-500', icon: <XCircle size={16} className="text-red-500" /> },
    ];


    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 font-inter text-gray-900 dark:text-gray-100">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ClipboardList size={32} className="text-blue-600 dark:text-blue-400" /> Project Timeline (Gantt Chart)
            </h2>

            {chartTasks.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                    No tasks available to display in the Gantt Chart.
                </div>
            )}

            {chartTasks.length > 0 && (
                <div className="relative overflow-x-auto pb-4 custom-scrollbar">
                    <div className="min-w-[1200px] relative"> {/* Increased min-width for better spacing */}
                        {/* Timeline Header (Months) */}
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden border-b border-gray-200 dark:border-gray-700">
                            {monthHeaders.map((month, index) => (
                                <div
                                    key={index}
                                    className="text-center text-sm font-semibold py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                                    style={{ flexBasis: `${month.width}%`, minWidth: '100px' }} // Adjusted minWidth
                                >
                                    {month.name}
                                </div>
                            ))}
                        </div>

                        {/* Chart Area */}
                        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-b-lg p-2 border-t-0 border border-gray-200 dark:border-gray-700" style={{ height: chartTasks.length * 45 + 40 + 'px' }}> {/* Dynamic height, slightly more space */}
                            {/* Today's Line */}
                            {totalChartDays > 0 && (
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-lg animate-pulse"
                                    style={{ left: `${((new Date().getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24) / totalChartDays) * 100}%` }}
                                ></div>
                            )}

                            {/* Task Rows */}
                            {positionedTasks.map((task, index) => (
                                <div key={task.id} className="relative h-[45px] flex items-center group"> {/* Increased row height */}
                                    {/* Task Bar */}
                                    <div
                                        className={`absolute h-9 rounded-lg shadow-md flex items-center overflow-hidden transition-all duration-300 transform hover:scale-103 ${task.statusClasses}`}
                                        style={{ left: `${task.left}%`, width: `${task.width}%` }}
                                        title={`Task: ${task.name}\nStatus: ${task.statusText}\nProgress: ${task.progress}%\nAssigned To: ${task.assignedTo || 'N/A'}\nStart: ${task.startDate}\nEnd: ${task.endDate}`}
                                    >
                                        {/* Progress Bar */}
                                        <div
                                            className="absolute top-0 left-0 h-full bg-black bg-opacity-20 rounded-lg"
                                            style={{ width: `${task.progress}%` }}
                                        ></div>
                                        <span className="relative z-10 text-white text-xs font-semibold px-3 flex items-center gap-1 truncate w-full">
                                            {task.statusIcon} {task.name} ({task.progress}%)
                                        </span>
                                    </div>
                                    {/* Task Label (outside bar for clarity) */}
                                    <div className="absolute -left-40 w-36 text-right text-sm text-gray-700 dark:text-gray-300 truncate pr-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                                        {task.name}
                                        {task.assignedTo && <span className="block text-xs text-gray-500 dark:text-gray-400">({task.assignedTo})</span>}
                                    </div>
                                </div>
                            ))}

                            {/* Dependency Lines (SVG overlay) */}
                            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                                {/* Define arrowhead marker */}
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7"
                                        refX="0" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
                                    </marker>
                                </defs>
                                {dependencyLines.map((line, index) => (
                                    <line
                                        key={index}
                                        x1={`${line.x1}px`} y1={`${line.y1}px`}
                                        x2={`${line.x2}px`} y2={`${line.y2}px`}
                                        stroke="#9CA3AF" // Gray-400
                                        strokeWidth="2" // Slightly thicker
                                        markerEnd="url(#arrowhead)" // Add arrowhead
                                    />
                                ))}
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend Section */}
            <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Info size={20} className="text-purple-600 dark:text-purple-400" /> Status Legend
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {statusLegend.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full ${item.color}`}></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                {item.icon} {item.label}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <AlertCircle size={16} className="text-red-500" /> Today's Line
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
