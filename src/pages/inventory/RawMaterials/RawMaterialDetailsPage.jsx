// pages/InventoryManagement/RawMaterialDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../../components/ui/Card'; // Adjusted import path
import Button from '../../../components/ui/Button'; // Adjusted import path
import LoadingSpinner from '../../../components/ui/LoadingSpinner'; // Adjusted import path
import { ArrowLeft, Edit, Calendar, MapPin, Package, DollarSign, Tag, Info, Factory, User, Image, Ruler, Warehouse, Box, Clock, AlertCircle } from 'lucide-react'; // More Lucide icons, added AlertCircle

const RawMaterialDetailsPage = () => {
    const { id } = useParams(); // Get the ID from the URL parameter
    const [rawMaterial, setRawMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Mock Data (should match the structure from RawMaterialListPage) ---
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
            imageUrl: 'data:image/jpeg;base64,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', // Placeholder for actual image path
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
            shelfLife: 'N/A', // Not applicable
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

    // --- Data Fetching Logic (Real API vs. Mock) ---
    const fetchRawMaterialDetails = async () => {
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            // --- Real API Integration Placeholder ---
            // Uncomment and modify this section when you have your backend API ready
            /*
            const response = await fetch(`${API_BASE_URL}/raw-materials/${id}`);
            if (!response.ok) {
              if (response.status === 404) {
                throw new Error(`Raw material with ID ${id} not found.`);
              }
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRawMaterial(data);
            */

            // --- Mock Data Fallback (for development) ---
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            const foundMaterial = mockRawMaterials.find(item => item.id === id);
            if (foundMaterial) {
                setRawMaterial(foundMaterial);
            } else {
                setError(`Raw material with ID "${id}" not found.`);
            }

        } catch (err) {
            console.error("Failed to fetch raw material details:", err);
            setError(err.message || "Failed to load raw material details. Please try again later.");
            setRawMaterial(null); // Ensure rawMaterial is null on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRawMaterialDetails();
    }, [id]); // Re-fetch if ID changes (though usually won't on this page)

    const getStockStatusClass = (current, min) => {
        if (current <= min) {
            return 'text-red-600 font-bold';
        }
        return 'text-green-600';
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-inter">
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading raw material details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-inter">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
                <Link to="/inventory/raw-materials">
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to List
                    </Button>
                </Link>
            </div>
        );
    }

    if (!rawMaterial) {
        return null; // Should be handled by error state, but good for safety
    }

    return (
        <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Package className="w-10 h-10 text-blue-600" /> Raw Material Details: {rawMaterial.name}
                </h1>
                <div className="flex space-x-3">
                    <Link to="/inventory/raw-materials">
                        <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <ArrowLeft size={20} /> Back to List
                        </Button>
                    </Link>
                    <Link to={`/inventory/raw-materials/${rawMaterial.id}/edit`}>
                        <Button variant="primary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                            <Edit className="w-5 h-5" /> Edit Raw Material
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Image and Core Info */}
                <div className="flex flex-col items-center lg:items-start">
                    {rawMaterial.imageUrl && (
                        <img
                            src={rawMaterial.imageUrl}
                            alt={rawMaterial.name}
                            className="w-full max-w-md h-64 object-cover rounded-xl mb-6 shadow-md border border-gray-200"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/E0E0E0/888888?text=No+Image'; }} // Fallback image
                        />
                    )}

                    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center lg:text-left">
                        {rawMaterial.name} <span className="text-gray-500 text-xl">({rawMaterial.id})</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 w-full">
                        <p className="flex items-center text-lg"><Tag className="w-6 h-6 mr-3 text-blue-500" /> <strong>Category:</strong> <span className="ml-2">{rawMaterial.category}</span></p>
                        <p className="flex items-center text-lg"><Ruler className="w-6 h-6 mr-3 text-green-500" /> <strong>Unit of Measure:</strong> <span className="ml-2">{rawMaterial.uom}</span></p>
                        <p className="flex items-center text-lg"><Warehouse className="w-6 h-6 mr-3 text-purple-500" /> <strong>Current Stock:</strong> <span className={`ml-2 ${getStockStatusClass(rawMaterial.currentStock, rawMaterial.minStockLevel)}`}>{rawMaterial.currentStock} {rawMaterial.uom}</span></p>
                        <p className="flex items-center text-lg"><Box className="w-6 h-6 mr-3 text-red-500" /> <strong>Min Stock Level:</strong> <span className="ml-2">{rawMaterial.minStockLevel} {rawMaterial.uom}</span></p>
                        <p className="flex items-center text-lg"><DollarSign className="w-6 h-6 mr-3 text-teal-500" /> <strong>Cost Price:</strong> <span className="ml-2">ETB {rawMaterial.costPrice?.toFixed(2) || 'N/A'}</span></p>
                    </div>
                </div>

                {/* Right Column: Detailed Information */}
                <div className="lg:pl-8 lg:border-l lg:border-gray-200">
                    <h3 className="text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
                        <Info size={24} className="text-indigo-600" /> Additional Details
                    </h3>
                    <div className="space-y-5 text-gray-700">
                        <p className="flex items-start text-lg">
                            <Info className="w-6 h-6 mr-3 mt-1 text-gray-500 flex-shrink-0" />
                            <span className="font-semibold mr-2">Description:</span> {rawMaterial.description || 'N/A'}
                        </p>
                        <p className="flex items-center text-lg">
                            <MapPin className="w-6 h-6 mr-3 text-indigo-500 flex-shrink-0" />
                            <span className="font-semibold mr-2">Location:</span> {rawMaterial.location || 'N/A'}
                        </p>
                        <p className="flex items-center text-lg">
                            <Factory className="w-6 h-6 mr-3 text-orange-500 flex-shrink-0" />
                            <span className="font-semibold mr-2">Supplier:</span> {rawMaterial.supplierLinkage || 'N/A'}
                        </p>
                        <p className="flex items-start text-lg">
                            <Package className="w-6 h-6 mr-3 mt-1 text-cyan-500 flex-shrink-0" />
                            <span className="font-semibold mr-2">Specifications:</span> {rawMaterial.specifications || 'N/A'}
                        </p>
                        <p className="flex items-center text-lg">
                            <Calendar className="w-6 h-6 mr-3 text-pink-500 flex-shrink-0" />
                            <span className="font-semibold mr-2">Shelf Life:</span> {rawMaterial.shelfLife === 'N/A' ? 'Not Applicable' : (rawMaterial.shelfLife || 'N/A')}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Example of adding more sections (e.g., movement history) */}
            <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white mt-6">
                <h3 className="text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
                    <Clock className="w-8 h-8 mr-2 text-gray-600" /> Recent Movements
                </h3>
                <p className="text-gray-700 leading-relaxed">
                    This section would display a table or list of recent inbound, outbound, and transfer movements for this raw material.
                    (Data fetching and UI for this will be implemented later, possibly on a dedicated `RawMaterialMovementPage.jsx`).
                </p>
                {/* Placeholder for a Table component if movement data were available */}
                {/* <Table columns={movementColumns} data={rawMaterial.movements} /> */}
            </Card>
        </div>
    );
};

export default RawMaterialDetailsPage;
