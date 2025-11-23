import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} PeptideStream. All products are for
        laboratory research use only. Not for human consumption.
      </p>
      <nav className="footer-nav" style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Link to="/terms">Terms &amp; Conditions</Link>
        <span>·</span>
        <Link to="/privacy">Privacy Policy</Link>
        <span>·</span>
        <Link to="/refund">Refund Policy</Link>
        <span>·</span>
        <Link to="/disclaimer">Research Use Only</Link>
        <span>·</span>
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  )
}
