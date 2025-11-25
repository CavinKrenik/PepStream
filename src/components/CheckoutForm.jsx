import React from 'react'

export default function CheckoutForm({ onSubmit, disabled }) {
    return (
        <div className="cart-form">
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
                <textarea
                    id="address"
                    name="address"
                    rows="3"
                    required
                />
            </div>

            <label
                className="agree-line"
                style={{
                    marginTop: 12,
                    display: 'flex',
                    gap: 8,
                }}
            >
                <input id="agree" type="checkbox" required />
                <span>
                    I confirm I am 21+ and purchasing solely for lawful
                    laboratory research use. I agree to the{' '}
                    <a
                        href="/terms"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Terms &amp; Conditions of Sale
                    </a>
                    .
                </span>
            </label>
        </div>
    )
}
