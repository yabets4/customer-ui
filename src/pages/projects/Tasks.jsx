import { useState } from 'react';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: 'Cutting Panels',
      project: 'SO-1001',
      type: 'Production',
      assignedTo: 'Abel Mekonnen',
      priority: 'High',
      status: 'To Do',
      duration: '2d',
      dependencies: 'None',
    },
    {
      id: 2,
      name: 'Upholstery',
      project: 'SO-1002',
      type: 'Production',
      assignedTo: 'Mekdes Alemu',
      priority: 'Medium',
      status: 'In Progress',
      duration: '3d',
      dependencies: 'Cutting Panels',
    },
    {
      id: 3,
      name: 'Final QC',
      project: 'SO-1002',
      type: 'QC',
      assignedTo: 'QC Officer 1',
      priority: 'Low',
      status: 'To Do',
      duration: '1d',
      dependencies: 'Upholstery',
    },
  ]);

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 All Tasks</h1>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Task Name</th>
            <th className="border p-2">Project</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Assigned To</th>
            <th className="border p-2">Priority</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Duration</th>
            <th className="border p-2">Dependencies</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="border p-2">{task.name}</td>
              <td className="border p-2">{task.project}</td>
              <td className="border p-2">{task.type}</td>
              <td className="border p-2">{task.assignedTo}</td>
              <td className="border p-2">{task.priority}</td>
              <td className="border p-2">{task.status}</td>
              <td className="border p-2">{task.duration}</td>
              <td className="border p-2">{task.dependencies}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:underline text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
