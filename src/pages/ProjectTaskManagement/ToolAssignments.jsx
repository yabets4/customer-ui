// ToolAssignments.jsx
import { useState } from 'react';
import { Wrench, Loader, XCircle, ClipboardList, CheckCircle, Clock, History, Search, Filter, Plus, Edit, Trash2, MapPin, Tag, Calendar, Info, User } from 'lucide-react';
import UsageHistoryModal from '../projects/UsageHistoryModal'; // Assuming this component exists
import Card from '../../components/ui/Card'; // Assuming a Card component
import Button from '../../components/ui/Button'; // Assuming a Button component
import Input from '../../components/ui/input'; // Assuming an Input component
import Select from '../../components/ui/Select'; // Assuming a Select component
import ModalWithForm from '../../components/ui/modal'; // Assuming a ModalWithForm component

const ToolAssignments = () => {
  const [tools, setTools] = useState([ // Changed to useState to allow for future modifications
    {
      id: 'tool-1',
      name: 'CNC Router',
      type: 'Router',
      location: 'Workshop A',
      assignedTo: 'Cutting Task #112',
      inUseBy: 'Yonas',
      returnDue: '2025-07-15', // Changed to date string for consistency
      status: 'In Use',
      nextMaintenance: '2025-07-10',
      expectedLifespan: '5 yrs',
    },
    {
      id: 'tool-2',
      name: 'Upholstery Gun',
      type: 'Power Tool',
      location: 'Storage B',
      assignedTo: '',
      inUseBy: '',
      returnDue: '',
      status: 'Available',
      nextMaintenance: '2025-08-01',
      expectedLifespan: '3 yrs',
    },
    {
      id: 'tool-3',
      name: 'Table Saw',
      type: 'Saw',
      location: 'Workshop B',
      assignedTo: 'Assembly Task #97',
      inUseBy: 'Mekdes',
      returnDue: '2025-07-16', // Changed to date string
      status: 'In Use',
      nextMaintenance: '2025-07-09',
      expectedLifespan: '6 yrs',
    },
    {
      id: 'tool-4',
      name: 'Paint Spray Gun',
      type: 'Sprayer',
      location: 'Workshop A',
      assignedTo: '',
      inUseBy: '',
      returnDue: '',
      status: 'Under Maintenance',
      nextMaintenance: '2025-07-15', // Changed to date string
      expectedLifespan: '2 yrs',
    },
    {
        id: 'tool-5',
        name: 'Drill Press',
        type: 'Drill',
        location: 'Workshop C',
        assignedTo: 'Drilling Project #201',
        inUseBy: 'Kebede',
        returnDue: '2025-07-20',
        status: 'In Use',
        nextMaintenance: '2025-07-25',
        expectedLifespan: '4 yrs',
    },
    {
        id: 'tool-6',
        name: 'Welding Machine',
        type: 'Welder',
        location: 'Workshop B',
        assignedTo: '',
        inUseBy: '',
        returnDue: '',
        status: 'Available',
        nextMaintenance: '2025-09-01',
        expectedLifespan: '7 yrs',
    },
    {
        id: 'tool-7',
        name: 'Forklift',
        type: 'Vehicle',
        location: 'Warehouse',
        assignedTo: 'Loading Bay Operations',
        inUseBy: 'Abebe',
        returnDue: '2025-07-18',
        status: 'In Use',
        nextMaintenance: '2025-07-17', // Maintenance due soon
        expectedLifespan: '10 yrs',
    },
  ]);

  const [filters, setFilters] = useState({ search: '', status: '', location: '', type: '' });
  const [selectedTool, setSelectedTool] = useState(null); // For UsageHistoryModal
  const [showAddEditModal, setShowAddEditModal] = useState(false); // For Add/Edit Tool Modal
  const [currentToolForModal, setCurrentToolForModal] = useState(null); // Tool data for the modal

  const filteredTools = tools.filter((tool) => {
    const searchMatch = (tool.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                        tool.assignedTo.toLowerCase().includes(filters.search.toLowerCase()) ||
                        tool.inUseBy.toLowerCase().includes(filters.search.toLowerCase()));
    const statusMatch = filters.status === '' || tool.status === filters.status;
    const locationMatch = filters.location === '' || tool.location === filters.location;
    const typeMatch = filters.type === '' || tool.type === filters.type;

    return searchMatch && statusMatch && locationMatch && typeMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"><CheckCircle size={14} /> Available</span>;
      case 'In Use':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"><Loader size={14} className="animate-spin" /> In Use</span>;
      case 'Under Maintenance':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"><Wrench size={14} /> Maintenance</span>;
      case 'Broken':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"><XCircle size={14} /> Broken</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">{status}</span>;
    }
  };

  const getMaintenanceStatus = (nextMaintenanceDate) => {
    if (!nextMaintenanceDate) return { text: 'N/A', classes: 'text-gray-500' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maintenanceDate = new Date(nextMaintenanceDate);
    maintenanceDate.setHours(0, 0, 0, 0);

    const diffTime = maintenanceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} days`, classes: 'text-red-600 font-semibold' };
    } else if (diffDays === 0) {
      return { text: 'Today!', classes: 'text-orange-600 font-semibold' };
    } else if (diffDays <= 7) {
      return { text: `In ${diffDays} days`, classes: 'text-yellow-600' };
    } else {
      return { text: nextMaintenanceDate, classes: 'text-gray-700 dark:text-gray-300' };
    }
  };

  const unique = (key) => [...new Set(tools.map(t => t[key]))].filter(Boolean); // Filter out empty strings

  // --- CRUD Operations ---
  const handleAddToolClick = () => {
    setCurrentToolForModal({
      id: `tool-${Date.now()}`, // Unique ID for new tool
      name: '',
      type: '',
      location: '',
      assignedTo: '',
      inUseBy: '',
      returnDue: '',
      status: 'Available',
      nextMaintenance: '',
      expectedLifespan: '',
    });
    setShowAddEditModal(true);
  };

  const handleEditToolClick = (tool) => {
    setCurrentToolForModal({ ...tool }); // Pass a copy of the tool for editing
    setShowAddEditModal(true);
  };

  const handleSaveTool = (formData) => {
    setTools(prevTools => {
      if (formData.id && prevTools.some(tool => tool.id === formData.id)) {
        // Edit existing tool
        return prevTools.map(tool =>
          tool.id === formData.id ? { ...tool, ...formData } : tool
        );
      } else {
        // Add new tool
        return [...prevTools, { ...formData, id: `tool-${Date.now()}` }]; // Ensure new ID if somehow missing
      }
    });
    setShowAddEditModal(false);
    setCurrentToolForModal(null);
  };

  const handleDeleteTool = (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      setTools(prevTools => prevTools.filter(tool => tool.id !== toolId));
    }
  };

  // Form fields for Add/Edit Tool Modal
  const toolFormFields = [
    { name: 'name', label: 'Tool Name', type: 'text', required: true, icon: Wrench },
    { name: 'type', label: 'Type', type: 'text', required: true, icon: Tag },
    { name: 'location', label: 'Location', type: 'text', required: true, icon: MapPin },
    { name: 'assignedTo', label: 'Assigned Task', type: 'text', icon: ClipboardList },
    { name: 'inUseBy', label: 'In Use By', type: 'text', icon: User },
    { name: 'returnDue', label: 'Return Due Date', type: 'date', icon: Calendar },
    {
      name: 'status', label: 'Status', type: 'select', required: true, icon: CheckCircle,
      options: [
        { value: 'Available', label: 'Available' },
        { value: 'In Use', label: 'In Use' },
        { value: 'Under Maintenance', label: 'Under Maintenance' },
        { value: 'Broken', label: 'Broken' },
      ]
    },
    { name: 'nextMaintenance', label: 'Next Maintenance Date', type: 'date', icon: Clock },
    { name: 'expectedLifespan', label: 'Expected Lifespan', type: 'text', icon: Info },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen font-inter text-gray-900 dark:from-gray-900 dark:to-black dark:text-white">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
        <Wrench className="w-10 h-10 text-blue-600 dark:text-blue-400" /> Tool & Machine Assignments
      </h1>

      {/* Filters and Actions */}
      <Card className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Filter size={20} className="text-purple-600 dark:text-purple-400" /> Filters
          </h2>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="text"
            placeholder="Search by name, task, user..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            icon={<Search size={18} className="text-gray-400 dark:text-gray-500" />}
            className="w-full"
          />
          <Select
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={[{ value: '', label: 'All Statuses' }, ...unique('status').map(s => ({ value: s, label: s }))]}
            icon={<CheckCircle size={18} className="text-gray-400 dark:text-gray-500" />}
            className="w-full"
          />
          <Select
            value={filters.location}
            onChange={(value) => setFilters({ ...filters, location: value })}
            options={[{ value: '', label: 'All Locations' }, ...unique('location').map(loc => ({ value: loc, label: loc }))]}
            icon={<MapPin size={18} className="text-gray-400 dark:text-gray-500" />}
            className="w-full"
          />
          <Select
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value })}
            options={[{ value: '', label: 'All Types' }, ...unique('type').map(type => ({ value: type, label: type }))]}
            icon={<Tag size={18} className="text-gray-400 dark:text-gray-500" />}
            className="w-full"
          />
        </div>
      </Card>

      {/* Tools Table */}
      <Card className="p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <ClipboardList size={20} className="text-blue-600 dark:text-blue-400" /> Current Tool Assignments
        </h2>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs text-gray-900 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-t-lg">
              <tr>
                <th scope="col" className="px-4 py-3 rounded-tl-lg">Tool Name</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Location</th>
                <th scope="col" className="px-4 py-3">Assigned Task</th>
                <th scope="col" className="px-4 py-3">In Use By</th>
                <th scope="col" className="px-4 py-3">Return Due</th>
                <th scope="col" className="px-4 py-3">Next Maintenance</th>
                <th scope="col" className="px-4 py-3 text-center">Status</th>
                <th scope="col" className="px-4 py-3 rounded-tr-lg text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <tr key={tool.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{tool.name}</td>
                    <td className="px-4 py-3">{tool.type}</td>
                    <td className="px-4 py-3">{tool.location}</td>
                    <td className="px-4 py-3">{tool.assignedTo || <span className="text-gray-500">-</span>}</td>
                    <td className="px-4 py-3">{tool.inUseBy || <span className="text-gray-500">-</span>}</td>
                    <td className="px-4 py-3">{tool.returnDue || <span className="text-gray-500">-</span>}</td>
                    <td className="px-4 py-3">
                        <span className={getMaintenanceStatus(tool.nextMaintenance).classes}>
                            {getMaintenanceStatus(tool.nextMaintenance).text}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(tool.status)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEditToolClick(tool)} title="Edit Tool" className="p-1">
                            <Edit size={18} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setSelectedTool(tool)} title="View Usage History" className="p-1">
                            <History size={18} className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteTool(tool.id)} title="Delete Tool" className="p-1">
                            <Trash2 size={18} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No tools found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedTool && (
        <UsageHistoryModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}

      {/* Add/Edit Tool Modal */}
      <ModalWithForm
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        onSubmit={handleSaveTool}
        title={currentToolForModal?.id ? `Edit Tool: ${currentToolForModal.name}` : 'Add New Tool'}
        fields={toolFormFields}
        formData={currentToolForModal || {}}
      />
    </div>
  );
};

export default ToolAssignments;
