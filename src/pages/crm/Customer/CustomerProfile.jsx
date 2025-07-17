import React from "react";
import {
  User, // For customer name/general profile
  Mail, // For email
  Phone, // For phone number
  Building2, // For company
  MapPin, // For address
  Tag, // For tags
  Cake, // For birthday
  Calendar, // For birthday (alternative)
  Venus, // For female gender (example)
  Mars, // For male gender (example)
  Users, // For company size/employees
  Briefcase, // For industry
  Globe, // For company location
  Info, // General info icon
} from "lucide-react"; // Import all necessary icons

export default function CustomerProfile({ customer }) {
  // Helper for consistent info rows
  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 text-gray-700">
      {Icon && <Icon className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-800 break-words">{value || 'N/A'}</p>
      </div>
    </div>
  );

  // Determine gender icon (example)
  const getGenderIcon = (gender) => {
    if (!gender) return null;
    const lowerGender = gender.toLowerCase();
    if (lowerGender === 'male') return Mars;
    if (lowerGender === 'female') return Venus;
    return null;
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-4xl mx-auto my-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gray-200 mb-6">
        <div className="relative">
          <img
            src={customer.photo || 'https://via.placeholder.com/150/F3F4F6/9CA3AF?text=User'} // Fallback image
            alt={customer.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-100 shadow-lg"
          />
          {/* Online/Offline status indicator (example) */}
          <span className="absolute bottom-1 right-1 block w-4 h-4 rounded-full bg-green-500 border-2 border-white"></span>
        </div>
        <div className="text-center sm:text-left flex-grow">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center sm:justify-start gap-2 mb-2">
            <User className="w-6 h-6 text-blue-600" />
            {customer.name}
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-start gap-3 text-gray-600">
            <span className="flex items-center gap-2 text-md">
              <Mail className="w-5 h-5 text-gray-500" /> {customer.email}
            </span>
            <span className="hidden sm:inline-block text-gray-400">|</span>
            <span className="flex items-center mr-17 gap-1 text-md">
              <Phone className="w-5 h-5 text-gray-500" /> {customer.phone}
            </span>
          </div>
          <p className="text-md text-gray-500 mt-2">Customer ID: <span className="font-semibold text-gray-700">{customer.id || 'N/A'}</span></p>
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Personal Info */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" /> Personal Information
          </h3>
          <div className="space-y-4">
            <InfoRow icon={getGenderIcon(customer.gender)} label="Gender" value={customer.gender} />
            <InfoRow icon={Calendar} label="Birthday" value={customer.birthday} />
            {/* Add more personal info fields as needed, e.g., National ID, etc. */}
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" /> Company Details
          </h3>
          <div className="space-y-4">
            <InfoRow icon={Building2} label="Company Name" value={customer.company.name} />
            <InfoRow icon={Briefcase} label="Industry" value={customer.company.industry} />
            <InfoRow icon={Users} label="Company Size" value={customer.company.size} />
            <InfoRow icon={Globe} label="Location" value={customer.company.location} />
          </div>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Billing Address */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" /> Billing Address
          </h3>
          <InfoRow label="Address" value={customer.addresses.billing} />
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" /> Shipping Address
          </h3>
          <InfoRow label="Address" value={customer.addresses.shipping} />
        </div>
      </div>

      {/* Tags Section */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-cyan-600" /> Customer Tags
        </h3>
        {customer.tags && customer.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {customer.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                           bg-blue-100 text-blue-700 border border-blue-200 shadow-sm
                           hover:bg-blue-200 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No tags assigned.</p>
        )}
      </div>

      {/* Action Buttons (Example) */}
      <div className="mt-8 flex justify-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
          <Mail className="w-5 h-5" /> Send Email
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold shadow-sm hover:bg-gray-100 transition-colors duration-200">
          <Phone className="w-5 h-5" /> Call Customer
        </button>
      </div>
    </div>
  );
}