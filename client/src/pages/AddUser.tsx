import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { NewUser } from "../types";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";
const LIGHT_BG = "#F0F2F2";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AddUser = () => {
  const [form, setForm] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage("❌ Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: {
        name: string;
        email: string;
        role: string;
        password?: string;
      } = {
        name: form.name,
        email: form.email,
        role: form.role,
      };

      if (!editingUser || form.password.trim() !== "") {
        payload["password"] = form.password;
      }

      if (editingUser) {
        await api.put(`/api/users/${editingUser.id}`, payload);
        setMessage("✅ User updated successfully!");
      } else {
        await api.post("/api/users", payload);
        setMessage("✅ User added successfully!");
      }

      setForm({ name: "", email: "", password: "", role: "cashier" });
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      setMessage("❌ Failed to save user.");
    }
  };

  const handleEdit = (user: User) => {
    // Validate or cast role value to match the NewUser type
    const allowedRoles = ["admin", "manager", "cashier"] as const;
    const role = allowedRoles.includes(user.role as any)
      ? (user.role as (typeof allowedRoles)[number])
      : "cashier"; // fallback

    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: role,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: LIGHT_BG }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={{ color: PRIMARY }}>User Management</h4>
        <button
          className="btn"
          style={{ backgroundColor: ACCENT, color: "#fff" }}
          onClick={() => {
            setShowModal(true);
            setEditingUser(null);
            setForm({ name: "", email: "", password: "", role: "cashier" });
          }}
        >
          Add User
        </button>
      </div>

      {message && <div className="alert alert-info py-2 mb-3">{message}</div>}

      <div className="table-responsive shadow-sm rounded bg-white p-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-info" role="status"></div>
            <p className="mt-2">Loading users...</p>
          </div>
        ) : (
          <table className="table table-bordered table-hover align-middle">
            <thead style={{ backgroundColor: ACCENT, color: "#fff" }}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div
                  className="modal-header"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <h5 className="modal-title text-white">
                    {editingUser ? "Edit User" : "Add New User"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setEditingUser(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-2">
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

                  <div className="mb-2">
                    <label className="form-label">
                      Password{" "}
                      {editingUser ? "(leave blank to keep current)" : ""}
                    </label>
                    <input
                      name="password"
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      required={!editingUser}
                    />
                  </div>

                  <div className="mb-2">
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
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingUser(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: ACCENT, color: "#fff" }}
                  >
                    {editingUser ? "Update" : "Save"} User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
