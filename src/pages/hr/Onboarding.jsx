import { useState } from 'react';
import {
  ClipboardList, AlertTriangle, UploadCloud, FileText, BadgeCheck, Users, ChevronRight
} from 'lucide-react';

const onboardingTasks = [
  { task: 'Fill employee profile', dept: 'HR' },
  { task: 'Upload ID and photo', dept: 'HR' },
  { task: 'Sign contract & NDA', dept: 'HR/Legal' },
  { task: 'Assign shift & work location', dept: 'HR' },
  { task: 'Set salary & bank details', dept: 'HR/Payroll' },
  { task: 'Assign supervisor', dept: 'HR' },
  { task: 'Add to payroll group', dept: 'Payroll/Finance' },
  { task: 'Issue ID card & uniform', dept: 'Admin/Logistics' },
  { task: 'Assign tools or machines', dept: 'Inventory/HR' },
  { task: 'Create system login credentials', dept: 'IT' },
  { task: 'Grant ERP role permissions', dept: 'HR/IT' },
  { task: 'Schedule onboarding training', dept: 'HR/Training' },
  { task: 'Sign policy acknowledgements', dept: 'HR' },
];

const defaultForm = {
  name: '', dob: '', gender: '', address: '', phone: '',
  title: '', dept: '', shift: '', site: '',
  bank: '', acc: '', emergencyContact: '',
};

const Onboarding = () => {
  const [tasks, setTasks] = useState(onboardingTasks.map(t => ({ ...t, completed: false })));
  const [form, setForm] = useState(defaultForm);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);
  const [employees, setEmployees] = useState([]);

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploaded]);
  };

  const handleSubmit = () => {
    const missingFields = ['bank', 'acc'].filter(f => !form[f]);
    if (missingFields.length) {
      alert(`⚠️ Missing critical fields: ${missingFields.join(', ')}`);
      return;
    }
    setEmployees([...employees, { ...form, tasks, files }]);
    setForm(defaultForm);
    setTasks(onboardingTasks.map(t => ({ ...t, completed: false })));
    setFiles([]);
    setNotes('');
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">

        {/* Header & Progress */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
              <BadgeCheck className="text-blue-600 w-8 h-8" /> Employee Onboarding
            </h1>
            <p className="text-gray-600 text-lg">Streamline your new hire process with an interactive checklist.</p>
          </div>
          <div className="mt-4 sm:mt-0 text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Submit Onboarding
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Onboarding Checklist & Progress */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  <ClipboardList className="text-green-500 w-6 h-6" /> Onboarding Checklist
                </h2>
                <div className="text-lg font-medium text-blue-600">
                  {completedTasksCount}/{totalTasks} Completed
                </div>
              </div>

              <div className="space-y-4">
                {tasks.map((t, idx) => (
                  <label key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      checked={t.completed}
                      onChange={() => toggleTask(idx)}
                    />
                    <div>
                      <div className={`font-medium text-gray-800 ${t.completed ? 'line-through text-gray-500' : ''}`}>{t.task}</div>
                      <div className="text-sm text-gray-500">{t.dept}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Employee Information Form */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
                <Users className="text-purple-500 w-6 h-6" /> Employee Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.keys(form).map(key => (
                  <input
                    key={key}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()} // Nicer placeholder for camelCase
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Files & Notes */}
          <div className="lg:col-span-1 space-y-8">
            {/* File Attachments Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
                <UploadCloud className="text-orange-500 w-6 h-6" /> File Attachments
              </h2>
              <label className="block bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg cursor-pointer border-2 border-dashed border-blue-300 text-center transition duration-150 ease-in-out">
                Upload Files
                <input type="file" multiple onChange={handleFileUpload} className="hidden" />
              </label>
              <ul className="mt-4 space-y-2 text-gray-700">
                {files.length === 0 ? (
                  <li className="text-sm text-gray-500 italic">No files attached yet.</li>
                ) : (
                  files.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md">
                      <FileText className="w-4 h-4 text-gray-500" /> {f.name}
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Comments/Notes Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
                <FileText className="text-teal-500 w-6 h-6" /> Comments / Notes
              </h2>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out resize-y min-h-[100px]"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any remarks or blockers here..."
              />
            </div>
          </div>
        </div>

        {/* Onboarded Employees Table (conditionally rendered) */}
        {employees.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-3">
              <Users className="text-blue-600 w-6 h-6" /> Recently Onboarded Employees
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((emp, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.dept}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.shift}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.bank}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold flex items-center">
                        <BadgeCheck className="w-5 h-5 mr-1" /> Onboarded
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;