import {
  ReceiptText, ChevronDown ,Banknote,Clock, XCircle, ListChecks,
  Wallet, AlertTriangle,
  CalendarCheck,
  CreditCard,
  CircleCheck, // For success states
  CircleAlert, // For warning states
  CircleDollarSign,
  CircleX,
  Hourglass,
  Info,
  History,
  CheckCircle2,
  User,
  FileText,
  DollarSign,
  Hash,
  Calendar,
  UploadCloud,
  FilePenLine, // For notes/textarea
  Send,
  CheckCircle,
  Building,
  CalendarDays,
  Download,
  Printer,
} from "lucide-react"; // Import necessary icons

// Helper component for a single statistic card
const PaymentEntryForm = ({ onSubmit }) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    // Handle file separately if needed, as formData.entries() gives File object
    // For demonstration, we'll just log the file name
    if (data.file && data.file.name) {
      console.log("File uploaded:", data.file.name);
      // In a real app, you'd send this file to a server
    }
    onSubmit(data); // Pass the form data to the onSubmit prop
  };

  const InputField = ({ label, name, type = "text", required = false, icon: Icon, placeholder = "" }) => (
    <div>
      <label htmlFor={name} className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition duration-200 ease-in-out placeholder-gray-400 text-gray-800"
        required={required}
        placeholder={placeholder}
      />
    </div>
  );

  const SelectField = ({ label, name, options, required = false, icon: Icon }) => (
    <div>
      <label htmlFor={name} className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     appearance-none pr-10 transition duration-200 ease-in-out"
          required={required}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  const TextAreaField = ({ label, name, required = false, icon: Icon, placeholder = "" }) => (
    <div>
      <label htmlFor={name} className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows="3"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   transition duration-200 ease-in-out placeholder-gray-400 text-gray-800"
        required={required}
        placeholder={placeholder}
      ></textarea>
    </div>
  );

  const FileUploadField = ({ label, name, required = false, icon: Icon }) => (
    <div>
      <label htmlFor={name} className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label htmlFor={name} className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg
                                     bg-gray-50 text-gray-700 cursor-pointer hover:bg-blue-50 hover:border-blue-400
                                       transition duration-300 ease-in-out shadow-sm">
        <UploadCloud className="w-6 h-6 mr-2 text-blue-500" />
        <span className="text-sm font-medium">Choose file or drag here</span>
        <input
          type="file"
          id={name}
          name={name}
          className="hidden"
          required={required}
        />
      </label>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Record New Payment
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          label="Customer Name"
          name="customer"
          required
          icon={User}
          placeholder="e.g., ABC Company"
        />
        <InputField
          label="Invoice Number"
          name="invoice"
          required
          icon={FileText}
          placeholder="e.g., INV-2025-001"
        />
        <InputField
          label="Amount Paid"
          name="amount"
          type="number"
          required
          icon={DollarSign}
          placeholder="e.g., 5000.00"
        />
        <SelectField
          label="Payment Method"
          name="method"
          options={["Cash", "Bank Transfer", "Telebirr", "Cheque", "Credit Card"]}
          required
          icon={CreditCard}
        />
        <InputField
          label="Reference No."
          name="reference"
          icon={Hash}
          placeholder="e.g., TXN12345 or Cheque No."
        />
        <InputField
          label="Payment Date"
          name="date"
          type="date"
          required
          icon={Calendar}
        />
        <FileUploadField
          label="Upload Proof of Payment"
          name="file"
          icon={UploadCloud}
        />
        <TextAreaField
          label="Note"
          name="note"
          icon={FilePenLine}
          placeholder="Any additional details about this payment..."
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-xl
                     shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300
                     flex items-center justify-center gap-2 text-lg transform hover:scale-105"
        >
          <Send className="w-5 h-5" />
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentEntryForm