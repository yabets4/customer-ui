import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Pencil, Eye } from 'lucide-react';
import { mockMaterials } from '../mock/materials';
import MaterialModal from './MaterialModal';
import EditMaterialModal from './EditMaterialModal';

const ITEMS_PER_PAGE = 8;

export default function RawMaterials() {
  const [materials, setMaterials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    setMaterials(mockMaterials);
  }, []);

  useEffect(() => {
    let result = materials;
    if (query) {
      result = result.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.sku.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category) result = result.filter(m => m.category === category);
    if (status) result = result.filter(m => m.stock_status === status);
    setFiltered(result);
    setPage(1);
  }, [materials, query, category, status]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this material?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSaveEdit = (updated) => {
    setMaterials(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  return (
  <div className="p-6  min-h-screen">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">📦 Raw Materials</h2>
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search name or SKU"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring focus:ring-blue-100 w-48"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring focus:ring-blue-100"
        >
          <option value="">All Categories</option>
          <option value="Wood">Wood</option>
          <option value="Adhesive">Adhesive</option>
          <option value="Fabric">Fabric</option>
          <option value="Paint">Paint</option>
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring focus:ring-blue-100"
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Quarantined">Quarantined</option>
          <option value="Expired">Expired</option>
          <option value="Damaged">Damaged</option>
        </select>
      </div>
    </div>

    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {paginated.map((m) => (
        <div
          key={m.id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
        >
          <img src={m.image_url} alt={m.name} className="h-32 w-full object-cover" />
          <div className="p-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-lg text-gray-800">{m.name}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  {
                    Available: 'bg-green-100 text-green-700',
                    Quarantined: 'bg-yellow-100 text-yellow-800',
                    Expired: 'bg-red-100 text-red-700',
                    Damaged: 'bg-gray-100 text-gray-700',
                  }[m.stock_status] || 'bg-blue-100 text-blue-700'
                }`}
              >
                {m.stock_status}
              </span>
            </div>
            <p className="text-sm text-gray-500">{m.sku} • {m.category}</p>

            <div className="mt-3 text-sm space-y-1 text-gray-600">
              <p><strong>UoM:</strong> {m.uom_primary}</p>
              <p><strong>Cost:</strong> ${m.cost_price}</p>
              <p><strong>Stock:</strong> {m.current_stock}</p>
            </div>

            <div className="flex justify-between items-center mt-4 gap-2 text-sm font-medium">
              <button onClick={() => setEditData(m)} className="text-blue-600 hover:underline flex items-center gap-1">
                <Pencil size={16} /> Edit
              </button>
              <button onClick={() => setModalData(m)} className="text-gray-700 hover:underline flex items-center gap-1">
                <Eye size={16} /> View
              </button>
              <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline flex items-center gap-1">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {totalPages > 1 && (
      <div className="flex justify-center mt-8 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg text-sm border ${
              page === i + 1
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    )}

    {modalData && <MaterialModal material={modalData} onClose={() => setModalData(null)} />}
    {editData && (
      <EditMaterialModal
        material={editData}
        onClose={() => setEditData(null)}
        onSave={handleSaveEdit}
      />
    )}
  </div>
);

}
