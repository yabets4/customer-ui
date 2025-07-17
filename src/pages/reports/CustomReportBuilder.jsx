import { useState } from 'react';
import {
  FileBarChart2, Filter, Table, Download, Save, CalendarDays,
  Columns3, BarChart3, LineChart, PieChart, Plus
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart as RLineChart, Line, PieChart as RPieChart,
  Pie, Cell, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const sampleData = [
  { name: 'Furniture', amount: 1200 },
  { name: 'Chairs', amount: 1500 },
  { name: 'Tables', amount: 1000 },
  { name: 'Beds', amount: 1800 },
  { name: 'Wardrobes', amount: 1700 },
];

const CustomReportBuilder = () => {
  const modules = {
    Sales: ['Customer', 'Product', 'Amount', 'Date', 'Region'],
    Finance: ['Account', 'Type', 'Amount', 'Date'],
    HR: ['Employee', 'Department', 'Leave Type', 'Date'],
    Inventory: ['Item', 'Category', 'Quantity', 'Location'],
    Projects: ['Project', 'Cost', 'Status', 'Manager'],
  };

  const aggregates = ['Sum', 'Avg', 'Min', 'Max', 'Count'];
  const timePresets = ['Today', 'Last 7 Days', 'This Month', 'Last Month', 'Custom'];
  const visualizations = ['Table', 'Bar', 'Line', 'Pie'];

  const [report, setReport] = useState({
    module: 'Sales',
    fields: [],
    filters: '',
    groupBy: '',
    aggregate: '',
    timeRange: '',
    visualization: 'Table',
    name: '',
  });

  const toggleField = (field) => {
    setReport(prev => ({
      ...prev,
      fields: prev.fields.includes(field)
        ? prev.fields.filter(f => f !== field)
        : [...prev.fields, field],
    }));
  };

  const handleGenerate = () => {
    alert(`✅ Report "${report.name || 'Untitled'}" Generated`);
  };

  const renderChart = () => {
    switch (report.visualization) {
      case 'Bar':
        return (
          <BarChart data={sampleData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#0e7490" />
          </BarChart>
        );
      case 'Line':
        return (
          <RLineChart data={sampleData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#0e7490" />
          </RLineChart>
        );
      case 'Pie':
        return (
          <RPieChart>
            <Pie
              data={sampleData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#0e7490"
              label
            >
              {sampleData.map((_, idx) => (
                <Cell key={idx} fill={`hsl(${idx * 70}, 70%, 50%)`} />
              ))}
            </Pie>
            <Tooltip />
          </RPieChart>
        );
      default:
        return <p className="text-gray-500">📋 No chart for table view.</p>;
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <FileBarChart2 className="text-cyan-600" /> Custom Report Builder
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold">Report Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={report.name}
            onChange={(e) => setReport({ ...report, name: e.target.value })}
            placeholder="e.g. Monthly Sales Summary"
          />
        </div>
        <div>
          <label className="font-semibold">Module</label>
          <select
            className="w-full border p-2 rounded"
            value={report.module}
            onChange={(e) =>
              setReport({ ...report, module: e.target.value, fields: [] })
            }
          >
            {Object.keys(modules).map(mod => <option key={mod}>{mod}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="font-semibold">Fields (Click to Toggle)</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {modules[report.module].map(field => (
            <button
              key={field}
              onClick={() => toggleField(field)}
              className={`px-3 py-1 rounded border transition ${
                report.fields.includes(field)
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold flex items-center gap-2"><Filter size={16} /> Filter Condition</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="e.g. Amount > 1000"
            value={report.filters}
            onChange={(e) => setReport({ ...report, filters: e.target.value })}
          />
        </div>
        <div>
          <label className="font-semibold flex items-center gap-2"><CalendarDays size={16} /> Time Range</label>
          <select
            className="w-full border p-2 rounded"
            value={report.timeRange}
            onChange={(e) => setReport({ ...report, timeRange: e.target.value })}
          >
            {timePresets.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-semibold flex items-center gap-2"><Columns3 size={16} /> Group By</label>
          <select
            className="w-full border p-2 rounded"
            value={report.groupBy}
            onChange={(e) => setReport({ ...report, groupBy: e.target.value })}
          >
            <option value="">None</option>
            {report.fields.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="font-semibold flex items-center gap-2"><BarChart3 size={16} /> Aggregate</label>
          <select
            className="w-full border p-2 rounded"
            value={report.aggregate}
            onChange={(e) => setReport({ ...report, aggregate: e.target.value })}
          >
            <option value="">None</option>
            {aggregates.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="font-semibold flex items-center gap-2"><LineChart size={16} /> Visualization</label>
        <div className="flex gap-3 mt-2">
          {visualizations.map(viz => (
            <button
              key={viz}
              onClick={() => setReport({ ...report, visualization: viz })}
              className={`flex items-center gap-1 px-4 py-2 rounded border ${
                report.visualization === viz
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {viz === 'Table' ? <Table size={16} /> : viz === 'Bar' ? <BarChart3 size={16} /> : viz === 'Line' ? <LineChart size={16} /> : <PieChart size={16} />}
              {viz}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-80 mt-4 border rounded p-2 bg-gray-50">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <button className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
          <Save size={16} /> Save Template
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
          <Download size={16} /> Export
        </button>
        <button
          onClick={handleGenerate}
          className="bg-cyan-700 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-cyan-800"
        >
          <Plus size={16} /> Generate Report
        </button>
      </div>
    </div>
  );
};

export default CustomReportBuilder;
