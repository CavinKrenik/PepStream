import React, { useMemo, useState } from 'react'
import { PRODUCTS } from './data/products'
import ProductCard from './components/ProductCard'

export default function App(){
  const [qty, setQty] = useState(() => Object.fromEntries(PRODUCTS.map(p => [p.id, 0])))

  const subtotal = useMemo(() => {
    return PRODUCTS.reduce((sum, p) => sum + (qty[p.id] || 0) * p.price, 0)
  }, [qty])
  const shipping = 0.00
  const grand = subtotal + shipping

  const payHref = useMemo(() => {
    const base = '#'
    const url = new URL(base, window.location.origin)
    url.searchParams.set('amount', grand.toFixed(2))
    return url.toString()
  }, [grand])

  function inc(id){ setQty(q => ({...q, [id]: (q[id] || 0) + 1})) }
  function dec(id){ setQty(q => ({...q, [id]: Math.max(0, (q[id] || 0) - 1)})) }

  function format(n){ return '$' + n.toFixed(2) }

  async function handleSubmit(e){
    e.preventDefault()
    const phone = document.getElementById('phone')?.value?.trim() || ''
    const address = document.getElementById('address')?.value?.trim() || ''

    const items = PRODUCTS
      .filter(p => (qty[p.id] || 0) > 0)
      .map(p => ({ title: p.title, price: p.price, qty: qty[p.id], line: p.price * qty[p.id] }))

    if (items.length === 0){
      alert('Please add at least one product quantity before submitting.')
      return
    }

    const lines = []
    lines.push('PeptideStream Order')
    lines.push('-------------------')
    lines.push(`Phone: ${phone}`)
    lines.push('Address:')
    lines.push(address)
    lines.push('')
    lines.push('Items:')
    items.forEach(i => lines.push(`- ${i.title} x ${i.qty} @ $${i.price.toFixed(2)} = $${i.line.toFixed(2)}`))
    lines.push('')
    lines.push(`Subtotal: ${format(subtotal)}`)
    lines.push(`Shipping: ${format(shipping)}`)
    lines.push(`Total:    ${format(grand)}`)
    lines.push('')
    lines.push('Disclaimer: All items are for laboratory research-use only. Not for human consumption.')

    const subject = encodeURIComponent('New PeptideStream Order')
    const body = encodeURIComponent(lines.join('\n'))
    const recipient = 'ryanharper38@gmail.com' // change if you want to test to yourself
    const href = `mailto:${encodeURIComponent(recipient)}?subject=${subject}&body=${body}`

    // robust mailto trigger via anchor
    const a = document.createElement('a')
    a.href = href
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()

    try { await navigator.clipboard.writeText(lines.join('\n')) } catch(e){}

    setTimeout(() => {
      const ok = confirm(`If your email app did not open, click OK to copy your order and send it to ${recipient}.`)
      if (ok){
        try {
          navigator.clipboard.writeText(lines.join('\n'))
          alert(`Order copied. Paste into an email to ${recipient}.`)
        } catch (err) {
          window.prompt(`Copy your order and email to ${recipient}:`, lines.join('\n'))
        }
      }
    }, 400)
  }

  return (
    <>
      <header className="site-header">
        <div className="logo-wrap">
          <img className="logo" src="/assets/logo.png" alt="PeptideStream Logo" />
        </div>
      </header>

      <div className="banner">
        <img src="/assets/ad.png" alt="Promo Banner" />
      </div>

      <main className="container">
        <h1 className="title">PeptideStream</h1>
        <p className="tagline">Laboratory research-use only. Not for human consumption.</p>

        <form className="card" onSubmit={handleSubmit}>
          <h2>Order Form</h2>

          <div className="field-row">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" placeholder="(555) 555-5555" required />
          </div>

          <div className="field-row">
            <label htmlFor="address">Shipping Address</label>
            <textarea id="address" name="address" rows="3" placeholder="Street, City, State, ZIP" required />
          </div>

          <div className="products">
            {PRODUCTS.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                qty={qty[p.id] || 0}
                onInc={() => inc(p.id)}
                onDec={() => dec(p.id)}
              />
            ))}
          </div>

          <div className="totals">
            <div className="line"><span>Subtotal</span><span id="subtotal">{format(subtotal)}</span></div>
            <div className="line"><span>Shipping</span><span id="shipping">{format(shipping)}</span></div>
            <div className="line total"><span>Total</span><span id="grandtotal">{format(grand)}</span></div>
          </div>

          <div className="actions">
            <a className="btn pay" href={payHref} id="payNowBtn" rel="noopener" aria-disabled={grand<=0}>Pay Now</a>
            <button type="submit" className="btn pay" style={{background:'linear-gradient(135deg,#10b981,#059669)'}}>Submit Order via Email</button>
          </div>
        </form>

        <section className="info">
          <p className="global-disclaimer">
            All products are for laboratory research-use only. Not for human consumption, nor medical, veterinary, or household uses. See <a href="/terms">Terms &amp; Conditions</a>.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} PeptideStream</p>
        <nav><a href="/terms">Terms &amp; Conditions</a></nav>
      </footer>
    </>
  )
}
