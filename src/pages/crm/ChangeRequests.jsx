import React, { useState, useEffect } from 'react';
import ModalWithForm from '../../components/ui/modal'; // Adjust the path based on your file structure
import Button from '../../components/ui/Button'; // Assuming your Button component

import {
  GitPullRequest, // Main page title icon
  PlusCircle,     // Add Request button icon
  Trash2,         // Delete action icon
  Edit,           // Edit action icon
  RefreshCcw,     // Change request type icon
  XCircle,        // Cancellation request type icon
  DollarSign,     // Price Difference icon
  Tag,            // Request ID icon
  Users,          // Customer icon
  FileText,       // Request Description icon
  Info,           // Reason icon
  CheckCircle,    // Approved status icon
  Clock,          // Pending status icon
  Ban             // Rejected status icon
} from 'lucide-react';

const initialRequests = [
  {
    id: 'OCR-001',
    customer: 'John Doe Furniture',
    type: 'Change',
    request: 'Adjust dimensions of dining table to 180x90cm',
    priceDifference: '+2,000 ETB',
    status: 'Pending Approval',
    reason: 'Customer changed room layout after initial design review. Requires material re-cut.'
  },
  {
    id: 'OCR-002',
    customer: 'ABC Furniture PLC',
    type: 'Cancellation',
    request: 'Cancel order for 3 chairs (SO-105)',
    priceDifference: '-1,500 ETB',
    status: 'Approved',
    reason: 'Over-ordering by mistake. No impact on other items in SO-105.'
  },
  {
    id: 'OCR-003',
    customer: 'Happy Homes Design',
    type: 'Change',
    request: 'Change fabric color for custom sofa to "Ocean Blue"',
    priceDifference: '0 ETB',
    status: 'Approved',
    reason: 'Initial fabric selected was out of stock. Client approved alternative.'
  },
  {
    id: 'OCR-004',
    customer: 'Urban Living Solutions',
    type: 'Cancellation',
    request: 'Cancel entire order SO-120 (due to client budget cuts)',
    priceDifference: '-50,000 ETB',
    status: 'Rejected',
    reason: 'Cancellation requested after production started. Significant material waste and labor cost incurred.'
  }
];

const ChangeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setRequests(initialRequests);
  }, []);

  const handleAddRequest = (data) => {
    const newRequest = {
      ...data,
      id: `OCR-${String(requests.length + 1).padStart(3, '0')}`, // Format ID with leading zeros
    };
    setRequests(prev => [...prev, newRequest]);
    setModalOpen(false); // Close modal after adding
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      const updated = requests.filter(r => r.id !== id);
      setRequests(updated);
    }
  };

  // Helper to get status badge styling and icon
  const getStatusDisplay = (status) => {
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

  // Helper to get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Change':
        return <RefreshCcw className="w-4 h-4 text-blue-500 mr-2" />;
      case 'Cancellation':
        return <XCircle className="w-4 h-4 text-red-500 mr-2" />;
      default:
        return null;
    }
  };

  // Fields for the ModalWithForm
  const fields = [
    { label: 'Customer', name: 'customer', type: 'text', required: true, icon: Users, placeholder: 'e.g., John Doe Furniture' },
    { label: 'Type', name: 'type', type: 'select', required: true, icon: GitPullRequest, options: [
      { label: 'Change', value: 'Change' },
      { label: 'Cancellation', value: 'Cancellation' }
    ]},
    { label: 'Request Details', name: 'request', type: 'textarea', required: true, icon: FileText, placeholder: 'Describe the change or cancellation requested' },
    { label: 'Price Difference', name: 'priceDifference', type: 'text', required: true, icon: DollarSign, placeholder: 'e.g., +200 ETB, -500 ETB, 0 ETB' },
    { label: 'Status', name: 'status', type: 'select', required: true, icon: Info, options: [
      { label: 'Pending Approval', value: 'Pending Approval' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' }
    ]},
    { label: 'Reason', name: 'reason', type: 'textarea', required: true, icon: Info, placeholder: 'Explain the reason for the request' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
        <GitPullRequest className="w-8 h-8 text-indigo-600" />
        Change & Cancellation Requests
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">All Requests</h2>
          <Button
            onClick={() => setModalOpen(true)}
            variant="primary"
            size="md"
            icon={PlusCircle}
          >
            Add New Request
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Request ID</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Diff.</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 whitespace-nowrap text-sm text-gray-500 text-center italic">
                    No change or cancellation requests found. Click "Add New Request" to create one.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{req.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center">
                      {getTypeIcon(req.type)} {req.type}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={req.request}>
                      {req.request}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{req.priceDifference}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusDisplay(req.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Edit functionality would require passing current data to modal */}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          className="text-indigo-600 hover:bg-indigo-100"
                          iconOnly
                          aria-label="Edit request"
                          // onClick={() => handleEdit(req)} // Implement edit functionality
                        />
                        <Button
                          onClick={() => handleDelete(req.id)}
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          className="text-red-600 hover:bg-red-100"
                          iconOnly
                          aria-label="Delete request"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalWithForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddRequest}
        title="Add Change or Cancellation Request"
        fields={fields}
        // Assuming ModalWithForm can accept button text and uses an internal button component
        submitButtonText="Submit Request"
      />
    </div>
  );
};

export default ChangeRequests;