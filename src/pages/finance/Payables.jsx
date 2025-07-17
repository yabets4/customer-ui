import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const mockPayables = [
  {
    id: 1,
    supplier: 'Wosen Wood Supply',
    invoiceNo: 'SUP-9001',
    amount: 7200,
    dueDate: '2024-07-09',
    status: 'Due',
    amountPaid: 0,
    paymentMethod: '',
    invoiceDate: '2024-06-09',
    poRef: 'PO-1003',
    type: 'Vendor Invoice',
    attachment: null,
  },
  {
    id: 2,
    supplier: 'Zewdu Fabrics',
    invoiceNo: 'SUP-9002',
    amount: 3100,
    dueDate: '2024-07-15',
    status: 'Upcoming',
    amountPaid: 0,
    paymentMethod: '',
    invoiceDate: '2024-06-20',
    poRef: '',
    type: 'Recurring Payment',
    attachment: null,
  },
];

const statusColor = {
  Paid: 'text-green-600',
  Due: 'text-red-600',
  Upcoming: 'text-yellow-600',
  Overdue: 'text-red-700',
  'Partially Paid': 'text-orange-500',
};

export default function Payables() {
  const [payables, setPayables] = useState(mockPayables);
  const [selected, setSelected] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('');
  const [payRef, setPayRef] = useState('');
  const [filter, setFilter] = useState({ supplier: '', status: '' });
  const [file, setFile] = useState(null);

  const openModal = (payable) => {
    setSelected(payable);
    setPayAmount('');
    setPayMethod('');
    setPayRef('');
    setFile(null);
  };
  const closeModal = () => setSelected(null);

  const updatePayment = () => {
    setPayables((prev) =>
      prev.map((p) => {
        if (p.id === selected.id) {
          const newPaid = p.amountPaid + Number(payAmount);
          const newStatus =
            newPaid >= p.amount ? 'Paid' : newPaid > 0 ? 'Partially Paid' : p.status;
          return {
            ...p,
            amountPaid: newPaid,
            status: newStatus,
            paymentMethod: payMethod,
            paymentRef: payRef,
            attachment: file?.name || p.attachment,
          };
        }
        return p;
      })
    );
    closeModal();
  };

  const today = dayjs();
  const getStatus = (p) => {
    if (p.status === 'Paid' || p.status === 'Partially Paid') return p.status;
    const due = dayjs(p.dueDate);
    if (due.isBefore(today)) return 'Overdue';
    if (due.diff(today, 'day') <= 3) return 'Due Soon';
    return p.status;
  };

  const filteredPayables = payables.filter((p) => {
    const matchSupplier = p.supplier.toLowerCase().includes(filter.supplier.toLowerCase());
    const matchStatus = filter.status ? getStatus(p) === filter.status : true;
    return matchSupplier && matchStatus;
  });

  const totalOutstanding = payables.reduce(
    (sum, p) => (p.status !== 'Paid' ? sum + (p.amount - p.amountPaid) : sum),
    0
  );
  const totalDue = payables.reduce(
    (sum, p) => (getStatus(p) === 'Due' ? sum + (p.amount - p.amountPaid) : sum),
    0
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">📤 Payables (Accounts Payable)</h1>
        <p className="text-sm text-gray-500">
          Track unpaid bills, reimbursements, and vendor liabilities
        </p>
      </div>

      <div className="flex gap-4">
        <input
          placeholder="Filter by Supplier"
          value={filter.supplier}
          onChange={(e) => setFilter({ ...filter, supplier: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="Due">Due</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Overdue">Overdue</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <div className="flex gap-6 text-sm">
        <div className="bg-white border shadow p-4 rounded-xl">
          <p>Total Outstanding</p>
          <p className="text-lg font-bold text-red-600">
            ETB {totalOutstanding.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border shadow p-4 rounded-xl">
          <p>Total Due</p>
          <p className="text-lg font-bold text-yellow-600">
            ETB {totalDue.toLocaleString()}
          </p>
        </div>
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Invoice No</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Due Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayables.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.supplier}</td>
              <td className="p-2 border">{p.invoiceNo}</td>
              <td className="p-2 border">ETB {p.amount.toLocaleString()}</td>
              <td className="p-2 border">{p.dueDate}</td>
              <td className={`p-2 border font-medium ${statusColor[getStatus(p)]}`}>
                {getStatus(p)}
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => openModal(p)}
                  className="text-blue-600 hover:underline text-xs"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4"
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
            >
              <h2 className="text-lg font-bold mb-2">Invoice Details</h2>
              <div className="text-sm space-y-1">
                <p><strong>Supplier:</strong> {selected.supplier}</p>
                <p><strong>Invoice No:</strong> {selected.invoiceNo}</p>
                <p><strong>Type:</strong> {selected.type}</p>
                <p><strong>Invoice Date:</strong> {selected.invoiceDate}</p>
                <p><strong>Due Date:</strong> {selected.dueDate}</p>
                <p><strong>Amount:</strong> ETB {selected.amount.toLocaleString()}</p>
                <p><strong>Paid:</strong> ETB {selected.amountPaid?.toLocaleString() || 0}</p>
                <p><strong>Status:</strong> {selected.status}</p>
                <p><strong>PO Ref:</strong> {selected.poRef || '-'}</p>
                {selected.attachment && <p><strong>Attachment:</strong> {selected.attachment}</p>}
              </div>
              {getStatus(selected) !== 'Paid' && (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Amount to Pay"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="border p-2 w-full rounded"
                  />
                  <input
                    type="text"
                    placeholder="Payment Method (Bank, Cash...)"
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="border p-2 w-full rounded"
                  />
                  <input
                    type="text"
                    placeholder="Payment Reference"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    className="border p-2 w-full rounded"
                  />
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full"
                  />
                  <button
                    onClick={updatePayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                  >
                    💰 Submit Payment
                  </button>
                </div>
              )}
              <button
                onClick={closeModal}
                className="text-sm text-gray-500 hover:text-gray-700 w-full mt-2"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
