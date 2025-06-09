import React, { useEffect, useState } from "react";
import type { Transaction } from "../types";
import { api } from "../api/api";

api.get("/transactions"); // calls /api/products

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data);
  };

  return (
    <div className="container">
      <h2>Transaction History</h2>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
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
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{new Date(tx.created_at).toLocaleString()}</td>
              <td>{tx.user_name || "—"}</td>
              <td>₱{tx.total.toFixed(2)}</td>
              <td>₱{tx.vat.toFixed(2)}</td>
              <td>₱{tx.cash.toFixed(2)}</td>
              <td>₱{tx.change.toFixed(2)}</td>
              <td>
                <ul className="list-unstyled mb-0">
                  {tx.items.map((item, i) => (
                    <li key={i}>
                      {item.name} x{item.quantity} - ₱{item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
