import React, { useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
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
      note: 'PeptideStream Order - Research Use Only'
    })

    return `${base}?${params.toString()}`
  }, [grand])

  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

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
        line: p.price * qty[p.id]
      }))

    if (!items.length) {
      alert('Please add at least one product before submitting.')
      return
    }

    // Build order summary
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

    // Open email client
    const a = document.createElement('a')
    a.href = mailto
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
    } catch (_) { }

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

      {/* EXPLANATION CARD */}
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
        To maintain compliance with payment policies for laboratory research-use materials, all orders begin with a submitted order form. After submitting, you may complete payment through Stripe or Venmo.
        <br />
        <br />
        After your order is received, you will be able to pay via
        Stripe or Venmo.
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <h2>Order Form</h2>

        {/* FIELDS */}
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

        {/* TOTALS */}
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

        {/* AGREEMENT CHECKBOX */}
        <label className="agree-line" style={{ marginTop: 12 }}>
          <input id="agree" type="checkbox" required />
          <span>
            I confirm I am 21+ and purchasing solely for lawful
            laboratory research use. I agree to the{' '}
            <a href="/terms" target="_blank">
              Terms & Conditions of Sale
            </a>
            .
          </span>
        </label>

        {/* BUTTON ORDER FIXED */}
        <div className="actions">

          {/* FIRST: Submit via Email */}
          <button
            type="submit"
            className="btn"
            style={{
              background: 'linear-gradient(135deg,#10b981,#059669)'
            }}
          >
            Submit Order via Email
          </button>

          {/* SECOND: Stripe */}
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

              // Read customer info from the form so Stripe gets the same data
              const name = document.getElementById('name')?.value?.trim() || ''
              const email = document.getElementById('email')?.value?.trim() || ''
              const phone = document.getElementById('phone')?.value?.trim() || ''
              const address = document.getElementById('address')?.value?.trim() || ''
              const agreeChecked = document.getElementById('agree')?.checked

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
                alert('Please add at least one product before paying.')
                return
              }

              try {
                const stripe = await stripePromise
                const res = await fetch('/.netlify/functions/create-checkout-session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    items: payloadItems,
                    shipping,
                    customer: {
                      name,
                      email,
                      phone,
                      address,
                    },
                    researchUseConfirmed: true,
                  }),
                })

                const data = await res.json()

                if (!res.ok || data.error) {
                  console.error(data.error)
                  alert('Error creating Stripe checkout session.')
                  return
                }

                const { error } = await stripe.redirectToCheckout({ sessionId: data.id })
                if (error) alert(error.message)
              } catch (err) {
                console.error('Stripe payment error', err)
                alert('Unexpected error starting payment.')
              }
            }}
          >
            Pay with Card (Stripe)
          </button>


          {/* THIRD: Venmo */}
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
              window.open(payHref, '_blank')
            }}
            style={{
              marginTop: 8,
              background: '#3d95ce',
              color: 'white',
              fontWeight: 600
            }}
          >
            Pay with Venmo
          </button>
        </div>
      </form>
    </main>
  )
}
