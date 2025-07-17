// pages/InventoryManagement/RawMaterialListPage.jsx

import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card'; // Adjusted import path
import Button from '../../../components/ui/Button'; // Adjusted import path
import Input from '../../../components/ui/input'; // Adjusted import path
import Table from '../../../components/ui/Table'; // Adjusted import path
import LoadingSpinner from '../../../components/ui/LoadingSpinner'; // Adjusted import path
import { Link } from 'react-router-dom';
import { Search, Eye, Edit, PlusCircle, ArrowLeft, Package, AlertCircle, ClipboardPlus } from 'lucide-react'; // Import Lucide icons, added Package and AlertCircle

// --- Configuration for API Endpoints --- // Replace with your actual backend URL
// const API_BASE_URL = 'YOUR_BACKEND_API_URL';

const RawMaterialListPage = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null); // State for API errors

    // --- Mock Data ---
    const mockRawMaterials = [
        {
            id: 'RM001',
            name: 'Oak Wood Planks',
            description: 'High-quality oak wood for furniture.',
            category: 'Wood',
            uom: 'Cubic Feet',
            supplierLinkage: 'Supplier A',
            costPrice: 50.00,
            currentStock: 150,
            minStockLevel: 50,
            shelfLife: '2026-12-31',
            specifications: 'Grade A, kiln-dried',
            imageUrl: '/images/oak-wood.jpg',
            location: 'Warehouse A, Shelf 10'
        },
        {
            id: 'RM002',
            name: 'Velvet Fabric (Blue)',
            description: 'Soft blue velvet fabric for upholstery.',
            category: 'Fabric',
            uom: 'Meters',
            supplierLinkage: 'Supplier B',
            costPrice: 15.75,
            currentStock: 300,
            minStockLevel: 100,
            shelfLife: 'N/A',
            specifications: 'Polyester blend, 150 GSM',
            imageUrl: '/images/blue-velvet.jpg',
            location: 'Warehouse B, Rack 3'
        },
        {
            id: 'RM003',
            name: 'Strong Adhesive (Type A)',
            description: 'Industrial-grade wood adhesive.',
            category: 'Adhesive',
            uom: 'Litres',
            supplierLinkage: 'Supplier C',
            costPrice: 25.00,
            currentStock: 75,
            minStockLevel: 20,
            shelfLife: '2025-09-15',
            specifications: 'Waterproof, fast-drying',
            imageUrl: '/images/adhesive.jpg',
            location: 'Workshop Store, Bin 5'
        },
        {
            id: 'RM004',
            name: 'Steel Rods (10mm)',
            description: 'Carbon steel rods for structural support.',
            category: 'Metal',
            uom: 'Meters',
            supplierLinkage: 'Supplier D',
            costPrice: 8.50,
            currentStock: 500,
            minStockLevel: 150,
            shelfLife: 'N/A',
            specifications: 'ASTM A36, 6m length',
            imageUrl: '/images/steel-rods.jpg',
            location: 'Warehouse A, Section C'
        },
        {
            id: 'RM005',
            name: 'Leather Hides (Brown)',
            description: 'Genuine leather for premium products.',
            category: 'Leather',
            uom: 'Sq. Feet',
            supplierLinkage: 'Supplier E',
            costPrice: 120.00,
            currentStock: 80,
            minStockLevel: 30,
            shelfLife: 'N/A',
            specifications: 'Full-grain, vegetable-tanned',
            imageUrl: '/images/leather-hides.jpg',
            location: 'Showroom Backstore'
        },
    ];

    // --- Data Fetching Logic (Real API vs. Mock) ---
    const fetchRawMaterials = async () => {
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            // --- Real API Integration Placeholder ---
            // Uncomment and modify this section when you have your backend API ready
            /*
            const response = await fetch(`${API_BASE_URL}/raw-materials`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRawMaterials(data);
            */

            // --- Mock Data Fallback (for development) ---
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            setRawMaterials(mockRawMaterials);

        } catch (err) {
            console.error("Failed to fetch raw materials:", err);
            setError("Failed to load raw materials. Please try again later.");
            // Fallback to mock data even on error during development, or show empty state
            setRawMaterials([]); // Or mockRawMaterials if you want to see data even on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRawMaterials();
    }, []);

    const filteredRawMaterials = rawMaterials.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tableColumns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Category', accessor: 'category' },
        { header: 'UoM', accessor: 'uom' },
        { header: 'Stock', accessor: 'currentStock' },
        {
            header: 'Cost/Unit',
            accessor: 'costPrice',
            render: (row) => {
                const numericPrice = parseFloat(row.costPrice);
                return isNaN(numericPrice) ? 'N/A' : `ETB ${numericPrice.toFixed(2)}`;
            }
        },
        { header: 'Location', accessor: 'location' },
        { header: 'Shelf Life', accessor: 'shelfLife' },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <Link to={`/inventory/raw-materials/${row.id}`}>
                        <Button variant="outline" size="sm" title="View Details" className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> View
                        </Button>
                    </Link>
                    <Link to={`/inventory/raw-materials/${row.id}/edit`}>
                        <Button variant="secondary" size="sm" title="Edit Item" className="flex items-center gap-1">
                            <Edit className="w-4 h-4" /> Edit
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-inter">
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading raw materials...</p>
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
                <Button onClick={fetchRawMaterials} className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <RefreshCw size={20} /> Retry Loading
                </Button> {/* Assuming RefreshCw icon exists */}
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Package className="w-10 h-10 text-blue-600" /> Raw Material Inventory
                </h1>
                <Link to="/dashboard"> {/* Assuming a main dashboard link */}
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            <Card className="mb-6 p-6 rounded-xl shadow-lg border border-gray-100 bg-white">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="relative flex items-center w-full md:w-1/3">
                        <Input
                            type="text"
                            placeholder="Search by ID, Name, Category, Location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        <Search className="absolute left-3 text-gray-400 w-5 h-5" />
                    </div>
                    <div className='justify-end'>
                    <Link to="/inventory/raw-materials/new">
                        <Button variant="primary" className="flex items-center mr-2 gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto">
                            <PlusCircle className="w-5 h-5" /> Add New Raw Material
                        </Button>
                    </Link>
                        <Link to="/inventory/raw-materials/reports">
                        <Button variant="aqua" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto">
                            <ClipboardPlus className="w-5 h-5" /> Raw Material Report
                        </Button>
                    </Link>
                    </div>
                </div>
                {filteredRawMaterials.length > 0 ? (
                    <Table columns={tableColumns} data={filteredRawMaterials} />
                ) : (
                    <p className="text-center text-gray-600 py-8">No raw materials found matching your search criteria.</p>
                )}
            </Card>
        </div>
    );
};

export default RawMaterialListPage;
