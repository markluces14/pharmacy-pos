import React, { useState } from "react";
import api from "../api/api";
import type { NewUser } from "../types";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";

const AddUser = () => {
  const [form, setForm] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/users", form);
      setMessage("✅ User added successfully!");
      setForm({ name: "", email: "", password: "", role: "cashier" });
    } catch (err) {
      console.error("Error adding user:", err);
      setMessage("❌ Failed to add user. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center py-5">
      <div
        className="w-100 p-4 shadow-sm rounded"
        style={{
          maxWidth: 500,
          backgroundColor: "#fff",
          borderLeft: `8px solid ${ACCENT}`,
        }}
      >
        <h3 className="mb-4" style={{ color: PRIMARY }}>
          Add New User
        </h3>

        {message && (
          <div
            className="alert alert-info py-2"
            style={{ transition: "all 0.3s ease" }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>

          <button
            className="btn w-100"
            type="submit"
            style={{
              backgroundColor: ACCENT,
              color: "#fff",
              borderRadius: "0.5rem",
              padding: "0.6rem",
            }}
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
