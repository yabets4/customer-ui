import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Tag,
  User,
  Calendar,
  PlusCircle,
} from "lucide-react";
import ActivityTimeline from "./ActivityTimeline"; // ✅ Make sure this is imported

const LeadDetail = ({ lead, onClose }) => {
  const navigate = useNavigate();
  const [leadActivities, setLeadActivities] = useState(lead?.activities || []);
  const [newActivity, setNewActivity] = useState({
    type: "note",
    description: "",
  });
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [leadTags, setLeadTags] = useState(lead?.tags || []);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag && !leadTags.includes(newTag)) {
      setLeadTags((prev) => [...prev, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setLeadTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const submitActivity = () => {
    const activity = {
      ...newActivity,
      timestamp: new Date().toISOString(),
      user: "Your Name", // replace with real user later
    };

    setLeadActivities((prev) => [...prev, activity]);
    setNewActivity({ type: "note", description: "" });
    setShowActivityForm(false);
  };

  if (!lead) return <div className="p-4 text-red-600">Lead not found.</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lead Detail</h2>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:underline"
        >
          Close
        </button>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Name / Company</p>
          <p className="text-lg font-medium flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            {lead.full_name}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-base flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-500" />
            {lead.email || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-base flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-400" />
            {lead.phone || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Type & Score</p>
          <p className="text-base flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-500" />
            {lead.type} |{" "}
            <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-md text-sm font-bold">
              {lead.score}
            </span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Source</p>
          <p className="text-base">{lead.source || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created</p>
          <p className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            {new Date(lead.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Tags</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {leadTags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 px-2 py-0.5 rounded text-sm font-medium flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-red-500 text-xs"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add new tag"
            className="border px-2 py-1 rounded text-sm"
          />
          <button
            onClick={addTag}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mt-8">
        <ActivityTimeline
          activities={leadActivities}
          onAddActivity={() => setShowActivityForm(true)}
        />
      </div>

      {/* Add Activity Form */}
      {showActivityForm && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-2">New Activity</h4>
          <select
            value={newActivity.type}
            onChange={(e) =>
              setNewActivity((a) => ({ ...a, type: e.target.value }))
            }
            className="mb-2 px-3 py-1 rounded border"
          >
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="update">Status Update</option>
          </select>
          <textarea
            rows="3"
            className="w-full border rounded p-2 mb-2"
            placeholder="Activity description..."
            value={newActivity.description}
            onChange={(e) =>
              setNewActivity((a) => ({ ...a, description: e.target.value }))
            }
          />
          <div className="flex gap-2">
            <button
              onClick={submitActivity}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setShowActivityForm(false)}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
