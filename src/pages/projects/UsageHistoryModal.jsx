// UsageHistoryModal.jsx
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockHistory = [
  {
    taskId: 'Cutting Task #112',
    project: 'Dining Table',
    employee: 'Yonas',
    start: '2025-07-06 10:00',
    end: '2025-07-06 12:00',
    hours: 2,
  },
  {
    taskId: 'Cutting Task #085',
    project: 'Wardrobe',
    employee: 'Sami',
    start: '2025-07-02 14:00',
    end: '2025-07-02 17:00',
    hours: 3,
  },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

const UsageHistoryModal = ({ tool, onClose }) => {
  return (
    <AnimatePresence>
      {tool && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4 bg-gray-50">
              <h2 className="text-lg font-semibold">
                🕓 Usage History — <span className="text-blue-600">{tool.name}</span>
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-red-600">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {mockHistory.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No usage records found.</p>
              ) : (
                <table className="w-full text-sm table-auto">
                  <thead className="border-b text-gray-600 text-left">
                    <tr>
                      <th className="pb-2">Task</th>
                      <th className="pb-2">Project</th>
                      <th className="pb-2">Employee</th>
                      <th className="pb-2">Start</th>
                      <th className="pb-2">End</th>
                      <th className="pb-2 text-right">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHistory.map((entry, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2">{entry.taskId}</td>
                        <td className="py-2">{entry.project}</td>
                        <td className="py-2">{entry.employee}</td>
                        <td className="py-2">{entry.start}</td>
                        <td className="py-2">{entry.end}</td>
                        <td className="py-2 text-right">{entry.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UsageHistoryModal;
