import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
    Save, XCircle, Package, Tag, Ruler, DollarSign, Warehouse,
    Box, Calendar, Factory, MapPin, Info, Image,
    ListFilter, Scale, ArrowLeft, AlertCircle, CheckCircle // Added ArrowLeft, AlertCircle, CheckCircle
} from 'lucide-react';

// --- Configuration for API Endpoints ---
const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your actual backend URL

const mockRawMaterials = [
    {
        id: 'RM001',
        name: 'Oak Wood Planks',
        description: 'High-quality oak wood for furniture manufacturing, ideal for durable and aesthetic designs. Kiln-dried to prevent warping.',
        category: 'Wood',
        uom: 'Cubic Feet',
        supplierLinkage: 'Lumber & Timber Co.',
        costPrice: 50.00,
        currentStock: 150,
        minStockLevel: 50,
        shelfLife: '2026-12-31',
        specifications: 'Grade A, kiln-dried, moisture content 8-10%, dimensions: 1"x6"x8\'',
        imageUrl: 'https://placehold.co/600x400/E0E7FF/3F51B5?text=Oak+Wood', // Using placeholder image for consistency
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
        imageUrl: 'https://placehold.co/600x400/CFE2F3/1A73E8?text=Velvet+Fabric',
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
        imageUrl: 'https://placehold.co/600x400/D4EDDA/28A745?text=Adhesive',
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
        imageUrl: 'https://placehold.co/600x400/F8D7DA/DC3545?text=Steel+Rods',
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
        imageUrl: 'https://placehold.co/600x400/FFF3CD/FFC107?text=Leather+Hides',
        location: 'Showroom Backstore'
    },
];

const RawMaterialFormPage = () => {
    const { id } = useParams(); // Get ID from URL for edit mode
    const navigate = useNavigate(); // For navigation after save/cancel

    const isEditing = !!id; // True if ID exists, false otherwise (new item)

    const [formData, setFormData] = useState({
        id: '', // Unique ID/SKU, might be auto-generated by backend for new items
        name: '',
        description: '',
        category: '',
        uom: '',
        supplierLinkage: '',
        costPrice: '',
        currentStock: 0, // Default for new, fetched for edit
        minStockLevel: '',
        shelfLife: '',
        specifications: '',
        imageUrl: '',
        location: ''
    });

    const [loading, setLoading] = useState(isEditing); // Start loading if in edit mode
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({}); // For form validation errors
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' }); // type: 'success' or 'error'

    // --- Transformed options for Select components (now stable and correctly formatted) ---
    const categories = [
        { value: '', label: 'Select Category' }, // Added default empty option
        { value: 'Wood', label: 'Wood' },
        { value: 'Fabric', label: 'Fabric' },
        { value: 'Adhesive', label: 'Adhesive' },
        { value: 'Metal', label: 'Metal' },
        { value: 'Leather', label: 'Leather' },
        { value: 'Other', label: 'Other' }
    ];
    const uoms = [
        { value: '', label: 'Select UoM' }, // Added default empty option
        { value: 'Cubic Feet', label: 'Cubic Feet' },
        { value: 'Meters', label: 'Meters' },
        { value: 'Litres', label: 'Litres' },
        { value: 'Kilograms', label: 'Kilograms' },
        { value: 'Units', label: 'Units' },
        { value: 'Sq. Feet', label: 'Sq. Feet' }
    ];
    const suppliers = [
        { value: '', label: 'Select Supplier' }, // Added default empty option
        { value: 'Lumber & Timber Co.', label: 'Lumber & Timber Co.' },
        { value: 'Textile Innovations Ltd.', label: 'Textile Innovations Ltd.' },
        { value: 'Chemical Solutions Inc.', label: 'Chemical Solutions Inc.' },
        { value: 'MetalWorks Supply', label: 'MetalWorks Supply' },
        { value: 'Global Leather Co.', label: 'Global Leather Co.' }
    ];
    const locations = [
        { value: '', label: 'Select Location' }, // Added default empty option
        { value: 'Warehouse A, Shelf 10', label: 'Warehouse A, Shelf 10' },
        { value: 'Warehouse B, Rack 3', label: 'Warehouse B, Rack 3' },
        { value: 'Workshop Store, Bin 5', label: 'Workshop Store, Bin 5' },
        { value: 'Warehouse A, Section C', label: 'Warehouse A, Section C' },
        { value: 'Showroom Backstore', label: 'Showroom Backstore' }
    ];

    // --- Fetch data for editing mode ---
    useEffect(() => {
        if (isEditing) {
            const fetchRawMaterialData = async () => {
                setLoading(true);
                try {
                    // --- Real API Integration Placeholder (GET by ID) ---
                    /*
                    const response = await fetch(`${API_BASE_URL}/raw-materials/${id}`);
                    if (!response.ok) {
                      throw new Error(`Failed to fetch raw material with ID ${id}`);
                    }
                    const data = await response.json();
                    setFormData({
                      ...data,
                      // Ensure numeric types are parsed if they come as strings
                      costPrice: parseFloat(data.costPrice),
                      currentStock: parseInt(data.currentStock, 10),
                      minStockLevel: parseInt(data.minStockLevel, 10),
                      // Handle shelfLife for N/A case if needed for date input
                      shelfLife: data.shelfLife === 'N/A' ? '' : data.shelfLife
                    });
                    */

                    // --- Mock Data Fallback ---
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const materialToEdit = mockRawMaterials.find(item => item.id === id);
                    if (materialToEdit) {
                        setFormData({
                            ...materialToEdit,
                            // Convert N/A shelfLife to empty string for date input
                            shelfLife: materialToEdit.shelfLife === 'N/A' ? '' : materialToEdit.shelfLife
                        });
                    } else {
                        setModalContent({ title: 'Error', message: `Raw material with ID "${id}" not found.`, type: 'error' });
                        setModalOpen(true);
                        // Redirect after a short delay to allow user to see the error
                        setTimeout(() => navigate('/inventory/raw-materials'), 1500);
                    }
                } catch (err) {
                    console.error("Error fetching raw material for edit:", err);
                    setModalContent({ title: 'Error', message: err.message || 'Failed to load data for editing.', type: 'error' });
                    setModalOpen(true);
                    setTimeout(() => navigate('/inventory/raw-materials'), 1500);
                } finally {
                    setLoading(false);
                }
            };
            fetchRawMaterialData();
        }
    }, [id, isEditing, navigate]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value // Handle number input correctly
        }));
        // Clear validation error for the field being changed
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Raw material name is required.';
        if (!formData.category) newErrors.category = 'Category is required.';
        if (!formData.uom) newErrors.uom = 'Unit of Measure is required.';
        if (!formData.supplierLinkage) newErrors.supplierLinkage = 'Supplier is required.';
        if (formData.costPrice === '' || isNaN(formData.costPrice) || parseFloat(formData.costPrice) <= 0) newErrors.costPrice = 'Cost price must be a positive number.';
        if (isEditing && (formData.currentStock === '' || isNaN(formData.currentStock) || parseInt(formData.currentStock, 10) < 0)) newErrors.currentStock = 'Current stock must be a non-negative number.';
        if (formData.minStockLevel === '' || isNaN(formData.minStockLevel) || parseInt(formData.minStockLevel, 10) < 0) newErrors.minStockLevel = 'Minimum stock level must be a non-negative number.';
        if (!formData.location) newErrors.location = 'Location is required.';
        // ID validation for new item only
        if (!isEditing && !formData.id.trim()) newErrors.id = 'Unique ID/SKU is required for new items.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
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
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${API_BASE_URL}/raw-materials/${id}` : `${API_BASE_URL}/raw-materials`;
            const successMessage = isEditing ? 'Raw material updated successfully!' : 'Raw material added successfully!';

            // Prepare data for API (clean up for currentStock if it's new item, etc.)
            const dataToSubmit = { ...formData };
            // Convert shelfLife back to 'N/A' if empty for backend storage
            if (dataToSubmit.shelfLife === '') {
                dataToSubmit.shelfLife = 'N/A';
            }
            // If adding new, currentStock might default to 0 or be set by initial GRN
            // For simplicity, we'll send what's in the form.
            // If your backend auto-generates IDs, you might not send formData.id on POST
            if (!isEditing && !dataToSubmit.id) {
                // You might choose to remove dataToSubmit.id if backend auto-generates
                // delete dataToSubmit.id;
            }


            // --- Real API Integration Placeholder (POST/PUT) ---
            /*
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer YOUR_TOKEN` // If you have authentication
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} raw material.`);
            }

            const result = await response.json();
            console.log('API Response:', result);
            */

            // --- Mock Data Fallback ---
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`${isEditing ? 'Updated' : 'Added'} raw material (mock):`, dataToSubmit);

            setModalContent({ title: 'Success', message: successMessage, type: 'success' });
            setModalOpen(true);

            // Navigate back to list or details page after a short delay
            setTimeout(() => {
                setModalOpen(false);
                navigate('/inventory/raw-materials');
            }, 1500);

        } catch (err) {
            console.error("Submission error:", err);
            setModalContent({ title: 'Error', message: err.message || `Failed to ${isEditing ? 'update' : 'add'} raw material.`, type: 'error' });
            setModalOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-inter">
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">{isEditing ? 'Loading raw material data...' : 'Loading form...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Package className="w-10 h-10 text-blue-600" />
                    {isEditing ? `Edit Raw Material: ${formData.name || id}` : 'Add New Raw Material'}
                </h1>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/inventory/raw-materials')}
                    disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                    <ArrowLeft size={20} /> Back to List
                </Button>
            </div>

            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Unique ID/SKU - only for new items */}
                        {!isEditing && (
                            <Input
                                label="Unique ID/SKU"
                                id="id"
                                name="id"
                                type="text"
                                value={formData.id}
                                onChange={handleChange}
                                placeholder="e.g., RM-FAB-001"
                                icon={<Package className="w-5 h-5 text-gray-400" />}
                                error={errors.id}
                                required
                            />
                        )}
                        {/* Raw Material Name */}
                        <Input
                            label="Raw Material Name"
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Oak Wood Planks"
                            icon={<Tag className="w-5 h-5 text-gray-400" />}
                            error={errors.name}
                            required
                        />

                        {/* Category */}
                        <Select
                            label="Category"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            options={categories}
                            placeholder="Select Category"
                            icon={<ListFilter className="w-5 h-5 text-gray-400" />}
                            error={errors.category}
                            required
                        />
                        {/* Unit of Measure (UoM) */}
                        <Select
                            label="Unit of Measure (UoM)"
                            id="uom"
                            name="uom"
                            value={formData.uom}
                            onChange={handleChange}
                            options={uoms}
                            placeholder="Select UoM"
                            icon={<Scale className="w-5 h-5 text-gray-400" />}
                            error={errors.uom}
                            required
                        />

                        {/* Cost Price */}
                        <Input
                            label={`Cost Price (per ${formData.uom || 'Unit'})`}
                            id="costPrice"
                            name="costPrice"
                            type="number"
                            value={formData.costPrice}
                            onChange={handleChange}
                            placeholder="e.g., 50.00"
                            step="0.01"
                            icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                            error={errors.costPrice}
                            required
                        />
                        {/* Current Stock (only shown in edit mode, and disabled) */}
                        {isEditing && (
                            <Input
                                label="Current Stock"
                                id="currentStock"
                                name="currentStock"
                                type="number"
                                value={formData.currentStock}
                                onChange={handleChange}
                                placeholder="e.g., 150"
                                icon={<Warehouse className="w-5 h-5 text-gray-400" />}
                                error={errors.currentStock}
                                required
                                disabled // Typically disabled as stock changes via movements
                                helpText="Current stock is managed via inventory movements, not directly edited here."
                            />
                        )}
                        {/* Minimum Stock Level */}
                        <Input
                            label="Minimum Stock Level"
                            id="minStockLevel"
                            name="minStockLevel"
                            type="number"
                            value={formData.minStockLevel}
                            onChange={handleChange}
                            placeholder="e.g., 50"
                            icon={<Box className="w-5 h-5 text-gray-400" />}
                            error={errors.minStockLevel}
                            required
                        />

                        {/* Shelf Life */}
                        <Input
                            label="Shelf Life"
                            id="shelfLife"
                            name="shelfLife"
                            type="date"
                            value={formData.shelfLife}
                            onChange={handleChange}
                            icon={<Calendar className="w-5 h-5 text-gray-400" />}
                            helpText="Leave blank if not applicable. If applicable, enter in YYYY-MM-DD format."
                        />
                        {/* Supplier Linkage */}
                        <Select
                            label="Supplier"
                            id="supplierLinkage"
                            name="supplierLinkage"
                            value={formData.supplierLinkage}
                            onChange={handleChange}
                            options={suppliers}
                            placeholder="Select Supplier"
                            icon={<Factory className="w-5 h-5 text-gray-400" />}
                            error={errors.supplierLinkage}
                            required
                        />
                        {/* Location */}
                        <Select
                            label="Location"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            options={locations}
                            placeholder="Select Location"
                            icon={<MapPin className="w-5 h-5 text-gray-400" />}
                            error={errors.location}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label htmlFor="description" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Info className="w-4 h-4 mr-2 text-gray-500" /> Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Provide a detailed description of the raw material."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                        ></textarea>
                    </div>

                    {/* Specifications */}
                    <div className="mb-6">
                        <label htmlFor="specifications" className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <ListFilter className="w-4 h-4 mr-2 text-gray-500" /> Specifications
                        </label>
                        <textarea
                            id="specifications"
                            name="specifications"
                            value={formData.specifications}
                            onChange={handleChange}
                            rows="3"
                            placeholder="e.g., Grade A, kiln-dried, moisture content 8-10%"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                        ></textarea>
                    </div>

                    {/* Image URL */}
                    <div className="mb-6">
                        <Input
                            label="Image URL"
                            id="imageUrl"
                            name="imageUrl"
                            type="text"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://placehold.co/600x400/E0E7FF/3F51B5?text=Raw+Material"
                            icon={<Image className="w-5 h-5 text-gray-400" />}
                            helpText="Provide a direct URL to the image. For local development, you might use placeholder.co or similar."
                        />
                        {formData.imageUrl && (
                            <div className="mt-4 w-48 h-32 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 shadow-sm">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/E0E0E0/888888?text=No+Image'; }} // Fallback image
                                />
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/inventory/raw-materials')}
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <XCircle className="w-5 h-5" /> Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {submitting ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" /> {isEditing ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" /> {isEditing ? 'Save Changes' : 'Add Raw Material'}
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
                // ModalWithForm expects fields prop, but for a simple message modal, we pass empty array
                fields={[]}
                // We can pass the message content directly as children
            >
                <div className="p-4 text-center">
                    <div className={`mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full
                        ${modalContent.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {modalContent.type === 'success' ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mb-4">{modalContent.message}</p>
                    <Button onClick={() => setModalOpen(false)} variant={modalContent.type === 'success' ? 'primary' : 'danger'}>
                        Close
                    </Button>
                </div>
            </ModalWithForm>
        </div>
    );
};

export default RawMaterialFormPage;
