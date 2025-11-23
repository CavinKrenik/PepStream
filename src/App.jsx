import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'

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

      <Footer />
    </>
  )
}
