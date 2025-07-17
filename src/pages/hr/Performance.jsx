// src/pages/hr/Performance.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, // For export
  X, // For close button
  Users, // For total evaluated
  TrendingUp, // For top score and overall trend
  Target, // For average score
  Hourglass, // For pending reviews
  Filter, // For filter section
  Search, // For employee search (if added later)
  Award, // For outstanding alerts
  AlertCircle, // For general alerts
  ArrowUpCircle, // For positive trend
  ArrowDownCircle, // For negative trend
  MinusCircle, // For neutral trend
  ChevronsRight, // For view action
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockRecords = [
  {
    id: 1,
    employee: 'Abebe Kebede',
    department: 'Production',
    kpis: 'Task Completion, Attendance, Efficiency',
    rating: 4.5,
    notes: 'Excellent work ethic, consistently exceeds expectations. Plays a crucial role in team productivity. Ready for leadership opportunities.',
    period: 'Q2 2025',
    score: 95, // Increased for "Promotion Ready"
    alerts: [{ type: 'success', message: 'Promotion Ready' }],
    trends: [
      { period: 'Q4 2024', score: 89 },
      { period: 'Q1 2025', score: 91 },
      { period: 'Q2 2025', score: 95 },
    ],
  },
  {
    id: 2,
    employee: 'Mekdes Tsegaye',
    department: 'QC',
    kpis: 'QC Pass Rate, Punctuality, Attention to Detail',
    rating: 3.2,
    notes: 'Needs significant improvement on punctuality and adherence to quality standards. Performance has declined. Requires a detailed action plan.',
    period: 'Q2 2025',
    score: 62, // Adjusted for "Below Target" and "Performance Decline"
    alerts: [{ type: 'warning', message: 'Below Target' }, { type: 'danger', message: 'Performance Decline' }],
    trends: [
      { period: 'Q4 2024', score: 85 },
      { period: 'Q1 2025', score: 78 },
      { period: 'Q2 2025', score: 62 },
    ],
  },
  {
    id: 3,
    employee: 'Fikadu Dinku',
    department: 'Projects',
    kpis: 'Project Delivery, Leadership, Client Satisfaction',
    rating: 4.8,
    notes: 'Demonstrated strong leadership on recent custom project, leading to early completion and high client satisfaction. A true asset.',
    period: 'Q2 2025',
    score: 98,
    alerts: [{ type: 'success', message: 'Outstanding Performer' }, { type: 'info', message: 'Eligible for Bonus' }],
    trends: [
      { period: 'Q4 2024', score: 92 },
      { period: 'Q1 2025', score: 95 },
      { period: 'Q2 2025', score: 98 },
    ],
  },
  {
    id: 4,
    employee: 'Sara Worku',
    department: 'Sales',
    kpis: 'Sales Volume, Customer Retention',
    rating: 3.9,
    notes: 'Consistent sales performance. Customer retention efforts are commendable. Could improve on lead generation.',
    period: 'Q2 2025',
    score: 82,
    alerts: [{ type: 'info', message: 'Meeting Expectations' }],
    trends: [
      { period: 'Q4 2024', score: 79 },
      { period: 'Q1 2025', score: 81 },
      { period: 'Q2 2025', score: 82 },
    ],
  },
  {
    id: 5,
    employee: 'Bereket Wondwosen',
    department: 'HR',
    kpis: 'Employee Satisfaction, Recruitment Efficiency',
    rating: 4.1,
    notes: 'Proactive in improving employee relations. Recruitment targets consistently met. Strong team player.',
    period: 'Q2 2025',
    score: 88,
    alerts: [],
    trends: [
      { period: 'Q4 2024', score: 80 },
      { period: 'Q1 2025', score: 84 },
      { period: 'Q2 2025', score: 88 },
    ],
  },
];

const getScoreColorClass = (score) => {
  if (score >= 90) return 'text-green-500 dark:text-green-400';
  if (score >= 75) return 'text-cyan-500 dark:text-cyan-400';
  if (score >= 60) return 'text-yellow-500 dark:text-yellow-400';
  return 'text-red-500 dark:text-red-400';
};

const getAlertBadgeClass = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'warning':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    case 'danger':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    case 'info':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getTrendArrow = (trends) => {
  if (!trends || trends.length < 2) return <MinusCircle size={16} className="text-gray-400" />;
  const latestScore = trends[trends.length - 1].score;
  const previousScore = trends[trends.length - 2].score;

  if (latestScore > previousScore) {
    return <ArrowUpCircle size={16} className="text-green-500" />;
  } else if (latestScore < previousScore) {
    return <ArrowDownCircle size={16} className="text-red-500" />;
  } else {
    return <MinusCircle size={16} className="text-gray-400" />;
  }
};

const Performance = () => {
  const [records] = useState(mockRecords);
  const [selected, setSelected] = useState(null);
  const [department, setDepartment] = useState('');
  const [period, setPeriod] = useState('');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');

  const availableDepartments = [...new Set(mockRecords.map(rec => rec.department))];
  const availablePeriods = [...new Set(mockRecords.map(rec => rec.period))].sort((a, b) => b.localeCompare(a)); // Sort periods

  const filteredRecords = records.filter((rec) => {
    const matchesDept = department ? rec.department === department : true;
    const matchesPeriod = period ? rec.period === period : true;
    const matchesMin = minScore !== '' ? rec.score >= Number(minScore) : true;
    const matchesMax = maxScore !== '' ? rec.score <= Number(maxScore) : true;
    return matchesDept && matchesPeriod && matchesMin && matchesMax;
  });

  const avgScore = records.length > 0
    ? (records.reduce((sum, r) => sum + r.score, 0) / records.length).toFixed(1)
    : 0;

  const summary = {
    total: records.length,
    top: records.length > 0 ? Math.max(...records.map((r) => r.score)) : 0,
    avg: avgScore,
    pending: 1, // Placeholder, ideally calculated based on a 'pending review' status
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <TrendingUp className="text-blue-600 dark:text-blue-400 w-9 h-9" />
        Performance Evaluations
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex items-center gap-4 transition-transform hover:scale-[1.02] duration-200 border border-gray-200 dark:border-gray-700">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Evaluated</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{summary.total}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex items-center gap-4 transition-transform hover:scale-[1.02] duration-200 border border-gray-200 dark:border-gray-700">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Top Score</p>
            <h3 className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{summary.top}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex items-center gap-4 transition-transform hover:scale-[1.02] duration-200 border border-gray-200 dark:border-gray-700">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Score</p>
            <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{summary.avg}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex items-center gap-4 transition-transform hover:scale-[1.02] duration-200 border border-gray-200 dark:border-gray-700">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400">
            <Hourglass size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Reviews</p>
            <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">{summary.pending}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Filter size={20} className="text-blue-500 dark:text-blue-400" /> Filter Evaluations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <select
              className="appearance-none w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-10"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              className="appearance-none w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-10"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="">All Periods</option>
              {availablePeriods.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <input
            type="number"
            placeholder="Min Score"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            min="0"
            max="100"
          />
          <input
            type="number"
            placeholder="Max Score"
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            min="0"
            max="100"
          />
        </div>
      </div>

      {/* Performance Table */}
      <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Period</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">KPIs</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trend</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alerts</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No performance records found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{rec.employee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{rec.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{rec.department}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-600 dark:text-gray-300">{rec.kpis}</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-bold ${getScoreColorClass(rec.score)}`}>
                      {rec.score} / 100
                    </td>
                    <td className="px-6 py-4 w-[120px]">
                      {rec.trends && rec.trends.length > 0 ? (
                        <div className="flex items-center gap-2">
                          {getTrendArrow(rec.trends)}
                          <ResponsiveContainer width="100%" height={40}>
                            <LineChart data={rec.trends} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                              <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#3b82f6" // blue-500
                                strokeWidth={2}
                                dot={false}
                                animationDuration={300}
                              />
                              <XAxis dataKey="period" hide />
                              <YAxis domain={[Math.min(...rec.trends.map(t => t.score)) - 5, Math.max(...rec.trends.map(t => t.score)) + 5]} hide />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(55, 65, 81, 0.9)', // dark-gray-700
                                  borderColor: '#4b5563', // dark-gray-600
                                  borderRadius: '8px',
                                  color: '#e5e7eb', // gray-200
                                  fontSize: '12px',
                                  padding: '8px',
                                }}
                                itemStyle={{ color: '#e5e7eb' }}
                                labelStyle={{ color: '#9ca3af' }}
                                formatter={(value) => [`Score: ${value}`, '']} // Display only score
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600 italic">No trend data</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-y-1">
                      {rec.alerts.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {rec.alerts.map((alert, i) => (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getAlertBadgeClass(alert.type)}`}
                            >
                              {alert.message}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelected(rec)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1 transition-colors duration-200"
                      >
                        View <ChevronsRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl relative border border-gray-200 dark:border-gray-700"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <FileText className="text-blue-600 dark:text-blue-400" /> Evaluation Details: {selected.employee}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-base mb-6">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Review Period</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{selected.period}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Department</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{selected.department}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Key Performance Indicators (KPIs)</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{selected.kpis}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Overall Rating</p>
                  <p className={`font-bold text-xl ${getScoreColorClass(selected.score)}`}>{selected.rating} / 5</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Score</p>
                  <p className={`font-bold text-xl ${getScoreColorClass(selected.score)}`}>{selected.score} / 100</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Manager Notes</p>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    {selected.notes}
                  </p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Alerts</p>
                  {selected.alerts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selected.alerts.map((alert, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getAlertBadgeClass(alert.type)}`}
                        >
                          <AlertCircle size={16} /> {alert.message}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 italic">No specific alerts for this evaluation.</span>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-base font-medium shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  <FileText size={20} />
                  Export PDF
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center justify-center text-base font-medium shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  Start Next Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Performance;