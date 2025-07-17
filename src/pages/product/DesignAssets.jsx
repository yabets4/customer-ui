import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ModalWithForm from '../../components/ui/modal';
import Button from '../../components/ui/Button';

const DesignAssets = () => {
  const [assets, setAssets] = useState([
    {
      id: 1,
      product: 'Custom Sofa',
      files: [
        { name: 'sofa_design_v1.dwg', type: '2D CAD' },
        { name: 'sofa_render.png', type: 'Render Image' },
        { name: 'sofa_spec.pdf', type: 'Spec Sheet' },
      ],
    },
    {
      id: 2,
      product: 'Wardrobe Deluxe',
      files: [
        { name: 'wardrobe_sketchup.skp', type: '3D Model' },
        { name: 'wardrobe_tech.pdf', type: 'Technical Sheet' },
      ],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = (data) => {
    const id = assets.length + 1;
    const parsedFiles = data.files
      .split(',')
      .map((str) => {
        const [name, type] = str.trim().split(' | ');
        return { name, type };
      })
      .filter((f) => f.name && f.type);

    setAssets([...assets, { id, product: data.product, files: parsedFiles }]);
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const fields = [
    { label: 'Product Name', name: 'product', type: 'text', required: true },
    {
      label: 'Files (e.g. sofa.pdf | Spec, image.png | Render)',
      name: 'files',
      type: 'text',
      required: true,
    },
  ];

  return (
    <div className="p-4 ml-7">
      <h1 className="text-2xl font-bold mb-4">📁 Design Assets</h1>

      <Button
        icon={Plus}
        onClick={() => setShowAddModal(true)}
        className="mb-6"
        size="md"
        variant="solid"
      >
        Add Asset
      </Button>

      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="border p-4 rounded bg-white shadow">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{asset.product}</h2>
              <Button
                icon={Trash2}
                iconOnly
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(asset.id)}
                className="text-red-500"
              />
            </div>
            <ul className="list-disc ml-6 mt-2 text-sm text-gray-700">
              {asset.files.map((file, idx) => (
                <li key={idx}>
                  {file.name} —{' '}
                  <span className="italic text-gray-500">{file.type}</span>
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
        title="Add Design Asset"
        fields={fields}
      />
    </div>
  );
};

export default DesignAssets;
