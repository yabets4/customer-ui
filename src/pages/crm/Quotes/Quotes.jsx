// src/pages/crm/Quotes.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button'; // Assuming your Button component
import ModalWithForm from '../../../components/ui/modal'; // Assuming your ModalWithForm component
import {
  FileText, // Main quotes page icon
  Plus, // Add Quote button
  Edit, // Edit action
  Trash2, // Delete action
  Search, // Search input icon (if we add search later)
  User, // Customer icon
  ClipboardCheck, // Status icon
  Package, // Products icon
  Tag, // Discount icon
  Percent, // Tax icon
  Handshake, // Payment Terms icon
  Truck, // Delivery Terms icon
  DollarSign, // Internal Margin icon
  Calendar, // Expiration Date icon
  Hash, // Version icon
  MinusCircle, // Remove product icon
} from 'lucide-react';

// --- Reusable InputField component ---
const InputField = ({ label, name, value, onChange, type = "text", required, placeholder, icon: Icon, className = "", disabled = false }) => (
  <div className="relative">
    <label htmlFor={name} className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition duration-200 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
  </div>
);

// --- Reusable SelectField component ---
const SelectField = ({ label, name, value, onChange, options, required, placeholder, icon: Icon, className = "", disabled = false }) => (
  <div className="relative">
    <label htmlFor={name} className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10
          transition duration-200 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
      >
        <option value="">{placeholder || `Select ${label.toLowerCase()}...`}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.464 7.293 5.05 8.707 9.293 12.95z"/></svg>
      </div>
    </div>
  </div>
);

const initialQuotes = [
  {
    id: 'Q-001',
    customer: 'John Doe',
    status: 'Draft',
    products: [{ name: 'L-shaped Sofa', quantity: 1, price: 50000 }],
    discount: '10%',
    tax: '15%',
    paymentTerms: '50% Upfront, 50% on Delivery',
    deliveryTerms: '2 weeks, Addis Ababa',
    attachments: [],
    internalMargin: '20%',
    expirationDate: '2025-08-01',
    version: 1
  },
  {
    id: 'Q-002',
    customer: 'ABC Furniture PLC',
    status: 'Approved',
    products: [{ name: 'Custom Office Table', quantity: 5, price: 15000 }, { name: 'Ergonomic Chair', quantity: 10, price: 5000 }],
    discount: '5%',
    tax: '15%',
    paymentTerms: 'Net 30',
    deliveryTerms: 'Ex-Works',
    attachments: [],
    internalMargin: '10%',
    expirationDate: '2025-09-15',
    version: 2
  },
  {
    id: 'Q-003',
    customer: 'Liya Kebede',
    status: 'Rejected',
    products: [{ name: 'Accent Chair', quantity: 2, price: 8000 }],
    discount: '0%',
    tax: '15%',
    paymentTerms: 'Due on Receipt',
    deliveryTerms: '1 week, Home Delivery',
    attachments: [],
    internalMargin: '25%',
    expirationDate: '2025-07-05',
    version: 1
  }
];

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null); // For editing

  const paymentTermsOptions = ["Net 30", "Net 60", "Due on Receipt", "50% Upfront, 50% on Delivery"];
  const deliveryTermsOptions = ["Ex-Works", "FOB", "CIF", "DDP", "Home Delivery"];
  const quoteStatuses = ["Draft", "Sent", "Approved", "Rejected", "Expired", "Revised"];


  useEffect(() => {
    setQuotes(initialQuotes);
  }, []);

  const handleAddEditQuote = (formData) => {
    // Convert products array of objects to expected format by modal, if coming from there
    const productsForSave = formData.products.map(p => ({
      name: p.name,
      quantity: parseFloat(p.quantity) || 0,
      price: parseFloat(p.price) || 0
    }));

    if (currentQuote) {
      // Edit existing quote
      setQuotes(quotes.map(q =>
        q.id === formData.id ? { ...formData, products: productsForSave } : q
      ));
    } else {
      // Add new quote
      const newId = `Q-${(quotes.length + 1).toString().padStart(3, '0')}`;
      setQuotes([...quotes, { ...formData, id: newId, products: productsForSave, attachments: [] }]);
    }
    setShowAddEditModal(false);
    setCurrentQuote(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      setQuotes(quotes.filter((q) => q.id !== id));
    }
  };

  const openAddModal = () => {
    setCurrentQuote(null); // Clear any existing quote data
    setShowAddEditModal(true);
  };

  const openEditModal = (quote) => {
    // Map products array for the modal form if it's structured differently
    const quoteForEdit = {
      ...quote,
      products: quote.products.map(p => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price
      }))
    };
    setCurrentQuote(quoteForEdit);
    setShowAddEditModal(true);
  };

  // Define form fields for the ModalWithForm
  const quoteFormFields = [
    {
      label: 'Customer Name',
      name: 'customer',
      type: 'text',
      required: true,
      placeholder: 'e.g., John Doe / ABC Furniture PLC',
      icon: User
    },
    {
      label: 'Discount (%)',
      name: 'discount',
      type: 'text', // Can accept "10%" or "1000 ETB"
      placeholder: 'e.g., 10% or 500 ETB',
      icon: Tag
    },
    {
      label: 'Tax Rate',
      name: 'tax',
      type: 'text',
      icon: Percent,
      disabled: true,
      defaultValue: '15%' // Fixed tax rate
    },
    {
      label: 'Expiration Date',
      name: 'expirationDate',
      type: 'date',
      required: true,
      icon: Calendar
    },
    {
      label: 'Internal Margin (%)',
      name: 'internalMargin',
      type: 'number',
      placeholder: 'e.g., 20',
      icon: DollarSign
    },
    {
      label: 'Quote Version',
      name: 'version',
      type: 'number',
      icon: Hash,
      disabled: true, // Version is often auto-managed
    },
    {
      label: 'Payment Terms',
      name: 'paymentTerms',
      type: 'select',
      options: paymentTermsOptions,
      placeholder: 'Select payment terms',
      icon: Handshake,
      required: true
    },
    {
      label: 'Delivery Terms',
      name: 'deliveryTerms',
      type: 'select',
      options: deliveryTermsOptions,
      placeholder: 'Select delivery terms',
      icon: Truck,
      required: true
    },
    {
      label: 'Status',
      name: 'status',
      type: 'select',
      options: quoteStatuses,
      placeholder: 'Set current status',
      icon: ClipboardCheck,
      required: true
    },
    // Dynamic Product Fields - special handling for ModalWithForm
    // ModalWithForm needs to be extended to handle array of objects
    // For simplicity for now, we'll pass an initial `products` array and handle it in the modal's internal state.
    // Or, if ModalWithForm supports a 'nestedArray' type, we can use that.
    // Given the current ModalWithForm, we'll pass the `products` data directly as `formData` to the modal and
    // let the modal manage the dynamic product fields.
    // This means ModalWithForm needs an enhancement to handle this structure.
    // I'll assume ModalWithForm can render a custom section for products if `formData.products` exists.
  ];

  // Helper to get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sent':
        return 'bg-blue-100 text-blue-800';
      case 'Revised':
        return 'bg-purple-100 text-purple-800';
      case 'Draft':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-600" />
          Quote Management
        </h1>
        <Button
          onClick={openAddModal}
          variant="primary"
          size="md"
          icon={Plus}
        >
          Create New Quote
        </Button>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {/* Corrected first column header: No unnecessary flex, just text */}
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  Quote ID
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> Customer</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">
                  <span className="flex items-center justify-center gap-2"><ClipboardCheck className="w-4 h-4" /> Status</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Products</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                  <span className="flex items-center justify-end gap-2"><Tag className="w-4 h-4" /> Discount</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                  <span className="flex items-center justify-end gap-2"><Percent className="w-4 h-4" /> Tax</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><Handshake className="w-4 h-4" /> Payment</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Delivery</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                  <span className="flex items-center justify-end gap-2"><DollarSign className="w-4 h-4" /> Margin</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Expires</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-8 text-gray-500 text-lg">
                    No quotes found. Click "Create New Quote" to add one.
                  </td>
                </tr>
              ) : (
                quotes.map((quote, index) => (
                  <tr key={quote.id} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="px-4 py-3 text-sm text-gray-800 font-semibold">{quote.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{quote.customer}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {quote.products && quote.products.length > 0
                        ? quote.products.map(p => `${p.name} (x${p.quantity})`).join(', ')
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-right">{quote.discount || '0%'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-right">{quote.tax || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{quote.paymentTerms || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{quote.deliveryTerms || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 text-right">{quote.internalMargin || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{quote.expirationDate || 'N/A'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          onClick={() => openEditModal(quote)}
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          className="text-blue-600 hover:bg-blue-100"
                          iconOnly
                          aria-label="Edit quote"
                        />
                        <Button
                          onClick={() => handleDelete(quote.id)}
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          className="text-red-600 hover:bg-red-100"
                          iconOnly
                          aria-label="Delete quote"
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

      {/* Add/Edit Quote Modal */}
      {showAddEditModal && (
        <ModalWithForm
          isOpen={showAddEditModal}
          onClose={() => setShowAddEditModal(false)}
          onSubmit={handleAddEditQuote}
          title={currentQuote ? `Edit Quote: ${currentQuote.id}` : "Create New Quote"}
          fields={quoteFormFields}
          formData={currentQuote} // Pass current quote data for editing, or null for adding
          // Custom render for products within the modal form. This assumes ModalWithForm supports a 'renderCustomField' or similar prop
          // where 'products' can be rendered dynamically. If not, ModalWithForm needs to be extended.
          // For now, I'll pass it as a special prop and assume ModalWithForm can handle it.
          // In a real scenario, you'd likely map products to simple text fields for the modal
          // or create a dedicated 'ProductListField' component for ModalWithForm.
          renderCustomFields={(data, handleCustomChange) => (
            <div className="col-span-full space-y-4 pt-4 border-t border-gray-200 mt-6">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2"><Package className="w-5 h-5 text-blue-600" /> Products</h4>
                {data.products.map((product, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 items-center">
                        <InputField
                            label={`Product ${index + 1} Name`}
                            value={product.name}
                            onChange={(e) => {
                                const updatedProducts = [...data.products];
                                updatedProducts[index] = { ...updatedProducts[index], name: e.target.value };
                                handleCustomChange({ target: { name: 'products', value: updatedProducts } });
                            }}
                            placeholder="Product Name"
                            required
                            icon={Package}
                        />
                        <InputField
                            label="Qty"
                            type="number"
                            value={product.quantity}
                            onChange={(e) => {
                                const updatedProducts = [...data.products];
                                updatedProducts[index] = { ...updatedProducts[index], quantity: parseFloat(e.target.value) || 0 };
                                handleCustomChange({ target: { name: 'products', value: updatedProducts } });
                            }}
                            placeholder="1"
                            min="1"
                            icon={Hash}
                        />
                        <InputField
                            label="Price"
                            type="number"
                            value={product.price}
                            onChange={(e) => {
                                const updatedProducts = [...data.products];
                                updatedProducts[index] = { ...updatedProducts[index], price: parseFloat(e.target.value) || 0 };
                                handleCustomChange({ target: { name: 'products', value: updatedProducts } });
                            }}
                            placeholder="0.00"
                            min="0"
                            icon={DollarSign}
                        />
                        <div className="md:col-span-3 flex justify-end">
                            {data.products.length > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const updatedProducts = data.products.filter((_, i) => i !== index);
                                        handleCustomChange({ target: { name: 'products', value: updatedProducts } });
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    icon={MinusCircle}
                                    className="text-red-600 hover:bg-red-100"
                                    aria-label="Remove product"
                                >
                                    Remove Product
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="flex justify-start">
                    <Button
                        type="button"
                        onClick={() => {
                            const updatedProducts = [...data.products, { name: '', quantity: 1, price: 0 }];
                            handleCustomChange({ target: { name: 'products', value: updatedProducts } });
                        }}
                        variant="secondary"
                        size="sm"
                        icon={Plus}
                    >
                        Add Another Product
                    </Button>
                </div>
            </div>
        )}
        />
      )}
    </div>
  );
};

export default Quotes;