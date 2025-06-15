import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateHousehold() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!name.trim()) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/households`, { name });
      localStorage.setItem("selectedHousehold", res.data._id);
      navigate("/dashboard");
    } catch {
      setMsg("Failed to create household.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-200">
      <form onSubmit={handleCreate} className="bg-white rounded-3xl shadow-xl p-10 flex flex-col gap-4 w-96">
        <h2 className="text-2xl font-bold text-purple-700">Create a new household</h2>
        <input
          className="border p-2 rounded"
          placeholder="Household name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-semibold">
          Create
        </button>
        {msg && <div className="text-red-500">{msg}</div>}
      </form>
    </div>
  );
}