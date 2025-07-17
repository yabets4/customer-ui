import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ModalWithForm from '../../components/ui/modal';
import Button from '../../components/ui/Button';

const CostEngine = () => {
  const [costs, setCosts] = useState([
    {
      id: 1,
      product: 'Custom Sofa',
      materialCost: 2400,
      laborCost: 900,
      overhead: 10,
      waste: 5,
      subcontract: 300,
    },
    {
      id: 2,
      product: 'Wardrobe Deluxe',
      materialCost: 1800,
      laborCost: 750,
      overhead: 8,
      waste: 3,
      subcontract: 0,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (data) => {
    const id = costs.length + 1;
    setCosts([
      ...costs,
      {
        id,
        product: data.product,
        materialCost: Number(data.materialCost),
        laborCost: Number(data.laborCost),
        overhead: Number(data.overhead),
        waste: Number(data.waste),
        subcontract: Number(data.subcontract),
      },
    ]);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setCosts(costs.filter((c) => c.id !== id));
  };

  const calculateTotal = (c) => {
    const base = c.materialCost + c.laborCost + c.subcontract;
    const withOverhead = base + base * (c.overhead / 100);
    const withWaste = withOverhead + base * (c.waste / 100);
    return withWaste.toFixed(2);
  };

  const fields = [
    { label: 'Product', name: 'product', type: 'text', required: true },
    { label: 'Material Cost', name: 'materialCost', type: 'number', required: true, min: 0 },
    { label: 'Labor Cost', name: 'laborCost', type: 'number', required: true, min: 0 },
    { label: 'Subcontract', name: 'subcontract', type: 'number', required: true, min: 0 },
    { label: 'Overhead (%)', name: 'overhead', type: 'number', required: true, min: 0 },
    { label: 'Waste (%)', name: 'waste', type: 'number', required: true, min: 0 },
  ];

  return (
    <div className="p-4 ml-7">
      <h1 className="text-2xl font-bold mb-4">🧮 Cost Engine</h1>

      <Button
        icon={Plus}
        onClick={() => setShowAddModal(true)}
        className="mb-6"
        size="md"
        variant="solid"
      >
        Add Cost Entry
      </Button>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Product</th>
            <th className="border p-2">Material</th>
            <th className="border p-2">Labor</th>
            <th className="border p-2">Subcontract</th>
            <th className="border p-2">Overhead (%)</th>
            <th className="border p-2">Waste (%)</th>
            <th className="border p-2">Total Cost</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {costs.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.product}</td>
              <td className="border p-2">ETB {c.materialCost}</td>
              <td className="border p-2">ETB {c.laborCost}</td>
              <td className="border p-2">ETB {c.subcontract}</td>
              <td className="border p-2">{c.overhead}%</td>
              <td className="border p-2">{c.waste}%</td>
              <td className="border p-2 font-semibold text-green-600">
                ETB {calculateTotal(c)}
              </td>
              <td className="border p-2">
                <Button
                  icon={Trash2}
                  iconOnly
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(c.id)}
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
        title="Add Cost Entry"
        fields={fields}
      />
    </div>
  );
};

export default CostEngine;
