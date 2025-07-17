// Payments.jsx (Enhanced)
import { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';

const methodIcons = {
  Cash: '💵',
  Telebirr: '📱',
  'Bank Transfer': '🏦',
};

const Payments = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      date: '2024-07-02',
      type: 'Incoming',
      method: 'Telebirr',
      amount: 8200,
      reference: 'INV-1001',
      customer: 'John Doe',
      status: 'Paid',
      linkedTo: 'Invoice',
      linkedId: 'INV-1001',
      bankAccount: '',
      note: '50% upfront',
    },
    {
      id: 2,
      date: '2024-07-03',
      type: 'Outgoing',
      method: 'Bank Transfer',
      amount: 4500,
      reference: 'SUP-9001',
      customer: 'ABC Supplies',
      status: 'Unpaid',
      linkedTo: 'Expense',
      linkedId: 'EXP-0921',
      bankAccount: 'CBE #9283',
      note: '',
    },
  ]);

  const [filter, setFilter] = useState('');
  const [newPayment, setNewPayment] = useState({
    date: '',
    type: 'Incoming',
    method: '',
    amount: '',
    reference: '',
    customer: '',
    status: 'Unpaid',
    linkedTo: '',
    linkedId: '',
    bankAccount: '',
    note: '',
  });

  const handleAdd = () => {
    const id = payments.length + 1;
    setPayments([
      ...payments,
      { ...newPayment, id, amount: Number(newPayment.amount) },
    ]);
    setNewPayment({
      date: '',
      type: 'Incoming',
      method: '',
      amount: '',
      reference: '',
      customer: '',
      status: 'Unpaid',
      linkedTo: '',
      linkedId: '',
      bankAccount: '',
      note: '',
    });
  };

  const handleDelete = (id) => {
    setPayments(payments.filter((p) => p.id !== id));
  };

  const filteredPayments = payments.filter((p) =>
    p.reference.toLowerCase().includes(filter.toLowerCase()) ||
    p.customer.toLowerCase().includes(filter.toLowerCase()) ||
    p.status.toLowerCase().includes(filter.toLowerCase()) ||
    p.method.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">💳 Payments Management</h1>
        <div className="flex items-center border px-2 py-1 rounded bg-white shadow-sm">
          <Search className="mr-1 text-gray-400" size={16} />
          <input
            className="outline-none text-sm"
            placeholder="Search payments..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-6 gap-3">
        <input type="date" className="border p-2 rounded" value={newPayment.date} onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })} />
        <select className="border p-2 rounded" value={newPayment.type} onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}>
          <option>Incoming</option>
          <option>Outgoing</option>
        </select>
        <input className="border p-2 rounded" placeholder="Method (e.g. Telebirr)" value={newPayment.method} onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Amount" value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} />
        <select className="border p-2 rounded" value={newPayment.status} onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}>
          <option>Unpaid</option>
          <option>Partially Paid</option>
          <option>Paid</option>
          <option>Overpaid</option>
          <option>Refunded</option>
        </select>
        <button onClick={handleAdd} className="bg-green-600 text-white flex items-center justify-center px-4 py-2 rounded hover:bg-green-700">
          <Plus className="mr-1" size={16} /> Add
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-3">
        <input className="border p-2 rounded" placeholder="Reference (Invoice/Supplier)" value={newPayment.reference} onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Customer/Supplier" value={newPayment.customer} onChange={(e) => setNewPayment({ ...newPayment, customer: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Linked Entity (Invoice/Expense)" value={newPayment.linkedTo} onChange={(e) => setNewPayment({ ...newPayment, linkedTo: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Linked ID (INV-1234)" value={newPayment.linkedId} onChange={(e) => setNewPayment({ ...newPayment, linkedId: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Bank Account (if any)" value={newPayment.bankAccount} onChange={(e) => setNewPayment({ ...newPayment, bankAccount: e.target.value })} />
        <input className="border p-2 rounded col-span-full" placeholder="Note (optional)" value={newPayment.note} onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })} />
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Method</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Reference</th>
              <th className="border p-2 text-left">Linked</th>
              <th className="border p-2 text-left">Customer/Supplier</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Note</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id} className="even:bg-gray-50">
                <td className="border p-2">{p.date}</td>
                <td className="border p-2">{p.type}</td>
                <td className="border p-2">{methodIcons[p.method] || ''} {p.method}</td>
                <td className="border p-2">ETB {p.amount.toLocaleString()}</td>
                <td className="border p-2">{p.reference}</td>
                <td className="border p-2">{p.linkedTo} {p.linkedId}</td>
                <td className="border p-2">{p.customer}</td>
                <td className="border p-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    p.status === 'Paid' ? 'bg-green-100 text-green-700'
                    : p.status === 'Unpaid' ? 'bg-red-100 text-red-700'
                    : p.status === 'Refunded' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
                </td>
                <td className="border p-2 text-xs italic text-gray-500">{p.note}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-400">No payments match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;