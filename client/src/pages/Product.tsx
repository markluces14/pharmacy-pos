import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Product, CartItem } from "../types";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";
const LIGHT_BG = "#F0F2F2";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [cash, setCash] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityInput, setQuantityInput] = useState("1");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [readyToShowReceipt, setReadyToShowReceipt] = useState(false);

  const printAndDownloadReceipt = async () => {
    const doc = new jsPDF();
    const lines = receipt?.split("\n") || [];

    // Add receipt text
    lines.forEach((line, i) => {
      doc.text(line, 10, 10 + i * 7);
    });

    // Generate QR code for the feedback form
    const feedbackLink = "https://forms.gle/3naZhypdurNQ9n5B9";
    const qrDataUrl = await QRCode.toDataURL(feedbackLink);

    // Add some space and a label
    const startY = 10 + lines.length * 7 + 10;
    doc.text("Scan to give feedback:", 10, startY);
    doc.addImage(qrDataUrl, "PNG", 10, startY + 5, 40, 40);

    doc.save("receipt.pdf");
  };

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
    setSelectedProduct(product);
    setQuantityInput("1");
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
  const discountAmount = (total * discountPercent) / 100;
  const discountedTotal = total - discountAmount;
  const vat = (discountedTotal * 12) / 112;
  const grandTotal = discountedTotal;

  const handleCheckout = async () => {
    if (!cash || parseFloat(cash) < grandTotal) {
      return alert("Please enter sufficient cash.");
    }

    try {
      setProcessing(true);
      const payload = {
        total: discountedTotal.toFixed(2),
        vat: vat.toFixed(2),
        discount: discountAmount.toFixed(2),
        discount_percent: discountPercent,
        cash: parseFloat(cash),
        change: (parseFloat(cash) - discountedTotal).toFixed(2),
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await api.post("api/transactions", payload);

      if (res.status === 201) {
        let receiptText = `
Pharmalink Pharmacy
Filamer Christian University
Contact: #09665681940
Email: pharmalink.pos@gmail.com
------------------------------
RECEIPT
Date: ${new Date().toLocaleString()}
------------------------------\n`;

        receiptText += cart
          .map(
            (item) =>
              `${item.name} x${item.quantity} @ ${formatCurrency(
                item.price
              )} = ${formatCurrency(item.price * item.quantity)}`
          )
          .join("\n");

        receiptText += `\n----------------------\n`;
        receiptText += `Subtotal (incl. VAT): ${formatCurrency(total)}\n`;
        receiptText += `Discount: ${formatCurrency(
          discountAmount
        )} (${discountPercent}%)\n`;
        receiptText += `Discounted Total: ${formatCurrency(discountedTotal)}\n`;
        receiptText += `VAT (12%): ${formatCurrency(vat)}\n`;
        receiptText += `Total: ${formatCurrency(grandTotal)}\n`;
        receiptText += `Cash: ${formatCurrency(Number(cash))}\n`;
        receiptText += `Change: ${formatCurrency(
          Number(cash) - grandTotal
        )}\n\n`;
        receiptText += `Thank you for your purchase!`;

        setShowCart(false);
        setReceipt(receiptText);
        setShowSuccessModal(true); // Show success first
        setCart([]);
        setCash("");
        setDiscountPercent(0);
        fetchProducts();
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Failed to process transaction.");
    } finally {
      setProcessing(false);
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
              <th>Price</th>
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
                  <td>{formatCurrency(p.price)}</td>
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

      {/* Cart Modal */}
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
                            <td>{formatCurrency(item.price)}</td>
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
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mb-3">
                      <label>Discount (%):</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) =>
                          setDiscountPercent(Number(e.target.value))
                        }
                        className="form-control"
                      />
                    </div>

                    <div className="mb-3">
                      <strong>Subtotal (incl. VAT):</strong>{" "}
                      {formatCurrency(total)} <br />
                      <strong>Discount:</strong>{" "}
                      {formatCurrency(discountAmount)} ({discountPercent}%)
                      <br />
                      <strong>Discounted Total:</strong>{" "}
                      {formatCurrency(discountedTotal)} <br />
                      <strong>VAT (12%):</strong> {formatCurrency(vat)} <br />
                      <strong>Total to Pay:</strong>{" "}
                      {formatCurrency(grandTotal)}
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
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Checkout"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && readyToShowReceipt && (
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
                  onClick={() => {
                    setReceipt(null);
                    setReadyToShowReceipt(false);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <pre>{receipt}</pre>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: ACCENT, color: "#fff" }}
                  onClick={printAndDownloadReceipt}
                >
                  Print Receipt
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: PRIMARY, color: "#fff" }}
                  onClick={() => {
                    setReceipt(null);
                    setReadyToShowReceipt(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
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
                <h5 className="modal-title text-white">
                  Transaction Successful
                </h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setReadyToShowReceipt(true);
                  }}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p>✅ Thank you for your purchase!</p>
                <p>Your receipt has been generated.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: ACCENT, color: "#fff" }}
                  onClick={() => {
                    setShowSuccessModal(false);
                    setReadyToShowReceipt(true);
                  }}
                >
                  View Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
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
                <h5 className="modal-title text-white">
                  Add to Cart - {selectedProduct.name}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedProduct(null)}
                ></button>
              </div>
              <div className="modal-body" style={{ backgroundColor: LIGHT_BG }}>
                <label htmlFor="quantity">
                  Quantity (Max: {selectedProduct.stock})
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  className="form-control"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: ACCENT, color: "#fff" }}
                  onClick={() => {
                    const quantity = parseInt(quantityInput, 10);
                    if (isNaN(quantity) || quantity < 1) {
                      alert("Enter a valid quantity.");
                    } else if (quantity > selectedProduct.stock) {
                      alert(`Only ${selectedProduct.stock} in stock.`);
                    } else {
                      const exists = cart.find(
                        (item) => item.id === selectedProduct.id
                      );
                      if (exists) {
                        setCart(
                          cart.map((item) =>
                            item.id === selectedProduct.id
                              ? { ...item, quantity: item.quantity + quantity }
                              : item
                          )
                        );
                      } else {
                        setCart([...cart, { ...selectedProduct, quantity }]);
                      }
                      setSelectedProduct(null);
                    }
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: "#ccc" }}
                  onClick={() => setSelectedProduct(null)}
                >
                  Cancel
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
