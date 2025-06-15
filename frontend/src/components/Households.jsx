import React, { useState } from "react";
import { FaPlus, FaUsers } from "react-icons/fa";
import axios from "axios";
export default function Households({ households, setHouseholds, selected, onSelect }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const handleCreate = async (e) => {
  e.preventDefault();
  setMsg("");
  if (!name.trim()) return;
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API}/households`,
      { name }
      // No need to manually set headers here;
      // your AuthContext already sets the Authorization header for axios
    );
    const newHh = res.data;
    setHouseholds((prev) => [...prev, newHh]);
    setName("");
    setShowForm(false);
    setMsg("Created!");
  } catch {
    setMsg("Failed to create household.");
  }
};

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg text-purple-700 flex items-center gap-2">
          <FaUsers /> Households
        </span>
        <button
          className="flex items-center gap-1 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full shadow hover:scale-105 transition"
          onClick={() => setShowForm((v) => !v)}
        >
          <FaPlus />
          <span className="text-sm">{showForm ? "Cancel" : "Create"}</span>
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Household name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-1 rounded flex-1"
            autoFocus
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-3 rounded"
          >
            Create
          </button>
        </form>
      )}
      {msg && <div className="text-xs mt-1 mb-2">{msg}</div>}
      {households.length === 0 && <div className="text-gray-400 italic">No households yet.</div>}
      <ul className="space-y-2">
        {households.map((hh) => (
          <li key={hh._id}>
            <button
              className={`w-full text-left px-4 py-2 rounded shadow flex items-center gap-2 ${
                selected === hh._id
                  ? "bg-purple-200 font-bold border-l-4 border-purple-500"
                  : "bg-white hover:bg-purple-50"
              }`}
              onClick={() => onSelect(hh._id)}
            >
              <FaUsers className="text-purple-400" />
              <span>{hh.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}