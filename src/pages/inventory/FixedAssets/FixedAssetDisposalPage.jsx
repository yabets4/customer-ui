import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import {Textarea} from '../../../components/ui/Textarea';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import {
  ArrowLeft, XCircle, Tag, MapPin, DollarSign,
  Calendar, Wrench, QrCode, User, FileText, Trash2, CheckCircle, Clock
} from 'lucide-react';

// --- Mock Data (same as in other Fixed Assets components) ---
// Using 'let' so we can modify it for disposal
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

const disposalMethods = [
  { value: '', label: 'Select Method', disabled: true },
  { value: 'Sale', label: 'Sale' },
  { value: 'Scrapped', label: 'Scrapped' },
  { value: 'Donated', label: 'Donated' },
  { value: 'Transferred', label: 'Transferred Internally' },
  { value: 'Other', label: 'Other' },
];

const FixedAssetDisposalPage = () => {
  const { id } = useParams(); // Get the asset ID from the URL
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null); // The asset being disposed
  const [formData, setFormData] = useState({
    disposalDate: '',
    disposalMethod: '',
    disposalProceeds: '', // Optional
    disposalNotes: '',    // Optional
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true); // For initial asset fetch
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission

  const fetchAssetDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundAsset = mockFixedAssets.find(a => a.id === id);

      if (foundAsset) {
        if (foundAsset.status === 'Disposed') {
            setError('This asset has already been disposed of.');
        }
        setAsset(foundAsset);
        // Pre-fill disposal date with today's date for convenience
        setFormData(prev => ({ ...prev, disposalDate: new Date().toISOString().split('T')[0] }));
      } else {
        setError('Fixed asset not found.');
      }
    } catch (err) {
      setError('Failed to load fixed asset details. Please try again.');
      console.error('Error fetching asset details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssetDetails();
  }, [fetchAssetDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.disposalDate) errors.disposalDate = 'Disposal Date is required.';
    if (!formData.disposalMethod) errors.disposalMethod = 'Disposal Method is required.';

    const disposalDate = new Date(formData.disposalDate);
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize to start of day for comparison

    if (disposalDate > today) {
      errors.disposalDate = 'Disposal Date cannot be in the future.';
    }

    if (asset && disposalDate < new Date(asset.acquisitionDate)) {
      errors.disposalDate = 'Disposal Date cannot be before Acquisition Date.';
    }

    if (formData.disposalMethod === 'Sale' && (isNaN(Number(formData.disposalProceeds)) || Number(formData.disposalProceeds) < 0)) {
      errors.disposalProceeds = 'Disposal Proceeds must be a non-negative number for Sale method.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, asset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const assetIndex = mockFixedAssets.findIndex(a => a.id === id);

      if (assetIndex !== -1) {
        const updatedAsset = {
          ...mockFixedAssets[assetIndex],
          status: 'Disposed',
          disposalDate: formData.disposalDate,
          disposalMethod: formData.disposalMethod,
          disposalProceeds: formData.disposalMethod === 'Sale' ? Number(formData.disposalProceeds) : 0,
          disposalNotes: formData.disposalNotes,
        };
        mockFixedAssets[assetIndex] = updatedAsset; // Update the mock data
        console.log('Fixed Asset disposed:', updatedAsset);
        navigate(`/inventory/fixed-assets/${id}`); // Go back to details page
      } else {
        throw new Error('Asset not found for disposal.');
      }
    } catch (err) {
      setError(`Failed to dispose of fixed asset. ${err.message || 'Please try again.'}`);
      console.error('Disposal submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/inventory/fixed-assets/${id}`); // Go back to the asset details page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !asset) { // Show full page error if asset not found
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
        Asset data not available for disposal.
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
          <Trash2 className="w-8 h-8 mr-2 text-red-600" />
          Dispose Fixed Asset: <span className="ml-2 text-indigo-700 dark:text-indigo-400">{asset.name}</span>
        </h1>
        <Button onClick={() => navigate(`/inventory/fixed-assets/${id}`)} variant="secondary">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Details
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
          Asset Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 mb-6">
          <p className="flex items-center"><span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Asset ID:</span> {asset.id}</p>
          <p className="flex items-center"><span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Name:</span> {asset.name}</p>
          <p className="flex items-center"><Tag className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Category:</span> {asset.category}</p>
          <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Location:</span> {asset.location}</p>
          <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Acquisition Date:</span> {asset.acquisitionDate}</p>
          <p className="flex items-center"><DollarSign className="w-4 h-4 mr-2" /> <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Current Value:</span> ${asset.currentValue.toFixed(2)}</p>
          <p className="flex items-center">
            <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">Current Status:</span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asset.status === 'Disposed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'}`}>
              {asset.status}
            </span>
          </p>
        </div>

        {error && asset.status === 'Disposed' ? (
             <div className="p-3 my-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-md text-sm flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-yellow-600" />
                <p>{error}</p>
             </div>
        ) : (
            <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-4 mt-6 text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
              Disposal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Disposal Date"
                id="disposalDate"
                name="disposalDate"
                type="date"
                value={formData.disposalDate}
                onChange={handleChange}
                required
                error={formErrors.disposalDate}
                icon={<Calendar className="w-5 h-5" />}
                disabled={isSubmitting}
              />
              <Select
                label="Disposal Method"
                id="disposalMethod"
                name="disposalMethod"
                value={formData.disposalMethod}
                onChange={handleChange}
                options={disposalMethods}
                placeholder="Select Method"
                required
                error={formErrors.disposalMethod}
                icon={<Trash2 className="w-5 h-5" />}
                disabled={isSubmitting}
              />
              <Input
                label="Proceeds from Disposal ($)"
                id="disposalProceeds"
                name="disposalProceeds"
                type="number"
                value={formData.disposalProceeds}
                onChange={handleChange}
                placeholder="e.g., 1500.00 (if sold)"
                step="0.01"
                icon={<DollarSign className="w-5 h-5" />}
                disabled={isSubmitting || formData.disposalMethod !== 'Sale'}
                className={formData.disposalMethod !== 'Sale' ? 'opacity-60 cursor-not-allowed' : ''}
              />
            </div>

            <Textarea
              label="Disposal Notes (Optional)"
              id="disposalNotes"
              name="disposalNotes"
              value={formData.disposalNotes}
              onChange={handleChange}
              placeholder="Record any important details about the disposal, buyer, reason, etc."
              rows="4"
              icon={FileText} // This assumes your Textarea component supports an 'icon' prop
              disabled={isSubmitting}
            />

            {error && asset.status !== 'Disposed' && ( // Show general submission error if not already disposed
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
                variant="danger" // Use danger variant for disposal action
                disabled={isSubmitting || asset.status === 'Disposed'}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Trash2 className="w-5 h-5 mr-2" />
                )}
                Confirm Disposal
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default FixedAssetDisposalPage;