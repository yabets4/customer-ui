import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export default function PayrollFinance() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      employee: 'Abebe Kebede',
      baseSalary: 8000,
      allowances: 1200,
      deductions: 1000,
      pension: 560,
      paye: 800,
      netPay: 7840,
      period: '2025-06',
    },
    {
      id: 2,
      employee: 'Sara W.',
      baseSalary: 12000,
      allowances: 2000,
      deductions: 500,
      pension: 840,
      paye: 1400,
      netPay: 12260,
      period: '2025-06',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    employee: '',
    baseSalary: '',
    allowances: '',
    deductions: '',
    period: '',
  });

  const calculateFields = ({ baseSalary, allowances, deductions }) => {
    const pension = baseSalary * 0.07;
    const gross = baseSalary + allowances;
    const taxable = gross - pension;
    const paye = taxable * 0.1;
    const netPay = gross - deductions - pension - paye;
    return { pension, paye, netPay };
  };

  const handleAdd = () => {
    const id = entries.length + 1;
    const baseSalary = Number(newEntry.baseSalary);
    const allowances = Number(newEntry.allowances);
    const deductions = Number(newEntry.deductions);
    const { pension, paye, netPay } = calculateFields({ baseSalary, allowances, deductions });

    setEntries([
      ...entries,
      {
        id,
        employee: newEntry.employee,
        baseSalary,
        allowances,
        deductions,
        pension,
        paye,
        netPay,
        period: newEntry.period,
      },
    ]);
    setNewEntry({ employee: '', baseSalary: '', allowances: '', deductions: '', period: '' });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const totals = entries.reduce(
    (acc, e) => {
      acc.netPay += e.netPay;
      acc.paye += e.paye;
      acc.pension += e.pension;
      return acc;
    },
    { netPay: 0, paye: 0, pension: 0 }
  );

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📄 Payroll Financial Summary</h1>
        <button onClick={() => setShowModal(true)} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 flex items-center gap-2">
          <Plus size={16} /> Add Entry
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">Employee</th>
              <th className="px-4 py-2">Period</th>
              <th className="px-4 py-2">Base</th>
              <th className="px-4 py-2">Allowances</th>
              <th className="px-4 py-2">Deductions</th>
              <th className="px-4 py-2">Pension</th>
              <th className="px-4 py-2">PAYE</th>
              <th className="px-4 py-2 text-green-600">Net Pay</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{e.employee}</td>
                <td className="px-4 py-2">{e.period}</td>
                <td className="px-4 py-2">ETB {e.baseSalary}</td>
                <td className="px-4 py-2">ETB {e.allowances}</td>
                <td className="px-4 py-2 text-red-500">ETB {e.deductions}</td>
                <td className="px-4 py-2">ETB {e.pension.toFixed(2)}</td>
                <td className="px-4 py-2">ETB {e.paye.toFixed(2)}</td>
                <td className="px-4 py-2 font-semibold text-green-600">ETB {e.netPay.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:underline">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-semibold text-sm">
            <tr>
              <td className="px-4 py-2" colSpan={5}>Totals</td>
              <td className="px-4 py-2">ETB {totals.pension.toFixed(2)}</td>
              <td className="px-4 py-2">ETB {totals.paye.toFixed(2)}</td>
              <td className="px-4 py-2 text-green-600">ETB {totals.netPay.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  bg-black/40 backdrop-blur-sm animate-fadeIn flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-4">➕ Add Payroll Entry</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  className="border p-2"
                  placeholder="Employee"
                  value={newEntry.employee}
                  onChange={(e) => setNewEntry({ ...newEntry, employee: e.target.value })}
                />
                <input
                  className="border p-2"
                  placeholder="Base Salary"
                  type="number"
                  value={newEntry.baseSalary}
                  onChange={(e) => setNewEntry({ ...newEntry, baseSalary: e.target.value })}
                />
                <input
                  className="border p-2"
                  placeholder="Allowances"
                  type="number"
                  value={newEntry.allowances}
                  onChange={(e) => setNewEntry({ ...newEntry, allowances: e.target.value })}
                />
                <input
                  className="border p-2"
                  placeholder="Deductions"
                  type="number"
                  value={newEntry.deductions}
                  onChange={(e) => setNewEntry({ ...newEntry, deductions: e.target.value })}
                />
                <input
                  className="border p-2 col-span-2"
                  type="month"
                  value={newEntry.period}
                  onChange={(e) => setNewEntry({ ...newEntry, period: e.target.value })}
                />
              </div>
              <div className="flex justify-between">
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:underline">Cancel</button>
                <button onClick={handleAdd} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">Add</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
