import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { FileBarChart2, AlertTriangle, LineChart, Coins } from 'lucide-react';


const Dashboard = () => {
  const [metrics] = useState({
    netProfit: 14500,
    cashBalance: 32000,
    receivables: 12000,
    payables: 8700,
    overdueInvoices: 3,
    upcomingPayments: 2,
  });

  const monthlyData = [
    { month: 'Jan', income: 3000, expense: 2200 },
    { month: 'Feb', income: 2800, expense: 2100 },
    { month: 'Mar', income: 3500, expense: 2500 },
    { month: 'Apr', income: 4000, expense: 2600 },
    { month: 'May', income: 4200, expense: 2800 },
    { month: 'Jun', income: 3800, expense: 2400 },
    { month: 'Jul', income: 4500, expense: 2900 },
    { month: 'Aug', income: 4700, expense: 3100 },
    { month: 'Sep', income: 4300, expense: 2700 },
    { month: 'Oct', income: 4600, expense: 3000 },
    { month: 'Nov', income: 4800, expense: 3200 },
    { month: 'Dec', income: 5000, expense: 3400 },
  ];

  
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-10">
      <h1 className="text-2xl font-bold">📊 Financial Dashboard</h1>

      <Alerts metrics={metrics} />
      <QuickLinks />
      <SmartSummary />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Card title="Net Profit" value={metrics.netProfit} color="green" />
        <Card title="Cash Balance" value={metrics.cashBalance} color="blue" />
        <Card title="Receivables" value={metrics.receivables} color="orange" />
        <Card title="Payables" value={metrics.payables} color="red" />
        <Card title="Overdue Invoices" value={metrics.overdueInvoices} color="yellow" />
        <Card title="Upcoming Payments" value={metrics.upcomingPayments} color="purple" />
      </div>

      <IncomeExpenseChart data={monthlyData} />
    </div>
  );
};

const Alerts = ({ metrics }) => {
  const alerts = [];

  if (metrics.cashBalance < 20000) {
    alerts.push('⚠️ Cash balance is below threshold (ETB 20,000)');
  }

  if (metrics.overdueInvoices > 0) {
    alerts.push(`🔴 ${metrics.overdueInvoices} invoice(s) overdue`);
  }

  if (metrics.upcomingPayments > 1) {
    alerts.push(`🟡 ${metrics.upcomingPayments} upcoming payments in next 7 days`);
  }

  return (
    <div className="bg-white p-4 rounded shadow border-l-4 border-yellow-500">
      <h2 className="text-md font-semibold mb-2 flex items-center text-yellow-700">
        <AlertTriangle className="w-4 h-4 mr-1" /> Alerts
      </h2>
      {alerts.length === 0 ? (
        <p className="text-sm text-gray-500">No financial alerts at this time.</p>
      ) : (
        <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
          {alerts.map((alert, i) => (
            <li key={i}>{alert}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const QuickLinks = () => {
  const navigate = useNavigate();

  const links = [
    { name: 'Profit & Loss', icon: FileBarChart2, route: '/finance/p&l' },
    { name: 'Balance Sheet', icon: Coins, route: '/finance/balance-sheet' },
    { name: 'Cash Flow', icon: LineChart, route: '/finance/Cash-flow' },
    { name: 'Project Profitability', icon: FileBarChart2, route: '/projects/profitability' },
    { name: 'Tax Summary', icon: Coins, route: '/reports/tax-summary' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-md font-semibold mb-3">📤 Quick Access to Reports</h2>
      <div className="flex flex-wrap gap-3">
        {links.map((link, i) => (
          <button
            key={i}
            className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-sm px-3 py-1 rounded"
            onClick={() => navigate(link.route)}
          >
            <link.icon className="w-4 h-4" />
            {link.name}
          </button>
        ))}
      </div>
    </div>
  );
};


const SmartSummary = () => {
  const groupedInsights = {
    '📈 Trends & Growth': [
      'Net profit has grown 3 months in a row.',
      'Inventory turnover improved by 12% after better planning.',
      'Payroll costs held steady for 3 months — stable workforce.',
    ],
    '⚠️ Risks & Warnings': [
      'Receivables aging: 40% are >60 days overdue — possible delays.',
      'ETB 9,200 in payables due soon with no scheduled payment.',
      'Raw material costs spiked 18% — mostly imported MDF.',
    ],
    '🟢 Opportunities & Positives': [
      'Customer retention improved to 87% post loyalty launch.',
      'Marketing expense increased — review ROI impact.',
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">🧠 Smart Financial Summary</h2>
      {Object.entries(groupedInsights).map(([group, items], idx) => (
        <div key={idx}>
          <h3 className="text-sm font-bold text-gray-600 mb-1">{group}</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-2">
            {items.map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};



const Card = ({ title, value, color }) => {
  const colorMap = {
    green: 'text-green-600 border-green-600',
    blue: 'text-blue-600 border-blue-600',
    orange: 'text-orange-600 border-orange-600',
    red: 'text-red-600 border-red-600',
    yellow: 'text-yellow-600 border-yellow-500',
    purple: 'text-purple-600 border-purple-600',
  };

  return (
    <div className={`bg-white rounded shadow p-4 border-l-4 ${colorMap[color]}`}>
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className={`text-lg font-bold ${colorMap[color]}`}>
        {typeof value === 'number' ? `ETB ${value.toLocaleString()}` : value}
      </p>
    </div>
  );
};

const IncomeExpenseChart = ({ data }) => (
  <div className="bg-white p-6 rounded shadow mt-6">
    <h3 className="text-xl font-semibold mb-4">📈 Income vs Expense (Yearly)</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `ETB ${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="income" fill="#10B981" name="Income" />
        <Bar dataKey="expense" fill="#EF4444" name="Expense" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default Dashboard;
