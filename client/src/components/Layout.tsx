import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div
        className="flex-grow-1 p-4"
        style={{ marginLeft: "250px", backgroundColor: "#F0F2F2" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
