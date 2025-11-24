import React, { useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Store() {
  // Track quantity per product
  const [qty, setQty] = useState(() =>
    Object.fromEntries(PRODUCTS.map(p => [p.id, 0]))
  )

  const fmt = n => '$' + n.toFixed(2)

  // Subtotal
  const subtotal = useMemo(
    () =>
      PRODUCTS.reduce(
        (sum, p) => sum + (qty[p.id] || 0) * p.price,
        0
      ),
    [qty]
  )

  // Shipping rules
  const shipping = useMemo(() => {
    if (subtotal === 0) return 0
    return subtotal > 150 ? 0 : 15
  }, [subtotal])

  const grand = subtotal + shipping

  // Venmo payment link
  const payHref = useMemo(() => {
    const base = 'https://account.venmo.com/u/Ryanharper38'
    if (grand <= 0) return base

    const params = new URLSearchParams({
      amount: grand.toFixed(2),
      note: 'PeptideStream Order - Research Use Only',
    })

    return `${base}?${params.toString()}`
  }, [grand])

  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const inc = id => {
    setQty(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    setEmailSubmitted(false)
  }

  const dec = id => {
    setQty(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }))
    setEmailSubmitted(false)
  }

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

    const name = document.getElementById('name')?.value?.trim() || ''
    const phone = document.getElementById('phone')?.value?.trim() || ''
    const address = document.getElementById('address')?.value?.trim() || ''
    const email = document.getElementById('email')?.value?.trim() || ''

    const items = PRODUCTS
      .filter(p => (qty[p.id] || 0) > 0)
      .map(p => ({
        title: p.title,
        price: p.price,
        qty: qty[p.id],
        line: p.price * qty[p.id],
      }))

    if (!items.length) {
      alert('Please add at least one product before submitting.')
      return
    }

    const lines = []
    lines.push('PeptideStream Order')
    lines.push('-------------------')
    lines.push(`Name: ${name}`)
    lines.push(`Phone: ${phone}`)
    lines.push(`Email: ${email}`)
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

    const a = document.createElement('a')
    a.href = mailto
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
    } catch (_) {}

    setEmailSubmitted(true)

    alert(
      'Order summary prepared. If your email app did not open, paste the copied summary into an email to peptidestream@gmail.com.'
    )
  }

  return (
    <main className="container">
      <h1 className="title">PeptideStream</h1>
      <p className="tagline">
        Laboratory research-use only. Not for human consumption.
      </p>

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
          color: 'var(--muted)',
        }}
      >
        <strong style={{ color: 'var(--text)' }}>
          Ordering & Payment Process
        </strong>
        <br />
        <br />
        To maintain compliance with payment policies for laboratory
        research-use materials, all PeptideStream orders begin by
        submitting the order form. Once your order is submitted,
        secure payment options (Stripe or Venmo) will become available.
        <br />
        <br />
        For assistance, email us at{' '}
        <a
          href="mailto:peptidestream@gmail.com"
          style={{ color: 'var(--accent)' }}
        >
          peptidestream@gmail.com
        </a>
        .
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <h2>Order Form</h2>

        <div className="field-row">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" type="text" required />
        </div>

        <div className="field-row">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" required />
        </div>

        <div className="field-row">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>

        <div className="field-row">
          <label htmlFor="address">Shipping Address</label>
          <textarea id="address" name="address" rows="3" required />
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
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="line">
            <span>Shipping</span>
            <span>{fmt(shipping)}</span>
          </div>
          <div className="line total">
            <span>Total</span>
            <span>{fmt(grand)}</span>
          </div>
        </div>

        <label
          className="agree-line"
          style={{ marginTop: 12, display: 'flex', gap: 8 }}
        >
          <input id="agree" type="checkbox" required />
          <span>
            I confirm I am 21+ and purchasing solely for lawful
            laboratory research use. I agree to the{' '}
            <a href="/terms" target="_blank">
              Terms &amp; Conditions of Sale
            </a>
            .
          </span>
        </label>

        <div className="actions">
          {/* 1) Submit via email */}
          <button
            type="submit"
            className="btn"
            style={{
              background: 'linear-gradient(135deg,#10b981,#059669)',
            }}
          >
            Submit Order via Email
          </button>

          {/* 2) Stripe payment */}
          <button
            type="button"
            className="btn pay"
            disabled={grand <= 0 || !emailSubmitted}
            onClick={async () => {
              if (grand <= 0) {
                alert('Add at least one product to enable card payment.')
                return
              }
              if (!emailSubmitted) {
                alert('Please submit your order via email first.')
                return
              }

              const name =
                document.getElementById('name')?.value?.trim() || ''
              const email =
                document.getElementById('email')?.value?.trim() || ''
              const phone =
                document.getElementById('phone')?.value?.trim() || ''
              const address =
                document.getElementById('address')?.value?.trim() || ''
              const agreeChecked =
                document.getElementById('agree')?.checked

              if (!agreeChecked) {
                alert(
                  'Please confirm research use only and agreement to the Terms & Conditions before paying.'
                )
                return
              }

              const payloadItems = PRODUCTS.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                qty: qty[p.id] || 0,
              })).filter(i => i.qty > 0)

              if (!payloadItems.length) {
                alert(
                  'Please add at least one product before paying.'
                )
                return
              }

              try {
                const res = await fetch(
                  '/.netlify/functions/create-checkout-session',
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      items: payloadItems,
                      shipping,
                      customer: { name, email, phone, address },
                      researchUseConfirmed: true,
                    }),
                  }
                )

                const data = await res.json()

                if (!res.ok || data.error) {
                  console.error(data.error)
                  alert(
                    'Error creating Stripe checkout session. Please try again or contact support.'
                  )
                  return
                }

                if (!data.url) {
                  alert('Stripe did not return a checkout URL.')
                  return
                }

                // NEW: redirect directly to the session URL
                window.location.href = data.url
              } catch (err) {
                console.error('Stripe payment error', err)
                alert('Unexpected error starting payment.')
              }
            }}
          >
            Pay with Card (Stripe)
          </button>

          {/* 3) Venmo payment */}
          <button
            type="button"
            className="btn"
            disabled={grand <= 0 || !emailSubmitted}
            onClick={() => {
              if (!emailSubmitted) {
                alert(
                  'Please submit your order via email first.'
                )
                return
              }
              if (grand <= 0) {
                alert('Add at least one product before paying.')
                return
              }
              window.open(payHref, '_blank', 'noopener,noreferrer')
            }}
            style={{
              marginTop: 8,
              background: '#3d95ce',
              color: 'white',
              fontWeight: 600,
            }}
          >
            Pay with Venmo @ryanharper38
          </button>
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
