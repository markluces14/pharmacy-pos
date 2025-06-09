import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Product } from "../types";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"add" | "edit">("add");
  const [formProduct, setFormProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
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
    if (confirm("Are you sure you want to delete this product?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, stock, price } = formProduct;

    if (!name || stock === undefined || price === undefined) {
      alert("Please fill all fields");
      return;
    }

    if (formType === "add") {
      await api.post("/products", { name, stock, price });
    } else {
      await api.put(`/products/${formProduct.id}`, { name, stock, price });
    }

    setShowForm(false);
    fetchProducts();
  };

  return (
    <div className="container">
      <h2>Inventory Management</h2>
      <button className="btn btn-primary mb-3" onClick={openAddForm}>
        Add Product
      </button>

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
                  onClick={() => handleDelete(p.id!)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Product Form Modal */}
      {showForm && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {formType === "add" ? "Add Product" : "Edit Product"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowForm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formProduct.name || ""}
                      onChange={(e) =>
                        setFormProduct({ ...formProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formProduct.stock ?? ""}
                      onChange={(e) =>
                        setFormProduct({
                          ...formProduct,
                          stock: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Price (₱)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formProduct.price ?? ""}
                      onChange={(e) =>
                        setFormProduct({
                          ...formProduct,
                          price: parseFloat(e.target.value),
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
                    onClick={() => setShowForm(false)}
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
