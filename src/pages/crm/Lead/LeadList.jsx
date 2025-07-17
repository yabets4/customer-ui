import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ModalWithForm from "../../../components/ui/modal"; // Assuming this component is robust
import AddLead from "./AddLead"; // Assuming this is an external component to add new leads
import TagSelector from "./TagSelector"; // Assuming this is a robust tag selector component
import {
  Search, SlidersHorizontal, ChevronUp, ChevronDown, Edit, Trash2,
  Users, Building2, User, Phone, Mail, Clock, Hash, Tag, Info, ListFilter
} from "lucide-react"; // Import more relevant icons

// --- Reusable UI Components (Enhanced) ---

// Sort Icon with active state and direction indicator
function SortIcon({ active, direction }) {
  if (!active) return <ChevronDown className="w-4 h-4 text-gray-400 opacity-60" />;
  return direction === "asc" ? (
    <ChevronUp className="w-4 h-4 text-blue-600" />
  ) : (
    <ChevronDown className="w-4 h-4 text-blue-600" />
  );
}

// Status Badge with improved colors and styling
function StatusBadge({ status }) {
  const colorMap = {
    New: "bg-blue-100 text-blue-800 ring-blue-500/20",
    Contacted: "bg-yellow-100 text-yellow-800 ring-yellow-500/20",
    Qualified: "bg-green-100 text-green-800 ring-green-500/20",
    Cold: "bg-gray-100 text-gray-600 ring-gray-500/10",
    Converted: "bg-purple-100 text-purple-800 ring-purple-500/20",
  };
  const baseStyle = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset";
  return (
    <span className={`${baseStyle} ${colorMap[status] || "bg-gray-100 text-gray-600 ring-gray-500/10"}`}>
      {status}
    </span>
  );
}

// Score Badge with visually distinct tiers
function ScoreBadge({ score }) {
  let bgColor = "bg-gray-300 text-gray-700";
  if (score >= 80) bgColor = "bg-emerald-500 text-white"; // High score
  else if (score >= 50) bgColor = "bg-amber-500 text-white"; // Medium score
  else if (score >= 20) bgColor = "bg-orange-500 text-white"; // Low-medium score
  else bgColor = "bg-red-500 text-white"; // Very low score

  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  return (
    <span className={`${baseStyle} ${bgColor}`}>
      {score ?? "-"}
    </span>
  );
}

// --- Main LeadList Component ---
export default function LeadList() {
  const navigate = useNavigate();

  // Dummy Leads - Expanded with more data for a richer UI
  const dummyLeads = useMemo(() => [
    {
      id: "1",
      full_name: "Innovate Solutions Ltd.",
      email: "contact@innovate.com",
      phone: "+1 (555) 123-4567",
      type: "Business",
      status: "New",
      score: 85,
      source: "Website Form",
      created_at: "2025-07-10T14:30:00Z",
      last_contact: "2025-07-10T14:30:00Z",
      tags: ["High Potential", "Software", "Enterprise"],
    },
    {
      id: "2",
      full_name: "Alice Wonderland",
      email: "alice@example.com",
      phone: "+44 20 7946 0958",
      type: "Individual",
      status: "Contacted",
      score: 62,
      source: "LinkedIn Ad",
      created_at: "2025-07-08T09:15:00Z",
      last_contact: "2025-07-09T11:00:00Z",
      tags: ["Marketing", "Follow Up"],
    },
    {
      id: "3",
      full_name: "Global Logistics Inc.",
      email: "sales@globalogistics.net",
      phone: "+1 (555) 987-6543",
      type: "Business",
      status: "Qualified",
      score: 91,
      source: "Referral",
      created_at: "2025-07-05T16:00:00Z",
      last_contact: "2025-07-07T10:00:00Z",
      tags: ["VIP", "Logistics", "Contract Pending"],
    },
    {
      id: "4",
      full_name: "Bob Builder",
      email: "bob@construction.com",
      phone: "+61 2 8087 0123",
      type: "Individual",
      status: "New",
      score: 40,
      source: "Cold Call",
      created_at: "2025-07-03T11:45:00Z",
      last_contact: "2025-07-03T11:45:00Z", // Initial contact
      tags: ["Construction"],
    },
    {
      id: "5",
      full_name: "Creative Designs Studio",
      email: "contact@creativedesigns.co",
      phone: "+33 1 23 45 67 89",
      type: "Business",
      status: "Contacted",
      score: 78,
      source: "Email Campaign",
      created_at: "2025-07-01T08:00:00Z",
      last_contact: "2025-07-02T15:00:00Z",
      tags: ["Design", "Proposal Sent"],
    },
    {
      id: "6",
      full_name: "Charlie Chaplin",
      email: "charlie@film.org",
      phone: "+49 30 12345678",
      type: "Individual",
      status: "Cold",
      score: 25,
      source: "Webinar",
      created_at: "2025-06-28T10:00:00Z",
      last_contact: "2025-07-01T09:00:00Z",
      tags: ["Historical", "No Interest"],
    },
    {
      id: "7",
      full_name: "Tech Solutions Inc.",
      email: "info@techsolutions.com",
      phone: "+1 (555) 234-5678",
      type: "Business",
      status: "New",
      score: 88,
      source: "Partner Referral",
      created_at: "2025-07-11T09:00:00Z",
      last_contact: "2025-07-11T09:00:00Z",
      tags: ["IT Services", "Urgent"],
    },
    {
      id: "8",
      full_name: "Diana Prince",
      email: "diana@amazon.com",
      phone: "+1 (555) 876-5432",
      type: "Individual",
      status: "Contacted",
      score: 70,
      source: "Event",
      created_at: "2025-07-09T13:00:00Z",
      last_contact: "2025-07-10T10:00:00Z",
      tags: ["Networking", "Follow Up"],
    },
  ], []);

  const [leads, setLeads] = useState(dummyLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 8; // Adjust page size for cleaner view

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null); // Used for both new and editing leads

  // Get all unique tags from leads for suggestions in TagSelector
  const allTags = useMemo(() => Array.from(new Set(leads.flatMap((lead) => lead.tags || []))), [leads]);

  // Lead fields configuration for the modal form
  const leadFields = useMemo(() => [
    { label: "Name / Company", name: "full_name", type: "text", required: true },
    { label: "Email", name: "email", type: "email" }, // Changed to type email
    { label: "Phone", name: "phone", type: "tel" }, // Changed to type tel
    {
      label: "Type",
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Business", value: "Business" },
        { label: "Individual", value: "Individual" },
      ],
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "New", value: "New" },
        { label: "Contacted", value: "Contacted" },
        { label: "Qualified", value: "Qualified" },
        { label: "Cold", value: "Cold" },
        { label: "Converted", value: "Converted" },
      ],
    },
    { label: "Score", name: "score", type: "number" },
    { label: "Source", name: "source", type: "text" },
    {
      label: "Tags",
      name: "tags",
      type: "custom",
      component: TagSelector, // Custom component for tags
      props: { existingTags: allTags }, // Pass all unique tags
    },
  ], [allTags]); // Re-memoize if allTags changes

  // Filtering and Sorting Logic - Memoized for performance
  const filteredAndSortedLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch = searchTerm === "" ||
          lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()); // Also search by email

        const matchesStatus = filterStatus === "" || lead.status === filterStatus;
        const matchesTag = filterTag === "" || (lead.tags && lead.tags.includes(filterTag));
        const matchesType = filterType === "" || lead.type === filterType;

        return matchesSearch && matchesStatus && matchesTag && matchesType;
      })
      .sort((a, b) => {
        const dir = sortDirection === "asc" ? 1 : -1;
        if (sortField === "created_at" || sortField === "last_contact") {
          return (new Date(a[sortField]) - new Date(b[sortField])) * dir;
        } else if (typeof a[sortField] === 'string') {
          return a[sortField].localeCompare(b[sortField]) * dir;
        } else {
          return (a[sortField] - b[sortField]) * dir;
        }
      });
  }, [leads, searchTerm, filterStatus, filterTag, filterType, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedLeads.length / pageSize);
  const currentLeads = filteredAndSortedLeads.slice((page - 1) * pageSize, page * pageSize);

  // Handlers
  const handleSort = useCallback((field) => {
    setSortDirection(prevDir => (field === sortField && prevDir === "asc" ? "desc" : "asc"));
    setSortField(field);
  }, [sortField]);


  const openEditModal = useCallback((lead) => {
    setFormData({ ...lead, tags: lead.tags || [] }); // Ensure tags is an array
    setShowEditModal(true);
  }, []);

  const handleInputChange = useCallback((name, value) => {
    setFormData((fd) => ({ ...fd, [name]: value }));
  }, []);

  const handleSubmit = useCallback((updatedData) => {
    setLeads(prevLeads =>
      prevLeads.map((lead) =>
        lead.id === updatedData.id ? { ...lead, ...updatedData } : lead
      )
    );
    setShowEditModal(false);
    setFormData(null);
  }, [setLeads]);

  const handleAddLead = useCallback((newLeadData) => {
    setLeads(prevLeads => [
      {
        ...newLeadData,
        id: `lead_${Date.now()}`, // Simple ID generation
        created_at: new Date().toISOString(),
        last_contact: new Date().toISOString(),
        score: Math.floor(Math.random() * 100) + 1, // Assign a random score for new leads
        tags: newLeadData.tags || [],
      },
      ...prevLeads,
    ]);
  }, [setLeads]);


  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 font-sans bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-gray-100">
        {/* Header and Add Lead Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-blue-800 drop-shadow-sm flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" /> Lead Management
          </h2>
          <AddLead onAddLead={handleAddLead} allTags={allTags} leadFields={leadFields} />
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 items-end">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="search" className="sr-only">Search leads</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                id="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setPage(1);
                  setSearchTerm(e.target.value);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
              />
            </div>
          </div>

          {[
            { label: "Status", value: filterStatus, setter: setFilterStatus, options: ["New", "Contacted", "Qualified", "Cold", "Converted"] },
            { label: "Type", value: filterType, setter: setFilterType, options: ["Individual", "Business"] },
            { label: "Tag", value: filterTag, setter: setFilterTag, options: allTags },
          ].map((filter, index) => (
            <div key={index}>
              <label htmlFor={`filter-${filter.label}`} className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
              <select
                id={`filter-${filter.label}`}
                value={filter.value}
                onChange={(e) => {
                  setPage(1);
                  filter.setter(e.target.value);
                }}
                className="block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-white appearance-none transition-all duration-200"
              >
                <option value="">All {filter.label}s</option>
                {filter.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("");
              setFilterTag("");
              setFilterType("");
              setPage(1);
            }}
            className="col-span-1 lg:col-span-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-1"
            title="Reset Filters"
          >
            <ListFilter className="w-4 h-4" /> Reset Filters
          </button>
        </div>


        {/* Leads Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                {[
                  { label: "Name / Company", field: "full_name" },
                  { label: "Email", field: "email" },
                  { label: "Phone", field: "phone" },
                  { label: "Type", field: "type" },
                  { label: "Status", field: "status" },
                  { label: "Score", field: "score" },
                  { label: "Source", field: "source" },
                  { label: "Tags", field: "tags" },
                  { label: "Created", field: "created_at" },
                  { label: "Last Contact", field: "last_contact" },
                  { label: "Actions", field: null },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${field ? 'cursor-pointer hover:bg-blue-700 transition' : ''}`}
                    onClick={field ? () => handleSort(field) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {field && <SortIcon active={sortField === field} direction={sortDirection} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentLeads.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-gray-500 text-lg">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    
                    className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate(`/crm/leadlist/${lead.id}`)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                      {lead.type === "Business" ? <Building2 className="w-4 h-4 text-gray-500" /> : <User className="w-4 h-4 text-gray-500" />}
                      {lead.full_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> {lead.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" /> {lead.phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {lead.type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <ScoreBadge score={lead.score} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {lead.source}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {lead.tags && lead.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/10">
                              <Tag className="w-3 h-3 mr-1" /> {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">No tags</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" /> {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" /> {new Date(lead.last_contact).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from navigating
                            openEditModal(lead);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                          title="Edit Lead"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from navigating
                            // Implement delete logic here, e.g., show confirmation dialog
                            alert(`Delete functionality for ${lead.full_name}`);
                          }}
                          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-between items-center bg-gray-50 px-6 py-4 rounded-lg shadow-inner border border-gray-100">
          <div className="text-sm text-gray-700">
            Showing {Math.min(filteredAndSortedLeads.length, (page - 1) * pageSize + 1)} to {Math.min(filteredAndSortedLeads.length, page * pageSize)} of {filteredAndSortedLeads.length} leads
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                page <= 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold text-sm">
              Page {page} of {totalPages === 0 ? 1 : totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                page >= totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Edit Lead Modal */}
        {showEditModal && (
          <ModalWithForm
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setFormData(null); // Clear form data on close
            }}
            onSubmit={handleSubmit}
            title="Edit Lead"
            fields={leadFields}
            formData={formData}
            onFieldChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
}