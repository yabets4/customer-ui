import React from 'react';
import { AlertTriangle, Download, Printer, Link, Calendar, BarChart3, Banknote, TrendingDown, TrendingUp, PiggyBank, Coins } from 'lucide-react';

// Inline Custom Components
const Section = ({ title, icon: Icon, children }) => (
  <div className="border rounded-xl shadow-sm p-4">
    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
      {Icon && <Icon size={18} className="text-blue-500" />} {title}
    </h2>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }) => (
  <div>
    <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="text-blue-600" /> {title}</h1>
    <p className="text-gray-500">{subtitle}</p>
  </div>
);

const SectionContent = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">{children}</div>
);

const StatCard = ({ label, value, negative, emphasis, large, positive }) => (
  <div className={`p-4 rounded-lg border flex flex-col ${negative ? 'bg-red-50 text-red-700' : positive ? 'bg-green-50 text-green-700' : 'bg-white'} ${emphasis ? 'border-blue-500 font-semibold' : ''} ${large ? 'text-lg' : ''}`}>
    <div className="text-sm text-gray-600 flex items-center gap-1">
      {label.includes("Profit") && <Banknote size={14} />}
      {label.includes("Revenue") && <TrendingUp size={14} />}
      {label.includes("Expense") || label.includes("COGS") || label.includes("Tax") && <TrendingDown size={14} />}
      {label.includes("Net") && <PiggyBank size={14} />}
      {label.includes("Loan") && <Coins size={14} />}
      {label}
    </div>
    <div className="font-bold">{value}</div>
  </div>
);

const FilterBar = ({ filters }) => (
  <div className="flex flex-wrap gap-2 py-2">
    {filters.map((filter, idx) => (
      <select key={idx} className="border rounded px-2 py-1 text-sm">
        <option>{filter}</option>
      </select>
    ))}
  </div>
);

const ExportButtons = ({ formats, print, embed, schedule }) => (
  <div className="flex flex-wrap gap-2 items-center">
    {formats.map(f => (
      <button key={f} className="flex items-center gap-1 px-3 py-1 bg-gray-100 border rounded text-sm">
        <Download size={14} /> Export {f}
      </button>
    ))}
    {print && (
      <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 border rounded text-sm">
        <Printer size={14} /> Print
      </button>
    )}
    {embed && (
      <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 border rounded text-sm">
        <Link size={14} /> Embed
      </button>
    )}
    {schedule && (
      <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 border rounded text-sm">
        <Calendar size={14} /> Schedule Email
      </button>
    )}
  </div>
);

const AlertBanner = ({ alerts }) => (
  <div className="mt-4 space-y-2">
    {alerts.map((alert, i) => (
      <div key={i} className="p-2 bg-yellow-100 text-yellow-900 rounded border-l-4 border-yellow-500 flex items-center gap-2">
        <AlertTriangle size={16} className="shrink-0" />
        <span>{alert}</span>
      </div>
    ))}
  </div>
);

export default function ProfitLossStatement() {
  return (
    <div className="p-4 space-y-6">
      <SectionTitle title="Profit & Loss Statement" subtitle="Summary of revenues, costs, and net profit" />

      <FilterBar filters={["Period", "Location", "Project", "Product Category", "Customer Segment"]} />

      <Section title="Revenue" icon={TrendingUp}>
        <SectionContent>
          <StatCard label="Product Sales" value="1,500,000 ETB" />
          <StatCard label="Service Income" value="120,000 ETB" />
          <StatCard label="Returns/Discounts" value="-45,000 ETB" negative />
          <StatCard label="Total Revenue" value="1,575,000 ETB" emphasis />
        </SectionContent>
      </Section>

      <Section title="Cost of Goods Sold (COGS)" icon={TrendingDown}>
        <SectionContent>
          <StatCard label="Raw Materials" value="720,000 ETB" />
          <StatCard label="Direct Labor" value="210,000 ETB" />
          <StatCard label="Subcontracting" value="30,000 ETB" />
          <StatCard label="Total COGS" value="960,000 ETB" emphasis />
        </SectionContent>
      </Section>

      <Section title="Gross Profit" icon={Banknote}>
        <SectionContent>
          <StatCard label="GROSS PROFIT" value="615,000 ETB" large />
        </SectionContent>
      </Section>

      <Section title="Operating Expenses" icon={TrendingDown}>
        <SectionContent>
          <StatCard label="Salaries (Admin & Sales)" value="180,000 ETB" />
          <StatCard label="Rent & Utilities" value="45,000 ETB" />
          <StatCard label="Marketing" value="30,000 ETB" />
          <StatCard label="Transport" value="22,000 ETB" />
          <StatCard label="Total Opex" value="277,000 ETB" emphasis />
        </SectionContent>
      </Section>

      <Section title="Operating Profit (EBIT)" icon={Banknote}>
        <SectionContent>
          <StatCard label="OPERATING PROFIT" value="338,000 ETB" large />
        </SectionContent>
      </Section>

      <Section title="Other Expenses" icon={Coins}>
        <SectionContent>
          <StatCard label="Loan Interest" value="12,000 ETB" />
          <StatCard label="Net Profit Before Tax" value="326,000 ETB" emphasis />
          <StatCard label="Income Tax (30%)" value="97,800 ETB" />
          <StatCard label="NET PROFIT" value="228,200 ETB" large positive />
        </SectionContent>
      </Section>

      <ExportButtons formats={["PDF", "Excel", "CSV"]} print embed schedule />

      <AlertBanner alerts={[
        "Gross profit < 20% on Project X",
        "COGS increased 12% vs last period",
        "Loss-making month detected",
        "Overhead exceeded budget"
      ]} />
    </div>
  );
}
