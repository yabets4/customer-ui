import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import {
  ArrowDownCircle, ArrowUpCircle, XCircle, RefreshCw, Clipboard, Calendar,
  Hash, Factory, Landmark, BookOpen, MapPin, Package,
  Info, ChevronsRightLeft, PlusCircle, MinusCircle, User, Save
} from 'lucide-react';

// --- Mock Data for Raw Materials (Same as in RawMaterialFormPage, to ensure consistency) ---
// This array represents your "in-memory database" for raw materials.
const mockRawMaterials = [
  {
    id: 'RM001',
    name: 'Oak Wood Planks',
    description: 'High-quality oak wood for furniture manufacturing, ideal for durable and aesthetic designs. Kiln-dried to prevent warping.',
    category: 'Wood',
    uom: 'Cubic Feet',
    supplierLinkage: 'Lumber & Timber Co.',
    costPrice: 50.00,
    currentStock: 150, // Important: This will be updated by movements
    minStockLevel: 50,
    shelfLife: '2026-12-31',
    specifications: 'Grade A, kiln-dried, moisture content 8-10%, dimensions: 1"x6"x8\'',
    imageUrl: '/images/oak-wood.jpg',
    location: 'Warehouse A, Shelf 10'
  },
  {
    id: 'RM002',
    name: 'Velvet Fabric (Blue)',
    description: 'Luxurious blue velvet fabric, perfect for upholstery, curtains, and decorative accents. Soft to touch and rich in color.',
    category: 'Fabric',
    uom: 'Meters',
    supplierLinkage: 'Textile Innovations Ltd.',
    costPrice: 15.75,
    currentStock: 300,
    minStockLevel: 100,
    shelfLife: 'N/A',
    specifications: 'Polyester blend, 150 GSM, 140cm width, color: Royal Blue #00008B',
    imageUrl: '/images/blue-velvet.jpg',
    location: 'Warehouse B, Rack 3'
  },
  {
    id: 'RM003',
    name: 'Strong Adhesive (Type A)',
    description: 'Industrial-grade wood adhesive for strong and lasting bonds. Suitable for various wood types and applications.',
    category: 'Adhesive',
    uom: 'Litres',
    supplierLinkage: 'Chemical Solutions Inc.',
    costPrice: 25.00,
    currentStock: 75,
    minStockLevel: 20,
    shelfLife: '2025-09-15',
    specifications: 'Waterproof, fast-drying (30 min set), temperature range -20°C to 80°C',
    imageUrl: '/images/adhesive.jpg',
    location: 'Workshop Store, Bin 5'
  },
  {
    id: 'RM004',
    name: 'Steel Rods (10mm)',
    description: 'High-tensile carbon steel rods for structural reinforcement and fabrication. Essential for durable frames.',
    category: 'Metal',
    uom: 'Meters',
    supplierLinkage: 'MetalWorks Supply',
    costPrice: 8.50,
    currentStock: 500,
    minStockLevel: 150,
    shelfLife: 'N/A',
    specifications: 'ASTM A36, 6m length, 10mm diameter, smooth finish',
    imageUrl: '/images/steel-rods.jpg',
    location: 'Warehouse A, Section C'
  },
  {
    id: 'RM005',
    name: 'Leather Hides (Brown)',
    description: 'Premium full-grain brown leather hides, ideal for high-end furniture and accessories. Ethically sourced.',
    category: 'Leather',
    uom: 'Sq. Feet',
    supplierLinkage: 'Global Leather Co.',
    costPrice: 120.00,
    currentStock: 80,
    minStockLevel: 30,
    shelfLife: 'N/A',
    specifications: 'Full-grain, vegetable-tanned, average 50 sq. ft. per hide, thickness 1.8-2.2mm',
    imageUrl: '/images/leather-hides.jpg',
    location: 'Showroom Backstore'
  },
];

// --- Mock Data for Movement History ---
// This array will hold the simulated movement records.
let mockRawMaterialMovements = [
    {
        id: 'MOV001',
        rawMaterialId: 'RM001',
        movementType: 'Inbound',
        quantity: 50,
        uom: 'Cubic Feet',
        movementDate: '2024-06-01',
        sourceDocument: 'PO-2024-001',
        supplier: 'Lumber & Timber Co.',
        notes: 'Initial receipt from latest purchase order.',
        fromLocation: null,
        toLocation: 'Warehouse A, Shelf 10',
        adjustmentReason: null,
        adjustmentType: null,
        departmentOrProject: null,
        responsiblePerson: 'John Doe'
    },
    {
        id: 'MOV002',
        rawMaterialId: 'RM002',
        movementType: 'Outbound',
        quantity: 20,
        uom: 'Meters',
        movementDate: '2024-06-05',
        destinationDocument: 'PROD-2024-010',
        departmentOrProject: 'Furniture Assembly Line A',
        notes: 'Issued for sofa production batch #1.',
        fromLocation: 'Warehouse B, Rack 3',
        toLocation: null,
        sourceDocument: null,
        supplier: null,
        adjustmentReason: null,
        adjustmentType: null,
        responsiblePerson: 'Jane Smith'
    }
];

const RawMaterialMovementPage = () => {
  const { id } = useParams(); // For potential future editing of movements
  const navigate = useNavigate();

  const isEditingMovement = !!id; // If an ID is passed, we're editing an existing movement

  const [formData, setFormData] = useState({
    rawMaterialId: '',
    movementType: '', // 'Inbound', 'Outbound', 'Transfer', 'Adjustment'
    quantity: '',
    movementDate: new Date().toISOString().split('T')[0], // Default to today
    notes: '',
    sourceDocument: '', // For Inbound
    supplier: '',      // For Inbound
    destinationDocument: '', // For Outbound
    departmentOrProject: '', // For Outbound
    fromLocation: '',    // For Transfer/Outbound
    toLocation: '',      // For Inbound/Transfer
    adjustmentReason: '',// For Adjustment
    adjustmentType: '',  // 'Increase' or 'Decrease' for Adjustment
    responsiblePerson: '' // Common for all movements
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' });

  // Dynamically get UoM for selected raw material
  const selectedRawMaterial = mockRawMaterials.find(rm => rm.id === formData.rawMaterialId);
  const uomForSelectedMaterial = selectedRawMaterial ? selectedRawMaterial.uom : '';

  // Options for Select components
  const movementTypes = [
    { value: 'Inbound', label: 'Inbound (Goods Receipt)', icon: <ArrowDownCircle className="w-4 h-4" /> },
    { value: 'Outbound', label: 'Outbound (Goods Issue)', icon: <ArrowUpCircle className="w-4 h-4" /> },
    { value: 'Transfer', label: 'Transfer (Location Change)', icon: <ChevronsRightLeft className="w-4 h-4" /> },
    { value: 'Adjustment', label: 'Adjustment (Correction)', icon: <RefreshCw className="w-4 h-4" /> }
  ];

  const adjustmentTypes = [
    { value: 'Increase', label: 'Increase Stock', icon: <PlusCircle className="w-4 h-4 text-green-600" /> },
    { value: 'Decrease', label: 'Decrease Stock', icon: <MinusCircle className="w-4 h-4 text-red-600" /> }
  ];

  const adjustmentReasons = [
    { value: 'Damage', label: 'Damage' },
    { value: 'Loss', label: 'Loss' },
    { value: 'Cycle Count Correction', label: 'Cycle Count Correction' },
    { value: 'Theft', label: 'Theft' },
    { value: 'Other', label: 'Other' }
  ];

  // Raw material options derived from mock data for the Select component
  const rawMaterialOptions = mockRawMaterials.map(rm => ({
    value: rm.id,
    label: `${rm.name} (${rm.id}) - Current Stock: ${rm.currentStock} ${rm.uom}`
  }));

  // Supplier options from mockRawMaterials, deduplicated
  const suppliers = [...new Set(mockRawMaterials.map(rm => rm.supplierLinkage))]
    .filter(Boolean) // Remove any null/undefined
    .map(supplier => ({ value: supplier, label: supplier }));

  // Location options from mockRawMaterials, deduplicated
  const locations = [...new Set(mockRawMaterials.map(rm => rm.location))]
    .filter(Boolean)
    .map(location => ({ value: location, label: location }));

  // --- Fetch existing movement data for editing (future feature, mock-based) ---
  useEffect(() => {
    if (isEditingMovement) {
      setLoading(true);
      const fetchMovementData = async () => {
        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const movementToEdit = mockRawMaterialMovements.find(mov => mov.id === id);
        if (movementToEdit) {
          setFormData(movementToEdit);
        } else {
          setModalContent({ title: 'Error', message: `Movement with ID ${id} not found.`, type: 'error' });
          setModalOpen(true);
          navigate('/inventory/raw-materials'); // Redirect if not found
        }
        setLoading(false);
      };
      fetchMovementData();
    }
  }, [id, isEditingMovement, navigate]);


  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Special handling for 'movementType' to reset related fields
    if (name === 'movementType') {
        const newFormData = {
            ...formData,
            [name]: value,
            // Reset specific fields when movement type changes
            sourceDocument: '', supplier: '',
            destinationDocument: '', departmentOrProject: '',
            fromLocation: '', toLocation: '',
            adjustmentReason: '', adjustmentType: ''
        };
        setFormData(newFormData);
        setErrors({}); // Clear errors on type change
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    }

    // Clear error for the specific field being changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.rawMaterialId) newErrors.rawMaterialId = 'Raw Material is required.';
    if (!formData.movementType) newErrors.movementType = 'Movement Type is required.';
    if (formData.quantity === '' || isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be a positive number.';
    if (!formData.movementDate) newErrors.movementDate = 'Movement Date is required.';
    if (!formData.responsiblePerson.trim()) newErrors.responsiblePerson = 'Responsible Person is required.';

    switch (formData.movementType) {
      case 'Inbound':
        if (!formData.sourceDocument.trim()) newErrors.sourceDocument = 'Source Document is required for Inbound.';
        // Supplier can be inferred or optional depending on your logic
        // if (!formData.supplier) newErrors.supplier = 'Supplier is required for Inbound.';
        if (!formData.toLocation) newErrors.toLocation = 'Destination Location is required for Inbound.';
        break;
      case 'Outbound':
        if (!formData.destinationDocument.trim()) newErrors.destinationDocument = 'Destination Document is required for Outbound.';
        if (!formData.departmentOrProject.trim()) newErrors.departmentOrProject = 'Department/Project is required for Outbound.';
        if (!formData.fromLocation) newErrors.fromLocation = 'Source Location is required for Outbound.';
        break;
      case 'Transfer':
        if (!formData.fromLocation) newErrors.fromLocation = 'Source Location is required for Transfer.';
        if (!formData.toLocation) newErrors.toLocation = 'Destination Location is required for Transfer.';
        if (formData.fromLocation === formData.toLocation) newErrors.toLocation = 'Source and Destination Locations cannot be the same.';
        break;
      case 'Adjustment':
        if (!formData.adjustmentType) newErrors.adjustmentType = 'Adjustment Type (Increase/Decrease) is required.';
        if (!formData.adjustmentReason) newErrors.adjustmentReason = 'Adjustment Reason is required.';
        break;
      default:
        break;
    }

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
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dataToSubmit = {
        // Only include fields relevant to the current movement type
        rawMaterialId: formData.rawMaterialId,
        movementType: formData.movementType,
        quantity: parseFloat(formData.quantity),
        uom: uomForSelectedMaterial, // Use the dynamically determined UoM
        movementDate: formData.movementDate,
        notes: formData.notes.trim() === '' ? null : formData.notes.trim(),
        responsiblePerson: formData.responsiblePerson,
        // Conditional fields
        sourceDocument: formData.movementType === 'Inbound' ? formData.sourceDocument : null,
        supplier: formData.movementType === 'Inbound' ? formData.supplier : null,
        destinationDocument: formData.movementType === 'Outbound' ? formData.destinationDocument : null,
        departmentOrProject: formData.movementType === 'Outbound' ? formData.departmentOrProject : null,
        fromLocation: (formData.movementType === 'Outbound' || formData.movementType === 'Transfer') ? formData.fromLocation : null,
        toLocation: (formData.movementType === 'Inbound' || formData.movementType === 'Transfer') ? formData.toLocation : null,
        adjustmentReason: formData.movementType === 'Adjustment' ? formData.adjustmentReason : null,
        adjustmentType: formData.movementType === 'Adjustment' ? formData.adjustmentType : null,
      };

      // --- Mock Data Logic: Simulate Stock Update ---
      const rawMaterialIndex = mockRawMaterials.findIndex(rm => rm.id === formData.rawMaterialId);
      if (rawMaterialIndex !== -1) {
        const currentStock = mockRawMaterials[rawMaterialIndex].currentStock;
        let newStock = currentStock;

        if (formData.movementType === 'Inbound') {
          newStock = currentStock + parseFloat(formData.quantity);
        } else if (formData.movementType === 'Outbound') {
          if (currentStock < parseFloat(formData.quantity)) {
            throw new Error(`Insufficient stock for ${selectedRawMaterial.name}. Available: ${currentStock} ${uomForSelectedMaterial}`);
          }
          newStock = currentStock - parseFloat(formData.quantity);
        } else if (formData.movementType === 'Transfer') {
            // For transfer, no stock change on the raw material's currentStock itself
            // since it's just moving location. In a real system, you'd update the
            // specific raw material's location property or batch/lot tracking.
        } else if (formData.movementType === 'Adjustment') {
          if (formData.adjustmentType === 'Increase') {
            newStock = currentStock + parseFloat(formData.quantity);
          } else if (formData.adjustmentType === 'Decrease') {
            if (currentStock < parseFloat(formData.quantity)) {
              throw new Error(`Cannot decrease stock by ${formData.quantity}. Available: ${currentStock} ${uomForSelectedMaterial}`);
            }
            newStock = currentStock - parseFloat(formData.quantity);
          }
        }
        mockRawMaterials[rawMaterialIndex].currentStock = newStock;
        console.log(`Mock Stock Update for ${selectedRawMaterial.name}: Old Stock ${currentStock}, New Stock ${newStock}`);
      }

      // Add to mock movement history (if not editing an existing one)
      if (!isEditingMovement) {
          const newMovementId = `MOV${(mockRawMaterialMovements.length + 1).toString().padStart(3, '0')}`;
          mockRawMaterialMovements.push({ ...dataToSubmit, id: newMovementId, timestamp: new Date().toISOString() });
      } else {
          // If editing, find and update the existing movement (not fully implemented in mock here)
          const movementIndex = mockRawMaterialMovements.findIndex(m => m.id === id);
          if (movementIndex !== -1) {
              mockRawMaterialMovements[movementIndex] = { ...dataToSubmit, id: id, timestamp: new Date().toISOString() };
          }
      }
      console.log('Mock Movement Data Recorded:', dataToSubmit);
      console.log('Current State of Mock Raw Materials:', mockRawMaterials);
      console.log('Current State of Mock Movements:', mockRawMaterialMovements);


      setModalContent({ title: 'Success', message: isEditingMovement ? 'Movement updated successfully!' : 'Movement recorded successfully!', type: 'success' });
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        navigate('/inventory/raw-materials'); // Navigate back to the list page
      }, 1500);

    } catch (err) {
      console.error("Submission error:", err);
      setModalContent({ title: 'Error', message: err.message || `Failed to ${isEditingMovement ? 'update' : 'record'} movement.`, type: 'error' });
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {isEditingMovement ? `Edit Raw Material Movement: ${id}` : 'Record Raw Material Movement'}
      </h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Raw Material Selection */}
            <div>
              <Select
                label="Raw Material"
                id="rawMaterialId"
                name="rawMaterialId"
                value={formData.rawMaterialId}
                onChange={handleChange}
                options={rawMaterialOptions}
                placeholder="Select Raw Material"
                icon={<Package className="w-5 h-5" />}
                error={errors.rawMaterialId}
                required
                disabled={isEditingMovement} // Usually not changeable when editing a movement
              />
            </div>

            {/* Movement Type Selection */}
            <div>
              <Select
                label="Movement Type"
                id="movementType"
                name="movementType"
                value={formData.movementType}
                onChange={handleChange}
                options={movementTypes}
                placeholder="Select Movement Type"
                icon={formData.movementType === 'Inbound' ? <ArrowDownCircle /> :
                        formData.movementType === 'Outbound' ? <ArrowUpCircle /> :
                        formData.movementType === 'Transfer' ? <ChevronsRightLeft /> :
                        formData.movementType === 'Adjustment' ? <RefreshCw /> : null}
                error={errors.movementType}
                required
                disabled={isEditingMovement} // Usually not changeable when editing a movement
              />
            </div>

            {/* Quantity */}
            <div>
              <Input
                label={`Quantity ${uomForSelectedMaterial ? `(${uomForSelectedMaterial})` : ''}`}
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 50"
                step="any" // Allow decimal quantities
                icon={<Hash className="w-5 h-5" />}
                error={errors.quantity}
                required
              />
            </div>

            {/* Movement Date */}
            <div>
              <Input
                label="Movement Date"
                id="movementDate"
                name="movementDate"
                type="date"
                value={formData.movementDate}
                onChange={handleChange}
                icon={<Calendar className="w-5 h-5" />}
                error={errors.movementDate}
                required
              />
            </div>

            {/* Responsible Person */}
            <div>
              <Input
                label="Responsible Person"
                id="responsiblePerson"
                name="responsiblePerson"
                type="text"
                value={formData.responsiblePerson}
                onChange={handleChange}
                placeholder="e.g., Jane Doe"
                icon={<User className="w-5 h-5" />}
                error={errors.responsiblePerson}
                required
              />
            </div>

            {/* --- Conditional Fields Based on Movement Type --- */}

            {/* Inbound Specific */}
            {formData.movementType === 'Inbound' && (
              <>
                <div>
                  <Input
                    label="Source Document / PO #"
                    id="sourceDocument"
                    name="sourceDocument"
                    type="text"
                    value={formData.sourceDocument}
                    onChange={handleChange}
                    placeholder="e.g., PO-2024-001"
                    icon={<Clipboard className="w-5 h-5" />}
                    error={errors.sourceDocument}
                    required
                  />
                </div>
                <div>
                  <Select
                    label="Supplier"
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    options={suppliers}
                    placeholder="Select Supplier"
                    icon={<Factory className="w-5 h-5" />}
                    error={errors.supplier}
                    // Not strictly required here if inferred from RM, but can be
                  />
                </div>
                <div>
                  <Select
                    label="Destination Location"
                    id="toLocation"
                    name="toLocation"
                    value={formData.toLocation}
                    onChange={handleChange}
                    options={locations}
                    placeholder="Select Destination Location"
                    icon={<MapPin className="w-5 h-5" />}
                    error={errors.toLocation}
                    required
                  />
                </div>
              </>
            )}

            {/* Outbound Specific */}
            {formData.movementType === 'Outbound' && (
              <>
                <div>
                  <Input
                    label="Destination Document / SO #"
                    id="destinationDocument"
                    name="destinationDocument"
                    type="text"
                    value={formData.destinationDocument}
                    onChange={handleChange}
                    placeholder="e.g., SO-2024-005"
                    icon={<Clipboard className="w-5 h-5" />}
                    error={errors.destinationDocument}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Department / Project"
                    id="departmentOrProject"
                    name="departmentOrProject"
                    type="text"
                    value={formData.departmentOrProject}
                    onChange={handleChange}
                    placeholder="e.g., Assembly Line A"
                    icon={<Landmark className="w-5 h-5" />}
                    error={errors.departmentOrProject}
                    required
                  />
                </div>
                 <div>
                  <Select
                    label="Source Location"
                    id="fromLocation"
                    name="fromLocation"
                    value={formData.fromLocation}
                    onChange={handleChange}
                    options={locations}
                    placeholder="Select Source Location"
                    icon={<MapPin className="w-5 h-5" />}
                    error={errors.fromLocation}
                    required
                  />
                </div>
              </>
            )}

            {/* Transfer Specific */}
            {formData.movementType === 'Transfer' && (
              <>
                <div>
                  <Select
                    label="From Location"
                    id="fromLocation"
                    name="fromLocation"
                    value={formData.fromLocation}
                    onChange={handleChange}
                    options={locations}
                    placeholder="Select Source Location"
                    icon={<MapPin className="w-5 h-5" />}
                    error={errors.fromLocation}
                    required
                  />
                </div>
                <div>
                  <Select
                    label="To Location"
                    id="toLocation"
                    name="toLocation"
                    value={formData.toLocation}
                    onChange={handleChange}
                    options={locations}
                    placeholder="Select Destination Location"
                    icon={<MapPin className="w-5 h-5" />}
                    error={errors.toLocation}
                    required
                  />
                </div>
              </>
            )}

            {/* Adjustment Specific */}
            {formData.movementType === 'Adjustment' && (
              <>
                <div>
                  <Select
                    label="Adjustment Type"
                    id="adjustmentType"
                    name="adjustmentType"
                    value={formData.adjustmentType}
                    onChange={handleChange}
                    options={adjustmentTypes}
                    placeholder="Select Adjustment Type"
                    icon={formData.adjustmentType === 'Increase' ? <PlusCircle className="text-green-600" /> :
                            formData.adjustmentType === 'Decrease' ? <MinusCircle className="text-red-600" /> : null}
                    error={errors.adjustmentType}
                    required
                  />
                </div>
                <div>
                  <Select
                    label="Adjustment Reason"
                    id="adjustmentReason"
                    name="adjustmentReason"
                    value={formData.adjustmentReason}
                    onChange={handleChange}
                    options={adjustmentReasons}
                    placeholder="Select Reason"
                    icon={<Info className="w-5 h-5" />}
                    error={errors.adjustmentReason}
                    required
                  />
                </div>
              </>
            )}
          </div>

          {/* Notes (common for all movements) */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              <BookOpen className="w-4 h-4 mr-2 text-gray-500" /> Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Add any additional notes about this movement."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/inventory/raw-materials')} // Navigate back to list
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
                  <LoadingSpinner size="sm" className="mr-2" /> {isEditingMovement ? 'Updating...' : 'Recording...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" /> {isEditingMovement ? 'Save Changes' : 'Record Movement'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>


    </div>
  );
};

export default RawMaterialMovementPage;