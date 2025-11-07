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
    <Link to="/store" className="brand-link">
      <img
        className="logo"
        src="/assets/logo.png"
        alt="PeptideStream Logo"
      />
      <div className="brand-text">
        <span className="brand-name">PeptideStream</span>
        <span className="brand-tagline">
          Laboratory research-use only. Not for human consumption.
        </span>
      </div>
    </Link>
  </div>
</header>


      {showBanner && (
        <div className="banner">
          <img src="/assets/ad.png" alt="Promo Banner" />
        </div>
      )}

      <Outlet />

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} PeptideStream. All products are for
          laboratory research use only. Not for human consumption.
        </p>
        <nav>
          <Link to="/terms">Terms &amp; Conditions of Sale</Link>
          <span> · </span>
          <Link to="/contact">Contact</Link>
        </nav>
      </footer>
    </>
  )
}
