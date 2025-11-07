import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} PeptideStream. All products are for
        laboratory research use only. Not for human consumption.
      </p>
      <nav className="footer-nav">
        <Link to="/terms">Terms &amp; Conditions of Sale</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  )
}
