import React from "react";
import CustomerProfile from "./CustomerProfile.jsx";
import InteractionTimeline from "./InteractionTimeline.jsx";
import SalesSummary from "./SalesSummary.jsx";
import SegmentationInsights from "./SegmentationInsights.jsx";
import { UserCog } from "lucide-react"; // Importing an icon for the main page title

export default function CustomersProfile() {
  const mockCustomer = {
    id: "01", // Added a more realistic ID
    name: "Yabets Mebratu", // Full name
    email: "myabets4@gmail.com",
    phone: "+251912345678",
    gender: "Male",
    birthday: "2005-09-25",
    photo: "https://images.unsplash.com/photo-1507003211169-e69fe254fe58?q=80&w=250&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example photo
    company: {
      name: "JobLess", // Full company name
      industry: "Software",
      size: "20-50 Employees",
      location: "Addis Ababa, Ethiopia",
    },
    addresses: {
      billing: "Bole Road, Near Edna Mall, Addis Ababa",
      shipping: "CMC Summit, Behind Imperial Hotel, Addis Ababa",
    },
    tags: ["VIP Customer", "Repeat Buyer", "High Value"],
    leadScore: 92,
    type: "B2B Enterprise",
    activity: "Highly Active",
    sentiment: "Very Positive",
    totalRevenue: 225000.75, // More realistic currency
    totalOrders: 12,
    lastPayment: "2025-07-01",
    arAging: {
      "0-30 days": 0,
      "31-60 days": 12000.00,
      "61-90 days": 0,
      "90+ days": 0,
    },
    interactions: [
      { type: "email", detail: "Opened price quote for large project.", date: "2025-06-10 10:30 AM" },
      { type: "call", detail: "Confirmed order details for bespoke furniture.", date: "2025-06-12 02:15 PM" },
      { type: "meeting", detail: "Design consultation regarding new office layout.", date: "2025-06-14 11:00 AM" },
      { type: "order", detail: "Placed order #ORD-2025-005 for 3 custom tables.", date: "2025-06-20 04:00 PM" },
      { type: "email", detail: "Follow-up on product delivery status.", date: "2025-07-05 09:00 AM" },
      { type: "support", detail: "Inquiry about maintenance of custom furniture.", date: "2025-07-08 01:00 PM" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Title */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <UserCog className="w-8 h-8 text-blue-600" />
          Customer Profile Overview
        </h1>
        {/* Potentially add actions like "Edit Profile" button here */}
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Customer Profile & Insights */}
        <div className="xl:col-span-1 space-y-7">
          <CustomerProfile customer={mockCustomer} />
          <SegmentationInsights customer={mockCustomer} />
        </div>

        {/* Right Column: Sales Summary & Interaction Timeline */}
        <div className="xl:col-span-2 space-y-6">
          <SalesSummary customer={mockCustomer} />
          <InteractionTimeline interactions={mockCustomer.interactions} />
        </div>
      </div>
    </div>
  );
}