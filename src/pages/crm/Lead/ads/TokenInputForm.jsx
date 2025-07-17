// TokenInputForm.jsx
import { useState } from "react";

export default function TokenInputForm({ onSave }) {
  const [platform, setPlatform] = useState("meta");
  const [token, setToken] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ platform, token });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="meta">Meta (Facebook/Instagram)</option>
        <option value="tiktok">TikTok</option>
      </select>

      <input
        type="text"
        placeholder="Paste API Access Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
        Connect
      </button>
    </form>
  );
}
