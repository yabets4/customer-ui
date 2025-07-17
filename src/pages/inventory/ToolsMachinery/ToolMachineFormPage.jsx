import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  Save, XCircle, Wrench, Hash, Tag, Factory, DollarSign, Calendar, MapPin, Info, Clipboard, Image as ImageIcon, User, Settings, Clock
} from 'lucide-react';

// --- Mock Data (Consistent with other Tool/Machine pages) ---
// Use 'let' so we can modify it to simulate adding/updating
let mockToolsMachinery = [
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
    nextMaintenanceDate: '2025-06-01',
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

// Options for select dropdowns
const toolMachineTypes = [
  { value: 'Machining', label: 'Machining Equipment' },
  { value: 'Hand Tool/Power Tool', label: 'Hand Tool / Power Tool' },
  { value: 'Testing Equipment', label: 'Testing Equipment' },
  { value: 'Material Handling', label: 'Material Handling Equipment' },
  { value: 'Welding Equipment', label: 'Welding Equipment' },
  { value: 'Assembly Tools', label: 'Assembly Tools' },
  { value: 'Safety Equipment', label: 'Safety Equipment' },
  { value: 'Other', label: 'Other' },
];

const toolMachineStatuses = [
  { value: 'Operational', label: 'Operational' },
  { value: 'Under Maintenance', label: 'Under Maintenance' },
  { value: 'Out of Service', label: 'Out of Service' },
  { value: 'Retired', label: 'Retired' },
];

const toolMachineLocations = [
  { value: 'Workshop A, Zone 1', label: 'Workshop A, Zone 1' },
  { value: 'Workshop B, Tool Rack 3', label: 'Workshop B, Tool Rack 3' },
  { value: 'Quality Control Lab', label: 'Quality Control Lab' },
  { value: 'Main Warehouse', label: 'Main Warehouse' },
  { value: 'Workshop C, Welding Bay', label: 'Workshop C, Welding Bay' },
  { value: 'Assembly Line 1', label: 'Assembly Line 1' },
  { value: 'Storage Unit D', label: 'Storage Unit D' },
];

const ToolMachineFormPage = () => {
  const { id } = useParams(); // Get ID if in edit mode
  const navigate = useNavigate();

  const isEditing = !!id; // True if ID exists in URL params

  const [formData, setFormData] = useState({
    assetId: '',
    name: '',
    type: '',
    serialNumber: '',
    manufacturer: '',
    modelNumber: '',
    purchaseDate: '',
    cost: '',
    status: 'Operational', // Default status for new items
    location: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    assignedTo: '',
    notes: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' });

  // Fetch data if in edit mode
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchToolMachine = async () => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const toolMachineToEdit = mockToolsMachinery.find(tm => tm.id === id);

        if (toolMachineToEdit) {
          setFormData({ ...toolMachineToEdit });
        } else {
          setError('Tool or Machine not found.');
          setModalContent({ title: 'Error', message: `Tool or Machine with ID "${id}" not found.`, type: 'error' });
          setModalOpen(true);
          navigate('/inventory/tools-machinery'); // Redirect if not found
        }
        setLoading(false);
      };
      fetchToolMachine();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.assetId.trim()) newErrors.assetId = 'Asset ID is required.';
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.type) newErrors.type = 'Type is required.';
    if (formData.cost === '' || isNaN(formData.cost) || parseFloat(formData.cost) < 0) newErrors.cost = 'Cost must be a non-negative number.';
    if (!formData.status) newErrors.status = 'Status is required.';
    if (!formData.location) newErrors.location = 'Location is required.';
    if (formData.purchaseDate && isNaN(new Date(formData.purchaseDate).getTime())) newErrors.purchaseDate = 'Invalid Purchase Date.';
    if (formData.lastMaintenanceDate && isNaN(new Date(formData.lastMaintenanceDate).getTime())) newErrors.lastMaintenanceDate = 'Invalid Last Maintenance Date.';
    if (formData.nextMaintenanceDate && isNaN(new Date(formData.nextMaintenanceDate).getTime())) newErrors.nextMaintenanceDate = 'Invalid Next Maintenance Date.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setModalContent({ title: 'Validation Error', message: 'Please correct the errors in the form.', type: 'error' });
      setModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dataToSave = {
        ...formData,
        cost: parseFloat(formData.cost),
        // Ensure dates are stored as YYYY-MM-DD strings or null
        purchaseDate: formData.purchaseDate || null,
        lastMaintenanceDate: formData.lastMaintenanceDate || null,
        nextMaintenanceDate: formData.nextMaintenanceDate || null,
      };

      if (isEditing) {
        // --- Mock Data Logic: Update existing tool/machine ---
        const index = mockToolsMachinery.findIndex(tm => tm.id === id);
        if (index !== -1) {
          mockToolsMachinery[index] = { ...mockToolsMachinery[index], ...dataToSave, id: id };
          console.log('Mock Tool/Machine Updated:', mockToolsMachinery[index]);
        }
        setModalContent({ title: 'Success', message: 'Tool/Machine updated successfully!', type: 'success' });
      } else {
        // --- Mock Data Logic: Add new tool/machine ---
        const newId = `TLM${(mockToolsMachinery.length + 1).toString().padStart(3, '0')}`;
        const newToolMachine = { ...dataToSave, id: newId };
        mockToolsMachinery.push(newToolMachine);
        console.log('Mock New Tool/Machine Added:', newToolMachine);
        setModalContent({ title: 'Success', message: 'New tool/machine added successfully!', type: 'success' });
      }

      console.log('Current State of Mock Tools & Machinery:', mockToolsMachinery);

      setModalOpen(true);
      setTimeout(() => {
        setModalOpen(false);
        navigate('/inventory/tools-machinery'); // Navigate back to the list
      }, 1500);

    } catch (err) {
      console.error("Submission error:", err);
      setModalContent({ title: 'Error', message: `Failed to ${isEditing ? 'update' : 'add'} tool/machine.`, type: 'error' });
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {isEditing ? `Edit Tool/Machine: ${formData.name}` : 'Add New Tool/Machine'}
      </h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Asset ID */}
            <div>
              <Input
                label="Asset ID"
                id="assetId"
                name="assetId"
                type="text"
                value={formData.assetId}
                onChange={handleChange}
                placeholder="e.g., MAC-CNC-001"
                icon={<Hash className="w-5 h-5" />}
                error={errors.assetId}
                required
              />
            </div>

            {/* Name */}
            <div>
              <Input
                label="Tool/Machine Name"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., CNC Milling Machine"
                icon={<Wrench className="w-5 h-5" />}
                error={errors.name}
                required
              />
            </div>

            {/* Type */}
            <div>
              <Select
                label="Type"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={toolMachineTypes}
                placeholder="Select Type"
                icon={<Tag className="w-5 h-5" />}
                error={errors.type}
                required
              />
            </div>

            {/* Status */}
            <div>
              <Select
                label="Status"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={toolMachineStatuses}
                placeholder="Select Status"
                icon={<Info className="w-5 h-5" />}
                error={errors.status}
                required
              />
            </div>

            {/* Location */}
            <div>
              <Select
                label="Current Location"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                options={toolMachineLocations}
                placeholder="Select Location"
                icon={<MapPin className="w-5 h-5" />}
                error={errors.location}
                required
              />
            </div>

            {/* Serial Number */}
            <div>
              <Input
                label="Serial Number"
                id="serialNumber"
                name="serialNumber"
                type="text"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="e.g., XYZPRO2023001"
                icon={<Settings className="w-5 h-5" />}
              />
            </div>

            {/* Manufacturer */}
            <div>
              <Input
                label="Manufacturer"
                id="manufacturer"
                name="manufacturer"
                type="text"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g., XYZ Corp"
                icon={<Factory className="w-5 h-5" />}
              />
            </div>

            {/* Model Number */}
            <div>
              <Input
                label="Model Number"
                id="modelNumber"
                name="modelNumber"
                type="text"
                value={formData.modelNumber}
                onChange={handleChange}
                placeholder="e.g., ProMill 500"
                icon={<Clipboard className="w-5 h-5" />}
              />
            </div>

            {/* Purchase Date */}
            <div>
              <Input
                label="Purchase Date"
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                icon={<Calendar className="w-5 h-5" />}
                error={errors.purchaseDate}
              />
            </div>

            {/* Cost */}
            <div>
              <Input
                label="Purchase Cost ($)"
                id="cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                placeholder="e.g., 75000.00"
                step="0.01"
                icon={<DollarSign className="w-5 h-5" />}
                error={errors.cost}
                required
              />
            </div>
            
            {/* Last Maintenance Date */}
            <div>
              <Input
                label="Last Maintenance Date"
                id="lastMaintenanceDate"
                name="lastMaintenanceDate"
                type="date"
                value={formData.lastMaintenanceDate}
                onChange={handleChange}
                icon={<Clock className="w-5 h-5" />}
                error={errors.lastMaintenanceDate}
              />
            </div>

            {/* Next Maintenance Date */}
            <div>
              <Input
                label="Next Maintenance Date"
                id="nextMaintenanceDate"
                name="nextMaintenanceDate"
                type="date"
                value={formData.nextMaintenanceDate}
                onChange={handleChange}
                icon={<Calendar className="w-5 h-5" />}
                error={errors.nextMaintenanceDate}
              />
            </div>

            {/* Assigned To */}
            <div>
              <Input
                label="Assigned To"
                id="assignedTo"
                name="assignedTo"
                type="text"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="e.g., Production Dept."
                icon={<User className="w-5 h-5" />}
              />
            </div>

            {/* Image URL */}
            <div>
              <Input
                label="Image URL"
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="e.g., /images/cnc-machine.jpg"
                icon={<ImageIcon className="w-5 h-5" />}
              />
              {formData.imageUrl && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="mr-2">Preview:</span>
                  <img src={formData.imageUrl} alt="Tool/Machine Preview" className="h-16 w-16 object-cover rounded-md shadow-sm" />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                <Clipboard className="w-4 h-4 mr-2 text-gray-500" /> Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any additional notes or details about the tool/machine..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/inventory/tools-machinery')}
              disabled={submitting}
            >
              <XCircle className="w-5 h-5 mr-2" /> Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" /> {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" /> {isEditing ? 'Save Changes' : 'Add Tool/Machine'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Success/Error Modal */}
      <ModalWithForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        className={`${modalContent.type === 'success' ? 'border-green-500' : 'border-red-500'}`}
      >
        <p className="text-center text-lg">{modalContent.message}</p>
        <div className="flex justify-center mt-4">
          <Button onClick={() => setModalOpen(false)} variant={modalContent.type === 'success' ? 'primary' : 'danger'}>
            Close
          </Button>
        </div>
      </ModalWithForm>
    </div>
  );
};

export default ToolMachineFormPage;