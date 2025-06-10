import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Product, CartItem } from "../types";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";
const LIGHT_BG = "#F0F2F2";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [cash, setCash] = useState("");
  const [receipt, setReceipt] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/products");
      setProducts(res.data);
      setFiltered(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const term = value.toLowerCase();
    setFiltered(
      products.filter((product) => product.name.toLowerCase().includes(term))
    );
  };

  const addToCart = (product: Product) => {
    const input = window.prompt(
      `How many "${product.name}" would you like to add?`,
      "1"
    );
    if (!input) return;
    const quantity = parseInt(input, 10);
    if (isNaN(quantity) || quantity < 1)
      return alert("Please enter a valid quantity.");
    if (quantity > product.stock)
      return alert(`Only ${product.stock} in stock.`);

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
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
  const vat = (total * 12) / 112;
  const grandTotal = total;

  const handleCheckout = async () => {
    try {
      const payload = {
        total: total.toFixed(2),
        vat: vat.toFixed(2),
        cash: parseFloat(cash),
        change: (parseFloat(cash) - total).toFixed(2),
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await api.post("api/transactions", payload);

      if (res.status === 201) {
        let receiptText = "=== RECEIPT ===\n";
        receiptText += cart
          .map(
            (item) =>
              `${item.name} x${item.quantity} @ ₱${Number(item.price).toFixed(
                2
              )} = ₱${(Number(item.price) * item.quantity).toFixed(2)}`
          )
          .join("\n");
        receiptText += `\n----------------------\n`;
        receiptText += `Subtotal (incl. VAT): ₱${total.toFixed(2)}\n`;
        receiptText += `VAT (12%): ₱${vat.toFixed(2)}\n`;
        receiptText += `Total: ₱${grandTotal.toFixed(2)}\n`;
        receiptText += `Cash: ₱${Number(cash).toFixed(2)}\n`;
        receiptText += `Change: ₱${(Number(cash) - grandTotal).toFixed(2)}\n`;
        receiptText += `\nThank you for your purchase!`;

        setShowCart(false);
        setReceipt(receiptText);
        setCart([]);
        setCash("");
        alert("Transaction successful!");
        fetchProducts();
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Failed to process transaction.");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4" style={{ color: PRIMARY }}>
        Product List
      </h2>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Search product..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <button
          className="btn"
          style={{ backgroundColor: ACCENT, color: "#fff" }}
          onClick={() => setShowCart(true)}
        >
          View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <div>Loading products...</div>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead style={{ backgroundColor: PRIMARY, color: "#fff" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price (₱)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.stock}</td>
                  <td>{Number(p.price).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: ACCENT, color: "#fff" }}
                      onClick={() => addToCart(p)}
                      disabled={p.stock === 0}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Cart & Receipt Modals (unchanged) */}
      {showCart && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: PRIMARY }}
              >
                <h5 className="modal-title text-white">Cart</h5>
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
                            <td>{Number(item.price).toFixed(2)}</td>{" "}
                            {/* <-- Fix here */}
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
                            <td>
                              {(Number(item.price) * item.quantity).toFixed(2)}
                            </td>{" "}
                            {/* <-- Fix here */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mb-3">
                      <strong>Subtotal (incl. VAT):</strong> ₱{total.toFixed(2)}{" "}
                      <br />
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
                      className="btn"
                      style={{ backgroundColor: ACCENT, color: "#fff" }}
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
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: PRIMARY }}
              >
                <h5 className="modal-title text-white">Receipt</h5>
                <button
                  className="btn-close"
                  onClick={() => setReceipt(null)}
                ></button>
              </div>

              <div className="modal-body">
                <pre>{receipt}</pre>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: ACCENT, color: "#fff" }}
                  onClick={() => setReceipt(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
