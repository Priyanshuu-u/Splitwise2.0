import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function ExpenseUpload({ household, onAdded }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: acceptedFiles => setFile(acceptedFiles[0])
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('No file selected');
    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('household', household);
    try {
      await axios.post(`${import.meta.env.VITE_API}/expenses/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Uploaded!');
      setFile(null);
      onAdded();
    } catch {
      setMsg('Upload failed');
    }
  };

  return (
    <form onSubmit={handleUpload} className="my-4 space-y-2">
      <div {...getRootProps()} className="border p-4 cursor-pointer bg-gray-50">
        <input {...getInputProps()} />
        {file ? file.name : "Drag 'n' drop receipt image, or click to select"}
      </div>
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Upload Receipt</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}