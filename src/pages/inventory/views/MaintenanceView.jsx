export default function MaintenanceView({ records, assets, onAdd }) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🛠️ Maintenance Log</h3>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
        >
          + New Maintenance
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Asset</th>
            <th className="p-2">Type</th>
            <th className="p-2">Date</th>
            <th className="p-2">Technician</th>
            <th className="p-2">Cost</th>
            <th className="p-2">Downtime</th>
            <th className="p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {records.map((m) => {
            const asset = assets.find((a) => a.id === m.assetId);
            return (
              <tr key={m.id} className="border-b">
                <td className="p-2">{asset?.name || m.assetId}</td>
                <td className="p-2">{m.type}</td>
                <td className="p-2">{m.date}</td>
                <td className="p-2">{m.technician}</td>
                <td className="p-2">ETB {m.cost}</td>
                <td className="p-2">{m.downtime}</td>
                <td className="p-2">{m.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}