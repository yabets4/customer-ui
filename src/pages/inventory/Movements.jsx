import { useState } from 'react';
import {
  FileClock,
  PackagePlus,
  PackageMinus,
  Repeat,
  Settings,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import MovementLedger from './MovementLedger';

export default function Movements() {
  const [activeTab, setActiveTab] = useState('ledger');
  const [submitted, setSubmitted] = useState(false);

  const initialForm = {
    item: '',
    quantity: '',
    reference: '',
    location: '',
    reason: '',
  };

  const [form, setForm] = useState(initialForm);

  const resetForm = () => setForm(initialForm);

  const tabs = [
    { key: 'ledger', label: 'Ledger', icon: FileClock },
    { key: 'inbound', label: 'Inbound', icon: PackagePlus },
    { key: 'outbound', label: 'Outbound', icon: PackageMinus },
    { key: 'transfer', label: 'Transfer', icon: Repeat },
    { key: 'adjustment', label: 'Adjustment', icon: Settings },
    { key: 'scrap', label: 'Scrap', icon: Trash2 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', form);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    resetForm();
  };

  const renderForm = (type) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Item Name</label>
        <input
          type="text"
          value={form.item}
          onChange={(e) => setForm({ ...form, item: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      {type === 'inbound' && (
        <>
          <div>
            <label className="block text-sm font-medium">PO / GRN Reference</label>
            <input
              type="text"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Received Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </>
      )}

      {type === 'outbound' && (
        <>
          <div>
            <label className="block text-sm font-medium">Destination Task / Project</label>
            <input
              type="text"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Issued By</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </>
      )}

      {type === 'transfer' && (
        <>
          <div>
            <label className="block text-sm font-medium">From Location</label>
            <input
              type="text"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">To Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </>
      )}

      {type === 'adjustment' && (
        <div>
          <label className="block text-sm font-medium">Adjustment Reason</label>
          <input
            type="text"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      )}

      {type === 'scrap' && (
        <div>
          <label className="block text-sm font-medium">Scrap Reason</label>
          <input
            type="text"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit {type} Movement
      </button>

      {submitted && (
        <p className="text-green-600 font-medium">✅ Submitted successfully!</p>
      )}
    </form>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">🔄 Inventory Movements</h2>
      <p className="text-gray-600 mb-6">
        Track all stock movements — Inbound, Outbound, Transfers, Adjustments, and Write-offs —
        with full audit trail and real-time stock updates.
      </p>

      <div className="flex space-x-4 border-b pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSubmitted(false);
              resetForm();
            }}
            className={`flex items-center gap-2 px-3 py-1 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white border rounded-lg shadow p-4"
      >
        {activeTab === 'ledger' && <MovementLedger />}
        {activeTab !== 'ledger' && renderForm(activeTab)}
      </motion.div>
    </div>
  );
}