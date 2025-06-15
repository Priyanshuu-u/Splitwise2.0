import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Register() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/auth/register`, form);
      login(res.data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded">
      <h2 className="text-xl mb-6 font-bold">Register</h2>
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input className="w-full border p-2" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="w-full border p-2" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button className="w-full bg-green-600 text-white p-2 rounded" type="submit">Register</button>
      </form>
    </div>
  );
}
export default Register;