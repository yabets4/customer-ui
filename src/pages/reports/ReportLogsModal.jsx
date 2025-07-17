// src/pages/reports/ReportLogsModal.jsx
const ReportLogsModal = ({ report, onClose }) => {
  const mockLog = {
    lastSent: '2025-07-01 08:00 AM',
    status: 'Sent',
    fileSize: '312 KB',
    format: 'PDF',
    recipients: report.recipients,
    delivery: report.delivery,
    downloadUrl: '#',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded shadow-lg p-6 space-y-6 mt-16">
        <h2 className="text-xl font-bold">📜 Report Delivery Log</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Report Name:</span>
            <div>{report.name}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Module:</span>
            <div>{report.module}</div>
          </div>

          <div>
            <span className="font-medium text-gray-700">Last Sent:</span>
            <div>{mockLog.lastSent}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Status:</span>
            <span
              className={
                mockLog.status === 'Sent'
                  ? 'text-green-600 font-medium'
                  : mockLog.status === 'Failed'
                  ? 'text-red-600 font-medium'
                  : 'text-yellow-600 font-medium'
              }
            >
              {mockLog.status}
            </span>
          </div>

          <div>
            <span className="font-medium text-gray-700">File Format:</span>
            <div>{mockLog.format}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">File Size:</span>
            <div>{mockLog.fileSize}</div>
          </div>
        </div>

        {/* Recipients */}
        <div>
          <h3 className="font-semibold text-sm mb-1">Recipients</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {mockLog.recipients.map((email, idx) => (
              <li key={idx}>{email}</li>
            ))}
          </ul>
        </div>

        {/* Delivery Channels */}
        <div>
          <h3 className="font-semibold text-sm mb-1">Delivery Channels</h3>
          <div className="flex gap-2 flex-wrap">
            {mockLog.delivery.map((method, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-xs px-2 py-1 rounded-full"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Download */}
        <div className="pt-3">
          <a
            href={mockLog.downloadUrl}
            className="inline-block bg-cyan-600 text-white text-sm px-4 py-2 rounded hover:bg-cyan-700"
          >
            ⬇ Download Report
          </a>
        </div>

        {/* Buttons */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportLogsModal;
