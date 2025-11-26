import React from 'react'

export default function Contact() {
  return (
    <main className="container">
      <h1 className="title">Contact PeptideStream</h1>

      <div className="card" style={{ marginTop: 12, lineHeight: 1.6 }}>
        <p>
          For order support, verification, product documentation, or general
          inquiries, please reach out using the contact details below.
        </p>

        <h2 style={{ marginTop: 18 }}>Email</h2>
        <p>
          <a href="mailto:peptidestream@gmail.com">
            peptidestream@gmail.com
          </a>
        </p>

        <h2 style={{ marginTop: 18 }}>Mailing Address</h2>
        <p>
          Peptide Stream<br />
          P.O. box 2492<br />
          Olympia, WA 98507<br />
          United States
        </p>

        <h2 style={{ marginTop: 18 }}>Business Hours</h2>
        <p>
          Monday–Friday: 9:00 AM – 5:00 PM PST<br />
          Saturday–Sunday: Closed
        </p>

        <h2 style={{ marginTop: 18 }}>Important Notice</h2>
        <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
          PeptideStream does <strong>not</strong> offer medical advice,
          dosage guidance, or any information related to human use.
          All products are sold strictly for lawful laboratory research-use only.
        </p>

        <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: 12 }}>
          For fastest support, please email us directly.
          A PeptideStream representative will respond promptly.
        </p>
      </div>
    </main>
  )
}
