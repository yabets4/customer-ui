import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ModalWithForm from '../../components/ui/modal';
import Button from '../../components/ui/Button';

const BomTemplates = () => {
  const [boms, setBoms] = useState([
    {
      id: 1,
      product: 'Custom Sofa',
      items: [
        { item: 'Birch Wood Frame', quantity: '5 pcs' },
        { item: 'Beige Fabric Roll', quantity: '2 rolls' },
        { item: 'Steel Legs', quantity: '4 pcs' },
      ],
    },
    {
      id: 2,
      product: 'Wardrobe Deluxe',
      items: [
        { item: 'MDF Sheets', quantity: '6 sheets' },
        { item: 'Gold Handles', quantity: '4 pcs' },
        { item: 'Laminate Roll', quantity: '1 roll' },
      ],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (data) => {
    const id = boms.length + 1;
    const parsedItems = data.items
      .split(',')
      .map((str) => {
        const [item, quantity] = str.trim().split(' x ');
        return { item, quantity };
      })
      .filter((i) => i.item && i.quantity);

    setBoms([...boms, { id, product: data.product, items: parsedItems }]);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setBoms(boms.filter((b) => b.id !== id));
  };

  const fields = [
    { label: 'Product Name', name: 'product', type: 'text', required: true },
    {
      label: 'Items (e.g. Wood x 5, Fabric x 2)',
      name: 'items',
      type: 'text',
      required: true,
    },
  ];

  return (
    <div className="p-4 ml-7">
      <h1 className="text-2xl font-bold mb-4">🛠️ BOM Templates</h1>

      <Button
        icon={Plus}
        onClick={() => setShowAddModal(true)}
        className="mb-6"
        size="md"
        variant="solid"
      >
        Add BOM
      </Button>

      <div className="space-y-4">
        {boms.map((bom) => (
          <div
            key={bom.id}
            className="border p-4 rounded bg-white shadow"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{bom.product}</h2>
              <Button
                icon={Trash2}
                iconOnly
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(bom.id)}
                className="text-red-500"
              />
            </div>
            <ul className="list-disc ml-6 mt-2 text-sm text-gray-700">
              {bom.items.map((item, idx) => (
                <li key={idx}>
                  {item.item} — {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ModalWithForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        title="Add BOM Template"
        fields={fields}
      />
    </div>
  );
};

export default BomTemplates;
