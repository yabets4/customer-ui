import React, { useState } from 'react';
import Button from '../../../components/ui/Button'; // Assuming Button component is in the same directory or accessible
import {
  FileText, // Main quote icon
  User, // Customer
  Package, // Products
  Tag, // Discount
  Percent, // Tax
  Handshake, // Payment Terms
  Truck, // Delivery Terms
  Calendar, // Expiration Date
  DollarSign, // Internal Margin
  Paperclip, // Attachments
  Plus, // Add Product / Create Quote
  MinusCircle, // Remove Product
  Hash, // Version
  ClipboardCheck, // Status
  UploadCloud // Attachment upload area
} from 'lucide-react';

// Reusable InputField component (assuming these are not globally available/shared)
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

// Reusable SelectField component
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


const CreateQuote = () => {
  const [form, setForm] = useState({
    customer: '',
    products: [{ name: '', quantity: 1, price: 0 }], // Added quantity and price for products
    discount: '', // Can be percentage or fixed amount later
    tax: '15%', // Default, can be selectable or fixed
    paymentTerms: '',
    deliveryTerms: '',
    attachments: [],
    internalMargin: '',
    expirationDate: '',
    version: 1,
    status: 'Draft'
  });

  const paymentTermsOptions = ["Net 30", "Net 60", "Due on Receipt", "50% Upfront, 50% on Delivery"];
  const deliveryTermsOptions = ["Ex-Works", "FOB", "CIF", "DDP"];
  const quoteStatuses = ["Draft", "Sent", "Accepted", "Rejected", "Revised"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle changes for product fields (name, quantity, price)
  const handleProductItemChange = (index, field, value) => {
    const updatedProducts = [...form.products];
    if (field === 'quantity' || field === 'price') {
      updatedProducts[index][field] = parseFloat(value) || 0; // Ensure numbers
    } else {
      updatedProducts[index][field] = value;
    }
    setForm({ ...form, products: updatedProducts });
  };

  const addProductField = () => {
    setForm({ ...form, products: [...form.products, { name: '', quantity: 1, price: 0 }] });
  };

  const removeProductField = (index) => {
    const updatedProducts = form.products.filter((_, i) => i !== index);
    setForm({ ...form, products: updatedProducts });
  };

  const handleFileUpload = (e) => {
    setForm({ ...form, attachments: Array.from(e.target.files) });
  };

  const removeAttachment = (index) => {
    const updatedAttachments = form.attachments.filter((_, i) => i !== index);
    setForm({ ...form, attachments: updatedAttachments });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.customer || form.products.some(p => !p.name)) {
      alert('Please fill in customer name and all product names.');
      return;
    }
    console.log('Quote submitted:', form);
    // Add logic to send data to backend or state management
    alert('Quote created successfully! Check console for data.');
    // Optionally reset form
    setForm({
      customer: '',
      products: [{ name: '', quantity: 1, price: 0 }],
      discount: '',
      tax: '15%',
      paymentTerms: '',
      deliveryTerms: '',
      attachments: [],
      internalMargin: '',
      expirationDate: '',
      version: 1,
      status: 'Draft'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
        <FileText className="w-8 h-8 text-indigo-600" />
        Create New Quote
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">

        {/* Section: Quote Details */}
        <div className="space-y-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-green-600" /> Quote Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField
              label="Customer Name"
              name="customer"
              value={form.customer}
              onChange={handleChange}
              required
              placeholder="e.g., John Doe / ABC Furniture PLC"
              icon={User}
            />
            <InputField
              label="Discount (%)"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              placeholder="e.g., 10 or 5%"
              icon={Tag}
            />
            <InputField
              label="Tax Rate"
              name="tax"
              value={form.tax}
              onChange={handleChange}
              icon={Percent}
              disabled // Assuming tax is fixed for now
              className="bg-gray-100 text-gray-600"
            />
            <InputField
              label="Expiration Date"
              name="expirationDate"
              value={form.expirationDate}
              onChange={handleChange}
              type="date"
              required
              icon={Calendar}
            />
            <InputField
              label="Internal Margin (%)"
              name="internalMargin"
              value={form.internalMargin}
              onChange={handleChange}
              placeholder="For internal use (e.g., 20)"
              icon={DollarSign}
              type="number"
            />
            <InputField
              label="Quote Version"
              name="version"
              value={form.version}
              onChange={handleChange}
              icon={Hash}
              type="number"
              min="1"
              disabled // Version is often auto-managed
              className="bg-gray-100 text-gray-600"
            />
            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={quoteStatuses}
              icon={ClipboardCheck}
              className="lg:col-span-1"
            />
          </div>
        </div>

        {/* Section: Product & Service Items */}
        <div className="space-y-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" /> Product & Service Items
          </h3>
          {form.products.map((product, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <InputField
                label={`Product/Service ${index + 1}`}
                value={product.name}
                onChange={(e) => handleProductItemChange(index, 'name', e.target.value)}
                placeholder="e.g., L-shaped Sofa, Office Desk"
                required
                className="md:col-span-2"
                icon={Package}
              />
              <InputField
                label="Quantity"
                type="number"
                value={product.quantity}
                onChange={(e) => handleProductItemChange(index, 'quantity', e.target.value)}
                placeholder="1"
                min="1"
                icon={Hash}
              />
              <InputField
                label="Unit Price"
                type="number"
                value={product.price}
                onChange={(e) => handleProductItemChange(index, 'price', e.target.value)}
                placeholder="0.00"
                min="0"
                icon={DollarSign}
              />
              {form.products.length > 1 && (
                <div className="md:col-span-4 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => removeProductField(index)}
                    variant="ghost"
                    size="sm"
                    icon={MinusCircle}
                    className="text-red-600 hover:bg-red-100"
                    aria-label="Remove product"
                  >
                    Remove Product
                  </Button>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-start pt-2">
            <Button
              type="button"
              onClick={addProductField}
              variant="secondary"
              size="sm"
              icon={Plus}
            >
              Add Another Product
            </Button>
          </div>
        </div>

        {/* Section: Terms & Attachments */}
        <div className="space-y-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-purple-600" /> Terms & Attachments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectField
              label="Payment Terms"
              name="paymentTerms"
              value={form.paymentTerms}
              onChange={handleChange}
              options={paymentTermsOptions}
              placeholder="Select payment terms"
              icon={Handshake}
              required
            />
            <SelectField
              label="Delivery Terms"
              name="deliveryTerms"
              value={form.deliveryTerms}
              onChange={handleChange}
              options={deliveryTermsOptions}
              placeholder="Select delivery terms"
              icon={Truck}
              required
            />
            {/* Attachments Upload */}
            <div className="md:col-span-2">
              <label htmlFor="attachments" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-500" /> Attachments (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="attachments"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOCX, JPG (MAX. 10MB per file)</p>
                  </div>
                  <input
                    id="attachments"
                    name="attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {form.attachments.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  <p className="font-semibold mb-1">Selected Files:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {form.attachments.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="truncate">{file.name}</span>
                        <Button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          variant="ghost"
                          size="sm"
                          icon={MinusCircle}
                          className="text-red-500 hover:bg-red-100 ml-2"
                          iconOnly
                          aria-label={`Remove ${file.name}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Submission Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Plus}
          >
            Create Quote
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuote;