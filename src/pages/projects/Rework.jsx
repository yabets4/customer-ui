import { useState } from 'react';
import { Wrench, AlertTriangle, User } from 'lucide-react';
import ModalWithForm from '../../components/ui/modal'; // Adjust path if needed

const priorities = {
  Critical: 'bg-red-100 text-red-700',
  Normal: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const statusColor = {
  Pending: 'text-yellow-600',
  'In Progress': 'text-blue-600',
  Completed: 'text-green-600',
};

const Rework = () => {
  const [reworks] = useState([
    {
      id: 1,
      reworkId: 'RW-001',
      originalTask: 'Upholstery Task #88',
      product: 'Armchair Frame',
      reason: 'Loose stitching',
      rootCause: 'Operator Error',
      createdBy: 'QC Lily',
      status: 'Pending',
      flagged: true,
      reworkTask: 'Fix #88-R1',
      costImpact: 350,
      dueDate: '2025-07-10',
      assignedTo: 'Abel G.',
      approver: 'PM Daniel',
      estimatedHours: 2,
      priority: 'Critical',
    },
    {
      id: 2,
      reworkId: 'RW-002',
      originalTask: 'Painting Task #64',
      product: 'Dining Chair',
      reason: 'Color mismatch',
      rootCause: 'Wrong paint code',
      createdBy: 'QC Daniel',
      status: 'In Progress',
      flagged: false,
      reworkTask: 'Repaint #64-R',
      costImpact: 200,
      dueDate: '2025-07-09',
      assignedTo: 'Mekdes A.',
      approver: 'QC Lily',
      estimatedHours: 1.5,
      priority: 'Normal',
      actualCost: 150,
    },
  ]);

  const [filters, setFilters] = useState({ status: '', assignedTo: '', due: '' });
  const [selectedRework, setSelectedRework] = useState(null);

  const filtered = reworks.filter((rw) =>
    (!filters.status || rw.status === filters.status) &&
    (!filters.assignedTo || rw.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase())) &&
    (!filters.due || rw.dueDate === filters.due)
  );

  const viewFields = (rw) =>
    Object.entries(rw || {}).map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      name: key,
      type: 'text',
      defaultValue: typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value?.toString(),
      disabled: true,
    }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 flex gap-2 items-center"><Wrench /> Rework Orders</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          placeholder="Search by Employee"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, due: e.target.value })}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Task</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Due</th>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Flag</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rw) => (
              <tr key={rw.id} className="hover:bg-gray-50">
                <td className="p-2 border font-mono">{rw.reworkId}</td>
                <td className="p-2 border">{rw.reworkTask}</td>
                <td className="p-2 border">{rw.product}</td>
                <td className="p-2 border">{rw.reason}</td>
                <td className={`p-2 border`}>
                  <span className={`px-2 py-1 text-xs rounded ${priorities[rw.priority]}`}>
                    {rw.priority}
                  </span>
                </td>
                <td className={`p-2 border font-medium ${statusColor[rw.status]}`}>
                  {rw.status}
                </td>
                <td className="p-2 border">{rw.dueDate}</td>
                <td className="p-2 border flex items-center gap-1">
                  <User size={14} />
                  {rw.assignedTo}
                </td>
                <td className="p-2 border text-center">
                  {rw.flagged ? <AlertTriangle className="text-red-500" size={18} /> : ''}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => setSelectedRework(rw)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalWithForm
        isOpen={!!selectedRework}
        onClose={() => setSelectedRework(null)}
        title={`Rework Details – ${selectedRework?.reworkId}`}
        fields={viewFields(selectedRework)}
        onSubmit={() => {}}
        showSubmit={false}
      />
    </div>
  );
};

export default Rework;
