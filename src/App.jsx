import React from 'react'
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import Footer from './components/Footer.jsx'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const isStoreLike =
    location.pathname === '/store' || location.pathname === '/'
  const showBanner = isStoreLike

  return (
    <>
      <header className="site-header">
        <div className="logo-wrap">
          <button
            type="button"
            onClick={() => navigate('/store')}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <img
              className="logo"
              src="/assets/logo.png"
              alt="PeptideStream Logo"
            />
          </button>
        </div>
      </header>

      {showBanner && (
        <>
          <div className="promo-bar">
            <div className="promo-scroll">
              Orders over $150 ship FREE. Orders under $150 incur a flat
              $15 shipping fee.
            </div>
          </div>

          <div className="banner">
            <img src="/assets/ad.png" alt="Promo Banner" />
          </div>
        </>
      )}

      {/* NAV: only Store + Contact now */}
      <nav className="main-nav" aria-label="Main Navigation">
        <div className="main-nav-inner">
          {/* Store / Cart button */}
          <button
            type="button"
            className={isStoreLike ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              if (location.pathname === '/store') {
                // Tell the Store page to open the cart drawer
                window.dispatchEvent(new CustomEvent('open-cart'))
              } else {
                navigate('/store')
              }
            }}
          >
            <img
              src="/assets/shopping-cart.svg"
              alt=""
              className="nav-icon"
            />
            Store
          </button>

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

      <Outlet />

      <Footer />
    </>
  )
}
