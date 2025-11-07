import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container text-center" style={{ padding: "80px 20px" }}>
      <img
        src="/assets/logo.png"
        alt="PeptideStream Logo"
        style={{ width: "120px", opacity: 0.8 }}
      />
      <h1 style={{ fontSize: "2rem", marginTop: "1rem", color: "#38bdf8" }}>
        404 – Page Not Found
      </h1>
      <p style={{ marginTop: "0.5rem", color: "#ccc" }}>
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <Link
        to="/store"
        style={{
          display: "inline-block",
          marginTop: "1.5rem",
          background: "#0ea5e9",
          color: "white",
          padding: "10px 18px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Return to Store
      </Link>
    </main>
  );
}
