import React, { useState } from 'react';
import Button from '../../../components/ui/Button'; // Assuming your Button component is located here
import {
  ShoppingCart,     // Icon for the main list title
  Search,           // Icon for the search/filter input
  PlusCircle,       // Icon for 'Create New Order'
  Eye,              // Icon for 'View Details'
  ChevronDown,      // Icon for sort direction
  Filter,           // Icon for filter/status
  Calendar,         // Icon for Order Date
  User,             // Icon for Customer
  Hash,             // Icon for Order ID
  DollarSign,       // Icon for Total Amount
} from 'lucide-react';

// --- Dummy Sales Order Data ---
const dummySalesOrders = [
  {
    id: 'SO-1001',
    customer: 'Acme Corp',
    orderDate: '2025-07-01',
    deliveryETA: '2025-07-20',
    status: 'In Production',
    totalAmount: 150000.00,
  },
  {
    id: 'SO-1002',
    customer: 'John Doe Furniture',
    orderDate: '2025-07-05',
    deliveryETA: '2025-07-25',
    status: 'Confirmed',
    totalAmount: 90000.00,
  },
  {
    id: 'SO-1003',
    customer: 'Green Solutions Ltd.',
    orderDate: '2025-07-08',
    deliveryETA: '2025-08-01',
    status: 'Pending Approval',
    totalAmount: 210000.00,
  },
  {
    id: 'SO-1004',
    customer: 'Innovative Designs',
    orderDate: '2025-07-10',
    deliveryETA: '2025-08-05',
    status: 'Delivered',
    totalAmount: 55000.00,
  },
  {
    id: 'SO-1005',
    customer: 'Acme Corp',
    orderDate: '2025-06-28',
    deliveryETA: '2025-07-15',
    status: 'Cancelled',
    totalAmount: 70000.00,
  },
  {
    id: 'SO-1006',
    customer: 'John Doe Furniture',
    orderDate: '2025-06-20',
    deliveryETA: '2025-07-10',
    status: 'Delivered',
    totalAmount: 110000.00,
  },
  {
    id: 'SO-1007',
    customer: 'Green Solutions Ltd.',
    orderDate: '2025-07-12',
    deliveryETA: '2025-08-08',
    status: 'In Production',
    totalAmount: 180000.00,
  },
];

// Helper to get status badge style
const getStatusBadge = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800';
    case 'In Production':
      return 'bg-blue-100 text-blue-800';
    case 'Pending Approval':
      return 'bg-yellow-100 text-yellow-800';
    case 'Delivered':
      return 'bg-purple-100 text-purple-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function SalesOrderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortColumn, setSortColumn] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [displayLimit, setDisplayLimit] = useState(5); // For basic pagination

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDisplayLimit(5); // Reset limit on search
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setDisplayLimit(5); // Reset limit on filter change
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc'); // Default to asc when changing column
    }
  };

  const filteredAndSortedOrders = dummySalesOrders
    .filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'totalAmount') {
        comparison = a[sortColumn] - b[sortColumn];
      } else {
        comparison = a[sortColumn].localeCompare(b[sortColumn]);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const displayedOrders = filteredAndSortedOrders.slice(0, displayLimit);
  const hasMoreOrders = displayLimit < filteredAndSortedOrders.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-indigo-600" />
          Sales Orders
        </h2>
        <Button variant="primary" size="lg" icon={PlusCircle}>
          Create New Order
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 sm:text-sm border-gray-300 rounded-md py-2"
                placeholder="Search by ID or Customer..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <select
                id="statusFilter"
                name="statusFilter"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={filterStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Production">In Production</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Add more filters here if needed, e.g., date range, project manager */}
        </div>
      </div>

      {/* Sales Orders Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-1" /> Order ID
                    {sortColumn === 'id' && <ChevronDown className={`w-4 h-4 ml-1 transform ${sortDirection === 'desc' ? '' : 'rotate-180'}`} />}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customer')}
                >
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" /> Customer
                    {sortColumn === 'customer' && <ChevronDown className={`w-4 h-4 ml-1 transform ${sortDirection === 'desc' ? '' : 'rotate-180'}`} />}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('orderDate')}
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> Order Date
                    {sortColumn === 'orderDate' && <ChevronDown className={`w-4 h-4 ml-1 transform ${sortDirection === 'desc' ? '' : 'rotate-180'}`} />}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery ETA
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center justify-end">
                    <DollarSign className="w-4 h-4 mr-1" /> Total Amount
                    {sortColumn === 'totalAmount' && <ChevronDown className={`w-4 h-4 ml-1 transform ${sortDirection === 'desc' ? '' : 'rotate-180'}`} />}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center italic">
                    No sales orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.deliveryETA}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {order.totalAmount.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => alert(`Viewing details for ${order.id}`)} // Replace with actual navigation
                        iconOnly
                        aria-label={`View details for order ${order.id}`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasMoreOrders && (
          <div className="px-6 py-4 text-center border-t border-gray-200 bg-gray-50">
            <Button
              variant="secondary"
              onClick={() => setDisplayLimit(prevLimit => prevLimit + 5)} // Load 5 more items
              size="md"
            >
              Load More Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}