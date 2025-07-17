import { useState } from "react";
import {
  Wrench,
  PlusCircle,
  Search,
  Edit3,
} from "lucide-react";
import ModalWithForm from "../../components/ui/modal"; // Adjust path if needed

const dummyTools = [
  {
    id: "TOOL-001",
    name: "Circular Saw",
    category: "Cutting Tool",
    condition: "Good",
    status: "Available",
    assignedTo: "",
    location: "Main Workshop",
  },
  {
    id: "TOOL-002",
    name: "Glue Gun",
    category: "Finishing Tool",
    condition: "Needs Repair",
    status: "Under Maintenance",
    assignedTo: "Mekdes",
    location: "Site B",
  },
];

const employeeOptions = ["", "Yonas", "Mekdes", "Abebe", "Sara"];

export default function ools() {
  const [tools, setTools] = useState(dummyTools);
  const [search, setSearch] = useState("");

  const [selectedTool, setSelectedTool] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredTools = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTool = (data) => {
    setTools((prev) => [...prev, data]);
  };

  const handleEditTool = (updatedTool) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === updatedTool.id ? { ...updatedTool } : tool
      )
    );
  };

  const toolFields = (tool = {}) => [
    { label: "ID", name: "id", type: "text", required: true, defaultValue: tool.id || "", disabled: !!tool.id },
    { label: "Name", name: "name", type: "text", required: true, defaultValue: tool.name || "" },
    { label: "Category", name: "category", type: "text", required: true, defaultValue: tool.category || "" },
    { label: "Location", name: "location", type: "text", defaultValue: tool.location || "" },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "Available", value: "Available" },
        { label: "In Use", value: "In Use" },
        { label: "Under Maintenance", value: "Under Maintenance" },
        { label: "Retired", value: "Retired" },
      ],
      defaultValue: tool.status || "Available"
    },
    {
      label: "Condition",
      name: "condition",
      type: "select",
      required: true,
      options: [
        { label: "Excellent", value: "Excellent" },
        { label: "Good", value: "Good" },
        { label: "Needs Repair", value: "Needs Repair" },
        { label: "Broken", value: "Broken" },
      ],
      defaultValue: tool.condition || "Good"
    },
    {
      label: "Assigned To",
      name: "assignedTo",
      type: "select",
      required: false,
      options: employeeOptions.map(emp => ({
        label: emp || "— Unassigned —",
        value: emp
      })),
      defaultValue: tool.assignedTo || ""
    }
  ];

  return (
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Wrench className="w-7 h-7" /> Tools & Machinery
      </h1>
      <p className="text-gray-600 mb-6">Manage tools, assignments, and maintenance.</p>

      {/* Search + Add */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Tool
        </button>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white border rounded-xl shadow p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{tool.name}</h3>
                <p className="text-xs text-gray-500">{tool.id}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedTool(tool);
                  setShowEditModal(true);
                }}
                className="text-blue-600"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm mt-1"><strong>Category:</strong> {tool.category}</p>
            <p className="text-sm"><strong>Status:</strong> {tool.status}</p>
            <p className="text-sm"><strong>Condition:</strong> {tool.condition}</p>
            <p className="text-sm"><strong>Location:</strong> {tool.location}</p>
            {tool.assignedTo && <p className="text-sm"><strong>Assigned To:</strong> {tool.assignedTo}</p>}
          </div>
        ))}
      </div>

      {/* Add Tool Modal */}
      <ModalWithForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTool}
        title="Add New Tool"
        fields={toolFields()}
      />

      {/* Edit Tool Modal */}
      <ModalWithForm
        isOpen={showEditModal}
        onClose={() => {
          setSelectedTool(null);
          setShowEditModal(false);
        }}
        onSubmit={handleEditTool}
        title={`Edit Tool – ${selectedTool?.name || ""}`}
        fields={selectedTool ? toolFields(selectedTool) : []}
      />
    </div>
  );
}
