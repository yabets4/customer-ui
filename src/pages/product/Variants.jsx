import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ModalWithForm from '../../components/ui/modal';
import Button from '../../components/ui/Button';

const Variants = () => {
  const [variants, setVariants] = useState([
    {
      id: 1,
      name: '3-Seater Sofa - Gray Fabric',
      sku: 'VAR-001',
      baseProduct: 'Custom Sofa',
      image: 'https://via.placeholder.com/100',
      price: 9800,
      stock: 5,
    },
    {
      id: 2,
      name: 'Cabinet - 180cm - Walnut',
      sku: 'VAR-002',
      baseProduct: 'Wardrobe Deluxe',
      image: 'https://via.placeholder.com/100',
      price: 13200,
      stock: 3,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (data) => {
    const id = variants.length + 1;
    const newVariant = {
      ...data,
      id,
      price: +data.price,
      stock: +data.stock,
    };
    setVariants([...variants, newVariant]);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const fields = [
    { label: 'Variant Name', name: 'name', type: 'text', required: true },
    { label: 'SKU', name: 'sku', type: 'text', required: true },
    { label: 'Base Product', name: 'baseProduct', type: 'text', required: true },
    { label: 'Image URL', name: 'image', type: 'text' },
    { label: 'Price', name: 'price', type: 'number', required: true, min: 0 },
    { label: 'Stock', name: 'stock', type: 'number', required: true, min: 0 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔁 Product Variants</h1>

      <Button
        icon={Plus}
        onClick={() => setShowAddModal(true)}
        className="mb-6"
        size="md"
        variant="solid"
      >
        Add Variant
      </Button>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">Base Product</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.id} className="border-t">
              <td className="p-2 border">
                <img src={v.image} alt={v.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="p-2 border">{v.name}</td>
              <td className="p-2 border">{v.sku}</td>
              <td className="p-2 border">{v.baseProduct}</td>
              <td className="p-2 border">{v.price} ETB</td>
              <td className="p-2 border">{v.stock}</td>
              <td className="p-2 border">
                <Button
                  icon={Trash2}
                  iconOnly
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(v.id)}
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
        title="Add Product Variant"
        fields={fields}
      />
    </div>
  );
};

export default Variants;
