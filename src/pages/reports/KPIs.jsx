// src/pages/reports/KPIs.jsx
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Gauge, TrendingUp, AlertCircle, CircleDollarSign } from 'lucide-react';

const dummyKPIData = [
  { label: 'Revenue (MTD)', value: 3200000, unit: 'ETB', icon: <TrendingUp /> },
  { label: 'Gross Profit Margin', value: '38%', target: '40%', icon: <Gauge /> },
  { label: 'Cash on Hand', value: 900000, unit: 'ETB', icon: <CircleDollarSign /> },
  { label: 'Overdue Receivables > 90d', value: 64000, unit: 'ETB', alert: true, icon: <AlertCircle /> },
];

const kpiTrendData = [
  { month: 'Jan', revenue: 240000, profit: 80000 },
  { month: 'Feb', revenue: 280000, profit: 100000 },
  { month: 'Mar', revenue: 320000, profit: 120000 },
  { month: 'Apr', revenue: 400000, profit: 160000 },
  { month: 'May', revenue: 460000, profit: 180000 },
  { month: 'Jun', revenue: 500000, profit: 200000 },
];

const KPIWidget = ({ label, value, unit, target, icon, alert }) => (
    
  <div className={`border p-4 rounded-xl shadow-md w-60 ${alert ? 'bg-red-50 border-red-400' : 'bg-gray-200'}`}>
    <div className="flex items-center justify-between mb-2">
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-gray-500">{icon}</div>
    </div>
    <div className="text-2xl font-bold">
      {value} {unit || ''}
    </div>
    {target && (
      <div className="text-sm text-gray-500">🎯 Target: {target}</div>
    )}
  </div>
);

const KPIs = () => {
  const [selectedKPI, setSelectedKPI] = useState(null);

  return (
    <div className="p-6 h-auto bg-white">
      <h1 className="text-3xl font-bold mb-4">📊 KPI Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {dummyKPIData.map((kpi, idx) => (
          <div key={idx} onClick={() => setSelectedKPI(kpi)} className="cursor-pointer">
            <KPIWidget {...kpi} />
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">📈 KPI Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={kpiTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#f23016" name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#522fd4" name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {selectedKPI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative">
            <button
              onClick={() => setSelectedKPI(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2">🔍 {selectedKPI.label} Breakdown</h3>
            <p className="mb-2">Value: {selectedKPI.value} {selectedKPI.unit || ''}</p>
            {selectedKPI.target && <p className="mb-2">🎯 Target: {selectedKPI.target}</p>}
            <p className="text-sm text-gray-600">
              Click-through drill-down support, period filtering, and export options (CSV/Excel) available in full version.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIs;
