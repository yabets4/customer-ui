// src/pages/reports/Dashboard.jsx
import { useState } from 'react';

const Dashboardd = () => {
  const [metrics] = useState({
    sales: { title: 'Monthly Sales', value: 'ETB 1.2M', change: '+8%', type: 'positive' },
    receivables: { title: 'Overdue Receivables', value: 'ETB 130K', change: '+15%', type: 'negative' },
    attendance: { title: 'Attendance Rate', value: '92%', change: '-2%', type: 'negative' },
    inventory: { title: 'Low Stock Items', value: '14', change: '', type: 'neutral' },
    projectProfit: { title: 'Project Profit Margin', value: '22%', change: '+3%', type: 'positive' },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">📊 ERP Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.values(metrics).map((m, i) => (
          <div key={i} className="border rounded p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-500 mb-1">{m.title}</p>
            <p className="text-xl font-bold">{m.value}</p>
            {m.change && (
              <p
                className={`text-sm font-medium ${
                  m.type === 'positive'
                    ? 'text-green-600'
                    : m.type === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {m.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Chart placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded p-4 shadow-sm h-[300px]">
          <h2 className="text-md font-semibold mb-2">📈 Sales Trend (Last 6 Months)</h2>
          <div className="text-center text-gray-400 italic mt-20">[Line Chart Placeholder]</div>
        </div>

        <div className="bg-white border rounded p-4 shadow-sm h-[300px]">
          <h2 className="text-md font-semibold mb-2">📊 Department Expense Breakdown</h2>
          <div className="text-center text-gray-400 italic mt-20">[Pie/Donut Chart Placeholder]</div>
        </div>

        <div className="bg-white border rounded p-4 shadow-sm h-[300px] col-span-full">
          <h2 className="text-md font-semibold mb-2">📅 Attendance Heatmap</h2>
          <div className="text-center text-gray-400 italic mt-20">[Heatmap Placeholder]</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardd;
