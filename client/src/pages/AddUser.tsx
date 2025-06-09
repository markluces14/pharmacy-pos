import React, { useState } from "react";
import api from "../api/api";
import type { NewUser } from "../types";

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
      await api.post("/users", form);
      setMessage("User added successfully!");
      setForm({ name: "", email: "", password: "", role: "cashier" });
    } catch (err: any) {
      setMessage("Failed to add user.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add User</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>Name</label>
          <input
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
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
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            name="role"
            className="form-control"
            value={form.role}
            onChange={handleChange}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
