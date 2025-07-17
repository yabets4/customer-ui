import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const Loans = () => {
  const [loans, setLoans] = useState([
    {
      id: 1,
      type: 'Customer',
      name: 'Daniel T.',
      amount: 10000,
      balance: 4000,
      startDate: '2024-05-01',
      dueDate: '2024-09-01',
      interestRate: 5,
      purpose: 'Furniture Credit',
      term: '4 months',
      frequency: 'Monthly',
      repaymentMethod: 'Equal Principal',
      collateral: '',
      glAccount: 'Accounts Receivable',
    },
    {
      id: 2,
      type: 'Company',
      name: 'Commercial Bank Loan',
      amount: 50000,
      balance: 30000,
      startDate: '2024-01-01',
      dueDate: '2026-01-01',
      interestRate: 12,
      purpose: 'Working Capital',
      term: '24 months',
      frequency: 'Monthly',
      repaymentMethod: 'EMI',
      collateral: 'Machinery',
      glAccount: 'Loan Payable',
    },
  ]);

  const [newLoan, setNewLoan] = useState({
    type: 'Customer',
    name: '',
    amount: '',
    balance: '',
    startDate: '',
    dueDate: '',
    interestRate: '',
    purpose: '',
    term: '',
    frequency: 'Monthly',
    repaymentMethod: 'Equal Principal',
    collateral: '',
    glAccount: '',
  });

  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    const id = loans.length + 1;
    setLoans([
      ...loans,
      {
        id,
        ...newLoan,
        amount: Number(newLoan.amount),
        balance: Number(newLoan.balance),
        interestRate: Number(newLoan.interestRate),
      },
    ]);
    setNewLoan({
      type: 'Customer',
      name: '',
      amount: '',
      balance: '',
      startDate: '',
      dueDate: '',
      interestRate: '',
      purpose: '',
      term: '',
      frequency: 'Monthly',
      repaymentMethod: 'Equal Principal',
      collateral: '',
      glAccount: '',
    });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setLoans(loans.filter((l) => l.id !== id));
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-6">🏦 Loans & Liabilities</h1>

      <button onClick={() => setShowModal(true)} className="mb-4 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 flex items-center">
        <PlusCircle className="mr-1 w-4 h-4" /> New Loan
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <select className="border p-2 rounded" value={newLoan.type} onChange={(e) => setNewLoan({ ...newLoan, type: e.target.value })}>
                <option>Customer</option>
                <option>Company</option>
                <option>Employee</option>
              </select>
              <input className="border p-2 rounded" placeholder="Name / Lender" value={newLoan.name} onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })} />
              <input className="border p-2 rounded" placeholder="Amount" value={newLoan.amount} onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })} />
              <input className="border p-2 rounded" placeholder="Balance" value={newLoan.balance} onChange={(e) => setNewLoan({ ...newLoan, balance: e.target.value })} />
              <input type="date" className="border p-2 rounded" value={newLoan.startDate} onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })} />
              <input type="date" className="border p-2 rounded" value={newLoan.dueDate} onChange={(e) => setNewLoan({ ...newLoan, dueDate: e.target.value })} />
              <input className="border p-2 rounded" placeholder="Interest %" value={newLoan.interestRate} onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })} />
              <input className="border p-2 rounded" placeholder="Purpose" value={newLoan.purpose} onChange={(e) => setNewLoan({ ...newLoan, purpose: e.target.value })} />
              <input className="border p-2 rounded" placeholder="Term (e.g. 12 months)" value={newLoan.term} onChange={(e) => setNewLoan({ ...newLoan, term: e.target.value })} />
              <select className="border p-2 rounded" value={newLoan.frequency} onChange={(e) => setNewLoan({ ...newLoan, frequency: e.target.value })}>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
              <select className="border p-2 rounded" value={newLoan.repaymentMethod} onChange={(e) => setNewLoan({ ...newLoan, repaymentMethod: e.target.value })}>
                <option>Equal Principal</option>
                <option>EMI</option>
                <option>Balloon</option>
              </select>
              <input className="border p-2 rounded" placeholder="Collateral (if any)" value={newLoan.collateral} onChange={(e) => setNewLoan({ ...newLoan, collateral: e.target.value })} />
              <input className="border p-2 rounded" placeholder="GL Account" value={newLoan.glAccount} onChange={(e) => setNewLoan({ ...newLoan, glAccount: e.target.value })} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleAdd} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 flex items-center">
                <PlusCircle className="mr-1 w-4 h-4" /> Add Loan
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Type</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Outstanding</th>
            <th className="border p-2">Interest %</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">Due</th>
            <th className="border p-2">Term</th>
            <th className="border p-2">Freq</th>
            <th className="border p-2">Repayment</th>
            <th className="border p-2">GL</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id}>
              <td className="border p-2">{l.type}</td>
              <td className="border p-2">{l.name}</td>
              <td className="border p-2">ETB {l.amount}</td>
              <td className="border p-2 text-red-500">ETB {l.balance}</td>
              <td className="border p-2">{l.interestRate}%</td>
              <td className="border p-2">{l.startDate}</td>
              <td className="border p-2">{l.dueDate}</td>
              <td className="border p-2">{l.term}</td>
              <td className="border p-2">{l.frequency}</td>
              <td className="border p-2">{l.repaymentMethod}</td>
              <td className="border p-2">{l.glAccount}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(l.id)} className="text-red-500 hover:underline text-xs">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Loans;
