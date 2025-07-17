import {
  Bell,
  UserPlus,
  MessageSquareText,
  Calendar,
  CheckCircle,
} from "lucide-react";

const iconMap = {
  new_lead: <UserPlus className="w-5 h-5 text-blue-500" />,
  message: <MessageSquareText className="w-5 h-5 text-green-500" />,
  reminder: <Calendar className="w-5 h-5 text-yellow-500" />,
  default: <Bell className="w-5 h-5 text-gray-400" />,
};

export default function Notifications({ notifications = [], onMarkAsRead }) {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Notifications</h3>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No new notifications.</p>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {notifications.map((notif, index) => (
            <li
              key={index}
              className={`flex items-start gap-3 py-3 ${
                !notif.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="mt-1 shrink-0">
                {iconMap[notif.type] || iconMap.default}
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-800">{notif.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
              </div>

              {!notif.read && (
                <button
                  onClick={() => onMarkAsRead && onMarkAsRead(notif.id)}
                  className="ml-auto text-blue-600 text-xs hover:underline flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
