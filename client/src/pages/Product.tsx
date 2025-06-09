import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Product, CartItem } from "../types";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [cash, setCash] = useState("");
  const [receipt, setReceipt] = useState<string | null>(null);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const addToCart = (product: Product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = total * 0.12;
  const grandTotal = total + vat;

  const handleCheckout = async () => {
    try {
      const vatAmount = total * 0.12;
      const totalWithVat = total + vatAmount;

      const payload = {
        total: totalWithVat.toFixed(2),
        vat: vatAmount.toFixed(2),
        cash: parseFloat(cash),
        change: (parseFloat(cash) - totalWithVat).toFixed(2),
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await api.post("/transactions", payload); // Auth token is attached via axios

      if (res.status === 201) {
        alert("Transaction successful!");
        setCart([]); // reset cart state
        setCash(""); // clear cash input
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Failed to process transaction.");
    }
  };

  return (
    <div className="container">
      <h2>Product List</h2>
      <button
        className="btn btn-secondary mb-3"
        onClick={() => setShowCart(true)}
      >
        View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
      </button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Price (₱)</th>
            <th>Action</th>
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
                  className="btn btn-sm btn-success"
                  onClick={() => addToCart(p)}
                  disabled={p.stock === 0}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🛒 Cart Modal */}
      {showCart && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cart</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowCart(false)}
                ></button>
              </div>
              <div className="modal-body">
                {cart.length === 0 ? (
                  <p>No items in cart.</p>
                ) : (
                  <>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.price.toFixed(2)}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    item.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="form-control"
                                style={{ width: "80px" }}
                              />
                            </td>
                            <td>{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mb-3">
                      <strong>Subtotal:</strong> ₱{total.toFixed(2)} <br />
                      <strong>VAT (12%):</strong> ₱{vat.toFixed(2)} <br />
                      <strong>Total:</strong> ₱{grandTotal.toFixed(2)}
                    </div>
                    <div className="mb-3">
                      <label>Cash Payment (₱):</label>
                      <input
                        type="number"
                        value={cash}
                        onChange={(e) => setCash(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {receipt && (
        <div className="mt-4 alert alert-success">
          <h5>Receipt:</h5>
          <pre>{receipt}</pre>
        </div>
      )}
    </div>
  );
};

export default Products;
