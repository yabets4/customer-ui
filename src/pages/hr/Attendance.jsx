import { useState, useMemo } from 'react';
import { UploadCloud, X, AlertCircle, Clock, Users, Search, CheckCircle, Link, Slash, Ban } from 'lucide-react'; // Added more icons for better visual cues

const Attendance = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Expanded mock data for better representation
  const logs = [
    {
      id: 1,
      name: 'Abebe Kebede',
      date: '2025-07-08',
      shift: '09:00 - 17:00',
      timeIn: '08:58',
      timeOut: '17:05',
      breakMinutes: 45,
      hours: 8.78,
      overtime: 0.78,
      status: 'Present',
      exceptions: [],
      location: 'Headquarters',
      method: 'Fingerprint',
      payrollLinked: true,
    },
    {
      id: 2,
      name: 'Mekdes Tsegaye',
      date: '2025-07-08',
      shift: '09:00 - 17:00',
      timeIn: '09:15',
      timeOut: '16:30',
      breakMinutes: 60,
      hours: 6.25, // Adjusted to 6.25 actual work hours (16:30 - 9:15 - 1hr break = 7.25 - 1 = 6.25)
      overtime: 0,
      status: 'Late',
      exceptions: ['🟠 Late In', '🔴 Early Out'],
      location: 'Factory A',
      method: 'Mobile App',
      payrollLinked: true,
    },
    {
      id: 3,
      name: 'Fikadu Dinku',
      date: '2025-07-08',
      shift: '09:00 - 17:00',
      timeIn: null,
      timeOut: null,
      breakMinutes: 0,
      hours: 0,
      overtime: 0,
      status: 'Absent',
      exceptions: ['❌ No Punch Recorded', '🚨 Unexplained Absence'],
      location: '-',
      method: 'Manual',
      payrollLinked: false,
    },
    {
      id: 4,
      name: 'Sara Worku',
      date: '2025-07-08',
      shift: '10:00 - 18:00',
      timeIn: '10:00',
      timeOut: '18:00',
      breakMinutes: 30,
      hours: 7.5,
      overtime: 0,
      status: 'Present',
      exceptions: [],
      location: 'HQ',
      method: 'QR',
      payrollLinked: true,
    },
    {
      id: 5,
      name: 'Kebede Abebe',
      date: '2025-07-08',
      shift: '08:00 - 16:00',
      timeIn: '07:55',
      timeOut: '17:30',
      breakMinutes: 60,
      hours: 8.58,
      overtime: 1.58,
      status: 'Present',
      exceptions: ['🟢 Overtime Approved'],
      location: 'Factory B',
      method: 'Fingerprint',
      payrollLinked: true,
    },
  ];

  const filteredLogs = logs.filter((log) =>
    log.name.toLowerCase().includes(search.toLowerCase()) ||
    log.date.includes(search) ||
    log.status.toLowerCase().includes(search.toLowerCase())
  );

  const summary = useMemo(() => {
    const total = logs.length;
    const present = logs.filter((l) => l.status === 'Present').length;
    const late = logs.filter((l) => l.status === 'Late').length;
    const absent = logs.filter((l) => l.status === 'Absent').length;
    const totalOvertime = logs.reduce((sum, l) => sum + l.overtime, 0);
    const totalExceptions = logs.reduce((sum, l) => sum + l.exceptions.length, 0);

    return { total, present, late, absent, totalOvertime, totalExceptions };
  }, [logs]);

  const statusColor = {
    Present: 'text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300',
    Late: 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
    Absent: 'text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300',
  };

  const methodBadge = {
    QR: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    'Mobile App': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    Fingerprint: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    Manual: 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Clock className="text-blue-600 dark:text-blue-400 w-8 h-8" />
          Attendance Dashboard
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 text-base font-medium"
        >
          <UploadCloud size={20} />
          Upload Logs
        </button>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-200">
          <CheckCircle className="text-green-500 w-10 h-10 mb-2" />
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Present Today</h4>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{summary.present}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-200">
          <AlertCircle className="text-yellow-500 w-10 h-10 mb-2" />
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Late Arrivals</h4>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 mt-1">{summary.late}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-200">
          <Ban className="text-red-500 w-10 h-10 mb-2" />
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Absent Employees</h4>
          <p className="text-3xl font-bold text-red-700 dark:text-red-400 mt-1">{summary.absent}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-200">
          <Clock className="text-blue-500 w-10 h-10 mb-2" />
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Overtime (Hrs)</h4>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-1">{summary.totalOvertime.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-200">
          <AlertCircle className="text-purple-500 w-10 h-10 mb-2" />
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Exceptions</h4>
          <p className="text-3xl font-bold text-purple-700 dark:text-purple-400 mt-1">{summary.totalExceptions}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by employee name or date..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base shadow-sm transition-colors duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto"> {/* Ensures horizontal scrolling on small screens */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Break</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exceptions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payroll Link</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="13" className="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                    No attendance logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{log.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{log.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{log.shift}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{log.timeIn || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{log.timeOut || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{log.breakMinutes} min</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{log.hours.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.overtime > 0 ? (
                        <span className="text-green-700 dark:text-green-400 font-semibold flex items-center gap-1">
                          <Clock size={16} /> +{log.overtime}h
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-y-1">
                      {log.exceptions.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {log.exceptions.map((ex, i) => (
                            <span key={i} className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                              <AlertCircle size={14} /> {ex}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-600 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                          <CheckCircle size={14} /> No Issues
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                          statusColor[log.status] || 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full ${methodBadge[log.method]}`}
                      >
                        {log.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{log.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.payrollLinked ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          <Link size={16} /> Linked
                        </span>
                      ) : (
                        <span className="text-red-500 dark:text-red-400 italic flex items-center gap-1">
                          <Slash size={16} /> Not Linked
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative transform scale-100 opacity-100 transition-all duration-300 ease-out">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <UploadCloud className="text-blue-600 dark:text-blue-400" /> Upload Attendance Logs
            </h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6 bg-gray-50 dark:bg-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer">
              <input type="file" className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <UploadCloud className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">Drag and drop or <span className="text-blue-600 dark:text-blue-400 hover:underline">browse files</span></p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">CSV, XLSX, or TXT files only (max 10MB)</p>
              </label>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 font-semibold"
            >
              Submit Upload
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Attendance;