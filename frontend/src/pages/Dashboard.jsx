import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();
  const [households, setHouseholds] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/households`).then(r => setHouseholds(r.data));
  }, []);

  useEffect(() => {
    if (selectedHousehold) {
      axios.get(`${import.meta.env.VITE_API}/expenses?household=${selectedHousehold}`).then(r => setExpenses(r.data));
    }
  }, [selectedHousehold]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.post(`${import.meta.env.VITE_API}/expenses`, {
        description: desc, amount: Number(amt), household: selectedHousehold, paidBy: user.id, involved: [user.id]
      });
      setDesc(''); setAmt('');
      setMsg('Expense added!');
      axios.get(`${import.meta.env.VITE_API}/expenses?household=${selectedHousehold}`).then(r => setExpenses(r.data));
    } catch (e) {
      setMsg('Failed to add expense');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
      </div>
      <div>
        <label>Select Household:</label>
        <select value={selectedHousehold} onChange={e => setSelectedHousehold(e.target.value)} className="border p-2 ml-2">
          <option value="">-- Select --</option>
          {households.map(hh => (
            <option key={hh._id} value={hh._id}>{hh.name}</option>
          ))}
        </select>
      </div>
      <form onSubmit={handleAddExpense} className="my-6 space-y-2">
        <input className="w-full border p-2" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input className="w-full border p-2" placeholder="Amount" type="number" value={amt} onChange={e => setAmt(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add Expense</button>
        {msg && <div className="text-green-600">{msg}</div>}
      </form>
      <div>
        <h3 className="font-bold">Expenses</h3>
        <ul>
          {expenses.map(exp => (
            <li key={exp._id}>{exp.description} - ₹{exp.amount} - {exp.category || 'other'}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default Dashboard;