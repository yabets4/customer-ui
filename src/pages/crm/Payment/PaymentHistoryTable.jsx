export const PaymentHistoryTable = ({ payments }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Date</th>
            <th className="p-2">Payment ID</th>
            <th className="p-2">Invoice #</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Method</th>
            <th className="p-2">Reference</th>
            <th className="p-2">Status</th>
            <th className="p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{p.date}</td>
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.invoice}</td>
              <td className="p-2">{p.amount} ETB</td>
              <td className="p-2">{p.method}</td>
              <td className="p-2">{p.reference}</td>
              <td className="p-2">{p.status}</td>
              <td className="p-2">{p.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};