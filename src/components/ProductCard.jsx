import React from 'react'

export default function ProductCard({ product, qty, onInc, onDec }) {
  return (
    <div className="product">
      <div className="prod-head">
        <div className="prod-main">
          <div className="prod-media"><img src={product.img} alt={product.title} /></div>
          <div className="prod-text">
            <h3>{product.title}</h3>
            <p className="price" data-price={product.price}>${product.price.toFixed(2)} {product.badge && <span className="badge">{product.badge}</span>}</p>
          </div>
        </div>
        <div className="qty">
          <button type="button" className="btn qty-btn" onClick={onDec}>−</button>
          <input className="qty-input" type="number" min="0" step="1" value={qty} onChange={()=>{}} readOnly />
          <button type="button" className="btn qty-btn" onClick={onInc}>+</button>
        </div>
      </div>
      <p className="disclaimer">
        <a href="/terms" target="_blank" rel="noopener">{product.disclaimer}</a>
      </p>
      {product.coa && <p className="coa"><a href={product.coa} target="_blank" rel="noopener">View Certificate of Analysis</a></p>}
    </div>
  )
}
