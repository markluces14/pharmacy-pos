import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Product } from "../types";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";
const LIGHT_BG = "#F0F2F2";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"add" | "edit">("add");
  const [formProduct, setFormProduct] = useState<Partial<Product>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setFormType("add");
    setFormProduct({});
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setFormType("edit");
    setFormProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchProducts();
      } catch {
        alert("Failed to delete product.");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, stock, price } = formProduct;

    if (!name || stock === undefined || price === undefined) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (formType === "add") {
        await api.post("/api/products", { name, stock, price });
      } else {
        await api.put(`/api/products/${formProduct.id}`, {
          name,
          stock,
          price,
        });
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert("Failed to save product.");
    }
  };

  const handleCancel = () => {
    if (formType === "edit" && window.confirm("Discard changes?")) {
      setShowForm(false);
    } else if (formType === "add") {
      setShowForm(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: PRIMARY }}>
        Inventory Management
      </h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "300px" }}
        />

        <button
          className="btn"
          style={{
            backgroundColor: ACCENT,
            color: "#fff",
            borderRadius: "0.5rem",
          }}
          onClick={openAddForm}
        >
          + Add Product
        </button>
      </div>

      {loading && (
        <div className="text-center text-muted my-4">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && filteredProducts.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover rounded shadow-sm">
            <thead style={{ backgroundColor: PRIMARY, color: "#fff" }}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price (₱)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.stock}</td>
                  <td>{Number(p.price).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm me-2"
                      style={{ backgroundColor: PRIMARY, color: "#fff" }}
                      onClick={() => openEditForm(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-muted">No products found.</p>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content rounded">
              <form onSubmit={handleFormSubmit}>
                <div
                  className="modal-header"
                  style={{ backgroundColor: PRIMARY, color: "#fff" }}
                >
                  <h5 className="modal-title">
                    {formType === "add" ? "Add Product" : "Edit Product"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    aria-label="Close"
                    onClick={handleCancel}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formProduct.name ?? ""}
                      onChange={(e) =>
                        setFormProduct({ ...formProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formProduct.stock ?? ""}
                      onChange={(e) =>
                        setFormProduct({
                          ...formProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      min={0}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price (₱)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formProduct.price ?? ""}
                      onChange={(e) =>
                        setFormProduct({
                          ...formProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      min={0}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: ACCENT, color: "#fff" }}
                  >
                    {formType === "add" ? "Add" : "Update"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
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

export default Inventory;
