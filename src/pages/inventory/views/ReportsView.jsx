export default function ReportsView() {
  const reports = [
    "Asset Register",
    "Depreciation Report",
    "Asset Value Report",
    "Maintenance History",
    "Custodian Report",
    "Location Report",
    "Asset Disposal Summary",
  ];

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">📊 Reporting & Auditing</h3>
      <ul className="space-y-2">
        {reports.map((report) => (
          <li
            key={report}
            className="border px-4 py-2 rounded flex justify-between items-center"
          >
            <span>{report}</span>
            <button className="text-blue-600 hover:underline text-sm">
              Download PDF
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
