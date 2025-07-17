export const PaymentReceipt = ({ receipt }) => {
  return (
    <div className="border p-4 w-full max-w-md mx-auto shadow">
      <h2 className="text-xl font-bold mb-2">Payment Receipt</h2>
      <p><strong>Company:</strong> {receipt.company}</p>
      <p><strong>Date:</strong> {receipt.date}</p>
      <p><strong>Amount:</strong> {receipt.amount} ETB</p>
      <p><strong>Reference ID:</strong> {receipt.reference}</p>
      <p className="mt-4">Thank you for your payment!</p>
    </div>
  );
};