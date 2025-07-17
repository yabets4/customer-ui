import React, { useState } from 'react';
import Button from '../../../components/ui/Button'; // Assuming your Button component is here
import {
  ShoppingCart, // Main page icon
  User,         // Customer
  Calendar,
      // Order Date
  MapPin,       // Delivery Address
  UserCog,      // Project Manager
  Package,      // Order Items
  Plus,         // Add Item, Add Order
  MinusCircle,  // Remove Item
  Receipt,      // Deposit
  Paperclip,    // Attachments
  UploadCloud,  // File Upload area
  ClipboardList,// Special Instructions
  Save,         // Save Draft
  CheckCircle,  // Confirm Order
  DollarSign,   // Price/Total
  Hash,         // Quantity
  X,            // For removing attachments
  Percent       // For Deposit (%)
} from 'lucide-react';

// Reusable InputField component (assuming these are not globally available/shared)
const InputField = ({ label, name, value, onChange, type = "text", required, placeholder, icon: Icon, className = "", disabled = false, min, step }) => (
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
      min={min}
      step={step}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition duration-200 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
  </div>
);

// Reusable TextAreaField component
const TextAreaField = ({ label, name, value, onChange, required, placeholder, rows = 3, icon: Icon, className = "" }) => (
  <div className="relative">
    <label htmlFor={name} className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-blue-500" />}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition duration-200 ease-in-out ${className}`}
    ></textarea>
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


export default function CreateSalesOrder() {
  const [formData, setFormData] = useState({
    customer: '',
    orderDate: new Date().toISOString().split('T')[0], // Default to today's date
    deliveryAddress: '',
    projectManager: '',
    orderItems: [{ item: '', qty: 1, price: 0 }],
    deposit: '',
    attachments: [],
    specialInstructions: '',
  });

  const customers = ['Select Customer', 'John Doe', 'Acme Corp', 'Green Solutions Ltd.', 'Innovative Designs'];
  const projectManagers = ['Assign PM', 'Bereket Lemma', 'Sara Mengistu', 'Daniel Gebru'];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      orderItems: [...prevData.orderItems, { item: '', qty: 1, price: 0 }],
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.orderItems];
    newItems[index][field] = value;
    setFormData((prevData) => ({ ...prevData, orderItems: newItems }));
  };

  const removeItem = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      orderItems: prevData.orderItems.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFileUpload = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      attachments: [...prevData.attachments, ...Array.from(e.target.files)],
    }));
  };

  const removeAttachment = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      attachments: prevData.attachments.filter((_, index) => index !== indexToRemove),
    }));
  };

  const calculateTotal = () => {
    return formData.orderItems.reduce((acc, item) => acc + (parseFloat(item.qty) || 0) * (parseFloat(item.price) || 0), 0);
  };

  const handleSubmit = (e, status) => {
    e.preventDefault();

    // Basic validation
    if (!formData.customer || formData.customer === 'Select Customer') {
      alert('Please select a customer.');
      return;
    }
    if (formData.orderItems.some(item => !item.item || parseFloat(item.qty) <= 0 || parseFloat(item.price) < 0)) {
        alert('Please ensure all order items have a name, a quantity greater than 0, and a non-negative price.');
        return;
    }


    const salesOrder = {
      ...formData,
      totalAmount: calculateTotal(),
      status: status, // 'Draft' or 'Confirmed'
      createdAt: new Date().toISOString(),
    };
    console.log('Sales Order Submitted:', salesOrder);
    alert(`Sales Order ${status} successfully! Check console for data.`);

    // Optionally reset form after submission
    setFormData({
      customer: '',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryAddress: '',
      projectManager: '',
      orderItems: [{ item: '', qty: 1, price: 0 }],
      deposit: '',
      attachments: [],
      specialInstructions: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-indigo-600" />
        Create Sales Order
      </h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Customer & Order Details Section */}
        <div className="space-y-5 p-6 rounded-xl shadow-lg border border-gray-100 bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-purple-600" /> Customer & Order Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectField
              label="Customer"
              name="customer"
              value={formData.customer}
              onChange={handleFormChange}
              options={customers}
              required
              icon={User}
              placeholder="Select Customer"
            />
            <InputField
              label="Order Date"
              name="orderDate"
              type="date"
              value={formData.orderDate}
              onChange={handleFormChange}
              required
              icon={Calendar}
            />
            <TextAreaField
              label="Delivery Address"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleFormChange}
              placeholder="Enter full delivery address"
              rows={2}
              icon={MapPin}
              className="md:col-span-2"
            />
            <SelectField
              label="Project Manager"
              name="projectManager"
              value={formData.projectManager}
              onChange={handleFormChange}
              options={projectManagers}
              icon={UserCog}
              placeholder="Assign Project Manager"
            />
          </div>
        </div>

        {/* Order Items Section */}
        <div className="space-y-5 p-6 rounded-xl shadow-lg border border-gray-100 bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" /> Order Items
          </h3>
          {formData.orderItems.map((item, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-6 gap-3 sm:gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
              <InputField
                label="Item Name"
                name={`item-${i}`} // Unique name for each input
                type="text"
                value={item.item}
                onChange={(e) => updateItem(i, 'item', e.target.value)}
                placeholder="e.g., L-shaped Sofa"
                required
                className="col-span-full sm:col-span-2"
                icon={Package}
              />
              <InputField
                label="Qty"
                name={`qty-${i}`}
                type="number"
                value={item.qty}
                onChange={(e) => updateItem(i, 'qty', parseInt(e.target.value) || 0)}
                placeholder="1"
                min="1"
                required
                className="col-span-3 sm:col-span-1"
                icon={Hash}
              />
              <InputField
                label="Unit Price"
                name={`price-${i}`}
                type="number"
                value={item.price}
                onChange={(e) => updateItem(i, 'price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="col-span-3 sm:col-span-1"
                icon={DollarSign}
              />
              <div className="col-span-full sm:col-span-1 text-lg font-medium text-gray-900 flex justify-between sm:justify-end items-center sm:ml-auto">
                <span>Total:</span> {(item.qty * item.price).toFixed(2)} ETB
              </div>
              <div className="col-span-full sm:col-span-1 flex justify-end">
                {formData.orderItems.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeItem(i)}
                    variant="ghost"
                    size="sm"
                    icon={MinusCircle}
                    className="text-red-600 hover:bg-red-100"
                    iconOnly
                    aria-label="Remove item"
                  />
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-start pt-2">
            <Button
              type="button"
              onClick={addItem}
              variant="secondary"
              size="sm"
              icon={Plus}
            >
              Add Another Item
            </Button>
          </div>
          <div className="text-right text-2xl font-bold text-indigo-700 pt-4 border-t border-gray-200 mt-6">
            Grand Total: {calculateTotal().toFixed(2)} ETB
          </div>
        </div>

        {/* Payment & Attachments Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-xl shadow-lg border border-gray-100 bg-white">
          <h3 className="md:col-span-2 text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-600" /> Payment & Attachments
          </h3>
          <InputField
            label="Deposit (%)"
            name="deposit"
            type="number"
            value={formData.deposit}
            onChange={handleFormChange}
            placeholder="e.g., 50 (for 50%)"
            min="0"
            max="100"
            icon={Percent}
          />
          {/* Attachments Upload */}
          <div>
            <label htmlFor="attachments" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-blue-500" /> Attach Design / Contract (Optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="attachments"
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <UploadCloud className="w-7 h-7 mb-2 text-gray-400" />
                  <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (MAX. 10MB per file)</p>
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
            {formData.attachments.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <p className="font-semibold mb-1">Selected Files:</p>
                <ul className="list-disc list-inside space-y-1">
                  {formData.attachments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="truncate">{file.name}</span>
                      <Button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        variant="ghost"
                        size="sm"
                        icon={X}
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

        {/* Notes Section */}
        <div className="space-y-5 p-6 rounded-xl shadow-lg border border-gray-100 bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-orange-600" /> Special Instructions & Notes
          </h3>
          <TextAreaField
            label="Special Instructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleFormChange}
            placeholder="Any specific notes or requirements for this order..."
            rows={4}
            icon={ClipboardList}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'Draft')}
            variant="secondary"
            size="lg"
            icon={Save}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e, 'Confirmed')}
            variant="primary"
            size="lg"
            icon={CheckCircle}
          >
            Confirm Order
          </Button>
        </div>
      </form>
    </div>
  );
}