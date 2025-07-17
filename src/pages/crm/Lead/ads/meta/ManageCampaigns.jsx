import { useState } from "react";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  DollarSign,
  Activity,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const campaignReports = [
  {
    id: "1",
    name: "Spring Sale",
    metrics: {
      impressions: 120000,
      clicks: 8500,
      conversions: 1200,
      spend: 4800,
      revenue: 15000,
    },
    trends: {
      cpa: [4.2, 4.1, 4.0, 3.9, 4.0, 4.1, 4.0],
      roas: [2.8, 3.0, 3.2, 3.5, 3.3, 3.1, 3.4],
    },
    audience: {
      ageGroups: { "18-24": 300, "25-34": 600, "35-44": 200, "45-54": 80, "55+": 20 },
      gender: { male: 700, female: 500 },
    },
    geography: { USA: 500, Canada: 300, UK: 200, Germany: 100, Others: 100 },
    topCreatives: [
      { id: "c1", type: "Image", description: "Spring Sale Banner 1", clicks: 4000, conversions: 600 },
      { id: "c2", type: "Video", description: "Promo Video 15s", clicks: 4500, conversions: 600 },
    ],
  },{
  "id": "2",
  "name": "Summer Blast",
  "metrics": {
    "impressions": 250000,
    "clicks": 18000,
    "conversions": 3500,
    "spend": 12000,
    "revenue": 48000
  },
  "trends": {
    "cpa": [3.8, 3.5, 3.4, 3.2, 3.0, 3.1, 3.3],
    "roas": [3.5, 3.8, 4.0, 4.2, 4.5, 4.3, 4.1]
  },
  "audience": {
    "ageGroups": { "18-24": 700, "25-34": 1500, "35-44": 800, "45-54": 400, "55+": 100 },
    "gender": { "male": 1800, "female": 1700 }
  },
  "geography": { "USA": 1800, "Mexico": 500, "Spain": 400, "Brazil": 300, "Others": 500 },
  "topCreatives": [
    { "id": "c3", "type": "Video", "description": "Summer Vibes Ad", "clicks": 9000, "conversions": 1800 },
    { "id": "c4", "type": "Image", "description": "Beach Fun Carousel", "clicks": 7000, "conversions": 1500 }
  ]
},{
  "id": "3",
  "name": "Back to School Deals",
  "metrics": {
    "impressions": 180000,
    "clicks": 11000,
    "conversions": 2100,
    "spend": 7500,
    "revenue": 32000
  },
  "trends": {
    "cpa": [3.5, 3.6, 3.4, 3.5, 3.7, 3.6, 3.5],
    "roas": [4.0, 4.2, 4.5, 4.3, 4.1, 4.2, 4.3]
  },
  "audience": {
    "ageGroups": { "18-24": 400, "25-34": 900, "35-44": 1200, "45-54": 500, "55+": 100 },
    "gender": { "male": 1000, "female": 1100 }
  },
  "geography": { "USA": 1200, "Canada": 400, "Australia": 300, "New Zealand": 100, "Others": 100 },
  "topCreatives": [
    { "id": "c5", "type": "Image", "description": "School Supplies Banner", "clicks": 6000, "conversions": 1200 },
    { "id": "c6", "type": "Video", "description": "Backpack Promo", "clicks": 5000, "conversions": 900 }
  ]
},{
  "id": "4",
  "name": "Holiday Gifting Guide",
  "metrics": {
    "impressions": 300000,
    "clicks": 25000,
    "conversions": 5000,
    "spend": 20000,
    "revenue": 95000
  },
  "trends": {
    "cpa": [4.0, 3.9, 3.8, 3.7, 3.6, 3.5, 3.4],
    "roas": [4.7, 4.8, 4.9, 5.0, 5.2, 5.1, 5.0]
  },
  "audience": {
    "ageGroups": { "18-24": 800, "25-34": 2000, "35-44": 1500, "45-54": 600, "55+": 100 },
    "gender": { "male": 2200, "female": 2800 }
  },
  "geography": { "USA": 2500, "UK": 1000, "Canada": 800, "France": 500, "Others": 200 },
  "topCreatives": [
    { "id": "c7", "type": "Video", "description": "Gift Ideas Compilation", "clicks": 13000, "conversions": 2800 },
    { "id": "c8", "type": "Image", "description": "Cozy Holiday Ad", "clicks": 12000, "conversions": 2200 }
  ]
},{
  "id": "5",
  "name": "New Year, New You",
  "metrics": {
    "impressions": 150000,
    "clicks": 9500,
    "conversions": 1800,
    "spend": 6000,
    "revenue": 28000
  },
  "trends": {
    "cpa": [3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.7],
    "roas": [4.5, 4.4, 4.3, 4.2, 4.1, 4.0, 4.1]
  },
  "audience": {
    "ageGroups": { "18-24": 500, "25-34": 1000, "35-44": 200, "45-54": 80, "55+": 20 },
    "gender": { "male": 900, "female": 900 }
  },
  "geography": { "USA": 900, "Canada": 400, "Mexico": 300, "Australia": 100, "Others": 100 },
  "topCreatives": [
    { "id": "c9", "type": "Image", "description": "Fitness Goals Ad", "clicks": 5000, "conversions": 1000 },
    { "id": "c10", "type": "Video", "description": "Wellness Journey Promo", "clicks": 4500, "conversions": 800 }
  ]
},
];

const formatNumber = (num) => num.toLocaleString();

const KPIIcon = {
  Impressions: <Eye className="text-blue-500" size={20} />,
  Clicks: <MousePointerClick className="text-indigo-500" size={20} />,
  Conversions: <TrendingUp className="text-green-500" size={20} />,
  Spend: <DollarSign className="text-red-500" size={20} />,
  Revenue: <DollarSign className="text-emerald-500" size={20} />,
  CPA: <Activity className="text-orange-500" size={20} />,
  ROAS: <Activity className="text-teal-500" size={20} />,
};

export default function CampaignDashboard() {
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaignReports[0].id);
  const selectedCampaign = campaignReports.find(c => c.id === selectedCampaignId);
  const [modalData, setModalData] = useState(null);
  const { impressions, clicks, conversions, spend, revenue } = selectedCampaign.metrics;
  const cpa = conversions ? (spend / conversions).toFixed(2) : "-";
  const roas = spend ? (revenue / spend).toFixed(2) : "-";

  const metrics = {
    Impressions: formatNumber(impressions),
    Clicks: formatNumber(clicks),
    Conversions: formatNumber(conversions),
    Spend: `$${spend.toFixed(2)}`,
    Revenue: `$${revenue.toFixed(2)}`,
    CPA: cpa === "-" ? "-" : `$${cpa}`,
    ROAS: roas,
  };

  const ageData = Object.entries(selectedCampaign.audience.ageGroups).map(([key, value], i) => ({
    name: key,
    value,
  }));

  const geoData = Object.entries(selectedCampaign.geography).map(([region, count]) => ({ name: region, count }));

  const trendData = selectedCampaign.trends.cpa.map((value, i) => ({ day: `Day ${i + 1}`, cpa: value, roas: selectedCampaign.trends.roas[i] }));

  return (
    <main className="bg-gray-100 min-h-screen p-6">
      <header className="mb-6">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-xl backdrop-blur-sm">
          <h1 className="text-3xl font-bold">📊 Campaign Performance Dashboard</h1>

        </div>
      </header>
            <div className="my-4 max-w-xs">
            <label
                htmlFor="campaign"
                className="block text-sm font-semibold text-cyan-700 mb-2"
            >
                Select Campaign:
            </label>
            <select
                id="campaign"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition"
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
            >
                {campaignReports.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                </option>
                ))}
            </select>
            </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(metrics).map(([label, value], index) => (
          <motion.div
            key={label}
            className="bg-white p-4 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {KPIIcon[label]}
            <div>
              <p className="text-gray-600 text-sm">{label}</p>
              <p className="text-xl font-semibold text-gray-800">{value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">👥 Age Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={ageData} dataKey="value" nameKey="name" outerRadius={100} label>
                {ageData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 shadow cursor-pointer" onClick={() => setModalData({ type: "geo", data: geoData })}>
          <h2 className="text-lg font-semibold mb-2 text-gray-700">🌍 Geographic Performance (Click to Explore)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={geoData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={100} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 10, 10, 0]} />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">📈 CPA & ROAS Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cpa" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="roas" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">🎨 Top Performing Creatives</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Clicks</th>
              <th className="text-left p-2">Conversions</th>
            </tr>
          </thead>
          <tbody>
            {selectedCampaign.topCreatives.map((creative) => (
              <tr key={creative.id} className="border-t cursor-pointer hover:bg-gray-50" onClick={() => setModalData({ type: "creative", data: creative })}>
                <td className="p-2">{creative.description}</td>
                <td className="p-2">{creative.type}</td>
                <td className="p-2">{formatNumber(creative.clicks)}</td>
                <td className="p-2">{formatNumber(creative.conversions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full relative">
            <button onClick={() => setModalData(null)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <X size={20} />
            </button>
            {modalData.type === "creative" ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">{modalData.data.description}</h3>
                <p className="mb-1"><strong>Type:</strong> {modalData.data.type}</p>
                <p><strong>Clicks:</strong> {formatNumber(modalData.data.clicks)} | <strong>Conversions:</strong> {formatNumber(modalData.data.conversions)}</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">Region Breakdown</h3>
                <ul className="space-y-1">
                  {modalData.data.map((item) => (
                    <li key={item.name}>{item.name}: {item.count}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
