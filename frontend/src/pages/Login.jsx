import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/auth/login`, { email, password });
      login(res.data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API}/auth/google`;
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded">
      <h2 className="text-xl mb-6 font-bold">Login</h2>
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">Login</button>
      </form>
      <button onClick={handleGoogle} className="w-full mt-4 flex items-center justify-center bg-red-500 text-white p-2 rounded">
        <span className="mr-2">Sign in with Google</span>
        <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7c-1.1 3-4.2 5.5-7.7 5.5-4.7 0-8.5-3.8-8.5-8.5s3.8-8.5 8.5-8.5c2.1 0 4.1.8 5.6 2.2l6.5-6.5C37.8 9.3 31.3 6 24 6c-9.9 0-18 8.1-18 18s8.1 18 18 18c8.8 0 16.5-6.2 18-14.5V20z"/></g></svg>
      </button>
    </div>
  );
}
export default Login;