import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Welcome() {
  const { user } = useAuth();
  const [households, setHouseholds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/households`)
      .then(res => setHouseholds(res.data));
  }, []);

  const handleSelect = (hhId) => {
    localStorage.setItem("selectedHousehold", hhId);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-pink-100">
      <div className="bg-white rounded-3xl p-12 shadow-xl flex flex-col items-center gap-6">
        <img src={user?.picture || "/default-avatar.png"} alt="profile" className="w-28 h-28 rounded-full shadow" />
        <h1 className="text-3xl font-bold text-purple-700">Welcome, {user?.name || user?.email || "User"}!</h1>
        <h2 className="text-xl mt-2 text-gray-700">Choose your household</h2>
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {households.map(hh => (
            <button
              key={hh._id}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-lg font-semibold shadow transition"
              onClick={() => handleSelect(hh._id)}
            >
              {hh.name}
            </button>
          ))}
          <button
            onClick={() => navigate("/create-household")}
            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-lg font-semibold shadow transition"
          >
            + Create New
          </button>
        </div>
      </div>
    </div>
  );
}