// src/pages/hr/ToolAssignments.jsx
import { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  AlertTriangle,
  Undo2,
  Eye,
  Search,
  Trash2,
} from 'lucide-react';

const mockAssignments = [
  {
    id: 1,
    employee: 'Abebe Kebede',
    employeeId: 'EMP001',
    tool: 'Cordless Drill',
    toolId: 'TL001',
    assignedBy: 'Supervisor A',
    assignedDate: '2025-06-01',
    expectedReturnDate: '2025-07-01',
    returnDate: null,
    condition: 'Good',
    status: 'In Use',
    remarks: '',
    deducted: false,
  },
  {
    id: 2,
    employee: 'Mekdes Tsegaye',
    employeeId: 'EMP002',
    tool: 'Measuring Tape',
    toolId: 'TL002',
    assignedBy: 'Supervisor B',
    assignedDate: '2025-05-20',
    expectedReturnDate: '2025-06-20',
    returnDate: '2025-06-28',
    condition: 'Fair',
    status: 'Returned',
    remarks: 'Late return, slight wear.',
    deducted: false,
  },
  {
    id: 3,
    employee: 'Fikadu Dinku',
    employeeId: 'EMP003',
    tool: 'Welding Mask',
    toolId: 'TL005',
    assignedBy: 'Supervisor A',
    assignedDate: '2025-06-10',
    expectedReturnDate: '2025-06-30',
    returnDate: null,
    condition: 'Good',
    status: 'Overdue',
    remarks: '',
    deducted: false,
  },
];

const statusColors = {
  'In Use': 'bg-yellow-100 text-yellow-700',
  Returned: 'bg-green-100 text-green-700',
  Overdue: 'bg-red-100 text-red-700',
  Lost: 'bg-gray-100 text-gray-800',
};

export default function ToolAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [form, setForm] = useState({});
  const [lostForm, setLostForm] = useState({});
  const [selectedLostId, setSelectedLostId] = useState(null);

  useEffect(() => {
    setAssignments(mockAssignments);
  }, []);

  const filtered = assignments.filter((a) =>
    a.employee.toLowerCase().includes(search.toLowerCase()) ||
    a.tool.toLowerCase().includes(search.toLowerCase())
  );

  const overdueAlerts = assignments.filter(
    (a) =>
      a.status === 'Overdue' ||
      (a.status === 'In Use' && new Date(a.expectedReturnDate) < new Date())
  );

  const handleAssign = () => {
    const newAssignment = {
      id: assignments.length + 1,
      employee: form.employee,
      employeeId: `EMP${100 + assignments.length + 1}`,
      tool: form.tool,
      toolId: `TL${100 + assignments.length + 1}`,
      assignedBy: form.assignedBy,
      assignedDate: form.assignedDate,
      expectedReturnDate: form.expectedReturnDate,
      returnDate: null,
      condition: 'Good',
      status: 'In Use',
      remarks: '',
      deducted: false,
    };
    setAssignments([...assignments, newAssignment]);
    setForm({});
    setShowAssignModal(false);
  };

  const openLostModal = (id) => {
    setSelectedLostId(id);
    setLostForm({ condition: '', amount: '' });
    setShowLostModal(true);
  };

  const handleReportLost = () => {
    const updated = assignments.map((a) => {
      if (a.id === selectedLostId) {
        console.log(`Payroll Deduction Triggered: ${a.employee} - ETB ${lostForm.amount}`);
        return {
          ...a,
          status: 'Lost',
          remarks: `Tool reported lost. ETB ${lostForm.amount} will be deducted.`,
          condition: lostForm.condition,
          deducted: true,
          lossValue: parseFloat(lostForm.amount),
        };
      }
      return a;
    });
    setAssignments(updated);
    setShowLostModal(false);
  };

  return (
    <div className="p-6">
      {overdueAlerts.length > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <p>
            <strong>Attention:</strong> {overdueAlerts.length} tool(s) are overdue.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6" /> Tool Assignments
        </h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-2 py-2 border rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Assign Tool
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Employee</th>
              <th className="p-2 border">Tool</th>
              <th className="p-2 border">Issued By</th>
              <th className="p-2 border">Issue Date</th>
              <th className="p-2 border">Expected Return</th>
              <th className="p-2 border">Return Date</th>
              <th className="p-2 border">Condition</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <a href={`/hr/employees/${a.employeeId}`} className="text-blue-600 hover:underline">
                    {a.employee}
                  </a>
                </td>
                <td className="p-2 border">{a.tool}</td>
                <td className="p-2 border">{a.assignedBy}</td>
                <td className="p-2 border">{a.assignedDate}</td>
                <td className="p-2 border">{a.expectedReturnDate || '-'}</td>
                <td className="p-2 border">{a.returnDate || '-'}</td>
                <td className="p-2 border">{a.condition}</td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-2 border flex flex-col gap-1">
                  {(a.status === 'In Use' || a.status === 'Overdue') && (
                    <>
                      <button className="text-green-600 text-xs flex items-center gap-1 hover:underline">
                        <Undo2 className="w-4 h-4" /> Mark Returned
                      </button>
                      {!a.deducted && (
                        <button
                          className="text-red-600 text-xs flex items-center gap-1 hover:underline"
                          onClick={() => openLostModal(a.id)}
                        >
                          <AlertTriangle className="w-4 h-4" /> Report Lost
                        </button>
                      )}
                    </>
                  )}
                  {a.status === 'Returned' || a.status === 'Lost' ? (
                    <button className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
                      <Eye className="w-4 h-4" /> View
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-semibold">Assign New Tool</h2>
            <input
              type="text"
              placeholder="Employee Name"
              className="w-full border p-2 rounded"
              value={form.employee || ''}
              onChange={(e) => setForm({ ...form, employee: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tool Name"
              className="w-full border p-2 rounded"
              value={form.tool || ''}
              onChange={(e) => setForm({ ...form, tool: e.target.value })}
            />
            <input
              type="text"
              placeholder="Assigned By"
              className="w-full border p-2 rounded"
              value={form.assignedBy || ''}
              onChange={(e) => setForm({ ...form, assignedBy: e.target.value })}
            />
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={form.assignedDate || ''}
              onChange={(e) => setForm({ ...form, assignedDate: e.target.value })}
            />
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={form.expectedReturnDate || ''}
              onChange={(e) => setForm({ ...form, expectedReturnDate: e.target.value })}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button onClick={handleAssign} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lost Modal */}
      {showLostModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-semibold">Report Lost Tool</h2>
            <textarea
              placeholder="Condition & notes"
              className="w-full border p-2 rounded"
              rows={3}
              value={lostForm.condition}
              onChange={(e) => setLostForm({ ...lostForm, condition: e.target.value })}
            />
            <input
              type="number"
              placeholder="Loss value (ETB)"
              className="w-full border p-2 rounded"
              value={lostForm.amount}
              onChange={(e) => setLostForm({ ...lostForm, amount: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLostModal(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button onClick={handleReportLost} className="px-4 py-2 bg-red-600 text-white rounded-md">
                Confirm & Deduct
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
