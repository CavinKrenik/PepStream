import React from 'react'

export default function Refund() {
  return (
    <main className="container">
      <h1 className="title">Refund Policy</h1>
      <p className="tagline">Last updated: 2025</p>

      <div className="card" style={{ lineHeight: 1.6 }}>
        <p>
          PeptideStream supplies research-use-only materials. Because these items cannot be restocked or
          resold, <strong>all sales are final</strong>.
        </p>

        <h2>Eligible for Replacement</h2>
        <ul>
          <li>Wrong product received</li>
          <li>Damaged shipment</li>
          <li>Lost package</li>
          <li>Verified quality or COA discrepancy</li>
        </ul>

        <h2>Not Eligible</h2>
        <ul>
          <li>Opened or reconstituted products</li>
          <li>Buyer's remorse</li>
          <li>Use outside lawful research</li>
        </ul>

        <h2>How to Request Support</h2>
        <p>
          Email support with photos and your order summary:<br />
          <strong>peptidestream@gmail.com</strong>
        </p>

        <h2>Shipping Refunds</h2>
        <p>
          Shipping fees are non-refundable unless a shipment was lost or incorrect items were sent.
        </p>
      </div>
    </main>
  )
}
