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

  // ⭐ LIVE CART COUNT FROM STORE
  const [navCartCount, setNavCartCount] = React.useState(0)

  React.useEffect(() => {
    function handleCount(e) {
      setNavCartCount(e.detail || 0)
    }
    window.addEventListener('cart-count', handleCount)
    return () => window.removeEventListener('cart-count', handleCount)
  }, [])

  return (
    <>
      {/* HEADER / LOGO */}
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

      {/* BANNER ON STORE PAGE */}
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

      {/* NAV */}
      <nav className="main-nav" aria-label="Main Navigation">
        <div className="main-nav-inner">

          {/* STORE */}
          <Link
            to="/store"
            className={
              location.pathname === '/store' || location.pathname === '/'
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Store
          </Link>

          {/* CONTACT */}
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

          {/* CART (with live count) */}
          <button
            type="button"
            className="nav-link"
            onClick={() => {
              if (location.pathname !== '/store') {
                navigate('/store')
                setTimeout(() => {
                  window.dispatchEvent(new Event('open-cart'))
                }, 50)
              } else {
                window.dispatchEvent(new Event('open-cart'))
              }
            }}
          >
            🛒 Cart{navCartCount > 0 ? ` (${navCartCount})` : ''}
          </button>

        </div>
      </nav>

      {/* PAGE CONTENT */}
      <Outlet />

      {/* FOOTER */}
      <Footer />
    </>
  )
}
