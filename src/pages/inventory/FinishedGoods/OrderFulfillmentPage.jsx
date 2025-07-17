import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ModalWithForm from '../../../components/ui/modal';
import {
  ListOrdered, Package, CheckCircle, XCircle, Truck, ShoppingCart, Calendar, User, MapPin, Hash, Box, Clipboard
} from 'lucide-react';

// --- Mock Data ---
// Ensure this is 'let' so it can be modified across interactions
let mockFinishedGoods = [
  {
    id: 'FG001',
    productCode: 'TBL-OAK-001',
    name: 'Classic Oak Dining Table',
    description: 'Sturdy dining table crafted from high-quality kiln-dried oak. Seats 6-8 people. Dimensions: 72"L x 36"W x 30"H.',
    category: 'Dining Furniture',
    sellingPrice: 1200.00,
    productionCost: 750.00,
    currentStock: 15, // Will be updated
    minStockLevel: 5,
    location: 'Finished Goods Warehouse A, Zone 1',
    imageUrl: '/images/oak-table.jpg',
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

let mockCustomerOrders = [
  {
    id: 'ORD001',
    customerName: 'ABC Retail Co.',
    orderDate: '2025-07-10',
    status: 'Pending', // Pending, Fulfilled, Canceled
    items: [
      { finishedGoodId: 'FG001', quantity: 2 }, // Classic Oak Dining Table
      { finishedGoodId: 'FG003', quantity: 5 }  // Modern Steel & Leather Chair
    ],
    shippingAddress: '123 Main St, Anytown, USA',
    notes: 'Priority shipping requested.',
    responsiblePerson: 'John Doe'
  },
  {
    id: 'ORD002',
    customerName: 'Home Furnishings Inc.',
    orderDate: '2025-07-11',
    status: 'Pending',
    items: [
      { finishedGoodId: 'FG002', quantity: 1 }, // Luxury Blue Velvet Sofa
      { finishedGoodId: 'FG004', quantity: 1 }  // Luxury King Size Bed Frame
    ],
    shippingAddress: '456 Oak Ave, Big City, USA',
    notes: 'Requires careful handling.',
    responsiblePerson: 'Jane Smith'
  },
  {
    id: 'ORD003',
    customerName: 'Online Customer #101',
    orderDate: '2025-07-12',
    status: 'Pending',
    items: [
      { finishedGoodId: 'FG001', quantity: 3 }
    ],
    shippingAddress: '789 Pine Ln, Smallville, USA',
    notes: 'Deliver after 3 PM.',
    responsiblePerson: 'Mark Johnson'
  },
  {
    id: 'ORD004',
    customerName: 'Test Fulfilled Customer',
    orderDate: '2025-07-08',
    status: 'Fulfilled', // Example of an already fulfilled order
    items: [
      { finishedGoodId: 'FG003', quantity: 2 }
    ],
    shippingAddress: '100 Test St, Test City, USA',
    notes: 'Testing previous fulfillment.',
    responsiblePerson: 'Emily White'
  }
];

let mockFinishedGoodMovements = [
  // Example: an initial outbound movement if needed, otherwise starts empty
  {
      id: 'FGM001',
      finishedGoodId: 'FG003',
      movementType: 'Outbound',
      quantity: 2,
      uom: 'units', // Assuming units for finished goods
      movementDate: '2025-07-08',
      sourceDocument: 'ORD004', // Link to order ID
      destinationDocument: 'DELIVERY-ORD004', // A mock delivery doc
      responsiblePerson: 'Emily White',
      fromLocation: 'Finished Goods Warehouse A, Zone 2',
      notes: 'Fulfilled order ORD004.'
  }
];

const OrderFulfillmentPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' });

  // Function to refresh orders and their stock status
  const refreshOrders = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    const enrichedOrders = mockCustomerOrders.map(order => {
      const itemsWithStock = order.items.map(item => {
        const finishedGood = mockFinishedGoods.find(fg => fg.id === item.finishedGoodId);
        return {
          ...item,
          finishedGoodName: finishedGood?.name || 'Unknown Product',
          currentStock: finishedGood?.currentStock || 0,
          location: finishedGood?.location || 'N/A',
          isAvailable: (finishedGood?.currentStock || 0) >= item.quantity,
        };
      });
      const allItemsAvailable = itemsWithStock.every(item => item.isAvailable);
      return {
        ...order,
        items: itemsWithStock,
        allItemsAvailable: allItemsAvailable,
        canFulfill: order.status === 'Pending' && allItemsAvailable,
      };
    });
    setOrders(enrichedOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate))); // Sort by date
    setLoading(false);

    // If an order was selected and we refreshed, re-select to update its details
    if (selectedOrder) {
      const updatedSelectedOrder = enrichedOrders.find(o => o.id === selectedOrder.id);
      setSelectedOrder(updatedSelectedOrder || null);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const handleOrderSelect = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
  };

  const handleFulfillOrder = async () => {
    if (!selectedOrder || selectedOrder.status !== 'Pending') {
      setModalContent({ title: 'Error', message: 'This order cannot be fulfilled.', type: 'error' });
      setModalOpen(true);
      return;
    }

    if (!selectedOrder.allItemsAvailable) {
      setModalContent({ title: 'Insufficient Stock', message: 'Not enough stock available for all items in this order.', type: 'error' });
      setModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      // 1. Deduct stock from mockFinishedGoods
      selectedOrder.items.forEach(item => {
        const fgIndex = mockFinishedGoods.findIndex(fg => fg.id === item.finishedGoodId);
        if (fgIndex !== -1) {
          mockFinishedGoods[fgIndex].currentStock -= item.quantity;
          console.log(`Deducted ${item.quantity} from ${item.finishedGoodName}. New stock: ${mockFinishedGoods[fgIndex].currentStock}`);

          // 2. Record movement
          const movementId = `FGM${(mockFinishedGoodMovements.length + 1).toString().padStart(3, '0')}`;
          mockFinishedGoodMovements.push({
            id: movementId,
            finishedGoodId: item.finishedGoodId,
            movementType: 'Outbound',
            quantity: item.quantity,
            uom: 'units', // Assuming units for finished goods
            movementDate: new Date().toISOString().split('T')[0], // Current date
            sourceDocument: selectedOrder.id,
            destinationDocument: `DELIVERY-${selectedOrder.id}`, // A mock delivery doc
            responsiblePerson: selectedOrder.responsiblePerson || 'System',
            fromLocation: mockFinishedGoods[fgIndex].location,
            notes: `Fulfilled order ${selectedOrder.id}.`,
          });
          console.log('New Movement Recorded:', mockFinishedGoodMovements[mockFinishedGoodMovements.length - 1]);
        }
      });

      // 3. Update order status
      const orderIndex = mockCustomerOrders.findIndex(o => o.id === selectedOrder.id);
      if (orderIndex !== -1) {
        mockCustomerOrders[orderIndex].status = 'Fulfilled';
        console.log(`Order ${selectedOrder.id} status updated to Fulfilled.`);
      }

      setModalContent({ title: 'Order Fulfilled!', message: `Order ${selectedOrder.id} has been successfully dispatched.`, type: 'success' });
      setModalOpen(true);
      setSelectedOrder(null); // Clear selected order after fulfillment
      refreshOrders(); // Re-fetch and update the list
    } catch (error) {
      console.error('Error fulfilling order:', error);
      setModalContent({ title: 'Error', message: 'Failed to fulfill order. Please try again.', type: 'error' });
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
        <Truck className="inline-block w-8 h-8 mr-2 text-green-600" /> Order Fulfillment
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Pending Orders List */}
        <Card className="md:col-span-1 p-6 h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
            <ListOrdered className="w-6 h-6 mr-2 text-blue-500" /> Pending Orders
          </h2>
          {orders.filter(o => o.status === 'Pending').length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No pending orders at the moment.</p>
          ) : (
            <ul className="space-y-3">
              {orders.filter(o => o.status === 'Pending').map(order => (
                <li
                  key={order.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200
                              ${selectedOrder?.id === order.id
                                ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 shadow-md'
                                : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                              ${!order.allItemsAvailable ? 'opacity-70' : ''}
                              `}
                  onClick={() => handleOrderSelect(order.id)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{order.id}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                      order.status === 'Fulfilled' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center"><User className="w-4 h-4 mr-1" /> {order.customerName}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center"><Calendar className="w-4 h-4 mr-1" /> {order.orderDate}</p>
                  <p className={`text-sm mt-2 flex items-center font-medium ${order.allItemsAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    <Box className="w-4 h-4 mr-1" />
                    {order.allItemsAvailable ? 'All Items Available' : 'Stock Shortage!'}
                  </p>
                </li>
              ))}
            </ul>
          )}
           <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center mt-6 border-t pt-4">
            <ListOrdered className="w-6 h-6 mr-2 text-gray-500" /> Fulfilled Orders
          </h2>
          {orders.filter(o => o.status === 'Fulfilled').length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No fulfilled orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders.filter(o => o.status === 'Fulfilled').map(order => (
                <li
                  key={order.id}
                  className={`p-4 border rounded-lg opacity-70 cursor-pointer transition-all duration-200
                              ${selectedOrder?.id === order.id
                                ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 shadow-md'
                                : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                              `}
                  onClick={() => handleOrderSelect(order.id)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{order.id}</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center"><User className="w-4 h-4 mr-1" /> {order.customerName}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center"><Calendar className="w-4 h-4 mr-1" /> {order.orderDate}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Right Column: Selected Order Details */}
        <Card className="md:col-span-2 p-6 h-[70vh] overflow-y-auto">
          {selectedOrder ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2 text-indigo-500" /> Order Details: {selectedOrder.id}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Name</p>
                  <p className="text-lg text-gray-900 dark:text-gray-100 flex items-center"><User className="w-4 h-4 mr-2" /> {selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Date</p>
                  <p className="text-lg text-gray-900 dark:text-gray-100 flex items-center"><Calendar className="w-4 h-4 mr-2" /> {selectedOrder.orderDate}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Address</p>
                  <p className="text-lg text-gray-900 dark:text-gray-100 flex items-center"><MapPin className="w-4 h-4 mr-2" /> {selectedOrder.shippingAddress}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</p>
                  <p className="text-lg text-gray-900 dark:text-gray-100 flex items-center"><Clipboard className="w-4 h-4 mr-2" /> {selectedOrder.notes || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`px-3 py-1 rounded-full text-lg font-bold ${
                    selectedOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                    selectedOrder.status === 'Fulfilled' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center">
                <Package className="w-5 h-5 mr-2" /> Order Items
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedOrder.items.map(item => (
                      <tr key={item.finishedGoodId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.finishedGoodId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.finishedGoodName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.currentStock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Shortage'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleFulfillOrder}
                  variant="primary"
                  disabled={!selectedOrder.canFulfill || submitting}
                  className={`${!selectedOrder.canFulfill ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" /> Dispatching...
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5 mr-2" /> Dispatch Order
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Select an order from the left to view its details and fulfill.
            </p>
          )}
        </Card>
      </div>

      {/* Modal for messages */}
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

export default OrderFulfillmentPage;