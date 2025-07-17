import React, { useState } from "react";
import {
  User, Phone, Mail, Building2, MapPin, UploadCloud, FileText, Tag,
  Briefcase, MessageSquare, List, Percent, Hash, PlusCircle, // Added for clarity
  Users, // For assignedTo
  Megaphone, // For leadSource
  Star, // For score
  CheckCircle, // For status
  Paperclip, // For attachments
} from "lucide-react";
import Button from "../../../components/ui/Button"; // Assuming you have a styled Button component

// Re-importing these if they were meant to be used from shared constants
const leadSources = [
  "Walk-in", "Website", "Referral", "Instagram DM", "Sales Rep", "Phone Inquiry"
];
const statuses = [
  "New", "Contacted", "Qualified", "Disqualified", "Follow-up Needed"
];
const services = [
  "L-shaped Sofa", "Custom Table", "Office Fit-Out", "Residential Project",
  "Commercial Seating", "Custom Cabinetry", "Furniture Repair"
];
const salesReps = [
  "Amanuel - Sales", "Liya - Designer", "Ben - Field Rep", "Tigist - Sales Support"
];

// --- Reusable InputField component ---
// Ensure this component is correctly defined outside the main component, or inside but without conflicts.
// The issue was likely a phantom character or an internal parser state. Re-writing helps.
const InputField = ({ label, name, value, onChange, type = "text", required, placeholder, icon: Icon, className = "" }) => (
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
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition duration-200 ease-in-out ${className}`}
    />
  </div>
);

// --- Reusable SelectField component ---
const SelectField = ({ label, name, value, onChange, options, required, placeholder, icon: Icon, className = "" }) => (
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
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10
          transition duration-200 ease-in-out ${className}`}
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

// --- Reusable TextAreaField component ---
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
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800 transition duration-200 ease-in-out ${className}`}
    ></textarea>
  </div>
);


export default function ManualLeadForm({ onSubmit }) {
  const [lead, setLead] = useState({
    firstName: "", lastName: "", company: "",
    phonePrimary: "", phoneSecondary: "", email: "", address: "",
    assignedTo: "", leadSource: "", referredBy: "",
    status: "New", score: 50,
    inquiry: "", serviceRequested: "", attachments: []
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachments") {
      setLead((prev) => ({ ...prev, attachments: Array.from(files) }));
    } else if (name === "score") {
      setLead((prev) => ({ ...prev, [name]: parseInt(value, 10) })); // Parse score to integer
    }
    else {
      setLead((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation example
    if (!lead.firstName || !lead.lastName || !lead.phonePrimary || !lead.assignedTo || !lead.leadSource) {
        alert("Please fill in all required fields (First Name, Last Name, Primary Phone, Assigned To, Lead Source).");
        return;
    }
    onSubmit?.(lead);
    // Optionally reset form after submission
    setLead({
      firstName: "", lastName: "", company: "",
      phonePrimary: "", phoneSecondary: "", email: "", address: "",
      assignedTo: "", leadSource: "", referredBy: "",
      status: "New", score: 50,
      inquiry: "", serviceRequested: "", attachments: []
    });
  };

  return (
    <form className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <PlusCircle className="w-8 h-8 text-green-600" />
        New Manual Lead Entry
      </h2>

      {/* Section: Contact Information */}
      <div className="space-y-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="First Name"
            name="firstName"
            value={lead.firstName}
            onChange={handleChange}
            required
            placeholder="e.g., John"
            icon={User}
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={lead.lastName}
            onChange={handleChange}
            required
            placeholder="e.g., Doe"
            icon={User}
          />
          <InputField
            label="Primary Phone"
            name="phonePrimary"
            value={lead.phonePrimary}
            onChange={handleChange}
            required
            placeholder="e.g., +251912345678"
            icon={Phone}
            type="tel"
          />
          <InputField
            label="Secondary Phone (Optional)"
            name="phoneSecondary"
            value={lead.phoneSecondary}
            onChange={handleChange}
            placeholder="e.g., +2517xxxxxxx"
            icon={Phone}
            type="tel"
          />
          <InputField
            label="Email (Optional)"
            name="email"
            value={lead.email}
            onChange={handleChange}
            placeholder="e.g., john.doe@example.com"
            icon={Mail}
            type="email"
          />
          <InputField
            label="Company Name (Optional)"
            name="company"
            value={lead.company}
            onChange={handleChange}
            placeholder="e.g., ABC Interiors PLC"
            icon={Building2}
          />
          <InputField
            label="Address (Optional)"
            name="address"
            value={lead.address}
            onChange={handleChange}
            placeholder="e.g., Bole Rd, Addis Ababa"
            icon={MapPin}
            className="md:col-span-2" // Make address full width on medium screens
          />
        </div>
      </div>

      {/* Section: Lead Details */}
      <div className="space-y-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-purple-600" /> Lead Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            label="Assigned To"
            name="assignedTo"
            value={lead.assignedTo}
            onChange={handleChange}
            options={salesReps}
            required
            placeholder="Select a sales representative"
            icon={Users}
          />
          <SelectField
            label="Lead Source"
            name="leadSource"
            value={lead.leadSource}
            onChange={handleChange}
            options={leadSources}
            required
            placeholder="How did they find us?"
            icon={Megaphone}
          />
          <InputField
            label="Referred By (Optional)"
            name="referredBy"
            value={lead.referredBy}
            onChange={handleChange}
            placeholder="Name of referrer"
            icon={User}
          />
          <SelectField
            label="Status"
            name="status"
            value={lead.status}
            onChange={handleChange}
            options={statuses}
            placeholder="Set current status"
            icon={CheckCircle}
          />
          {/* Lead Score Slider */}
          <div className="relative md:col-span-2">
            <label htmlFor="score" className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-500" /> Lead Score: <span className="font-bold text-lg text-blue-700">{lead.score}</span>
            </label>
            <input
              type="range"
              id="score"
              name="score"
              min="0"
              max="100"
              value={lead.score}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb-blue"
              style={{
                '--webkit-slider-thumb-bg': '#3B82F6',
                '--moz-range-thumb-bg': '#3B82F6',
                '--ms-thumb-bg': '#3B82F6',
              }}
            />
          </div>
        </div>
      </div>

      {/* Section: Inquiry Details */}
      <div className="space-y-5 p-5 border border-gray-200 rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-600" /> Inquiry Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            label="Service Requested"
            name="serviceRequested"
            value={lead.serviceRequested}
            onChange={handleChange}
            options={services}
            placeholder="Select a service"
            icon={List}
          />
          {/* Full width inquiry field */}
          <TextAreaField
            label="Inquiry / Notes"
            name="inquiry"
            value={lead.inquiry}
            onChange={handleChange}
            placeholder="Describe the lead's inquiry or any relevant notes"
            rows={4}
            icon={FileText}
            className="md:col-span-2"
          />
          {/* Attachments */}
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
                  <p className="text-xs text-gray-500">SVG, PNG, JPG, GIF, PDF (MAX. 5MB per file)</p>
                </div>
                <input
                  id="attachments"
                  name="attachments"
                  type="file"
                  multiple
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
            {lead.attachments.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <p className="font-semibold">Selected Files:</p>
                <ul className="list-disc list-inside">
                  {lead.attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={PlusCircle}
        >
          Create Lead
        </Button>
      </div>
    </form>
  );
}