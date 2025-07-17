// components/GanttChart.jsx

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Import framer-motion for animations and drag

// Lucide React Icons
import { CheckCircle, XCircle, Clock, Link as LinkIcon, AlertCircle, ClipboardList, Info, Calendar, Plus, Edit, Trash2, User, Play, Pause, FastForward, Star } from 'lucide-react'; // Added Star icon

// Assuming these UI components are available from your project structure
// If not, you'll need to define them or replace them with basic HTML elements.
import Button from './ui/Button';
import ModalWithForm from './ui/modal';
import Input from './ui/input'; // Assuming a generic Input component
import Select from './ui/Select'; // Assuming a generic Select component

/**
 * Helper function to generate dates for the timeline header.
 * @param {Date} startDate - The starting date.
 * @param {number} days - Number of days to generate.
 * @returns {Date[]} Array of Date objects.
 */
function generateDates(startDate, days) {
    const dates = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }
    return dates;
}

/**
 * Helper function to format dates for display.
 * @param {Date} date - The date to format.
 * @returns {string} Formatted date string (e.g., "Jul 15").
 */
function formatDate(date) {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Helper function to compute the critical path of tasks.
 * This is a simplified implementation for demonstration.
 * @param {Array} tasks - Array of task objects.
 * @returns {Set<string>} Set of task IDs on the critical path.
 */
function computeCriticalPath(tasks) {
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    const adj = new Map(); // Adjacency list for dependencies (from -> [to])
    const revAdj = new Map(); // Reverse adjacency list (to -> [from])

    tasks.forEach(task => {
        adj.set(task.id, []);
        revAdj.set(task.id, []);
    });

    tasks.forEach(task => {
        if (task.dependsOn) {
            task.dependsOn.forEach(depId => {
                adj.get(depId)?.push(task.id);
                revAdj.get(task.id)?.push(depId);
            });
        }
    });

    const earliestStart = new Map();
    const latestFinish = new Map();
    const queue = [];
    const inDegree = new Map();

    tasks.forEach(task => {
        inDegree.set(task.id, task.dependsOn ? task.dependsOn.length : 0);
        earliestStart.set(task.id, 0); // Initialize with 0 or a very small number

        if (inDegree.get(task.id) === 0) {
            queue.push(task.id);
        }
    });

    // Forward pass to calculate earliest start times
    while (queue.length > 0) {
        const taskId = queue.shift();
        const task = taskMap.get(taskId);
        const finishTime = earliestStart.get(taskId) + task.duration;

        adj.get(taskId)?.forEach(nextTaskId => {
            earliestStart.set(nextTaskId, Math.max(earliestStart.get(nextTaskId), finishTime));
            inDegree.set(nextTaskId, inDegree.get(nextTaskId) - 1);
            if (inDegree.get(nextTaskId) === 0) {
                queue.push(nextTaskId);
            }
        });
    }

    // Backward pass to calculate latest finish times
    let projectFinishTime = 0;
    tasks.forEach(task => {
        projectFinishTime = Math.max(projectFinishTime, earliestStart.get(task.id) + task.duration);
        latestFinish.set(task.id, projectFinishTime); // Initialize with project finish time
    });

    const revQueue = [];
    const outDegree = new Map();
    tasks.forEach(task => {
        outDegree.set(task.id, adj.get(task.id)?.length || 0);
        if (outDegree.get(task.id) === 0) {
            revQueue.push(task.id);
        }
    });

    while (revQueue.length > 0) {
        const taskId = revQueue.shift();
        const task = taskMap.get(taskId);
        const startTime = latestFinish.get(taskId) - task.duration;

        revAdj.get(taskId)?.forEach(prevTaskId => {
            latestFinish.set(prevTaskId, Math.min(latestFinish.get(prevTaskId), startTime));
            outDegree.set(prevTaskId, outDegree.get(prevTaskId) - 1);
            if (outDegree.get(prevTaskId) === 0) {
                revQueue.push(prevTaskId);
            }
        });
    }

    const criticalTasksSet = new Set();
    tasks.forEach(task => {
        // A task is critical if its earliest start equals its latest start
        // and its earliest finish equals its latest finish (i.e., total float is 0)
        const totalFloat = latestFinish.get(task.id) - (earliestStart.get(task.id) + task.duration);
        if (totalFloat <= 0.001) { // Use a small epsilon for float comparison
            criticalTasksSet.add(task.id);
        }
    });

    return criticalTasksSet;
}


/**
 * Calculates the minimum start day for a task based on its dependencies.
 * @param {Object} task - The task object.
 * @param {Array} allTasks - All task objects in the chart.
 * @returns {number} The minimum possible start day for the task.
 */
function getMinStartForTask(task, allTasks) {
    if (!task.dependsOn || task.dependsOn.length === 0) return 0;
    let maxPredecessorEnd = 0;
    task.dependsOn.forEach(depId => {
        const depTask = allTasks.find(t => t.id === depId);
        if (depTask) {
            // Assuming 'start' and 'duration' are available for dependency calculation in this context
            // If using startDate/endDate, convert them to days from project start for calculation
            const depStartDay = (new Date(depTask.startDate).getTime() - new Date(task.projectStartDate || '2025-07-01').getTime()) / (1000 * 60 * 60 * 24);
            const depDurationDays = (new Date(depTask.endDate).getTime() - new Date(depTask.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1;
            maxPredecessorEnd = Math.max(maxPredecessorEnd, depStartDay + depDurationDays);
        }
    });
    return maxPredecessorEnd;
}


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
 * - milestone: Boolean - optional, if true, renders as a milestone
 * - dependsOn: Array of string IDs of tasks this task depends on (Finish-to-Start)
 * - dependencies: Array of dependency objects. (Currently derived from tasks.dependsOn)
 * - projectStartDate: String (YYYY-MM-DD), overall project start date (determines chart start)
 * - projectEndDate: String (YYYY-MM-DD), overall project end date (determines chart end)
 */
const GanttChart = ({
    tasks: propTasks = [],
    dependencies: propDependencies = [], // Not directly used but kept for prop consistency
    projectStartDate,
    projectEndDate
}) => {

    const CELL_WIDTH = 60; // Pixels per day
    const ROW_HEIGHT = 45; // Height of each task row in pixels

    // --- Mock Data for internal testing if props are not provided ---
    const defaultProjectStartDate = '2025-07-01';
    const defaultProjectEndDate = '2025-09-30';

    const defaultTasks = [
        { id: 't1', name: 'Phase 1 Planning', startDate: '2025-07-01', endDate: '2025-07-05', progress: 100, status: 'completed', assignedTo: 'Alice', dependsOn: [] },
        { id: 't2', name: 'Design Mockups', startDate: '2025-07-06', endDate: '2025-07-15', progress: 80, status: 'active', assignedTo: 'Bob', dependsOn: ['t1'] },
        { id: 't3', name: 'Database Setup', startDate: '2025-07-08', endDate: '2025-07-20', progress: 50, status: 'active', assignedTo: 'Charlie', dependsOn: ['t1'] },
        { id: 't4', name: 'Frontend Development', startDate: '2025-07-16', endDate: '2025-08-10', progress: 30, status: 'active', assignedTo: 'Bob', dependsOn: ['t2'] },
        { id: 't5', name: 'Backend API', startDate: '2025-07-21', endDate: '2025-08-25', progress: 10, status: 'active', assignedTo: 'Charlie', dependsOn: ['t3'] },
        { id: 't6', name: 'User Acceptance Testing', startDate: '2025-08-26', endDate: '2025-09-10', progress: 0, status: 'pending', assignedTo: 'Alice', dependsOn: ['t4', 't5'] },
        { id: 't7', name: 'Deployment', startDate: '2025-09-11', endDate: '2025-09-15', progress: 0, status: 'pending', assignedTo: 'Charlie', dependsOn: ['t6'] },
        { id: 't8', name: 'Marketing Launch', startDate: '2025-09-10', endDate: '2025-09-20', progress: 0, status: 'pending', assignedTo: 'Alice', dependsOn: ['t4'] },
        { id: 't9', name: 'Budget Review', startDate: '2025-07-10', endDate: '2025-07-12', progress: 100, status: 'completed', assignedTo: 'Bob', milestone: true, dependsOn: [] },
        { id: 't10', name: 'Procurement', startDate: '2025-07-15', endDate: '2025-07-20', progress: 100, status: 'completed', assignedTo: 'Alice', dependsOn: [] },
        { id: 't11', name: 'Risk Assessment', startDate: '2025-07-22', endDate: '2025-07-25', progress: 0, status: 'overdue', assignedTo: 'Bob', dependsOn: [] }, // Example overdue task
        { id: 't12', name: 'Blocked Task Example', startDate: '2025-08-01', endDate: '2025-08-05', progress: 0, status: 'blocked', assignedTo: 'Charlie', dependsOn: ['t11'] }, // Example blocked task
    ];
    // --- End Mock Data ---

    const [tasks, setTasks] = useState(propTasks.length > 0 ? propTasks : defaultTasks);
    const [editingTask, setEditingTask] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [hoveredTask, setHoveredTask] = useState(null);

    // Use provided props or fall back to default mock data
    const chartProjectStartDate = projectStartDate || defaultProjectStartDate;
    const chartProjectEndDate = projectEndDate || defaultProjectEndDate;

    const chartTimelineStart = useMemo(() => new Date(chartProjectStartDate), [chartProjectStartDate]);
    const chartTimelineEnd = useMemo(() => new Date(chartProjectEndDate), [chartProjectEndDate]);
    const totalChartDays = useMemo(() => {
        // Add one day to include the end date in the total duration
        return Math.ceil((chartTimelineEnd.getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }, [chartTimelineStart, chartTimelineEnd]);

    const TIMELINE_WIDTH_PX = totalChartDays * CELL_WIDTH;

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

    const criticalTasks = useMemo(() => computeCriticalPath(tasks.map(task => ({
        id: task.id,
        name: task.name,
        start: (new Date(task.startDate).getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24),
        duration: (new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1,
        dependsOn: task.dependsOn || []
    }))), [tasks, chartTimelineStart]);


    // Calculate position and width for each task bar
    const positionedTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of day

        return tasks.map(task => {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);

            const offsetDays = (taskStart.getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24);
            const durationDays = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) + 1; // Add 1 to include end day

            const leftPx = offsetDays * CELL_WIDTH;
            const widthPx = durationDays * CELL_WIDTH;

            const isOverdue = task.status !== 'completed' && taskEnd < today;
            const { classes: statusClasses, icon: statusIcon, text: statusText } = getStatusStyle(task.status, isOverdue);
            const isCritical = criticalTasks.has(task.id);

            return {
                ...task,
                leftPx,
                widthPx,
                statusClasses,
                statusIcon,
                statusText,
                isCritical,
                // Add start and end day numbers for tooltip/internal logic
                startDay: Math.floor(offsetDays),
                endDay: Math.floor(offsetDays + durationDays -1),
            };
        }).sort((a, b) => a.startDay - b.startDay); // Sort tasks by start day for consistent rendering
    }, [tasks, chartTimelineStart, criticalTasks]);

    // Generate day headers for the timeline
    const dayHeaders = useMemo(() => {
        const headers = [];
        const current = new Date(chartTimelineStart);
        for (let i = 0; i < totalChartDays; i++) {
            const date = new Date(current);
            date.setDate(current.getDate() + i);
            headers.push({
                date: date,
                label: formatDate(date),
                isWeekend: date.getDay() === 0 || date.getDay() === 6, // Sunday (0) or Saturday (6)
                isToday: date.toDateString() === new Date().toDateString(),
            });
        }
        return headers;
    }, [chartTimelineStart, totalChartDays]);


    // Dependency Lines (SVG overlay)
    const dependencyLines = useMemo(() => {
        const lines = [];
        const taskMap = new Map(positionedTasks.map(task => [task.id, task]));

        // Calculate vertical offset for connecting lines to the center of the task bar
        const taskCenterY = ROW_HEIGHT / 2;

        tasks.forEach(task => {
            if (task.dependsOn) {
                task.dependsOn.forEach(depId => {
                    const fromTask = taskMap.get(depId);
                    const toTask = taskMap.get(task.id);

                    if (fromTask && toTask) {
                        const fromIndex = positionedTasks.findIndex(t => t.id === fromTask.id);
                        const toIndex = positionedTasks.findIndex(t => t.id === toTask.id);

                        const x1 = fromTask.leftPx + fromTask.widthPx; // End of 'from' task bar
                        const y1 = fromIndex * ROW_HEIGHT + taskCenterY;

                        const x2 = toTask.leftPx; // Start of 'to' task bar
                        const y2 = toIndex * ROW_HEIGHT + taskCenterY;

                        // Draw a simple elbow line if tasks are on different rows
                        if (fromIndex !== toIndex) {
                            // Horizontal segment from 'fromTask' end
                            lines.push({ x1, y1, x2: x1 + CELL_WIDTH / 2, y2: y1 });
                            // Vertical segment
                            lines.push({ x1: x1 + CELL_WIDTH / 2, y1: y1, x2: x1 + CELL_WIDTH / 2, y2: y2 });
                            // Horizontal segment to 'toTask' start
                            lines.push({ x1: x1 + CELL_WIDTH / 2, y1: y2, x2: x2, y2: y2 });
                        } else {
                            // Direct line for tasks on the same row (less common for FS)
                            lines.push({ x1, y1, x2, y2 });
                        }
                    }
                });
            }
        });
        return lines;
    }, [tasks, positionedTasks, CELL_WIDTH, ROW_HEIGHT]);


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

    // --- Task CRUD Operations ---
    const handleAddTask = (formData) => {
        const newTask = {
            id: `t${tasks.length + 1}-${Date.now()}`, // Unique ID
            name: formData.name,
            startDate: formData.startDate,
            endDate: formData.endDate,
            progress: Number(formData.progress),
            status: formData.status,
            assignedTo: formData.assignedTo,
            milestone: formData.milestone === 'true',
            dependsOn: formData.dependsOn || [],
        };
        setTasks(prev => [...prev, newTask]);
        setShowTaskModal(false);
    };

    const handleEditTask = (formData) => {
        setTasks(prev => prev.map(task =>
            task.id === formData.id
                ? {
                    ...task,
                    name: formData.name,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    progress: Number(formData.progress),
                    status: formData.status,
                    assignedTo: formData.assignedTo,
                    milestone: formData.milestone === 'true',
                    dependsOn: formData.dependsOn || [],
                }
                : task
        ));
        setEditingTask(null);
        setShowTaskModal(false);
    };

    const handleDeleteTask = (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setTasks(prev => prev.filter(task => task.id !== taskId));
        }
    };

    // Form fields for Add/Edit Task Modal
    const taskFormFields = useMemo(() => [
        { name: 'name', label: 'Task Name', type: 'text', required: true, placeholder: 'e.g., Develop Feature X', icon: ClipboardList },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true, icon: Calendar },
        { name: 'endDate', label: 'End Date', type: 'date', required: true, icon: Calendar },
        { name: 'progress', label: 'Progress (%)', type: 'number', min: 0, max: 100, required: true, placeholder: '0-100', icon: Info },
        {
            name: 'status', label: 'Status', type: 'select', required: true, icon: CheckCircle,
            options: [
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
                { value: 'on_hold', label: 'On Hold' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'blocked', label: 'Blocked' },
                { value: 'canceled', label: 'Canceled' },
            ]
        },
        { name: 'assignedTo', label: 'Assigned To', type: 'text', placeholder: 'e.g., John Doe', icon: User },
        {
            name: 'milestone', label: 'Is Milestone?', type: 'select', options: [{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }],
            defaultValue: 'false', icon: Star
        },
        {
            name: 'dependsOn', label: 'Depends On (Tasks)', type: 'checkbox-group', icon: LinkIcon,
            options: tasks.filter(t => t.id !== (editingTask ? editingTask.id : null)).map(t => ({
                label: t.name,
                value: t.id
            })),
            // Ensure defaultValue is an array of IDs
            defaultValue: editingTask ? editingTask.dependsOn : [],
        },
    ], [tasks, editingTask]);

    // Removed onDragEnd function as dragging is disabled

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 font-inter text-gray-900 dark:text-gray-100">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <ClipboardList size={32} className="text-blue-600 dark:text-blue-400" /> Project Timeline (Gantt Chart)
            </h2>

            {/* Add New Task Button */}
            <div className="mb-6 flex justify-end">
                <Button variant="primary" onClick={() => { setEditingTask(null); setShowTaskModal(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus size={20} /> Add New Task
                </Button>
            </div>

            {tasks.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                    No tasks available to display in the Gantt Chart. Click "Add New Task" to get started.
                </div>
            )}

            {tasks.length > 0 && (
                <div className="relative overflow-x-auto pb-4 custom-scrollbar">
                    <div className="min-w-[1200px] relative" style={{ width: `${TIMELINE_WIDTH_PX + 200}px` }}> {/* Increased min-width for better spacing */}
                        {/* Task List Header */}
                        <div className="absolute left-0 top-0 w-[200px] h-full pr-2 pt-[40px] z-30 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                            {positionedTasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className={`h-[${ROW_HEIGHT}px] flex items-center justify-end text-sm font-medium pr-2 border-b border-gray-100 dark:border-gray-800 cursor-pointer
                                        ${task.isCritical ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`
                                    }
                                    onDoubleClick={() => { setEditingTask(task); setShowTaskModal(true); }} // Double-click on task name
                                >
                                    {task.name}
                                </div>
                            ))}
                        </div>

                        {/* Timeline Header (Days) */}
                        <div className="ml-[200px] flex bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden border-b border-gray-200 dark:border-gray-700" style={{ width: `${TIMELINE_WIDTH_PX}px` }}>
                            {dayHeaders.map((day, index) => (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 text-center text-xs font-semibold py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0
                                        ${day.isWeekend ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}
                                        ${day.isToday ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 ring-2 ring-blue-400 dark:ring-blue-600' : ''}
                                    `}
                                    style={{ width: `${CELL_WIDTH}px` }}
                                >
                                    {day.label}
                                </div>
                            ))}
                        </div>

                        {/* Chart Area */}
                        <div className="ml-[200px] relative bg-gray-50 dark:bg-gray-800 rounded-b-lg p-2 border-t-0 border border-gray-200 dark:border-gray-700" style={{ height: tasks.length * ROW_HEIGHT + 'px', width: `${TIMELINE_WIDTH_PX}px` }}>
                            {/* Vertical Grid Lines for Days */}
                            {Array.from({ length: totalChartDays }).map((_, i) => (
                                <div
                                    key={`grid-v-${i}`}
                                    className={`absolute top-0 bottom-0 w-px ${dayHeaders[i]?.isWeekend ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'} opacity-50`}
                                    style={{ left: `${i * CELL_WIDTH}px` }}
                                ></div>
                            ))}

                            {/* Today's Line */}
                            {totalChartDays > 0 && (
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-lg animate-pulse"
                                    style={{ left: `${((new Date().getTime() - chartTimelineStart.getTime()) / (1000 * 60 * 60 * 24)) * CELL_WIDTH}px` }}
                                ></div>
                            )}

                            {/* Task Rows */}
                            {positionedTasks.map((task, index) => (
                                <div key={task.id} className="relative flex items-center group" style={{ height: `${ROW_HEIGHT}px` }}>
                                    {/* Task Bar */}
                                    <motion.div
                                        // Removed drag-related props to disable dragging
                                        // Removed onDoubleClick from here as per request
                                        onMouseEnter={(e) => setHoveredTask({ task, x: e.clientX, y: e.clientY })}
                                        onMouseMove={(e) => setHoveredTask(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)}
                                        onMouseLeave={() => setHoveredTask(null)}
                                        className={`absolute h-9 rounded-lg shadow-md flex items-center overflow-hidden transition-all duration-300 ${task.statusClasses} ${task.isCritical ? 'ring-2 ring-red-500' : ''}`}
                                        style={{ left: `${task.leftPx}px`, width: `${task.widthPx}px` }}
                                        title={`Task: ${task.name}\nStatus: ${task.statusText}\nProgress: ${task.progress}%\nAssigned To: ${task.assignedTo || 'N/A'}\nStart: ${task.startDate}\nEnd: ${task.endDate}`}
                                        // Removed whileTap for dragging
                                    >
                                        {/* Progress Bar */}
                                        <div
                                            className="absolute top-0 left-0 h-full bg-black bg-opacity-20 rounded-lg"
                                            style={{ width: `${task.progress}%` }}
                                        ></div>
                                        <span className="relative z-10 text-white text-xs font-semibold px-3 flex items-center gap-1 truncate w-full">
                                            {task.milestone && <Star size={12} fill="currentColor" className="text-yellow-300" />}
                                            {task.statusIcon} {task.name} ({task.progress}%)
                                        </span>
                                    </motion.div>
                                    {/* Action Buttons (Edit/Delete) - visible on hover */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40 bg-white dark:bg-gray-700 p-1 rounded-md shadow-lg">
                                        <Button size="icon" variant="ghost" onClick={() => { setEditingTask(task); setShowTaskModal(true); }} className="p-1">
                                            <Edit size={16} className="text-blue-500" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDeleteTask(task.id)} className="p-1">
                                            <Trash2 size={16} className="text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Dependency Lines (SVG overlay) */}
                            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20" style={{ height: `${tasks.length * ROW_HEIGHT}px`, width: `${TIMELINE_WIDTH_PX}px` }}>
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

            {/* Tooltip */}
            {hoveredTask && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.1 }}
                    className="fixed z-50 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-xl text-sm text-gray-900 dark:text-gray-100 pointer-events-none border border-gray-200 dark:border-gray-600"
                    style={{
                        top: hoveredTask.y + 15,
                        left: hoveredTask.x + 15,
                        maxWidth: 300,
                    }}
                >
                    <p className="font-bold text-base mb-1">{hoveredTask.task.name}</p>
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1"><Calendar size={14} /> Start: {hoveredTask.task.startDate}</p>
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1"><Calendar size={14} /> End: {hoveredTask.task.endDate}</p>
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1"><Info size={14} /> Progress: {hoveredTask.task.progress}%</p>
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1">{hoveredTask.task.statusIcon} Status: {hoveredTask.task.statusText}</p>
                    {hoveredTask.task.assignedTo && <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1"><User size={14} /> Assigned: {hoveredTask.task.assignedTo}</p>}
                    {hoveredTask.task.milestone && <p className="text-yellow-500 flex items-center gap-1"><Star size={14} fill="currentColor" /> Milestone</p>}
                    {hoveredTask.task.dependsOn && hoveredTask.task.dependsOn.length > 0 && (
                        <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1 mt-2">
                            <LinkIcon size={14} /> Depends on: {hoveredTask.task.dependsOn.map(id => tasks.find(t => t.id === id)?.name || id).join(', ')}
                        </p>
                    )}
                    {hoveredTask.task.isCritical && (
                         <p className="text-red-500 font-semibold flex items-center gap-1 mt-2">
                            <AlertCircle size={14} /> On Critical Path
                        </p>
                    )}
                </motion.div>
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
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-500 ring-2 ring-red-500"></div> {/* Placeholder for critical path color */}
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <AlertCircle size={16} className="text-red-500" /> Critical Path Task
                        </span>
                    </div>
                </div>
            </div>

            {/* Add/Edit Task Modal */}
            <ModalWithForm
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onSubmit={editingTask ? handleEditTask : handleAddTask}
                title={editingTask ? `Edit Task: ${editingTask.name}` : 'Add New Task'}
                fields={taskFormFields}
                formData={editingTask || {}}
            />
        </div>
    );
};

export default GanttChart;
