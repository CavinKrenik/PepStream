import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, qty, onInc, onDec }) {
  return (
    <div className="product">
      <div className="prod-head">
        <div className="prod-main">
          <div className="prod-media">
            <img src={product.img} alt={product.title} />
          </div>
          <div className="prod-text">
            <h3>{product.title}</h3>
            <p className="price">
              ${product.price.toFixed(2)}
              {product.badge && (
                <span className="badge">{product.badge}</span>
              )}
            </p>
          </div>
        </div>
        <div className="qty">
          <button type="button" className="btn qty-btn" onClick={onDec}>
            −
          </button>
          <input
            className="qty-input"
            type="number"
            min="0"
            step="1"
            value={qty}
            readOnly
          />
          <button type="button" className="btn qty-btn" onClick={onInc}>
            +
          </button>
        </div>
      </div>

      <p className="disclaimer">
        For laboratory research use only. Not for human consumption, medical,
        veterinary, or household use. All purchases are subject to our{' '}
        <Link to="/terms" className="underline">
          Terms &amp; Conditions of Sale
        </Link>
        .
      </p>

      {product.coa && (
        <p className="coa">
          <a
            href={product.coa}
            target="_blank"
            rel="noopener"
            className="underline"
          >
            View Certificate of Analysis
          </a>
        </p>
      )}
    </div>
  )
}
