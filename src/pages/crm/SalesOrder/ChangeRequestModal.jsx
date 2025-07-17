import React, { useState } from 'react';
import Button from '../../../components/ui/Button'; // Assuming you have a reusable Button component
import {
  X,            // Close icon
  RefreshCcw,   // Main modal icon for change request
  Tag,          // Type icon
  FileText,     // Description icon
  DollarSign,   // Impact icon (for price/cost)
  Clock,        // Impact icon (for time)
  Paperclip,    // Attachment icon
  UploadCloud,  // Upload area icon
  Check,        // Success icon for file upload
} from 'lucide-react';

export default function ChangeRequestModal({ onClose, onSubmit }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState(''); // Text for combined price/time impact
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!type) newErrors.type = 'Change type is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const requestData = {
      type,
      description,
      impact: impact.trim() || 'Not specified', // Default value if empty
      // In a real application, you would handle file uploads separately
      // and pass a file URL or ID, not the File object directly.
      fileName: file ? file.name : 'No file attached',
      date: new Date().toISOString().split('T')[0], // Current date
      status: 'Pending Approval' // Initial status
    };

    onSubmit(requestData);
    setIsSubmitting(false);
    onClose(); // Close modal after successful submission
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 transform scale-95 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <RefreshCcw className="w-6 h-6 text-indigo-600" />
            Submit Change Request
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={X}
            className="text-gray-500 hover:text-red-600"
            iconOnly
            aria-label="Close modal"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Change Type */}
          <div>
            <label htmlFor="change-type" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500" /> Change Type <span className="text-red-500">*</span>
            </label>
            <select
              id="change-type"
              className={`w-full px-4 py-2.5 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out
                ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setErrors(prev => ({ ...prev, type: '' })); // Clear error on change
              }}
              aria-invalid={!!errors.type}
              aria-describedby={errors.type ? "type-error" : undefined}
            >
              <option value="">Select a change type</option>
              <option value="Dimensions">Dimensions</option>
              <option value="Material">Material</option>
              <option value="Color">Color</option>
              <option value="Design">Design</option>
              <option value="Quantity">Quantity</option>
              <option value="Other">Other</option>
            </select>
            {errors.type && <p id="type-error" className="mt-1 text-sm text-red-600">{errors.type}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" /> Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows="4"
              className={`w-full px-4 py-2.5 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out
                ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Clearly explain the requested change, including affected items, new specifications, etc."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors(prev => ({ ...prev, description: '' })); // Clear error on change
              }}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && <p id="description-error" className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Estimated Impact */}
          <div>
            <label htmlFor="impact" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" /> Estimated Impact (e.g., "+2 days, +500 ETB")
            </label>
            <input
              id="impact"
              type="text"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              placeholder="Optional: Provide an estimate of time/cost impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            />
          </div>

          {/* File Attachment */}
          <div>
            <label htmlFor="file-upload" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-gray-500" /> Attach Supporting File (Optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  {file ? (
                    <>
                      <Check className="w-6 h-6 mb-1 text-green-500" />
                      <p className="text-sm text-green-700 font-semibold truncate max-w-[calc(100%-20px)]">{file.name}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-7 h-7 mb-2 text-gray-400" />
                      <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="md"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={RefreshCcw}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}