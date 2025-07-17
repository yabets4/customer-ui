import React, { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { PlusCircle, Save, XCircle, Trash2, Tag, Ruler, Weight, Dna, Settings, Image, Upload } from 'lucide-react'; // Added Upload icon

// --- INLINE MOCK PRODUCT DATA ---
// This 'mockProducts' array will serve as our in-memory "database".
// We'll modify it directly to simulate saving/updating data.
// Note: Initial mock data will use placeholder URLs, but new/edited items can have local data URLs.
let mockProducts = [
  {
    id: 'PROD001',
    sku: 'SOFA-MOD-GRY-3S',
    name: 'Modern Gray 3-Seater Sofa',
    description: 'A comfortable modern sofa with a durable gray fabric, perfect for contemporary living spaces. Features high-density foam cushions and sturdy wooden legs.',
    price: 1200.00,
    uom: 'Each',
    dimensions: { length: 220, width: 90, height: 80, unit: 'cm' },
    weight: { value: 75, unit: 'kg' },
    status: 'Active',
    costPrice: 600.00,
    category: 'Living Room Sofas',
    tags: ['Modern', 'Gray', 'Comfort', 'Fabric', '3-Seater'],
    type: 'fixed',
    media: ['https://via.placeholder.com/600x400/A0AEC0/FFFFFF?text=Sofa+Front'],
    variants: [
      { id: 'V001', sku: 'SOFA-MOD-GRY-3S', color: 'Gray', material: 'Fabric', price: 1200.00, media: 'https://via.placeholder.com/150x100/A0AEC0/FFFFFF?text=Gray+Variant' },
      { id: 'V002', sku: 'SOFA-MOD-BLU-3S', color: 'Blue', material: 'Fabric', price: 1250.00, media: 'https://via.placeholder.com/150x100/6366F1/FFFFFF?text=Blue+Variant' },
      { id: 'V003', sku: 'SOFA-MOD-TAN-3S', color: 'Tan', material: 'Leather', price: 1800.00, media: 'https://via.placeholder.com/150x100/D69E2E/FFFFFF?text=Tan+Leather' },
    ]
  },
  {
    id: 'PROD002',
    sku: 'TABLE-DIN-OAK-CUST',
    name: 'Customizable Oak Dining Table',
    description: 'Design your perfect oak dining table by selecting dimensions, wood finish, and leg style. Made from sustainably sourced solid oak.',
    price: 0,
    uom: 'Each',
    dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
    weight: { value: 0, unit: 'kg' },
    status: 'Active',
    costPrice: 0,
    category: 'Dining Tables',
    tags: ['Oak', 'Custom', 'Wood', 'Dining', 'Bespoke'],
    type: 'customizable',
    configurableAttributes: [
      { id: 'A001', name: 'Length', type: 'range', min: 150, max: 250, unit: 'cm', description: 'Table length from 1.5m to 2.5m' },
      { id: 'A002', name: 'Width', type: 'range', min: 80, max: 120, unit: 'cm', description: 'Table width from 0.8m to 1.2m' },
      { id: 'A003', name: 'Wood Finish', type: 'select', options: ['Natural Oak', 'Dark Oak', 'Whitewashed Oak'], description: 'Choose your desired wood stain' },
      { id: 'A004', name: 'Leg Style', type: 'select', options: ['Tapered', 'Straight', 'Pedestal'], description: 'Select the design of the table legs' }
    ],
    media: ['https://via.placeholder.com/600x400/966F33/FFFFFF?text=Dining+Table+Template']
  },
];

const productCategories = [
  { value: 'Living Room Sofas', label: 'Living Room Sofas' },
  { value: 'Dining Tables', label: 'Dining Tables' },
  { value: 'Accent Chairs', label: 'Accent Chairs' },
  { value: 'Bedroom Furniture', label: 'Bedroom Furniture' },
  { value: 'Storage & Shelving', label: 'Storage & Shelving' },
  { value: 'Outdoor Furniture', label: 'Outdoor Furniture' },
  { value: 'Lighting', label: 'Lighting' },
];

const productStatuses = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Discontinued', label: 'Discontinued' },
];

const productTypes = [
  { value: 'fixed', label: 'Fixed Product' },
  { value: 'customizable', label: 'Customizable Product (Template)' },
];

const attributeTypes = [
  { value: 'range', label: 'Range (e.g., Dimensions)' },
  { value: 'select', label: 'Select (e.g., Material Options)' },
  { value: 'number', label: 'Number (e.g., Quantity)' },
];
// --- END INLINE MOCK PRODUCT DATA ---

const generateUniqueId = (prefix = 'ID') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

const ProductCatalogFormPage = () => {
  const { id } = useParams(); // Get product ID if in edit mode
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    id: generateUniqueId('PROD'),
    sku: '',
    name: '',
    description: '',
    price: 0,
    uom: 'Each',
    dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
    weight: { value: 0, unit: 'kg' },
    status: 'Active',
    costPrice: 0,
    category: '',
    tags: '', // Comma-separated string for input
    type: 'fixed', // Default to fixed
    media: [], // Array of URLs (Data URLs for local images)
    variants: [], // For fixed products
    configurableAttributes: [], // For customizable products
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Refs for file inputs
  const productMediaInputRef = useRef(null);


  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      setError(null);
      // Simulate API call
      const productToEdit = mockProducts.find(p => p.id === id);
      if (productToEdit) {
        setFormData({
          ...productToEdit,
          tags: productToEdit.tags ? productToEdit.tags.join(', ') : '', // Convert array to string for input
          dimensions: productToEdit.dimensions || { length: 0, width: 0, height: 0, unit: 'cm' },
          weight: productToEdit.weight || { value: 0, unit: 'kg' },
          media: productToEdit.media || [],
          variants: productToEdit.variants || [],
          configurableAttributes: productToEdit.configurableAttributes || [],
        });
      } else {
        setError('Product not found for editing.');
      }
      setLoading(false);
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: parseFloat(value) || 0,
      }
    }));
  };

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      weight: {
        ...prev.weight,
        [name]: parseFloat(value) || 0,
      }
    }));
  };

  // --- Product Media Image Upload ---
  const handleProductMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          media: [...prev.media, reader.result] // Add Data URL to media array
        }));
      };
      reader.readAsDataURL(file); // Read file as Data URL
    });
    if (productMediaInputRef.current) {
        productMediaInputRef.current.value = ''; // Clear file input
    }
  };

  const handleRemoveProductMedia = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, index) => index !== indexToRemove)
    }));
  };

  // --- Variant Management ---
  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: generateUniqueId('V'), sku: '', color: '', material: '', price: 0, media: '' }]
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = formData.variants.map((variant, i) =>
      i === index ? { ...variant, [name]: value } : variant
    );
    setFormData(prev => ({ ...prev, variants: updatedVariants }));
  };

  // --- Variant Image Upload ---
  const handleVariantImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedVariants = formData.variants.map((variant, i) =>
          i === index ? { ...variant, media: reader.result } : variant
        );
        setFormData(prev => ({ ...prev, variants: updatedVariants }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveVariant = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, index) => index !== indexToRemove)
    }));
  };

  // --- Configurable Attribute Management ---
  const handleAddAttribute = () => {
    setFormData(prev => ({
      ...prev,
      configurableAttributes: [...prev.configurableAttributes, { id: generateUniqueId('A'), name: '', type: 'range', description: '', min: 0, max: 0, unit: '', options: '' }]
    }));
  };

  const handleAttributeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAttributes = formData.configurableAttributes.map((attr, i) => {
      if (i === index) {
        let updatedAttr = { ...attr, [name]: value };
        // Reset specific fields if attribute type changes
        if (name === 'type') {
          if (value === 'range') {
            updatedAttr = { ...updatedAttr, options: '' };
          } else if (value === 'select') {
            updatedAttr = { ...updatedAttr, min: 0, max: 0, unit: '' };
          } else if (value === 'number') {
            updatedAttr = { ...updatedAttr, options: '', unit: '' };
          }
        }
        // Parse numbers for range/number types
        if (['min', 'max'].includes(name)) {
          updatedAttr[name] = parseFloat(value) || 0;
        }
        return updatedAttr;
      }
      return attr;
    });
    setFormData(prev => ({ ...prev, configurableAttributes: updatedAttributes }));
  };

  const handleRemoveAttribute = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      configurableAttributes: prev.configurableAttributes.filter((_, index) => index !== indexToRemove)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.name || !formData.sku || !formData.category || !formData.type) {
        throw new Error('Please fill in all required product details.');
      }
      if (formData.type === 'fixed' && formData.variants.some(v => !v.sku)) {
        throw new Error('All product variants must have an SKU.');
      }
      if (formData.type === 'customizable' && formData.configurableAttributes.some(a => !a.name)) {
        throw new Error('All configurable attributes must have a name.');
      }

      // Convert tags string to array
      const productToSave = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        price: parseFloat(formData.price) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
      };

      // Clean up fields not relevant to the selected type
      if (productToSave.type === 'fixed') {
        delete productToSave.configurableAttributes;
        // Ensure variants have IDs if newly added and prices are numbers
        productToSave.variants = productToSave.variants.map(v => ({
            ...v,
            id: v.id || generateUniqueId('V'),
            price: parseFloat(v.price) || 0
        }));
      } else { // customizable
        delete productToSave.variants;
        delete productToSave.price; // Price might be dynamic
        delete productToSave.costPrice; // Cost might be dynamic
        // Ensure attributes have IDs if newly added
        productToSave.configurableAttributes = productToSave.configurableAttributes.map(attr => ({
            ...attr,
            id: attr.id || generateUniqueId('A'),
            options: attr.type === 'select' ? attr.options.split(',').map(opt => opt.trim()).filter(opt => opt !== '') : undefined,
            min: ['range', 'number'].includes(attr.type) ? parseFloat(attr.min) || 0 : undefined,
            max: ['range', 'number'].includes(attr.type) ? parseFloat(attr.max) || 0 : undefined,
            unit: attr.type === 'range' ? attr.unit : undefined,
        }));
      }

      // Simulate API call for saving/updating
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditMode) {
        const index = mockProducts.findIndex(p => p.id === productToSave.id);
        if (index !== -1) {
          mockProducts[index] = productToSave;
          console.log('Product updated:', productToSave);
        } else {
          throw new Error('Product not found in mock data for update.');
        }
      } else {
        mockProducts.push(productToSave);
        console.log('New product added:', productToSave);
      }

      navigate('/product/product-catalog');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while saving.');
      console.error('Submission error:', err);
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
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
          <span className="ml-2 text-purple-600">
            {isEditMode ? `(${formData.name || formData.id})` : ''}
          </span>
        </h1>
        <Button onClick={() => navigate('/product/product-catalog')} variant="secondary">
          <XCircle className="w-5 h-5 mr-2" /> Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Core Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="SKU / Product ID"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g., SOFA-MOD-GRY-3S"
              required
              disabled={isEditMode}
            />
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Modern Gray 3-Seater Sofa"
              required
            />
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={productCategories}
              required
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={productStatuses}
              required
            />
            <Input
              label="Unit of Measure (UoM)"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
              placeholder="e.g., Each, Meter, Kg"
              required
            />
            <Select
              label="Product Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={productTypes}
              required
              disabled={isEditMode}
            />
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the product..."
              type="textarea"
              className="md:col-span-2"
            />
            <Input
              label="Tags (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., Modern, Fabric, Living Room"
              className="md:col-span-2"
              icon={<Tag className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
            <Ruler className="w-5 h-5 mr-2" /> Dimensions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label={`Length (${formData.dimensions.unit})`}
              name="length"
              value={formData.dimensions.length}
              onChange={handleDimensionChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 220"
            />
            <Input
              label={`Width (${formData.dimensions.unit})`}
              name="width"
              value={formData.dimensions.width}
              onChange={handleDimensionChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 90"
            />
            <Input
              label={`Height (${formData.dimensions.unit})`}
              name="height"
              value={formData.dimensions.height}
              onChange={handleDimensionChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 80"
            />
            <Input
              label="Dimension Unit"
              name="unit"
              value={formData.dimensions.unit}
              onChange={handleDimensionChange}
              placeholder="e.g., cm, inch"
            />
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-700 dark:text-gray-200 flex items-center">
            <Weight className="w-5 h-5 mr-2" /> Weight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Weight Value"
              name="value"
              value={formData.weight.value}
              onChange={handleWeightChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 75"
            />
            <Input
              label="Weight Unit"
              name="unit"
              value={formData.weight.unit}
              onChange={handleWeightChange}
              placeholder="e.g., kg, lbs"
            />
          </div>
        </Card>

        <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
              <Image className="w-5 h-5 mr-2" /> Product Media
            </h2>
            <div className="flex flex-wrap gap-3 mb-4">
                {formData.media.map((src, index) => (
                    <div key={index} className="relative w-24 h-24 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden group flex-shrink-0">
                        <img src={src} alt={`Product media ${index}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => handleRemoveProductMedia(index)}
                            className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            {/* New File Input for Product Media */}
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="image/*"
                    multiple // Allow multiple files for product media
                    onChange={handleProductMediaUpload}
                    ref={productMediaInputRef}
                    className="hidden" // Hide the default file input
                    id="productMediaUpload"
                />
                <Button
                    type="button"
                    onClick={() => productMediaInputRef.current?.click()}
                    variant="outline"
                    className="flex items-center"
                >
                    <Upload className="w-5 h-5 mr-2" /> Upload Product Images
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {productMediaInputRef.current?.files.length > 0 ? `${productMediaInputRef.current.files.length} file(s) selected` : 'Select one or more images'}
                </span>
            </div>
        </Card>

        {/* Conditional Sections based on Product Type */}
        {formData.type === 'fixed' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
              <Dna className="w-5 h-5 mr-2" /> Product Variants
            </h2>
            <Input
              label="Base Product Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 1200.00"
              required
              className="mb-4"
            />
            <Input
              label="Base Product Cost Price"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 600.00"
              className="mb-6"
            />
            {formData.variants.map((variant, index) => (
              <div key={variant.id || `new-variant-${index}`} className="border border-gray-200 dark:border-gray-700 p-4 rounded-md mb-4 relative bg-gray-50 dark:bg-gray-800">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Variant {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Variant SKU"
                    name="sku"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="e.g., SOFA-MOD-BLU-3S"
                    required
                  />
                  <Input
                    label="Color"
                    name="color"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="e.g., Blue"
                  />
                  <Input
                    label="Material"
                    name="material"
                    value={variant.material}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="e.g., Fabric, Leather"
                  />
                   <Input
                    label="Variant Price"
                    name="price"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, e)}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 1250.00"
                  />
                  {/* Variant Image Upload */}
                  <div className="col-span-full md:col-span-1 flex items-center gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleVariantImageUpload(index, e)}
                        className="hidden"
                        id={`variantImageUpload-${index}`}
                    />
                    <Button
                        type="button"
                        onClick={() => document.getElementById(`variantImageUpload-${index}`)?.click()}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                    >
                        <Upload className="w-4 h-4 mr-1" /> Upload Image
                    </Button>
                    {variant.media ? (
                        <img src={variant.media} alt="Variant preview" className="w-16 h-16 object-cover rounded" />
                    ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No image</span>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  variant="danger"
                  size="sm"
                  className="absolute top-2 right-2"
                  title="Remove Variant"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddVariant} variant="outline">
              <PlusCircle className="w-5 h-5 mr-2" /> Add Variant
            </Button>
          </Card>
        )}

        {formData.type === 'customizable' && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
              <Settings className="w-5 h-5 mr-2" /> Configurable Attributes (for Templates)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Define the attributes customers can configure. Pricing and BOM logic for these will be managed in separate modules.
            </p>
            {formData.configurableAttributes.map((attr, index) => (
              <div key={attr.id || `new-attribute-${index}`} className="border border-gray-200 dark:border-gray-700 p-4 rounded-md mb-4 relative bg-gray-50 dark:bg-gray-800">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Attribute {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Attribute Name"
                    name="name"
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(index, e)}
                    placeholder="e.g., Length, Wood Type"
                    required
                  />
                  <Select
                    label="Attribute Type"
                    name="type"
                    value={attr.type}
                    onChange={(e) => handleAttributeChange(index, e)}
                    options={attributeTypes}
                    required
                  />
                  <Input
                    label="Description (Optional)"
                    name="description"
                    value={attr.description}
                    onChange={(e) => handleAttributeChange(index, e)}
                    placeholder="Brief description of this attribute"
                    className="md:col-span-2"
                  />

                  {attr.type === 'range' && (
                    <div className="grid grid-cols-2 gap-4 col-span-full">
                      <Input
                        label="Min Value"
                        name="min"
                        value={attr.min}
                        onChange={(e) => handleAttributeChange(index, e)}
                        type="number"
                        step="any"
                      />
                      <Input
                        label="Max Value"
                        name="max"
                        value={attr.max}
                        onChange={(e) => handleAttributeChange(index, e)}
                        type="number"
                        step="any"
                      />
                      <Input
                        label="Unit (e.g., cm, inch)"
                        name="unit"
                        value={attr.unit}
                        onChange={(e) => handleAttributeChange(index, e)}
                        placeholder="e.g., cm"
                      />
                    </div>
                  )}

                  {attr.type === 'select' && (
                    <Input
                      label="Options (comma-separated)"
                      name="options"
                      value={attr.options}
                      onChange={(e) => handleAttributeChange(index, e)}
                      placeholder="e.g., Oak, Walnut, Maple"
                      className="col-span-full"
                    />
                  )}
                   {attr.type === 'number' && (
                    <div className="grid grid-cols-2 gap-4 col-span-full">
                      <Input
                        label="Min Value"
                        name="min"
                        value={attr.min}
                        onChange={(e) => handleAttributeChange(index, e)}
                        type="number"
                        step="any"
                      />
                      <Input
                        label="Max Value"
                        name="max"
                        value={attr.max}
                        onChange={(e) => handleAttributeChange(index, e)}
                        type="number"
                        step="any"
                      />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => handleRemoveAttribute(index)}
                  variant="danger"
                  size="sm"
                  className="absolute top-2 right-2"
                  title="Remove Attribute"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddAttribute} variant="outline">
              <PlusCircle className="w-5 h-5 mr-2" /> Add Configurable Attribute
            </Button>
          </Card>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/product/product-catalog')} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <LoadingSpinner size="sm" /> : <Save className="w-5 h-5 mr-2" />}
            {isEditMode ? (submitting ? 'Updating...' : 'Update Product') : (submitting ? 'Adding...' : 'Add Product')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductCatalogFormPage;