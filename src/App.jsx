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

      {/* 🔽 NAV NOW ALWAYS VISIBLE */}
      <nav className="main-nav" aria-label="Main Navigation">
        <div className="main-nav-inner">

          <Link
            to="/store"
            className={
              location.pathname === '/store' ||
              location.pathname === '/'
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            <img
              src="/assets/shopping-cart.svg"
              alt=""
              className="nav-icon"
            />
            Store
          </Link>

          <Link
            to="/terms"
            className={
              location.pathname === '/terms' ? 'nav-link active' : 'nav-link'
            }
          >
            Terms
          </Link>

          <Link
            to="/privacy"
            className={
              location.pathname === '/privacy'
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Privacy
          </Link>

          <Link
            to="/refund"
            className={
              location.pathname === '/refund'
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Refund Policy
          </Link>

          <Link
            to="/disclaimer"
            className={
              location.pathname === '/disclaimer'
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Research Use Only
          </Link>

          <Link
            to="/contact"
            className={
              location.pathname === '/contact'
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Contact
          </Link>

        </div>
      </nav>

      {/* Banner stays only on home + store */}
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
