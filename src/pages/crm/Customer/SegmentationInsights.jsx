import React from "react";
import {
  Gauge, // For Lead Score
  Users, // For Customer Type (representing B2B/B2C)
  Activity, // For Activity Status
  Smile, // For Positive Sentiment
  Frown, // For Negative Sentiment (new)
  Meh, // For Neutral Sentiment (new)
  TrendingUp, // For Active Status (alternative)
  TrendingDown, // For Inactive Status (alternative)
  Lightbulb, // General insights icon for the heading
} from "lucide-react";

export default function SegmentationInsights({ customer }) {
  // Helper for individual insight cards
  const InsightCard = ({ title, value, icon: Icon, valueColorClass = "text-gray-900", description, cardBgClass = "bg-white", iconColorClass = "text-gray-500" }) => (
    <div className={`flex flex-col p-5 rounded-xl shadow-md border border-gray-100 ${cardBgClass} transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && <Icon className={`w-6 h-6 ${iconColorClass}`} />}
      </div>
      <p className={`text-2xl font-bold ${valueColorClass} mb-1`}>{value}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );

  // Dynamic styling for Sentiment
  let sentimentIcon = Smile;
  let sentimentValueColor = "text-green-600";
  let sentimentIconColor = "text-green-500";
  let sentimentCardBg = "bg-green-50";
  if (customer.sentiment && customer.sentiment.toLowerCase().includes("negative")) {
    sentimentIcon = Frown;
    sentimentValueColor = "text-red-600";
    sentimentIconColor = "text-red-500";
    sentimentCardBg = "bg-red-50";
  } else if (customer.sentiment && customer.sentiment.toLowerCase().includes("neutral")) {
    sentimentIcon = Meh;
    sentimentValueColor = "text-yellow-600";
    sentimentIconColor = "text-yellow-500";
    sentimentCardBg = "bg-yellow-50";
  }

  // Dynamic styling for Activity Status
  let activityIcon = Activity;
  let activityValueColor = "text-blue-600";
  let activityIconColor = "text-blue-500";
  let activityCardBg = "bg-blue-50";
  if (customer.activity && customer.activity.toLowerCase().includes("inactive")) {
    activityIcon = TrendingDown; // Or a specific "inactive" icon
    activityValueColor = "text-red-600";
    activityIconColor = "text-red-500";
    activityCardBg = "bg-red-50";
  } else if (customer.activity && customer.activity.toLowerCase().includes("active")) {
    activityIcon = TrendingUp; // Or a specific "active" icon
    activityValueColor = "text-green-600";
    activityIconColor = "text-green-500";
    activityCardBg = "bg-green-50";
  }


  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Lightbulb className="w-7 h-7 text-purple-600" />
        Customer Segmentation & Insights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InsightCard
          title="Lead Score"
          value={customer.leadScore || 'N/A'}
          icon={Gauge}
          valueColorClass="text-purple-700"
          iconColorClass="text-purple-600"
          cardBgClass="bg-purple-50"
          description="Potential for conversion or growth"
        />
        <InsightCard
          title="Customer Type"
          value={customer.type || 'N/A'}
          icon={Users}
          valueColorClass="text-indigo-700"
          iconColorClass="text-indigo-600"
          cardBgClass="bg-indigo-50"
          description="Categorization (e.g., B2B, B2C)"
        />
        <InsightCard
          title="Activity Status"
          value={customer.activity || 'N/A'}
          icon={activityIcon}
          valueColorClass={activityValueColor}
          iconColorClass={activityIconColor}
          cardBgClass={activityCardBg}
          description="Current engagement level"
        />
        <InsightCard
          title="Sentiment"
          value={customer.sentiment || 'N/A'}
          icon={sentimentIcon}
          valueColorClass={sentimentValueColor}
          iconColorClass={sentimentIconColor}
          cardBgClass={sentimentCardBg}
          description="Overall attitude towards your brand"
        />
      </div>
    </div>
  );
}