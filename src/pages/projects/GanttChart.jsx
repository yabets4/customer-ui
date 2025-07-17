import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import ModalWithForm from "../../components/ui/modal";

const TOTAL_DAYS = 30;
const CELL_WIDTH = 60;
const TIMELINE_WIDTH = TOTAL_DAYS * CELL_WIDTH;

function generateDates(startDate, days) {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getTaskEnd(task) {
  return task.start + task.duration;
}

function computeCriticalPath(tasks) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const adj = new Map();
  tasks.forEach(({ id, dependsOn = [] }) => adj.set(id, dependsOn));
  const memo = new Map();

  function dfs(id) {
    if (memo.has(id)) return memo.get(id);
    const deps = adj.get(id) || [];
    if (deps.length === 0) {
      memo.set(id, getTaskEnd(taskMap.get(id)));
      return getTaskEnd(taskMap.get(id));
    }
    const maxDep = Math.max(...deps.map(dfs));
    const val = Math.max(maxDep, getTaskEnd(taskMap.get(id)));
    memo.set(id, val);
    return val;
  }

  let maxLen = 0;
  tasks.forEach((t) => {
    maxLen = Math.max(maxLen, dfs(t.id));
  });

  const criticalTasks = new Set();
  function markCritical(id) {
    const task = taskMap.get(id);
    if (!task) return false;
    if (getTaskEnd(task) === maxLen) {
      criticalTasks.add(id);
      return true;
    }
    const deps = adj.get(id) || [];
    for (const dep of deps) {
      if (markCritical(dep)) {
        criticalTasks.add(id);
        return true;
      }
    }
    return false;
  }

  tasks.forEach((t) => markCritical(t.id));
  return criticalTasks;
}

function getMinStartForTask(task, tasks) {
  if (!task.dependsOn || task.dependsOn.length === 0) return 0;
  return Math.max(
    ...task.dependsOn.map(
      (depId) =>
        (tasks.find((t) => t.id === depId)?.start ?? 0) +
        (tasks.find((t) => t.id === depId)?.duration ?? 0)
    )
  );
}

const initialTasks = [
  { id: 1, name: "Design", start: 0, duration: 5, progress: 100, milestone: true },
  { id: 2, name: "Procurement", start: 2, duration: 7, progress: 90 },
  { id: 3, name: "Cutting", start: 7, duration: 5, progress: 50, dependsOn: [1] },
  { id: 4, name: "Assembly", start: 12, duration: 6, progress: 10, dependsOn: [3] },
  { id: 5, name: "Polishing", start: 18, duration: 4, progress: 0, milestone: true, dependsOn: [4] },
  { id: 6, name: "Packaging", start: 11, duration: 3, progress: 0 },
];

export default function CalendarGanttChart() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const dates = useMemo(() => generateDates(today, TOTAL_DAYS), [today]);
  const criticalTasks = useMemo(() => computeCriticalPath(tasks), [tasks]);

  const onDragEnd = (taskId, info) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const minStart = getMinStartForTask(t, prev);
          let newStart = Math.round(info.point.x / CELL_WIDTH);
          newStart = Math.max(minStart, Math.min(newStart, TOTAL_DAYS - t.duration));
          return { ...t, start: newStart };
        }
        return t;
      })
    );
  };

  const addTask = () => {
    if (!newTaskName.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: newTaskName.trim(),
        start: 0,
        duration: Math.min(Math.max(1, Number(newTaskDuration)), TOTAL_DAYS),
        progress: 0,
      },
    ]);
    setNewTaskName("");
    setNewTaskDuration(1);
  };

  const updateTask = (updated) => {
    const minStart = getMinStartForTask(updated, tasks);
    updated.start = Math.max(minStart, updated.start);
    updated.start = Math.min(TOTAL_DAYS - updated.duration, updated.start);
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...updated } : t))
    );
    setEditingTask(null);
  };

  const getFieldsForTask = (task) => [
    {
      label: "Name",
      name: "name",
      type: "text",
      required: true,
      defaultValue: task.name,
    },
    {
      label: `Start Day (min ${getMinStartForTask(task, tasks)})`,
      name: "start",
      type: "number",
      required: true,
      defaultValue: task.start,
      min: getMinStartForTask(task, tasks),
      max: TOTAL_DAYS,
    },
    {
      label: "Duration",
      name: "duration",
      type: "number",
      required: true,
      defaultValue: task.duration,
      min: 1,
      max: TOTAL_DAYS,
    },
    {
      label: "Progress (%)",
      name: "progress",
      type: "number",
      defaultValue: task.progress,
      min: 0,
      max: 100,
    },
    {
      label: "Dependencies",
      name: "dependsOn",
      type: "checkbox-group",
      options: tasks.filter((t) => t.id !== task.id).map((t) => ({
        label: t.name,
        value: t.id,
      })),
      defaultValue: task.dependsOn || [],
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900">
      <div className="max-w-full mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl min-h-[700px]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          🪑 Furniture Project Gantt Chart (Calendar + Scrollable + Dependencies)
        </h1>

        {/* Timeline */}
        <div className="overflow-x-auto border-b border-gray-300 dark:border-gray-700 pb-4">
          <div className="flex items-center" style={{ minWidth: TIMELINE_WIDTH + 200 }}>
            <div className="w-[200px] flex-shrink-0 font-semibold text-gray-600 dark:text-gray-300">
              Task
            </div>
            {dates.map((date, i) => (
              <div
                key={i}
                className="text-center text-xs sm:text-sm w-[60px] border-l border-gray-300 dark:border-gray-700"
              >
                {formatDate(date)}
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="mt-2 space-y-3">
            {tasks.map((task) => {
              const barLeft = task.start * CELL_WIDTH;
              const barWidth = task.duration * CELL_WIDTH;
              const isCritical = criticalTasks.has(task.id);
              return (
                <div
                  key={task.id}
                  className="flex items-center"
                  style={{ minWidth: TIMELINE_WIDTH + 200, height: 40 }}
                >
                  <div
                    className="w-[200px] text-gray-700 dark:text-gray-100 font-medium cursor-pointer"
                    onDoubleClick={() => setEditingTask(task)}
                    onMouseEnter={(e) =>
                      setHoveredTask({ task, x: e.clientX, y: e.clientY })
                    }
                    onMouseMove={(e) =>
                      setHoveredTask({ task, x: e.clientX, y: e.clientY })
                    }
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {task.name} {task.milestone && "⭐"}
                  </div>

                  <div className="relative flex-grow" style={{ height: 40 }}>
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: TIMELINE_WIDTH - barWidth }}
                      dragElastic={0.2}
                      dragMomentum={false}
                      onDragEnd={(e, info) => onDragEnd(task.id, info)}
                      style={{
                        width: barWidth,
                        height: 40,
                        backgroundColor: isCritical ? "#dc2626" : "#2563eb",
                        borderRadius: 6,
                        cursor: "grab",
                        x: barLeft,
                        userSelect: "none",
                        position: "absolute",
                        top: 0,
                      }}
                      whileTap={{ cursor: "grabbing" }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
                        {task.duration}d
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredTask && (
          <div
            className="fixed z-50 bg-white dark:bg-gray-800 p-3 rounded shadow text-sm text-gray-900 dark:text-gray-100 pointer-events-none"
            style={{
              top: hoveredTask.y + 15,
              left: hoveredTask.x + 15,
              maxWidth: 300,
            }}
          >
            <strong>{hoveredTask.task.name}</strong>
            <br />
            Start: {formatDate(new Date(today.getTime() + hoveredTask.task.start * 86400000))}
            <br />
            Duration: {hoveredTask.task.duration} day(s)
            <br />
            Progress: {hoveredTask.task.progress}%
            <br />
            {hoveredTask.task.dependsOn?.length
              ? `Depends on: ${hoveredTask.task.dependsOn.join(", ")}`
              : "No dependencies"}
            <br />
            {hoveredTask.task.milestone && "⭐ Milestone"}
          </div>
        )}

        {/* Add Task */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Add New Task</h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <input
              type="text"
              placeholder="Task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex-grow"
            />
            <input
              type="number"
              min={1}
              max={TOTAL_DAYS}
              value={newTaskDuration}
              onChange={(e) => setNewTaskDuration(e.target.value)}
              className="w-24 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
            <Button onClick={addTask} size="md" variant="solid">
              Add Task
            </Button>
          </div>
        </div>

        {/* Edit Task Modal */}
        <ModalWithForm
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={updateTask}
          title={`Edit Task: ${editingTask?.name}`}
          fields={editingTask ? getFieldsForTask(editingTask) : []}
        />
      </div>
    </div>
  );
}
