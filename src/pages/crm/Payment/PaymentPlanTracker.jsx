export const PaymentPlanTracker = ({ milestones }) => {
  return (
    <div className="space-y-3">
      {milestones.map((m, idx) => (
        <div key={idx} className="border p-3 rounded shadow">
          <div className="flex justify-between">
            <span>{m.title}</span>
            <span>{m.status}</span>
          </div>
          <div className="text-sm text-gray-500">{m.amount} ETB - Due {m.dueDate}</div>
        </div>
      ))}
    </div>
  );
};