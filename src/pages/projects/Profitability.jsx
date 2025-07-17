import { useState } from "react";
import {
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const dummyProjects = [
  {
    id: 1,
    name: "Project #001 - Sofa Set",
    estimated: { material: 4000, labor: 1500, overhead: 500, delivery: 300 },
    actual: { material: 4200, labor: 1600, overhead: 600, delivery: 350, rework: 200 },
    salePrice: 8000,
  },
  {
    id: 2,
    name: "Project #002 - Wardrobe",
    estimated: { material: 3000, labor: 1200, overhead: 400, delivery: 250 },
    actual: { material: 3100, labor: 1100, overhead: 420, delivery: 250, rework: 0 },
    salePrice: 7000,
  },
  {
    id: 3,
    name: "Project #003 - Dining Table",
    estimated: { material: 5000, labor: 1800, overhead: 600, delivery: 400 },
    actual: { material: 5400, labor: 1900, overhead: 700, delivery: 420, rework: 100 },
    salePrice: 10000,
  },
  {
    id: 4,
    name: "Project #004 - Bookshelf",
    estimated: { material: 2500, labor: 800, overhead: 300, delivery: 200 },
    actual: { material: 2400, labor: 850, overhead: 280, delivery: 180, rework: 50 },
    salePrice: 6000,
  },
];

const total = (obj) =>
  Object.values(obj).reduce((sum, v) => sum + Number(v || 0), 0);

const getMargin = (sale, cost) => ((sale - cost) / sale) * 100;

export default function Profitability() {
  const [projects] = useState(dummyProjects);
  const [selected, setSelected] = useState(null);

  const handleOpenPanel = (project) => {
    setSelected(project);
  };

  const handleClosePanel = () => {
    setSelected(null);
  };

  const getStatusIcon = (margin) => {
    if (margin < 0)
      return <TrendingDown className="text-red-600 inline-block mr-1" size={16} />;
    if (margin < 20)
      return <AlertTriangle className="text-yellow-600 inline-block mr-1" size={16} />;
    return <CheckCircle className="text-green-600 inline-block mr-1" size={16} />;
  };

  const formatETB = (value) => `ETB ${value.toLocaleString()}`;

  const chartData = projects.map((p) => ({
    name: p.name,
    estimated: total(p.estimated),
    actual: total(p.actual),
    margin: Number(getMargin(p.salePrice, total(p.actual)).toFixed(2)),
  }));

  return (
    <div className="relative flex flex-col lg:flex-row h-full">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">📊 Project Profitability</h1>

        <div className="overflow-x-auto rounded-lg border shadow text-sm bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
              <tr>
                <th className="p-3">Project</th>
                <th className="p-3">Estimated Cost</th>
                <th className="p-3">Actual Cost</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">Profit Margin</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const est = total(p.estimated);
                const act = total(p.actual);
                const profit = p.salePrice - act;
                const margin = getMargin(p.salePrice, act).toFixed(2);

                return (
                  <tr
                    key={p.id}
                    onClick={() => handleOpenPanel(p)}
                    className="border-b cursor-pointer hover:bg-gray-50"
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{formatETB(est)}</td>
                    <td className="p-3">{formatETB(act)}</td>
                    <td className="p-3">{formatETB(p.salePrice)}</td>
                    <td className="p-3 font-semibold">{margin}%</td>
                    <td className="p-3">
                      {getStatusIcon(margin)} {margin < 0 ? 'Loss' : margin < 20 ? 'Low' : 'Healthy'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">📈 Margin % by Project</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="margin" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">💰 Estimated vs Actual Cost</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="estimated" fill="#60a5fa" />
                <Bar dataKey="actual" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
            <h2 className="font-semibold mb-2">📊 Margin Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="margin" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail Side Panel */}
      {selected && (
        <div className="w-full lg:w-[400px] border-l border-gray-300 bg-white shadow-xl p-5 absolute lg:relative right-0 top-0 h-full z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{selected.name}</h2>
            <button onClick={handleClosePanel}>
              <X size={20} className="text-gray-500 hover:text-black" />
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <p><Info className="inline mr-1 text-gray-500" size={14} /> <strong>Revenue:</strong> {formatETB(selected.salePrice)}</p>
            <p><strong>Estimated Cost:</strong> {formatETB(total(selected.estimated))}</p>
            <ul className="ml-4 list-disc">
              {Object.entries(selected.estimated).map(([k, v]) => (
                <li key={k} className="text-gray-700">{k}: {formatETB(v)}</li>
              ))}
            </ul>
            <p><strong>Actual Cost:</strong> {formatETB(total(selected.actual))}</p>
            <ul className="ml-4 list-disc">
              {Object.entries(selected.actual).map(([k, v]) => (
                <li key={k} className="text-gray-700">{k}: {formatETB(v)}</li>
              ))}
            </ul>
            <p><strong>Profit:</strong> {formatETB(selected.salePrice - total(selected.actual))}</p>
            <p><strong>Margin:</strong> {getMargin(selected.salePrice, total(selected.actual)).toFixed(2)}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
