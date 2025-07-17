import { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: '2024-07-01',
      category: 'Raw Materials',
      amount: 5200,
      payee: 'Mekoya Wood Supplier',
      method: 'Bank Transfer',
      project: 'Project #001',
      description: 'Purchased MDF & Plywood',
      department: 'Production',
      location: 'Workshop A',
      employee: 'Yonas',
      status: 'Paid',
    },
    {
      id: 2,
      date: '2024-07-02',
      category: 'Workshop Rent',
      amount: 10000,
      payee: 'Building Owner',
      method: 'Cash',
      project: 'Overhead',
      description: 'Monthly workshop rent',
      department: 'Admin',
      location: 'HQ',
      employee: '',
      status: 'Unpaid',
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    date: '',
    category: '',
    amount: '',
    payee: '',
    method: '',
    project: '',
    description: '',
    department: '',
    location: '',
    employee: '',
    status: 'Unpaid',
    receipt: null,
  });

  const handleAdd = () => {
    const id = expenses.length + 1;
    setExpenses([
      ...expenses,
      {
        id,
        ...newExpense,
        amount: Number(newExpense.amount),
      },
    ]);
    setNewExpense({
      date: '',
      category: '',
      amount: '',
      payee: '',
      method: '',
      project: '',
      description: '',
      department: '',
      location: '',
      employee: '',
      status: 'Unpaid',
      receipt: null,
    });
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📤 Expense Management</h1>

      {/* Add Expense Form */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 space-y-4">
        <h2 className="text-lg font-semibold">Add New Expense</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            ['date', 'Date'],
            ['category', 'Category'],
            ['amount', 'Amount'],
            ['payee', 'Payee'],
            ['method', 'Payment Method'],
            ['project', 'Project'],
            ['department', 'Department'],
            ['location', 'Location'],
            ['employee', 'Employee'],
            ['description', 'Description'],
          ].map(([key, label]) => (
            <input
              key={key}
              type={key === 'amount' ? 'number' : 'text'}
              placeholder={label}
              className="border p-2 rounded text-sm"
              value={newExpense[key]}
              onChange={(e) => setNewExpense({ ...newExpense, [key]: e.target.value })}
            />
          ))}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Receipt</label>
            <input
              type="file"
              className="text-sm"
              onChange={(e) =>
                setNewExpense({ ...newExpense, receipt: e.target.files[0] })
              }
            />
          </div>
          <select
            value={newExpense.status}
            onChange={(e) =>
              setNewExpense({ ...newExpense, status: e.target.value })
            }
            className="border p-2 rounded text-sm"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </div>

      {/* Expense Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Payee</th>
              <th className="border p-2">Method</th>
              <th className="border p-2">Project</th>
              <th className="border p-2">Dept</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Employee</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Status</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td className="border p-2">{exp.date}</td>
                <td className="border p-2">{exp.category}</td>
                <td className="border p-2">ETB {exp.amount}</td>
                <td className="border p-2">{exp.payee}</td>
                <td className="border p-2">{exp.method}</td>
                <td className="border p-2">{exp.project}</td>
                <td className="border p-2">{exp.department}</td>
                <td className="border p-2">{exp.location}</td>
                <td className="border p-2">{exp.employee}</td>
                <td className="border p-2">{exp.description}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      exp.status === 'Paid'
                        ? 'bg-green-100 text-green-600'
                        : exp.status === 'Partially Paid'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {exp.status}
                  </span>
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
