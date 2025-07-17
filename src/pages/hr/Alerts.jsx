// src/pages/hr/Alerts.jsx
import { useState } from 'react';
import {
  AlertCircle, Calendar, Clock, Info, XCircle, CheckCircle, ChevronsUp,
} from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'Contract Expiry',
      employee: 'Mekdes Tsegaye',
      date: '2025-07-31',
      message: 'Employment contract ends in 3 weeks.',
      severity: 'warning',
      status: 'Active',
    },
    {
      id: 2,
      type: 'No Clock-in',
      employee: 'Abebe Kebede',
      date: '2025-07-08',
      message: 'No clock-in for 3+ days.',
      severity: 'danger',
      status: 'Escalated',
    },
    {
      id: 3,
      type: 'Birthday',
      employee: 'Fikadu Dinku',
      date: '2025-07-09',
      message: '🎂 Wish happy birthday!',
      severity: 'info',
      status: 'Acknowledged',
    },
  ]);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    severity: '',
    status: '',
  });

  const handleStatusUpdate = (id, newStatus) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const getStyles = (severity) => {
    switch (severity) {
      case 'danger':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Contract Expiry':
        return <Calendar size={18} />;
      case 'No Clock-in':
        return <XCircle size={18} />;
      case 'Birthday':
        return <Info size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    return (
      (filters.search === '' || a.employee.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.type === '' || a.type === filters.type) &&
      (filters.severity === '' || a.severity === filters.severity) &&
      (filters.status === '' || a.status === filters.status)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔔 HR Alerts</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 text-sm">
        <input
          type="text"
          placeholder="Search employee"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded w-full md:w-1/4"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Types</option>
          <option value="Contract Expiry">Contract Expiry</option>
          <option value="No Clock-in">No Clock-in</option>
          <option value="Birthday">Birthday</option>
        </select>
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Severities</option>
          <option value="danger">Danger</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Escalated">Escalated</option>
        </select>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 p-4 rounded shadow-sm ${getStyles(alert.severity)}`}
          >
            <div className="flex items-center gap-2 font-semibold mb-1">
              {getIcon(alert.type)}
              <span>{alert.type}</span>
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs border bg-white">{alert.status}</span>
            </div>
            <div className="text-sm"><strong>Employee:</strong> {alert.employee}</div>
            <div className="text-sm"><strong>Date:</strong> {alert.date}</div>
            <div className="mt-1 text-sm">{alert.message}</div>
            <div className="flex gap-2 mt-3">
              {alert.status === 'Active' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(alert.id, 'Acknowledged')}
                    className="flex items-center gap-1 text-green-700 border border-green-300 px-2 py-1 rounded text-xs hover:bg-green-50"
                  >
                    <CheckCircle size={14} /> Acknowledge
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(alert.id, 'Escalated')}
                    className="flex items-center gap-1 text-orange-700 border border-orange-300 px-2 py-1 rounded text-xs hover:bg-orange-50"
                  >
                    <ChevronsUp size={14} /> Escalate
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
