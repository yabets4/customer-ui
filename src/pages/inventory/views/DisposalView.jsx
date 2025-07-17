export default function DisposalView({ assets, calculateDepreciation, onDispose }) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">🗑️ Asset Disposal</h3>
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Asset</th>
            <th className="p-2">Book Value</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const { bookValue } = calculateDepreciation(asset);
            return (
              <tr key={asset.id} className="border-b">
                <td className="p-2">{asset.name}</td>
                <td className="p-2">ETB {bookValue.toFixed(2)}</td>
                <td className="p-2">
                  <button
                    onClick={() => onDispose(asset)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Dispose
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}