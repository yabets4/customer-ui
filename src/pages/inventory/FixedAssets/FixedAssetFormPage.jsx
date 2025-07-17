import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import {Textarea} from '../../../components/ui/Textarea';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import {
  Building, Save, XCircle, Tag, MapPin, DollarSign,
  Calendar, Wrench, QrCode, User, FileText, Gauge, Clock, SquareCheckBig
} from 'lucide-react';

// --- Mock Data (same as in other Fixed Assets components) ---
// Using 'let' so we can modify it for adds/edits
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

const fixedAssetCategories = [
  { value: '', label: 'Select Category', disabled: true }, // Add an initial disabled option
  { value: 'Machinery', label: 'Machinery' },
  { value: 'Vehicles', label: 'Vehicles' },
  { value: 'Office Equipment', label: 'Office Equipment' },
  { value: 'IT Hardware', label: 'IT Hardware' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Other', label: 'Other' },
];

const fixedAssetStatuses = [
  { value: '', label: 'Select Status', disabled: true }, // Add an initial disabled option
  { value: 'In Use', label: 'In Use' },
  { value: 'In Repair', label: 'In Repair' },
  { value: 'Disposed', label: 'Disposed' },
  { value: 'Idle', label: 'Idle' },
  { value: 'Under Maintenance', label: 'Under Maintenance' },
];

const depreciationMethods = [
  { value: '', label: 'Select Method', disabled: true },
  { value: 'Straight-line', label: 'Straight-line' },
  { value: 'Declining Balance', label: 'Declining Balance' },
  { value: 'Sum-of-the-Years-Digits', label: 'Sum-of-the-Years-Digits' },
  { value: 'Units of Production', label: 'Units of Production' },
];

const FixedAssetFormPage = () => {
  const { id } = useParams(); // Get ID for edit mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    acquisitionDate: '',
    acquisitionValue: '',
    currentValue: '', // Will be calculated or default in new asset
    depreciationMethod: '',
    usefulLifeYears: '',
    location: '',
    status: '',
    serialNumber: '',
    assignedTo: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true); // True by default for initial load or edit data fetch
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAssetForEdit = useCallback(async () => {
    if (!isEditMode) {
      setLoading(false); // No data to fetch for new asset
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const assetToEdit = mockFixedAssets.find(a => a.id === id);

      if (assetToEdit) {
        setFormData({
          ...assetToEdit,
          // Ensure numbers are numbers, convert to string for input value
          acquisitionValue: String(assetToEdit.acquisitionValue),
          currentValue: String(assetToEdit.currentValue),
          usefulLifeYears: String(assetToEdit.usefulLifeYears),
        });
      } else {
        setError('Fixed asset not found for editing.');
      }
    } catch (err) {
      setError('Failed to load asset data for editing. Please try again.');
      console.error('Error fetching asset:', err);
    } finally {
      setLoading(false);
    }
  }, [id, isEditMode]);

  useEffect(() => {
    fetchAssetForEdit();
  }, [fetchAssetForEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being changed
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Asset Name is required.';
    if (!formData.category) errors.category = 'Category is required.';
    if (!formData.acquisitionDate) errors.acquisitionDate = 'Acquisition Date is required.';
    if (!formData.acquisitionValue || isNaN(Number(formData.acquisitionValue)) || Number(formData.acquisitionValue) <= 0) {
      errors.acquisitionValue = 'Acquisition Value must be a positive number.';
    }
    if (!formData.depreciationMethod) errors.depreciationMethod = 'Depreciation Method is required.';
    if (!formData.usefulLifeYears || isNaN(Number(formData.usefulLifeYears)) || Number(formData.usefulLifeYears) <= 0) {
      errors.usefulLifeYears = 'Useful Life must be a positive number of years.';
    }
    if (!formData.location.trim()) errors.location = 'Location is required.';
    if (!formData.status) errors.status = 'Status is required.';
    if (!formData.serialNumber.trim()) errors.serialNumber = 'Serial Number is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Clear previous errors

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const assetDataToSave = {
        ...formData,
        // Convert string numbers back to actual numbers
        acquisitionValue: Number(formData.acquisitionValue),
        currentValue: Number(formData.currentValue) || Number(formData.acquisitionValue), // Default current to acquisition if not set
        usefulLifeYears: Number(formData.usefulLifeYears),
      };

      if (isEditMode) {
        // Update existing asset
        const index = mockFixedAssets.findIndex(asset => asset.id === id);
        if (index !== -1) {
          mockFixedAssets[index] = { ...mockFixedAssets[index], ...assetDataToSave };
          console.log('Fixed Asset updated:', mockFixedAssets[index]);
        } else {
          throw new Error('Asset not found for update.');
        }
      } else {
        // Add new asset
        const newId = `FA${String(mockFixedAssets.length + 1).padStart(3, '0')}`;
        const newAsset = { ...assetDataToSave, id: newId };
        mockFixedAssets.push(newAsset);
        console.log('New Fixed Asset added:', newAsset);
      }
      navigate('/inventory/assets'); // Go back to list page
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'add'} fixed asset. ${err.message || 'Please try again.'}`);
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory/assets'); // Go back to the list page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Display error if fetching for edit failed
  if (error && isEditMode) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 dark:text-red-400 text-lg">
        {error}
        <Button onClick={() => navigate('/inventory/assets')} className="mt-4">
          Go to Fixed Assets List
        </Button>
      </div>
    );
  }


  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
        <Building className="w-8 h-8 mr-2 text-indigo-600" />
        {isEditMode ? `Edit Fixed Asset: ${formData.name || id}` : 'Add New Fixed Asset'}
      </h1>

      <Card className="p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* General Information */}
            <Input
              label="Asset Name"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Industrial Lathe"
              required
              error={formErrors.name}
              icon={<Wrench className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Select
              label="Category"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={fixedAssetCategories}
              placeholder="Select Category"
              required
              error={formErrors.category}
              icon={<Tag className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Input
              label="Serial Number"
              id="serialNumber"
              name="serialNumber"
              type="text"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="e.g., SN-12345-ABC"
              required
              error={formErrors.serialNumber}
              icon={<QrCode className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Input
              label="Location"
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Warehouse A, Office 301"
              required
              error={formErrors.location}
              icon={<MapPin className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Select
              label="Status"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={fixedAssetStatuses}
              placeholder="Select Status"
              required
              error={formErrors.status}
              icon={<Gauge className="w-5 h-5" />}
              disabled={isSubmitting}
            />
             <Input
              label="Assigned To (Optional)"
              id="assignedTo"
              name="assignedTo"
              type="text"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="e.g., John Doe / IT Dept."
              icon={<User className="w-5 h-5" />}
              disabled={isSubmitting}
            />

            {/* Financial Information */}
            <Input
              label="Acquisition Date"
              id="acquisitionDate"
              name="acquisitionDate"
              type="date"
              value={formData.acquisitionDate}
              onChange={handleChange}
              required
              error={formErrors.acquisitionDate}
              icon={<Calendar className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Input
              label="Acquisition Value ($)"
              id="acquisitionValue"
              name="acquisitionValue"
              type="number"
              value={formData.acquisitionValue}
              onChange={handleChange}
              placeholder="e.g., 50000.00"
              step="0.01"
              required
              error={formErrors.acquisitionValue}
              icon={<DollarSign className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Input
              label="Current Value ($)"
              id="currentValue"
              name="currentValue"
              type="number"
              value={formData.currentValue}
              onChange={handleChange}
              placeholder="e.g., 45000.00 (optional)"
              step="0.01"
              icon={<DollarSign className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Select
              label="Depreciation Method"
              id="depreciationMethod"
              name="depreciationMethod"
              value={formData.depreciationMethod}
              onChange={handleChange}
              options={depreciationMethods}
              placeholder="Select Method"
              required
              error={formErrors.depreciationMethod}
              icon={<SquareCheckBig className="w-5 h-5" />}
              disabled={isSubmitting}
            />
            <Input
              label="Useful Life (Years)"
              id="usefulLifeYears"
              name="usefulLifeYears"
              type="number"
              value={formData.usefulLifeYears}
              onChange={handleChange}
              placeholder="e.g., 10"
              min="1"
              required
              error={formErrors.usefulLifeYears}
              icon={<Clock className="w-5 h-5" />}
              disabled={isSubmitting}
            />
          </div>

          {/* Notes */}
          <Textarea
            label="Notes (Optional)"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any relevant notes about the asset, maintenance history, etc."
            rows="4"
            // Pass the component REFERENCE, not an already rendered JSX element
            icon={FileText}
            disabled={isSubmitting}
          />

          {error && (
            <div className="p-3 my-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md text-sm">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="secondary"
              disabled={isSubmitting}
            >
              <XCircle className="w-5 h-5 mr-2" /> Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isEditMode ? 'Update Asset' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FixedAssetFormPage;