import { useState } from "react";
import {
  Rocket,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  LayoutDashboard,
  Users,
  ImageIcon,
  Eye,
  Target,
  CalendarDays,
  DollarSign,
  Handshake,
  MapPin,
  UserRound,
  Crop,
  PencilLine,
  Link,
  FileText,
  UploadCloud,
  CheckCircle2,
  XCircle, // <-- You might need this if using XCircle for false status
  Info,
  Coins, // <--- ADD THIS LINE!
} from "lucide-react";
// --- Reusable UI Components (Highly Enhanced) ---

const Label = ({ children, htmlFor, icon: Icon, required = false }) => (
  <label htmlFor={htmlFor} className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
    {Icon && <Icon className="w-4 h-4 text-blue-600 opacity-80" />}
    {children} {required && <span className="text-red-500 text-xs">*</span>}
  </label>
);

const InlineInput = ({ label, value, onChange, type = "text", placeholder, icon: Icon, required = false }) => (
  <div className="mb-6">
    <Label icon={Icon} htmlFor={`input-${label.replace(/\s/g, '-')}`} required={required}>{label}</Label>
    <input
      id={`input-${label.replace(/\s/g, '-')}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-inner bg-white text-gray-800
                 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500
                 transition duration-300 ease-in-out placeholder-gray-400 text-base"
    />
  </div>
);

const InlineSelect = ({ label, value, onChange, options, icon: Icon, required = false }) => (
  <div className="mb-6">
    <Label icon={Icon} htmlFor={`select-${label.replace(/\s/g, '-')}`} required={required}>{label}</Label>
    <div className="relative">
      <select
        id={`select-${label.replace(/\s/g, '-')}`}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 shadow-inner bg-white text-gray-800
                   focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500
                   appearance-none pr-10 transition duration-300 ease-in-out text-base cursor-pointer"
      >
        <option value="" disabled>Select...</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

const InlineToggle = ({ label, checked, onChange, icon: Icon }) => (
  <div className="mb-6 flex items-center justify-between py-2 border-t border-gray-100 pt-4">
    <Label icon={Icon} htmlFor={`toggle-${label.replace(/\s/g, '-')}`}>{label}</Label>
    <label htmlFor={`toggle-${label.replace(/\s/g, '-')}`} className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={`toggle-${label.replace(/\s/g, '-')}`}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer
                      peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
                      after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300
                      after:border after:rounded-full after:h-6 after:w-6 after:transition-all duration-300
                      peer-checked:bg-gradient-to-r from-blue-500 to-blue-600 shadow-inner"></div>
    </label>
  </div>
);

const InlineUpload = ({ label, onChange, icon: Icon, fileName, previewUrl }) => (
  <div className="mb-6">
    <Label icon={Icon}>{label}</Label>
    <label
      htmlFor="file-upload"
      className="flex flex-col items-center justify-center w-full min-h-[120px] px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl
                 bg-gray-50 text-gray-700 cursor-pointer hover:bg-blue-50 hover:border-blue-400
                 transition duration-300 ease-in-out shadow-sm"
    >
      {previewUrl ? (
        <img src={previewUrl} alt="Media Preview" className="max-h-[100px] max-w-full object-contain rounded-md mb-2" />
      ) : (
        <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
      )}
      <span className="text-sm font-medium text-center">
        {fileName ? `Selected: ${fileName}` : "Click to upload or drag & drop"}
      </span>
      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4 (Max 10MB)</p>
      <input
        id="file-upload"
        type="file"
        onChange={onChange}
        className="hidden"
        accept="image/*,video/*"
      />
    </label>
  </div>
);

// --- Main CampaignBuilder Component ---
const CampaignBuilder = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    campaign: {
      name: "",
      objective: "",
      budgetType: "Daily",
      budgetAmount: "",
      startDate: "",
      endDate: "",
      status: true,
    },
    adset: {
      name: "",
      location: "",
      ageMin: 18,
      ageMax: 65,
      gender: "All",
    },
    creative: {
      name: "",
      format: "Image",
      media: null, // Stores File object
      mediaPreviewUrl: null, // Stores URL for preview
      text: "",
      headline: "",
      url: "",
    },
  });

  const handleChange = (section, key, value) => {
    if (key === "media" && value instanceof File) {
      setForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          media: value,
          mediaPreviewUrl: URL.createObjectURL(value) // Create URL for preview
        },
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    }
  };

  // Basic validation for current step before proceeding
  const validateStep = () => {
    const { campaign, adset, creative } = form;
    switch (step) {
      case 0: // Campaign Setup
        return campaign.name && campaign.objective && campaign.budgetAmount && campaign.startDate;
      case 1: // Ad Set Configuration
        return adset.name && adset.location && adset.ageMin && adset.ageMax && adset.gender;
      case 2: // Ad Creative Builder
        return creative.name && creative.format && creative.text && creative.headline && creative.url && creative.media;
      default:
        return true;
    }
  };

  const next = () => {
    if (validateStep()) {
      setStep(step + 1);
    } else {
      alert("Please fill in all required fields before proceeding.");
    }
  };
  const back = () => setStep(step - 1);

  const renderStep = () => {
    const { campaign, adset, creative } = form;

    switch (step) {
      case 0:
        return (
          <>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-8 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              Campaign Setup
            </h2>
            <InlineInput label="Campaign Name" icon={FileText} value={campaign.name} onChange={e => handleChange("campaign", "name", e.target.value)} placeholder="e.g., Summer Sale 2025" required />
            <InlineSelect label="Objective" icon={Target} value={campaign.objective} onChange={e => handleChange("campaign", "objective", e.target.value)} options={["Traffic", "Conversions", "Awareness", "Lead Generation", "Engagement"]} required />
            <InlineSelect label="Budget Type" icon={Coins} value={campaign.budgetType} onChange={e => handleChange("campaign", "budgetType", e.target.value)} options={["Daily", "Lifetime"]} required />
            <InlineInput label="Budget Amount (ETB)" icon={DollarSign} type="number" value={campaign.budgetAmount} onChange={e => handleChange("campaign", "budgetAmount", e.target.value)} placeholder="e.g., 500 (for Daily)" required />
            <InlineInput label="Start Date" icon={CalendarDays} type="date" value={campaign.startDate} onChange={e => handleChange("campaign", "startDate", e.target.value)} required />
            <InlineInput label="End Date" icon={CalendarDays} type="date" value={campaign.endDate} onChange={e => handleChange("campaign", "endDate", e.target.value)} />
            <InlineToggle label="Activate Campaign Now?" icon={Handshake} checked={campaign.status} onChange={e => handleChange("campaign", "status", e.target.checked)} />
          </>
        );
      case 1:
        return (
          <>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-8 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Audience & Ad Set
            </h2>
            <InlineInput label="Ad Set Name" icon={FileText} value={adset.name} onChange={e => handleChange("adset", "name", e.target.value)} placeholder="e.g., Addis Ababa Youth" required />
            <InlineInput label="Target Location" icon={MapPin} value={adset.location} onChange={e => handleChange("adset", "location", e.target.value)} placeholder="e.g., Addis Ababa, Ethiopia" required />
            <div className="grid grid-cols-2 gap-4">
              <InlineInput label="Min Age" icon={Users} type="number" value={adset.ageMin} onChange={e => handleChange("adset", "ageMin", e.target.value)} required />
              <InlineInput label="Max Age" icon={Users} type="number" value={adset.ageMax} onChange={e => handleChange("adset", "ageMax", e.target.value)} required />
            </div>
            <InlineSelect label="Gender" icon={UserRound} value={adset.gender} onChange={e => handleChange("adset", "gender", e.target.value)} options={["All", "Male", "Female"]} required />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-8 flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-blue-600" />
              Ad Creative & Content
            </h2>
            <InlineInput label="Ad Name" icon={FileText} value={creative.name} onChange={e => handleChange("creative", "name", e.target.value)} placeholder="e.g., Summer Collection Ad" required />
            <InlineSelect label="Ad Format" icon={Crop} value={creative.format} onChange={e => handleChange("creative", "format", e.target.value)} options={["Image", "Carousel", "Video"]} required />
            <InlineUpload label="Upload Media" icon={UploadCloud} onChange={e => handleChange("creative", "media", e.target.files[0])} fileName={creative.media?.name} previewUrl={creative.mediaPreviewUrl} required />
            <InlineInput label="Ad Text" icon={PencilLine} value={creative.text} onChange={e => handleChange("creative", "text", e.target.value)} placeholder="Engaging text for your ad..." required />
            <InlineInput label="Headline" icon={FileText} value={creative.headline} onChange={e => handleChange("creative", "headline", e.target.value)} placeholder="Catchy headline" required />
            <InlineInput label="Destination URL" icon={Link} value={creative.url} onChange={e => handleChange("creative", "url", e.target.value)} placeholder="https://yourwebsite.com/landing-page" type="url" required />
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-8 flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-600" />
              Review & Launch
            </h2>

            {[
              {
                icon: <LayoutDashboard className="text-blue-600 w-5 h-5" />,
                title: "Campaign Info",
                items: [
                  ["Name", campaign.name || "N/A"],
                  ["Objective", campaign.objective || "N/A"],
                  ["Budget", `${campaign.budgetType || "N/A"} - ${campaign.budgetAmount || "N/A"} ETB`],
                  ["Dates", `${campaign.startDate || "N/A"} to ${campaign.endDate || "N/A"}`],
                  ["Status", campaign.status ? "Active" : "Paused"]
                ]
              }, {
                icon: <Users className="text-blue-600 w-5 h-5" />,
                title: "Ad Set Details",
                items: [
                  ["Name", adset.name || "N/A"],
                  ["Location", adset.location || "N/A"],
                  ["Age Range", `${adset.ageMin || "N/A"} - ${adset.ageMax || "N/A"}`],
                  ["Gender", adset.gender || "N/A"]
                ]
              }, {
                icon: <ImageIcon className="text-blue-600 w-5 h-5" />,
                title: "Ad Creative",
                items: [
                  ["Name", creative.name || "N/A"],
                  ["Format", creative.format || "N/A"],
                  ["Headline", creative.headline || "N/A"],
                  ["Text", creative.text || "N/A"],
                  ["URL", creative.url || "N/A"],
                  ["Media", creative.media?.name || "None uploaded"]
                ]
              }
            ].map((section, i) => (
              <div key={i} className="bg-blue-50 border border-blue-200 rounded-xl shadow-md p-6 mb-6">
                <h3 className="flex items-center gap-3 text-xl font-bold text-blue-800 mb-4 pb-2 border-b border-blue-200">
                  {section.icon}
                  {section.title}
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  {section.items.map(([label, val], j) => (
                    <li key={j} className="flex justify-between items-center py-1">
                      <strong className="text-gray-900">{label}:</strong>
                      <span className="text-right ml-4">
                        {val === true ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : val === false ? <XCircle className="w-5 h-5 text-red-500" /> : val}
                      </span>
                    </li>
                  ))}
                  {section.title === "Ad Creative" && creative.mediaPreviewUrl && (
                     <li className="flex flex-col justify-between items-start py-1">
                       <strong className="text-gray-900 mb-2">Media Preview:</strong>
                       {creative.format === "Image" && <img src={creative.mediaPreviewUrl} alt="Ad media preview" className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 mt-2" />}
                       {creative.format === "Video" && (
                         <video controls src={creative.mediaPreviewUrl} className="max-w-full h-auto rounded-lg shadow-md border border-gray-200 mt-2">
                           Your browser does not support the video tag.
                         </video>
                       )}
                     </li>
                   )}
                </ul>
              </div>
            ))}

            <button
              className="mt-8 px-8 py-3 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700
                         text-white rounded-xl shadow-xl font-bold text-lg flex items-center justify-center gap-3
                         transition-all duration-300 transform hover:scale-105"
              onClick={() => alert("🚀 Campaign Launched Successfully! Check your dashboard for performance.")}
            >
              <Rocket className="w-6 h-6" />
              Launch Campaign Now!
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-3xl shadow-2xl mt-12 mb-12 border border-blue-100 transform transition-all duration-500 ease-in-out">
      <div className="mb-10 text-center">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-6 relative">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 flex items-center justify-center relative">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl
                            transition-all duration-500 ease-in-out z-10
                            ${i <= step ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg scale-110" : "bg-gray-300 scale-90"}`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`absolute left-1/2 w-[calc(100%+0.5rem)] h-1 bg-gradient-to-r ${
                    i < step ? "from-blue-400 to-blue-300" : "from-gray-200 to-gray-200"
                  } transform -translate-x-1/2 -z-0 transition-all duration-500 ease-in-out`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm tracking-wide font-medium mt-3">Step {step + 1} of 4: {['Campaign Setup', 'Audience & Ad Set', 'Ad Creative & Content', 'Review & Launch'][step]}</p>
      </div>

      {/* Render Current Step's Form/Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="mt-10 flex justify-between items-center border-t border-gray-100 pt-6">
        {step > 0 ? (
          <button
            onClick={back}
            className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium
                       flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        ) : <div />}
        {step < 3 && (
          <button
            onClick={next}
            className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg font-bold
                       flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
          >
            Next Step
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CampaignBuilder;