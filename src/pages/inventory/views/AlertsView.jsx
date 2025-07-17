export default function AlertsView() {
  const alerts = [
    {
      type: "warning",
      message: "⚠️ Maintenance Due: CNC Router A has no maintenance logged in 6 months.",
      style: "bg-yellow-50 border-yellow-400",
    },
    {
      type: "info",
      message: "📅 Depreciation Anniversary: Delivery Van #2 hit its 3rd year.",
      style: "bg-blue-50 border-blue-400",
    },
    {
      type: "danger",
      message: "❌ Unscanned Asset: Table Saw not logged in system for 30 days.",
      style: "bg-red-50 border-red-500",
    },
    {
      type: "purple",
      message: "🛡️ Warranty Expired: CNC Router A warranty expired on 2025-01-01.",
      style: "bg-purple-50 border-purple-500",
    },
    {
      type: "critical",
      message: "🚫 Disposal Attempt Blocked: Unauthorized user tried to dispose Delivery Van #2.",
      style: "bg-red-50 border-red-600",
    },
  ];

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">🔔 Asset Alerts & Controls</h3>
      <ul className="space-y-2 text-sm">
        {alerts.map((alert, idx) => (
          <li
            key={idx}
            className={`p-3 border-l-4 rounded ${alert.style}`}
          >
            {alert.message}
          </li>
        ))}
      </ul>
    </>
  );
}