import React, { useEffect, useState } from "react";
import type { Product } from "../types";
import { api } from "../api/api";

api.get("/inventory"); // calls /api/products

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
      const res = await api.get("/products");
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
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
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
        await api.post("/products", { name, stock, price });
      } else {
        await api.put(`/products/${formProduct.id}`, { name, stock, price });
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Save product error:", err);
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

  return (
    <div className="container mt-4">
      <h2>Inventory Management</h2>
      <button className="btn btn-primary mb-3" onClick={openAddForm}>
        Add Product
      </button>

      {loading && <p>Loading products...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && products.length > 0 ? (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price (₱)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.stock}</td>
                <td>{p.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
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
      ) : (
        !loading && <p>No products found.</p>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div
          className="modal d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {formType === "add" ? "Add Product" : "Edit Product"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
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
                      min="0"
                      className="form-control"
                      value={formProduct.stock ?? ""}
                      onChange={(e) =>
                        setFormProduct({
                          ...formProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price (₱)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      value={formProduct.price ?? ""}
                      onChange={(e) =>
                        setFormProduct({
                          ...formProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
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
