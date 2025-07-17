export default function AssetRegistryView({ assets, searchQuery, statusFilter, setSearchQuery, setStatusFilter, onEdit }) {
  const filteredAssets = assets
    .filter((a) =>
      (a.id + a.name + a.category)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .filter((a) => (statusFilter ? a.status === statusFilter : true));

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📋 Asset Registry</h3>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by ID, name or category..."
          className="border px-3 py-2 rounded-md w-full md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded-md w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="In Use">In Use</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Retired">Retired</option>
          <option value="Disposed">Disposed</option>
        </select>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Location</th>
            <th className="p-2">Custodian</th>
            <th className="p-2">Status</th>
            <th className="p-2">Condition</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => (
            <tr key={asset.id} className="border-b">
              <td className="p-2">{asset.id}</td>
              <td className="p-2">{asset.name}</td>
              <td className="p-2">{asset.category}</td>
              <td className="p-2">{asset.location}</td>
              <td className="p-2">{asset.custodian}</td>
              <td className="p-2">{asset.status}</td>
              <td className="p-2">{asset.condition}</td>
              <td className="p-2">
                <button
                  onClick={() => onEdit(asset)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
