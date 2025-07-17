import { useState } from 'react';
import AddLead from './AddLead';
const CreateLead = () => {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    source: '',
    assignedRep: '',
    leadType: '',
    status: 'New',
    score: '',
    notes: '',
    tags: ''
  });

  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'Acme Inc.',
      contactInfo: 'acme@example.com',
      source: 'Website',
      assignedRep: 'John Doe',
      leadType: 'B2B',
      status: 'New',
      score: '80',
      notes: 'Interested in our premium package.',
      tags: 'hot,priority',
    },
    {
      id: 2,
      name: 'Jane Smith',
      contactInfo: 'jane.smith@gmail.com',
      source: 'Referral',
      assignedRep: 'Sarah Lee',
      leadType: 'B2C',
      status: 'Contacted',
      score: '65',
      notes: 'Asked for a follow-up in two weeks.',
      tags: 'warm',
    }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLead = {
      id: leads.length + 1,
      ...formData,
    };
    setLeads([...leads, newLead]);
    setFormData({
      name: '',
      contactInfo: '',
      source: '',
      assignedRep: '',
      leadType: '',
      status: 'New',
      score: '',
      notes: '',
      tags: ''
    });
  };

  return (
    <>
      <div className="p-4 ml-7">
        <h1 className="text-xl font-bold mb-4">Create Lead</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Name / Company" value={formData.name} onChange={handleChange} className="border p-2 w-full" />
          <input name="contactInfo" placeholder="Contact Info" value={formData.contactInfo} onChange={handleChange} className="border p-2 w-full" />
          <input name="source" placeholder="Source" value={formData.source} onChange={handleChange} className="border p-2 w-full" />
          <input name="assignedRep" placeholder="Assigned Rep" value={formData.assignedRep} onChange={handleChange} className="border p-2 w-full" />
          <select name="leadType" value={formData.leadType} onChange={handleChange} className="border p-2 w-full">
            <option value="">Select Type</option>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
          </select>
          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full">
            <option>New</option>
            <option>Contacted</option>
            <option>Quoted</option>
            <option>Won</option>
            <option>Lost</option>
          </select>
          <input name="score" placeholder="Score" value={formData.score} onChange={handleChange} className="border p-2 w-full" />
          <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="border p-2 w-full" />
          <input name="tags" placeholder="Tags" value={formData.tags} onChange={handleChange} className="border p-2 w-full" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">Save Lead</button>
        </form>
      </div>

      <AddLead />
    </>
  );
};

export default CreateLead;
