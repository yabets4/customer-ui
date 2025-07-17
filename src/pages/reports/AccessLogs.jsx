// src/pages/reports/AccessLogs.jsx
import { useState } from 'react';

const AccessLogs = () => {
  const [logs] = useState([
    {
      id: 1,
      user: 'admin@company.com',
      report: 'Profit & Loss Statement',
      action: 'Exported PDF',
      timestamp: '2025-07-08 14:32',
    },
    {
      id: 2,
      user: 'finance@company.com',
      report: 'Payroll Summary',
      action: 'Viewed on screen',
      timestamp: '2025-07-08 11:05',
    },
    {
      id: 3,
      user: 'hr@company.com',
      report: 'Attendance Report',
      action: 'Exported CSV',
      timestamp: '2025-07-07 09:18',
    },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📁 Report Access Logs</h1>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Report</th>
            <th className="border p-2">Action</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border p-2">{log.user}</td>
              <td className="border p-2">{log.report}</td>
              <td className="border p-2 text-blue-600">{log.action}</td>
              <td className="border p-2">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessLogs;
