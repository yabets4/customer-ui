// src/pages/reports/EditScheduleModal.jsx
import { useState } from 'react';

const EditScheduleModal = ({ report, onClose, onSave }) => {
  const [form, setForm] = useState({
    id: report?.id || null,
    name: report?.name || '',
    module: report?.module || '',
    frequency: report?.frequency || '',
    time: '',
    recipients: report?.recipients?.join(', ') || '',
    groups: report?.groups || [],
    delivery: report?.delivery || [],
    nextRun: report?.nextRun || '',
    status: report?.status || 'Active',
    conditional: report?.conditional || '',
  });

  const toggleDelivery = (method) => {
    setForm((prev) => ({
      ...prev,
      delivery: prev.delivery.includes(method)
        ? prev.delivery.filter((d) => d !== method)
        : [...prev.delivery, method],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...form,
      recipients: form.recipients.split(',').map((r) => r.trim()),
    };
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 space-y-6 mt-10">
        <h2 className="text-xl font-bold">
          {report ? `🛠 Edit Schedule — ${report.name}` : '➕ New Scheduled Report'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name & Module */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Report Name</label>
              <input
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Module</label>
              <input
                className="w-full border p-2 rounded"
                value={form.module}
                onChange={(e) => setForm({ ...form, module: e.target.value })}
              />
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium">Frequency</label>
            <input
              className="w-full border p-2 rounded"
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            />
          </div>

          {/* Time + Status */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              className="w-full border p-2 rounded"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
            <select
              className="w-full border p-2 rounded"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>

          {/* Delivery */}
          <div>
            <label className="block text-sm font-medium mb-1">Delivery Channels</label>
            <div className="flex gap-3 flex-wrap">
              {['Email (PDF)', 'In-App', 'SMS Alert', 'FTP/API'].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.delivery.includes(opt)}
                    onChange={() => toggleDelivery(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium">Recipients</label>
            <input
              className="w-full border p-2 rounded"
              value={form.recipients}
              onChange={(e) => setForm({ ...form, recipients: e.target.value })}
              placeholder="e.g. hr@company.com, ceo@company.com"
            />
          </div>

          {/* Conditional Alert */}
          <div>
            <label className="block text-sm font-medium">Conditional Rule</label>
            <input
              className="w-full border p-2 rounded"
              value={form.conditional}
              onChange={(e) => setForm({ ...form, conditional: e.target.value })}
              placeholder="e.g. Only if revenue drop > 20%"
            />
          </div>

          {/* Save / Cancel */}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" className="text-sm text-gray-600" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduleModal;
