import React, { useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Store() {
  // Track quantity per product
  const [qty, setQty] = useState(() =>
    Object.fromEntries(PRODUCTS.map(p => [p.id, 0]))
  )

  const fmt = n => '$' + n.toFixed(2)

  // Subtotal from items
  const subtotal = useMemo(
    () =>
      PRODUCTS.reduce(
        (sum, p) => sum + (qty[p.id] || 0) * p.price,
        0
      ),
    [qty]
  )

  // Shipping:
  // > $150 = free
  // > $0 and <= $150 = $15
  // 0 subtotal = $0
  const shipping = useMemo(() => {
    if (subtotal === 0) return 0
    return subtotal > 150 ? 0 : 15
  }, [subtotal])

  const grand = subtotal + shipping

  // Venmo pay link (uses grand total incl. shipping)
  const payHref = useMemo(() => {
    const base = 'https://account.venmo.com/u/Ryanharper38'
    if (grand <= 0) return base

    const params = new URLSearchParams({
      amount: grand.toFixed(2),
      note: 'PeptideStream Order - Research Use Only'
    })

    return `${base}?${params.toString()}`
  }, [grand])

  const inc = id => {
    setQty(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }))
    setEmailSubmitted(false)
  }

  const dec = id => {
    setQty(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }))
    setEmailSubmitted(false)
  }

  // Track whether the user has submitted the order via email
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    const form = e.currentTarget
    const agree = form.querySelector('#agree')?.checked

    if (!agree) {
      alert(
        'You must confirm research use only and agreement to the Terms & Conditions of Sale.'
      )
      return
    }

    const phone =
      document.getElementById('phone')?.value?.trim() || ''
    const address =
      document.getElementById('address')?.value?.trim() || ''

    const items = PRODUCTS
      .filter(p => (qty[p.id] || 0) > 0)
      .map(p => ({
        title: p.title,
        price: p.price,
        qty: qty[p.id],
        line: p.price * qty[p.id]
      }))

    if (!items.length) {
      alert('Please add at least one product before submitting.')
      return
    }

    // Build order summary for email
    const lines = []
    lines.push('PeptideStream Order')
    lines.push('-------------------')
    lines.push(`Phone: ${phone}`)
    lines.push('Address:')
    lines.push(address)
    lines.push('')
    lines.push('Items:')
    items.forEach(i => {
      lines.push(
        `- ${i.title} x ${i.qty} @ $${i.price.toFixed(
          2
        )} = $${i.line.toFixed(2)}`
      )
    })
    lines.push('')
    lines.push(`Subtotal: ${fmt(subtotal)}`)
    lines.push(`Shipping: ${fmt(shipping)}`)
    lines.push(`Total:    ${fmt(grand)}`)
    lines.push('')
    lines.push(
      'I confirm I am 21+ and purchasing for lawful laboratory research use only. I agree to the Terms & Conditions of Sale.'
    )

    const recipient = 'peptidestream@gmail.com'
    const subject = encodeURIComponent('New PeptideStream Order')
    const body = encodeURIComponent(lines.join('\n'))
    const mailto = `mailto:${encodeURIComponent(
      recipient
    )}?subject=${subject}&body=${body}`

    // Open default mail client
    const a = document.createElement('a')
    a.href = mailto
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // Try to copy summary for safety
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
    } catch (_) {
      // ignore if not available
    }

    // Mark that the user submitted via email (enables Venmo)
    setEmailSubmitted(true)

    alert(
      'Order summary prepared. If your email app did not open automatically, please paste the copied summary into an email to peptidestream@gmail.com. Venmo payment will now be enabled for this order.'
    )
  }

  return (
    <main className="container">
      <h1 className="title">PeptideStream</h1>
      <p className="tagline">
        Laboratory research-use only. Not for human consumption.
      </p>

      {/* ⬇️ NEW EXPLANATION BLOCK GOES HERE */}
      <div
        className="notice-card"
        style={{
          margin: '12px 0 18px',
          padding: '14px 18px',
          background: 'rgba(15,23,42,0.6)',
          border: '1px solid var(--line)',
          borderRadius: '12px',
          fontSize: '14px',
          lineHeight: 1.5,
          color: 'var(--muted)'
        }}
      >
        <strong style={{ color: 'var(--text)' }}>
          Why We Use Email Ordering & Payment Links
        </strong>
        <br />
        <br />
        Due to current U.S. banking and processor restrictions on
        peptide-based research materials, PeptideStream cannot
        offer direct credit or debit card checkout at this time.
        To stay compliant, all orders are first submitted through
        our email order system.
        <br />
        <br />
        After we receive your order, we will email you with
        approved payment options and a secure link to pay your
        total.
        <br />
        <br />
        For questions or help at any time, contact us at{' '}
        <span style={{ color: 'var(--accent)' }}>
          <a href="mailto:peptidestream@gmail.com" style={{ color: 'var(--accent)' }}>
            peptidestream@gmail.com
          </a>
        </span>
        .
      </div>
      {/* ⬆️ END NEW BLOCK */}

      <form className="card" onSubmit={handleSubmit}>
        <h2>Order Form</h2>

        <div className="field-row">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(555) 555-5555"
            required
          />
        </div>

        <div className="field-row">
          <label htmlFor="address">Shipping Address</label>
          <textarea
            id="address"
            name="address"
            rows="3"
            placeholder="Name, Street, City, State, ZIP"
            required
          />
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
          <div className="line">
            <span>Subtotal</span>
            <span id="subtotal">{fmt(subtotal)}</span>
          </div>
          <div className="line">
            <span>Shipping</span>
            <span id="shipping">{fmt(shipping)}</span>
          </div>
          <div className="line total">
            <span>Total</span>
            <span id="grandtotal">{fmt(grand)}</span>
          </div>
        </div>

        <label
          htmlFor="agree"
          className="agree-line"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            fontSize: 12,
            color: 'var(--muted)',
            marginTop: 12
          }}
        >
          <input
            id="agree"
            type="checkbox"
            required
            style={{ marginTop: 2 }}
          />
          <span>
            I confirm I am 21+ and purchasing solely for lawful
            laboratory research use, and I agree to the{' '}
            <a
              href="/terms"
              target="_blank"
              className="underline"
            >
              Terms &amp; Conditions of Sale
            </a>
            .
          </span>
        </label>

        <div className="actions">
          <button
            type="submit"
            className="btn pay"
            style={{
              background:
                'linear-gradient(135deg,#10b981,#059669)'
            }}
          >
            Submit Order via Email
          </button>

          <a
            className="btn pay"
            href={grand > 0 && emailSubmitted ? payHref : '#'}
            id="payNowBtn"
            target="_blank"
            rel="noopener"
            aria-disabled={grand <= 0 || !emailSubmitted}
            onClick={e => {
              if (grand <= 0) {
                e.preventDefault()
                alert('Add at least one product to enable Venmo payment.')
                return
              }
              if (!emailSubmitted) {
                e.preventDefault()
                alert('Please submit your order via email first. After submitting, you can use the Venmo pay link.')
              }
            }}
          >
            {emailSubmitted ? 'Pay Now with Venmo' : 'Pay Now with Venmo (submit order via email first)'}
          </a>
        </div>
      </form>

      <section className="info">
        <p className="global-disclaimer">
          All products are for laboratory research-use only. Not
          for human consumption, nor medical, veterinary, or
          household uses. See{' '}
          <a href="/terms">Terms &amp; Conditions</a>.
        </p>
      </section>
    </main>
  )
}
