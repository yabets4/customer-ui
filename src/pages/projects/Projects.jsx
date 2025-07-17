import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import ModalWithForm from '../../components/ui/modal';

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectId: 'PRJ001',
      customer: 'Alemu Furniture',
      phone: '+251 911 123456',
      title: 'Living Room Set',
      type: 'Sales Order',
      dimensions: '200x150x100 cm',
      description: 'Oak wood furniture',
      colour: 'Natural',
      unitPrice: 5000,
      estimateSum: 40000,
      priceGiven: 48000,
      assignedUser: 'Hanna D.',
      file3D: 'https://example.com/3d/livingroom',
      commissionOrLink: '',
      tasks: 'Assembly, finishing',
      incentiveCalc: '',
      startDate: '2024-07-10'
    },
    {
      id: 2,
      projectId: 'PRJ002',
      customer: 'Lidya Decor',
      phone: '+251 922 654321',
      title: 'Office Desk',
      type: 'R&D',
      dimensions: '150x70x75 cm',
      description: 'Ergonomic design prototype',
      colour: 'Black',
      unitPrice: 3000,
      estimateSum: 25000,
      priceGiven: 27000,
      assignedUser: 'Biruk T.',
      file3D: '',
      commissionOrLink: '',
      tasks: 'Design, testing',
      incentiveCalc: '',
      startDate: '2024-07-12'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  const customers = ['Alemu Furniture', 'Lidya Decor', 'Meklit Interiors'];
  const users = ['Hanna D.', 'Biruk T.', 'Samuel Y.'];

  const handleAddProject = (data) => {
    const newId = projects.length + 1;
    const newProject = {
      id: newId,
      ...data,
      startDate: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [...prev, newProject]);
  };

  const [filterStartDateFrom, setFilterStartDateFrom] = useState('');
  const [filterStartDateTo, setFilterStartDateTo] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const uniqueTypes = useMemo(() => [...new Set(projects.map((p) => p.type))], [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (filterStartDateFrom && p.startDate < filterStartDateFrom) return false;
        if (filterStartDateTo && p.startDate > filterStartDateTo) return false;
        if (filterType && p.type !== filterType) return false;
        if (filterStatus && p.status !== filterStatus) return false;
        if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          return (
            p.projectId.toLowerCase().includes(lower) ||
            p.customer.toLowerCase().includes(lower) ||
            p.title?.toLowerCase().includes(lower)
          );
        }
        return true;
      })
      .slice(0, rowsPerPage);
  }, [projects, filterStartDateFrom, filterStartDateTo, filterType, filterStatus, searchTerm, rowsPerPage]);

  const fields = [
    { label: 'Project ID', name: 'projectId', type: 'text', required: true },
    { label: 'Customer', name: 'customer', type: 'select', required: true, options: customers.map(c => ({ label: c, value: c })) },
    { label: 'Phone', name: 'phone', type: 'text', required: true },
    { label: 'Title', name: 'title', type: 'text', required: true },
    { label: 'Type', name: 'type', type: 'text', required: true },
    { label: 'Dimensions', name: 'dimensions', type: 'text' },
    { label: 'Description', name: 'description', type: 'textarea' },
    { label: 'Colour', name: 'colour', type: 'text' },
    { label: 'Unit Price', name: 'unitPrice', type: 'number' },
    { label: 'Estimate Cost Sum', name: 'estimateSum', type: 'number' },
    { label: 'Price Given', name: 'priceGiven', type: 'number', required: true },
    { label: 'Assigned User', name: 'assignedUser', type: 'select', options: users.map(u => ({ label: u, value: u })) },
    { label: '3D File Link', name: 'file3D', type: 'text' },
    { label: 'Commission/Host Link', name: 'commissionOrLink', type: 'text' },
    { label: 'Tasks', name: 'tasks', type: 'textarea' },
    { label: 'Incentive Calc', name: 'incentiveCalc', type: 'text' }
  ];

  return (
    <div className="p-6 lg:ml-7 max-sm:ml-5">
      <h1 className="text-2xl font-bold mb-4">📦 Project Manager</h1>

      <div className="grid md:grid-cols-6 gap-4 mb-6">
        <div className="col-span-2">
          <label>Start Date From</label>
          <input type="date" value={filterStartDateFrom} onChange={(e) => setFilterStartDateFrom(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="col-span-2">
          <label>Start Date To</label>
          <input type="date" value={filterStartDateTo} onChange={(e) => setFilterStartDateTo(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border p-2 rounded">
            <option value="">All</option>
            {uniqueTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border p-2 rounded">
            <option value="">All</option>
            <option>In Progress</option>
            <option>Planned</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label>Search</label>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Project ID, Customer..." className="w-full border p-2 rounded" />
        </div>
        <div>
          <label>Rows</label>
          <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="w-full border p-2 rounded">
            {[5, 10, 20].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <Button
        icon={Plus}
        onClick={() => setModalOpen(true)}
        className="mb-4"
        size="md"
        variant="solid"
      >
        Add Project
      </Button>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">No matching projects.</td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr key={p.id}>
                  <td className="border p-2">{p.projectId}</td>
                  <td className="border p-2">{p.title}</td>
                  <td className="border p-2">{p.customer}</td>
                  <td className="border p-2">{p.type}</td>
                  <td className="border p-2">{p.assignedUser}</td>
                  <td className="border p-2">ETB {p.priceGiven}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalWithForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddProject}
        title="Add New Project"
        fields={fields}
      />
    </div>
  );
};

export default Projects;
