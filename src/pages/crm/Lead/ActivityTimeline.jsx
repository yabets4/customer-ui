import React from "react";
import {
  Phone,
  Mail,
  MessageSquareText,
  Clock,
  UserPlus,
} from "lucide-react";

const activityIcons = {
  call: { icon: <Phone className="w-5 h-5 text-blue-500" />, label: "Call" },
  email: { icon: <Mail className="w-5 h-5 text-green-500" />, label: "Email" },
  note: {
    icon: <MessageSquareText className="w-5 h-5 text-gray-500" />,
    label: "Note",
  },
  update: { icon: <Clock className="w-5 h-5 text-yellow-500" />, label: "Update" },
  new_lead: {
    icon: <UserPlus className="w-5 h-5 text-purple-500" />,
    label: "New Lead",
  },
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export default function ActivityTimeline({ activities = [], onAddActivity }) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Activity Timeline</h3>
        {onAddActivity && (
          <button
            onClick={onAddActivity}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add Activity
          </button>
        )}
      </div>

      {/* Activities List */}
      {activities.length > 0 ? (
        <ul className="space-y-4 max-h-72 overflow-y-auto pr-2">
          {activities.map((activity, idx) => {
            const { icon, label } =
              activityIcons[activity.type] || activityIcons.note;
            return (
              <li
                key={idx}
                className="flex gap-3 items-start border-l-2 border-gray-200 pl-2"
              >
                {/* Icon with Tooltip and hover animation */}
                <div
                  className="mt-1 shrink-0 cursor-pointer hover:scale-110 transition-transform duration-150"
                  title={label}
                  aria-label={label}
                >
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    {activity.user && (
                      <div
                        title={activity.user}
                        className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700 select-none"
                      >
                        {getInitials(activity.user)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No activity yet.</p>
      )}
    </div>
  );
}
