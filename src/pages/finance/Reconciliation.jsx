import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2, X } from 'lucide-react';

const Reconciliation = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: 'CBE Main Account',
      type: 'Bank',
      internalBalance: 125000,
      bankStatementBalance: 124500,
      lastReconciled: '2025-06-30',
      notes: 'ETB 500 fee not recorded internally',
    },
    {
      id: 2,
      name: 'Petty Cash',
      type: 'Cash',
      internalBalance: 22000,
      bankStatementBalance: 22000,
      lastReconciled: '2025-06-28',
      notes: '',
    },
  ]);

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'Bank',
    internalBalance: '',
    bankStatementBalance: '',
    lastReconciled: '',
    notes: '',
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = () => {
    const id = accounts.length + 1;
    setAccounts([
      ...accounts,
      {
        ...newAccount,
        id,
        internalBalance: Number(newAccount.internalBalance),
        bankStatementBalance: Number(newAccount.bankStatementBalance),
      },
    ]);
    setNewAccount({
      name: '',
      type: 'Bank',
      internalBalance: '',
      bankStatementBalance: '',
      lastReconciled: '',
      notes: '',
    });
    setIsOpen(false);
  };

  const handleDelete = (id) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  const getStatus = (acc) => {
    const diff = acc.internalBalance - acc.bankStatementBalance;
    if (Math.abs(diff) < 0.01) return '✅ Matched';
    if (diff > 0) return `⚠️ Over by ETB ${diff.toFixed(2)}`;
    return `❗ Under by ETB ${Math.abs(diff).toFixed(2)}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">🏦 Cash & Bank Reconciliation</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add Account
        </button>
      </div>

      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Account</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Internal Balance</th>
              <th className="border p-2">Bank Statement</th>
              <th className="border p-2">Last Reconciled</th>
              <th className="border p-2">Notes</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id}>
                <td className="border p-2 font-medium">{acc.name}</td>
                <td className="border p-2">{acc.type}</td>
                <td className="border p-2 text-green-700">ETB {acc.internalBalance}</td>
                <td className="border p-2 text-blue-700">ETB {acc.bankStatementBalance}</td>
                <td className="border p-2">{acc.lastReconciled}</td>
                <td className="border p-2 text-sm">{acc.notes}</td>
                <td className="border p-2 font-semibold">{getStatus(acc)}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="text-red-500 hover:underline text-xs flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Custom Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
                <h2 className="text-lg font-bold mb-4">➕ Add Reconciliation Account</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="border p-2"
                    placeholder="Account Name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                  <select
                    className="border p-2"
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                  >
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </select>
                  <input
                    type="number"
                    className="border p-2"
                    placeholder="Internal Balance"
                    value={newAccount.internalBalance}
                    onChange={(e) => setNewAccount({ ...newAccount, internalBalance: e.target.value })}
                  />
                  <input
                    type="number"
                    className="border p-2"
                    placeholder="Bank Statement Balance"
                    value={newAccount.bankStatementBalance}
                    onChange={(e) => setNewAccount({ ...newAccount, bankStatementBalance: e.target.value })}
                  />
                  <input
                    type="date"
                    className="border p-2"
                    placeholder="Last Reconciled"
                    value={newAccount.lastReconciled}
                    onChange={(e) => setNewAccount({ ...newAccount, lastReconciled: e.target.value })}
                  />
                  <input
                    className="border p-2"
                    placeholder="Notes"
                    value={newAccount.notes}
                    onChange={(e) => setNewAccount({ ...newAccount, notes: e.target.value })}
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reconciliation;
