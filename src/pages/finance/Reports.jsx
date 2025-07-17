import { useState } from 'react';
import { FileDown, FileSpreadsheet } from 'lucide-react';

const Report = () => {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    project: '',
    department: '',
  });

  const reportSections = [
    {
      title: '📘 Core Financial Reports',
      reports: [
        { name: 'Profit & Loss', desc: 'Shows revenue, cost, and profit over time' },
        { name: 'Balance Sheet', desc: 'Assets, liabilities, and equity snapshot' },
        { name: 'Cash Flow', desc: 'Cash inflow/outflow by category' },
      ],
    },
    {
      title: '📦 Operational Reports',
      reports: [
        { name: 'Inventory Valuation Report', desc: 'Value of raw & finished goods' },
        { name: 'Expense Summary', desc: 'Spending by category' },
        { name: 'Receivables Report', desc: 'Outstanding invoices with aging' },
        { name: 'Payables Report', desc: 'Supplier balances and due dates' },
        { name: 'Project Profitability', desc: 'Revenue vs cost per project' },
        { name: 'Payroll Report', desc: 'Salaries, taxes, bonuses, deductions' },
        { name: 'Loan Report', desc: 'Loan balance and payment schedule' },
        { name: 'Rework Cost Report', desc: 'Impact of rework on project margin' },
      ],
    },
    {
      title: '👤 Customer & Vendor Reports',
      reports: [
        { name: 'Customer Statement', desc: 'Complete AR ledger per customer' },
        { name: 'Vendor Statement', desc: 'Invoice & payment history by supplier' },
        { name: 'Customer Credit Report', desc: 'Used vs available customer credit' },
        { name: 'Gift Card Liability', desc: 'Unredeemed gift card balances' },
      ],
    },
    {
      title: '📅 Time-Based Reports',
      reports: [
        { name: 'Monthly Profit Report', desc: 'Profit by location/project/department' },
        { name: 'Daily Income Report', desc: 'Snapshot of daily revenue' },
        { name: 'Quarterly Expense Comparison', desc: 'Track seasonal trends' },
      ],
    },
    {
      title: '📑 Compliance Reports (Ethiopia)',
      reports: [
        { name: 'PAYE Summary', desc: 'Monthly tax summary for employees' },
        { name: 'Pension Contributions', desc: 'Employer + employee pension report' },
        { name: 'VAT Sales & Purchase Reports', desc: 'Required for ERCA submission' },
        { name: 'Loan Disclosure Reports', desc: 'Required for auditors/lenders' },
      ],
    },
  ];

  const handleDownload = (report, format) => {
    alert(`📥 Downloading "${report}" as ${format.toUpperCase()}...`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Financial Reports</h1>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Filter by Project"
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Filter by Department"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        />
      </div>

      {/* Reports List */}
      {reportSections.map((section, idx) => (
        <div key={idx} className="mb-8">
          <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
          <table className="w-full text-sm border mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 w-1/4">Report</th>
                <th className="border p-2">Description</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {section.reports.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="border p-2 font-medium">{r.name}</td>
                  <td className="border p-2 text-gray-600">{r.desc}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      className="text-cyan-600 hover:underline"
                      onClick={() => handleDownload(r.name, 'pdf')}
                    >
                      <FileDown size={16} className="inline-block mr-1" />
                      PDF
                    </button>
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => handleDownload(r.name, 'csv')}
                    >
                      <FileSpreadsheet size={16} className="inline-block mr-1" />
                      CSV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Report;
