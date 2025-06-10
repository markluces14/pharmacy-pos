import React, { useEffect, useState } from "react";
import api from "../api/api";

const PRIMARY = "#2E4A70";
const ACCENT = "#24B0BA";
const LIGHT_BG = "#F0F2F2";

const Dashboard: React.FC = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [lowStock, setLowStock] = useState<
    { id: number; name: string; stock: number }[]
  >([]);
  const [loading, setLoading] = useState(true); // <-- New loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/dashboard-summary");
        setTotalSales(res.data.total_sales);
        setCustomerCount(res.data.customer_count);
        setLowStock(res.data.low_stock);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false); // <-- Stop loading after fetch
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "4rem", height: "4rem", color: PRIMARY }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: PRIMARY }}>
        Dashboard Overview
      </h2>

      <div className="row g-4">
        {/* Total Sales Card */}
        <div className="col-md-4">
          <div
            className="card text-white shadow"
            style={{ backgroundColor: ACCENT, borderRadius: "1rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">Total Sales Today</h5>
              <p className="display-6">₱ {totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Customers Today Card */}
        <div className="col-md-4">
          <div
            className="card shadow"
            style={{
              backgroundColor: LIGHT_BG,
              borderLeft: `5px solid ${PRIMARY}`,
              borderRadius: "1rem",
            }}
          >
            <div className="card-body">
              <h5 className="card-title text-secondary">Customers Today</h5>
              <p className="display-6 fw-semibold" style={{ color: PRIMARY }}>
                {customerCount}
              </p>
            </div>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="col-md-4">
          <div
            className="card shadow-sm"
            style={{ border: `1px solid ${ACCENT}`, borderRadius: "1rem" }}
          >
            <div className="card-body">
              <h5 className="card-title" style={{ color: PRIMARY }}>
                Low Stock Medicines
              </h5>
              <ul className="list-unstyled mb-0">
                {lowStock.length === 0 ? (
                  <li className="text-muted">No low stock</li>
                ) : (
                  lowStock.map((item) => (
                    <li key={item.id} className="mb-1">
                      {item.name} —{" "}
                      <span className="text-danger fw-bold">
                        {item.stock} left
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
