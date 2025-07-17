// src/pages/reports/ScheduledReports.jsx
import { useState } from 'react';
import { Clock, FileBarChart, History, Pencil, Trash2 } from 'lucide-react';
import EditScheduleModal from './EditScheduleModal';
import ReportLogsModal from './ReportLogsModal';

const ScheduledReports = () => {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState(null); // 'edit' | 'logs'

  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: '📊 Weekly Sales Summary',
      module: 'Sales',
      frequency: 'Weekly (Mon 8:00 AM)',
      recipients: ['sales@company.com'],
      groups: ['Sales Managers'],
      delivery: ['Email (PDF)', 'In-App'],
      nextRun: '2025-07-15',
      status: 'Active',
      conditional: 'Only if revenue drops > 20%',
    },
    {
      id: 2,
      name: '💵 Monthly Payroll Report',
      module: 'HR & Payroll',
      frequency: 'Monthly (1st at 9:00 AM)',
      recipients: ['finance@company.com'],
      delivery: ['Email (Excel)'],
      nextRun: '2025-08-01',
      status: 'Paused',
    },
  ]);

  const handleDelete = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const handleSave = (newSchedule) => {
    if (newSchedule.id) {
      // Update existing
      setSchedules((prev) =>
        prev.map((s) => (s.id === newSchedule.id ? newSchedule : s))
      );
    } else {
      // Add new
      const newId = Math.max(...schedules.map((s) => s.id)) + 1;
      setSchedules([...schedules, { ...newSchedule, id: newId }]);
    }

    setSelected(null);
    setView(null);
  };

  return (
    
    <div className=" min-h-screen  space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          📅 Scheduled Reports
        </h1>
        <button
          onClick={() => {
            setSelected(null); // For new
            setView('edit');
          }}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          + New Schedule
        </button>
      </div>

      <table className="w-full border text-sm rounded overflow-hidden">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-2">Report</th>
            <th className="p-2">Module</th>
            <th className="p-2">Frequency</th>
            <th className="p-2">Recipients</th>
            <th className="p-2">Delivery</th>
            <th className="p-2">Next Run</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="p-2 font-medium flex items-center gap-2">
                <FileBarChart className="w-4 h-4 text-cyan-500" />
                {s.name}
              </td>
              <td className="p-2">{s.module}</td>
              <td className="p-2">{s.frequency}</td>
              <td className="p-2 text-xs">
                {s.recipients.join(', ')}
                {s.groups?.length > 0 && (
                  <span className="block text-gray-500">
                    + {s.groups.join(', ')}
                  </span>
                )}
              </td>
              <td className="p-2">
                {s.delivery.map((d, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-xs mr-1 px-2 py-0.5 rounded-full"
                  >
                    {d}
                  </span>
                ))}
              </td>
              <td className="p-2">
                <Clock className="inline w-4 h-4 mr-1 text-gray-500" />
                {s.nextRun}
              </td>
              <td className="p-2 font-semibold text-sm">
                <span
                  className={
                    s.status === 'Active'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }
                >
                  {s.status}
                </span>
              </td>
              <td className="p-2 flex gap-3 justify-center">
                <button
                  title="Edit"
                  onClick={() => {
                    setSelected(s);
                    setView('edit');
                  }}
                >
                  <Pencil className="w-4 h-4 text-cyan-600 hover:text-cyan-800" />
                </button>
                <button
                  title="Logs"
                  onClick={() => {
                    setSelected(s);
                    setView('logs');
                  }}
                >
                  <History className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                </button>
                <button title="Delete" onClick={() => handleDelete(s.id)}>
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {view === 'edit' && (
        <EditScheduleModal
          report={selected}
          onClose={() => {
            setSelected(null);
            setView(null);
          }}
          onSave={handleSave}
        />
      )}

      {view === 'logs' && selected && (
        <ReportLogsModal
          report={selected}
          onClose={() => {
            setSelected(null);
            setView(null);
          }}
        />
      )}
    </div>
  );
};

export default ScheduledReports;
