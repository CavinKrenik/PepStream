import React from 'react'

export default function Privacy() {
  return (
    <main className="container">
      <h1 className="title">Privacy Policy</h1>
      <p className="tagline">Last updated: 2025</p>

      <div className="card" style={{ lineHeight: 1.6 }}>
        <h2>Information We Collect</h2>
        <p>We only collect information voluntarily submitted by customers, including:</p>
        <ul>
          <li>Phone number</li>
          <li>Shipping address</li>
          <li>Order details</li>
          <li>Email address (from submitted orders)</li>
        </ul>

        <p>
          PeptideStream does <strong>not</strong> collect credit card numbers, medical information, or
          sensitive personal data.
        </p>

        <h2>How We Use Your Information</h2>
        <p>Your information is used solely to:</p>
        <ul>
          <li>Process and ship your order</li>
          <li>Provide order communication and support</li>
          <li>Ensure research-use compliance</li>
        </ul>

        <h2>Data Sharing</h2>
        <p>
          PeptideStream does not sell or share your information. We do not use analytics, trackers, or
          third-party data processors.
        </p>

        <h2>Security</h2>
        <p>
          Orders are processed entirely via secure email communication. No personal information is stored in a
          database on our site.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request a copy or deletion of your submitted information by emailing:<br />
          <strong>peptidestream@gmail.com</strong>
        </p>
      </div>
    </main>
  )
}
