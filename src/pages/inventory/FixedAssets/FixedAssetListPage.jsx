import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input'; // Assuming correct path
import Select from '../../../components/ui/Select';
import ModalWithForm from '../../../components/ui/modal';
import Table from '../../../components/ui/Table'; // Correct import for your Table component
import LoadingSpinner from '../../../components/ui/LoadingSpinner'; // Keep for page-level loading

import {
  Building, Search, Plus, Tag, MapPin, DollarSign,
  Calendar, Wrench, Eye, Edit, Trash2, Construction
} from 'lucide-react';

// --- Mock Data ---
let mockFixedAssets = [
  {
    id: 'FA001',
    name: 'CNC Milling Machine (Model X5)',
    category: 'Machinery',
    acquisitionDate: '2020-03-15',
    acquisitionValue: 75000.00,
    currentValue: 45000.00, // Simplified depreciation for mock
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 10,
    location: 'Production Floor A',
    status: 'In Repair',
    serialNumber: 'CNCX5-2020-001',
    assignedTo: 'Manufacturing Dept.',
    notes: 'Main production machine. Annual maintenance due in Q4.'
  },
  {
    id: 'FA002',
    name: 'Electric Forklift (Warehouse)',
    category: 'Vehicles',
    acquisitionDate: '2022-01-20',
    acquisitionValue: 30000.00,
    currentValue: 25000.00,
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 7,
    location: 'Warehouse B',
    status: 'In Use',
    serialNumber: 'ELFORK-WB-005',
    assignedTo: 'Logistics Team',
    notes: 'Used for moving heavy pallets. Battery checked monthly.'
  },
  {
    id: 'FA003',
    name: 'Office Printer (HP LaserJet Pro)',
    category: 'Office Equipment',
    acquisitionDate: '2023-05-10',
    acquisitionValue: 800.00,
    currentValue: 700.00,
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 5,
    location: 'Office 301',
    status: 'In Use',
    serialNumber: 'HPLJP-301-A',
    assignedTo: 'Admin Dept.',
    notes: 'Primary office printer. Toner replacement due soon.'
  },
  {
    id: 'FA004',
    name: 'Server Rack #1 (Data Center)',
    category: 'IT Hardware',
    acquisitionDate: '2019-11-01',
    acquisitionValue: 15000.00,
    currentValue: 5000.00,
    depreciationMethod: 'Declining Balance',
    usefulLifeYears: 8,
    location: 'Server Room',
    status: 'In Use',
    serialNumber: 'SRACK-DC-001',
    assignedTo: 'IT Dept.',
    notes: 'Hosts critical production servers.'
  },
  {
    id: 'FA005',
    name: 'Conference Room Table (Large)',
    category: 'Furniture',
    acquisitionDate: '2021-02-28',
    acquisitionValue: 2500.00,
    currentValue: 2000.00,
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 15,
    location: 'Conference Room 1',
    status: 'In Use',
    serialNumber: 'CRTAB-001',
    assignedTo: 'General Office',
    notes: 'Heavy duty, custom made.'
  },
  {
    id: 'FA006',
    name: 'Company Van (Ford Transit)',
    category: 'Vehicles',
    acquisitionDate: '2024-02-01',
    acquisitionValue: 45000.00,
    currentValue: 43000.00,
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 5,
    location: 'Company Parking Lot',
    status: 'In Use',
    serialNumber: 'FT-2024-001',
    assignedTo: 'Sales Team',
    notes: 'New vehicle for sales and delivery.'
  },
  {
    id: 'FA007',
    name: 'Industrial Robot Arm (KUKA KR CYBERTECH)',
    category: 'Machinery',
    acquisitionDate: '2021-08-01',
    acquisitionValue: 120000.00,
    currentValue: 90000.00,
    depreciationMethod: 'Declining Balance',
    usefulLifeYears: 12,
    location: 'Assembly Line 3',
    status: 'In Use',
    serialNumber: 'KUKA-KRC-007',
    assignedTo: 'Automation Dept.',
    notes: 'Used for precision welding.'
  },
  {
    id: 'FA008',
    name: '3D Printer (Ultimaker S5)',
    category: 'Office Equipment',
    acquisitionDate: '2023-10-10',
    acquisitionValue: 6000.00,
    currentValue: 5500.00,
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 6,
    location: 'R&D Lab',
    status: 'In Use',
    serialNumber: 'ULTIS5-RD-001',
    assignedTo: 'R&D Team',
    notes: 'Used for rapid prototyping.'
  },
  {
    id: 'FA009',
    name: 'Backup Generator (Diesel)',
    category: 'Infrastructure',
    acquisitionDate: '2018-01-01',
    acquisitionValue: 25000.00,
    currentValue: 10000.00,
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 20,
    location: 'Utility Building',
    status: 'In Use',
    serialNumber: 'GEN-DS-B001',
    assignedTo: 'Facilities Management',
    notes: 'Regularly tested and maintained.'
  },
  {
    id: 'FA010',
    name: 'Desktop PC (Development)',
    category: 'IT Hardware',
    acquisitionDate: '2024-01-05',
    acquisitionValue: 1800.00,
    currentValue: 1700.00,
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 3,
    location: 'Office 205',
    status: 'In Use',
    serialNumber: 'DPC-DEV-001',
    assignedTo: 'Software Dev.',
    notes: 'High-performance workstation.'
  },
];

const fixedAssetCategories = [
    { value: 'All', label: 'All Categories' },
    { value: 'Machinery', label: 'Machinery' },
    { value: 'Vehicles', label: 'Vehicles' },
    { value: 'Office Equipment', label: 'Office Equipment' },
    { value: 'IT Hardware', label: 'IT Hardware' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Infrastructure', label: 'Infrastructure' },
    { value: 'Other', label: 'Other' },
];

const fixedAssetStatuses = [
    { value: 'All', label: 'All Statuses' },
    { value: 'In Use', label: 'In Use' },
    { value: 'In Repair', label: 'In Repair' },
    { value: 'Disposed', label: 'Disposed' },
    { value: 'Idle', label: 'Idle' },
    { value: 'Under Maintenance', label: 'Under Maintenance' },
];

const FixedAssetListPage = () => {
  const navigate = useNavigate();
  const [fixedAssets, setFixedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);

  const fetchFixedAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setFixedAssets(mockFixedAssets);
    } catch (err) {
      setError('Failed to load fixed assets. Please try again.');
      console.error('Error fetching fixed assets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFixedAssets();
  }, [fetchFixedAssets]);

  const getStatusClass = useCallback((status) => {
    switch (status) {
      case 'In Use': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'In Repair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Disposed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'Idle': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'Under Maintenance': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  }, []);

  const handleDeleteClick = useCallback((asset) => {
    setAssetToDelete(asset);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (assetToDelete) {
      setLoading(true); // Keep loading true during deletion
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

        const updatedAssets = mockFixedAssets.filter(asset => asset.id !== assetToDelete.id);
        mockFixedAssets = updatedAssets; // Update the source mock data
        setFixedAssets(updatedAssets); // Update component state

        setIsDeleteModalOpen(false);
        setAssetToDelete(null);
        console.log(`Fixed Asset ${assetToDelete.id} deleted successfully (mock).`);
      } catch (err) {
        setError('Failed to delete fixed asset. Please try again.');
        console.error('Error deleting asset:', err);
      } finally {
        setLoading(false); // Set loading false after deletion completes
      }
    }
  };

  // Define columns for the Table component, using 'accessor' and 'render'
  const columns = useMemo(() => [
    {
      accessor: 'id',
      header: 'Asset ID',
      render: (item) => <span className="font-medium text-gray-900 dark:text-gray-100">{item.id}</span>
    },
    {
      accessor: 'name',
      header: 'Name',
      render: (item) => <span className="flex items-center"><Wrench className="w-4 h-4 mr-2" /> {item.name}</span>
    },
    {
      accessor: 'category',
      header: 'Category',
      render: (item) => <span className="flex items-center"><Tag className="w-4 h-4 mr-1 inline" /> {item.category}</span>
    },
    {
      accessor: 'location',
      header: 'Location',
      render: (item) => <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 inline" /> {item.location}</span>
    },
    {
      accessor: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
          {item.status}
        </span>
      )
    },
    {
      accessor: 'acquisitionDate',
      header: 'Acq. Date',
      render: (item) => <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 inline" /> {item.acquisitionDate}</span>
    },
    {
      accessor: 'acquisitionValue',
      header: 'Acq. Value',
      render: (item) => <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1 inline" /> {item.acquisitionValue.toFixed(2)}</span>
    },
    {
      accessor: 'currentValue',
      header: 'Current Value',
      render: (item) => <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1 inline" /> {item.currentValue.toFixed(2)}</span>
    },
    {
      accessor: 'actions', // A dummy accessor as content is fully rendered
      header: 'Actions',
      render: (item) => ( // 'render' function receives the full 'item' (row data)
        <div className="flex space-x-2">
          <Button
            variant="info"
            size="sm"
            onClick={() => navigate(`/inventory/assets/${item.id}`)}
            title="View Details"
            disabled={loading} // Disable if any global loading is happening
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/inventory/assets/${item.id}/edit`)}
            title="Edit Fixed Asset"
            disabled={loading} // Disable if any global loading is happening
          >
            <Edit className="w-4 h-4" />
          </Button>
        <Button
            variant="info"
            size="sm"
            onClick={() => navigate(`/inventory/assets/${item.id}/maintenance`)}
            title="Maintenance History"
            disabled={loading} // Disable if any global loading is happening
          >
            <Construction className="w-4 h-4" />
          </Button>
          <Button
            variant="dangerDark"
            size="sm"
            onClick={() => navigate(`/inventory/assets/${item.id}/disposal`)}
            title="Delete Fixed Asset"
            disabled={loading} // Disable if any global loading is happening
          >
            <Trash2 className="w-4 h-4" />
          </Button>

        </div>
      )
    },
  ], [navigate, loading, handleDeleteClick, getStatusClass]); // Dependencies for useMemo

  const filteredAssets = useMemo(() => {
    let currentFilteredItems = [...fixedAssets];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFilteredItems = currentFilteredItems.filter(asset =>
        (asset.name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
        (asset.serialNumber || '').toLowerCase().includes(lowerCaseSearchTerm) ||
        (asset.location || '').toLowerCase().includes(lowerCaseSearchTerm) ||
        (asset.assignedTo || '').toLowerCase().includes(lowerCaseSearchTerm) ||
        (asset.notes || '').toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (filterCategory !== 'All') {
      currentFilteredItems = currentFilteredItems.filter(asset => asset.category === filterCategory);
    }

    if (filterStatus !== 'All') {
      currentFilteredItems = currentFilteredItems.filter(asset => asset.status === filterStatus);
    }

    currentFilteredItems.sort((a, b) => new Date(b.acquisitionDate).getTime() - new Date(a.acquisitionDate).getTime());

    return currentFilteredItems;
  }, [fixedAssets, searchTerm, filterCategory, filterStatus]);


  // Handle global loading state for the page content
  if (loading && !isDeleteModalOpen) { // Only show full spinner for initial load, not during modal interactions
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle global error state for the page
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 dark:text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        <Building className="inline-block w-8 h-8 mr-2 text-indigo-600" /> Fixed Assets Register
      </h1>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <Input
            type="text"
            placeholder="Search by name, serial, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="w-full md:w-1/3"
          />
          <Select
            id="filterCategory"
            name="filterCategory"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            options={fixedAssetCategories}
            className="w-full md:w-auto"
            label="Filter by Category"
            hideLabel
          />
          <Select
            id="filterStatus"
            name="filterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={fixedAssetStatuses}
            className="w-full md:w-auto"
            label="Filter by Status"
            hideLabel
          />
          <Button
            onClick={() => navigate('/inventory/assets/new')}
            variant="primary"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Fixed Asset
          </Button>
        </div>

        {/* Use the Table component here */}
        <Table
          columns={columns}
          data={filteredAssets}
          // The Table component you provided does not accept a 'loading' prop.
          // It only shows 'No data to display' if data is empty.
          // The global 'loading' state is handled above this render.
          // emptyMessage is also handled internally by your Table component now.
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ModalWithForm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        className="border-red-500"
      >
        <p className="text-center text-lg mb-4">
          Are you sure you want to delete fixed asset "<strong>{assetToDelete?.name} ({assetToDelete?.id})</strong>"?
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

export default FixedAssetListPage;