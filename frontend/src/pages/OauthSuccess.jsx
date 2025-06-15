import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function OauthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    axios.get(`${import.meta.env.VITE_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log("OAuth login:", token, res.data);
      login({ token, user: res.data });
      navigate("/");
    })
    .catch((err) => {
      console.error("OAuth error:", err);
      navigate("/login");
    });
  } else {
    navigate("/login");
  }
}, [login, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-600">Logging you in...</div>
    </div>
  );
}