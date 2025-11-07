import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, qty, onInc, onDec }) {
  const [open, setOpen] = useState(false)

  const title = product.title || product.name
  const img = product.img || product.image
  const badge = product.badge
  const coa = product.coa
  const details =
    product.details ||
    'High-purity research peptide material intended solely for lawful laboratory research by qualified professionals.'
  const disclaimer =
    product.disclaimer ||
    'For laboratory research use only. Not for human consumption or use in medical, veterinary, or household applications. All sales are subject to our Terms & Conditions of Sale.'

  const toggle = () => setOpen(v => !v)

  return (
    <div
      className={`product ${open ? 'product-open' : ''}`}
      onClick={toggle}
    >
      <div className="prod-head">
        <div className="prod-main">
          <div className="prod-media">
            {img && <img src={img} alt={title} />}
          </div>
          <div className="prod-text">
            <h3>{title}</h3>
            <p className="price">
              ${product.price.toFixed(2)}
              {badge && <span className="badge">{badge}</span>}
            </p>
            <button
              type="button"
              className="more-link"
              onClick={e => {
                e.stopPropagation()
                toggle()
              }}
            >
              {open ? 'Hide details ▲' : 'View details ▼'}
            </button>
          </div>
        </div>

        {/* qty controls (don't toggle card when using them) */}
        <div
          className="qty"
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            className="btn qty-btn"
            onClick={onDec}
          >
            −
          </button>
          <input
            type="number"
            className="qty-input"
            min="0"
            value={qty}
            readOnly
          />
          <button
            type="button"
            className="btn qty-btn"
            onClick={onInc}
          >
            +
          </button>
        </div>
      </div>

      {/* short always-on generic disclaimer */}
      <p className="disclaimer">
        For laboratory research use only. Not for human consumption, medical,
        veterinary, or household use. All purchases are subject to our{' '}
        <Link to="/terms">Terms &amp; Conditions of Sale</Link>.
      </p>

      {/* expanded content: product-specific details + disclaimer + COA */}
      {open && (
        <div className="product-details">
          {details && <p>{details}</p>}
          {disclaimer && (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--muted)',
                marginTop: '4px',
              }}
            >
              {disclaimer}
            </p>
          )}
          {coa && (
            <p className="coa">
              <a
                href={coa}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Certificate of Analysis
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
