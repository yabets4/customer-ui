import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  Plus, Search, Edit, Trash2, Eye, SortAsc, SortDesc, Wrench, Factory, MapPin, Calendar, CheckCircle, XCircle
} from 'lucide-react';

// --- Mock Data for Tools & Machinery ---
// This represents your in-memory collection of tools and machinery.
const mockToolsMachinery = [
  {
    id: 'TLM001',
    assetId: 'MAC-CNC-001',
    name: 'CNC Milling Machine (XYZ-Pro)',
    type: 'Machining',
    serialNumber: 'XYZPRO2023001',
    manufacturer: 'XYZ Corp',
    modelNumber: 'ProMill 500',
    purchaseDate: '2022-01-15',
    cost: 75000.00,
    status: 'Operational', // Operational, Under Maintenance, Out of Service
    location: 'Workshop A, Zone 1',
    lastMaintenanceDate: '2024-12-01',
    nextMaintenanceDate: '2025-06-01', // Past due for example
    assignedTo: 'Production Dept.',
    notes: 'High-precision 5-axis milling. Critical asset.',
    imageUrl: '/images/cnc-machine.jpg'
  },
  {
    id: 'TLM002',
    assetId: 'TOOL-DRL-005',
    name: 'Heavy Duty Drill Press',
    type: 'Hand Tool/Power Tool',
    serialNumber: 'DRLPRS2021005',
    manufacturer: 'PowerTools Inc.',
    modelNumber: 'HD-200',
    purchaseDate: '2021-03-20',
    cost: 1500.00,
    status: 'Operational',
    location: 'Workshop B, Tool Rack 3',
    lastMaintenanceDate: '2025-02-10',
    nextMaintenanceDate: '2025-08-10',
    assignedTo: 'Assembly Line 1',
    notes: 'Used for large bore drilling.',
    imageUrl: '/images/drill-press.jpg'
  },
  {
    id: 'TLM003',
    assetId: 'TEST-QAL-003',
    name: 'Universal Testing Machine',
    type: 'Testing Equipment',
    serialNumber: 'UTM-ALPHA-003',
    manufacturer: 'QualityCheck Systems',
    modelNumber: 'Alpha-9000',
    purchaseDate: '2023-07-01',
    cost: 30000.00,
    status: 'Under Maintenance',
    location: 'Quality Control Lab',
    lastMaintenanceDate: '2025-06-10',
    nextMaintenanceDate: '2025-12-10',
    assignedTo: 'QA Dept.',
    notes: 'Currently undergoing calibration.',
    imageUrl: '/images/testing-machine.jpg'
  },
  {
    id: 'TLM004',
    assetId: 'LIFT-FORK-001',
    name: 'Electric Forklift (Warehouse)',
    type: 'Material Handling',
    serialNumber: 'FLK-ELC-001',
    manufacturer: 'LiftMaster',
    modelNumber: 'E-5000',
    purchaseDate: '2020-09-01',
    cost: 25000.00,
    status: 'Operational',
    location: 'Main Warehouse',
    lastMaintenanceDate: '2025-04-01',
    nextMaintenanceDate: '2025-10-01',
    assignedTo: 'Logistics Dept.',
    notes: 'Used for moving heavy pallets.',
    imageUrl: '/images/forklift.jpg'
  },
  {
    id: 'TLM005',
    assetId: 'TOOL-WLD-002',
    name: 'MIG Welder (Portable)',
    type: 'Welding Equipment',
    serialNumber: 'MIG-PORT-002',
    manufacturer: 'WeldTech',
    modelNumber: 'ProMIG 180',
    purchaseDate: '2024-02-01',
    cost: 1800.00,
    status: 'Operational',
    location: 'Workshop C, Welding Bay',
    lastMaintenanceDate: null, // No previous maintenance
    nextMaintenanceDate: '2025-11-01',
    assignedTo: 'Fabrication Team',
    notes: 'Recently acquired for new project.',
    imageUrl: '/images/welder.jpg'
  },
];

const ToolMachineListPage = () => {
  const navigate = useNavigate();
  const [toolsMachinery, setToolsMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Simulate fetching data on component mount
  useEffect(() => {
    const fetchToolsMachinery = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setToolsMachinery(mockToolsMachinery);
      } catch (err) {
        setError('Failed to load tools and machinery. Please try again.');
        console.error('Error fetching tools/machinery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchToolsMachinery();
  }, []);

  // Filter and sort the tools/machinery
  const filteredAndSortedToolsMachinery = useMemo(() => {
    let sortableItems = [...toolsMachinery];

    // Filter
    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle date comparisons
        if (sortConfig.key.includes('Date')) {
            const dateA = aValue ? new Date(aValue) : null;
            const dateB = bValue ? new Date(bValue) : null;
            if (dateA && dateB) {
                return sortConfig.direction === 'ascending' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            }
            // Handle null dates: nulls typically go to end
            if (dateA === null && dateB !== null) return sortConfig.direction === 'ascending' ? 1 : -1;
            if (dateA !== null && dateB === null) return sortConfig.direction === 'ascending' ? -1 : 1;
            return 0; // Both are null
        }
        
        // Handle string/number comparisons
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [toolsMachinery, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <SortAsc className="w-4 h-4 ml-1 inline" /> : <SortDesc className="w-4 h-4 ml-1 inline" />;
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setLoading(true); // Indicate deletion is in progress
      try {
        // Simulate API call for deletion
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update the mock data (in a real app, you'd send a DELETE request)
        const updatedToolsMachinery = mockToolsMachinery.filter(item => item.id !== itemToDelete.id);
        // This is crucial: re-assigning mockToolsMachinery to update the source
        // In a real app, this would be a state update from fetched data.
        mockToolsMachinery = updatedToolsMachinery; 
        setToolsMachinery(updatedToolsMachinery); 

        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        console.log(`Tool/Machine ${itemToDelete.name} deleted successfully (mock).`);
      } catch (err) {
        setError('Failed to delete tool/machine. Please try again.');
        console.error('Error deleting tool/machine:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Out of Service': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // Helper to check if next maintenance is overdue
  const isMaintenanceOverdue = (nextMaintenanceDate) => {
    if (!nextMaintenanceDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize to start of day
    const maintenanceDate = new Date(nextMaintenanceDate);
    maintenanceDate.setHours(0,0,0,0); // Normalize to start of day
    return maintenanceDate < today;
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 dark:text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        <Wrench className="inline-block w-8 h-8 mr-2 text-blue-600" /> Tools & Machinery List
      </h1>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <Input
            type="text"
            placeholder="Search by name, asset ID, type, location or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="w-full md:w-1/2"
          />
          <Button
            onClick={() => navigate('/inventory/tools-machinery/new')}
            variant="primary"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Tool/Machine
          </Button>
        </div>

        {filteredAndSortedToolsMachinery.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No tools or machinery found. {searchTerm && "Try adjusting your search filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('assetId')}
                  >
                    Asset ID {getSortIcon('assetId')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('type')}
                  >
                    Type {getSortIcon('type')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('location')}
                  >
                    Location {getSortIcon('location')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('nextMaintenanceDate')}
                  >
                    Next Maint. {getSortIcon('nextMaintenanceDate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedToolsMachinery.map((tool) => (
                  <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {tool.assetId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tool.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tool.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(tool.status)}`}>
                        {tool.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tool.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {tool.nextMaintenanceDate ? (
                            <div className={`flex items-center ${isMaintenanceOverdue(tool.nextMaintenanceDate) ? 'text-red-600 font-bold' : 'text-gray-500 dark:text-gray-300'}`}>
                                {isMaintenanceOverdue(tool.nextMaintenanceDate) && <XCircle className="w-4 h-4 mr-1" />}
                                {!isMaintenanceOverdue(tool.nextMaintenanceDate) && <CheckCircle className="w-4 h-4 mr-1 text-green-500" />}
                                {tool.nextMaintenanceDate}
                            </div>
                        ) : (
                            <span className="text-gray-400">N/A</span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/inventory/tools-machinery/${tool.id}`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/inventory/tools-machinery/${tool.id}/edit`)}
                          title="Edit Tool/Machine"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(tool)}
                          title="Delete Tool/Machine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ModalWithForm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        className="border-red-500"
      >
        <p className="text-center text-lg mb-4">
          Are you sure you want to delete "<strong>{itemToDelete?.name} ({itemToDelete?.assetId})</strong>"?
          This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="danger">
            {loading ? <LoadingSpinner size="sm" /> : 'Delete'}
          </Button>
        </div>
      </ModalWithForm>
    </div>
  );
};

export default ToolMachineListPage;