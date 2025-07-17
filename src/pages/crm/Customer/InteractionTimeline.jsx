import React from "react";
import {
  Mail,
  PhoneCall,
  CalendarClock,
  ShoppingCart,
  MessageSquare, // Example for 'chat' type
  Clock, // General fallback icon or for "time"
  History, // Icon for the main heading
} from "lucide-react";

export default function InteractionTimeline({ interactions }) {
  // Define icons for different interaction types with specific colors
  const typeIcons = {
    email: { icon: Mail, color: "text-blue-600", bg: "bg-blue-100" },
    call: { icon: PhoneCall, color: "text-green-600", bg: "bg-green-100" },
    meeting: { icon: CalendarClock, color: "text-yellow-600", bg: "bg-yellow-100" },
    order: { icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-100" },
    chat: { icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-100" }, // Added example
    default: { icon: Clock, color: "text-gray-600", bg: "bg-gray-100" }, // Fallback
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <History className="w-7 h-7 text-teal-600" />
        Customer Interaction Timeline
      </h2>
      <div className="space-y-6 border-l-2 border-gray-200 pl-6 relative">
        {interactions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No interaction history available.</div>
        ) : (
          interactions
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by most recent first
            .map((item, i) => {
              const { icon: Icon, color, bg } = typeIcons[item.type] || typeIcons.default;
              const formattedDate = new Date(item.date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <div key={i} className="relative group hover:bg-gray-50 rounded-lg p-3 -ml-6 transition-all duration-200">
                  {/* Timeline Dot/Icon */}
                  <div className={`absolute -left-3.5 top-5 transform -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center
                                   border-2 border-white shadow-md ${bg}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>

                  <div className="ml-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-base font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-200 mb-1 sm:mb-0">
                      {item.detail}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 sm:text-sm sm:flex-shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {formattedDate}
                    </p>
                  </div>
                  {/* Optional: Add a subtle line connecting to the next item */}
                  {i < interactions.length - 1 && (
                    <div className="absolute left-0 top-10 w-0.5 h-full bg-gray-200 -z-10"></div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}