import React, { useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import { useCart } from '../context/CartContext'

// pause/unpause the store
const SITE_PAUSED = false

export default function Store() {
  const { qty, inc, dec } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')

  // Read ?status=success / ?status=cancel from URL (for banners)
  const status = useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('status')
  }, [])

  // Categories
  const categories = useMemo(() => {
    const set = new Set()
    PRODUCTS.forEach(p => {
      if (p.category) set.add(p.category)
    })
    return ['All', ...Array.from(set)]
  }, [])

  // Products filtered by category
  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter(
        p =>
          activeCategory === 'All' ||
          p.category === activeCategory
      ),
    [activeCategory]
  )

  return (
    <main className="container">
      {/* 🔒 PAUSE MODE UI */}
      {SITE_PAUSED ? (
        <div
          style={{
            padding: '60px',
            marginTop: '40px',
            textAlign: 'center',
            background: '#0f172a',
            borderRadius: '12px',
            color: 'white',
          }}
        >
          <h1 className="title" style={{ marginBottom: '12px' }}>
            PeptideStream
          </h1>
          <p className="tagline" style={{ marginBottom: '28px' }}>
            Laboratory research-use only. Not for human consumption.
          </p>
          <h2 style={{ marginBottom: '10px' }}>
            The PeptideStream shop is temporarily paused
          </h2>
          <p style={{ marginBottom: '10px' }}>
            We are currently updating the store and processing orders
            offline.
          </p>
          <p>
            For assistance or to inquire about research materials, email
            <a
              href="mailto:peptidestream@gmail.com"
              style={{ color: '#34d399', marginLeft: '4px' }}
            >
              peptidestream@gmail.com
            </a>
            .
          </p>
        </div>
      ) : (
        <>
          <h1 className="title">PeptideStream</h1>
          <p className="tagline">
            Laboratory research-use only. Not for human consumption.
          </p>

          {/* SUCCESS / CANCEL BANNERS (Stripe) */}
          {status === 'success' && (
            <div
              style={{
                margin: '10px 0 16px',
                padding: '12px 16px',
                borderRadius: '10px',
                background:
                  'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(5,150,105,0.25))',
                border: '1px solid rgba(16,185,129,0.7)',
                color: 'var(--text)',
                fontSize: 14,
              }}
            >
              <strong
                style={{
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                Payment Successful
              </strong>
              Your payment has been processed successfully. Your order
              details will be reviewed and verified as research-use-only
              materials. If you have any questions about your order,
              please contact{' '}
              <a
                href="mailto:peptidestream@gmail.com"
                style={{ color: 'var(--accent)' }}
              >
                peptidestream@gmail.com
              </a>
              .
            </div>
          )}

          {status === 'cancel' && (
            <div
              style={{
                margin: '10px 0 16px',
                padding: '12px 16px',
                borderRadius: '10px',
                background:
                  'linear-gradient(135deg, rgba(248,187,89,0.18), rgba(245,158,11,0.18))',
                border: '1px solid rgba(245,158,11,0.7)',
                color: 'var(--text)',
                fontSize: 14,
              }}
            >
              <strong
                style={{
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                Payment Canceled
              </strong>
              Your Stripe checkout session was canceled before
              completion. You may start payment again using the Stripe
              or Venmo buttons inside your cart, or reach out to{' '}
              <a
                href="mailto:peptidestream@gmail.com"
                style={{ color: 'var(--accent)' }}
              >
                peptidestream@gmail.com
              </a>{' '}
              if you need assistance.
            </div>
          )}

          {/* Product selection */}
          <section className="card">
            <h2>Order Peptides</h2>

            <h3
              style={{
                marginTop: 16,
                marginBottom: 4,
              }}
            >
              Select Products
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: 'var(--muted)',
                marginBottom: 8,
              }}
            >
              Use the + / – buttons on each product card to add items to
              your cart. When you&apos;re ready, open your cart to
              review your order and choose a payment method.
            </p>

            {/* Category filters */}
            {categories.length > 1 && (
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={
                      cat === activeCategory
                        ? 'category-pill active'
                        : 'category-pill'
                    }
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="products">
              {filteredProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  qty={qty[p.id] || 0}
                  onInc={() => inc(p.id)}
                  onDec={() => dec(p.id)}
                />
              ))}
            </div>
          </section>

          <section className="info">
            <p className="global-disclaimer">
              All products are for laboratory research-use only. Not for
              human consumption, nor medical, veterinary, or household
              uses. See <a href="/terms">Terms &amp; Conditions</a>.
            </p>
          </section>

          {/* 🛒 CART DRAWER */}
          <CartDrawer />
        </>
      )}
    </main>
  )
}
