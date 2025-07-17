import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ModalWithForm from '../../components/ui/modal';
import Button from '../../components/ui/Button';

const FixedProducts = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Classic Dining Table',
      sku: 'FIX-001',
      description: 'Solid wood dining table for 6',
      category: 'Dining',
      price: 5500,
      tags: ['Minimalist', 'Popular'],
    },
    {
      id: 2,
      name: 'Office Desk Pro',
      sku: 'FIX-002',
      description: 'Spacious office desk with drawers',
      category: 'Office',
      price: 4200,
      tags: ['Functional', 'Modern'],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (data) => {
    const id = products.length + 1;
    const tagsArray = data.tags?.split(',').map((t) => t.trim()).filter(Boolean) || [];
    const newProduct = { ...data, id, price: +data.price, tags: tagsArray };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const fields = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'SKU', name: 'sku', type: 'text', required: true },
    { label: 'Description', name: 'description', type: 'textarea' },
    { label: 'Category', name: 'category', type: 'text', required: true },
    { label: 'Price', name: 'price', type: 'number', required: true, min: 0 },
    { label: 'Tags (comma separated)', name: 'tags', type: 'text' },
  ];

  return (
    <div className="p-4 ml-7">
      <h1 className="text-2xl font-bold mb-4">📦 Fixed Products</h1>

      <Button
        icon={Plus}
        onClick={() => setShowAddModal(true)}
        className="mb-4"
        size="md"
        variant="solid"
      >
        Add Product
      </Button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Tags</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.sku}</td>
              <td className="p-2 border">{product.category}</td>
              <td className="p-2 border">{product.price} ETB</td>
              <td className="p-2 border">{product.tags.join(', ')}</td>
              <td className="p-2 border">
                <Button
                  icon={Trash2}
                  iconOnly
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
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
        title="Add Fixed Product"
        fields={fields}
      />
    </div>
  );
};

export default FixedProducts;
