import { useState } from 'react';

const Templates = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Sofa - Standard',
      category: 'Sofa',
      components: ['Frame', 'Foam', 'Fabric', 'Legs'],
      linkedFiles: ['sofa-template-v1.dwg', 'render.jpg'],
    },
    {
      id: 2,
      name: 'Wardrobe - Basic',
      category: 'Wardrobe',
      components: ['Panels', 'Hinges', 'Handle'],
      linkedFiles: ['wardrobe-standard.skp'],
    },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: '',
    components: '',
    linkedFiles: '',
  });

  const handleAdd = () => {
    const id = templates.length + 1;
    setTemplates([
      ...templates,
      {
        id,
        name: newTemplate.name,
        category: newTemplate.category,
        components: newTemplate.components.split(',').map(c => c.trim()),
        linkedFiles: newTemplate.linkedFiles.split(',').map(f => f.trim()),
      },
    ]);
    setNewTemplate({ name: '', category: '', components: '', linkedFiles: '' });
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="p-4 ml-7">
      <h1 className="text-2xl font-bold mb-4">📂 Design Templates</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input className="border p-2" placeholder="Template Name" value={newTemplate.name} onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} />
        <input className="border p-2" placeholder="Category (e.g. Sofa, Bed)" value={newTemplate.category} onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })} />
        <input className="border p-2" placeholder="Components (comma separated)" value={newTemplate.components} onChange={(e) => setNewTemplate({ ...newTemplate, components: e.target.value })} />
        <input className="border p-2" placeholder="Linked Files (comma separated)" value={newTemplate.linkedFiles} onChange={(e) => setNewTemplate({ ...newTemplate, linkedFiles: e.target.value })} />
        <button onClick={handleAdd} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 col-span-full">Add Template</button>
      </div>

      <div className="space-y-4">
        {templates.map((t) => (
          <div key={t.id} className="border p-4 rounded bg-white shadow">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-bold">{t.name}</h2>
                <p className="text-sm text-gray-600">Category: {t.category}</p>
                <p className="text-sm text-gray-600">Components: {t.components.join(', ')}</p>
                <p className="text-sm text-gray-600">Files: {t.linkedFiles.join(', ')}</p>
              </div>
              <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
