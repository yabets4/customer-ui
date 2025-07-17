import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  Save, XCircle, Package, Tag, DollarSign, Factory, Clock, MapPin, Info, Clipboard, Image as ImageIcon, Hash, Box, Settings
} from 'lucide-react';

// --- Mock Data for Finished Goods (Consistent across pages) ---
// This will be treated as our "in-memory database" for finished goods.
let mockFinishedGoods = [ // Use 'let' so we can modify it
  {
    id: 'FG001',
    productCode: 'TBL-OAK-001',
    name: 'Classic Oak Dining Table',
    description: 'Sturdy dining table crafted from high-quality kiln-dried oak. Seats 6-8 people. Dimensions: 72"L x 36"W x 30"H.',
    category: 'Dining Furniture',
    sellingPrice: 1200.00,
    productionCost: 750.00,
    currentStock: 15,
    minStockLevel: 5,
    location: 'Finished Goods Warehouse A, Zone 1',
    imageUrl: 'data:image/jpeg;base64,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',
    assemblyTime: '8 hours',
    materialsUsed: ['RM001', 'RM003']
  },
  {
    id: 'FG002',
    productCode: 'SOF-VEL-BLU-001',
    name: 'Luxury Blue Velvet Sofa',
    description: 'Elegant three-seater sofa upholstered in plush blue velvet. Solid wood frame with high-density foam cushions. Dimensions: 84"L x 38"W x 32"H.',
    category: 'Living Room Furniture',
    sellingPrice: 1850.00,
    productionCost: 1100.00,
    currentStock: 8,
    minStockLevel: 3,
    location: 'Finished Goods Warehouse B, Aisle 3',
    imageUrl: '/images/blue-sofa.jpg',
    assemblyTime: '12 hours',
    materialsUsed: ['RM002', 'RM003']
  },
  {
    id: 'FG003',
    productCode: 'CHR-STL-MOD-001',
    name: 'Modern Steel & Leather Chair',
    description: 'Sleek, minimalist chair with a brushed steel frame and brown leather upholstery. Ergonomic design for comfort. Dimensions: 24"W x 24"D x 34"H.',
    category: 'Seating',
    sellingPrice: 450.00,
    productionCost: 280.00,
    currentStock: 25,
    minStockLevel: 10,
    location: 'Finished Goods Warehouse A, Zone 2',
    imageUrl: '/images/steel-chair.jpg',
    assemblyTime: '4 hours',
    materialsUsed: ['RM004', 'RM005']
  },
  {
    id: 'FG004',
    productCode: 'BED-KNG-LUX-001',
    name: 'Luxury King Size Bed Frame',
    description: 'Grand bed frame with a padded headboard, suitable for a king-size mattress. Dark wood finish.',
    category: 'Bedroom Furniture',
    sellingPrice: 950.00,
    productionCost: 600.00,
    currentStock: 3,
    minStockLevel: 1,
    location: 'Finished Goods Warehouse B, Aisle 1',
    imageUrl: '/images/king-bed.jpg',
    assemblyTime: '10 hours',
    materialsUsed: ['RM001', 'RM003']
  },
];

// Options for categories and locations (can be dynamic in a real app)
const finishedGoodCategories = [
  { value: 'Dining Furniture', label: 'Dining Furniture' },
  { value: 'Living Room Furniture', label: 'Living Room Furniture' },
  { value: 'Bedroom Furniture', label: 'Bedroom Furniture' },
  { value: 'Seating', label: 'Seating' },
  { value: 'Storage', label: 'Storage' },
  { value: 'Outdoor Furniture', label: 'Outdoor Furniture' },
];

const finishedGoodLocations = [
  { value: 'Finished Goods Warehouse A, Zone 1', label: 'FG Warehouse A, Zone 1' },
  { value: 'Finished Goods Warehouse A, Zone 2', label: 'FG Warehouse A, Zone 2' },
  { value: 'Finished Goods Warehouse B, Aisle 1', label: 'FG Warehouse B, Aisle 1' },
  { value: 'Finished Goods Warehouse B, Aisle 2', label: 'FG Warehouse B, Aisle 2' },
  { value: 'Finished Goods Warehouse B, Aisle 3', label: 'FG Warehouse B, Aisle 3' },
  { value: 'Showroom Floor', label: 'Showroom Floor' },
];

const FinishedGoodFormPage = () => {
  const { id } = useParams(); // Get ID if in edit mode
  const navigate = useNavigate();

  const isEditing = !!id; // True if ID exists in URL params

  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    description: '',
    category: '',
    sellingPrice: '',
    productionCost: '',
    currentStock: '', // Only for new items, typically managed via movements
    minStockLevel: '',
    location: '',
    imageUrl: '',
    assemblyTime: '',
    materialsUsed: '', // Comma-separated mock for now
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
      const fetchFinishedGood = async () => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const finishedGoodToEdit = mockFinishedGoods.find(fg => fg.id === id);

        if (finishedGoodToEdit) {
          setFormData({
            ...finishedGoodToEdit,
            // Convert array to comma-separated string for the input field
            materialsUsed: finishedGoodToEdit.materialsUsed ? finishedGoodToEdit.materialsUsed.join(', ') : '',
          });
        } else {
          setError('Finished Good not found.');
          setModalContent({ title: 'Error', message: `Finished Good with ID "${id}" not found.`, type: 'error' });
          setModalOpen(true);
          navigate('/inventory/finished-goods'); // Redirect if not found
        }
        setLoading(false);
      };
      fetchFinishedGood();
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
    if (!formData.productCode.trim()) newErrors.productCode = 'Product Code is required.';
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (formData.sellingPrice === '' || isNaN(formData.sellingPrice) || parseFloat(formData.sellingPrice) <= 0) newErrors.sellingPrice = 'Selling Price must be a positive number.';
    if (formData.productionCost === '' || isNaN(formData.productionCost) || parseFloat(formData.productionCost) < 0) newErrors.productionCost = 'Production Cost must be a non-negative number.';
    if (!isEditing && (formData.currentStock === '' || isNaN(formData.currentStock) || parseFloat(formData.currentStock) < 0)) newErrors.currentStock = 'Current Stock must be a non-negative number for new items.';
    if (formData.minStockLevel === '' || isNaN(formData.minStockLevel) || parseFloat(formData.minStockLevel) < 0) newErrors.minStockLevel = 'Minimum Stock Level must be a non-negative number.';
    if (!formData.location) newErrors.location = 'Location is required.';

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
        sellingPrice: parseFloat(formData.sellingPrice),
        productionCost: parseFloat(formData.productionCost),
        currentStock: isEditing ? (finishedGood?.currentStock || 0) : parseFloat(formData.currentStock), // Maintain current stock on edit
        minStockLevel: parseFloat(formData.minStockLevel),
        // Convert comma-separated string back to array for mock data
        materialsUsed: formData.materialsUsed ? formData.materialsUsed.split(',').map(m => m.trim()).filter(Boolean) : [],
      };

      if (isEditing) {
        // --- Mock Data Logic: Update existing finished good ---
        const index = mockFinishedGoods.findIndex(fg => fg.id === id);
        if (index !== -1) {
          mockFinishedGoods[index] = { ...mockFinishedGoods[index], ...dataToSave, id: id };
          console.log('Mock Finished Good Updated:', mockFinishedGoods[index]);
        }
        setModalContent({ title: 'Success', message: 'Finished good updated successfully!', type: 'success' });
      } else {
        // --- Mock Data Logic: Add new finished good ---
        const newId = `FG${(mockFinishedGoods.length + 1).toString().padStart(3, '0')}`;
        const newFinishedGood = { ...dataToSave, id: newId };
        mockFinishedGoods.push(newFinishedGood);
        console.log('Mock New Finished Good Added:', newFinishedGood);
        setModalContent({ title: 'Success', message: 'New finished good added successfully!', type: 'success' });
      }

      console.log('Current State of Mock Finished Goods:', mockFinishedGoods);

      setModalOpen(true);
      setTimeout(() => {
        setModalOpen(false);
        navigate('/inventory/finished-goods'); // Navigate back to the list
      }, 1500);

    } catch (err) {
      console.error("Submission error:", err);
      setModalContent({ title: 'Error', message: `Failed to ${isEditing ? 'update' : 'add'} finished good.`, type: 'error' });
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
        {isEditing ? `Edit Finished Good: ${formData.name}` : 'Add New Finished Good'}
      </h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Product Code */}
            <div>
              <Input
                label="Product Code"
                id="productCode"
                name="productCode"
                type="text"
                value={formData.productCode}
                onChange={handleChange}
                placeholder="e.g., TBL-OAK-001"
                icon={<Hash className="w-5 h-5" />}
                error={errors.productCode}
                required
              />
            </div>

            {/* Name */}
            <div>
              <Input
                label="Product Name"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Classic Oak Dining Table"
                icon={<Package className="w-5 h-5" />}
                error={errors.name}
                required
              />
            </div>

            {/* Category */}
            <div>
              <Select
                label="Category"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={finishedGoodCategories}
                placeholder="Select Category"
                icon={<Tag className="w-5 h-5" />}
                error={errors.category}
                required
              />
            </div>

            {/* Location */}
            <div>
              <Select
                label="Storage Location"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                options={finishedGoodLocations}
                placeholder="Select Location"
                icon={<MapPin className="w-5 h-5" />}
                error={errors.location}
                required
              />
            </div>

            {/* Selling Price */}
            <div>
              <Input
                label="Selling Price ($)"
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="e.g., 1200.00"
                step="0.01"
                icon={<DollarSign className="w-5 h-5" />}
                error={errors.sellingPrice}
                required
              />
            </div>

            {/* Production Cost */}
            <div>
              <Input
                label="Production Cost ($)"
                id="productionCost"
                name="productionCost"
                type="number"
                value={formData.productionCost}
                onChange={handleChange}
                placeholder="e.g., 750.00"
                step="0.01"
                icon={<Factory className="w-5 h-5" />}
                error={errors.productionCost}
                required
              />
            </div>

            {/* Current Stock (only editable for new items for simplicity, movements handle updates) */}
            {!isEditing && (
              <div>
                <Input
                  label="Initial Stock Quantity"
                  id="currentStock"
                  name="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={handleChange}
                  placeholder="e.g., 15"
                  icon={<Box className="w-5 h-5" />}
                  error={errors.currentStock}
                  required={!isEditing} // Required only when adding new
                />
              </div>
            )}

            {/* Minimum Stock Level */}
            <div>
              <Input
                label="Minimum Stock Level"
                id="minStockLevel"
                name="minStockLevel"
                type="number"
                value={formData.minStockLevel}
                onChange={handleChange}
                placeholder="e.g., 5"
                icon={<Info className="w-5 h-5" />}
                error={errors.minStockLevel}
                required
              />
            </div>

            {/* Assembly Time */}
            <div>
              <Input
                label="Estimated Assembly Time"
                id="assemblyTime"
                name="assemblyTime"
                type="text"
                value={formData.assemblyTime}
                onChange={handleChange}
                placeholder="e.g., 8 hours"
                icon={<Clock className="w-5 h-5" />}
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
                placeholder="e.g., /images/oak-table.jpg"
                icon={<ImageIcon className="w-5 h-5" />}
              />
              {formData.imageUrl && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="mr-2">Preview:</span>
                  <img src={formData.imageUrl} alt="Product Preview" className="h-16 w-16 object-cover rounded-md shadow-sm" />
                </div>
              )}
            </div>
            
            {/* Materials Used (Comma-separated for mock) */}
            <div className="md:col-span-2">
              <Input
                label="Key Raw Materials Used (comma-separated IDs)"
                id="materialsUsed"
                name="materialsUsed"
                type="text"
                value={formData.materialsUsed}
                onChange={handleChange}
                placeholder="e.g., RM001, RM003"
                icon={<Settings className="w-5 h-5" />}
                description="Enter raw material IDs separated by commas (e.g., RM001, RM002)"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                <Clipboard className="w-4 h-4 mr-2 text-gray-500" /> Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Detailed description of the finished good..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/inventory/finished-goods')}
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
                  <Save className="w-5 h-5 mr-2" /> {isEditing ? 'Save Changes' : 'Add Finished Good'}
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

export default FinishedGoodFormPage;