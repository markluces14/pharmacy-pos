import React, { useEffect, useState } from "react";
import api from "../api/api";
import type { Transaction } from "../types";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/transactions");
      setTransactions(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchDate(value);
    const term = value.trim();
    if (!term) {
      setFiltered(transactions);
      return;
    }

    const dateOnly = (dateStr: string) =>
      new Date(dateStr).toISOString().split("T")[0];

    setFiltered(
      transactions.filter((tx) => dateOnly(tx.created_at).includes(term))
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: PRIMARY }}>
        Transaction History
      </h2>

      <div className="mb-3 d-flex justify-content-end">
        <input
          type="date"
          className="form-control"
          style={{ maxWidth: 250 }}
          value={searchDate}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <div className="mt-2">Loading transactions...</div>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded bg-white p-3">
          <table className="table table-bordered table-hover align-middle">
            <thead
              className="text-white"
              style={{
                backgroundColor: ACCENT,
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Cashier</th>
                <th>Total (₱)</th>
                <th>VAT (₱)</th>
                <th>Cash</th>
                <th>Change</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.id}</td>
                    <td>{new Date(tx.created_at).toLocaleString()}</td>
                    <td>{tx.user_name || "—"}</td>
                    <td className="text-success fw-bold">
                      ₱{Number(tx.total).toFixed(2)}
                    </td>
                    <td>₱{Number(tx.vat).toFixed(2)}</td>
                    <td>₱{Number(tx.cash).toFixed(2)}</td>
                    <td>₱{Number(tx.change).toFixed(2)}</td>
                    <td>
                      <ul className="mb-0 ps-3">
                        {tx.items.map((item, i) => (
                          <li key={i}>
                            <strong>{item.name}</strong> x{item.quantity} – ₱
                            {Number(item.price).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
