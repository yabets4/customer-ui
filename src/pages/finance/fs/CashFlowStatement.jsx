// src/pages/finance/CashFlowStatement.jsx
import { useState } from 'react';
import { Download, CalendarRange, Building2, FolderKanban, Equal } from 'lucide-react';
import { motion } from 'framer-motion';

const formatETB = (val) => `${val.toLocaleString()} ETB`;

const mockData = {
  period: 'Q2 2025',
  openingBalance: 320000,
  operating: [
    { label: 'Cash Received from Sales', value: 1850000 },
    { label: 'Payments to Suppliers', value: -980000 },
    { label: 'Salaries Paid', value: -340000 },
    { label: 'Rent & Utilities', value: -55000 },
    { label: 'Marketing Expenses', value: -22000 },
  ],
  investing: [
    { label: 'Bought New CNC Router', value: -400000 },
    { label: 'Sold Old Table Saw', value: 30000 },
  ],
  financing: [
    { label: 'Bank Loan Received', value: 250000 },
    { label: 'Repayment of Old Loan', value: -100000 },
    { label: 'Owner Drawings', value: -60000 },
  ],
};

export default function CashFlowStatement() {
  const [filters, setFilters] = useState({ period: '2025-04', branch: '', department: '' });

  const sum = (arr) => arr.reduce((t, i) => t + i.value, 0);
  const netOperating = sum(mockData.operating);
  const netInvesting = sum(mockData.investing);
  const netFinancing = sum(mockData.financing);
  const netMovement = netOperating + netInvesting + netFinancing;
  const closingBalance = mockData.openingBalance + netMovement;

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Equal /> Cash Flow Statement <span className="text-sm text-muted-foreground">– {mockData.period}</span>
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
            <option>Finance</option>
            <option>Production</option>
          </select>
        </div>
      </div>

      {/* Statement */}
      <div className="max-w-2xl mx-auto space-y-6 text-sm">
        {/* Operating */}
        <section>
          <h2 className="font-bold text-lg text-blue-600 mb-1">Cash from Operating Activities</h2>
          {mockData.operating.map((item) => (
            <div key={item.label} className="flex justify-between">
              <span>{item.label}</span>
              <span>{formatETB(item.value)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Net Operating Cash Flow</span>
            <span>{formatETB(netOperating)}</span>
          </div>
        </section>

        {/* Investing */}
        <section>
          <h2 className="font-bold text-lg text-purple-600 mt-4 mb-1">Cash from Investing Activities</h2>
          {mockData.investing.map((item) => (
            <div key={item.label} className="flex justify-between">
              <span>{item.label}</span>
              <span>{formatETB(item.value)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Net Investing Cash Flow</span>
            <span>{formatETB(netInvesting)}</span>
          </div>
        </section>

        {/* Financing */}
        <section>
          <h2 className="font-bold text-lg text-amber-600 mt-4 mb-1">Cash from Financing Activities</h2>
          {mockData.financing.map((item) => (
            <div key={item.label} className="flex justify-between">
              <span>{item.label}</span>
              <span>{formatETB(item.value)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Net Financing Cash Flow</span>
            <span>{formatETB(netFinancing)}</span>
          </div>
        </section>

        {/* Totals */}
        <div className="flex justify-between font-bold text-green-700 border-t pt-2 text-base mt-6">
          <span>Net Cash Movement</span>
          <span>{formatETB(netMovement)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Opening Cash Balance</span>
          <span>{formatETB(mockData.openingBalance)}</span>
        </div>
        <div className="flex justify-between font-bold text-emerald-700 border-t pt-2 text-lg">
          <span>Closing Cash Balance</span>
          <span>{formatETB(closingBalance)}</span>
        </div>
      </div>
    </motion.div>
  );
}
