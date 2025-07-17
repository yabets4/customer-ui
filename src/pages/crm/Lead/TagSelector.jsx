import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";

export default function TagSelector({ tags = [], selectedTags = [], onChange }) {
  const [newTag, setNewTag] = useState("");

  function addTag() {
    const trimmed = newTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      onChange([...selectedTags, trimmed]);
      setNewTag("");
    }
  }

  function removeTag(tagToRemove) {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div>
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-gray-300"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Tag Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new tag"
          className="border rounded px-3 py-2 flex-grow"
          aria-label="Add new tag"
        />
        <button
          type="button"
          onClick={addTag}
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-1"
          aria-label="Add tag"
        >
          <PlusCircle className="w-5 h-5" /> Add
        </button>
      </div>

      {/* Existing Tags Suggestions */}
      {tags.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          <p className="mb-1">Suggested Tags:</p>
          <div className="flex flex-wrap gap-2">
            {tags
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onChange([...selectedTags, tag])}
                  className="bg-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-300"
                >
                  {tag}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
