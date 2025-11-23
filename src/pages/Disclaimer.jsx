import React from 'react'

export default function Disclaimer() {
  return (
    <main className="container">
      <h1 className="title">Disclaimer</h1>
      <p className="tagline">Last updated: 2025</p>

      <div className="card" style={{ lineHeight: 1.6 }}>
        <p>
          The information and products listed on this site are provided for laboratory
          research use only. They are not intended for human or animal
          therapeutic use, diagnostic procedures, or household purposes.
        </p>

        <p>
          PeptideStream makes no warranties regarding the suitability or fitness of
          any product for any particular purpose. Purchasers assume all responsibility
          for compliance with applicable laws, regulations, and institutional policies
          governing the use of research materials.
        </p>

        <p>
          For questions, contact: <strong>peptidestream@gmail.com</strong>
        </p>
      </div>
    </main>
  )
}
