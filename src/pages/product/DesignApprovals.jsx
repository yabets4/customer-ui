import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ModalWithForm from '../../components/ui/modal';
import Button from '../../components/ui/Button';

const DesignApprovals = () => {
  const [designs, setDesigns] = useState([
    {
      id: 1,
      product: 'Custom Sofa',
      status: 'Pending Review',
      comments: [
        { user: 'Designer A', text: 'Uploaded draft v1' },
        { user: 'Manager', text: 'Needs dimension check' },
      ],
    },
    {
      id: 2,
      product: 'Wardrobe Deluxe',
      status: 'Final Approved',
      comments: [
        { user: 'Designer B', text: 'Uploaded v2.1 with fixes' },
        { user: 'Client', text: 'Approved for production' },
      ],
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleAdd = (data) => {
    const id = designs.length + 1;
    setDesigns([
      ...designs,
      {
        id,
        product: data.product,
        status: data.status,
        comments: [{ user: 'System', text: data.comment }],
      },
    ]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDesigns(designs.filter((d) => d.id !== id));
  };

  const fields = [
    { label: 'Product Name', name: 'product', type: 'text', required: true },
    { label: 'Status (e.g. Pending, Approved)', name: 'status', type: 'text', required: true },
    { label: 'Initial Comment', name: 'comment', type: 'text', required: true },
  ];

  return (
    <div className="p-4 ml-7">
      <h1 className="text-2xl font-bold mb-4">✅ Design Approvals</h1>

      <Button
        icon={Plus}
        onClick={() => setShowModal(true)}
        className="mb-6"
        size="md"
        variant="solid"
      >
        Add Design Approval
      </Button>

      <div className="space-y-4">
        {designs.map((design) => (
          <div key={design.id} className="border p-4 rounded bg-white shadow">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-bold">{design.product}</h2>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-semibold">{design.status}</span>
                </p>
              </div>
              <Button
                icon={Trash2}
                iconOnly
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(design.id)}
                className="text-red-500"
              />
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <p className="font-semibold">Comments:</p>
              <ul className="ml-6 list-disc">
                {design.comments.map((c, idx) => (
                  <li key={idx}>
                    <strong>{c.user}:</strong> {c.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <ModalWithForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAdd}
        title="Add Design Approval"
        fields={fields}
      />
    </div>
  );
};

export default DesignApprovals;
