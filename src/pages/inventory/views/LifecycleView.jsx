export default function LifecycleView({ assets, onChange, onAudit }) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">♻️ Asset Lifecycle Management</h3>
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Asset</th>
            <th className="p-2">Location</th>
            <th className="p-2">Custodian</th>
            <th className="p-2">Status</th>
            <th className="p-2">Audit</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b">
              <td className="p-2 font-medium">{asset.name}</td>
              <td className="p-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={asset.location}
                  onChange={(e) =>
                    onChange((prev) =>
                      prev.map((a) =>
                        a.id === asset.id ? { ...a, location: e.target.value } : a
                      )
                    )
                  }
                />
              </td>
              <td className="p-2">
                <input
                  className="border rounded px-2 py-1 w-full"
                  value={asset.custodian}
                  onChange={(e) =>
                    onChange((prev) =>
                      prev.map((a) =>
                        a.id === asset.id ? { ...a, custodian: e.target.value } : a
                      )
                    )
                  }
                />
              </td>
              <td className="p-2">
                <select
                  className="border px-2 py-1 rounded w-full"
                  value={asset.status}
                  onChange={(e) =>
                    onChange((prev) =>
                      prev.map((a) =>
                        a.id === asset.id ? { ...a, status: e.target.value } : a
                      )
                    )
                  }
                >
                  <option value="Procured">Procured</option>
                  <option value="In Use">In Use</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Retired">Retired</option>
                  <option value="Disposed">Disposed</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => onAudit(asset)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Log
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}