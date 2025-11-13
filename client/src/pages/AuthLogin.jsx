import React, { useState } from "react";
import { API_BASE } from "../api";
import { useNavigate } from "react-router-dom";

export default function AuthLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);

    const payload = {
      email: fd.get("email"),
      password: fd.get("password"),
    };

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      alert("Login successful!");
      navigate("/");
    } catch (e) {
      setError("Unable to connect to server");
    }
  }

  return (
    <div className="container py-10 max-w-md mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

      {error && (
        <div className="bg-red-200 text-red-700 p-2 rounded mb-3">{error}</div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-3 card">
        <input
          name="email"
          type="email"
          className="p-2 border rounded"
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          className="p-2 border rounded"
          placeholder="Password"
          required
        />

        <button className="btn btn-primary mt-2">Login</button>
      </form>

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <span
          className="text-brand-700 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Signup
        </span>
      </p>
    </div>
  );
}
