// src/pages/finance/ProfitLossStatement.jsx
import { useState } from 'react';
import { Download, CalendarRange, FolderKanban, Building2, Equal } from 'lucide-react';
import { motion } from 'framer-motion';

const formatETB = (val) => `${val.toLocaleString()} ETB`;

const mock = {
  period: 'Q1 2025',
  revenue: [
    { label: 'Product Sales', value: 1500000 },
    { label: 'Service Income', value: 120000 },
    { label: 'Returns/Discounts', value: -45000 },
  ],
  cogs: [
    { label: 'Raw Materials', value: 720000 },
    { label: 'Direct Labor', value: 210000 },
    { label: 'Subcontracting', value: 30000 },
  ],
  opex: [
    { label: 'Salaries (Admin + Sales)', value: 180000 },
    { label: 'Rent & Utilities', value: 45000 },
    { label: 'Marketing', value: 30000 },
    { label: 'Transport', value: 22000 },
  ],
  otherExpenses: [
    { label: 'Loan Interest', value: 12000 },
  ],
  taxRate: 0.3,
};

export default function ProfitLossStatement() {
  const [filters, setFilters] = useState({ period: '2025-01', branch: '', department: '' });

  const sum = (arr) => arr.reduce((t, i) => t + i.value, 0);
  const totalRevenue = sum(mock.revenue);
  const totalCOGS = sum(mock.cogs);
  const grossProfit = totalRevenue - totalCOGS;
  const totalOpex = sum(mock.opex);
  const operatingProfit = grossProfit - totalOpex;
  const totalOther = sum(mock.otherExpenses);
  const beforeTax = operatingProfit - totalOther;
  const tax = beforeTax * mock.taxRate;
  const netProfit = beforeTax - tax;

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Equal /> Profit & Loss Statement <span className="text-sm text-muted-foreground">– {mock.period}</span>
        </h1>
        <div className="flex gap-2">
          <button className="bg-primary text-white px-4 py-2 rounded flex items-center gap-1">
            <Download size={16} /> PDF
          </button>
          <button className="bg-muted px-4 py-2 rounded flex items-center gap-1">
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <CalendarRange size={18} />
          <input
            type="month"
            value={filters.period}
            onChange={(e) => setFilters({ ...filters, period: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={18} />
          <select
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">All Branches</option>
            <option>Main Workshop</option>
            <option>Showroom</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <FolderKanban size={18} />
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">All Departments</option>
            <option>Production</option>
            <option>Sales</option>
          </select>
        </div>
      </div>

      {/* Statement */}
<motion.div className="min-h-screen bg-gray-100 p-8">
  <div className="bg-gray-200 max-w-4xl mx-auto p-6 rounded-xl shadow space-y-6">
      <div className="max-w-2xl  mx-auto space-y-6 text-sm">
        <section>
          <h2 className="font-bold text-lg text-blue-600 mb-1">Revenue</h2>
          {mock.revenue.map((r) => (
            <div key={r.label} className="flex justify-between">
              <span>{r.label}</span>
              <span>{formatETB(r.value)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Total Revenue</span>
            <span>{formatETB(totalRevenue)}</span>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-lg text-red-600 mb-1">Cost of Goods Sold</h2>
          {mock.cogs.map((c) => (
            <div key={c.label} className="flex justify-between">
              <span>{c.label}</span>
              <span>{formatETB(c.value)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Total COGS</span>
            <span>{formatETB(totalCOGS)}</span>
          </div>
        </section>

        <div className="flex justify-between font-bold border-t pt-2 text-base text-green-700">
          <span>GROSS PROFIT</span>
          <span>{formatETB(grossProfit)}</span>
        </div>

        <section>
          <h2 className="font-bold text-lg text-yellow-600 mb-1">Operating Expenses</h2>
          {mock.opex.map((o) => (
            <div key={o.label} className="flex justify-between">
              <span>{o.label}</span>
              <span>{formatETB(o.value)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Total Operating Expenses</span>
            <span>{formatETB(totalOpex)}</span>
          </div>
        </section>

        <div className="flex justify-between font-bold text-blue-700 border-t pt-2 text-base">
          <span>OPERATING PROFIT (EBIT)</span>
          <span>{formatETB(operatingProfit)}</span>
        </div>

        <section>
          <h2 className="font-bold text-lg text-muted-foreground mb-1">Other Expenses</h2>
          {mock.otherExpenses.map((e) => (
            <div key={e.label} className="flex justify-between">
              <span>{e.label}</span>
              <span>{formatETB(e.value)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Net Profit Before Tax</span>
            <span>{formatETB(beforeTax)}</span>
          </div>
        </section>

        <div className="flex justify-between font-semibold">
          <span>Income Tax (30%)</span>
          <span>{formatETB(tax)}</span>
        </div>

        <div className="flex justify-between font-bold text-emerald-700 border-t pt-2 text-lg">
          <span>NET PROFIT</span>
          <span>{formatETB(netProfit)}</span>
        </div>
      </div>
  </div>
</motion.div>
    </motion.div>
  );
}
