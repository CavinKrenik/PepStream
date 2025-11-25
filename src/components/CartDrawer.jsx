import React, { useMemo } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import CheckoutForm from './CheckoutForm'

export default function CartDrawer() {
    const {
        cartOpen,
        closeCart,
        cartItems,
        inc,
        dec,
        clearItem,
        clearCart,
        subtotal,
        shipping,
        grand,
    } = useCart()

    const { addToast } = useToast()

    const fmt = n => '$' + n.toFixed(2)

    // Venmo web payment link
    const payHref = useMemo(() => {
        const base = 'https://account.venmo.com/u/Ryanharper38'
        if (grand <= 0) return base

        const params = new URLSearchParams({
            amount: grand.toFixed(2),
            note: 'PeptideStream Order - Research Use Only',
        })

        return `${base}?${params.toString()}`
    }, [grand])

    // Venmo deep link
    const venmoDeepLink = useMemo(() => {
        const username = 'Ryanharper38'
        if (grand <= 0) return `venmo://users/${username}`

        const amount = grand.toFixed(2)
        const note = encodeURIComponent('PeptideStream Order - Research Use Only')

        return `venmo://paycharge?txn=pay&recipients=${username}&amount=${amount}&note=${note}`
    }, [grand])

    // Shared helper: send the order via SendGrid
    async function sendOrderEmail({
        showSuccessAlert = false,
        paymentMethod = 'email',
    } = {}) {
        const agree = document.getElementById('agree')?.checked
        if (!agree) {
            addToast('You must confirm research use only and agreement to Terms.', 'error')
            throw new Error('terms_not_accepted')
        }

        const name = document.getElementById('name')?.value?.trim() || ''
        const phone = document.getElementById('phone')?.value?.trim() || ''
        const email = document.getElementById('email')?.value?.trim() || ''
        const address = document.getElementById('address')?.value?.trim() || ''

        if (!name || !email || !address || !phone) {
            addToast('Please fill out all contact and shipping fields.', 'error')
            throw new Error('missing_fields')
        }

        if (!cartItems.length) {
            addToast('Please add at least one product.', 'error')
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
        cartItems.forEach(i => {
            lines.push(
                `- ${i.title} x ${i.qty} @ $${i.price.toFixed(2)} = $${i.line.toFixed(2)}`
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
                items: cartItems.map(i => ({
                    id: i.id,
                    title: i.title,
                    price: i.price,
                    qty: i.qty,
                })),
                totals: { subtotal, shipping, grand },
                researchUseConfirmed: true,
                paymentMethod,
                orderText,
            }),
        })

        const data = await res.json()

        if (!res.ok || data.error) {
            console.error('Order email error', data.error)
            addToast('Problem submitting order. Please try again.', 'error')
            throw new Error(data.error || 'email_failed')
        }

        if (showSuccessAlert) {
            addToast('Order submitted successfully!', 'success')
        }

        return { name, phone, email, address }
    }

    // Email-only submit
    async function handleSubmit(e) {
        if (e && e.preventDefault) e.preventDefault()
        try {
            await sendOrderEmail({
                showSuccessAlert: true,
                paymentMethod: 'email',
            })
        } catch (err) {
            // handled in sendOrderEmail
        }
    }

    if (!cartOpen) return null

    return (
        <div className="cart-overlay" onClick={closeCart}>
            <div className="cart-drawer" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <h3>Cart</h3>
                    <button
                        type="button"
                        className="cart-close"
                        onClick={closeCart}
                        aria-label="Close cart"
                    >
                        ×
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <p className="cart-empty">
                        Your cart is empty. Add peptides using the + buttons on the order section.
                    </p>
                ) : (
                    <>
                        <ul className="cart-items">
                            {cartItems.map(item => (
                                <li key={item.id} className="cart-row">
                                    <div className="cart-row-main">
                                        <div className="cart-thumb-wrap">
                                            <img
                                                src={item.img}
                                                alt={item.title}
                                                className="cart-thumb"
                                            />
                                        </div>
                                        <div className="cart-text">
                                            <span className="cart-title">{item.title}</span>
                                            <span className="cart-meta">
                                                {item.qty} × {fmt(item.price)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="cart-row-controls">
                                        <button
                                            type="button"
                                            className="btn qty-btn"
                                            onClick={() => dec(item.id)}
                                        >
                                            –
                                        </button>
                                        <span className="cart-qty">{item.qty}</span>
                                        <button
                                            type="button"
                                            className="btn qty-btn"
                                            onClick={() => inc(item.id)}
                                        >
                                            +
                                        </button>
                                        <span className="cart-line">{fmt(item.line)}</span>
                                        <button
                                            type="button"
                                            className="cart-remove"
                                            onClick={() => clearItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

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

                        <button
                            type="button"
                            className="btn cart-clear"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>

                        <p className="cart-note">
                            Enter your contact and shipping details below, confirm the
                            research-use agreement, then choose a payment option.
                        </p>

                        <CheckoutForm />

                        <div className="actions">
                            {/* 1) Stripe payment */}
                            <button
                                type="button"
                                className="btn pay"
                                disabled={grand <= 0}
                                onClick={async () => {
                                    if (grand <= 0) {
                                        addToast('Add at least one product.', 'error')
                                        return
                                    }

                                    let customer
                                    try {
                                        customer = await sendOrderEmail({
                                            showSuccessAlert: false,
                                            paymentMethod: 'stripe',
                                        })
                                    } catch (err) {
                                        return
                                    }

                                    const { name, email, phone, address } = customer

                                    const payloadItems = cartItems.map(p => ({
                                        id: p.id,
                                        title: p.title,
                                        price: p.price,
                                        qty: p.qty,
                                    }))

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
                                            console.error('Stripe session error', data.error)
                                            addToast('Error creating Stripe session.', 'error')
                                            return
                                        }

                                        if (!data.url) {
                                            addToast('Stripe did not return a checkout URL.', 'error')
                                            return
                                        }

                                        window.location.href = data.url
                                    } catch (err) {
                                        console.error('Stripe payment error', err)
                                        addToast('Unexpected error starting payment.', 'error')
                                    }
                                }}
                            >
                                Pay with Card (Stripe)
                            </button>

                            {/* 2) Venmo payment */}
                            <button
                                type="button"
                                className="btn"
                                disabled={grand <= 0}
                                onClick={async () => {
                                    if (grand <= 0) {
                                        addToast('Add at least one product.', 'error')
                                        return
                                    }

                                    try {
                                        await sendOrderEmail({
                                            showSuccessAlert: false,
                                            paymentMethod: 'venmo',
                                        })
                                    } catch (err) {
                                        return
                                    }

                                    window.location.href = venmoDeepLink
                                    setTimeout(() => {
                                        window.location.href = payHref
                                    }, 800)
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

                            {/* 3) Email-only order */}
                            <button
                                type="button"
                                className="btn"
                                style={{
                                    marginTop: 10,
                                    background: 'linear-gradient(135deg,#10b981,#059669)',
                                }}
                                onClick={() => handleSubmit()}
                            >
                                Submit Order via Email (No Payment)
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
