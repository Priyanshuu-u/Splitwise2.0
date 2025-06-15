import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Households({ selected, onSelect }) {
  const [households, setHouseholds] = useState([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/households`)
      .then(res => setHouseholds(res.data))
      .catch(() => setHouseholds([]));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/households`, { name });
      setHouseholds([...households, res.data]);
      setName('');
      setMsg('Created!');
    } catch {
      setMsg('Could not create household.');
    }
  };

  return (
    <div className="border p-3 rounded mb-4 bg-white">
      <h3 className="font-bold">Your Households</h3>
      <ul className="my-2">
        {households.map(hh => (
          <li key={hh._id}>
            <button
              className={`p-2 w-full text-left rounded ${selected === hh._id ? 'bg-purple-200' : 'hover:bg-gray-100'}`}
              onClick={() => onSelect(hh._id)}
            >{hh.name}</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreate} className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="New household name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-1 rounded flex-1"
        />
        <button className="bg-purple-600 text-white px-3 rounded" type="submit">Create</button>
      </form>
      {msg && <div className="text-xs mt-1">{msg}</div>}
    </div>
  );
}