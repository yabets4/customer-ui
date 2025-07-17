import React, { useState } from 'react';
import Button from '../../../components/ui/Button'; // Assuming your Button component is located here
import PaymentEntryModal from './PaymentEntryModal';
import ChangeRequestModal from './ChangeRequestModal';
import CancellationRequestModal from './CancellationRequestModal';

import {
  ShoppingCart,    // Main page icon for Sales Order
  User,            // Customer icon
  Calendar,        // Order Date icon
  Info,            // Status icon
  Truck,           // Delivery ETA icon
  Receipt,         // Payments tab/icon
  FileText,        // Documents tab/icon
  History,         // Timeline tab/icon
  Settings,        // Change Requests tab/icon
  Package,         // Item Breakdown icon
  DollarSign,      // Price/Total
  Plus,            // Add actions
  Edit,            // Edit Order button
  Printer,         // Print button
  Download,        // Download document
  Trash2,          // Delete document
  UploadCloud,     // Upload document area
  AlertCircle,     // For outstanding balance warning
  CheckCircle,     // Approved status icon
  Clock,           // Pending status icon
  Ban,             // Rejected status icon
  MapPin,          // Delivery Address icon
  ClipboardList,   // Special Instructions icon
  Factory,         // Timeline production icon
  Hammer,          // Timeline assembly icon
  Palette          // Timeline painting icon
} from 'lucide-react';

// --- Dummy Data (Replace with actual data fetching in a real app) ---
const salesOrderData = {
  id: 'SO-1023',
  customer: 'John Doe Furniture',
  orderDate: '2025-07-10',
  status: 'In Production',
  deliveryETA: '2025-08-01',
  deliveryAddress: 'Bole Road, Near Edna Mall, Addis Ababa, Ethiopia',
  projectManager: 'Bereket Lemma',
  specialInstructions: 'Client prefers delivery after 5 PM on weekdays. Ensure all items are securely wrapped and handled with care.',
  orderItems: [
    { name: 'Custom Dining Table (Oak)', qty: 1, price: 90000 },
    { name: 'Matching Chairs (x6, Leather seats)', qty: 6, price: 12000 },
    { name: 'Sideboard Cabinet', qty: 1, price: 35000 },
  ],
  payments: [
    { id: 'pay-001', date: '2025-07-10', method: 'Bank Transfer', reference: 'TRN987654', amount: 50000 },
    { id: 'pay-002', date: '2025-07-15', method: 'Telebirr', reference: 'TEL123456', amount: 30000 },
  ],
  documents: [
    { id: 'doc-001', name: 'DiningTable_Sketch.pdf', type: 'PDF', url: '#' },
    { id: 'doc-002', name: 'Client_Contract_SO1023.pdf', type: 'PDF', url: '#' },
    { id: 'doc-003', name: '3D_Render_Table.png', type: 'PNG', url: '#' },
  ],
  timeline: [
    { date: '2025-07-10', event: 'Order Confirmed', icon: CheckCircle },
    { date: '2025-07-11', event: 'Initial Deposit Received', icon: DollarSign },
    { date: '2025-07-12', event: 'Moved to Production', icon: Factory },
    { date: '2025-07-18', event: 'Frame Assembly Complete', icon: Hammer },
    { date: '2025-07-20', event: 'Painting Started', icon: Palette },
  ],
  changeRequests: [
    { id: 'CR-001', date: '2025-07-14', type: 'Material Change', status: 'Pending Approval', impact: '+1 day, +500 ETB', description: 'Change tabletop material from Oak to Walnut.' },
    { id: 'CR-002', date: '2025-07-16', type: 'Dimensions Adjustment', status: 'Approved', impact: 'None', description: 'Adjust dining table length by +10cm.' },
  ],
};

// Helper to get status badge style
const getStatusBadge = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800';
    case 'In Production':
      return 'bg-blue-100 text-blue-800';
    case 'Pending Approval':
      return 'bg-yellow-100 text-yellow-800';
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Delivered':
      return 'bg-purple-100 text-purple-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// --- Sub-Components for Tabs ---

function OverviewTab({ orderData }) {
  const totalOrderValue = orderData.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" /> Item Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.orderItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{item.qty}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 text-right">{item.price.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">{(item.qty * item.price).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td colSpan="3" className="px-4 py-3 text-right text-base font-semibold text-gray-800">Grand Total</td>
                <td className="px-4 py-3 text-right text-base font-bold text-indigo-700">{totalOrderValue.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" /> Delivery Information
          </h3>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Address:</span> {orderData.deliveryAddress}</p>
            <p><span className="font-medium">Project Manager:</span> {orderData.projectManager}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-orange-600" /> Special Instructions
          </h3>
          <p className="text-gray-700 italic">
            {orderData.specialInstructions || 'No special instructions provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function PaymentsTab({ orderData, onRecordPayment }) {
  const totalOrderValue = orderData.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalPaid = orderData.payments.reduce((acc, payment) => acc + payment.amount, 0);
  const outstandingBalance = totalOrderValue - totalPaid;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><Receipt className="w-5 h-5 text-green-600" /> Payment Records</span>
          <Button onClick={onRecordPayment} variant="primary" size="sm" icon={Plus}>
            Record New Payment
          </Button>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.payments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center italic">No payments recorded yet.</td>
                </tr>
              ) : (
                orderData.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{payment.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payment.method}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{payment.reference || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">{payment.amount.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-600" /> Payment Summary
        </h3>
        <div className="space-y-3 text-gray-800">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">Total Order Value:</span>
            <span className="font-semibold text-indigo-700">{totalOrderValue.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">Total Paid:</span>
            <span className="font-semibold text-green-600">{totalPaid.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</span>
          </div>
          <div className={`flex justify-between items-center text-xl font-bold pt-3 border-t-2 ${outstandingBalance > 0 ? 'border-red-200 text-red-700' : 'border-green-200 text-green-700'}`}>
            <span className="flex items-center gap-2">
              {outstandingBalance > 0 && <AlertCircle className="w-6 h-6 text-red-500" />}
              Outstanding Balance:
            </span>
            <span>{outstandingBalance.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ orderData }) {
  const [attachments, setAttachments] = useState(orderData.documents || []);

  const handleFileUpload = (e) => {
    // In a real app, you'd upload this to a server and get a URL/ID
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random(), // Unique ID for demo
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file), // Create object URL for preview/download
      fileObject: file // Keep file object for potential upload
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
    e.target.value = ''; // Clear the input
  };

  const removeAttachment = (idToRemove) => {
    setAttachments((prev) => prev.filter(doc => doc.id !== idToRemove));
    // In a real app, you'd also send a delete request to the server
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" /> Uploaded Documents
        </h3>
        {attachments.length === 0 ? (
          <p className="text-gray-500 italic mb-4">No documents uploaded for this order yet.</p>
        ) : (
          <ul className="space-y-3 mb-6">
            {attachments.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-800">{doc.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    size="sm"
                    icon={Download}
                    className="text-blue-600 hover:bg-blue-100"
                    iconOnly
                    aria-label={`Download ${doc.name}`}
                  />
                  <Button
                    onClick={() => removeAttachment(doc.id)}
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    className="text-red-600 hover:bg-red-100"
                    iconOnly
                    aria-label={`Delete ${doc.name}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* File Upload Area */}
        <div>
          <label htmlFor="document-upload" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-blue-500" /> Add New Document
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="document-upload"
              className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out"
            >
              <div className="flex flex-col items-center justify-center pt-2 pb-3">
                <UploadCloud className="w-7 h-7 mb-2 text-gray-400" />
                <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (MAX. 10MB per file)</p>
              </div>
              <input
                id="document-upload"
                name="document-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineTab({ orderData }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-teal-600" /> Order Timeline
      </h3>
      <div className="relative pl-6">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
        <ul className="space-y-6">
          {orderData.timeline.map((event, index) => (
            <li key={index} className="relative">
              <div className="absolute -left-6 top-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white ring-8 ring-white">
                {event.icon ? <event.icon className="w-3 h-3" /> : <Info className="w-3 h-3" />}
              </div>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="mt-1 text-base text-gray-800 font-medium">{event.event}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ChangeRequestsTab({ orderData, onInitiateChangeRequest, onInitiateCancellationRequest }) {
  // Helper to get status badge styling and icon for change requests
  const getChangeRequestStatusDisplay = (status) => {
    let bgColor, textColor, Icon;
    switch (status) {
      case 'Pending Approval':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        Icon = Clock;
        break;
      case 'Approved':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        Icon = CheckCircle;
        break;
      case 'Rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        Icon = Ban;
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        Icon = Info;
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        <Icon className="w-3 h-3 mr-1" /> {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><Settings className="w-5 h-5 text-pink-600" /> Change & Cancellation Requests</span>
          <div className="flex gap-2">
            <Button onClick={onInitiateChangeRequest} variant="outline" size="sm" icon={Plus}>
              New Change Request
            </Button>
            <Button onClick={onInitiateCancellationRequest} variant="outline" size="sm" icon={Ban} className="text-red-600 border-red-300 hover:bg-red-50">
              Request Cancellation
            </Button>
          </div>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderData.changeRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center italic">No change requests for this order yet.</td>
                </tr>
              ) : (
                orderData.changeRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{request.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{request.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={request.description}>{request.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getChangeRequestStatusDisplay(request.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{request.impact}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// --- Main SalesOrderDetail Component ---
export default function SalesOrderDetail() {
  const [tab, setTab] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // In a real app, salesOrderData would be fetched based on the SO ID
  const order = salesOrderData; // Using dummy data

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Info },
    { id: 'payments', name: 'Payments', icon: Receipt },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'timeline', name: 'Timeline', icon: History },
    { id: 'change-requests', name: 'Change Requests', icon: Settings },
  ];

  const handleAddPayment = (paymentDetails) => {
    console.log('New Payment Added:', paymentDetails);
    // In a real app, you'd send this to your backend and then refresh order data
    alert('Payment recorded successfully!');
    setShowPaymentModal(false);
  };

  const handleChangeRequest = (requestDetails) => {
    console.log('New Change Request Submitted:', requestDetails);
    // In a real app, you'd send this to your backend and then refresh order data
    alert('Change request submitted successfully!');
    setShowChangeModal(false);
  };

  const handleCancellationRequest = (requestDetails) => {
    console.log('New Cancellation Request Submitted:', requestDetails);
    // In a real app, you'd send this to your backend and then refresh order data
    alert('Cancellation request submitted successfully!');
    setShowCancelModal(false);
  };

  const totalOrderValue = order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalPaid = order.payments.reduce((acc, payment) => acc + payment.amount, 0);
  const outstandingBalance = totalOrderValue - totalPaid;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Sales Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-indigo-600" />
          Sales Order #{order.id}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md" icon={Edit}>
            Edit Order
          </Button>
          <Button variant="outline" size="md" icon={Printer}>
            Print Order
          </Button>
          <Button onClick={() => setShowPaymentModal(true)} variant="primary" size="md" icon={Plus}>
            Record Payment
          </Button>
        </div>
      </div>

      {/* Order Info Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
          <User className="w-6 h-6 text-blue-500" />
          <div>
            <div className="text-gray-500 text-xs uppercase font-semibold">Customer</div>
            <div className="font-medium text-gray-800 text-lg">{order.customer}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-green-500" />
          <div>
            <div className="text-gray-500 text-xs uppercase font-semibold">Order Date</div>
            <div className="font-medium text-gray-800 text-lg">{order.orderDate}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
          <Info className="w-6 h-6 text-yellow-500" />
          <div>
            <div className="text-gray-500 text-xs uppercase font-semibold">Status</div>
            <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(order.status)}`}>
              {order.status}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
          <Truck className="w-6 h-6 text-purple-500" />
          <div>
            <div className="text-gray-500 text-xs uppercase font-semibold">Delivery ETA</div>
            <div className="font-medium text-gray-800 text-lg">{order.deliveryETA}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-indigo-500" />
          <div>
            <div className="text-gray-500 text-xs uppercase font-semibold">Order Value</div>
            <div className="font-medium text-gray-800 text-lg">{totalOrderValue.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
          <Receipt className="w-6 h-6 text-green-500" />
          <div>
            <div className="text-gray-500 text-xs uppercase font-semibold">Total Paid</div>
            <div className="font-medium text-gray-800 text-lg">{totalPaid.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</div>
          </div>
        </div>
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 ${outstandingBalance > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <AlertCircle className={`w-6 h-6 ${outstandingBalance > 0 ? 'text-red-500' : 'text-green-500'}`} />
          <div>
            <div className={`text-xs uppercase font-semibold ${outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>Balance Due</div>
            <div className={`font-bold text-lg ${outstandingBalance > 0 ? 'text-red-800' : 'text-green-800'}`}>{outstandingBalance.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 text-sm font-semibold capitalize border-b-2 transition-all duration-200 ease-in-out
                ${tab === t.id
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              onClick={() => setTab(t.id)}
            >
              <t.icon className="w-5 h-5" /> {t.name}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="p-6">
          {tab === 'overview' && <OverviewTab orderData={order} />}
          {tab === 'payments' && <PaymentsTab orderData={order} onRecordPayment={() => setShowPaymentModal(true)} />}
          {tab === 'documents' && <DocumentsTab orderData={order} />}
          {tab === 'timeline' && <TimelineTab orderData={order} />}
          {tab === 'change-requests' && (
            <ChangeRequestsTab
              orderData={order}
              onInitiateChangeRequest={() => setShowChangeModal(true)}
              onInitiateCancellationRequest={() => setShowCancelModal(true)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && (
        <PaymentEntryModal
          onClose={() => setShowPaymentModal(false)}
          onAddPayment={handleAddPayment}
        />
      )}
      {showChangeModal && (
        <ChangeRequestModal
          onClose={() => setShowChangeModal(false)}
          onSubmit={handleChangeRequest}
        />
      )}
      {showCancelModal && (
        <CancellationRequestModal
          onClose={() => setShowCancelModal(false)}
          onSubmit={handleCancellationRequest}
        />
      )}
    </div>
  );
}