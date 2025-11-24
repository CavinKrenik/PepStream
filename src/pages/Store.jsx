import React, { useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'

// pause/unpause the store
const SITE_PAUSED = false 

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

  // Read ?status=success / ?status=cancel from URL (for banners)
  const status = useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('status')
  }, [])

  const inc = id => {
    setQty(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const dec = id => {
    setQty(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }))
  }

  // Shared helper: send the order via SendGrid from the form fields
  async function sendOrderEmail({
    showSuccessAlert = false,
    paymentMethod = 'email',
  } = {}) {
    const agree = document.getElementById('agree')?.checked
    if (!agree) {
      alert(
        'You must confirm research use only and agreement to the Terms & Conditions of Sale.'
      )
      throw new Error('terms_not_accepted')
    }

    const name =
      document.getElementById('name')?.value?.trim() || ''
    const phone =
      document.getElementById('phone')?.value?.trim() || ''
    const email =
      document.getElementById('email')?.value?.trim() || ''
    const address =
      document.getElementById('address')?.value?.trim() || ''

    if (!name || !email || !address || !phone) {
      alert(
        'Please fill out name, email, phone, and shipping address.'
      )
      throw new Error('missing_fields')
    }

    const items = PRODUCTS
      .filter(p => (qty[p.id] || 0) > 0)
      .map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        qty: qty[p.id],
        line: p.price * qty[p.id],
      }))

    if (!items.length) {
      alert('Please add at least one product before submitting.')
      throw new Error('no_items')
    }

    const methodLabel =
      paymentMethod === 'stripe'
        ? 'Stripe (card checkout)'
        : paymentMethod === 'venmo'
        ? 'Venmo'
        : 'Email / Manual Payment'

    const lines = []
    lines.push('New PeptideStream order request')
    lines.push('----------------------------------------')
    lines.push(`Name:    ${name}`)
    lines.push(`Email:   ${email}`)
    lines.push(`Phone:   ${phone}`)
    lines.push('Address:')
    lines.push(address)
    lines.push('')
    lines.push(`Payment Method: ${methodLabel}`)
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

    const orderText = lines.join('\n')

    const res = await fetch('/.netlify/functions/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name, phone, email, address },
        items: items.map(i => ({
          id: i.id,
          title: i.title,
          price: i.price,
          qty: i.qty,
        })),
        totals: { subtotal, shipping, grand },
        researchUseConfirmed: true,
        paymentMethod, // extra info for your Netlify function/email
        orderText,
      }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      console.error('Order email error', data.error)
      alert(
        'There was a problem submitting your order. Please try again or email peptidestream@gmail.com.'
      )
      throw new Error(data.error || 'email_failed')
    }

    if (showSuccessAlert) {
      alert(
        'Your order has been submitted to PeptideStream. You can now pay with Stripe, Venmo, or use this email order form by itself.'
      )
    }

    // Return details so Stripe can reuse them
    return { name, phone, email, address }
  }

  // Email-only submit
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await sendOrderEmail({
        showSuccessAlert: true,
        paymentMethod: 'email',
      })
    } catch (err) {
      console.error('handleSubmit error', err)
      // Validation and alerts are already handled inside sendOrderEmail
    }
  }

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
            For assistance or to inquire about research materials,
            email
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

          {/* ✅ SUCCESS / CANCEL BANNERS */}
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
              <strong style={{ display: 'block', marginBottom: 4 }}>
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
              <strong style={{ display: 'block', marginBottom: 4 }}>
                Payment Canceled
              </strong>
              Your Stripe checkout session was canceled before
              completion. You may start payment again using the Stripe
              or Venmo buttons below, or reach out to{' '}
              <a
                href="mailto:peptidestream@gmail.com"
                style={{ color: 'var(--accent)' }}
              >
                peptidestream@gmail.com
              </a>{' '}
              if you need assistance.
            </div>
          )}

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
              color: 'var(--muted)',
            }}
          >
            <strong style={{ color: 'var(--text)' }}>
              Ordering & Payment Process
            </strong>
            <br />
            <br />
            Fill out the order form once, then choose how you would like
            to complete your order:
            <br />
            <br />
            • <strong>Pay with Card (Stripe)</strong> – your order
            details are emailed to PeptideStream and you&apos;re taken to
            secure card checkout.
            <br />
            • <strong>Pay with Venmo</strong> – your order details are
            emailed and your Venmo payment window opens.
            <br />
            • <strong>Submit Order via Email</strong> – sends the order
            form to PeptideStream without starting payment (for manual
            payment arrangements).
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
                <a href="/terms" target="_blank" rel="noreferrer">
                  Terms &amp; Conditions of Sale
                </a>
                .
              </span>
            </label>

            <div className="actions">
              {/* 1) Stripe payment (auto-sends order email) */}
              <button
                type="button"
                className="btn pay"
                disabled={grand <= 0}
                onClick={async () => {
                  if (grand <= 0) {
                    alert(
                      'Add at least one product to enable card payment.'
                    )
                    return
                  }

                  let customer
                  try {
                    // Send order email silently (no extra popup here)
                    customer = await sendOrderEmail({
                      showSuccessAlert: false,
                      paymentMethod: 'stripe',
                    })
                  } catch (err) {
                    console.error(
                      'Order email failed before Stripe',
                      err
                    )
                    // sendOrderEmail already showed the error
                    return
                  }

                  const { name, email, phone, address } = customer

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
                      console.error(
                        'Stripe session error',
                        data.error
                      )
                      alert(
                        'Error creating Stripe checkout session. Please try again or contact support.'
                      )
                      return
                    }

                    if (!data.url) {
                      alert('Stripe did not return a checkout URL.')
                      return
                    }

                    // Redirect directly to Checkout
                    window.location.href = data.url
                  } catch (err) {
                    console.error('Stripe payment error', err)
                    alert('Unexpected error starting payment.')
                  }
                }}
              >
                Pay with Card (Stripe)
              </button>

              {/* 2) Venmo payment (auto-sends order email) */}
              <button
                type="button"
                className="btn"
                disabled={grand <= 0}
                onClick={async () => {
                  if (grand <= 0) {
                    alert(
                      'Add at least one product before paying.'
                    )
                    return
                  }

                  try {
                    await sendOrderEmail({
                      showSuccessAlert: false,
                      paymentMethod: 'venmo',
                    })
                  } catch (err) {
                    console.error(
                      'Order email failed before Venmo',
                      err
                    )
                    return
                  }

                  window.open(
                    payHref,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }}
                style={{
                  marginTop: 8,
                  background: '#3d95ce',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                Pay with Venmo
              </button>

              {/* 3) Email-only order (no payment) */}
              <button
                type="submit"
                className="btn"
                style={{
                  marginTop: 10,
                  background:
                    'linear-gradient(135deg,#10b981,#059669)',
                }}
              >
                Submit Order via Email
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
        </>
      )}
    </main>
  )
}
