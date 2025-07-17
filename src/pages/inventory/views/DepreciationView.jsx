export default function DepreciationView({ assets, calculateDepreciation }) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">📉 Depreciation Overview</h3>
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Asset ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Method</th>
            <th className="p-2">Annual Expense</th>
            <th className="p-2">Accumulated</th>
            <th className="p-2">Book Value</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const { annual, accumulated, bookValue } = calculateDepreciation(asset);
            return (
              <tr key={asset.id} className="border-b">
                <td className="p-2">{asset.id}</td>
                <td className="p-2">{asset.name}</td>
                <td className="p-2">{asset.method}</td>
                <td className="p-2">ETB {annual.toFixed(2)}</td>
                <td className="p-2">ETB {accumulated.toFixed(2)}</td>
                <td className="p-2">ETB {bookValue.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}