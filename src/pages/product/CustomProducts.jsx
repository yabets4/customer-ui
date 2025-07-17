import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ModalWithForm from '../../components/ui/modal';
import Button from '../../components/ui/Button';

const CustomProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Custom Sofa',
      sku: 'CUST-001',
      dimensions: '200x90x80 cm',
      material: 'Birch Wood',
      color: 'Beige Fabric',
      hardware: 'Steel Legs',
      basePrice: 9000,
    },
    {
      id: 2,
      name: 'Wardrobe Deluxe',
      sku: 'CUST-002',
      dimensions: '240x60x220 cm',
      material: 'MDF + Laminate',
      color: 'Dark Oak',
      hardware: 'Gold Handles',
      basePrice: 14500,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (data) => {
    const id = products.length + 1;
    const newProduct = { ...data, id, basePrice: +data.basePrice };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const fields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'SKU', name: 'sku', type: 'text', required: true },
    { label: 'Dimensions (LxWxH)', name: 'dimensions', type: 'text', required: true },
    { label: 'Material', name: 'material', type: 'text', required: true },
    { label: 'Color / Texture', name: 'color', type: 'text' },
    { label: 'Hardware (legs, hinges)', name: 'hardware', type: 'text' },
    { label: 'Base Price', name: 'basePrice', type: 'number', required: true, min: 0 },
  ];

  return (
    <div className="p-4 ml-7">
      <h1 className="text-2xl font-bold mb-4">🎨 Custom Products</h1>

      <Button
        icon={Plus}
        onClick={() => setShowAddModal(true)}
        className="mb-6"
        size="md"
        variant="solid"
      >
        Add Custom Product
      </Button>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">Dimensions</th>
            <th className="p-2 border">Material</th>
            <th className="p-2 border">Color</th>
            <th className="p-2 border">Hardware</th>
            <th className="p-2 border">Base Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.sku}</td>
              <td className="p-2 border">{p.dimensions}</td>
              <td className="p-2 border">{p.material}</td>
              <td className="p-2 border">{p.color}</td>
              <td className="p-2 border">{p.hardware}</td>
              <td className="p-2 border">{p.basePrice} ETB</td>
              <td className="p-2 border">
                <Button
                  icon={Trash2}
                  iconOnly
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalWithForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        title="Add Custom Product"
        fields={fields}
      />
    </div>
  );
};

export default CustomProducts;
