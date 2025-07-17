import React, { useState } from 'react';
import Button from '../../../components/ui/Button'; // Assuming your Button component is here
import {
  X,            // Close icon
  Settings,     // Change Type icon
  FileText,     // Description icon
  Activity,     // Estimated Impact icon
  Paperclip,    // Attachments icon
  UploadCloud,  // Upload area icon
  Send,         // Submit Request icon
  MinusCircle   // Remove attachment icon
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


export default function ChangeRequestModal({ onClose, onSubmit }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState('');
  const [attachments, setAttachments] = useState([]);

  const changeTypes = ["Dimensions", "Material", "Color", "Design", "Functionality", "Quantity", "Other"];

  const handleFileUpload = (e) => {
    // Add new files to the existing attachments array
    setAttachments((prevAttachments) => [...prevAttachments, ...Array.from(e.target.files)]);
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!type || !description || !impact) {
      alert('Please fill in all required fields (Change Type, Description, Estimated Impact).');
      return;
    }

    const changeRequestData = {
      type,
      description,
      impact,
      attachments,
      timestamp: new Date().toISOString(), // Add a timestamp
    };

    onSubmit(changeRequestData); // Pass data to the parent component
    onClose(); // Close the modal
    // Optionally reset form fields here if you want
    setType('');
    setDescription('');
    setImpact('');
    setAttachments([]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 transform animate-slide-up-modal">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-600" />
            Submit Change Request
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={X}
            className="text-gray-500 hover:text-red-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            iconOnly
            aria-label="Close modal"
          />
        </div>

        {/* Change Request Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Change Type */}
          <SelectField
            label="Change Type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={changeTypes}
            placeholder="Select type of change"
            required
            icon={Settings}
          />

          {/* Description */}
          <TextAreaField
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed explanation of the requested change..."
            rows={4}
            required
            icon={FileText}
          />

          {/* Estimated Impact */}
          <InputField
            label="Estimated Impact"
            name="impact"
            value={impact}
            onChange={(e) => setImpact(e.target.value)}
            placeholder="e.g., +2 days lead time, +500 ETB cost, Material change"
            required
            icon={Activity}
          />

          {/* Attachments */}
          <div>
            <label htmlFor="attachments" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-blue-500" /> Attach Supporting Files (Optional)
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
            {attachments.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <p className="font-semibold mb-1">Selected Files:</p>
                <ul className="list-disc list-inside space-y-1">
                  {attachments.map((file, index) => (
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="md"
              icon={X}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}