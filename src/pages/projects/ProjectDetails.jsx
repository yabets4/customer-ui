import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const mockProjects = [
  {
    id: '1',
    name: 'Sofa Delivery - Order #101',
    type: 'Sales Order',
    customer: 'John Doe',
    salesOrderRef: 'SO101',
    location: 'Main Workshop',
    startDate: '2025-07-01',
    endDate: '2025-07-10',
    manager: 'Amanuel G',
    status: 'In Progress',
    budget: 12000,
    notes: 'Customer prefers light oak finish.',
    attachments: ['design.pdf', 'site-plan.jpg'],
    tasks: [
      {
        id: 'T1',
        name: 'Cutting',
        assignedTo: 'Staff A',
        duration: '2 days',
        status: 'Done',
        dependencies: [],
      },
      {
        id: 'T2',
        name: 'Assembling',
        assignedTo: 'Staff B',
        duration: '3 days',
        status: 'In Progress',
        dependencies: ['T1'],
      },
      {
        id: 'T3',
        name: 'Polishing',
        assignedTo: 'Staff C',
        duration: '2 days',
        status: 'Pending',
        dependencies: ['T2'],
      },
    ],
  },
];

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const found = mockProjects.find((p) => p.id === id);
    setProject(found);
  }, [id]);

  if (!project) return <div className="p-4">Loading project...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📁 Project Details</h1>
      <div className="grid grid-cols-2 gap-4">
        <div><strong>Name:</strong> {project.name}</div>
        <div><strong>Type:</strong> {project.type}</div>
        <div><strong>Customer:</strong> {project.customer}</div>
        <div><strong>Sales Order Ref:</strong> {project.salesOrderRef}</div>
        <div><strong>Location:</strong> {project.location}</div>
        <div><strong>Manager:</strong> {project.manager}</div>
        <div><strong>Status:</strong> {project.status}</div>
        <div><strong>Budget:</strong> ETB {project.budget}</div>
        <div><strong>Start Date:</strong> {project.startDate}</div>
        <div><strong>End Date:</strong> {project.endDate}</div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">📝 Notes</h2>
        <p className="bg-gray-100 p-3 rounded text-sm">{project.notes}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">📎 Attachments</h2>
        <ul className="list-disc list-inside">
          {project.attachments.map((file, i) => (
            <li key={i}>{file}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">🧱 Tasks</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Task</th>
              <th className="border p-2">Assigned</th>
              <th className="border p-2">Duration</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Dependencies</th>
            </tr>
          </thead>
          <tbody>
            {project.tasks.map((t) => (
              <tr key={t.id}>
                <td className="border p-2">{t.name}</td>
                <td className="border p-2">{t.assignedTo}</td>
                <td className="border p-2">{t.duration}</td>
                <td className="border p-2">{t.status}</td>
                <td className="border p-2">{t.dependencies.join(', ') || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectDetails;
