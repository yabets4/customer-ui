import { useState } from 'react';
import { format } from 'date-fns';
import { BadgeCheck, Clock, AlertCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Receivables = () => {
  const [filter, setFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTerms, setEditTerms] = useState('');
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      customer: 'Abebe Furniture Retail',
      invoiceNo: 'INV-1001',
      issueDate: '2024-06-10',
      dueDate: '2024-07-10',
      total: 4500,
      paid: 2000,
      status: 'Partially Paid',
      linkedOrder: 'SO-2201',
      terms: 'Net 30',
      lastReminder: '2024-07-05',
      notes: 'Second reminder sent',
      paymentHistory: [
        { date: '2024-06-15', amount: 2000, method: 'Telebirr' },
      ],
    },
  ]);

  const sendReminder = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              lastReminder: today,
              notes: (inv.notes || '') + `\nReminder sent on ${today}`,
            }
          : inv
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="text-green-600 font-semibold flex items-center gap-1"><BadgeCheck size={14} /> Paid</span>;
      case 'Partially Paid':
        return <span className="text-yellow-600 font-semibold flex items-center gap-1"><Clock size={14} /> Partially Paid</span>;
      case 'Unpaid':
        return <span className="text-red-600 font-semibold flex items-center gap-1"><AlertCircle size={14} /> Unpaid</span>;
      default:
        return status;
    }
  };

  const filteredInvoices = invoices.filter((inv) =>
    filter === 'All' ? true : inv.status === filter
  );

  const totalOutstanding = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.total - inv.paid),
    0
  );

  const totalOverdue = filteredInvoices.reduce((sum, inv) => {
    const isOverdue = new Date(inv.dueDate) < new Date() && inv.paid < inv.total;
    return isOverdue ? sum + (inv.total - inv.paid) : sum;
  }, 0);

  const saveInvoiceEdits = () => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? { ...inv, notes: editNotes, terms: editTerms }
          : inv
      )
    );
    setSelectedInvoice(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📥 Accounts Receivable</h1>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium">Filter by Status:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {["All", "Paid", "Partially Paid", "Unpaid"].map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-6 mb-4">
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm">
          Total Outstanding: <strong>ETB {totalOutstanding.toLocaleString()}</strong>
        </div>
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded shadow text-sm">
          Overdue: <strong>ETB {totalOverdue.toLocaleString()}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Invoice No</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Outstanding</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border cursor-pointer" onClick={() => {
                  setSelectedInvoice(inv);
                  setEditNotes(inv.notes);
                  setEditTerms(inv.terms);
                }}>{inv.customer}</td>
                <td className="p-2 border">{inv.invoiceNo}</td>
                <td className="p-2 border">{format(new Date(inv.dueDate), 'yyyy-MM-dd')}</td>
                <td className="p-2 border">ETB {(inv.total - inv.paid).toLocaleString()}</td>
                <td className="p-2 border">{getStatusBadge(inv.status)}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
                    onClick={() => sendReminder(inv.id)}
                  >
                    <Send size={14} /> Reminder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-xl p-6 rounded shadow-lg relative"
            >
              <button className="absolute top-2 right-2" onClick={() => setSelectedInvoice(null)}>
                <X size={18} />
              </button>
              <h2 className="text-xl font-bold mb-2">Invoice Detail - {selectedInvoice.invoiceNo}</h2>
              <p><strong>Customer:</strong> {selectedInvoice.customer}</p>
              <p><strong>Issue Date:</strong> {selectedInvoice.issueDate}</p>
              <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
              <div className="mt-2">
                <label className="text-sm font-medium block mb-1">Terms:</label>
                <input
                  value={editTerms}
                  onChange={(e) => setEditTerms(e.target.value)}
                  className="w-full border px-2 py-1 rounded text-sm"
                />
              </div>
              <p className="mt-2"><strong>Total:</strong> ETB {selectedInvoice.total.toLocaleString()}</p>
              <p><strong>Paid:</strong> ETB {selectedInvoice.paid.toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedInvoice.status}</p>
              <div className="mt-2">
                <label className="text-sm font-medium block mb-1">Notes:</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full border px-2 py-1 rounded text-sm"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  onClick={saveInvoiceEdits}
                >
                  Save Changes
                </button>
                <button
                  className="bg-gray-300 px-3 py-1 rounded text-sm"
                  onClick={() => setSelectedInvoice(null)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Receivables;
