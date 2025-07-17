import React, { useState, useEffect } from 'react';
import ModalWithForm from '../../../components/ui/modal';
import { PlusCircle } from 'lucide-react';

const AddLead = () => {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ leadType: 'B2C' });

  const handleAddLead = (data) => {
    const newLead = { ...data, id: leads.length + 1 };
    setLeads((prev) => [...prev, newLead]);
    setFormData({ leadType: 'B2C' }); // reset form
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const baseFields = [
    { label: "Name / Company", name: "name", type: "text", required: true },
    { label: "Phone", name: "phone", type: "number", required: true },
    { label: "Email", name: "email", type: "text", required: true },
    { label: "Source", name: "source", type: "text" },
        {
      label: "Assigned Rep",
      name: "assignedRep",
      type: "select",
      required: true,
      options: [
        { label: "Abel", value: "Abel" },
        { label: "Alex", value: "Alex" },
        { label: "Dani", value: "Dani" },
        { label: "Abebe", value: "Abebe" },
        { label: "Mule", value: "Mule" }
      ]
    },
    {
      label: "Lead Type",
      name: "leadType",
      type: "select",
      required: true,
      value: formData.leadType,
      options: [
        { label: "B2C", value: "B2C" },
        { label: "B2B", value: "B2B" },
      ],
      onChange: (e) => handleFieldChange('leadType', e.target.value)
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "New", value: "New" },
        { label: "Contacted", value: "Contacted" },
        { label: "Quoted", value: "Quoted" },
        { label: "Won", value: "Won" },
        { label: "Lost", value: "Lost" }
      ]
    },
    { label: "Score", name: "score", type: "text" },
    { label: "Tags", name: "tags", type: "text" },
    { label: "Notes", name: "notes", type: "textarea" },
  ];

  const b2bFields = [
    { label: "Contact Person Name", name: "contactPersonName", type: "text", required: true },
    { label: "Contact Person Number", name: "contactPersonNuber", type: "number", required: true },
    { label: "Contact Person Title", name: "contactPersonTitle", type: "text" },
  ];

  const finalFields = formData.leadType === "B2B"
    ? [...baseFields, ...b2bFields]
    : baseFields;

  return (
    <div className="p-4 ml-7">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setShowModal(true);
            setFormData({ leadType: 'B2C' });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <ModalWithForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddLead}
        title="Add New Lead"
        fields={finalFields}
        onFieldChange={handleFieldChange} // Pass this if your modal supports it
        formData={formData} // Optional if ModalWithForm can accept prefilled values
      />
    </div>
  );
};

export default AddLead;
