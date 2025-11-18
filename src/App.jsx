import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function App() {
  const location = useLocation()
  const showBanner =
    location.pathname === '/' || location.pathname === '/store'

  return (
    <>
      <header className="site-header">
        <div className="logo-wrap">
          <Link to="/store">
            <img
              className="logo"
              src="/assets/logo.png"
              alt="PeptideStream Logo"
            />
          </Link>
        </div>
      </header>

      {showBanner && (
  <>
    <div className="promo-bar">
      <div className="promo-scroll">
        Orders over $150 ship FREE. Orders under $150 incur a flat $15 shipping fee.
      </div>
    </div>
    <div className="banner">
      <img src="/assets/ad.png" alt="Promo Banner" />
    </div>
  </>
)}


      <Outlet />

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} PeptideStream. All products are for
          laboratory research use only. Not for human consumption.
        </p>
        <div className="notice-card" style={{
  margin: "12px 0 18px",
  padding: "14px 18px",
  background: "rgba(15,23,42,0.6)",
  border: "1px solid var(--line)",
  borderRadius: "12px",
  fontSize: "14px",
  lineHeight: "1.5",
  color: "var(--muted)"
}}>
  <strong style={{ color: "var(--text)" }}>Why We Don’t Accept Credit or Debit Cards</strong>
  <br /><br />
  Due to current U.S. banking and processor restrictions on peptide-based research
  materials, PeptideStream is unable to offer direct credit or debit card checkout.
  To ensure compliant ordering, all purchases are submitted through our secure
  email order system.<br /><br />
  After your order is received, we will contact you with approved payment options
  and a direct link to complete payment.<br /><br />
  For assistance or questions, email us anytime at:
  <span style={{ color: "var(--accent)" }}> peptidestream@gmail.com</span>.
</div>

        <nav>
          <Link to="/terms">Terms &amp; Conditions of Sale</Link>
          <span> · </span>
          <Link to="/contact">Contact</Link>
        </nav>
      </footer>
    </>
  )
}
