// src/pages/finance/BalanceSheet.jsx
import { useState } from 'react';
import { Download, CalendarDays, Building2, FolderKanban, Equal } from 'lucide-react';
import { motion } from 'framer-motion';

const mockData = {
  date: '2025-06-30',
  branch: 'Main Workshop',
  department: 'All',
  assets: {
    current: [
      { label: 'Cash in Bank', value: 650000 },
      { label: 'Accounts Receivable', value: 230000 },
      { label: 'Inventory (RM + FG)', value: 310000 },
    ],
    nonCurrent: [
      { label: 'Machinery', value: 800000 },
      { label: 'Furniture', value: 150000 },
      { label: 'Accumulated Depreciation', value: -120000 },
    ],
  },
  liabilities: {
    current: [
      { label: 'Accounts Payable', value: 220000 },
      { label: 'PAYE & Pension Payable', value: 40000 },
      { label: 'Short-Term Loan', value: 100000 },
    ],
    longTerm: [
      { label: 'Bank Loan', value: 500000 },
    ],
  },
  equity: [
    { label: 'Owner Capital', value: 800000 },
    { label: 'Retained Earnings', value: 131800 },
    { label: 'Current Period Profit', value: 228200 },
  ],
};

const formatETB = (val) => `${val.toLocaleString()} ETB`;

export default function BalanceSheet() {
  const [filters, setFilters] = useState({
    date: '2025-06-30',
    branch: '',
    department: '',
  });

  const sumValues = (items) => items.reduce((sum, item) => sum + item.value, 0);

  const totals = {
    currentAssets: sumValues(mockData.assets.current),
    nonCurrentAssets: sumValues(mockData.assets.nonCurrent),
    totalAssets: sumValues(mockData.assets.current) + sumValues(mockData.assets.nonCurrent),
    currentLiabilities: sumValues(mockData.liabilities.current),
    longTermLiabilities: sumValues(mockData.liabilities.longTerm),
    totalLiabilities:
      sumValues(mockData.liabilities.current) + sumValues(mockData.liabilities.longTerm),
    totalEquity: sumValues(mockData.equity),
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Equal size={24} /> Balance Sheet <span className="text-sm text-muted-foreground">as of {filters.date}</span>
        </h1>
        <div className="flex gap-2">
          <button className="bg-primary  text-white px-4 py-2 rounded flex items-center gap-1">
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
          <CalendarDays size={18} />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
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

      {/* Balance Sheet Section */}
      <div className="grid md:grid-cols-2 gap-8 text-sm">
        <div>
          <h2 className="font-semibold text-lg border-b pb-1 mb-2">🟢 ASSETS</h2>
          <h3 className="font-medium mt-4">Current Assets</h3>
          <ul className="pl-4 mt-1 space-y-1">
            {mockData.assets.current.map((item) => (
              <li key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span>{formatETB(item.value)}</span>
              </li>
            ))}
            <li className="flex justify-between font-semibold border-t pt-1">
              <span>Total Current Assets</span>
              <span>{formatETB(totals.currentAssets)}</span>
            </li>
          </ul>

          <h3 className="font-medium mt-4">Fixed Assets</h3>
          <ul className="pl-4 mt-1 space-y-1">
            {mockData.assets.nonCurrent.map((item) => (
              <li key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span>{formatETB(item.value)}</span>
              </li>
            ))}
            <li className="flex justify-between font-semibold border-t pt-1">
              <span>Net Fixed Assets</span>
              <span>{formatETB(totals.nonCurrentAssets)}</span>
            </li>
          </ul>

          <div className="flex justify-between font-bold mt-4 border-t pt-2 text-base">
            <span>TOTAL ASSETS</span>
            <span>{formatETB(totals.totalAssets)}</span>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg border-b pb-1 mb-2">🔴 LIABILITIES</h2>
          <h3 className="font-medium mt-4">Current Liabilities</h3>
          <ul className="pl-4 mt-1 space-y-1">
            {mockData.liabilities.current.map((item) => (
              <li key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span>{formatETB(item.value)}</span>
              </li>
            ))}
            <li className="flex justify-between font-semibold border-t pt-1">
              <span>Total Current Liabilities</span>
              <span>{formatETB(totals.currentLiabilities)}</span>
            </li>
          </ul>

          <h3 className="font-medium mt-4">Long-Term Liabilities</h3>
          <ul className="pl-4 mt-1 space-y-1">
            {mockData.liabilities.longTerm.map((item) => (
              <li key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span>{formatETB(item.value)}</span>
              </li>
            ))}
            <li className="flex justify-between font-semibold border-t pt-1">
              <span>Total Long-Term Liabilities</span>
              <span>{formatETB(totals.longTermLiabilities)}</span>
            </li>
          </ul>

          <div className="flex justify-between font-bold mt-4 border-t pt-2 text-base">
            <span>Total Liabilities</span>
            <span>{formatETB(totals.totalLiabilities)}</span>
          </div>

          <h2 className="font-semibold text-lg border-b pb-1 mt-6 mb-2">🔵 EQUITY</h2>
          <ul className="pl-4 mt-1 space-y-1">
            {mockData.equity.map((item) => (
              <li key={item.label} className="flex justify-between">
                <span>{item.label}</span>
                <span>{formatETB(item.value)}</span>
              </li>
            ))}
            <li className="flex justify-between font-semibold border-t pt-1">
              <span>Total Equity</span>
              <span>{formatETB(totals.totalEquity)}</span>
            </li>
          </ul>

          <div className="flex justify-between font-bold mt-4 border-t pt-2 text-base">
            <span>TOTAL LIABILITIES + EQUITY</span>
            <span>{formatETB(totals.totalLiabilities + totals.totalEquity)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
