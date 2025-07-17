import React, { useState, useEffect } from 'react';
import ModalWithForm from '../../components/ui/modal'; // adjust the path as needed
import { PlusCircle } from 'lucide-react';

const initialLeads = [
  {
    id: 1,
    name: 'ABC Corp',
    contactInfo: 'abc@example.com',
    source: 'Website',
    assignedRep: 'Rep1',
    leadType: 'B2B',
    status: 'New',
    score: 75,
    notes: 'Interested in bulk orders',
    tags: 'VIP, High Potential'
  },
  {
    id: 2,
    name: 'John Doe',
    contactInfo: 'john@example.com',
    source: 'Walk-in',
    assignedRep: 'Rep2',
    leadType: 'B2C',
    status: 'Contacted',
    score: 60,
    notes: 'Needs more info about delivery',
    tags: 'Repeat'
  }
];

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLeads(initialLeads);
  }, []);

  const handleAddLead = (data) => {
    const newLead = { ...data, id: leads.length + 1 };
    setLeads((prev) => [...prev, newLead]);
  };

  const handleDelete = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  const fields = [
    { label: "Name / Company", name: "name", type: "text", required: true },
    { label: "Phone or Email", name: "contactInfo", type: "text", required: true },
    { label: "Source", name: "source", type: "text" },
    { label: "Assigned Rep", name: "assignedRep", type: "text" },
    {
      label: "Lead Type",
      name: "leadType",
      type: "select",
      required: true,
      options: [
        { label: "B2C", value: "B2C" },
        { label: "B2B", value: "B2B" },
      ]
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
    { label: "Notes", name: "notes", type: "text" },
  ];

  return (
    <div className="p-4 ml-7">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Leads</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Contact Info</th>
            <th className="border px-2 py-1">Source</th>
            <th className="border px-2 py-1">Rep</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Score</th>
            <th className="border px-2 py-1">Tags</th>
            <th className="border px-2 py-1">Notes</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="border px-2 py-1">{lead.name}</td>
              <td className="border px-2 py-1">{lead.contactInfo}</td>
              <td className="border px-2 py-1">{lead.source}</td>
              <td className="border px-2 py-1">{lead.assignedRep}</td>
              <td className="border px-2 py-1">{lead.leadType}</td>
              <td className="border px-2 py-1">{lead.status}</td>
              <td className="border px-2 py-1">{lead.score}</td>
              <td className="border px-2 py-1">{lead.tags}</td>
              <td className="border px-2 py-1">{lead.notes}</td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalWithForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddLead}
        title="Add New Lead"
        fields={fields}
      />
    </div>
  );
};

export default Leads;
