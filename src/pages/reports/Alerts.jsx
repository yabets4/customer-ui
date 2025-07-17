// src/pages/reports/Alerts.jsx
import { useState } from 'react';

const Alertss = () => {
  const [alerts] = useState([
    {
      id: 1,
      type: 'Sales Drop',
      module: 'Sales',
      message: 'Sales down 22% vs last month',
      recommendation: 'Review campaign performance or offer promotions',
      severity: 'high',
    },
    {
      id: 2,
      type: 'Low Stock',
      module: 'Inventory',
      message: '14 items below minimum stock threshold',
      recommendation: 'Trigger restocking or review BOM',
      severity: 'medium',
    },
    {
      id: 3,
      type: 'Project Cost Overrun',
      module: 'Projects',
      message: 'Project D02 exceeded budget by 17%',
      recommendation: 'Audit task time & material usage',
      severity: 'high',
    },
    {
      id: 4,
      type: 'Rework Rate Spike',
      module: 'Quality',
      message: 'QC failures increased by 35% this month',
      recommendation: 'Review root causes and affected teams',
      severity: 'medium',
    },
  ]);

  const getColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔔 Smart Alerts & Insights</h1>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Module</th>
            <th className="border p-2">Alert</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td className="border p-2">{alert.module}</td>
              <td className={`border p-2 font-semibold ${getColor(alert.severity)}`}>
                {alert.type}
              </td>
              <td className="border p-2">{alert.message}</td>
              <td className="border p-2 text-gray-600 italic">{alert.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Alertss;
