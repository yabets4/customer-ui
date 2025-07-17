import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/input';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  Plus, Search, Edit, Trash2, Eye, SortAsc, SortDesc, Box, Package, DollarSign, Clock, MapPin, Factory
} from 'lucide-react';

// --- Mock Data for Finished Goods ---
// This represents your in-memory collection of finished products.
const mockFinishedGoods = [
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
    imageUrl: '/images/oak-table.jpg',
    assemblyTime: '8 hours',
    materialsUsed: ['RM001', 'RM003'] // Links to raw materials if desired
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

const FinishedGoodListPage = () => {
  const navigate = useNavigate();
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Simulate fetching data on component mount
  useEffect(() => {
    const fetchFinishedGoods = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setFinishedGoods(mockFinishedGoods);
      } catch (err) {
        setError('Failed to load finished goods. Please try again.');
        console.error('Error fetching finished goods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedGoods();
  }, []);

  // Filter and sort the finished goods
  const filteredAndSortedFinishedGoods = useMemo(() => {
    let sortableItems = [...finishedGoods];

    // Filter
    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [finishedGoods, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <SortAsc className="w-4 h-4 ml-1 inline" /> : <SortDesc className="w-4 h-4 ml-1 inline" />;
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setLoading(true); // Indicate deletion is in progress
      try {
        // Simulate API call for deletion
        await new Promise(resolve => setTimeout(resolve, 500));

        const updatedGoods = finishedGoods.filter(item => item.id !== itemToDelete.id);
        setFinishedGoods(updatedGoods);
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        // Optionally show success message
        console.log(`Finished Good ${itemToDelete.name} deleted successfully (mock).`);
      } catch (err) {
        setError('Failed to delete finished good. Please try again.');
        console.error('Error deleting finished good:', err);
      } finally {
        setLoading(false);
      }
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
      <div className="flex justify-center items-center h-screen text-red-600 dark:text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        <Box className="inline-block w-8 h-8 mr-2 text-indigo-600" /> Finished Goods Inventory
      </h1>

      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <Input
            type="text"
            placeholder="Search by name, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="w-full md:w-1/2"
          />
          <Button
            onClick={() => navigate('/inventory/finished-goods/new')}
            variant="primary"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Finished Good
          </Button>
        </div>

        {filteredAndSortedFinishedGoods.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No finished goods found. {searchTerm && "Try adjusting your search filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('productCode')}
                  >
                    Product Code {getSortIcon('productCode')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('category')}
                  >
                    Category {getSortIcon('category')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('sellingPrice')}
                  >
                    Selling Price {getSortIcon('sellingPrice')}
                  </th>
                   <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('currentStock')}
                  >
                    Current Stock {getSortIcon('currentStock')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedFinishedGoods.map((fg) => (
                  <tr key={fg.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {fg.productCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {fg.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {fg.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${fg.sellingPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        fg.currentStock <= fg.minStockLevel ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      }`}>
                        {fg.currentStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {fg.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/inventory/finished-goods/${fg.id}`)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/inventory/finished-goods/${fg.id}/edit`)}
                          title="Edit Finished Good"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(fg)}
                          title="Delete Finished Good"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ModalWithForm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        className="border-red-500"
      >
        <p className="text-center text-lg mb-4">
          Are you sure you want to delete "<strong>{itemToDelete?.name} ({itemToDelete?.productCode})</strong>"?
          This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="danger">
            {loading ? <LoadingSpinner size="sm" /> : 'Delete'}
          </Button>
        </div>
      </ModalWithForm>
    </div>
  );
};

export default FinishedGoodListPage;