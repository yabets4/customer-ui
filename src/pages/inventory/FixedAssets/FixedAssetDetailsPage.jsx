import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  ArrowLeft, Building, Tag, MapPin, DollarSign, Calendar,
  Wrench, QrCode, User, FileText, Edit, Trash2, Gauge, Clock,
  SquareCheckBig // For useful life/depreciation method icon
} from 'lucide-react';

// --- Mock Data (same as in FixedAssetListPage to maintain consistency) ---
const mockFixedAssets = [
  {
    id: 'FA001',
    name: 'CNC Milling Machine (Model X5)',
    category: 'Machinery',
    acquisitionDate: '2020-03-15',
    acquisitionValue: 75000.00,
    currentValue: 45000.00,
    depreciationMethod: 'Straight-line',
    usefulLifeYears: 10,
    location: 'Production Floor A',
    status: 'In Use',
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

const FixedAssetDetailsPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchAssetDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundAsset = mockFixedAssets.find(a => a.id === id);

      if (foundAsset) {
        setAsset(foundAsset);
      } else {
        setError('Fixed asset not found.');
      }
    } catch (err) {
      setError('Failed to load fixed asset details. Please try again.');
      console.error('Error fetching asset details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]); // Depend on ID to re-fetch if it changes

  useEffect(() => {
    fetchAssetDetails();
  }, [fetchAssetDetails]);

  const handleDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (!asset) return;
    setLoading(true); // Indicate loading during deletion
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      // Remove the asset from our mock data array
      const initialLength = mockFixedAssets.length;
      mockFixedAssets = mockFixedAssets.filter(a => a.id !== asset.id);

      if (mockFixedAssets.length < initialLength) {
        console.log(`Fixed Asset ${asset.id} deleted successfully (mock).`);
        navigate('/inventory/assets'); // Navigate back to the list page after deletion
      } else {
        setError('Failed to delete fixed asset. Asset not found in mock data.');
      }
    } catch (err) {
      setError('Failed to delete fixed asset. Please try again.');
      console.error('Error deleting asset:', err);
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false); // Close modal regardless of success/failure
    }
  };

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
        <Button onClick={() => navigate('/inventory/assets')} className="ml-4">
          Go to Fixed Assets List
        </Button>
      </div>
    );
  }

  if (!asset) {
    // This case should ideally be caught by the error state if asset is not found by ID
    // but included as a fallback for clarity.
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-400 text-lg">
        No asset data available.
        <Button onClick={() => navigate('/inventory/assets')} className="ml-4">
          Go to Fixed Assets List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Building className="w-8 h-8 mr-2 text-indigo-600" />
          Fixed Asset Details: <span className="ml-2 text-indigo-700 dark:text-indigo-400">{asset.name}</span>
        </h1>
        <Button onClick={() => navigate('/inventory/assets')} variant="secondary">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
          General Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <p className="flex items-center"><span className="font-medium mr-2 text-gray-900 dark:text-gray-100">ID:</span> {asset.id}</p>
          <p className="flex items-center"><Tag className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Category:</span> {asset.category}</p>
          <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Location:</span> {asset.location}</p>
          <p className="flex items-center">
            <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Status:</span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(asset.status)}`}>
              {asset.status}
            </span>
          </p>
          <p className="flex items-center"><QrCode className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Serial Number:</span> {asset.serialNumber}</p>
          <p className="flex items-center"><User className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Assigned To:</span> {asset.assignedTo || 'N/A'}</p>
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
          Financial & Depreciation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Acquisition Date:</span> {asset.acquisitionDate}</p>
          <p className="flex items-center"><DollarSign className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Acquisition Value:</span> ${asset.acquisitionValue.toFixed(2)}</p>
          <p className="flex items-center"><DollarSign className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Current Value:</span> ${asset.currentValue.toFixed(2)}</p>
          <p className="flex items-center"><SquareCheckBig className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Depreciation Method:</span> {asset.depreciationMethod}</p>
          <p className="flex items-center"><Clock className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Useful Life:</span> {asset.usefulLifeYears} years</p>
        </div>

        {asset.notes && (
          <>
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
              Notes
            </h2>
            <div className="flex items-start text-gray-700 dark:text-gray-300">
              <FileText className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
              <p className="whitespace-pre-wrap">{asset.notes}</p>
            </div>
          </>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          <Button
            onClick={() => navigate(`/inventory/assets/${asset.id}/edit`)}
            variant="secondary"
            disabled={loading}
          >
            <Edit className="w-5 h-5 mr-2" /> Edit Asset
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger"
            disabled={loading}
          >
            <Trash2 className="w-5 h-5 mr-2" /> Delete Asset
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ModalWithForm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        className="border-red-500"
      >
        <p className="text-center text-lg mb-4">
          Are you sure you want to delete fixed asset "<strong>{asset?.name} ({asset?.id})</strong>"?
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

export default FixedAssetDetailsPage;