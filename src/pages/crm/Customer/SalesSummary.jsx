import React from "react";
import {
  CreditCard,
  ShoppingBag,
  CalendarCheck,
  AlertCircle,
  TrendingUp, // For total revenue
  ReceiptText, // For AR Aging
  Clock, // For AR Aging (alternative for "due")
  DollarSign, // General money icon
} from "lucide-react";

export default function SalesSummary({ customer }) {
  // Helper to format currency consistently, including handling null/undefined
  const formatETB = (amt) => {
    if (amt == null) return "N/A";
    return `ETB ${parseFloat(amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper for individual metric cards
  const MetricCard = ({ title, value, icon: Icon, colorClass, description, tooltip }) => (
    <div
      className={`relative bg-white p-5 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colorClass}`}
      title={tooltip} // Tooltip on hover
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && <Icon className="w-6 h-6 text-gray-400" />}
      </div>
      <p className="text-2xl font-extrabold text-gray-900 mb-1">{value}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  // Determine AR Aging status for 60 days
  const ar60DaysAmount = customer.arAging?.["31-60 days"] || 0;
  const has60DayOverdue = ar60DaysAmount > 0;

  // Determine AR Aging status for 90+ days
  const ar90PlusAmount = customer.arAging?.["90+ days"] || 0;
  const has90PlusOverdue = ar90PlusAmount > 0;

  // Choose appropriate icon and color for the AR (60+ days) card
  let arAgingIcon = ReceiptText;
  let arAgingColor = "";
  let arAgingText = "No amounts overdue 60+ days";

  if (has90PlusOverdue) {
    arAgingIcon = AlertCircle;
    arAgingColor = "bg-red-50"; // Light red background
    arAgingText = "Significantly overdue";
  } else if (has60DayOverdue) {
    arAgingIcon = Clock;
    arAgingColor = "bg-orange-50"; // Light orange background
    arAgingText = "Some amounts overdue 31-60 days";
  }


  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <DollarSign className="w-7 h-7 text-green-600" />
        Customer Sales & Payment Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Orders"
          value={customer.totalOrders?.toLocaleString() || 'N/A'}
          icon={ShoppingBag}
          colorClass="hover:border-blue-300"
          description="Total number of purchases"
          tooltip="Total count of all placed orders by this customer."
        />
        <MetricCard
          title="Total Revenue"
          value={formatETB(customer.totalRevenue)}
          icon={TrendingUp}
          colorClass="hover:border-green-300"
          description="Gross revenue from all sales"
          tooltip="The total monetary value of all completed sales from this customer."
        />
        <MetricCard
          title="Last Payment"
          value={customer.lastPayment || 'N/A'}
          icon={CalendarCheck}
          colorClass="hover:border-purple-300"
          description="Date of last successful payment"
          tooltip="The date when the customer made their most recent payment."
        />
        <MetricCard
          title="Overdue (60+ Days)"
          value={formatETB(ar60DaysAmount + ar90PlusAmount)} // Sum both 60 and 90+ for this card
          icon={arAgingIcon}
          colorClass={`${arAgingColor} ${has60DayOverdue || has90PlusOverdue ? 'border-red-300' : ''}`} // Add red border if overdue
          description={arAgingText}
          tooltip={`Outstanding amount that is overdue by more than 60 days. Current: 31-60 days: ${formatETB(customer.arAging?.["31-60 days"] || 0)}, 90+ days: ${formatETB(customer.arAging?.["90+ days"] || 0)}.`}
        />
      </div>
    </div>
  );
}