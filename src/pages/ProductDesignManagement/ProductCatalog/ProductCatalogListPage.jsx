import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import Select from '../../../components/ui/Select';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Search, PlusCircle, Eye, Edit, ToggleLeft, ToggleRight, LayoutList } from 'lucide-react';

// --- INLINE MOCK PRODUCT DATA ---
// Using 'let' so it can be modified by other pages (e.g., form pages) if they were also inlined
let mockProducts = [
  {
    id: 'PROD001',
    sku: 'SOFA-MOD-GRY-3S',
    name: 'Modern Gray 3-Seater Sofa',
    description: 'A comfortable modern sofa with a durable gray fabric, perfect for contemporary living spaces.',
    price: 1200.00,
    uom: 'Each',
    dimensions: { length: 220, width: 90, height: 80, unit: 'cm' },
    weight: { value: 75, unit: 'kg' },
    status: 'Active', // Active, Inactive, Discontinued
    costPrice: 600.00,
    category: 'Living Room Sofas',
    tags: ['Modern', 'Gray', 'Comfort', 'Fabric'],
    type: 'fixed', // 'fixed' or 'customizable'
    media: ['/images/sofa_modern_gray.jpg'], // Placeholder for image paths
    variants: [ // Example of simple variants within a fixed product
      { sku: 'SOFA-MOD-GRY-3S', color: 'Gray', material: 'Fabric', price: 1200.00 },
      { sku: 'SOFA-MOD-BLU-3S', color: 'Blue', material: 'Fabric', price: 1250.00 },
    ]
  },
  {
    id: 'PROD002',
    sku: 'TABLE-DIN-OAK-CUST',
    name: 'Customizable Oak Dining Table',
    description: 'Design your perfect oak dining table by selecting dimensions, wood finish, and leg style.',
    price: 0, // Customizable products might have dynamic pricing
    uom: 'Each',
    dimensions: { length: 0, width: 0, height: 0, unit: 'cm' }, // Placeholder, as it's customizable
    weight: { value: 0, unit: 'kg' }, // Placeholder
    status: 'Active',
    costPrice: 0, // Dynamic
    category: 'Dining Tables',
    tags: ['Oak', 'Custom', 'Wood', 'Dining'],
    type: 'customizable',
    configurableAttributes: [
      { name: 'Length', type: 'range', min: 150, max: 250, unit: 'cm' },
      { name: 'Width', type: 'range', min: 80, max: 120, unit: 'cm' },
      { name: 'Wood Finish', type: 'select', options: ['Natural Oak', 'Dark Oak', 'Whitewashed Oak'] },
      { name: 'Leg Style', type: 'select', options: ['Tapered', 'Straight', 'Pedestal'] }
    ],
    media: ['/images/table_oak_template.jpg']
  },
  {
    id: 'PROD003',
    sku: 'CHAIR-ACCENT-VEL-GRN',
    name: 'Velvet Accent Chair (Green)',
    description: 'Elegant accent chair with plush green velvet upholstery and gold-finished legs.',
    price: 350.00,
    uom: 'Each',
    dimensions: { length: 70, width: 75, height: 85, unit: 'cm' },
    weight: { value: 15, unit: 'kg' },
    status: 'Active',
    costPrice: 180.00,
    category: 'Accent Chairs',
    tags: ['Velvet', 'Green', 'Accent', 'Luxury'],
    type: 'fixed',
    media: ['/images/chair_velvet_green.jpg']
  },
  {
    id: 'PROD004',
    sku: 'BED-FRAME-STEEL-QUEEN',
    name: 'Industrial Queen Bed Frame',
    description: 'Sturdy steel bed frame with an industrial design, suitable for queen size mattresses.',
    price: 650.00,
    uom: 'Each',
    dimensions: { length: 205, width: 155, height: 100, unit: 'cm' },
    weight: { value: 40, unit: 'kg' },
    status: 'Inactive',
    costPrice: 320.00,
    category: 'Bedroom Furniture',
    tags: ['Industrial', 'Steel', 'Queen'],
    type: 'fixed',
    media: ['/images/bed_frame_steel.jpg']
  },
  {
    id: 'PROD005',
    sku: 'BOOKSHELF-MODULAR-CUST',
    name: 'Customizable Modular Bookshelf',
    description: 'Create your own storage solution with customizable height, width, and shelving options.',
    price: 0,
    uom: 'Each',
    dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
    weight: { value: 0, unit: 'kg' },
    status: 'Active',
    costPrice: 0,
    category: 'Storage & Shelving',
    tags: ['Modular', 'Custom', 'Bookshelf'],
    type: 'customizable',
    configurableAttributes: [
      { name: 'Height', type: 'range', min: 100, max: 240, unit: 'cm' },
      { name: 'Width', type: 'range', min: 60, max: 180, unit: 'cm' },
      { name: 'Number of Shelves', type: 'number', min: 2, max: 8 },
      { name: 'Material', type: 'select', options: ['MDF', 'Pine', 'Plywood'] }
    ],
    media: ['/images/bookshelf_modular_template.jpg']
  },
];

const productCategories = [
  { value: '', label: 'All Categories' },
  { value: 'Living Room Sofas', label: 'Living Room Sofas' },
  { value: 'Dining Tables', label: 'Dining Tables' },
  { value: 'Accent Chairs', label: 'Accent Chairs' },
  { value: 'Bedroom Furniture', label: 'Bedroom Furniture' },
  { value: 'Storage & Shelving', label: 'Storage & Shelving' },
  { value: 'Outdoor Furniture', label: 'Outdoor Furniture' },
];

const productStatuses = [
  { value: '', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Discontinued', label: 'Discontinued' },
];
// --- END INLINE MOCK PRODUCT DATA ---

const ProductCatalogListPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // State to hold products from mock data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Simulate fetching products from an API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Using the inline mockProducts directly
      setProducts(mockProducts);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and sort products based on search term, category, and status
  const filteredProducts = useMemo(() => {
    let currentProducts = [...products]; // Create a mutable copy

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.sku.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    if (selectedCategory) {
      currentProducts = currentProducts.filter(product => product.category === selectedCategory);
    }

    if (selectedStatus) {
      currentProducts = currentProducts.filter(product => product.status === selectedStatus);
    }

    // Sort by SKU for consistent ordering
    return currentProducts.sort((a, b) => a.sku.localeCompare(b.sku));
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    // Optimistically update UI
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, status: newStatus } : p
      )
    );

    try {
      // Simulate API call to update status
      await new Promise(resolve => setTimeout(resolve, 300));
      const productIndex = mockProducts.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        mockProducts[productIndex].status = newStatus; // Update central mock data
        console.log(`Product ${productId} status toggled to ${newStatus}`);
      }
    } catch (err) {
      setError('Failed to update product status. Please try again.');
      // Revert UI on error
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? { ...p, status: currentStatus } : p
        )
      );
      console.error('Toggle status error:', err);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600 dark:text-red-400">
        <p>{error}</p>
        <Button onClick={fetchProducts} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <LayoutList className="w-8 h-8 mr-2 text-purple-600" />
          Product Catalog
        </h1>
        <Button onClick={() => navigate('/product/new')}>
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Product
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Search by SKU, Name, or Description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            label="Search Products"
          />
          <Select
            label="Filter by Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={productCategories}
          />
          <Select
            label="Filter by Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={productStatuses}
          />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  SKU / ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {product.sku} <span className="text-gray-400 text-xs">({product.id})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {product.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Varies'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                        product.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                        'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/product/${product.id}/detail`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/product/${product.id}/edit`)}
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          title={product.status === 'Active' ? 'Deactivate Product' : 'Activate Product'}
                        >
                          {product.status === 'Active' ? (
                            <ToggleLeft className="w-4 h-4 text-red-500" />
                          ) : (
                            <ToggleRight className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProductCatalogListPage;