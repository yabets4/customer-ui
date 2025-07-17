import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import {Textarea} from '../../../components/ui/Textarea';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import {
  ArrowLeft, Wrench, Calendar, Tag, DollarSign,
  FileText, PlusCircle, User, ListChecks
} from 'lucide-react';

// --- Mock Fixed Asset Data (for fetching asset name) ---
// This should ideally come from a shared context or API, but for mock pages, repeated.
let mockFixedAssets = [
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

// --- Mock Maintenance Records Data ---
let mockMaintenanceRecords = [
    {
        id: 'M001',
        fixedAssetId: 'FA001', // CNC Milling Machine (Model X5)
        date: '2023-11-05',
        type: 'Preventive',
        description: 'Annual lubrication and calibration of spindle.',
        cost: 1200.00,
        performedBy: 'External Service Tech',
        notes: 'Preventative maintenance as per manufacturer guidelines. No major issues found.'
    },
    {
        id: 'M002',
        fixedAssetId: 'FA001',
        date: '2024-03-20',
        type: 'Corrective',
        description: 'Replaced worn-out bearing in axis X motor.',
        cost: 750.50,
        performedBy: 'Internal Maintenance Team',
        notes: 'Bearing failure caused minor vibration. Resolved efficiently.'
    },
    {
        id: 'M003',
        fixedAssetId: 'FA002', // Electric Forklift (Warehouse)
        date: '2024-01-25',
        type: 'Inspection',
        description: 'Quarterly safety inspection and battery health check.',
        cost: 150.00,
        performedBy: 'Logistics Supervisor',
        notes: 'All safety features operational. Battery health at 95%.'
    },
    {
        id: 'M004',
        fixedAssetId: 'FA003', // Office Printer (HP LaserJet Pro)
        date: '2024-06-10',
        type: 'Corrective',
        description: 'Replaced toner cartridge and cleaned paper feed rollers.',
        cost: 120.00,
        performedBy: 'Office Admin',
        notes: 'User reported faded prints. Routine maintenance.'
    },
    {
        id: 'M005',
        fixedAssetId: 'FA007', // Industrial Robot Arm
        date: '2024-05-15',
        type: 'Preventive',
        description: 'Software update and joint lubrication.',
        cost: 2500.00,
        performedBy: 'Manufacturer Tech Support',
        notes: 'Critical security update applied.'
    },
    {
        id: 'M006',
        fixedAssetId: 'FA001',
        date: '2024-07-10', // Example for current date near now
        type: 'Inspection',
        description: 'Pre-shutdown system check.',
        cost: 0.00,
        performedBy: 'Internal Maintenance Team',
        notes: 'Routine check before extended break. Everything okay.'
    }
];

const maintenanceTypes = [
    { value: '', label: 'Select Type', disabled: true },
    { value: 'Preventive', label: 'Preventive Maintenance' },
    { value: 'Corrective', label: 'Corrective Maintenance' },
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Calibration', label: 'Calibration' },
    { value: 'Repair', label: 'Repair' },
    { value: 'Upgrade', label: 'Upgrade' },
    { value: 'Other', label: 'Other' },
];

const FixedAssetMaintenancePage = () => {
  const { id } = useParams(); // Get the fixed asset ID from the URL
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null); // The fixed asset whose maintenance we're viewing
  const [maintenanceRecords, setMaintenanceRecords] = useState([]); // Records for this specific asset
  const [newRecordFormData, setNewRecordFormData] = useState({
    date: '',
    type: '',
    description: '',
    cost: '',
    performedBy: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loadingAsset, setLoadingAsset] = useState(true); // For initial asset fetch
  const [loadingRecords, setLoadingRecords] = useState(false); // For refreshing records
  const [error, setError] = useState(null); // General page error
  const [isSubmitting, setIsSubmitting] = useState(false); // For new record submission

  // Fetch Fixed Asset details
  const fetchAssetDetails = useCallback(async () => {
    setLoadingAsset(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
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
      setLoadingAsset(false);
    }
  }, [id]);

  // Fetch Maintenance Records for this asset
  const fetchMaintenanceRecords = useCallback(async () => {
    setLoadingRecords(true);
    setError(null); // Clear general error, if any, specific to this fetch
    try {
      await new Promise(resolve => setTimeout(resolve, 400)); // Simulate API call
      const recordsForAsset = mockMaintenanceRecords
        .filter(record => record.fixedAssetId === id)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
      setMaintenanceRecords(recordsForAsset);
    } catch (err) {
      setError('Failed to load maintenance records. Please try again.');
      console.error('Error fetching maintenance records:', err);
    } finally {
      setLoadingRecords(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssetDetails();
    fetchMaintenanceRecords();
  }, [fetchAssetDetails, fetchMaintenanceRecords]);

  const handleNewRecordChange = (e) => {
    const { name, value } = e.target;
    setNewRecordFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateNewRecordForm = useCallback(() => {
    const errors = {};
    if (!newRecordFormData.date) errors.date = 'Date is required.';
    if (!newRecordFormData.type) errors.type = 'Maintenance Type is required.';
    if (!newRecordFormData.description.trim()) errors.description = 'Description is required.';

    const recordDate = new Date(newRecordFormData.date);
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize to start of day for comparison

    if (recordDate > today) {
      errors.date = 'Date cannot be in the future.';
    }

    if (newRecordFormData.cost && (isNaN(Number(newRecordFormData.cost)) || Number(newRecordFormData.cost) < 0)) {
      errors.cost = 'Cost must be a non-negative number.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newRecordFormData]);

  const handleNewRecordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    if (!validateNewRecordForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

      const newId = `M${String(mockMaintenanceRecords.length + 1).padStart(3, '0')}`;
      const newRecord = {
        id: newId,
        fixedAssetId: id,
        date: newRecordFormData.date,
        type: newRecordFormData.type,
        description: newRecordFormData.description.trim(),
        cost: newRecordFormData.cost ? Number(newRecordFormData.cost) : 0,
        performedBy: newRecordFormData.performedBy.trim(),
        notes: newRecordFormData.notes.trim(),
      };

      mockMaintenanceRecords.push(newRecord); // Add to mock data
      console.log('New maintenance record added:', newRecord);

      // Clear form and re-fetch records to update the list
      setNewRecordFormData({
        date: '',
        type: '',
        description: '',
        cost: '',
        performedBy: '',
        notes: '',
      });
      fetchMaintenanceRecords(); // Refresh the list of records
    } catch (err) {
      setError(`Failed to add maintenance record. ${err.message || 'Please try again.'}`);
      console.error('Maintenance record submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingAsset) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !asset) { // Only show full page error if asset not found
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 dark:text-red-400 text-lg">
        {error}
        <Button onClick={() => navigate('/inventory/fixed-assets')} className="mt-4">
          Go to Fixed Assets List
        </Button>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-400 text-lg">
        Fixed asset details not available.
        <Button onClick={() => navigate('/inventory/fixed-assets')} className="ml-4">
          Go to Fixed Assets List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Wrench className="w-8 h-8 mr-2 text-indigo-600" />
          Maintenance for: <span className="ml-2 text-indigo-700 dark:text-indigo-400">{asset.name}</span>
        </h1>
        <Button onClick={() => navigate(`/inventory/fixed-assets/${id}`)} variant="secondary">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Details
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
          Add New Maintenance Record
        </h2>
        <form onSubmit={handleNewRecordSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Input
              label="Maintenance Date"
              id="recordDate"
              name="date"
              type="date"
              value={newRecordFormData.date}
              onChange={handleNewRecordChange}
              required
              error={formErrors.date}
              icon={<Calendar className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Select
              label="Maintenance Type"
              id="recordType"
              name="type"
              value={newRecordFormData.type}
              onChange={handleNewRecordChange}
              options={maintenanceTypes}
              placeholder="Select Type"
              required
              error={formErrors.type}
              icon={<Tag className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Input
              label="Cost ($) (Optional)"
              id="recordCost"
              name="cost"
              type="number"
              value={newRecordFormData.cost}
              onChange={handleNewRecordChange}
              placeholder="e.g., 250.00"
              step="0.01"
              error={formErrors.cost}
              icon={<DollarSign className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Input
              label="Performed By (Optional)"
              id="performedBy"
              name="performedBy"
              type="text"
              value={newRecordFormData.performedBy}
              onChange={handleNewRecordChange}
              placeholder="e.g., Internal Team, John Doe"
              icon={<User className="w-5 h-5" />}
              disabled={isSubmitting}
            />
          </div>
          <Textarea
            label="Description"
            id="recordDescription"
            name="description"
            value={newRecordFormData.description}
            onChange={handleNewRecordChange}
            placeholder="Describe the maintenance performed, issues found, resolutions, etc."
            rows="3"
            required
            error={formErrors.description}
            icon={ListChecks} // Assuming Textarea supports icon prop like Input
            disabled={isSubmitting}
          />
          <Textarea
            label="Additional Notes (Optional)"
            id="recordNotes"
            name="notes"
            value={newRecordFormData.notes}
            onChange={handleNewRecordChange}
            placeholder="Any other relevant details."
            rows="2"
            icon={FileText} // Assuming Textarea supports icon prop
            disabled={isSubmitting}
          />

          {error && ( // Display submission error for the new record form
            <div className="p-3 my-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md text-sm">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <PlusCircle className="w-5 h-5 mr-2" />
              )}
              Add Record
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
          Maintenance History
        </h2>

        {loadingRecords ? (
          <div className="flex justify-center items-center h-24">
            <LoadingSpinner />
          </div>
        ) : maintenanceRecords.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No maintenance records found for this asset.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Performed By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {maintenanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {record.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {record.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      ${record.cost ? record.cost.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {record.performedBy || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {record.notes || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FixedAssetMaintenancePage;