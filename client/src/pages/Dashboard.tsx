import React, { useEffect, useState } from "react";
import api from "../api/api";

const Dashboard: React.FC = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [lowStock, setLowStock] = useState<
    { id: number; name: string; stock: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard-summary");
        setTotalSales(res.data.total_sales);
        setCustomerCount(res.data.customer_count);
        setLowStock(res.data.low_stock);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      <div className="row my-3">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5>Total Sales Today</h5>
            <p className="fs-4 text-success">₱ {totalSales.toFixed(2)}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5>Customers Today</h5>
            <p className="fs-4">{customerCount}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5>Low Stock Medicines</h5>
            <ul className="list-unstyled mb-0">
              {lowStock.length === 0 && <li>No low stock</li>}
              {lowStock.map((item) => (
                <li key={item.id}>
                  {item.name} —{" "}
                  <span className="text-danger">{item.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
