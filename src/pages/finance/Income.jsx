import { useState } from 'react';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';

export default function Income() {
  const [incomes, setIncomes] = useState([
    {
      id: 1,
      date: '2024-06-30',
      incomeType: 'Sales Income',
      description: 'Order #112 - Sofa Set',
      amount: 8200,
      method: 'Telebirr',
      project: 'Project #001',
      customerTag: 'VIP',
      channelTag: 'TikTok',
    },
    {
      id: 2,
      date: '2024-07-01',
      incomeType: 'Sales Income',
      description: 'Custom Table Sale',
      amount: 4200,
      method: 'Cash',
      project: 'Walk-in',
      customerTag: 'Walk-in',
      channelTag: 'Walk-in',
    },
  ]);

  const [newIncome, setNewIncome] = useState({
    date: '',
    incomeType: '',
    description: '',
    amount: '',
    method: '',
    project: '',
    customerTag: '',
    channelTag: '',
  });

  const [editingIncome, setEditingIncome] = useState(null);

  const mockTags = {
    incomeTypes: ['Sales Income', 'Service Income', 'Rental Income', 'Gift Card', 'Other'],
    customers: ['VIP', 'Online', 'Referral', 'Walk-in'],
    channels: ['TikTok', 'Walk-in', 'Website'],
  };

  const handleAdd = () => {
    const id = incomes.length + 1;
    setIncomes([
      ...incomes,
      { id, ...newIncome, amount: Number(newIncome.amount) },
    ]);
    setNewIncome({
      date: '',
      incomeType: '',
      description: '',
      amount: '',
      method: '',
      project: '',
      customerTag: '',
      channelTag: '',
    });
  };

  const handleDelete = (id) => {
    setIncomes(incomes.filter((i) => i.id !== id));
  };

  const handleEditSave = () => {
    setIncomes(incomes.map((inc) => inc.id === editingIncome.id ? editingIncome : inc));
    setEditingIncome(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">💰 Income Tracking</h1>

      {/* Add New Income */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Add New Income
        </h2>

        <div className="grid md:grid-cols-4 gap-3 mb-3">
          <input
            type="date"
            className="border p-2 rounded text-sm"
            value={newIncome.date}
            onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })}
          />
          <select
            className="border p-2 rounded text-sm"
            value={newIncome.incomeType}
            onChange={(e) => setNewIncome({ ...newIncome, incomeType: e.target.value })}
          >
            <option value="">Income Type</option>
            {mockTags.incomeTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <input
            placeholder="Amount (ETB)"
            className="border p-2 rounded text-sm"
            type="number"
            value={newIncome.amount}
            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
          />
          <input
            placeholder="Payment Method"
            className="border p-2 rounded text-sm"
            value={newIncome.method}
            onChange={(e) => setNewIncome({ ...newIncome, method: e.target.value })}
          />
          <input
            placeholder="Description"
            className="border p-2 rounded text-sm col-span-2"
            value={newIncome.description}
            onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
          />
          <input
            placeholder="Linked Project/Order"
            className="border p-2 rounded text-sm"
            value={newIncome.project}
            onChange={(e) => setNewIncome({ ...newIncome, project: e.target.value })}
          />
          <select
            className="border p-2 rounded text-sm"
            value={newIncome.customerTag}
            onChange={(e) => setNewIncome({ ...newIncome, customerTag: e.target.value })}
          >
            <option value="">Customer Tag</option>
            {mockTags.customers.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="border p-2 rounded text-sm"
            value={newIncome.channelTag}
            onChange={(e) => setNewIncome({ ...newIncome, channelTag: e.target.value })}
          >
            <option value="">Channel</option>
            {mockTags.channels.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
        >
          Add Income
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded text-sm bg-white shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Method</th>
              <th className="border p-2">Project</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Channel</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((inc) => (
              <tr key={inc.id}>
                <td className="border p-2">{inc.date}</td>
                <td className="border p-2">{inc.incomeType}</td>
                <td className="border p-2">{inc.description}</td>
                <td className="border p-2 font-medium text-green-600">ETB {inc.amount}</td>
                <td className="border p-2">{inc.method}</td>
                <td className="border p-2">{inc.project}</td>
                <td className="border p-2">{inc.customerTag}</td>
                <td className="border p-2">{inc.channelTag}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => setEditingIncome(inc)} className="text-blue-600 hover:underline mr-2 text-xs">
                    <Pencil className="inline w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(inc.id)} className="text-red-600 hover:underline text-xs">
                    <Trash2 className="inline w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingIncome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-all">
          {/* Overlay with blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl p-6 rounded shadow-lg animate-scaleIn z-10">
            <h2 className="text-xl font-bold mb-4">Edit Income</h2>
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <input
                type="date"
                className="border p-2 rounded text-sm"
                value={editingIncome.date}
                onChange={(e) => setEditingIncome({ ...editingIncome, date: e.target.value })}
              />
              <select
                className="border p-2 rounded text-sm"
                value={editingIncome.incomeType}
                onChange={(e) => setEditingIncome({ ...editingIncome, incomeType: e.target.value })}
              >
                <option value="">Income Type</option>
                {mockTags.incomeTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              <input
                className="border p-2 rounded text-sm"
                type="number"
                value={editingIncome.amount}
                onChange={(e) => setEditingIncome({ ...editingIncome, amount: Number(e.target.value) })}
              />
              <input
                className="border p-2 rounded text-sm"
                value={editingIncome.method}
                onChange={(e) => setEditingIncome({ ...editingIncome, method: e.target.value })}
              />
              <input
                className="border p-2 rounded text-sm"
                value={editingIncome.description}
                onChange={(e) => setEditingIncome({ ...editingIncome, description: e.target.value })}
              />
              <input
                className="border p-2 rounded text-sm"
                value={editingIncome.project}
                onChange={(e) => setEditingIncome({ ...editingIncome, project: e.target.value })}
              />
              <select
                className="border p-2 rounded text-sm"
                value={editingIncome.customerTag}
                onChange={(e) => setEditingIncome({ ...editingIncome, customerTag: e.target.value })}
              >
                <option value="">Customer Tag</option>
                {mockTags.customers.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <select
                className="border p-2 rounded text-sm"
                value={editingIncome.channelTag}
                onChange={(e) => setEditingIncome({ ...editingIncome, channelTag: e.target.value })}
              >
                <option value="">Channel</option>
                {mockTags.channels.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingIncome(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
