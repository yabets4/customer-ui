// src/pages/hr/HRReports.jsx
import { useState } from 'react';

const HRReports = () => {
  const [filters, setFilters] = useState({ from: '', to: '' });

  const reports = [
    { name: 'Employee Directory', description: 'Full list of current employees' },
    { name: 'Attendance Report', description: 'Punch-in/out history by period or employee' },
    { name: 'Leave Summary', description: 'Total leave taken vs. available balance' },
    { name: 'Payroll Report', description: 'Breakdown of salary, deductions, and net pay' },
    { name: 'Loan & Advance Report', description: 'Active and cleared employee loans' },
    { name: 'Performance Summary', description: 'KPI trends and review scores' },
    { name: 'Turnover Report', description: 'Hires vs exits per month/department' },
  ];

  const handleDownload = (name) => {
    alert(`📥 Downloading "${name}" report...`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📈 HR & Payroll Reports</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="date"
          className="border p-2"
          placeholder="From"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <input
          type="date"
          className="border p-2"
          placeholder="To"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
      </div>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Report</th>
            <th className="border p-2">Description</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i}>
              <td className="border p-2 font-semibold">{r.name}</td>
              <td className="border p-2 text-gray-600">{r.description}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDownload(r.name)}
                  className="text-cyan-600 hover:underline text-sm"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HRReports;
