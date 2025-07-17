import React, { useState, useEffect } from 'react';
import ModalWithForm from '../../../components/ui/modal'; // Path remains the same
import Button from '../../../components/ui/Button'; // Assuming your updated Button component is here
import {
  Plus, // For add button
  Users, // Main page title icon
  User, // Customer Type - Individual
  Building, // Customer Type - Company
  Phone, // Phone
  Mail, // Email
  ShoppingCart, // Order History
  DollarSign, // Avg Spend
  CreditCard, // Payment Preference
  UserCog, // Assigned Rep
  Edit, // Edit action
  Trash2, // Delete action
} from 'lucide-react'; // Import necessary icons

const initialCustomers = [
  {
    id: 1,
    type: 'Individual',
    name: 'John Doe',
    phone: '0911223344',
    email: 'john@example.com',
    orderHistory: 5,
    avgSpend: 3000,
    paymentPref: 'Telebirr',
    assignedRep: 'Rep1'
  },
  {
    id: 2,
    type: 'Company',
    name: 'ABC Furniture PLC',
    phone: '0911777888',
    email: 'contact@abcfurniture.com',
    orderHistory: 12,
    avgSpend: 12000,
    paymentPref: 'Bank Transfer',
    assignedRep: 'Rep2'
  },
  {
    id: 3,
    type: 'Individual',
    name: 'Liya Kebede',
    phone: '0923456789',
    email: 'liya@example.com',
    orderHistory: 3,
    avgSpend: 1500,
    paymentPref: 'Cash',
    assignedRep: 'Rep1'
  },
  {
    id: 4,
    type: 'Company',
    name: 'EthioTech Solutions',
    phone: '0945678901',
    email: 'info@ethiotech.com',
    orderHistory: 8,
    avgSpend: 7500,
    paymentPref: 'Credit',
    assignedRep: 'Rep3'
  }
];

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null); // For editing

  useEffect(() => {
    setCustomers(initialCustomers);
  }, []);

  const handleAddCustomer = (data) => {
    const newCustomer = { ...data, id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1 };
    setCustomers((prev) => [...prev, newCustomer]);
    setShowAddModal(false); // Close modal after adding
  };

  const handleEditCustomer = (data) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === data.id ? { ...c, ...data } : c))
    );
    setShowEditModal(false); // Close modal after editing
    setCurrentCustomer(null); // Clear current customer
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const openEditModal = (customer) => {
    setCurrentCustomer(customer);
    setShowEditModal(true);
  };

  const customerFields = [
    {
      label: 'Type',
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Individual', value: 'Individual' },
        { label: 'Company', value: 'Company' }
      ],
      placeholder: 'Select customer type'
    },
    { label: 'Name', name: 'name', type: 'text', required: true, placeholder: 'Enter customer name' },
    { label: 'Phone', name: 'phone', type: 'text', required: true, placeholder: 'e.g., 09xxxxxxxx' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'e.g., example@domain.com' },
    { label: 'Order History', name: 'orderHistory', type: 'number', placeholder: 'Number of orders' },
    { label: 'Avg. Spend', name: 'avgSpend', type: 'number', placeholder: 'Average spend in ETB' },
    { label: 'Payment Preference', name: 'paymentPref', type: 'text', placeholder: 'e.g., Telebirr, Cash' },
    { label: 'Assigned Rep', name: 'assignedRep', type: 'text', placeholder: 'e.g., John Doe' }
  ];

  const formatETB = (amount) => {
    if (amount == null) return 'N/A';
    return `ETB ${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCustomerTypeIcon = (type) => {
    if (type === 'Individual') return <User className="w-4 h-4 text-blue-500" />;
    if (type === 'Company') return <Building className="w-4 h-4 text-purple-500" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" />
          Customer Management
        </h1>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary" // Using the new primary variant
          size="md"
          icon={Plus} // Adding an icon
        >
          Add Customer
        </Button>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto"> {/* Added for horizontal scrolling on small screens */}
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {/* Table Headers - ensured consistent padding and alignment */}
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  ID
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> Type</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">
                  <span className="flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" /> Orders</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                  <span className="flex items-center justify-end gap-2"><DollarSign className="w-4 h-4" /> Avg Spend</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><UserCog className="w-4 h-4" /> Rep</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500 text-lg">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c, index) => (
                  <tr key={c.id} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-4 py-3 text-sm text-gray-800 text-left">{c.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-left">
                      <span className="flex items-center gap-2">
                        {getCustomerTypeIcon(c.type)} {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-left font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-left">{c.phone || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-left">{c.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-center">{c.orderHistory || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">{formatETB(c.avgSpend)}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-left">{c.paymentPref || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-left">{c.assignedRep || 'N/A'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          onClick={() => openEditModal(c)}
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          className="text-blue-600 hover:bg-blue-100"
                          iconOnly
                          aria-label="Edit customer"
                        />
                        <Button
                          onClick={() => handleDelete(c.id)}
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          className="text-red-600 hover:bg-red-100"
                          iconOnly
                          aria-label="Delete customer"
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

      {/* Add Customer Modal */}
      <ModalWithForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCustomer}
        title="Add New Customer"
        fields={customerFields}
      />

      {/* Edit Customer Modal */}
      {currentCustomer && (
        <ModalWithForm
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditCustomer}
          title={`Edit Customer: ${currentCustomer.name}`}
          fields={customerFields.map(field => ({
            ...field,
            defaultValue: currentCustomer[field.name] // Pass current customer data for editing
          }))}
          formData={currentCustomer} // Pass initial form data
        />
      )}
    </div>
  );
};

export default Customers;