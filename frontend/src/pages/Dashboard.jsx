import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Households from "../components/Households";
import ExpenseUpload from "../components/ExpenseUpload";
import { FaSignOutAlt, FaHome, FaPlus, FaReceipt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState("");
  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState("");
  const [msg, setMsg] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    if (!selectedHousehold) {
      navigate("/welcome");
      return;
    }
    axios.get(`${import.meta.env.VITE_API}/households`).then((r) => setHouseholds(r.data));
    axios.get(`${import.meta.env.VITE_API}/expenses?household=${selectedHousehold}`).then((r) => setExpenses(r.data));
  }, [selectedHousehold, navigate]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/households`)
      .then((r) => setHouseholds(r.data));
  }, []);

  useEffect(() => {
    if (selectedHousehold) {
      axios
        .get(`${import.meta.env.VITE_API}/expenses?household=${selectedHousehold}`)
        .then((r) => setExpenses(r.data));
    } else {
      setExpenses([]);
    }
  }, [selectedHousehold]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post(`${import.meta.env.VITE_API}/expenses`, {
        description: desc,
        amount: Number(amt),
        household: selectedHousehold,
        paidBy: user.id,
        involved: [user.id],
      });
      setDesc("");
      setAmt("");
      setMsg("Expense added!");
      refreshExpenses();
    } catch (e) {
      setMsg("Failed to add expense");
    }
  };

  const refreshExpenses = () => {
    if (selectedHousehold) {
      axios
        .get(`${import.meta.env.VITE_API}/expenses?household=${selectedHousehold}`)
        .then((r) => setExpenses(r.data));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-blue-100 to-pink-100 pb-10">
      <header className="flex items-center justify-between px-8 py-6 bg-white/60 backdrop-blur shadow-md">
        <div className="flex items-center gap-3">
          <FaHome className="text-2xl text-purple-700" />
          <span className="text-3xl font-extrabold text-purple-700 tracking-tight drop-shadow">Splitwise 2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-lg text-gray-600 font-semibold">
            Hi, {user?.name || user?.email || "User"}
          </span>
          <button
            className="flex items-center gap-2 bg-gradient-to-br from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition"
            onClick={logout}
            title="Logout"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-3">
        {/* Left sidebar: Households */}
        <aside className="md:col-span-1 bg-white bg-opacity-90 rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
            <FaHome /> Your Households
          </h2>
         <Households
  households={households}
  setHouseholds={setHouseholds}
  selected={selectedHousehold}
  onSelect={setSelectedHousehold}
/>
        </aside>

        {/* Main content */}
        <section className="md:col-span-2 flex flex-col gap-6">
          {selectedHousehold ? (
            <>
              {/* Expense Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Add expense form */}
                <div className="bg-gradient-to-br from-purple-200 to-purple-100 shadow-md rounded-xl p-6 flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2">
                    <FaPlus /> Add Expense
                  </h3>
                  <form onSubmit={handleAddExpense} className="flex flex-col gap-3">
                    <input
                      className="border border-purple-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      placeholder="Description"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      required
                    />
                    <input
                      className="border border-purple-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                      placeholder="Amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={amt}
                      onChange={(e) => setAmt(e.target.value)}
                      required
                    />
                    <button
                      className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full px-4 py-2 font-bold shadow hover:scale-105 transition flex items-center gap-2 justify-center"
                      type="submit"
                    >
                      <FaPlus /> Add
                    </button>
                  </form>
                  {msg && (
                    <div className={`text-sm mt-2 font-semibold ${msg.includes("added") ? "text-green-600" : "text-red-500"}`}>
                      {msg}
                    </div>
                  )}
                </div>
                {/* Receipt Upload */}
                <div className="bg-gradient-to-br from-blue-200 to-blue-100 shadow-md rounded-xl p-6 flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                    <FaReceipt /> Upload Receipt
                  </h3>
                  <ExpenseUpload
                    household={selectedHousehold}
                    onAdded={refreshExpenses}
                  />
                </div>
              </div>

              {/* Expenses List */}
              <div className="bg-white bg-opacity-90 shadow-md rounded-xl p-6 mt-2">
                <h3 className="text-xl font-bold text-gray-700 mb-3">Expenses</h3>
                <ul className="divide-y">
                  {expenses.length === 0 ? (
                    <li className="text-gray-400 italic">No expenses yet. Add one!</li>
                  ) : (
                    expenses.map((exp) => (
                      <li key={exp._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <span className="font-bold text-purple-700">{exp.description}</span>
                          <span className="ml-3 text-gray-500">({exp.category || "other"})</span>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center gap-4">
                          <span className="font-bold text-green-600 text-lg">₹{Number(exp.amount).toLocaleString()}</span>
                          <span className="text-sm text-gray-400">Paid by: <span className="font-semibold">{typeof exp.paidBy === "object" ? exp.paidBy.name || exp.paidBy.email : exp.paidBy}</span></span>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-xl p-12 shadow-md h-full min-h-[400px]">
              <FaHome className="text-6xl text-purple-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">Select a Household</h3>
              <p className="text-gray-500">Please choose or create a household from the left to view and add expenses.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;